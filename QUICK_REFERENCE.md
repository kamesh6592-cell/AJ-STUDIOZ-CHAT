# 🎯 Quick Reference: API Keys & Dual URLs

## 📋 Summary

Your AJ STUDIOZ project now has comprehensive documentation for:
1. **API Keys Setup** - How to get Parallel AI and Firecrawl keys
2. **Dual URL Configuration** - Both domains working simultaneously

---

## 🔑 Getting API Keys

### Parallel AI (PARALLEL_API_KEY)
- **Website:** https://www.parallel.ai/
- **Purpose:** Advanced AI-powered web search
- **Setup:** Sign up → Dashboard → Generate API key
- **Pricing:** Free tier + paid options

### Firecrawl (FIRECRAWL_API_KEY)
- **Website:** https://www.firecrawl.dev/
- **Purpose:** Web scraping, crawling, image search
- **Setup:** Sign up at https://app.firecrawl.dev/ → API Keys → Generate
- **Pricing:** 
  - Free: 500 credits/month
  - Hobby: $20/month (3,000 credits)
  - Standard: $100/month (20,000 credits)

### Add to Vercel
1. Go to Vercel Dashboard
2. Select project: **meowihh**
3. Settings → Environment Variables
4. Add keys:
   ```
   PARALLEL_API_KEY=your_key_here
   FIRECRAWL_API_KEY=your_key_here
   ```
5. Redeploy

---

## 🌐 Your Two URLs

### Primary (Custom Domain)
```
https://www.meow.ajstudioz.co.in
```
✅ Use for: Marketing, SEO, branding, emails

### Backup (Vercel Domain)
```
https://meowihh.vercel.app
```
✅ Use for: Development, testing, backup access

**Both URLs work simultaneously and point to the same app!**

---

## 📚 Documentation Files Created

1. **`API_KEYS_GUIDE.md`**
   - Complete guide for all API keys
   - Step-by-step instructions for Parallel AI & Firecrawl
   - Alternative search providers (Exa, Tavily)
   - Environment variable setup
   - Pricing information

2. **`DUAL_URL_SETUP.md`**
   - Detailed dual URL configuration
   - DNS setup instructions
   - OAuth configuration for both URLs
   - Vercel domain setup guide
   - Troubleshooting tips
   - SEO best practices

---

## ✅ What Was Updated

### Code Changes:
1. ✅ `app/layout.tsx` - Updated metadataBase to primary domain
2. ✅ `.env.example` - Updated NEXT_PUBLIC_APP_URL
3. ✅ `lib/auth.ts` - Already supports both URLs in trustedOrigins

### Documentation Added:
1. ✅ `API_KEYS_GUIDE.md` - Complete API keys documentation
2. ✅ `DUAL_URL_SETUP.md` - Dual URL configuration guide
3. ✅ `QUICK_REFERENCE.md` - This summary file

---

## 🚀 Next Steps

### To Add Parallel AI & Firecrawl:

1. **Get API Keys:**
   - Sign up at Parallel AI: https://www.parallel.ai/
   - Sign up at Firecrawl: https://www.firecrawl.dev/

2. **Add to Vercel:**
   ```bash
   # Go to: vercel.com/dashboard → meowihh → Settings → Environment Variables
   
   PARALLEL_API_KEY=pk_xxxxxxxx
   FIRECRAWL_API_KEY=fc_xxxxxxxx
   ```

3. **Redeploy:**
   - Automatic redeploy after adding env vars
   - Or manually redeploy from Vercel dashboard

### To Configure Custom Domain:

1. **Vercel Dashboard:**
   - Project Settings → Domains
   - Add: `www.meow.ajstudioz.co.in`

2. **DNS Provider:**
   - Add CNAME record:
     ```
     Type: CNAME
     Name: www.meow
     Value: cname.vercel-dns.com
     ```

3. **Wait for SSL:**
   - Vercel auto-issues SSL certificate
   - Takes 5-10 minutes

4. **Update OAuth:**
   - Add both URLs to all OAuth providers
   - Google, GitHub, Twitter, Microsoft

---

## 🔍 Testing Checklist

After adding API keys:
- [ ] Test Parallel AI search
- [ ] Test Firecrawl web scraping
- [ ] Verify image search works
- [ ] Check search results quality

After domain setup:
- [ ] Access https://www.meow.ajstudioz.co.in
- [ ] Access https://meowihh.vercel.app
- [ ] Verify both show same content
- [ ] Test login on both domains
- [ ] Check SSL certificates (🔒)

---

## 🆘 Quick Troubleshooting

**API keys not working?**
- Check spelling in Vercel env vars
- Verify keys are active on provider websites
- Check Vercel deployment logs for errors

**Custom domain not working?**
- Check DNS propagation: `nslookup www.meow.ajstudioz.co.in`
- Wait 24-48 hours for DNS to propagate
- Verify CNAME record is correct

**OAuth fails on custom domain?**
- Add custom domain to OAuth provider settings
- Update callback URLs to include both domains
- Redeploy after updating env vars

---

## 📞 Support Resources

- **API Keys Guide:** `API_KEYS_GUIDE.md`
- **Dual URL Setup:** `DUAL_URL_SETUP.md`
- **Email Support:** support@ajstudioz.co.in
- **Vercel Docs:** https://vercel.com/docs
- **Parallel AI Docs:** https://docs.parallel.ai/
- **Firecrawl Docs:** https://docs.firecrawl.dev/

---

## 💡 Pro Tips

1. **Start with Free Tiers:**
   - Firecrawl: 500 credits/month free
   - Test before upgrading

2. **Monitor Usage:**
   - Check API usage dashboards
   - Set up billing alerts

3. **Use Environment Variables:**
   - Never hardcode API keys
   - Different keys for dev/prod

4. **Both URLs Work:**
   - Share primary domain publicly
   - Use Vercel domain for testing

---

**Current Status:** ✅ All documentation complete and deployed

**Git Commit:** `497fe16` - "docs: Add API keys guide and dual URL setup"

**Live URLs:**
- 🌐 https://www.meow.ajstudioz.co.in (Primary)
- 🔧 https://meowihh.vercel.app (Backup)

---

**Last Updated:** November 4, 2025  
**Project:** AJ STUDIOZ  
**Version:** Production Ready
