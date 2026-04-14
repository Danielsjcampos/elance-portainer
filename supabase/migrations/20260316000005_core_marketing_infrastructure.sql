
-- Additional Core Tables for Marketing Operations
-- Support for Courses, Products (Parts), and Promotions

-- 1. SITE_Products (Lançamentos - Cursos, Peças, etc.)
CREATE TABLE IF NOT EXISTS public."SITE_Products" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT CHECK (category IN ('Curso', 'Peça', 'Serviço', 'Promoção')),
    price NUMERIC(15,2),
    image_url TEXT,
    external_link TEXT, -- Link for purchase/enrollment
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'::jsonb, -- dynamic attributes like 'duration', 'part_number'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. SITE_Automations (Marketing Workflows)
-- Defines "If [event] then [action] after [delay]"
CREATE TABLE IF NOT EXISTS public."SITE_Automations" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    trigger_type TEXT CHECK (trigger_type IN ('new_lead', 'lead_phase_change', 'product_launch', 'manual')),
    trigger_condition JSONB DEFAULT '{}'::jsonb, -- e.g. {"status": "Rejected"}
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public."SITE_AutomationSteps" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    automation_id UUID REFERENCES public."SITE_Automations"(id) ON DELETE CASCADE,
    step_order INT NOT NULL,
    action_type TEXT CHECK (action_type IN ('send_email', 'send_whatsapp', 'wait', 'add_tag')),
    action_params JSONB NOT NULL, -- e.g. {"template_id": "...", "delay_hours": 24}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tracking Post-Clicks (Conversions)
CREATE TABLE IF NOT EXISTS public."SITE_MarketingConversions" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID, -- Optional, source campaign
    lead_id UUID REFERENCES public.leads(id),
    product_id UUID REFERENCES public."SITE_Products"(id),
    value NUMERIC(15,2),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS & Permissions
ALTER TABLE public."SITE_Products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."SITE_Automations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."SITE_AutomationSteps" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."SITE_MarketingConversions" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active products" ON public."SITE_Products" FOR SELECT USING (is_active = true);
CREATE POLICY "Auth manage products" ON public."SITE_Products" FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth manage automations" ON public."SITE_Automations" FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth manage automation steps" ON public."SITE_AutomationSteps" FOR ALL USING (auth.role() = 'authenticated');

-- Grants
GRANT SELECT ON public."SITE_Products" TO anon, authenticated;
GRANT ALL ON public."SITE_Products" TO authenticated, service_role;
GRANT ALL ON public."SITE_Automations" TO authenticated, service_role;
GRANT ALL ON public."SITE_AutomationSteps" TO authenticated, service_role;
GRANT ALL ON public."SITE_MarketingConversions" TO authenticated, service_role;
