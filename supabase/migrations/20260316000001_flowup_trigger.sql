
-- Trigger to automatically add leads to SITE_FlowUpLeads when status is 'Rejected' (Perdido)
CREATE OR REPLACE FUNCTION public.handle_lost_lead_flowup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Only trigger when status changes to 'Rejected' (or 'Cold' if that's considered lost)
    IF (NEW.status = 'Rejected' OR NEW.status = 'Cold') AND (OLD.status IS NULL OR OLD.status != NEW.status) THEN
        
        -- Insert into FlowUp if not already there
        INSERT INTO public."SITE_FlowUpLeads" (
            lead_id, 
            name, 
            email, 
            phone, 
            region_city, 
            region_state, 
            phase, 
            flowup_status
        )
        VALUES (
            NEW.id, 
            NEW.name, 
            NEW.email, 
            NEW.phone, 
            NEW.address_city, 
            NEW.address_state, 
            'accommodation', 
            'active'
        )
        ON CONFLICT (lead_id) DO NOTHING;

        -- Record activity
        INSERT INTO public."SITE_FlowUpActivities" (
            flowup_lead_id, 
            type, 
            channel, 
            subject, 
            body
        )
        SELECT id, 'phase_changed', 'system', 'Adicionado ao FlowUp', 'Lead marcado como Perdido/Frio no CRM'
        FROM public."SITE_FlowUpLeads"
        WHERE lead_id = NEW.id;

    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_lost_lead_flowup ON public.leads;
CREATE TRIGGER trg_lost_lead_flowup
    AFTER UPDATE ON public.leads
    FOR EACH ROW EXECUTE PROCEDURE public.handle_lost_lead_flowup();
