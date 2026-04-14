
-- Compatibility Views for W-Tech Marketing Module
-- Maps standard Elance tables to 'SITE_' prefixed names used by the marketing module

-- 1. SITE_Leads -> public.leads
CREATE OR REPLACE VIEW "SITE_Leads" AS 
SELECT * FROM public.leads;

-- 2. SITE_Users -> public.profiles (or auth.users)
-- The module often needs name/email from profiles
CREATE OR REPLACE VIEW "SITE_Users" AS 
SELECT id, full_name as name, email, role FROM public.profiles;

-- 3. SITE_EmailTemplates -> public.email_templates
CREATE OR REPLACE VIEW "SITE_EmailTemplates" AS 
SELECT * FROM public.email_templates;

-- Grant permissions
GRANT SELECT ON "SITE_Leads" TO anon, authenticated, service_role;
GRANT SELECT ON "SITE_Users" TO anon, authenticated, service_role;
GRANT SELECT ON "SITE_EmailTemplates" TO anon, authenticated, service_role;
