# 🌐 DNS Configuration Guide for AJ STUDIOZ

This guide explains how to configure DNS for **both** `meow.ajstudioz.co.in` and `www.meow.ajstudioz.co.in` to work with Vercel.

---

## ❌ Current Issue

**Error:** "This site can't be reached" when accessing `https://meow.ajstudioz.co.in/`

**Cause:** Missing DNS configuration for the apex domain (without www)

**Solution:** Add both apex and www subdomain to Vercel + DNS records

---

## 🎯 Target URLs

You need **THREE** working URLs:

1. ✅ `https://meowihh.vercel.app` - Vercel default (already working)
2. ✅ `https://www.meow.ajstudioz.co.in` - Primary custom domain
3. ❌ `https://meow.ajstudioz.co.in` - Apex domain (not working yet)

---

## 🔧 Vercel Configuration

### Step 1: Add BOTH Domains to Vercel

1. **Go to Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Select project: **meowihh**
   - Go to **Settings** → **Domains**

2. **Add WWW Domain (Primary):**
   - Click **Add Domain**
   - Enter: `www.meow.ajstudioz.co.in`
   - Click **Add**
   - Set as **Primary** (if you want this as default)

3. **Add Apex Domain:**
   - Click **Add Domain** again
   - Enter: `meow.ajstudioz.co.in` (without www)
   - Click **Add**
   - Vercel will show you DNS records to configure

4. **Configure Redirect (Recommended):**
   - After adding both domains
   - Go to domain settings for `meow.ajstudioz.co.in`
   - Enable **Redirect to** → `www.meow.ajstudioz.co.in`
   - This ensures users always land on the www version

---

## 📝 DNS Configuration

### Option 1: Using CNAME (Recommended for www)

For: `www.meow.ajstudioz.co.in`

**DNS Records:**
```
Type: CNAME
Name: www.meow (or just "www.meow")
Value: cname.vercel-dns.com
TTL: Auto (or 3600)
```

### Option 2: Using A Record (Required for Apex)

For: `meow.ajstudioz.co.in` (apex/root domain)

**DNS Records:**
```
Type: A
Name: meow (or @ for root)
Value: 76.76.21.21
TTL: Auto (or 3600)

Type: AAAA (IPv6, optional but recommended)
Name: meow (or @ for root)
Value: 2606:4700:4400::1
TTL: Auto (or 3600)
```

**Important:** Apex domains CANNOT use CNAME records. You MUST use A records.

---

## 🗂️ DNS Provider Specific Instructions

### If Using Cloudflare:

1. **Login to Cloudflare Dashboard:**
   - Go to https://dash.cloudflare.com
   - Select your domain: `ajstudioz.co.in`

2. **Add CNAME for WWW:**
   - Click **DNS** → **Records** → **Add record**
   - Type: `CNAME`
   - Name: `www.meow`
   - Target: `cname.vercel-dns.com`
   - Proxy status: **DNS only** (gray cloud, NOT proxied)
   - TTL: Auto
   - Click **Save**

3. **Add A Record for Apex:**
   - Click **Add record**
   - Type: `A`
   - Name: `meow`
   - IPv4 address: `76.76.21.21`
   - Proxy status: **DNS only** (gray cloud)
   - TTL: Auto
   - Click **Save**

4. **Add AAAA Record (IPv6):**
   - Click **Add record**
   - Type: `AAAA`
   - Name: `meow`
   - IPv6 address: `2606:4700:4400::1`
   - Proxy status: **DNS only**
   - TTL: Auto
   - Click **Save**

**⚠️ CRITICAL:** Make sure proxy is **OFF** (gray cloud) for Vercel domains!

### If Using Namecheap:

1. **Login to Namecheap:**
   - Go to https://www.namecheap.com
   - Domain List → Manage

