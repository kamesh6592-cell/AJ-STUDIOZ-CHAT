import { NextRequest, NextResponse } from 'next/server';
import { getComprehensiveUserData } from '@/lib/user-data-server';

export async function POST(request: NextRequest) {
  try {
    const userData = await getComprehensiveUserData();
    
    if (!userData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Use test product in development, main product in production
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const testProductSlug = process.env.NEXT_PUBLIC_TEST_PREMIUM_SLUG || 'starter';
    const productionSlug = process.env.NEXT_PUBLIC_PREMIUM_SLUG || 'pro-plan-dodo';
    
    const checkoutSlug = isDevelopment ? testProductSlug : productionSlug;

    // Create checkout URL with the appropriate product
    const checkoutUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/dodopayments/checkout?slug=${checkoutSlug}`;

    return NextResponse.json({
      success: true,
      checkoutUrl,
      message: isDevelopment 
        ? `Test checkout with ${testProductSlug} product` 
        : `Production checkout with ${productionSlug} product`,
      mode: isDevelopment ? 'test' : 'production',
      productSlug: checkoutSlug,
      provider: 'dodopayments',
    });
  } catch (error) {
    console.error('DodoPayments test checkout error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to create test payment session';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        provider: 'dodopayments-test',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'DodoPayments test checkout endpoint',
    supportedMethods: ['POST'],
    testAmount: '₹2 INR',
  });
}
