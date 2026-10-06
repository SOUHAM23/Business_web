import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sanchay Path | Admin Portal',
  description: 'Secure Management Portal for Sanchay Path Financial Services',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
