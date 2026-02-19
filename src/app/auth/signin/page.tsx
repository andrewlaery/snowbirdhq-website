'use client';

import { useState } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SignInForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>(
    'idle'
  );
  const [errorMessage, setErrorMessage] = useState('');
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/docs';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setStatus('error');
        return;
      }

      setStatus('sent');
    } catch {
      setErrorMessage('Something went wrong. Please try again.');
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6">
        <h1 className="mb-4 font-serif text-3xl font-semibold text-fd-foreground">
          Check your email
        </h1>
        <p className="text-center text-fd-muted-foreground">
          We&apos;ve sent a magic link to <strong>{email}</strong>. Click the
          link in the email to sign in.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6">
      <h1 className="mb-2 font-serif text-3xl font-semibold text-fd-foreground">
        Sign In
      </h1>
      <p className="mb-8 text-fd-muted-foreground">
        Access owner documentation and internal resources.
      </p>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg border border-fd-border bg-fd-background px-4 py-3 text-fd-foreground placeholder:text-fd-muted-foreground focus:border-fd-primary focus:outline-none focus:ring-1 focus:ring-fd-primary"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full rounded-lg bg-fd-primary px-4 py-3 font-medium text-fd-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {status === 'loading' ? 'Sending...' : 'Send Magic Link'}
        </button>
      </form>

      {status === 'error' && (
        <p className="mt-4 text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
