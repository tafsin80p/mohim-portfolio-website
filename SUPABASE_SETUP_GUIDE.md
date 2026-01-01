# Supabase Setup Guide

## Common JWT/API Key Error Fix

If you're seeing "JWT/API Key error", follow these steps:

### Step 1: Get Your Supabase Credentials

1. Go to your Supabase project dashboard: https://app.supabase.com
2. Select your project
3. Go to **Settings** → **API**
4. You'll see:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Project API keys** section with:
     - `anon` `public` key ← **Use this one!**
     - `service_role` `secret` key ← **Don't use this!**

### Step 2: Create/Update Your .env File

1. In your project root (same folder as `package.json`), create or edit `.env` file
2. Add these lines (replace with your actual values):

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

### Step 3: Important Notes

✅ **DO:**
- Use the `anon` `public` key (not service_role)
- Copy the entire key (it's very long, usually 100+ characters)
- No quotes around the values
- No spaces before or after the `=` sign
- Make sure the URL starts with `https://`

❌ **DON'T:**
- Use quotes: `VITE_SUPABASE_ANON_KEY="key"` ❌
- Use service_role key ❌
- Add spaces: `VITE_SUPABASE_URL = https://...` ❌
- Use the wrong URL format ❌

### Step 4: Example .env File

```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.abcdefghijklmnopqrstuvwxyz1234567890
```

### Step 5: Restart Your Dev Server

After updating `.env`:
1. Stop your dev server (Ctrl+C)
2. Run `npm run dev` again
3. Refresh your browser

### Step 6: Verify in Dashboard

Go to the Dashboard → Overview tab. You should see:
- ✅ **Connected** (green) if everything is correct
- ❌ **Not Connected** with specific error message if there's still an issue

### Troubleshooting

**Still getting JWT error?**
1. Double-check you copied the entire anon key (it's very long)
2. Make sure there are no extra spaces or quotes
3. Verify the URL is correct and starts with `https://`
4. Check browser console (F12) for more detailed error messages
5. Try removing quotes if you added them: `VITE_SUPABASE_ANON_KEY="key"` → `VITE_SUPABASE_ANON_KEY=key`

**Website is blank?**
1. Check browser console (F12) for errors
2. Make sure `.env` file is in the project root
3. Restart the dev server after creating/editing `.env`
4. Check that variable names start with `VITE_`

### Need Help?

Check the browser console (F12) for detailed error messages. The dashboard will also show specific error information in the Overview tab.






