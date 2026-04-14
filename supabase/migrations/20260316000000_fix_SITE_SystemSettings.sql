
-- 1. Table: SITE_SystemSettings
CREATE TABLE IF NOT EXISTS "SITE_SystemSettings" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    category TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add Initial Settings
INSERT INTO "SITE_SystemSettings" (key, value, description, category) 
VALUES 
    ('email_smtp_host', '"smtp.example.com"', 'Servidor SMTP', 'Email'),
    ('email_smtp_port', '"587"', 'Porta SMTP', 'Email'),
    ('email_smtp_user', '"user@example.com"', 'Usuário SMTP', 'Email'),
    ('email_smtp_pass', '""', 'Senha SMTP', 'Email'),
    ('email_sender_name', '"W-Tech Brasil"', 'Nome do Remetente', 'Email'),
    ('email_sender_email', '"contato@wtech.com"', 'Email do Remetente', 'Email'),
    ('bio_config', '{"logo_url": "", "title": "W-TECH", "description": "Elite da Tecnologia Automotiva", "links": [], "show_latest_courses": true}'::jsonb, 'Configurações da Bio', 'Marketing')
ON CONFLICT (key) DO NOTHING;

-- 3. Grants
GRANT ALL ON "SITE_SystemSettings" TO anon, authenticated, service_role;
ALTER TABLE "SITE_SystemSettings" DISABLE ROW LEVEL SECURITY;
