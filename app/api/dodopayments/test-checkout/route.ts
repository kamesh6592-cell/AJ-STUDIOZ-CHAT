import { NextRequest, NextResponse } from 'next/server';
import { getComprehensiveUserData } from '@/lib/user-data-server';
import { dodoPayments } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const userData = await getComprehensiveUserData();
    
    if (!userData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!dodoPayments) {
      return NextResponse.json(
        { error: 'DodoPayments not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { returnUrl } = body;

    // Generate unique reference ID for test payment
    const referenceId = `TEST_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create test checkout session with DodoPayments (₹2 only)
    const checkoutSession = await dodoPayments.misc.createPaymentLink({
      amount: 200, // ₹2 in paise (DodoPayments uses smallest currency unit)
      currency: 'INR',
      description: 'Test Payment - AJ STUDIOZ Pro Trial',
      customer: {
        email: userData.email,
        name: userData.name,
      },
      metadata: {
        isTestPayment: 'true',
        userId: userData.id,
        referenceId,
      },
      redirect_url: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/success?provider=dodo&test=true&ref=${referenceId}`,
    });

    return NextResponse.json({
      success: true,
      referenceId,
      checkoutUrl: checkoutSession.url,
      amount: 2,
      currency: 'INR',
      isTestPayment: true,
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
