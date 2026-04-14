
-- Blog Tables for the Marketing Module
CREATE TABLE IF NOT EXISTS "SITE_BlogPosts" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    author TEXT,
    category TEXT,
    image TEXT,
    status TEXT DEFAULT 'Draft',
    seo_title TEXT,
    seo_description TEXT,
    seo_score INT DEFAULT 0,
    views INT DEFAULT 0,
    clicks INT DEFAULT 0,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    keywords TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "SITE_PostComments" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES "SITE_BlogPosts"(id) ON DELETE CASCADE,
    user_name TEXT,
    user_email TEXT,
    content TEXT,
    status TEXT DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Grants
GRANT ALL ON "SITE_BlogPosts" TO anon, authenticated, service_role;
GRANT ALL ON "SITE_PostComments" TO anon, authenticated, service_role;
ALTER TABLE "SITE_BlogPosts" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "SITE_PostComments" DISABLE ROW LEVEL SECURITY;
