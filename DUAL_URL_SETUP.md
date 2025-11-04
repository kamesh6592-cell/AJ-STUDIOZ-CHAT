# 🌐 Dual URL Configuration

Your AJ STUDIOZ project is accessible via **TWO URLs** that both point to the same application.

---

## 📍 Your URLs

### Primary Domain (Custom)
```
https://www.meow.ajstudioz.co.in
```
- **Status:** ✅ Active
- **Type:** Custom domain
- **Usage:** Primary URL for branding and marketing
- **SSL:** Automatic (via Vercel)

### Secondary Domain (Vercel)
```
https://meowihh.vercel.app
```
- **Status:** ✅ Active
- **Type:** Vercel default domain
- **Usage:** Backup URL, development preview
- **SSL:** Automatic (via Vercel)

---

## 🔧 How Both URLs Work

Both URLs are configured in your **Vercel project settings** and point to the **same deployment**. This means:

✅ Same codebase  
✅ Same database  
✅ Same environment variables  
✅ Same features and functionality  
✅ Both are SSL-secured  

---

## 🎯 URL Usage Strategy

### Use `www.meow.ajstudioz.co.in` for:
- 🎨 Marketing materials
- 📧 Email signatures
- 🔗 Social media profiles
- 📱 App store listings
- 📄 Documentation
- 🌍 SEO and Google indexing

### Use `meowihh.vercel.app` for:
- 🔧 Development testing
- 🐛 Bug reproduction
- 👨‍💻 Internal team access
- 📦 Preview deployments
- 🔄 Fallback/backup access

---

## ⚙️ Configuration Details

### 1. Vercel Domain Settings
Both domains are configured in your Vercel project:

**Location:** Vercel Dashboard → Project Settings → Domains

```
Domains:
  - www.meow.ajstudioz.co.in (Primary)
  - meowihh.vercel.app (Production)
```

### 2. DNS Configuration (for Custom Domain)
Your DNS provider should have these records:

```
Type: CNAME
Name: www.meow
Value: cname.vercel-dns.com
TTL: Auto

Type: A (if using apex domain)
Name: meow
Value: 76.76.21.21
TTL: Auto
```

### 3. Application Configuration

**Primary URL in Code:**
- `app/layout.tsx` → `metadataBase: new URL('https://www.meow.ajstudioz.co.in')`
- `.env.example` → `NEXT_PUBLIC_APP_URL=https://www.meow.ajstudioz.co.in`

**Auth Configuration:**
- `lib/auth.ts` → Both URLs in `trustedOrigins`

```typescript
trustedOrigins: [
  'https://www.meow.ajstudioz.co.in',  // Primary
  'https://meowihh.vercel.app',        // Backup
  process.env.NEXT_PUBLIC_APP_URL,
]
```

---

## 🔐 OAuth Configuration

When setting up OAuth providers (Google, GitHub, etc.), **add BOTH URLs** to the redirect/callback URIs:

### Google OAuth Console
```
Authorized JavaScript origins:
  - https://www.meow.ajstudioz.co.in
  - https://meowihh.vercel.app

Authorized redirect URIs:
  - https://www.meow.ajstudioz.co.in/api/auth/callback/google
  - https://meowihh.vercel.app/api/auth/callback/google
```

### GitHub OAuth App
```
Homepage URL:
  - https://www.meow.ajstudioz.co.in

Authorization callback URL:
  - https://www.meow.ajstudioz.co.in/api/auth/callback/github
  - https://meowihh.vercel.app/api/auth/callback/github
```

### Twitter/X Developer Portal
```
Callback URLs:
  - https://www.meow.ajstudioz.co.in/api/auth/callback/twitter
  - https://meowihh.vercel.app/api/auth/callback/twitter

Website URL:
  - https://www.meow.ajstudioz.co.in
```

---

## 🚀 Setting Up Custom Domain on Vercel

If you haven't added your custom domain yet:

### Step 1: Go to Vercel Dashboard
1. Navigate to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project: **meowihh**
3. Click **Settings** → **Domains**

### Step 2: Add Custom Domain
1. Click **Add Domain**
2. Enter: `www.meow.ajstudioz.co.in`
3. Click **Add**

### Step 3: Configure DNS
Vercel will provide you with DNS records. Go to your domain provider (where you bought `ajstudioz.co.in`):

**If using Cloudflare, Namecheap, GoDaddy, etc.:**
```
Type: CNAME
Name: www.meow (or just www.meow)
Value: cname.vercel-dns.com
```

