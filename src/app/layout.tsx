// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './styles/globals.css';
import Header from '../components/Header'; 

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My Homepage',
  description: 'Welcome to my website!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}