2. **Add Records:**
   - Go to **Advanced DNS** tab
   - Add CNAME Record:
     - Type: `CNAME Record`
     - Host: `www.meow`
     - Value: `cname.vercel-dns.com`
     - TTL: Automatic
   - Add A Record:
     - Type: `A Record`
     - Host: `meow`
     - Value: `76.76.21.21`
     - TTL: Automatic

### If Using GoDaddy:

1. **Login to GoDaddy:**
   - Go to https://www.godaddy.com
   - My Products → DNS

2. **Add Records:**
   - CNAME:
     - Type: `CNAME`
     - Name: `www.meow`
     - Value: `cname.vercel-dns.com`
     - TTL: 1 Hour
   - A Record:
     - Type: `A`
     - Name: `meow`
     - Value: `76.76.21.21`
     - TTL: 1 Hour

### If Using Other DNS Providers:

Same principle applies - add:
- CNAME for `www.meow` → `cname.vercel-dns.com`
- A record for `meow` → `76.76.21.21`
- AAAA record for `meow` → `2606:4700:4400::1` (optional)

---

## ⏱️ DNS Propagation Time

After adding DNS records:
- **Minimum:** 5-10 minutes
- **Average:** 1-2 hours
- **Maximum:** 48 hours (rare)

**Speed up propagation:**
- Use lower TTL values (300-600 seconds)
- Clear browser cache
- Use incognito/private mode
- Test with different networks

---

## 🧪 Testing DNS Configuration

### 1. Check DNS Propagation

**Using Command Line:**

```bash
# Windows PowerShell
nslookup www.meow.ajstudioz.co.in
nslookup meow.ajstudioz.co.in

# Should show:
# Name: cname.vercel-dns.com (for www)
# Address: 76.76.21.21 (for apex)
```

**Using Online Tools:**
- https://dnschecker.org/
- https://www.whatsmydns.net/
- Enter: `www.meow.ajstudioz.co.in` and `meow.ajstudioz.co.in`
- Check multiple locations globally

### 2. Check Vercel Connection

**In Vercel Dashboard:**
- Go to: Settings → Domains
- Both domains should show:
  - ✅ `www.meow.ajstudioz.co.in` - Valid Configuration
  - ✅ `meow.ajstudioz.co.in` - Valid Configuration

**If showing error:**
- ⚠️ Invalid Configuration - DNS not propagated yet
- ⚠️ Pending Verification - Wait for DNS propagation

### 3. Test SSL Certificate

Both URLs should have SSL:

```bash
# Test www
curl -I https://www.meow.ajstudioz.co.in

# Test apex
curl -I https://meow.ajstudioz.co.in

# Both should return: HTTP/2 200 (or 301/302)
```

**In Browser:**
- Visit both URLs
- Check for 🔒 (padlock icon) in address bar
- Click padlock → Certificate should be valid

---

## 🔄 Redirect Configuration

### Option A: Redirect Apex to WWW (Recommended)

**In Vercel Dashboard:**
1. Go to: Settings → Domains
2. Click on `meow.ajstudioz.co.in`
3. Enable: **Redirect to www.meow.ajstudioz.co.in**
4. Permanent: ✅ Yes (301 redirect)

**Result:**
- User types: `meow.ajstudioz.co.in`
- Redirects to: `www.meow.ajstudioz.co.in`

### Option B: Redirect WWW to Apex

**In Vercel Dashboard:**
1. Go to: Settings → Domains
2. Click on `www.meow.ajstudioz.co.in`
3. Enable: **Redirect to meow.ajstudioz.co.in**

**Choose ONE approach** (typically apex → www is preferred)

---

## 📊 Environment Variables

Update your environment variables to include the apex domain:

**In Vercel Dashboard → Settings → Environment Variables:**

```bash
# Primary URL
NEXT_PUBLIC_APP_URL=https://www.meow.ajstudioz.co.in

# Auth URL
BETTER_AUTH_URL=https://www.meow.ajstudioz.co.in

# Allowed Origins (comma-separated)
ALLOWED_ORIGINS=https://www.meow.ajstudioz.co.in,https://meow.ajstudioz.co.in,https://meowihh.vercel.app,http://localhost:3000
```

