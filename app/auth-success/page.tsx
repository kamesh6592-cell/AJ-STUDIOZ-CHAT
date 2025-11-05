'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

/**
 * Post-OAuth success page that triggers email notification
 * This page is redirected to after successful social login
 */
export default function AuthSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const sendEmailNotification = async () => {
      try {
        console.log('📧 Sending post-login email notification...');
        
        // Send email notification
        const response = await fetch('/api/auth/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'login' }),
        });

        const data = await response.json();
        console.log('Email notification response:', data);

        // Redirect to home page after email is sent
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } catch (error) {
        console.error('Failed to send email notification:', error);
        // Still redirect even if email fails
        router.push('/');
      }
    };

    sendEmailNotification();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
        <h2 className="text-xl font-medium">Completing sign in...</h2>
        <p className="text-sm text-muted-foreground">You'll be redirected shortly</p>
      </div>
    </div>
  );
}
