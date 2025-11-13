'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { authClient, betterauthClient } from '@/lib/auth-client';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PRICING, SEARCH_LIMITS } from '@/lib/constants';
import { DiscountBanner } from '@/components/ui/discount-banner';
import { getDiscountConfigAction } from '@/app/actions';
import { DiscountConfig } from '@/lib/discount';
import { useLocation } from '@/hooks/use-location';
import { ComprehensiveUserData } from '@/lib/user-data-server';
import { StudentDomainRequestButton } from '@/components/student-domain-request-button';
import { SupportedDomainsList } from '@/components/supported-domains-list';

type SubscriptionDetails = {
  id: string;
  productId: string;
  status: string;
  amount: number;
  currency: string;
  recurringInterval: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt: Date | null;
  organizationId: string | null;
};

type SubscriptionDetailsResult = {
  hasSubscription: boolean;
  subscription?: SubscriptionDetails;
  error?: string;
  errorType?: 'CANCELED' | 'EXPIRED' | 'GENERAL';
};

interface PricingTableProps {
  subscriptionDetails: SubscriptionDetailsResult;
  user: ComprehensiveUserData | null;
}

export default function PricingTable({ subscriptionDetails, user }: PricingTableProps) {
  const router = useRouter();
  const location = useLocation();

  // Debug logging (can be removed in production)
  console.log('PricingTable Debug:', {
    subscriptionDetails,
    userProStatus: user
      ? {
        id: user.id,
        isProUser: user.isProUser,
        proSource: user.proSource,
        hasPolarSubscription: !!user.polarSubscription,
        polarSubStatus: user.polarSubscription?.status,
        polarSubProductId: user.polarSubscription?.productId,
      }
      : null,
  });

  const [discountConfig, setDiscountConfig] = useState<DiscountConfig>({ enabled: false });

  useEffect(() => {
    const fetchDiscountConfig = async () => {
      try {
        const config = await getDiscountConfigAction();
        const isDevMode = config.dev || process.env.NODE_ENV === 'development';

        console.log('Discount Config Debug:', {
          config,
          isDevMode,
          nodeEnv: process.env.NODE_ENV,
          hasCode: !!config.code,
          hasMessage: !!config.message,
          enabled: config.enabled,
          dev: config.dev
        });

        if ((config.enabled || isDevMode) && !config.originalPrice) {
          config.originalPrice = PRICING.PRO_MONTHLY;
        }
        setDiscountConfig(config);
      } catch (error) {
        console.error('Failed to fetch discount config:', error);
      }
    };

    fetchDiscountConfig();
  }, []);

  // Helper function to calculate discounted price
  const getDiscountedPrice = (originalPrice: number, isINR: boolean = false) => {
    // TEMPORARY: Force disable all discounts
    if (process.env.NEXT_PUBLIC_DISABLE_DISCOUNTS === 'true') {
      return originalPrice;
    }

    const isDevMode = discountConfig.dev || process.env.NODE_ENV === 'development';
    const shouldApplyDiscount = isDevMode
      ? discountConfig.code && discountConfig.message
      : discountConfig.enabled && discountConfig.code && discountConfig.message;

    if (!shouldApplyDiscount) {
      return originalPrice;
    }

    // Use INR price directly if available
    if (isINR && discountConfig.inrPrice) {
      return discountConfig.inrPrice;
    }

    // Use final price directly if available (for student discounts)
    if (!isINR && discountConfig.finalPrice) {
      return discountConfig.finalPrice;
    }

    // Apply percentage discount
    if (discountConfig.percentage) {
      return Math.round(originalPrice - (originalPrice * discountConfig.percentage) / 100);
    }

    return originalPrice;
  };

  // Check if discount should be shown
  const shouldShowDiscount = () => {
    // TEMPORARY: Force disable all discounts
    if (process.env.NEXT_PUBLIC_DISABLE_DISCOUNTS === 'true') {
      console.log('Discounts disabled via NEXT_PUBLIC_DISABLE_DISCOUNTS');
      return false;
    }

    const isDevMode = discountConfig.dev || process.env.NODE_ENV === 'development';
    const hasRequiredFields = discountConfig.code && discountConfig.message;
    const hasDiscountValue = discountConfig.percentage || discountConfig.inrPrice || discountConfig.finalPrice;

    const result = isDevMode
      ? hasRequiredFields && hasDiscountValue
      : discountConfig.enabled && hasRequiredFields && hasDiscountValue;

    console.log('shouldShowDiscount Debug:', {
      isDevMode,
      hasCode: !!discountConfig.code,
      hasMessage: !!discountConfig.message,
      hasPercentage: !!discountConfig.percentage,
      hasInrPrice: !!discountConfig.inrPrice,
      hasFinalPrice: !!discountConfig.finalPrice,
      enabled: discountConfig.enabled,
      hasRequiredFields,
      hasDiscountValue,
      result
    });

    return result;
  };

  const handleCheckout = async () => {
    if (!user) {
      router.push('/sign-up');
      return;
    }

    try {
      // Always use DodoPayments/Cashfree checkout
      router.push('/checkout');
    } catch (error) {
      console.error('Checkout failed:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleManageSubscription = async () => {
    try {
      // Always use DodoPayments customer portal
      await betterauthClient.dodopayments.customer.portal();
    } catch (error) {
      console.error('Failed to open customer portal:', error);
      toast.error('Failed to open subscription management');
    }
  };

  // Payment provider configuration (DodoPayments + Cashfree only)
  const PREMIUM_TIER = process.env.NEXT_PUBLIC_PREMIUM_TIER || 'aj_studioz_pro_dodo';
  const PREMIUM_SLUG = process.env.NEXT_PUBLIC_PREMIUM_SLUG || 'pro-plan-dodo';
  const CASHFREE_PRODUCT_ID = process.env.NEXT_PUBLIC_CASHFREE_PRODUCT_ID || 'aj_studioz_pro_1299';

  // Check if we have payment configuration
  if (!PREMIUM_TIER || !PREMIUM_SLUG || !CASHFREE_PRODUCT_ID) {
    console.error('Missing payment provider configuration:', {
      PREMIUM_TIER,
      PREMIUM_SLUG,
      CASHFREE_PRODUCT_ID,
      env: process.env.NODE_ENV
    });
    
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Payment Configuration Missing</h2>
          <p className="text-muted-foreground mb-4">
            Indian payment providers are not configured. Please set up:
          </p>
          <ul className="text-sm text-left bg-muted p-4 rounded-lg space-y-2">
            <li>• NEXT_PUBLIC_PREMIUM_TIER</li>
            <li>• NEXT_PUBLIC_PREMIUM_SLUG</li>
            <li>• NEXT_PUBLIC_CASHFREE_PRODUCT_ID</li>
          </ul>
          <p className="text-xs text-muted-foreground mt-4">
            Configure these in your Vercel environment variables.
          </p>
        </div>
      </div>
    );
  }

  // Check if user has active DodoPayments subscription
  const hasDodoSubscription = () => {
    return user?.isProUser === true && user?.proSource === 'dodo';
  };

  // Check if user has Pro status (DodoPayments only)
  const hasProAccess = () => {
    return hasDodoSubscription();
  };

  // Get the source of Pro access for display
  const getProAccessSource = () => {
    if (hasDodoSubscription()) return 'dodo';
    return null;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 pt-12">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 px-4 py-2 rounded-full border border-green-200 dark:border-green-800 mb-4">
            <span className="text-green-600 dark:text-green-400 font-medium text-sm">🎉 LAUNCH SPECIAL</span>
          </div>
          <h1 className="text-4xl font-medium text-foreground mb-4 font-be-vietnam-pro">Affordable AI Power</h1>
          <p className="text-xl text-muted-foreground">Unlimited AI research for just ₹249/month</p>
          <Badge variant="secondary" className="mt-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
            🇮🇳 All Indian payment methods • Instant activation
          </Badge>
        </div>
      </div>

      {/* Discount Banner */}
      {shouldShowDiscount() && (
        <div className="max-w-4xl mx-auto px-6 sm:px-16 mb-8">
          <DiscountBanner discountConfig={discountConfig} className="mx-auto" />
        </div>
      )}

      {/* Pricing Cards */}
      <div className="max-w-4xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Plan */}
          <Card className="relative">
            <CardHeader className="pb-4">
              <h3 className="text-xl font-medium">Free</h3>
              <div className="flex items-baseline">
                <span className="text-4xl font-light">$0</span>
                <span className="text-muted-foreground ml-2">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                <li className="flex items-center text-muted-foreground">
                  <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mr-3 flex-shrink-0"></div>
                  {SEARCH_LIMITS.DAILY_SEARCH_LIMIT} searches per day
                </li>
                <li className="flex items-center text-muted-foreground">
                  <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mr-3 flex-shrink-0"></div>
                  Basic AI models
                </li>
                <li className="flex items-center text-muted-foreground">
                  <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mr-3 flex-shrink-0"></div>
                  Search history
                </li>
              </ul>

              <Button variant="outline" className="w-full" disabled={!hasProAccess()}>
                {!hasProAccess() ? 'Current plan' : 'Free plan'}
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="relative border-2 border-primary">
            {hasProAccess() && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                <Badge className="bg-primary text-primary-foreground">Current plan</Badge>
              </div>
            )}
            {!hasProAccess() && shouldShowDiscount() && (
              <div className="absolute -top-3 right-4 z-10">
                <Badge variant="secondary">
                  {discountConfig.showPrice && discountConfig.finalPrice
                    ? `$${PRICING.PRO_MONTHLY - discountConfig.finalPrice} OFF for a year`
                    : discountConfig.percentage
                      ? `${discountConfig.percentage}% OFF`
                      : 'DISCOUNT'}
                </Badge>
              </div>
            )}

            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-medium">AJ STUDIOZ Pro</h3>
                <Badge variant="secondary">Popular</Badge>
              </div>

              {/* Pricing Display */}
              {hasProAccess() ? (
                // Show user's current pricing (DodoPayments only)
                <div className="flex items-baseline">
                  <span className="text-4xl font-light">₹{PRICING.PRO_MONTHLY_INR}</span>
                  <span className="text-muted-foreground ml-2">+GST</span>
                </div>
              ) : (
                // Show Indian pricing options
                <div className="flex items-baseline">
                  {shouldShowDiscount() ? (
                    <div className="flex items-baseline gap-3">
                      <span className="text-xl text-muted-foreground line-through">
                        ₹{PRICING.PRO_MONTHLY_INR}
                      </span>
                      <span className="text-4xl font-light">
                        ₹{getDiscountedPrice(PRICING.PRO_MONTHLY_INR, true)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-4xl font-light text-green-600 dark:text-green-400">₹{PRICING.PRO_MONTHLY_INR}</span>
                  )}
                  <span className="text-muted-foreground ml-2">+GST</span>
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                  Unlimited searches
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                  All AI models
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                  PDF analysis
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                  Priority support
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                  AJ STUDIOZ Lookout
                </li>
              </ul>

              {hasProAccess() ? (
                <div className="space-y-4">
                  <Button className="w-full" onClick={handleManageSubscription}>
                    Manage payment
                  </Button>
                  {user?.dodoPayments?.expiresAt && (
                    <p className="text-sm text-muted-foreground text-center">
                      Access expires {formatDate(new Date(user.dodoPayments.expiresAt))}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <Button className="w-full group bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 h-12" onClick={handleCheckout}>
                    {!user ? '🚀 Get Started - ₹249' : `🎉 Upgrade Now - ₹${getDiscountedPrice(PRICING.PRO_MONTHLY_INR, true)}`}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                    <p className="text-sm text-green-800 dark:text-green-200 text-center font-medium">
                      🎊 Launch Special: 80% OFF • Limited Time
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300 text-center mt-1">
                      🇮🇳 UPI, Cards, Net Banking • Instant Activation
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Secure payments by Cashfree & DodoPayments
                  </p>
                  {shouldShowDiscount() && discountConfig.discountAvail && (
                    <p className="text-xs text-primary text-center font-medium">{discountConfig.discountAvail}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Student Discount */}
        {!discountConfig.isStudentDiscount && (
          <Card className="max-w-2xl mx-auto mt-16">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="font-medium mb-2">🎓 Student discount available</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get Pro for just $5/month! Simply sign up with your university email address and the discount will be
                  applied automatically.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
                  <SupportedDomainsList />
                  <span className="text-xs text-muted-foreground">or</span>
                  <StudentDomainRequestButton />
                </div>
                <p className="text-xs text-muted-foreground">
                  Check if your university is already supported, or request to add a new domain.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Student Discount Active */}
        {discountConfig.isStudentDiscount && !hasProAccess() && (
          <Card className="max-w-2xl mx-auto mt-16 border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="font-medium mb-2 text-primary">🎓 Student discount active!</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your university email domain has been automatically recognized. Get Pro for just $5/month.
                </p>
                <p className="text-xs text-muted-foreground">Discount automatically applied at checkout</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-16 space-y-4">
          <p className="text-sm text-muted-foreground">
            By subscribing, you agree to our{' '}
            <Link href="/terms" className="text-foreground hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy-policy" className="text-foreground hover:underline">
              Privacy Policy
            </Link>
          </p>
          <p className="text-sm text-muted-foreground">
            Questions?{' '}
            <a href="mailto:support@ajstudioz.co.in" className="text-foreground hover:underline">
              Get in touch
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
