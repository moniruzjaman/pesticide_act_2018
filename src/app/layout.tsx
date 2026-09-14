import type { Metadata, Viewport } from "next";
import { Noto_Serif_Bengali, Noto_Sans_Bengali, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/next";

const notoSerifBn = Noto_Serif_Bengali({
  variable: "--font-serif-bn",
  subsets: ["bengali"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const notoSansBn = Noto_Sans_Bengali({
  variable: "--font-sans-bn",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// When deployed on Vercel, window.location.origin is used for share URLs (see page.tsx).
// For OG meta tags (server-side), use NEXT_PUBLIC_SITE_URL or default to Vercel pattern.
// After deploying, set NEXT_PUBLIC_SITE_URL env var in Vercel project settings.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pesticideact2018.vercel.app";
// OG image: use GitHub raw URL so it's always publicly accessible even before deployment
const OG_IMAGE_URL = process.env.NEXT_PUBLIC_OG_IMAGE_URL || "https://raw.githubusercontent.com/moniruzjaman/pesticide_act_2018/main/public/og-image.png";
const SITE_TITLE = "বালাইনাশক আইন, ২০১৮ — সমন্বিত ফিল্ড গাইড";
const SITE_DESC =
  "খুচরা বিক্রেতার সমন্বিত ফিল্ড গাইড ও আইনগত নির্দেশিকা — ৩৬টি ধারার ইন্টারঅ্যাকটিভ আইনি রেফারেন্স, ৪৭টি স্লাইডের প্রশিক্ষণ ডেক, ডাউনলোড সেন্টার ও অফলাইন AI সহায়ক।";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s · বালাইনাশক আইন, ২০১৮",
  },
  description: SITE_DESC,
  keywords: [
    "Pesticide Act 2018",
    "Bangladesh",
    "Bengali",
    "Retailer Guide",
    "Offline AI",
    "PWA",
    "বালাইনাশক আইন",
    "খুচরা বিক্রেতা",
  ],
  authors: [{ name: "Moniruz Jaman" }],
  creator: "Moniruz Jaman",
  publisher: "Moniruz Jaman",
  applicationName: "বালাইনাশক আইন, ২০১৮",
  category: "education",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon-32.png"],
  },
  appleWebApp: {
    capable: true,
    title: "বালাইনাশক আইন",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    url: SITE_URL,
    siteName: "বালাইনাশক আইন, ২০১৮",
    title: SITE_TITLE,
    description: SITE_DESC,
    images: [
      {
        url: OG_IMAGE_URL,
        secureUrl: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: "বালাইনাশক আইন, ২০১৮ — সমন্বিত ফিল্ড গাইড",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESC,
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: "বালাইনাশক আইন, ২০১৮ — সমন্বিত ফিল্ড গাইড",
      },
    ],
    site: "@moniruzjaman",
    creator: "@moniruzjaman",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  other: {
    "msapplication-TileColor": "#006a4e",
    "theme-color": "#006a4e",
  },
};

export const viewport: Viewport = {
  themeColor: "#006a4e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="বালাইনাশক আইন" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="বালাইনাশক আইন" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body
        className={`${notoSerifBn.variable} ${notoSansBn.variable} ${inter.variable} antialiased bg-background text-foreground`}
        style={{ fontFamily: "var(--font-sans-bn), var(--font-inter), sans-serif" }}
      >
        {children}
        <Toaster />
        <Analytics />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(reg) {
                    console.log('[PWA] SW registered:', reg.scope);
                  }).catch(function(err) {
                    console.warn('[PWA] SW registration failed:', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
