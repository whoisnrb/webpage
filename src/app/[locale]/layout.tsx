import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/ecommerce/cart-provider";
import { NeuralBackground } from "@/components/neural-background";
import { CommandMenu } from "@/components/layout/command-menu";
import { BackToTop } from "@/components/layout/back-to-top";
import { SocialProof } from "@/components/marketing/social-proof";
import { CookieBanner } from "@/components/cookie-banner";
import { ChatWidget } from "@/components/chat/chat-widget";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { PromoBanner } from "@/components/layout/promo-banner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "sonner";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { PageTransition } from "@/components/ui/page-transition";
import { SessionProvider } from "@/components/auth/session-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BacklineIT | Hatékony Digitális Megoldások",
    template: "%s | BacklineIT"
  },
  description: "Professzionális IT szolgáltatások, egyedi scriptek, webfejlesztés és automatizáció vállalkozásoknak. Spórolj időt és pénzt modern technológiákkal.",
  keywords: ["BacklineIT", "IT szolgáltatás", "webfejlesztés", "automatizáció", "python script", "devops", "biztonsági audit"],
  authors: [{ name: "BacklineIT Team" }],
  creator: "BacklineIT Team",
  openGraph: {
    type: "website",
    locale: "hu_HU",
    url: "https://backlineit.hu",
    title: "BacklineIT | Hatékony Digitális Megoldások",
    description: "Professzionális IT szolgáltatások, egyedi scriptek, webfejlesztés és automatizáció vállalkozásoknak.",
    siteName: "BacklineIT",
  },
  twitter: {
    card: "summary_large_image",
    title: "BacklineIT",
    description: "Professzionális IT szolgáltatások és automatizáció.",
    creator: "@backlineit",
  },
  metadataBase: new URL("https://backlineit.hu"),
};

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
    <html lang={locale} className="dark">
      <body
        className={`${inter.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <SessionProvider>
            <NeuralBackground />
            <ScrollProgress />
            <CartProvider>
              <PromoBanner />
              <Header />
              <PageTransition>
                {children}
              </PageTransition>
              <Footer />
              <CommandMenu />
              <BackToTop />
              <SocialProof />
              <CookieBanner />
              <ChatWidget />
              <Toaster position="bottom-right" theme="dark" />
            </CartProvider>
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html >
  );
}
