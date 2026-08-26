"use client";

import { signOut } from 'next-auth/react';
import { useEffect } from 'react';

export default function LogoutPage() {
  useEffect(() => {
    void signOut({ callbackUrl: '/login' });
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="text-slate-600">Signing out...</p>
    </main>
  );
}
