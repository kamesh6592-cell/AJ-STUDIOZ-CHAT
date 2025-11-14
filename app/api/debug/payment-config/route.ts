import { NextResponse } from 'next/server';

export async function GET() {
  // This endpoint helps debug payment configuration issues
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  const config = {
    environment: process.env.NODE_ENV,
    dodoPayments: {
      production: {
        hasApiKey: !!process.env.DODO_PAYMENTS_API_KEY,
        hasWebhookSecret: !!process.env.DODO_PAYMENTS_WEBHOOK_SECRET,
        apiKeyLength: process.env.DODO_PAYMENTS_API_KEY?.length || 0,
      },
      test: {
        hasApiKey: !!process.env.DODO_PAYMENTS_TEST_API_KEY,
        hasWebhookSecret: !!process.env.DODO_PAYMENTS_TEST_WEBHOOK_SECRET,
        apiKeyLength: process.env.DODO_PAYMENTS_TEST_API_KEY?.length || 0,
      },
      activeMode: isDevelopment ? 'test' : 'production',
    },
    products: {
      production: {
        tier: process.env.NEXT_PUBLIC_PREMIUM_TIER,
        slug: process.env.NEXT_PUBLIC_PREMIUM_SLUG,
      },
      test: {
        productId: process.env.NEXT_PUBLIC_TEST_PRODUCT_ID,
        slug: process.env.NEXT_PUBLIC_TEST_PREMIUM_SLUG,
      },
      activeProducts: isDevelopment 
        ? 'Using test product' 
        : 'Using production product',
    },
    app: {
      url: process.env.NEXT_PUBLIC_APP_URL,
      betterAuthUrl: process.env.BETTER_AUTH_URL,
    }
  };

  // Check for common issues
  const issues = [];
  
  if (isDevelopment) {
    if (!process.env.DODO_PAYMENTS_TEST_API_KEY && !process.env.DODO_PAYMENTS_API_KEY) {
      issues.push('Missing DODO_PAYMENTS_TEST_API_KEY - Get this from DodoPayments Dashboard (Test Mode) → Settings → API Keys');
    }
    if (!process.env.NEXT_PUBLIC_TEST_PRODUCT_ID && !process.env.NEXT_PUBLIC_PREMIUM_TIER) {
      issues.push('Missing NEXT_PUBLIC_TEST_PRODUCT_ID - Create a test product in DodoPayments Dashboard');
    }
  } else {
    if (!process.env.DODO_PAYMENTS_API_KEY) {
      issues.push('Missing DODO_PAYMENTS_API_KEY - Get this from DodoPayments Dashboard (Live Mode) → Settings → API Keys');
    }
    if (!process.env.NEXT_PUBLIC_PREMIUM_TIER) {
      issues.push('Missing NEXT_PUBLIC_PREMIUM_TIER - Create a product in DodoPayments Dashboard');
    }
  }
  
  if (!process.env.NEXT_PUBLIC_PREMIUM_SLUG && !process.env.NEXT_PUBLIC_TEST_PREMIUM_SLUG) {
    issues.push('Missing product slug - Set NEXT_PUBLIC_PREMIUM_SLUG or NEXT_PUBLIC_TEST_PREMIUM_SLUG');
  }

  return NextResponse.json({
    config,
    issues,
    message: issues.length > 0 
      ? 'Configuration issues found. Fix these to resolve payment errors.'
      : 'DodoPayments configuration looks good!',
    timestamp: new Date().toISOString(),
  });
}