**Already Updated in Code:** ✅
- `lib/auth.ts` now includes both domains in `trustedOrigins`

---

## 🆘 Troubleshooting

### Issue 1: "This site can't be reached"

**Possible Causes:**
1. DNS not configured
2. DNS not propagated yet
3. Wrong DNS records

**Solutions:**
- Check DNS records are correct
- Wait for DNS propagation (up to 48 hours)
- Use `nslookup meow.ajstudioz.co.in` to verify
- Clear browser cache / use incognito

### Issue 2: "NET::ERR_CERT_COMMON_NAME_INVALID"

**Cause:** SSL certificate not issued yet

**Solution:**
- Wait for Vercel to issue SSL (5-10 minutes after DNS verification)
- Check Vercel dashboard for certificate status
- Try accessing via HTTP first to trigger cert generation

### Issue 3: "Too Many Redirects"

**Cause:** Circular redirect between apex and www

**Solution:**
- Choose ONE redirect direction (apex → www OR www → apex)
- Remove conflicting redirects in Vercel dashboard
- Clear browser cookies

### Issue 4: DNS Changes Not Visible

**Solution:**
```bash
# Windows - Flush DNS cache
ipconfig /flushdns

# Then test
nslookup meow.ajstudioz.co.in
```

### Issue 5: Works on Some Devices, Not Others

**Cause:** DNS caching

**Solution:**
- Wait longer for full global propagation
- Test with mobile network (different DNS)
- Use online DNS checkers to verify global propagation

---

## ✅ Verification Checklist

Before considering setup complete:

- [ ] Added `www.meow.ajstudioz.co.in` to Vercel
- [ ] Added `meow.ajstudioz.co.in` to Vercel
- [ ] CNAME record added for `www.meow`
- [ ] A record added for `meow`
- [ ] DNS propagated (check with nslookup)
- [ ] Both domains show "Valid Configuration" in Vercel
- [ ] SSL certificates issued for both domains
- [ ] `https://www.meow.ajstudioz.co.in` loads ✅
- [ ] `https://meow.ajstudioz.co.in` loads ✅
- [ ] Redirect configured (if desired)
- [ ] Environment variables updated
- [ ] OAuth providers updated with both URLs

---

## 📱 OAuth Configuration Update

Don't forget to add the apex domain to your OAuth providers!

**Google OAuth Console:**
```
Authorized JavaScript origins:
  - https://www.meow.ajstudioz.co.in
  - https://meow.ajstudioz.co.in
  - https://meowihh.vercel.app

Authorized redirect URIs:
  - https://www.meow.ajstudioz.co.in/api/auth/callback/google
  - https://meow.ajstudioz.co.in/api/auth/callback/google
  - https://meowihh.vercel.app/api/auth/callback/google
```

**Repeat for:** GitHub, Twitter, Microsoft OAuth apps

---

## 🎯 Recommended Setup

**Primary Domain:** `www.meow.ajstudioz.co.in`
**Redirect:** `meow.ajstudioz.co.in` → `www.meow.ajstudioz.co.in`
**Backup:** `meowihh.vercel.app`

This ensures:
- SEO benefits (single canonical URL)
- Consistent user experience
- All variations work

---

## 📞 Support

**Still having issues?**

1. **Check Vercel Status:** https://www.vercel-status.com
2. **DNS Checker:** https://dnschecker.org
3. **Vercel Support:** https://vercel.com/support
4. **Email:** support@ajstudioz.co.in

**Provide when asking for help:**
- Domain name: `meow.ajstudioz.co.in`
- DNS provider: (Cloudflare/Namecheap/GoDaddy/etc)
- Screenshot of DNS records
- Screenshot of Vercel domain settings
- Error message if any

---

**Last Updated:** November 5, 2025  
**Project:** AJ STUDIOZ  
**Domains:** www.meow.ajstudioz.co.in & meow.ajstudioz.co.in  
**Deployment:** Vercel
