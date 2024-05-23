// src/pages/_app.tsx
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@/components/theme-provider';
import Navbar from '@/components/ui/navbar';
import '@/app/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <Navbar />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
