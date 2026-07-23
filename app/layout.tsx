import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "../components/header";
import Footer from "../components/footer";
import { GoogleTagManager } from '@next/third-parties/google';

export const metadata: Metadata = {
  title: "Manbyd",
  description: "Simple website to show my skills and services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <Script
	src="https://kit.fontawesome.com/7d7f9a4e76.js"
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />
      <body className="flex min-h-full flex-col bg-slate-950 text-slate-100">
        <Header />
        {children}
        <Footer />
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID!} />
      </body>
    </html>
  );
}