### Step 4: Wait for Verification
- DNS propagation: 5 minutes - 48 hours
- Vercel will automatically issue SSL certificate
- Both HTTP and HTTPS will work (HTTP redirects to HTTPS)

---

## 🔍 Verifying Both URLs Work

### Test Commands:
```bash
# Test primary domain
curl -I https://www.meow.ajstudioz.co.in

# Test Vercel domain
curl -I https://meowihh.vercel.app

# Check SSL certificate
openssl s_client -connect www.meow.ajstudioz.co.in:443 -servername www.meow.ajstudioz.co.in
```

### Browser Tests:
1. Open `https://www.meow.ajstudioz.co.in` → Should load ✅
2. Open `https://meowihh.vercel.app` → Should load ✅
3. Both should show same content ✅
4. Both should have valid SSL (🔒 in address bar) ✅

---

## 📊 Environment Variables

### Required for Dual URL Support:

```bash
# In Vercel Dashboard → Settings → Environment Variables

# Primary URL (for metadata, emails, etc.)
NEXT_PUBLIC_APP_URL=https://www.meow.ajstudioz.co.in

# Auth Configuration (automatically uses both domains)
BETTER_AUTH_URL=https://www.meow.ajstudioz.co.in

# Allowed Origins (comma-separated for both)
ALLOWED_ORIGINS=https://www.meow.ajstudioz.co.in,https://meowihh.vercel.app,http://localhost:3000
```

---

## 🎨 Updating URLs in Code

The following files reference your URLs:

### Already Updated: ✅
- ✅ `app/layout.tsx` - Primary metadata URL
- ✅ `lib/auth.ts` - Trusted origins (both URLs)
- ✅ `.env.example` - Example configuration

### Files That Dynamically Use URLs:
- `components/share/share-dialog.tsx` - Uses current URL
- `app/search/[id]/page.tsx` - Uses metadata base
- Email templates - Use `NEXT_PUBLIC_APP_URL`

These don't need changes as they use environment variables or dynamic detection.

---

## 🔄 Redirects and Canonical URLs

### Current Redirect Configuration (next.config.ts):
```typescript
redirects: [
  {
    source: '/www',
    destination: 'https://www.meow.ajstudioz.co.in',
    permanent: true,
  },
  {
    source: '/home',
    destination: 'https://www.meow.ajstudioz.co.in',
    permanent: true,
  },
]
```

### SEO Best Practice:
Consider adding canonical URLs to prefer one domain:

```typescript
// In app/layout.tsx or page.tsx
export const metadata = {
  alternates: {
    canonical: 'https://www.meow.ajstudioz.co.in',
  },
}
```

This tells search engines which URL is preferred.

---

## 📱 Mobile & PWA Configuration

Update your PWA manifest if needed:

```typescript
// app/manifest.ts
export default function manifest() {
  return {
    name: 'AJ STUDIOZ',
    short_name: 'AJ',
    start_url: 'https://www.meow.ajstudioz.co.in/',
    display: 'standalone',
    // ... other settings
  }
}
```

---

## 🆘 Troubleshooting

### Issue: Custom domain not working
**Solution:** Check DNS propagation
```bash
nslookup www.meow.ajstudioz.co.in
```

### Issue: SSL certificate error
**Solution:** Wait for Vercel to issue certificate (automatic, takes 5-10 minutes)

### Issue: OAuth callback fails
**Solution:** Add both URLs to OAuth provider settings

### Issue: CORS errors
**Solution:** Update `ALLOWED_ORIGINS` environment variable to include both URLs

---

## 📞 Support

For domain configuration help:
- Email: support@ajstudioz.co.in
- Vercel Support: [vercel.com/support](https://vercel.com/support)
- DNS Provider: Check your domain registrar's support

---

## ✅ Checklist: Dual URL Setup

- [x] Both domains added to Vercel project
- [x] DNS records configured for custom domain
- [x] SSL certificates issued for both domains
- [x] `trustedOrigins` includes both URLs in `lib/auth.ts`
- [ ] OAuth providers configured with both callback URLs
- [ ] Environment variable `NEXT_PUBLIC_APP_URL` set to primary URL
- [ ] Test both URLs in browser
- [ ] Test authentication on both URLs
- [ ] Verify API endpoints work on both URLs

---

**Last Updated:** November 4, 2025  
**Primary URL:** https://www.meow.ajstudioz.co.in  
**Backup URL:** https://meowihh.vercel.app  
**Project:** AJ STUDIOZ by AJ STUDIOZ
