# Payment System Setup Guide

## Overview
Your AJ STUDIOZ application now has a complete payment and subscription system with three providers:

1. **Polar** - For international subscriptions and monthly billing
2. **Cashfree** - Primary Indian payment provider (UPI, Cards, Net Banking, Wallets)
3. **DodoPayments** - Fallback Indian payment provider

## Environment Variables Setup

### Required Payment Variables
Add these to your `.env.local` file:

```bash
# Polar (International Subscriptions)
POLAR_ACCESS_TOKEN=your_polar_access_token_here
POLAR_WEBHOOK_SECRET=your_polar_webhook_secret_here
NEXT_PUBLIC_STARTER_TIER=your_polar_product_id_here  
NEXT_PUBLIC_STARTER_SLUG=your_polar_product_slug_here

# Cashfree (Primary Indian Payments)  
CASHFREE_APP_ID=your_cashfree_app_id_here
CASHFREE_SECRET_KEY=your_cashfree_secret_key_here
CASHFREE_WEBHOOK_SECRET=your_cashfree_webhook_secret_here
NEXT_PUBLIC_CASHFREE_PRODUCT_ID=your_cashfree_product_id_here

# DodoPayments (Fallback Indian Payments)
DODO_PAYMENTS_API_KEY=your_dodo_payments_api_key_here
DODO_PAYMENTS_WEBHOOK_SECRET=your_dodo_payments_webhook_secret_here
NEXT_PUBLIC_PREMIUM_TIER=your_dodo_product_id_here
NEXT_PUBLIC_PREMIUM_SLUG=your_dodo_product_slug_here
```

## How to Get API Keys

### 1. Polar Setup
1. Go to [Polar](https://polar.sh) and create an account
2. Create a product for "AJ STUDIOZ Pro" at $15/month
3. Get your Access Token from API settings
4. Set up webhook endpoint: `https://yourdomain.com/api/auth/polar/webhook`
5. Copy the webhook secret

### 2. Cashfree Setup (Recommended for India)
1. Go to [Cashfree](https://cashfree.com) and create a merchant account  
2. Complete KYC verification process
3. Get your App ID and Secret Key from dashboard
4. Set up webhook endpoint: `https://yourdomain.com/api/webhooks/cashfree`
5. Copy the webhook secret key
6. Create product for "AJ STUDIOZ Pro" at ₹1299

### 3. DodoPayments Setup (Fallback)
1. Go to [DodoPayments](https://dodopayments.com) and create an account
2. Create a product for "AJ STUDIOZ Pro" at ₹1299 + GST
3. Get your API Key from dashboard
4. Set up webhook endpoint: `https://yourdomain.com/api/auth/dodopayments/webhook`
5. Copy the webhook secret

## Payment Flow

### For Indian Users:
1. **Pricing Page**: Shows both UPI payment and subscription options
2. **Primary Payment**: One-time payment via Cashfree (₹1299 + GST)
3. **Fallback Payment**: One-time payment via DodoPayments (₹1299 + GST)  
4. **Subscription**: Monthly billing via Polar ($15/month)

### For International Users:
1. **Pricing Page**: Shows subscription option only  
2. **Monthly Subscription**: Via Polar ($15/month)

## Features Included

✅ **Complete Payment Infrastructure**
- Dual payment provider support
- Automatic subscription management
- Real-time Pro status updates
- Payment history tracking

✅ **User Experience**  
- Instant Pro activation after payment
- Customer portal for subscription management
- Detailed invoicing with GST calculation
- Success/failure handling

✅ **Admin Features**
- Subscription status API endpoint
- Webhook processing for payment confirmations  
- Comprehensive user data with payment history
- Cache management for performance

## API Endpoints

- `GET /api/subscription/status` - Check user's subscription status
- `POST /api/cashfree/checkout` - Create Cashfree payment session
- `POST /api/webhooks/cashfree` - Handle Cashfree webhooks
- `POST /api/auth/polar/webhook` - Handle Polar webhooks  
- `POST /api/auth/dodopayments/webhook` - Handle DodoPayments webhooks
- `POST /api/webhooks/payments` - Additional webhook processing

## Testing

1. Set up test products in both Polar and DodoPayments
2. Use sandbox/test mode API keys
3. Test payment flows:
   - Indian UPI payment → Pro activation
   - International subscription → Pro activation  
   - Webhook processing → Status updates

## Production Deployment

1. Update environment variables with production API keys
2. Set webhook URLs to your production domain
3. Test payment flows in production
4. Monitor webhook processing and error logs

## Support

The system automatically handles:
- Payment processing and confirmations
- Pro status activation/deactivation  
- Subscription renewals and cancellations
- Invoice generation and GST calculation
- Customer portal access for subscription management

For issues, check the webhook logs and ensure all environment variables are correctly set.