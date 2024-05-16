import React from 'react';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/context/auth-context';
import Head from 'next/head';
import Navbar from '@/components/Navbar';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Head>
        <title>GeoData Management System</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Welcome to GeoData Management System" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navbar />
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
