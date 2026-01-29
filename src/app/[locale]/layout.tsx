import type { Metadata } from "next";
import { GoogleAnalytics } from '@next/third-parties/google';
import { GoogleTags } from "@/components/analytics/google-tags";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/ecommerce/cart-provider";
import { CurrencyProvider } from "@/components/currency-provider";

import { CommandMenu } from "@/components/layout/command-menu";
import { BackToTop } from "@/components/layout/back-to-top";
import { SocialProof } from "@/components/marketing/social-proof";
import { CookieBanner } from "@/components/cookie-banner";
import { ChatWidget } from "@/components/chat/chat-widget";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { PromoBanner } from "@/components/layout/promo-banner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "sonner";
import { ScrollProgress } from "@/components/ui/scroll-progress";

import { SessionProvider } from "@/components/auth/session-provider";
import { Analytics } from "@vercel/analytics/react";
import { SWRegistration } from "@/components/sw-registration";
import Script from "next/script";
import { RecaptchaProvider } from "@/components/recaptcha-provider";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: {
      default: t('title'),
      template: "%s | BacklineIT"
    },
    description: t('description'),
    keywords: ["BacklineIT", "IT szolgáltatás", "webfejlesztes", "automatizacio", "python script", "devops", "biztonsagi audit", "egyedi szoftver"],
    authors: [{ name: "BacklineIT Team" }],
    creator: "BacklineIT Team",
    openGraph: {
      type: "website",
      locale: locale === 'hu' ? 'hu_HU' : 'en_US',
      url: "https://backlineit.hu",
      title: t('title'),
      description: t('description'),
      siteName: "BacklineIT",
    },
    twitter: {
      card: "summary_large_image",
      title: "BacklineIT",
      description: t('description'),
      creator: "@backlineit",
    },
    metadataBase: new URL("https://backlineit.hu"),
    alternates: {
      canonical: '/',
      languages: {
        'hu': '/hu',
        'en': '/en',
      },
    },
    verification: {
      google: "w5GusFwWrjuwRjB6Et93XNbdps97gw7pOuMeX4a5pbY",
    },
  };
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "BacklineIT",
  "url": "https://backlineit.hu",
  "logo": "https://backlineit.hu/logo.png",
  "sameAs": [
    "https://facebook.com/backlineit",
    "https://linkedin.com/company/backlineit"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+36-30-123-4567",
    "contactType": "customer service",
    "areaServed": "HU",
    "availableLanguage": "Hungarian"
  }
}

import { MaintenanceBanner } from "@/components/layout/maintenance-banner";

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased`}
      >
        <SWRegistration />
        <GoogleTags />
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "v4j4gxnvth");
            `,
          }}
        />
        <NextIntlClientProvider messages={messages}>
          <SessionProvider>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <ScrollProgress />
            <RecaptchaProvider>
              <CurrencyProvider>
                <CartProvider>
                  <MaintenanceBanner />
                  <PromoBanner />

                  <Header />
                  <div className="relative z-10">
                    {children}
                  </div>

                  <Footer />
                  <CommandMenu />
                  <BackToTop />
                  <SocialProof />
                  <CookieBanner />
                  <ChatWidget />
                  <Analytics />
                  <Toaster position="bottom-right" theme="dark" />
                </CartProvider>
              </CurrencyProvider>
            </RecaptchaProvider>
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html >
  );
}
