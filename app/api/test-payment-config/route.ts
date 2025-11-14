import { NextResponse } from 'next/server';

export async function GET() {
  const isDevelopment = process.env.NODE_ENV !== 'production';

  // Test DodoPayments configuration
  const dodoTest = {
    production: {
      hasApiKey: !!process.env.DODO_PAYMENTS_API_KEY,
      apiKeyValue: process.env.DODO_PAYMENTS_API_KEY ? `${process.env.DODO_PAYMENTS_API_KEY.slice(0, 8)}...` : 'NOT_SET',
      hasWebhookSecret: !!process.env.DODO_PAYMENTS_WEBHOOK_SECRET,
    },
    test: {
      hasApiKey: !!process.env.DODO_PAYMENTS_TEST_API_KEY,
      apiKeyValue: process.env.DODO_PAYMENTS_TEST_API_KEY ? `${process.env.DODO_PAYMENTS_TEST_API_KEY.slice(0, 8)}...` : 'NOT_SET',
      hasWebhookSecret: !!process.env.DODO_PAYMENTS_TEST_WEBHOOK_SECRET,
    },
    activeMode: isDevelopment ? 'test' : 'production',
    productSlug: process.env.NEXT_PUBLIC_PREMIUM_SLUG || process.env.NEXT_PUBLIC_TEST_PREMIUM_SLUG || 'NOT_SET',
    productId: process.env.NEXT_PUBLIC_PREMIUM_TIER || process.env.NEXT_PUBLIC_TEST_PRODUCT_ID || 'NOT_SET',
    environment: process.env.NODE_ENV
  };

  // Overall status
  const activeConfig = isDevelopment ? dodoTest.test : dodoTest.production;
  const overallStatus = {
    dodoReady: activeConfig.hasApiKey && !!dodoTest.productSlug,
    mode: isDevelopment ? 'test (safe for development)' : 'production (real payments)',
  };

  // Instructions based on current state
  const instructions = [];

  if (isDevelopment) {
    if (!dodoTest.test.hasApiKey && !dodoTest.production.hasApiKey) {
      instructions.push('1. Set DODO_PAYMENTS_TEST_API_KEY in .env.local (from DodoPayments Test Mode)');
    }
    if (!process.env.NEXT_PUBLIC_TEST_PRODUCT_ID && !process.env.NEXT_PUBLIC_PREMIUM_TIER) {
      instructions.push('2. Set NEXT_PUBLIC_TEST_PRODUCT_ID in .env.local');
    }
    if (!process.env.NEXT_PUBLIC_TEST_PREMIUM_SLUG && !process.env.NEXT_PUBLIC_PREMIUM_SLUG) {
      instructions.push('3. Set NEXT_PUBLIC_TEST_PREMIUM_SLUG=starter in .env.local');
    }
  } else {
    if (!dodoTest.production.hasApiKey) {
      instructions.push('1. Set DODO_PAYMENTS_API_KEY in Vercel environment variables (from DodoPayments Live Mode)');
    }
    if (!process.env.NEXT_PUBLIC_PREMIUM_TIER) {
      instructions.push('2. Set NEXT_PUBLIC_PREMIUM_TIER in Vercel environment variables');
    }
    if (!process.env.NEXT_PUBLIC_PREMIUM_SLUG) {
      instructions.push('3. Set NEXT_PUBLIC_PREMIUM_SLUG=pro-plan-dodo in Vercel environment variables');
    }
  }

  if (activeConfig.hasApiKey && dodoTest.productSlug !== 'NOT_SET') {
    instructions.push(`4. Verify product exists in DodoPayments dashboard (${isDevelopment ? 'Test' : 'Live'} Mode) with slug "${dodoTest.productSlug}"`);
  }

  return NextResponse.json({
    status: overallStatus.dodoReady ? 'READY' : 'NOT_READY',
    dodoPayments: dodoTest,
    overall: overallStatus,
    nextSteps: instructions,
    timestamp: new Date().toISOString(),
    message: overallStatus.dodoReady 
      ? `DodoPayments is configured and ready (${overallStatus.mode})`
      : 'DodoPayments needs configuration'
  });
}