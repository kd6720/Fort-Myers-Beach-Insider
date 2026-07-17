# Fort Myers Beach Insider

Single-page marketing site promoting Fort Myers Beach as a dual-use beach property investment — own it, use it when you want, rent it as a short-term rental when you don't.

**Live:** https://fortmyersbeachinsider.com (GitHub Pages)

## How it works

- `build.js` reads `public/content.json` and generates a fully-static `dist/index.html` with all data inlined
- No frameworks, no build tools — just a Node.js script producing optimized HTML
- All stats source from `content.json` (single source of truth)

## Local dev

```bash
node build.js
# Open index.html in your browser
# Or: npx serve dist
```

## Deploy

Push to `main`. GitHub Actions builds and publishes to Pages automatically.

## Supabase setup (lead capture + PDF hosting)

1. Create a Supabase project
2. Create a **public bucket** named `fmb-insider`
3. Upload the prospectus PDF to the bucket
4. Create a `leads` table:

```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  source TEXT DEFAULT 'website',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert" ON leads
  FOR INSERT TO anon WITH CHECK (true);
```

5. Update the `supabaseUrl` and `supabaseKey` variables in `build.js` (search for `YOUR_SUPABASE`) with your project's URL and anon key

## Updating data

Edit `public/content.json` with new market data, rebuild, and push. The site regenerates from the JSON on every deploy.

## Design

White/sand backgrounds, deep navy headlines (#0F2440), teal accents (#0EA5A0), Inter font. Matches the prospectus aesthetic.
