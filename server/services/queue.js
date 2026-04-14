import nodemailer from 'nodemailer';

// Mock Queue class to maintain compatibility without Redis
class MockQueue {
    constructor(name) {
        this.name = name;
    }
    async add(name, data) {
        console.log(`[MockQueue:${this.name}] Processing ${name} immediately...`);
        if (this.name === 'email-queue') {
            await processEmail(data);
        }
    }
}

async function processEmail(data) {
    const { to, subject, html, config } = data;
    
    const transporter = nodemailer.createTransport({
        host: config.host?.trim(),
        port: parseInt(config.port),
        secure: config.port == 465,
        auth: {
            user: config.user?.trim(),
            pass: config.pass,
        },
        tls: { rejectUnauthorized: false }
    });

    try {
        await transporter.verify(); // Passo 3
        const fromEmail = config.user?.trim();
        const replyToEmail = config.sender_email || 'contato@elance.com.br';

        await transporter.sendMail({
            from: `"${config.sender_name || 'E-Lance'}" <${fromEmail}>`,
            to,
            replyTo: replyToEmail,
            subject,
            html,
        });
        console.log(`[MockWorker] Email sent to ${to}`);
    } catch (err) {
        console.error(`[MockWorker] Send failed for ${to}:`, err.message);
    }
}

export const emailQueue = new MockQueue('email-queue');
export const automationQueue = new MockQueue('automation-queue');

console.log('⚠️ Using Mock Queues (No Redis required)');
