
-- Consolidating the Marketing & CRM General System Tables
-- Following the "Plano Completo" provided by the user

-- 1. LGPD & Marketing Enhancements for the LEADS table
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS consent_email BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS consent_whatsapp BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS marketing_status TEXT DEFAULT 'subscribed' CHECK (marketing_status IN ('subscribed', 'unsubscribed', 'bounced', 'complained')),
ADD COLUMN IF NOT EXISTS last_engagement_at TIMESTAMP WITH TIME ZONE;

-- 2. Structured TAGS System (Advanced Segmentation)
CREATE TABLE IF NOT EXISTS public."SITE_Tags" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    color TEXT DEFAULT '#808080',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public."SITE_LeadTags" (
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public."SITE_Tags"(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (lead_id, tag_id)
);

-- 3. Email Templates (Ensuring physical table exists with all needed fields)
CREATE TABLE IF NOT EXISTS public.email_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    subject TEXT,
    html_body TEXT,
    "imageUrl" TEXT,
    "content2" TEXT,
    variables TEXT[], -- Array of variables like ['name', 'course']
    category TEXT DEFAULT 'Newsletter', -- 'Newsletter', 'Promotion', 'Automation'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Initial Seed for Tags
INSERT INTO public."SITE_Tags" (name, color, description) VALUES
('newsletter', '#34D399', 'Inscrito na newsletter semanal'),
('curso-mecanica', '#3B82F6', 'Interessado em cursos de mecânica'),
('pecas-bmw', '#1D4ED8', 'Interessado em peças BMW'),
('suspensao', '#F59E0B', 'Interessado em sistemas de suspensão'),
('lead-quente', '#EF4444', 'Lead com alto engajamento'),
('ex-cliente', '#6B7280', 'Já realizou compras no passado')
ON CONFLICT (name) DO NOTHING;

-- 5. RLS & Permissions
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."SITE_Tags" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."SITE_LeadTags" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read templates" ON public.email_templates FOR SELECT USING (true);
CREATE POLICY "Allow authenticated manage templates" ON public.email_templates FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated read tags" ON public."SITE_Tags" FOR SELECT USING (true);
CREATE POLICY "Allow authenticated manage tags" ON public."SITE_Tags" FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated manage lead_tags" ON public."SITE_LeadTags" FOR ALL USING (auth.role() = 'authenticated');

-- 6. Grants
GRANT ALL ON public.email_templates TO anon, authenticated, service_role;
GRANT ALL ON public."SITE_Tags" TO anon, authenticated, service_role;
GRANT ALL ON public."SITE_LeadTags" TO anon, authenticated, service_role;

-- 7. Ensure ID consistency for existing SITE_ prefixed code
-- Re-point the view if it was created before, or create it now
DROP VIEW IF EXISTS "SITE_EmailTemplates";
CREATE OR REPLACE VIEW "SITE_EmailTemplates" AS SELECT * FROM public.email_templates;
