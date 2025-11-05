# API Keys Setup Guide

This guide explains how to obtain the API keys needed for AJ STUDIOZ search functionality.

## 🔑 Required API Keys

### 1. **Parallel AI API Key** (PARALLEL_API_KEY)
**What it does:** Advanced AI-powered web search with intelligent result ranking and processing.

**How to get it:**
1. Visit [Parallel AI Website](https://www.parallel.ai/) or [Parallel Docs](https://docs.parallel.ai/)
2. Sign up for an account
3. Navigate to API settings or Dashboard
4. Generate a new API key
5. Copy the API key

**Pricing:** Check their website for current pricing tiers
- Usually offers a free tier with limited requests
- Paid tiers for production use

**Add to Vercel:**
```bash
PARALLEL_API_KEY=your_parallel_api_key_here
```

---

### 2. **Firecrawl API Key** (FIRECRAWL_API_KEY)
**What it does:** Web scraping and crawling with image search capabilities. Converts websites to LLM-ready markdown.

**How to get it:**
1. Visit [Firecrawl.dev](https://www.firecrawl.dev/)
2. Sign up for an account at [app.firecrawl.dev](https://app.firecrawl.dev/)
3. Go to your Dashboard
4. Navigate to API Keys section
5. Generate a new API key
6. Copy the API key

**Pricing:**
- **Free Tier:** 500 credits/month
- **Hobby:** $20/month - 3,000 credits
- **Standard:** $100/month - 20,000 credits
- **Scale:** $400/month - 100,000 credits

**Features:**
- Web scraping
- Image search
- Markdown conversion
- Batch processing

**Add to Vercel:**
```bash
FIRECRAWL_API_KEY=your_firecrawl_api_key_here
```

---

## 🌐 Alternative Search Providers (Already Configured)

Your project also supports these alternative search providers (all optional):

### 3. **Exa API** (EXA_API_KEY)
- Website: [exa.ai](https://exa.ai/)
- Semantic neural search engine
- Free tier available

### 4. **Tavily API** (TAVILY_API_KEY)
- Website: [tavily.com](https://tavily.com/)
- Search API optimized for AI agents
- Free tier: 1,000 requests/month

---

## 📦 File Upload Storage (Required for Image/PDF uploads)

### 5. **Vercel Blob Storage** (BLOB_READ_WRITE_TOKEN)
**What it does:** Stores uploaded images and PDF files with global CDN distribution.

**How to get it:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Storage** in top navigation
3. Click **Create Database** → Select **Blob**
4. Name it: `ajstudioz-blob`
5. Click **Create** → **Connect Project**
6. Select **meowihh** project
7. Token is automatically added to environment variables

**Pricing:**
- **Free (Hobby):** 1 GB storage, 100 GB bandwidth/month
- **Pro:** 100 GB storage, 1 TB bandwidth/month ($20/month)

**Features:**
- Fast global CDN
- Automatic compression
- Supports: JPEG, PNG, GIF, PDF
- Max file size: 5 MB

**Detailed Setup Guide:** See `VERCEL_BLOB_SETUP.md`

**Add to Vercel:**
```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_XXXXXXXXXX
```

---

## 📝 How to Add API Keys to Your Project

### Option 1: Vercel Dashboard (Recommended for Production)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **meowihh**
3. Go to **Settings** → **Environment Variables**
4. Add each API key:
   - Name: `PARALLEL_API_KEY`
   - Value: `your_key_here`
   - Environment: Production, Preview, Development (select all)
5. Click **Save**
6. Redeploy your project

### Option 2: Local Development (.env.local)
Create a `.env.local` file in your project root:
```bash
# Search Provider API Keys (All Optional)
PARALLEL_API_KEY=your_parallel_api_key_here
FIRECRAWL_API_KEY=your_firecrawl_api_key_here
EXA_API_KEY=your_exa_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here

# AI Provider API Keys (Optional)
GOOGLE_GENERATIVE_AI_API_KEY=your_google_key
GROQ_API_KEY=your_groq_key
ANTHROPIC_API_KEY=your_anthropic_key
XAI_API_KEY=your_xai_key
HF_TOKEN=your_huggingface_token

# Required
DATABASE_URL=your_neon_database_url
BETTER_AUTH_SECRET=your_secret_key
```

---

## 🎯 Search Provider Selection

Your project uses a flexible search system. The search provider is selected based on:
1. **User settings** (if configured)
2. **Available API keys** (fallback logic)
3. **Default**: Parallel AI (if available)

### Fallback Order:
1. Parallel AI (if `PARALLEL_API_KEY` exists)
2. Exa (if `EXA_API_KEY` exists)
3. Tavily (if `TAVILY_API_KEY` exists)
4. Firecrawl (if `FIRECRAWL_API_KEY` exists)

---

## ⚙️ Current Configuration Status

### ✅ Working (No API Key Required)
- **Google Gemini 2.5 Flash** - Default AI model
- **DeepSeek R1** - Free via HuggingFace
- **HuggingFace Models** - Free serverless inference

### 🔑 Optional (Requires API Key)
- **Parallel AI** - Advanced search
- **Firecrawl** - Web crawling & images
- **Exa** - Neural search
- **Tavily** - AI search
- **Groq** - Fast inference
- **Anthropic Claude** - Premium AI
- **xAI Grok** - Premium AI

---

## 🚀 Quick Start

### Minimal Setup (Free)
```bash
# Required only
DATABASE_URL=your_neon_url
BETTER_AUTH_SECRET=random_secret_key
GOOGLE_GENERATIVE_AI_API_KEY=your_google_key
```

### Recommended Setup
```bash
# Required
DATABASE_URL=your_neon_url
BETTER_AUTH_SECRET=random_secret_key

# AI (Free/Freemium)
GOOGLE_GENERATIVE_AI_API_KEY=your_google_key
GROQ_API_KEY=your_groq_key

# Search (Choose at least one)
PARALLEL_API_KEY=your_parallel_key  # Best quality
# OR
TAVILY_API_KEY=your_tavily_key      # Free tier
```

---

## 📞 Support

If you need help getting API keys:
- Email: support@ajstudioz.co.in
- Check provider documentation
- Join provider Discord/Slack communities

---

## 🔗 Useful Links

- **Parallel AI:** https://www.parallel.ai/
- **Firecrawl:** https://www.firecrawl.dev/
- **Exa:** https://exa.ai/
- **Tavily:** https://tavily.com/
- **HuggingFace:** https://huggingface.co/
- **Google AI Studio:** https://aistudio.google.com/
- **Groq Console:** https://console.groq.com/

---

**Last Updated:** November 4, 2025
**Project:** AJ STUDIOZ
**Deployment:** www.meow.ajstudioz.co.in | meowihh.vercel.app
