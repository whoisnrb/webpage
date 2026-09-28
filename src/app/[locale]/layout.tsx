import type { Metadata } from "next";
import { GoogleAnalytics } from '@next/third-parties/google';
import { GoogleTags } from "@/components/analytics/google-tags";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/ecommerce/cart-provider";
import { CurrencyProvider } from "@/components/currency-provider";
import { NeuralBackground } from "@/components/neural-background";

import { CommandMenu } from "@/components/layout/command-menu";
import { BackToTop } from "@/components/layout/back-to-top";
import { CookieBanner } from "@/components/cookie-banner";
import { ChatWidget } from "@/components/chat/chat-widget";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileFab } from "@/components/layout/mobile-fab";
import { Toaster } from "sonner";
import { ScrollProgress } from "@/components/ui/scroll-progress";

import { SessionProvider } from "@/components/auth/session-provider";
import { Analytics } from "@vercel/analytics/react";
import { SWRegistration } from "@/components/sw-registration";
import Script from "next/script";
import { RecaptchaProvider } from "@/components/recaptcha-provider";
import { routing } from '@/i18n/routing';


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

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
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      types: {
        'application/rss+xml': '/rss.xml',
      },
    },
    verification: {
      google: "w5GusFwWrjuwRjB6Et93XNbdps97gw7pOuMeX4a5pbY",
    },
    appleWebApp: {
      title: "BacklineIT",
      statusBarStyle: "black-translucent",
    },
  };
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://backlineit.hu/#organization",
  "name": "BacklineIT",
  "url": "https://backlineit.hu",
  "logo": "https://backlineit.hu/logo.png",
  "sameAs": [
    "https://facebook.com/backlineit",
    "https://linkedin.com/company/backlineit"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+36501034140",
    "contactType": "customer service",
    "areaServed": "HU",
    "availableLanguage": ["Hungarian", "English"]
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Vörösmarty utca 11.",
    "addressLocality": "Csömör",
    "postalCode": "2141",
    "addressCountry": "HU"
  }
}


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
        {/* TikTok Pixel */}
        <Script
          id="tiktok-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
                var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
                ;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
                ttq.load('DAT40JBC77U88MSOA36G');
                ttq.page();
              }(window, document, 'ttq');
            `,
          }}
        />
        <NextIntlClientProvider messages={messages}>
          <SessionProvider>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <NeuralBackground />
            <ScrollProgress />
            <RecaptchaProvider>
              <CurrencyProvider>
                  <CartProvider>

                  <Header />
                  <div className="relative z-10">
                    {children}
                  </div>

                  <Footer />
                  <CommandMenu />
                  <BackToTop />
                  <CookieBanner />
                  <ChatWidget />
                  <MobileFab />
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
