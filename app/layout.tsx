import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LocalPro',
  description: 'A local service marketplace for finding trusted providers.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
