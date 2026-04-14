import { automationQueue, emailQueue } from './queue.js';
import { scrapeLatestAuctions } from './scraperService.js';
import { generateAuctionNewsletter } from './aiMarketingService.js';
import { supabase } from '../lib/supabase.js';

/**
 * Generates and sends the weekly newsletter for a specific unit
 */
export async function runNewsletterAutomation(unitId) {
    console.log(`📰 Starting Newsletter Automation for Unit: ${unitId}`);

    try {
        // 1. Get Unit and AI Config
        const { data: unit } = await supabase
            .from('franchise_units')
            .select('*')
            .eq('id', unitId)
            .single();

        if (!unit || !unit.smtp_config) {
            console.error(`❌ Unit ${unitId} has no SMTP config. Skipping.`);
            return;
        }

        const { data: automation } = await supabase
            .from('email_automations')
            .select('*')
            .eq('franchise_unit_id', unitId)
            .eq('type', 'weekly_auctions')
            .single();

        if (!automation || !automation.active) {
            console.log(`⏸️ Automation for Unit ${unitId} is inactive.`);
            return;
        }

        // 2. Scrape latest auctions (using the dedicated service)
        const scrapeResult = await scrapeLatestAuctions();
        if (!scrapeResult.success || !scrapeResult.auctions || scrapeResult.auctions.length === 0) {
            console.log('⚠️ No auctions found or scrape failed:', scrapeResult.error || 'empty list');
            return;
        }
        const auctions = scrapeResult.auctions;

        // 3. Generate content with AI
        const { html, success, error } = await generateAuctionNewsletter(auctions, unit.ai_config, unit.logo_url);
        if (!success) {
            console.error('❌ AI Generation failed:', error);
            return;
        }

        // 4. Get Recipients from the leads table
        const segmentId = automation.config?.segment_id;
        let query = supabase
            .from('leads')
            .select('name, email')
            .eq('franchise_unit_id', unitId)
            .neq('marketing_status', 'unsubscribed');
        
        if (segmentId && segmentId !== 'all') {
            // Filter by segment using the tags system
            console.log(`Filtering by segment: ${segmentId}`);
            // TODO: Join with SITE_LeadTags for proper segment filtering
        }

        const { data: recipients } = await query;
        if (!recipients || recipients.length === 0) {
            console.log('👥 No recipients found for this unit.');
            return;
        }

        // 5. Enqueue individual emails
        for (const user of recipients) {
            await emailQueue.add('send-newsletter', {
                to: user.email,
                subject: `E-Lance Premium: Oportunidades da Semana`,
                html: html.replace('[Nome]', user.name || 'Cliente'),
                config: unit.smtp_config
            }, {
                attempts: 3,
                backoff: 5000
            });
        }

        console.log(`✅ ${recipients.length} newsletter emails enqueued for unit ${unitId}`);
    } catch (err) {
        console.error('🔥 Error in runNewsletterAutomation:', err);
    }
}

/**
 * Adds a lead to the FlowUp cadence
 * @param {string} leadId 
 */
export async function addToFlowUpCadence(leadId) {
    console.log(`🔄 Adding lead ${leadId} to FlowUp Cadence...`);
    
    // Check if lead already in FlowUp
    const { data: existing } = await supabase.from('SITE_FlowUpLeads').select('id').eq('lead_id', leadId).maybeSingle();
    if (existing) return;

    // Get lead data
    const { data: lead } = await supabase.from('leads').select('*').eq('id', leadId).single();
    if (!lead) return;

    // Create FlowUp record
    await supabase.from('SITE_FlowUpLeads').insert({
        lead_id: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        phase: 'accommodation',
        flowup_status: 'active'
    });

    // Enqueue first email (delayed)
    await emailQueue.add('flowup-welcome', {
        to: lead.email,
        subject: 'Olá! Sentimos sua falta...',
        html: `<h1>Oi ${lead.name}</h1><p>Notamos que ...</p>`,
        config: {} // Fetch from settings
    }, {
        delay: 24 * 60 * 60 * 1000 // 1 day
    });
}
