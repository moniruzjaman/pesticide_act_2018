import type { Metadata } from "next";
import { Noto_Serif_Bengali, Noto_Sans_Bengali, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

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

export const metadata: Metadata = {
  title: "বালাইনাশক আইন, ২০১৮ — সমন্বিত ফিল্ড গাইড",
  description: "খুচরা বিক্রেতার সমন্বিত ফিল্ড গাইড ও আইনগত নির্দেশিকা — আইন, স্লাইড ভিউয়ার, ডাউনলোড ও Qwen AI সহ",
  keywords: ["Pesticide Act 2018", "Bangladesh", "Bengali", "Retailer Guide", "Qwen AI"],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body
        className={`${notoSerifBn.variable} ${notoSansBn.variable} ${inter.variable} antialiased bg-background text-foreground`}
        style={{ fontFamily: "var(--font-sans-bn), var(--font-inter), sans-serif" }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
