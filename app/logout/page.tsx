"use client";

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    signOut({ callbackUrl: '/login' }).finally(() => router.push('/login'));
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="text-slate-600">Signing out...</p>
    </main>
  );
}
