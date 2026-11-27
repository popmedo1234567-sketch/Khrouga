import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import PwaRegister from "@/components/pwa-register";
import RevealObserver from "@/components/reveal-observer";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "خروجة — مش عارفين تخرجوا فين؟",
    template: "%s · خروجة",
  },
  description:
    "اختار المنطقة والميزانية والمزاج، وخروجة تقترح عليك أماكن بأسعارها الحقيقية، صورها، ريلاتها، لينك الخريطة، وحجز مباشر على واتساب.",
  keywords: ["خروجة", "أماكن خروج", "كافيهات القاهرة", "مطاعم", "ميزانية", "واتساب"],
  manifest: "/manifest.webmanifest",
  applicationName: "خروجة",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "خروجة" },
  openGraph: {
    title: "خروجة — مش عارفين تخرجوا فين؟",
    description: "فلتر الأماكن بالمزاج والميزانية والمنطقة، واحجز على واتساب في ثانية.",
    url: SITE_URL,
    siteName: "خروجة",
    locale: "ar_EG",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f0e6" },
    { media: "(prefers-color-scheme: dark)", color: "#120f18" },
  ],
};

/** تحديد الوضع الليلي قبل أول رسمة عشان مفيش وميض */
const themeInit = `try{var t=localStorage.getItem('khrouga:theme');var d=t?t==='dark':matchMedia('(prefers-color-scheme:dark)').matches;if(d)document.documentElement.classList.add('dark');document.documentElement.style.colorScheme=d?'dark':'light';}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className="grain" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.pexels.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@300;400;500;600;700&family=Cairo:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        {/* من غير JS: المحتوى يظهر كامل بدل ما يفضل مخفي بأنيميشن الظهور */}
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: ".reveal{opacity:1!important;transform:none!important}.line-mask>span{transform:none!important}" }} />
        </noscript>
      </head>
      <body className="min-h-dvh bg-bg text-ink font-body antialiased">
        <a
          href="#results"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:right-3 focus:z-[70] focus:rounded-xl focus:bg-spice focus:px-4 focus:py-2 focus:text-spiceink"
        >
          اتخطى للنتائج
        </a>
        <SiteHeader />
        <main className="relative z-10">{children}</main>
        <SiteFooter />
        <RevealObserver />
        <PwaRegister />
      </body>
    </html>
  );
}
