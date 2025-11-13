export async function GET() {
  const keys = {
    openai: !!process.env.OPENAI_API_KEY,
    anthropic: !!process.env.ANTHROPIC_API_KEY,
    groq: !!process.env.GROQ_API_KEY,
    xai: !!process.env.XAI_API_KEY,
    google: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  };

  // Payment configuration debug info
  const paymentConfig = {
    cashfree: {
      hasAppId: !!process.env.CASHFREE_APP_ID,
      hasSecretKey: !!process.env.CASHFREE_SECRET_KEY,
      hasWebhookSecret: !!process.env.CASHFREE_WEBHOOK_SECRET,
      appIdLength: process.env.CASHFREE_APP_ID?.length || 0,
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
    }
  };

  // Check for payment issues
  const paymentIssues = [];
  
  if (!process.env.CASHFREE_APP_ID) {
    paymentIssues.push('❌ Missing CASHFREE_APP_ID');
  }
  
  if (!process.env.CASHFREE_SECRET_KEY) {
    paymentIssues.push('❌ Missing CASHFREE_SECRET_KEY');
  }
  
  if (!process.env.DODO_PAYMENTS_API_KEY) {
    paymentIssues.push('❌ Missing DODO_PAYMENTS_API_KEY');
  }
  
  if (!process.env.NEXT_PUBLIC_PREMIUM_SLUG) {
    paymentIssues.push('❌ Missing NEXT_PUBLIC_PREMIUM_SLUG');
  }
  
  return Response.json({ 
    status: 'ok', 
    apiKeys: keys,
    paymentConfig,
    paymentIssues,
    paymentStatus: paymentIssues.length === 0 ? '✅ Payment config looks good!' : '⚠️ Payment config has issues',
    timestamp: new Date().toISOString()
  });
}
