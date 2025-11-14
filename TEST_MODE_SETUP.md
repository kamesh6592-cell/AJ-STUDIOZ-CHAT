# 🧪 Test Mode Setup - Quick Reference

## ✅ Configuration Complete

Your test mode is now configured for safe development testing!

---

## 🔧 What's Been Configured

### 1. Environment Variables (.env.local)
```env
# ✅ CONFIGURED - Test Webhook Secret
DODO_PAYMENTS_TEST_WEBHOOK_SECRET=whsec_tJRFxfU4pjc/+GWFh2PCFXnd0eskDvGK

# ✅ CONFIGURED - Test Product
NEXT_PUBLIC_TEST_PRODUCT_ID=pdt_pqytGOBI0Y1xM4TBlsIgS
NEXT_PUBLIC_TEST_PREMIUM_SLUG=starter

# ⚠️ TODO - Add Test API Key from Dashboard
DODO_PAYMENTS_TEST_API_KEY=dodo_test_[GET_FROM_DASHBOARD]
```

### 2. Auth Configuration (lib/auth.ts)
- ✅ Automatically uses test API key in development
- ✅ Automatically uses test product in development
- ✅ Automatically uses test webhook secret
- ✅ Falls back to production keys in production environment

---

## 🎯 Next Steps

### Step 1: Get Your Test API Key
1. Go to **[DodoPayments Dashboard](https://dodopayments.com/)**
2. Toggle to **Test Mode** (top right corner)
3. Navigate to **Settings** → **API Keys**
4. Copy the **Test API Key** (starts with `dodo_test_...`)

### Step 2: Add Test API Key to .env.local
```env
DODO_PAYMENTS_TEST_API_KEY=dodo_test_your_actual_key_here
```

### Step 3: Verify Your Test Product
1. In DodoPayments Dashboard (Test Mode)
2. Go to **Products**
3. Find product with ID: `pdt_pqytGOBI0Y1xM4TBlsIgS`
4. Verify:
   - Slug is `starter`
   - Price is ₹2 (for testing)
   - Status is Active

---

## 🧪 Testing Payment Flow

### Method 1: Admin Panel Test (Recommended)
1. Start development server: `pnpm dev`
2. Log in as admin: `kamesh6592@gmail.com`
3. Go to `/admin` page
4. Click **"Test ₹2 Payment"** button
5. Complete checkout with test card

### Method 2: Direct Checkout
1. Go to `/checkout` page
2. Use test card number: `4242 4242 4242 4242`
3. CVV: Any 3 digits
4. Expiry: Any future date
5. Complete payment

---

## ✅ Test Mode Safety Features

### Automatic Environment Detection
```typescript
// In lib/auth.ts - Already configured!

// Uses test API key in development
const apiKey = process.env.DODO_PAYMENTS_TEST_API_KEY || process.env.DODO_PAYMENTS_API_KEY;

// Uses test product in development
const productId = process.env.NEXT_PUBLIC_TEST_PRODUCT_ID || process.env.NEXT_PUBLIC_PREMIUM_TIER;

// Uses test webhook secret first
const webhookKey = process.env.DODO_PAYMENTS_TEST_WEBHOOK_SECRET || process.env.DODO_PAYMENTS_WEBHOOK_SECRET;
```

### What This Means:
- 🛡️ **No accidental charges** - Test keys cannot process real money
- 🧪 **Safe testing** - Use unlimited test transactions
- 🔄 **Easy switching** - Just change environment for production
- 📊 **Separate data** - Test and live mode have separate dashboards

---

## 🔍 Verification Checklist

Before testing:
- [x] Test webhook secret added to .env.local
- [x] Test product ID added to .env.local
- [x] Test product slug configured
- [ ] Test API key added (⚠️ **YOU NEED TO DO THIS**)
- [ ] Development server running (`pnpm dev`)
- [ ] Logged in as admin user
- [ ] DodoPayments dashboard in Test Mode

After testing:
- [ ] Clicked "Test ₹2 Payment" button
- [ ] Completed checkout flow
- [ ] Saw success message
- [ ] Checked webhook received event (DodoPayments dashboard)
- [ ] Verified payment record in admin panel

---

## 🆘 Troubleshooting

### "Missing API Key" Error
**Solution**: Add `DODO_PAYMENTS_TEST_API_KEY` to `.env.local` from DodoPayments dashboard

### "Product Not Found" Error
**Solution**: Verify product `pdt_pqytGOBI0Y1xM4TBlsIgS` exists in Test Mode dashboard

### Webhook Not Receiving Events
**Solution**: 
1. Check webhook secret is correct
2. Verify webhook URL is configured in dashboard
3. For local testing, use ngrok: `ngrok http 3000`

### Payment Success But No Pro Status
**Solution**:
1. Check webhook logs in DodoPayments dashboard
2. Check Vercel/terminal logs for webhook processing
3. Try logging out and back in (clears cache)

---

## 📚 Documentation References

- **Full Setup Guide**: See `DODOPAYMENTS_SETUP.md`
- **API Keys Guide**: See `API_KEYS_COMPREHENSIVE_GUIDE.md`
- **DodoPayments Docs**: https://docs.dodopayments.com/
- **Better-Auth Plugin**: https://www.better-auth.com/docs/plugins/dodopayments

---

## 💡 Quick Tips

1. **Always test in Test Mode first** before going live
2. **Monitor webhook logs** in DodoPayments dashboard during testing
3. **Use ₹2 test product** to minimize API calls
4. **Check terminal/Vercel logs** for detailed error messages
5. **Clear browser cache** if Pro status doesn't update immediately

---

## 🎉 Ready to Test!

Once you add the **Test API Key** to `.env.local`:

```bash
# Start development server
pnpm dev

# Open in browser
http://localhost:3000/admin

# Click "Test ₹2 Payment" and follow the flow!
```

**Need the API key?** Go to [DodoPayments Dashboard](https://dodopayments.com/) → Test Mode → Settings → API Keys

---

**Last Updated**: Current configuration with test webhook secret and product ID
**Status**: ⚠️ Waiting for Test API Key from DodoPayments Dashboard
