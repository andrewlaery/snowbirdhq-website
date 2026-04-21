import { redirect } from 'next/navigation';

// Legacy Supabase magic-link flow retired (project deleted 2026-04-20).
// Funnel any leftover links to the password gate.
export default function SignInPage() {
  redirect('/access');
}
