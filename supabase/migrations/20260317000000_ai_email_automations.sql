-- AI Email Automations Table
CREATE TABLE IF NOT EXISTS public.email_automations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL, -- e.g. 'weekly_auctions'
    franchise_unit_id UUID REFERENCES public.franchise_units(id),
    active BOOLEAN DEFAULT false,
    config JSONB DEFAULT '{}'::jsonb,
    last_run_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(type, franchise_unit_id)
);

-- RLS
ALTER TABLE public.email_automations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read/write for own franchise" ON public.email_automations
    FOR ALL USING (
        franchise_unit_id IN (
            SELECT franchise_unit_id FROM public.profiles WHERE id = auth.uid()
        )
    );

GRANT ALL ON public.email_automations TO authenticated;
GRANT ALL ON public.email_automations TO service_role;
