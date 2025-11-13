import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  // This endpoint helps debug payment configuration issues
  const config = {
    environment: process.env.NODE_ENV,
    cashfree: {
      hasAppId: !!process.env.CASHFREE_APP_ID,
      hasSecretKey: !!process.env.CASHFREE_SECRET_KEY,
      hasWebhookSecret: !!process.env.CASHFREE_WEBHOOK_SECRET,
      appIdLength: process.env.CASHFREE_APP_ID?.length || 0,
      baseUrl: process.env.NODE_ENV === 'production' 
        ? 'https://api.cashfree.com/pg' 
        : 'https://sandbox.cashfree.com/pg',
    },
    dodoPayments: {
      hasApiKey: !!process.env.DODO_PAYMENTS_API_KEY,
      hasWebhookSecret: !!process.env.DODO_PAYMENTS_WEBHOOK_SECRET,
      apiKeyLength: process.env.DODO_PAYMENTS_API_KEY?.length || 0,
    },
    products: {
      premiumTier: process.env.NEXT_PUBLIC_PREMIUM_TIER,
      premiumSlug: process.env.NEXT_PUBLIC_PREMIUM_SLUG,
      cashfreeProductId: process.env.NEXT_PUBLIC_CASHFREE_PRODUCT_ID,
    },
    app: {
      url: process.env.NEXT_PUBLIC_APP_URL,
      betterAuthUrl: process.env.BETTER_AUTH_URL,
    }
  };

  // Check for common issues
  const issues = [];
  
  if (!process.env.CASHFREE_APP_ID) {
    issues.push('Missing CASHFREE_APP_ID - Get this from Cashfree Dashboard → API → Keys');
  }
  
  if (!process.env.CASHFREE_SECRET_KEY) {
    issues.push('Missing CASHFREE_SECRET_KEY - Get this from Cashfree Dashboard → API → Keys');
  }
  
  if (!process.env.DODO_PAYMENTS_API_KEY) {
    issues.push('Missing DODO_PAYMENTS_API_KEY - Get this from DodoPayments Dashboard → Settings → API Keys');
  }
  
  if (!process.env.NEXT_PUBLIC_PREMIUM_SLUG) {
    issues.push('Missing NEXT_PUBLIC_PREMIUM_SLUG - This should match your product slug in DodoPayments dashboard');
  }

  return NextResponse.json({
    config,
    issues,
    message: issues.length > 0 
      ? 'Configuration issues found. Fix these to resolve payment errors.'
      : 'Payment configuration looks good!',
    timestamp: new Date().toISOString(),
  });
}