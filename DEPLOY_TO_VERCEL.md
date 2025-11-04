# Deploy to Vercel - Quick Guide

## ✅ All Build Issues Fixed!

Your repository is now fully optimized for Vercel's **free (Hobby) plan** and rebranded to **AJ STUDIOZ**.

## 🎨 Rebranding Complete

The entire application has been rebranded from "Scira AI" to "AJ STUDIOZ":
- ✅ New logo (`/public/aj-logo.jpg`) used throughout the app
- ✅ Updated metadata and SEO
- ✅ Changed app name in package.json
- ✅ Updated all UI components (navbar, auth pages, emails)
- ✅ New color scheme (red accent from logo)
- ✅ Updated all text references

## Required Environment Variables (Only 4!)

Add these to your Vercel project settings:

```bash
OPENAI_API_KEY=sk-your-openai-key-here
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
BETTER_AUTH_SECRET=your-random-secret-min-32-characters-long
```

### ⚠️ **Important: DATABASE_URL Format**

Your Neon database URL should look like this:
```
postgresql://neondb_owner:npg_xxxxx@ep-xxxxx.aws.neon.tech/neondb?sslmode=require
```

**DO NOT** include `psql` prefix or `channel_binding=require` - Vercel's UI sometimes adds these.

**Correct format:**
```
postgresql://neondb_owner:npg_A4p0UJWzBDES@ep-hidden-glitter-ah9y8y7d-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**Wrong format (will cause build errors):**
```
psql 'postgresql://...' ❌
postgresql://...&channel_binding=require ❌
```

### How to Generate BETTER_AUTH_SECRET

```bash
# PowerShell
-join ((33..126) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Or use any random string generator with at least 32 characters
```

## Optional Environment Variables

Add these later as you need specific features:

### AI Providers (Optional)
- `XAI_API_KEY` - For xAI models
- `GROQ_API_KEY` - For Groq models
- `GOOGLE_GENERATIVE_AI_API_KEY` - For Gemini models

### Social Auth (Optional)
- `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET`
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`
- `TWITTER_CLIENT_ID` & `TWITTER_CLIENT_SECRET`

### Services (Optional)
- `REDIS_URL`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` - For caching
- `ELEVENLABS_API_KEY` - For text-to-speech
- `TAVILY_API_KEY` - For web search
- `EXA_API_KEY` - For semantic search
- `FIRECRAWL_API_KEY` - For web scraping
- `OPENWEATHER_API_KEY` - For weather data
- `GOOGLE_MAPS_API_KEY` - For maps
- `COINGECKO_API_KEY` - For crypto data
- `TMDB_API_KEY` - For movie/TV data

## Deployment Steps

1. **Push to GitHub** (Already done! ✅)
   ```
   Repository: https://github.com/kamesh6592-cell/meowihh
   Branch: main
   ```

2. **Deploy on Vercel**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import `kamesh6592-cell/meowihh`
   - Add the 4 required environment variables
   - Click "Deploy"

3. **Done!** 🎉
   - Your app will be live at `https://your-project.vercel.app`
   - Cron job runs daily at midnight UTC
   - Add more API keys anytime through Vercel dashboard

## What Was Fixed

- ✅ Cron schedule changed to daily (`0 0 * * *`) for Hobby plan
- ✅ Reduced required env vars from 36 to 4
- ✅ Made all social auth providers optional
- ✅ Made Redis caching optional
- ✅ Added type guards for all optional API keys in tools
- ✅ Database uses single connection when read replicas not configured

## Build Verification

The project now builds successfully on Vercel with only the 4 required environment variables!

---

**Repository**: https://github.com/kamesh6592-cell/meowihh  
**Commit**: Latest on `main` branch
