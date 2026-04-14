import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://bldbixuoitopsmcmnshf.supabase.co';

// IMPORTANTE: usar SUPABASE_SERVICE_KEY (bypassa RLS) para operações server-side.
// A ANON_KEY é sujeita a Row Level Security e não pode ver todos os contatos.
const supabaseKey = process.env.SUPABASE_SERVICE_KEY
    || process.env.VITE_SUPABASE_ANON_KEY
    || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsZGJpeHVvaXRvcHNtY21uc2hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0ODkzNDIsImV4cCI6MjA4MTA2NTM0Mn0.LuWxPPA0pyCbSU-XYq3ZJQHh-q0riHPEzv4wgPq--1I';

if (!process.env.SUPABASE_SERVICE_KEY) {
    console.warn('⚠️  SUPABASE_SERVICE_KEY não definida — usando ANON_KEY. Contatos podem não ser encontrados se RLS estiver ativo.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
