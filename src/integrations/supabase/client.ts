import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.trim();
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
}

// Validate URL format
if (SUPABASE_URL && !SUPABASE_URL.startsWith('https://') && !SUPABASE_URL.startsWith('http://')) {
    console.error('Invalid Supabase URL format. Should start with https://');
}

// Validate key format (anon keys are typically long strings)
if (SUPABASE_ANON_KEY && SUPABASE_ANON_KEY.length < 50) {
    console.warn('Supabase anon key seems too short. Please verify you copied the complete key.');
}

// Create Supabase client with error handling
let supabase;
try {
    supabase = createClient(
        SUPABASE_URL || 'https://placeholder.supabase.co',
        SUPABASE_ANON_KEY || 'placeholder-key',
        {
            auth: {
                storage: localStorage,
                persistSession: true,
                autoRefreshToken: true,
            }
        }
    );
} catch (error) {
    console.error('Error initializing Supabase client:', error);
    // Fallback to a safe client instance
    supabase = createClient(
        'https://placeholder.supabase.co',
        'placeholder-key',
        {
            auth: {
                storage: localStorage,
                persistSession: false,
                autoRefreshToken: false,
            }
        }
    );
}

export { supabase };

