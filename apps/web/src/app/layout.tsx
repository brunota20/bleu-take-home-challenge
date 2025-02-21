import type { Metadata } from 'next';
import { Rubik } from 'next/font/google';
import './globals.css';
import Header from '@/components/header';
import { cn } from '@/lib/utils';
import { Providers } from '@/providers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const rubik = Rubik({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Bleu Take-Home',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(rubik.className, 'bg-background text-foreground')}>
        <Providers>
          <Header />
          <ToastContainer position="top-right" autoClose={5000} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
