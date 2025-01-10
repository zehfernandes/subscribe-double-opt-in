'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ConfirmPage() {
  const [message, setMessage] = useState('Confirming your subscription...');
  const searchParams = useSearchParams();

  useEffect(() => {
    const confirmEmail = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setMessage('Invalid confirmation link');
        return;
      }

      try {
        const response = await fetch(`/api/confirm?token=${encodeURIComponent(token)}`);
        const data = await response.json();

        if (response.ok) {
          setMessage('Email confirmed successfully! You are now subscribed.');
        } else {
          setMessage(data.error || 'An error occurred during confirmation');
        }
      } catch (error) {
        console.error('Error confirming email:', error);
        setMessage('An error occurred during confirmation');
      }
    };

    confirmEmail();
  }, [searchParams]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Subscription Confirmation</h1>
      <p className="text-xl">{message}</p>
    </main>
  );
}

