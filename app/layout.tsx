import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Clean Energy UK - Energy Mix & Optimal Charging',
  description: 'View UK energy mix and find optimal electric vehicle charging windows',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

