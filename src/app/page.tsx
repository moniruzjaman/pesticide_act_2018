"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import {
  BookOpen,
  Presentation,
  Download,
  Sparkles,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  FileText,
  Pause,
  Play,
  Square,
  Copy,
  CheckCircle2,
  ListTree,
  Scale,
  Landmark,
  Share2,
  ExternalLink,
  AlertTriangle,
  ShieldCheck,
  Send,
  MessageCircle,
  Loader2,
  WifiOff,
} from "lucide-react";

// Custom Government seal icon — Bangladesh flag inspired (green ring + red disc)
function GovSealIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Outer green seal ring */}
      <circle cx="12" cy="12" r="10" strokeWidth="1.6" />
      {/* Inner thin ring */}
      <circle cx="12" cy="12" r="8" strokeWidth="0.6" opacity="0.6" />
      {/* Central red disc — Bangladesh flag inspired */}
      <circle cx="12" cy="12" r="4" fill="#f42a41" stroke="none" />
      {/* Decorative dots around ring (law/justice seal pattern) */}
      <circle cx="12" cy="2.5" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="12" cy="21.5" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="2.5" cy="12" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="21.5" cy="12" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

const TOTAL_SLIDES = 47;

// Available decks — each has its own PPTX file + slide PNGs folder
const DECKS = [
  {
    id: "khuchra",
    title: "খুচরা বিক্রেতা গাইড (বড় ফন্ট)",
    short: "খুচরা গাইড",
    desc: "৪৭টি স্লাইড · বড় ফন্ট সংস্করণ · ২০ মিটার দূর থেকে পড়ার উপযোগী",
    slides: 47,
    pptx: "/decks/Balainashok_Ain_2018_Khuchra_Bikreta_Guide.pptx",
    imgDir: "/decks/khuchra",
    color: "#006a4e",
  },
  {
    id: "pictorial",
    title: "পিক্টোরিয়াল গাইড",
    short: "পিক্টোরিয়াল",
    desc: "৫৬টি স্লাইড · চিত্রভিত্তিক ব্যাখ্যা · দ্রুত বোঝার জন্য",
    slides: 56,
    pptx: "/decks/Balainashok_Ain_2018_Pictorial_Guide.pptx",
    imgDir: "/decks/pictorial",
    color: "#f42a41",
  },
  {
    id: "comprehensive",
    title: "সমন্বিত ফিল্ড গাইড ও আইনগত নির্দেশিকা",
    short: "সমন্বিত",
    desc: "৪৭টি স্লাইড · সম্পূর্ণ আইনি ও ফিল্ড গাইড · প্রশিক্ষণের জন্য আদর্শ",
    slides: 47,
    pptx: "/decks/বালাইনাশক আইন, ২০১৮ — খুচরা বিক্রেতার সমন্বিত ফিল্ড গাইড ও আইনগত নির্দেশিকা.pptx",
    imgDir: "/decks/comprehensive",
    color: "#c9a227",
  },
];

// 7 chapter overview (mirrors the deck's TOC)
const CHAPTERS = [
  { num: "০১", title: "সংকটের প্রেক্ষাপট", range: "স্লাইড ৩–৬", startSlide: 3, thumbSlide: 4, summary: "ভেজাল বালাইনাশক কৃষক, ভোক্তা ও পরিবেশের জন্য বহুমুখী ক্ষতির কারণ — বাংলাদেশে বাজারের ১৫–২০% ভেজাল।" },
  { num: "০২", title: "ভেজাল চেনার বিজ্ঞান", range: "স্লাইড ৭–১৩", startSlide: 7, thumbSlide: 8, summary: "WHO সংজ্ঞা ও ৫টি শ্রেণির ভিত্তিতে চাক্ষুষ ও পরীক্ষাগার (HPLC/GC) শনাক্তকরণ।" },
  { num: "০৩", title: "বালাইনাশক আইন, ২০১৮", range: "স্লাইড ১৪–২০", startSlide: 14, thumbSlide: 17, summary: "নিবন্ধন, লাইসেন্সিং, MRP ও লেবেলিং — ৩৬টি ধারায় সরকারি নিয়ন্ত্রণের কাঠামো।" },
  { num: "০৪", title: "মাঠ পর্যায়ে শনাক্তকরণ", range: "স্লাইড ২১–২৭", startSlide: 21, thumbSlide: 25, summary: "৫-ধাপ চেকলিস্ট ও ৩-শ্রেণি রেড ফ্ল্যাগ দিয়ে দোকানে ভেজাল ধরা — দুটি বাস্তব কেসস্টাডি সহ।" },
  { num: "০৫", title: "প্রতিরোধ ক্ষমতা ও দীর্ঘমেয়াদি ক্ষতি", range: "স্লাইড ২৮–৩৪", startSlide: 28, thumbSlide: 33, summary: "অনিয়ন্ত্রিত ব্যবহার পোকা প্রতিরোধী করে — মাটি, পানি ও স্বাস্থ্যের স্থায়ী ক্ষতি।" },
  { num: "০৬", title: "আইন প্রয়োগ ও দণ্ডবিধি", range: "স্লাইড ৩৫–৩৯", startSlide: 35, thumbSlide: 42, summary: "পরিদর্শকের ক্ষমতা, নমুনা সংগ্রহ, জরিমানা (১–৩ লক্ষ ৳) ও বাজেয়াপ্তকরণ।" },
  { num: "০৭", title: "খুচরা বিক্রেতার সম্মানের পথ", range: "স্লাইড ৪০–৪৭", startSlide: 40, thumbSlide: 48, summary: "IRM প্রচার, নৈতিক অনুশীলন ও গ্রাহক শিক্ষার মাধ্যমে সম্মান — বিক্রেতা কৃষকের রক্ষক।" },
];

const AI_SUGGESTIONS = [
  { q: "খুচরা বিক্রেতার লাইসেন্সিং শর্ত কী কী?", tag: "ধারা ১৮" },
  { q: "ভেজাল বালাইনাশক কীভাবে শনাক্ত করব?", tag: "শনাক্তকরণ" },
  { q: "বালাইনাশক আইন লঙ্ঘনের শাস্তি কত?", tag: "শাস্তি" },
  { q: "পরিদর্শকের ক্ষমতা কী কী?", tag: "পরিদর্শক" },
  { q: "খুচরা বিক্রেতার মূল দায়িত্ব কী?", tag: "দায়িত্ব" },
  { q: "MRP কীভাবে নির্ধারিত হয়?", tag: "MRP" },
  { q: "নিবন্ধনের মেয়াদ কত বছর?", tag: "নিবন্ধন" },
  { q: "লেবেলে কী কী তথ্য বাধ্যতামূলক?", tag: "লেবেল" },
];

type TabId = "overview" | "act" | "slides" | "downloads" | "ai";

export default function Home() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [online, setOnline] = useState<boolean>(() => (typeof navigator !== "undefined" ? navigator.onLine : true));
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const { toast } = useToast();

  // Online/offline event listeners (no setState in effect body)
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  // PWA install prompt capture
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      toast({ title: "অ্যাপ ইনস্টল হচ্ছে", description: "হোম স্ক্রিনে আইকন যোগ হবে" });
    }
    setInstallPrompt(null);
  };

  // Visitor tracking — fire once on mount
  const [visitCount, setVisitCount] = useState<number | null>(null);

  useEffect(() => {
    // Track this visit
    fetch("/api/track-visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: typeof window !== "undefined" ? window.location.pathname + window.location.search : "/",
        referrer: typeof document !== "undefined" ? document.referrer || null : null,
      }),
    }).catch(() => {});

    // Fetch total visit count for display
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => setVisitCount(d.totalVisits || 0))
      .catch(() => {});
  }, []);

  // Email-gated download — shows modal, stores email, then downloads
  const [emailGate, setEmailGate] = useState<{ url: string; name: string } | null>(null);
  const [emailInput, setEmailInput] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  const requestDownload = (url: string, name: string) => {
    setEmailGate({ url, name });
    setEmailInput("");
  };

  const submitEmailAndDownload = async () => {
    if (!emailInput.trim() || !emailInput.includes("@") || !emailGate) return;
    setEmailLoading(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput.trim(), downloadItem: emailGate.name }),
      });
      // Trigger download
      const a = document.createElement("a");
      a.href = emailGate.url;
      a.download = "";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast({ title: "ডাউনলোড শুরু হয়েছে", description: "ধন্যবাদ! আপনার ইমেইল সংরক্ষিত হয়েছে।" });
      setEmailGate(null);
      setEmailInput("");
    } catch {
      toast({ title: "সমস্যা হয়েছে", description: "আবার চেষ্টা করুন", variant: "destructive" });
    }
    setEmailLoading(false);
  };

  // Read tab from URL query (?tab=ai) — runs once on mount
  const [initialTab] = useState<TabId>(() => {
    if (typeof window === "undefined") return "overview";
    const params = new URLSearchParams(window.location.search);
    const t = params.get("tab");
    if (t && ["overview", "act", "slides", "downloads", "ai"].includes(t)) {
      return t as TabId;
    }
    return "overview";
  });
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);
  const [slideJump, setSlideJump] = useState<number | null>(null);

  // Web Share API — opens custom share dialog with 1200x630 preview
  const [shareOpen, setShareOpen] = useState(false);

  const handleShare = () => {
    setShareOpen(true);
  };

  // Dynamic share data based on active tab — each tab gets its own title/text/URL
  // Uses NEXT_PUBLIC_SITE_URL if set (Vercel domain), else window.location.origin (auto-detects deployed URL)
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL
    || (typeof window !== "undefined" ? window.location.origin : "https://pesticideact2018.vercel.app");

  const tabShareData: Record<TabId, { title: string; text: string; url: string; sub: string }> = {
    overview: {
      title: "বালাইনাশক আইন, ২০১৮ — সমন্বিত ফিল্ড গাইড",
      text: "৩৬ ধারা · ৪৭ স্লাইড · অফলাইন AI · বাংলা — খুচরা বিক্রেতার সমন্বিত ফিল্ড গাইড ও আইনগত নির্দেশিকা।",
      url: `${BASE_URL}/`,
      sub: "সূচি",
    },
    act: {
      title: "কীটনাশক আইন, ২০১৮ — ৩৬টি ধারার সম্পূর্ণ রেফারেন্স",
      text: "বাংলা/English দ্বিভাষিক · TTS অডিও · সার্চ সহ — ৩৬টি ধারার ইন্টারঅ্যাকটিভ আইনি রেফারেন্স।",
      url: `${BASE_URL}/?tab=act`,
      sub: "আইন",
    },
    slides: {
      title: "বালাইনাশক আইন প্রশিক্ষণ ডেক — ৩টি সংস্করণ, ১৫০টি স্লাইড",
      text: "অটোপ্লে সহ স্লাইড ভিউয়ার — খুচরা গাইড, পিক্টোরিয়াল ও সমন্বিত সংস্করণ।",
      url: `${BASE_URL}/?tab=slides`,
      sub: "স্লাইড",
    },
    downloads: {
      title: "বালাইনাশক আইন — ডাউনলোড সেন্টার",
      text: "৩টি PPTX ডেক · আইন HTML · ৩৬ ধারা আলাদা · অফলাইন ZIP — সব একসাথে।",
      url: `${BASE_URL}/?tab=downloads`,
      sub: "ডাউনলোড",
    },
    ai: {
      title: "বালাইনাশক আইন অফলাইন AI সহায়ক",
      text: "আইনের ৩৬ ধারার উপর ভিত্তি করে স্মার্ট উত্তর — সম্পূর্ণ অফলাইনে, কোনো ইন্টারনেট ছাড়াই।",
      url: `${BASE_URL}/?tab=ai`,
      sub: "AI সহায়ক",
    },
  };

  const currentShare = tabShareData[activeTab];
  const shareUrl = currentShare.url;
  const shareTitle = currentShare.title;
  const shareText = currentShare.text;

  const shareToPlatform = async (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(shareTitle);
    const encodedText = encodeURIComponent(shareText);
    let target = "";
    switch (platform) {
      case "whatsapp":
        target = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case "messenger":
        target = `https://www.facebook.com/dialog/send?app_id=291494419107518&link=${encodedUrl}&redirect_uri=${encodedUrl}`;
        break;
      case "facebook":
        target = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}&display=page`;
        break;
      case "facebook_page":
        target = `https://www.facebook.com/dialog/feed?app_id=291494419107518&link=${encodedUrl}&name=${encodedTitle}&description=${encodedText}&redirect_uri=${encodedUrl}`;
        break;
      case "twitter":
        target = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&via=moniruzjaman`;
        break;
      case "telegram":
        target = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
        break;
      case "linkedin":
        target = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case "email":
        target = `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`;
        break;
      case "native":
        if (navigator.share) {
          try {
            await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
          } catch {}
          return;
        }
        return;
      case "copy":
        try {
          await navigator.clipboard.writeText(shareUrl);
          toast({ title: "লিঙ্ক কপি হয়েছে", description: "যেকোনো জায়গায় পেস্ট করুন" });
        } catch {}
        return;
    }
    if (target) {
      window.open(target, "_blank", "noopener,noreferrer,width=600,height=500");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7fdf9]">
      {/* Top accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-[#006a4e] from-70% to-[#f42a41] to-70%" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#f7fdf9]/95 backdrop-blur border-b border-[#c8e6d5]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-[#006a4e] flex items-center justify-center text-[#f7fdf9] flex-shrink-0">
              <GovSealIcon className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h1 className="font-serif-bn font-bold text-[#004d38] text-base md:text-lg leading-tight truncate">
                বালাইনাশক আইন, ২০১৮
              </h1>
              <p className="text-[10px] md:text-xs text-[#5a7568] truncate">খুচরা বিক্রেতার সমন্বিত ফিল্ড গাইড</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <TabButton id="overview" active={activeTab} onClick={setActiveTab}>সূচি</TabButton>
            <TabButton id="act" active={activeTab} onClick={setActiveTab}>আইন</TabButton>
            <TabButton id="slides" active={activeTab} onClick={setActiveTab}>স্লাইড</TabButton>
            <TabButton id="downloads" active={activeTab} onClick={setActiveTab}>ডাউনলোড</TabButton>
            <TabButton id="ai" active={activeTab} onClick={setActiveTab}>AI সহায়ক</TabButton>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-[#c8e6d5] text-[#006a4e] hover:bg-[#e6f4ed] transition-colors"
              title="শেয়ার করুন"
              aria-label="শেয়ার"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <Button
              size="sm"
              className="bg-[#f42a41] hover:bg-[#c41e2e] text-white hidden sm:inline-flex"
              onClick={() => setActiveTab("ai")}
            >
              <Sparkles className="w-4 h-4 mr-1.5" /> AI
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden border-[#c8e6d5]"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
            >
              {mobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileNavOpen && (
          <div className="md:hidden border-t border-[#c8e6d5] bg-[#f7fdf9] p-2 grid grid-cols-2 gap-1">
            <TabButton id="overview" active={activeTab} onClick={(t) => { setActiveTab(t); setMobileNavOpen(false); }} full>সূচি</TabButton>
            <TabButton id="act" active={activeTab} onClick={(t) => { setActiveTab(t); setMobileNavOpen(false); }} full>আইন</TabButton>
            <TabButton id="slides" active={activeTab} onClick={(t) => { setActiveTab(t); setMobileNavOpen(false); }} full>স্লাইড</TabButton>
            <TabButton id="downloads" active={activeTab} onClick={(t) => { setActiveTab(t); setMobileNavOpen(false); }} full>ডাউনলোড</TabButton>
            <TabButton id="ai" active={activeTab} onClick={(t) => { setActiveTab(t); setMobileNavOpen(false); }} full>AI সহায়ক</TabButton>
          </div>
        )}
      </header>

      {/* Offline indicator + install banner */}
      {!online && (
        <div className="bg-[#f42a41] text-white text-center py-1.5 text-xs md:text-sm font-sans-bn flex items-center justify-center gap-2">
          <WifiOff className="w-3.5 h-3.5" />
          আপনি অফলাইনে আছেন — তবে আইন, স্লাইড ও AI সহায়ক কাজ করবে
        </div>
      )}
      {installPrompt && (
        <div className="bg-[#006a4e] text-[#f7fdf9] py-2 px-4 text-xs md:text-sm flex items-center justify-between gap-3">
          <span className="font-sans-bn">📱 অ্যাপ হোম স্ক্রিনে ইনস্টল করুন — অফলাইনে ব্যবহার করুন</span>
          <button onClick={handleInstall} className="bg-[#f42a41] hover:bg-[#c41e2e] text-white px-3 py-1 rounded text-xs font-semibold">
            ইনস্টল
          </button>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-6 md:py-10">
        {activeTab === "overview" && <OverviewTab onNavigate={setActiveTab} onChapterClick={(slide) => { setSlideJump(slide); setActiveTab("slides"); }} />}
        {activeTab === "act" && <ActTab />}
        {activeTab === "slides" && <SlidesTab onDownload={requestDownload} jumpTo={slideJump} onJumpConsumed={() => setSlideJump(null)} />}
        {activeTab === "downloads" && <DownloadsTab onDownload={requestDownload} />}
        {activeTab === "ai" && <AiTab />}
      </main>

      {/* Footer */}
      <footer className="bg-[#004d38] text-[#c8e6d5] text-center py-5 text-xs md:text-sm">
        <div className="max-w-7xl mx-auto px-4">
          বালাইনাশক আইন, ২০১৮ · খুচরা বিক্রেতার সমন্বিত ফিল্ড গাইড · সমন্বিত সংস্করণ ২০২৬ · অফলাইন AI সহ
          {visitCount !== null && visitCount > 0 && (
            <div className="mt-1 text-[10px] text-[#5a7568] font-num">
              👁 {visitCount.toLocaleString("bn-BD")} জন ভিজিটর
            </div>
          )}
          <div className="mt-2">
            <a
              href="https://agrichem-guide.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ff6b7a] hover:underline"
            >
              ⚡ AgriChem Guide — কৃষি রাসায়নিক ডেটাবেস ও পেস্ট কন্ট্রোল গাইড
            </a>
          </div>
        </div>
      </footer>

      {/* Floating action buttons — AI + Share (visible in PWA too) */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-2.5 items-end">
        <button
          onClick={handleShare}
          className="bg-[#006a4e] hover:bg-[#004d38] text-white rounded-full shadow-2xl w-12 h-12 md:w-14 md:h-14 flex items-center justify-center transition-all hover:scale-105"
          aria-label="শেয়ার করুন"
          title="শেয়ার করুন"
        >
          <Share2 className="w-5 h-5" />
        </button>
        <button
          onClick={() => setActiveTab("ai")}
          className="bg-[#f42a41] hover:bg-[#c41e2e] text-white rounded-full shadow-2xl px-4 py-3 md:px-5 md:py-4 flex items-center gap-2 transition-all hover:scale-105"
          aria-label="AI সহায়ক খুলুন"
        >
          <Sparkles className="w-5 h-5" />
          <span className="font-sans-bn font-semibold text-sm hidden sm:inline">AI সহায়ক</span>
        </button>
      </div>

      {/* Share Dialog — 1200x630 preview + platform buttons */}
      {shareOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShareOpen(false)}
        >
          <div
            className="bg-[#f7fdf9] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#c8e6d5]">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-[#f42a41]" />
                <h3 className="font-serif-bn font-bold text-[#004d38] text-lg">শেয়ার করুন</h3>
                <Badge className="bg-[#e6f4ed] text-[#006a4e] hover:bg-[#e6f4ed] text-[10px] ml-1">
                  {currentShare.sub}
                </Badge>
              </div>
              <button
                onClick={() => setShareOpen(false)}
                className="w-8 h-8 rounded-md hover:bg-[#e6f4ed] flex items-center justify-center text-[#006a4e]"
                aria-label="বন্ধ করুন"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current page share context */}
            <div className="px-4 pt-3 pb-1">
              <div className="bg-[#e6f4ed] rounded-lg p-3 border border-[#c8e6d5]">
                <p className="text-[11px] text-[#5a7568] mb-1 font-sans-bn">শেয়ার হচ্ছে:</p>
                <p className="font-serif-bn font-bold text-[#004d38] text-sm leading-tight">{shareTitle}</p>
                <p className="text-xs text-[#3d5a4a] mt-1 leading-relaxed">{shareText}</p>
              </div>
            </div>

            {/* 1200x630 Preview Card */}
            <div className="p-4">
              <p className="text-xs text-[#5a7568] mb-2 font-sans-bn">শেয়ার প্রিভিউ (১২০০×৬৩০)</p>
              <div className="rounded-xl overflow-hidden border-2 border-[#c8e6d5] shadow-lg">
                {/* 1200x630 aspect ratio preview */}
                <div className="relative w-full" style={{ aspectRatio: "1200/630" }}>
                  <img
                    src="/og-image.png"
                    alt="শেয়ার প্রিভিউ"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>
              <p className="text-[11px] text-[#5a7568] mt-2 leading-relaxed">
                এই প্রিভিউটি WhatsApp, Facebook, Twitter, LinkedIn সব প্ল্যাটফর্মে একইভাবে দেখাবে।
              </p>
            </div>

            {/* Platform buttons */}
            <div className="px-4 pb-2">
              <p className="text-sm font-semibold text-[#004d38] mb-3 font-sans-bn">যেকোনো মাধ্যমে শেয়ার করুন</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <SharePlatformBtn
                  label="WhatsApp"
                  color="#25D366"
                  icon={
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  }
                  onClick={() => shareToPlatform("whatsapp")}
                />
                <SharePlatformBtn
                  label="Messenger"
                  color="#0084FF"
                  icon={
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.652V24l4.088-2.242c1.092.301 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z"/>
                    </svg>
                  }
                  onClick={() => shareToPlatform("messenger")}
                />
                <SharePlatformBtn
                  label="Facebook"
                  color="#1877F2"
                  icon={
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  }
                  onClick={() => shareToPlatform("facebook")}
                />
                <SharePlatformBtn
                  label="FB Page"
                  color="#006a4e"
                  icon={
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  }
                  onClick={() => shareToPlatform("facebook_page")}
                />
                <SharePlatformBtn
                  label="Twitter / X"
                  color="#000000"
                  icon={
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  }
                  onClick={() => shareToPlatform("twitter")}
                />
                <SharePlatformBtn
                  label="Telegram"
                  color="#0088CC"
                  icon={
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.061 3.345-.48.329-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.662 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  }
                  onClick={() => shareToPlatform("telegram")}
                />
                <SharePlatformBtn
                  label="LinkedIn"
                  color="#0A66C2"
                  icon={
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.063 2.063 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  }
                  onClick={() => shareToPlatform("linkedin")}
                />
                <SharePlatformBtn
                  label="Email"
                  color="#5a7568"
                  icon={<FileText className="w-5 h-5" />}
                  onClick={() => shareToPlatform("email")}
                />
                {typeof navigator !== "undefined" && navigator.share && (
                  <SharePlatformBtn
                    label="আরও..."
                    color="#006a4e"
                    icon={<Share2 className="w-5 h-5" />}
                    onClick={() => shareToPlatform("native")}
                  />
                )}
                <SharePlatformBtn
                  label="লিঙ্ক কপি"
                  color="#f42a41"
                  icon={<Copy className="w-5 h-5" />}
                  onClick={() => shareToPlatform("copy")}
                />
              </div>
            </div>

            {/* URL display */}
            <div className="p-4 border-t border-[#c8e6d5] mt-2">
              <label className="text-xs text-[#5a7568] mb-1.5 block font-sans-bn">লিঙ্ক</label>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={shareUrl}
                  className="flex-1 px-3 py-2 text-sm bg-[#e6f4ed] border border-[#c8e6d5] rounded-md text-[#3d5a4a] font-num"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <Button
                  onClick={() => shareToPlatform("copy")}
                  size="sm"
                  className="bg-[#006a4e] hover:bg-[#004d38] text-white"
                >
                  <Copy className="w-3.5 h-3.5 mr-1.5" /> কপি
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Gate Modal — before downloads */}
      {emailGate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => !emailLoading && setEmailGate(null)}
        >
          <div
            className="bg-[#f7fdf9] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#006a4e] to-[#004d38] text-white p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-bn font-bold text-lg">ডাউনলোড করুন</h3>
                  <p className="text-xs text-white/80">{emailGate.name}</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 space-y-3">
              <p className="text-sm text-[#3d5a4a] leading-relaxed">
                ডাউনলোড করার আগে অনুগ্রহ করে আপনার ইমেইল ঠিকানা দিন। আমরা আপনাকে
                আপডেট ও গুরুত্বপূর্ণ তথ্য পাঠাতে পারি। আপনার তথ্য সুরক্ষিত থাকবে।
              </p>
              <Input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !emailLoading && submitEmailAndDownload()}
                placeholder="আপনার ইমেইল ঠিকানা"
                className="border-[#c8e6d5] text-sm"
                disabled={emailLoading}
              />
              <div className="flex gap-2">
                <Button
                  onClick={submitEmailAndDownload}
                  disabled={!emailInput.trim() || !emailInput.includes("@") || emailLoading}
                  className="bg-[#006a4e] hover:bg-[#004d38] text-white flex-1"
                >
                  {emailLoading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> প্রসেসিং...</>
                  ) : (
                    <><Download className="w-4 h-4 mr-2" /> ডাউনলোড শুরু করুন</>
                  )}
                </Button>
                <Button
                  onClick={() => setEmailGate(null)}
                  variant="outline"
                  className="border-[#c8e6d5] text-[#5a7568] hover:bg-[#e6f4ed]"
                  disabled={emailLoading}
                >
                  বাতিল
                </Button>
              </div>
              <p className="text-[10px] text-[#5a7568] text-center">
                🔒 আপনার ইমেইল কোনো তৃতীয় পক্ষের সাথে শেয়ার করা হবে না
              </p>
            </div>
          </div>
        </div>
      )}

      <Toaster />
    </div>
  );
}

/* ============== Tab Button ============== */
function TabButton({ id, active, onClick, children, full }: {
  id: TabId;
  active: TabId;
  onClick: (t: TabId) => void;
  children: React.ReactNode;
  full?: boolean;
}) {
  const isActive = active === id;
  return (
    <button
      onClick={() => onClick(id)}
      className={`font-sans-bn text-sm font-medium px-3 md:px-4 py-2 rounded-md transition-colors ${
        full ? "w-full text-left" : ""
      } ${
        isActive
          ? "bg-[#006a4e] text-[#f7fdf9]"
          : "text-[#006a4e] hover:bg-[#e6f4ed]"
      }`}
    >
      {children}
    </button>
  );
}

/* ============== Overview Tab ============== */
function OverviewTab({ onNavigate, onChapterClick }: { onNavigate: (t: TabId) => void; onChapterClick: (slideNum: number) => void }) {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <Card className="bg-gradient-to-br from-[#006a4e] to-[#004d38] text-[#f7fdf9] border-none p-6 md:p-10">
        <Badge className="bg-[#f42a41] text-white hover:bg-[#f42a41] mb-3">খুচরা বিক্রেতার ফিল্ড গাইড</Badge>
        <h2 className="font-serif-bn text-3xl md:text-5xl font-bold leading-tight mb-3">
          বালাইনাশক আইন, ২০১৮
        </h2>
        <p className="font-serif-bn text-xl md:text-2xl text-[#ff6b7a] mb-4">
          সমন্বিত ফিল্ড গাইড ও আইনগত নির্দেশিকা
        </p>
        <p className="text-[#f7fdf9]/85 max-w-3xl text-sm md:text-base leading-relaxed mb-6">
          ভেজাল বালাইনাশক শনাক্তকরণ, আইনি বিধান, এবং নৈতিক ব্যবসায়িক অনুশীলন —
          ৪৭টি স্লাইডের প্রশিক্ষণ ডেক, ৩৬টি ধারার ইন্টারঅ্যাকটিভ আইনি রেফারেন্স, এবং অফলাইন AI
          সহায়ক সমন্বিত ওয়েব অ্যাপ্লিকেশন।
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-white/10 text-white border-white/30">৪৭ স্লাইড</Badge>
          <Badge variant="outline" className="bg-white/10 text-white border-white/30">৭ অধ্যায়</Badge>
          <Badge variant="outline" className="bg-white/10 text-white border-white/30">৩৬ ধারা</Badge>
          <Badge variant="outline" className="bg-white/10 text-white border-white/30">অফলাইন AI সহ</Badge>
        </div>
        <div className="flex flex-wrap gap-3 mt-6">
          <Button onClick={() => onNavigate("act")} className="bg-[#f42a41] hover:bg-[#c41e2e] text-white">
            <BookOpen className="w-4 h-4 mr-2" /> আইন পড়ুন
          </Button>
          <Button onClick={() => onNavigate("slides")} variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white">
            <Presentation className="w-4 h-4 mr-2" /> স্লাইড দেখুন
          </Button>
          <Button onClick={() => onNavigate("ai")} variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white">
            <Sparkles className="w-4 h-4 mr-2" /> AI সহায়ক
          </Button>
        </div>
      </Card>

      {/* AgriChem Guide — featured companion app */}
      <Card className="border-2 border-[#006a4e] bg-white overflow-hidden">
        <div className="flex flex-col md:flex-row items-stretch">
          {/* Left: icon/preview */}
          <div className="md:w-48 flex-shrink-0 bg-gradient-to-br from-[#006a4e] to-[#004d38] flex items-center justify-center p-6">
            <img
              src="/agrichem-128.png"
              alt="AgriChem Guide"
              className="w-28 h-28 md:w-32 md:h-32 rounded-2xl shadow-lg"
            />
          </div>
          {/* Right: content */}
          <div className="flex-1 p-5 md:p-6 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-[#f42a41] text-white hover:bg-[#f42a41] text-[10px]">নতুন</Badge>
              <span className="text-[11px] text-[#5a7568] font-sans-bn">সহযোগী অ্যাপ</span>
            </div>
            <h3 className="font-serif-bn font-bold text-[#004d38] text-lg md:text-xl mb-1.5">
              AgriChem Guide & Pest Control Database
            </h3>
            <p className="text-sm text-[#3d5a4a] leading-relaxed mb-3">
              বাংলাদেশের কৃষি রাসায়নিক নিয়ন্ত্রণের সমন্বিত গাইড — MoA রোটেশন প্ল্যানার, ফিল্ড ডোজ ক্যালকুলেটর,
              সেফটি চেকলিস্ট, এবং অফলাইন ফিল্ড ম্যানুয়াল সহ। বালাইনাশক শনাক্তকরণ ও সঠিক ব্যবহারের জন্য এই অ্যাপটি একসাথে ব্যবহার করুন।
            </p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              <span className="text-[10px] bg-[#e6f4ed] text-[#006a4e] px-2 py-0.5 rounded-full font-medium">MoA রোটেশন</span>
              <span className="text-[10px] bg-[#e6f4ed] text-[#006a4e] px-2 py-0.5 rounded-full font-medium">ডোজ ক্যালকুলেটর</span>
              <span className="text-[10px] bg-[#e6f4ed] text-[#006a4e] px-2 py-0.5 rounded-full font-medium">সেফটি চেকলিস্ট</span>
              <span className="text-[10px] bg-[#e6f4ed] text-[#006a4e] px-2 py-0.5 rounded-full font-medium">অফলাইন ম্যানুয়াল</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://agrichem-guide.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#006a4e] hover:bg-[#004d38] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                AgriChem Guide খুলুন
              </a>
              <a
                href="https://agrichem-guide.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-[#006a4e] text-[#006a4e] hover:bg-[#e6f4ed] px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                বিস্তারিত জানুন
              </a>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { num: "৩০%", label: "উন্নয়নশীল দেশে ভেজালের হার", color: "#f42a41" },
          { num: "৪৮০ crore ৳", label: "বাংলাদেশের বার্ষিক বাজার", color: "#006a4e" },
          { num: "৩২", label: "সীমান্ত জেলায় প্রবেশ", color: "#f42a41" },
          { num: "৩৬", label: "আইনি ধারা", color: "#006a4e" },
        ].map((s, i) => (
          <Card key={i} className="p-4 text-center border-[#c8e6d5]">
            <div className="font-num font-bold text-2xl md:text-3xl" style={{ color: s.color }}>{s.num}</div>
            <div className="text-xs text-[#3d5a4a] mt-1.5 leading-tight">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Chapters — interactive, click to jump to slides */}
      <div>
        <h3 className="font-serif-bn text-xl md:text-2xl font-bold text-[#004d38] mb-4 flex items-center gap-2">
          <ListTree className="w-5 h-5 text-[#f42a41]" /> সাতটি অধ্যায় — ক্লিক করে স্লাইড খুলুন
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          {CHAPTERS.map((c) => {
            const thumbPadded = String(c.thumbSlide).padStart(2, "0");
            return (
              <button
                key={c.num}
                onClick={() => onChapterClick(c.startSlide)}
                className="text-left p-0 rounded-xl overflow-hidden border border-[#c8e6d5] hover:border-[#f42a41] hover:shadow-lg transition-all bg-white group cursor-pointer"
              >
                <div className="flex gap-0">
                  {/* Pictorial slide thumbnail — more visual, 56 slides */}
                  <div className="w-28 h-full flex-shrink-0 bg-[#006a4e] relative overflow-hidden">
                    <img
                      src={`/decks/pictorial/slide-${thumbPadded}.webp`}
                      alt={`${c.title} প্রিভিউ`}
                      className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#006a4e]/80 to-transparent" />
                    <div className="absolute top-1 left-1 bg-[#006a4e] text-white text-[10px] px-1.5 py-0.5 rounded font-num font-bold">
                      {c.num}
                    </div>
                  </div>
                  {/* Content */}
                  <div className="flex-1 p-3 min-w-0">
                    <h4 className="font-serif-bn font-bold text-[#004d38] text-sm mb-0.5 group-hover:text-[#f42a41] transition-colors">
                      {c.title}
                    </h4>
                    <p className="text-[10px] text-[#5a7568] mb-1 font-num flex items-center gap-1">
                      <Presentation className="w-2.5 h-2.5" />
                      {c.range}
                    </p>
                    <p className="text-xs text-[#3d5a4a] leading-relaxed line-clamp-2">{c.summary}</p>
                    <div className="flex items-center gap-1 mt-1.5 text-[#006a4e] group-hover:text-[#f42a41] transition-colors">
                      <span className="text-[10px] font-sans-bn font-semibold">স্লাইড খুলুন</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-5 border-[#c8e6d5]">
          <BookOpen className="w-7 h-7 text-[#006a4e] mb-2" />
          <h4 className="font-serif-bn font-bold text-[#004d38] mb-1">ইন্টারঅ্যাকটিভ আইন</h4>
          <p className="text-sm text-[#3d5a4a]">৩৬টি ধারা — বাংলা/English দ্বিভাষিক, TTS অডিও, ট্যাব ভিউ, সার্চ সুবিধা সহ।</p>
        </Card>
        <Card className="p-5 border-[#c8e6d5]">
          <Presentation className="w-7 h-7 text-[#006a4e] mb-2" />
          <h4 className="font-serif-bn font-bold text-[#004d38] mb-1">স্লাইড ভিউয়ার</h4>
          <p className="text-sm text-[#3d5a4a]">৩টি ডেক · ১৫০টি স্লাইড · অটোপ্লে, প্রিভিউ, ডাউনলোড সহ।</p>
        </Card>
        <Card className="p-5 border-[#c8e6d5]">
          <Sparkles className="w-7 h-7 text-[#f42a41] mb-2" />
          <h4 className="font-serif-bn font-bold text-[#004d38] mb-1">অফলাইন AI সহায়ক</h4>
          <p className="text-sm text-[#3d5a4a]">আইনের ৩৬ ধারার উপর ভিত্তি করে স্মার্ট উত্তর — সম্পূর্ণ অফলাইনে।</p>
        </Card>
        <a
          href="https://agrichem-guide.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Card className="p-5 border-2 border-[#f42a41] hover:shadow-lg transition-all h-full cursor-pointer">
            <img src="/agrichem-128.png" alt="AgriChem" className="w-7 h-7 mb-2 rounded-lg" />
            <h4 className="font-serif-bn font-bold text-[#004d38] mb-1">AgriChem Guide</h4>
            <p className="text-sm text-[#3d5a4a]">MoA রোটেশন, ডোজ ক্যালকুলেটর, সেফটি চেকলিস্ট — কৃষি রাসায়নিক ডেটাবেস।</p>
          </Card>
        </a>
      </div>
    </div>
  );
}

/* ============== Act Tab — interactive HTML iframe ============== */
function ActTab() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-serif-bn text-xl md:text-2xl font-bold text-[#004d38] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#f42a41]" /> কীটনাশক আইন, ২০১৮ — সম্পূর্ণ রেফারেন্স
          </h3>
          <p className="text-sm text-[#3d5a4a] mt-1">৩৬টি ধারা · বাংলা/English দ্বিভাষিক · TTS অডিও সহ</p>
        </div>
        <Button asChild variant="outline" className="border-[#006a4e] text-[#006a4e] hover:bg-[#006a4e] hover:text-white">
          <a href="/assets/pesticide-act-2018.html" download>
            <Download className="w-4 h-4 mr-2" /> HTML ডাউনলোড
          </a>
        </Button>
      </div>
      <div className="slide-frame" style={{ aspectRatio: "auto", height: "75vh", minHeight: "500px" }}>
        <iframe
          src="/assets/pesticide-act-2018.html"
          title="Pesticide Act 2018"
          className="w-full h-full"
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
    </div>
  );
}

/* ============== Slides Tab — multi-deck viewer with autoplay ============== */
function SlidesTab({ onDownload, jumpTo, onJumpConsumed }: { onDownload: (url: string, name: string) => void; jumpTo?: number | null; onJumpConsumed?: () => void }) {
  const [deckId, setDeckId] = useState<string>(DECKS[0].id);
  const [idx, setIdx] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [interval, setIntervalSec] = useState(5);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const deck = DECKS.find((d) => d.id === deckId) || DECKS[0];
  const total = deck.slides;

  const go = (delta: number) => {
    setIdx((prev) => {
      const next = prev + delta;
      if (next < 1) return total;
      if (next > total) return 1;
      return next;
    });
    setProgress(0);
  };

  const goTo = (n: number) => {
    setIdx(n);
    setProgress(0);
  };

  const switchDeck = (id: string) => {
    setDeckId(id);
    setIdx(1);
    setPlaying(false);
    setProgress(0);
  };

  // Handle jump-to from chapter click — switches to khuchra deck + sets slide
  useEffect(() => {
    if (jumpTo && jumpTo > 0) {
      // Ensure khuchra deck is selected (chapter slides map to khuchra)
      setDeckId("khuchra");
      setIdx(jumpTo);
      setPlaying(false);
      setProgress(0);
      onJumpConsumed?.();
    }
  }, [jumpTo]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
      if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        setPlaying((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  // Autoplay logic
  useEffect(() => {
    if (!playing) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
      return;
    }

    const tickMs = 50;
    const totalMs = interval * 1000;
    let elapsed = 0;
    progressRef.current = setInterval(() => {
      elapsed += tickMs;
      setProgress(Math.min(100, (elapsed / totalMs) * 100));
    }, tickMs);

    timerRef.current = setTimeout(() => {
      setIdx((prev) => {
        const next = prev + 1;
        if (next > total) {
          setPlaying(false);
          setProgress(0);
          toast({ title: "প্রেজেন্টেশন সম্পন্ন", description: `${total}টি স্লাইড প্রদর্শিত হয়েছে` });
          return 1;
        }
        return next;
      });
      setProgress(0);
    }, totalMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [playing, idx, interval, total]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, []);

  const slideNum = String(idx).padStart(2, "0");
  const bnIdx = idx.toLocaleString("bn-BD");
  const bnTotal = total.toLocaleString("bn-BD");

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-serif-bn text-xl md:text-2xl font-bold text-[#004d38] flex items-center gap-2">
          <Presentation className="w-5 h-5 text-[#f42a41]" /> প্রশিক্ষণ ডেক — {DECKS.length}টি সংস্করণ
        </h3>
        <p className="text-sm text-[#3d5a4a] mt-1">← → কীবোর্ড তীর · স্পেসবার = প্লে/পজ · অটোপ্লে চালু করুন</p>
      </div>

      {/* Deck selector */}
      <div className="grid sm:grid-cols-3 gap-2">
        {DECKS.map((d) => (
          <button
            key={d.id}
            onClick={() => switchDeck(d.id)}
            className={`text-left p-3 rounded-lg border-2 transition-all ${
              deckId === d.id
                ? "border-[#f42a41] bg-white shadow-md"
                : "border-[#c8e6d5] bg-white/60 hover:border-[#006a4e] hover:bg-white"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: d.color }}
              />
              <span className="font-serif-bn font-bold text-[#004d38] text-sm">{d.short}</span>
              <Badge variant="outline" className="ml-auto text-[10px] py-0 border-[#c8e6d5] text-[#5a7568]">
                {d.slides} স্লাইড
              </Badge>
            </div>
            <p className="text-[11px] text-[#3d5a4a] leading-tight">{d.desc}</p>
          </button>
        ))}
      </div>

      {/* Active deck title + slide counter + download */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h4 className="font-serif-bn font-bold text-[#004d38] text-base md:text-lg truncate">
            {deck.title}
          </h4>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="border-[#006a4e] text-[#006a4e] font-num">
            স্লাইড {bnIdx} / {bnTotal}
          </Badge>
          <Button
            onClick={() => onDownload(deck.pptx, `${deck.short}.pptx`)}
            size="sm"
            className="bg-[#006a4e] hover:bg-[#004d38] text-white"
          >
            <Download className="w-4 h-4 mr-1.5" /> PPTX
          </Button>
        </div>
      </div>

      {/* Autoplay controls */}
      <Card className="p-3 border-[#c8e6d5] bg-[#e6f4ed]">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setPlaying((p) => !p)}
              size="sm"
              className={playing ? "bg-[#f42a41] hover:bg-[#8B2D20] text-white" : "bg-[#006a4e] hover:bg-[#004d38] text-white"}
            >
              {playing ? (<><Pause className="w-4 h-4 mr-1.5" /> বিরতি</>) : (<><Play className="w-4 h-4 mr-1.5" /> অটোপ্লে</>)}
            </Button>
            <Button
              onClick={() => { setPlaying(false); setIdx(1); setProgress(0); }}
              size="sm"
              variant="outline"
              className="border-[#006a4e] text-[#006a4e] hover:bg-[#006a4e] hover:text-white"
            >
              <Square className="w-3.5 h-3.5 mr-1.5" /> শুরু থেকে
            </Button>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-[#3d5a4a] font-sans-bn">বিরতি:</span>
            {[3, 5, 8, 12].map((s) => (
              <button
                key={s}
                onClick={() => { setIntervalSec(s); setProgress(0); }}
                className={`px-2.5 py-1 rounded text-xs font-num font-semibold transition-colors ${
                  interval === s
                    ? "bg-[#f42a41] text-white"
                    : "bg-white text-[#006a4e] border border-[#c8e6d5] hover:bg-[#d4ebde]"
                }`}
              >
                {s}s
              </button>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1.5 bg-[#c8e6d5] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#006a4e] to-[#f42a41] transition-all duration-100 ease-linear"
            style={{ width: `${playing ? progress : 0}%` }}
          />
        </div>
      </Card>

      {/* Slide viewer */}
      <div className="slide-frame relative bg-white">
        <img
          src={`${deck.imgDir}/slide-${slideNum}.webp`}
          alt={`স্লাইড ${bnIdx}`}
          className="w-full h-full object-contain"
          loading="eager"
        />
        <button
          onClick={() => go(-1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 backdrop-blur transition-colors"
          aria-label="পূর্ববর্তী"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => go(1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 backdrop-blur transition-colors"
          aria-label="পরবর্তী"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {playing && (
          <div className="absolute top-3 right-3 bg-[#006a4e] text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md">
            <span className="w-1.5 h-1.5 bg-[#f42a41] rounded-full animate-pulse" />
            <span className="font-sans-bn">চলছে</span>
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
        {Array.from({ length: total }).map((_, i) => {
          const n = i + 1;
          const s = String(n).padStart(2, "0");
          const isActive = n === idx;
          return (
            <button
              key={n}
              onClick={() => goTo(n)}
              className={`flex-shrink-0 w-20 h-12 rounded border-2 overflow-hidden transition-all ${
                isActive ? "border-[#f42a41] scale-105" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img loading="lazy" src={`${deck.imgDir}/slide-${s}.webp`} alt={`স্লাইড ${n}`} className="w-full h-full object-cover" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============== Downloads Tab ============== */
function DownloadsTab({ onDownload }: { onDownload: (url: string, name: string) => void }) {
  const { toast } = useToast();
  const [sections, setSections] = useState<any[]>([]);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    fetch("/assets/sections.json").then(r => r.json()).then(setSections).catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    if (!filterText.trim()) return sections;
    const q = filterText.toLowerCase();
    return sections.filter((s) =>
      s.bn.toLowerCase().includes(q) ||
      s.en.toLowerCase().includes(q) ||
      s.bd.toLowerCase().includes(q) ||
      s.n.includes(q)
    );
  }, [sections, filterText]);

  const downloadSection = (s: any) => {
    const content = `কীটনাশক (পেস্টিসাইডস) আইন, ২০১৮
ধারা ${s.n}: ${s.bn} (${s.en})

${s.bd}

English:
${s.be}

${s.p === 1 ? "[এই ধারায় শাস্তি বিধান রয়েছে]" : ""}

— সূত্র: Pesticide Act, 2018 (Act No. 24 of 2018), Bangladesh
`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `section-${s.n}-${s.en.replace(/[^a-zA-Z]/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: `ধারা ${s.n} ডাউনলোড হয়েছে`, description: s.bn });
  };

  const downloadAllSections = () => {
    const content = sections.map(s =>
      `ধারা ${s.n}: ${s.bn}\n${s.bd}\n${s.be}\n${s.p === 1 ? "[শাস্তি বিধান]" : ""}\n`
    ).join("\n---\n\n");
    const blob = new Blob([`কীটনাশক আইন, ২০১৮ — সকল ধারা\n\n${content}`], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Pesticide-Act-2018-All-Sections-BN.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "সকল ৩৬টি ধারা ডাউনলোড হয়েছে" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif-bn text-xl md:text-2xl font-bold text-[#004d38] flex items-center gap-2">
          <Download className="w-5 h-5 text-[#f42a41]" /> ডাউনলোড সেন্টার
        </h3>
        <p className="text-sm text-[#3d5a4a] mt-1">সম্পূর্ণ প্যাকেজ বা আলাদা অংশ — যা খুশি ডাউনলোড করুন</p>
      </div>

      {/* Main downloads */}
      <div className="grid md:grid-cols-2 gap-3">
        <Card className="p-5 border-[#c8e6d5] bg-[#006a4e] text-[#f7fdf9]">
          <Presentation className="w-8 h-8 text-[#ff6b7a] mb-2" />
          <h4 className="font-serif-bn font-bold text-lg mb-1">সম্পূর্ণ প্রশিক্ষণ ডেক (PPTX)</h4>
          <p className="text-sm text-[#f7fdf9]/80 mb-4">৪৭টি স্লাইড — কভার, সূচি, ৭টি অধ্যায়, কেসস্টাডি, সমাপ্তি।</p>
          <Button
            onClick={() => onDownload("/assets/Balainashok_Ain_2018_Guide.pptx", "Balainashok_Ain_2018_Guide.pptx")}
            className="bg-[#f42a41] hover:bg-[#c41e2e] text-white"
          >
            <Download className="w-4 h-4 mr-2" /> ২৯ মেগাবাইট PPTX
          </Button>
        </Card>
        <Card className="p-5 border-[#c8e6d5]">
          <FileText className="w-8 h-8 text-[#006a4e] mb-2" />
          <h4 className="font-serif-bn font-bold text-lg mb-1 text-[#004d38]">ইন্টারঅ্যাকটিভ আইন HTML</h4>
          <p className="text-sm text-[#3d5a4a] mb-4">৩৬টি ধারা · TTS অডিও · বাংলা/English দ্বিভাষিক · অফলাইন কাজ করে।</p>
          <Button
            onClick={() => onDownload("/assets/pesticide-act-2018.html", "pesticide-act-2018.html")}
            variant="outline"
            className="border-[#006a4e] text-[#006a4e] hover:bg-[#006a4e] hover:text-white"
          >
            <Download className="w-4 h-4 mr-2" /> ৪৩ কিলোবাইট HTML
          </Button>
        </Card>
      </div>

      {/* All 3 decks download grid */}
      <Card className="p-5 border-[#c8e6d5]">
        <h4 className="font-serif-bn font-bold text-[#004d38] text-lg mb-1 flex items-center gap-2">
          <Presentation className="w-5 h-5 text-[#f42a41]" /> সকল প্রশিক্ষণ ডেক (৩টি সংস্করণ)
        </h4>
        <p className="text-sm text-[#3d5a4a] mb-4">তিনটি আলাদা সংস্করণ — প্রয়োজন অনুযায়ী যেকোনো একটি বা সবগুলো ডাউনলোড করুন</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {DECKS.map((d) => (
            <div
              key={d.id}
              className="p-4 rounded-lg border-2 border-[#c8e6d5] bg-white flex flex-col"
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: d.color }}
                />
                <span className="font-serif-bn font-bold text-[#004d38] text-sm">{d.short}</span>
              </div>
              <p className="text-xs text-[#3d5a4a] mb-1 leading-tight flex-1">{d.title}</p>
              <p className="text-[11px] text-[#5a7568] mb-3 font-num">{d.slides} স্লাইড · PPTX</p>
              <Button
                onClick={() => onDownload(d.pptx, `${d.short}.pptx`)}
                size="sm"
                className="bg-[#006a4e] hover:bg-[#004d38] text-white w-full"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" /> ডাউনলোড
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Offline package highlight */}
      <Card className="p-5 border-2 border-[#f42a41] bg-gradient-to-br from-[#fff0f2] to-[#f7fdf9]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-4 items-start min-w-0 flex-1">
            <div className="w-12 h-12 rounded-xl bg-[#f42a41] text-white flex items-center justify-center flex-shrink-0">
              <Download className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h4 className="font-serif-bn font-bold text-[#004d38] text-lg mb-1">সম্পূর্ণ অফলাইন প্যাকেজ (ZIP)</h4>
              <p className="text-sm text-[#3d5a4a] leading-relaxed">
                সব একসাথে — অ্যাপ + ৪৭ স্লাইড + আইন HTML + PPTX + ৩৬ ধারার ডেটা। কোনো ইন্টারনেট ছাড়াই কাজ করে।
                শুধু <code className="bg-white px-1.5 py-0.5 rounded border border-[#c8e6d5] text-xs">index.html</code> খুলুন।
              </p>
              <p className="text-xs text-[#5a7568] mt-2">৩৪ মেগাবাইট · ৫৬টি ফাইল · কোনো ইনস্টল প্রয়োজন নেই</p>
            </div>
          </div>
          <Button
            onClick={() => onDownload("/assets/Balainashok_Ain_2018_Offline_Package.zip", "Offline_Package.zip")}
            size="lg"
            className="bg-[#f42a41] hover:bg-[#c41e2e] text-white flex-shrink-0"
          >
            <Download className="w-5 h-5 mr-2" /> ZIP ডাউনলোড
          </Button>
        </div>
      </Card>

      {/* Per-section downloads */}
      <Card className="p-5 border-[#c8e6d5]">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h4 className="font-serif-bn font-bold text-[#004d38] text-lg">আলাদা ধারা ডাউনলোড</h4>
            <p className="text-sm text-[#3d5a4a]">৩৬টি ধারা থেকে যেকোনো একটি আলাদাভাবে ডাউনলোড করুন</p>
          </div>
          <Button onClick={downloadAllSections} size="sm" className="bg-[#006a4e] hover:bg-[#004d38] text-white">
            <Download className="w-4 h-4 mr-1.5" /> সকল ধারা (TXT)
          </Button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a7568]" />
          <Input
            placeholder="ধারা নম্বর বা শিরোনাম দিয়ে খুঁজুন..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="pl-9 border-[#c8e6d5]"
          />
        </div>

        <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
          {filtered.map((s) => (
            <div
              key={s.n}
              className="flex items-start gap-3 p-3 bg-[#e6f4ed] rounded-lg hover:bg-[#d4ebde] transition-colors"
            >
              <div className="w-9 h-9 rounded-md bg-[#006a4e] text-white flex items-center justify-center font-num font-bold text-sm flex-shrink-0">
                {s.n}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h5 className="font-serif-bn font-semibold text-[#004d38] text-sm">{s.bn}</h5>
                  {s.p === 1 && <Badge variant="outline" className="border-[#f42a41] text-[#f42a41] text-[10px] py-0">শাস্তি</Badge>}
                </div>
                <p className="text-xs text-[#5a7568] mt-0.5">{s.en}</p>
                <p className="text-xs text-[#3d5a4a] mt-1 line-clamp-2">{s.bd}</p>
              </div>
              <Button
                onClick={() => downloadSection(s)}
                size="sm"
                variant="ghost"
                className="text-[#006a4e] hover:bg-[#006a4e] hover:text-white flex-shrink-0"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-8 text-sm text-[#5a7568]">কোনো ধারা পাওয়া যায়নি। অন্য শব্দ দিয়ে চেষ্টা করুন।</div>
          )}
        </div>
      </Card>
    </div>
  );
}

/* ============== Qwen AI Tab ============== */
/* ============== AI Tab — offline Q&A based on Act 2018 ============== */

type Message = { role: "user" | "assistant"; text: string; refs?: string[] };

// Keyword → section number mapping (Bengali + English keywords)
const KEYWORD_MAP: { keys: string[]; sections: string[]; topic: string }[] = [
  { keys: ["নিবন্ধন", "রেজিস্ট্রেশন", "registration", "নবায়ন", "renewal", "মেয়াদ"], sections: ["৪", "৫", "৬", "৭", "৮"], topic: "নিবন্ধন" },
  { keys: ["লাইসেন্স", "licence", "license", "লাইসেন্সিং", "খুচরা", "retailer"], sections: ["৯", "১০", "১১", "১২", "১৩", "১৪"], topic: "লাইসেন্সিং" },
  { keys: ["লেবেল", "label", "প্যাকেজ", "package", "প্যাকেজিং"], sections: ["১৬", "২৯"], topic: "লেবেলিং" },
  { keys: ["mrp", "মূল্য", "দাম", "price", "সর্বোচ্চ"], sections: ["১৭"], topic: "MRP" },
  { keys: ["পরিদর্শক", "inspector", "পরিদর্শন", "নমুনা", "sample"], sections: ["২৪", "২৫", "২৬", "২৭"], topic: "পরিদর্শক" },
  { keys: ["শাস্তি", "দণ্ড", "জরিমানা", "কারাদণ", "penalty", "fine", "imprisonment"], sections: ["২৯", "৩০", "৩১", "৩২"], topic: "শাস্তি" },
  { keys: ["বাজেয়াপ্ত", "জব্দ", "forfeit", "seizure", "বাতিল"], sections: ["৩২", "৩৩", "৩৪"], topic: "বাজেয়াপ্তকরণ" },
  { keys: ["আমদানি", "import", "পাচার"], sections: ["১৫"], topic: "আমদানি নিয়ন্ত্রণ" },
  { keys: ["বিশ্লেষক", "analyst", "পরীক্ষাগার", "laboratory", "lab"], sections: ["২০", "২১", "২২", "২৩"], topic: "বিশ্লেষক ও পরীক্ষাগার" },
  { keys: ["সংজ্ঞা", "definition", "ভেজাল", "adulterated"], sections: ["২"], topic: "সংজ্ঞা" },
  { keys: ["বিজ্ঞাপন", "advertisement", "প্রচার"], sections: ["৪"], topic: "বিজ্ঞাপন" },
  { keys: ["মজুত", "storage", "সংরক্ষণ", "ব্যবহার"], sections: ["১৮"], topic: "মজুত ও ব্যবহার" },
];

function AiTab() {
  const [sections, setSections] = useState<any[]>([]);
  const sectionsRef = useRef<any[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "আসসালামু আলাইকুম! আমি বালাইনাশক আইন, ২০১৮-এর অফলাইন সহায়ক। ৩৬টি ধারার যেকোনো বিষয়ে প্রশ্ন করুন — আমি সম্পূর্ণ অফলাইনে, আইনের উপর ভিত্তি করে উত্তর দেব।",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/assets/sections.json")
      .then((r) => r.json())
      .then((data) => {
        sectionsRef.current = data;
        setSections(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const findAnswer = (q: string): { text: string; refs: string[] } => {
    const secs = sectionsRef.current;
    const lower = q.toLowerCase().trim();
    if (!lower) return { text: "দয়া করে একটি প্রশ্ন লিখুন।", refs: [] };

    // Find matching topic
    const matches: { sectionNum: string; score: number }[] = [];
    for (const mapping of KEYWORD_MAP) {
      for (const key of mapping.keys) {
        if (lower.includes(key.toLowerCase())) {
          for (const secNum of mapping.sections) {
            matches.push({ sectionNum: secNum, score: 3 });
          }
          break;
        }
      }
    }

    // Also search in section content
    for (const s of secs) {
      const sectionText = `${s.bn} ${s.bd} ${s.en} ${s.be}`.toLowerCase();
      const words = lower.split(/\s+/).filter((w) => w.length > 2);
      let score = 0;
      for (const w of words) {
        if (sectionText.includes(w)) score += 1;
      }
      if (score > 0) {
        matches.push({ sectionNum: s.n, score });
      }
    }

    // Aggregate scores
    const sectionScores: Record<string, number> = {};
    for (const m of matches) {
      sectionScores[m.sectionNum] = (sectionScores[m.sectionNum] || 0) + m.score;
    }

    const topSections = Object.entries(sectionScores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([n]) => n);

    if (topSections.length === 0 || secs.length === 0) {
      return {
        text: secs.length === 0
          ? "আইনের ধারাগুলো এখনও লোড হচ্ছে। কয়েক সেকেন্ড পর আবার চেষ্টা করুন।"
          : "দুঃখিত, আপনার প্রশ্নের সাথে সরাসরি মিলে যাওয়া কোনো ধারা পাইনি। অনুগ্রহ করে অন্য শব্দে প্রশ্নটি লিখুন বা নিচের সাজেস্টেড প্রশ্নগুলো দেখুন। আপনি 'আইন' ট্যাবে গিয়ে সব ৩৬টি ধারা পড়তে পারেন।",
        refs: [],
      };
    }

    // Build answer from matched sections
    const matchedSections = topSections
      .map((n) => secs.find((s) => s.n === n))
      .filter(Boolean);

    let text = "";
    if (matchedSections.length === 1) {
      const s = matchedSections[0];
      text = `ধারা ${s.n}: ${s.bn}\n\n${s.bd}`;
      if (s.be) text += `\n\n(English: ${s.en} — ${s.be})`;
    } else {
      text = "আপনার প্রশ্নের সাথে প্রাসঙ্গিক ধারাগুলো নিচে দেওয়া হলো:\n";
      for (const s of matchedSections) {
        text += `\n▸ ধারা ${s.n}: ${s.bn}\n  ${s.bd}\n`;
      }
    }
    text += `\n\n⚠ এটি আইনের ধারা থেকে সরাসরি নেওয়া। বিস্তারিত জন্য 'আইন' ট্যাবে পূর্ণ রেফারেন্স দেখুন।`;

    return { text, refs: topSections };
  };

  const sendQuestion = (q: string) => {
    const question = q.trim();
    if (!question || loading) return;

    setMessages((m) => [...m, { role: "user", text: question }]);
    setInput("");
    setLoading(true);

    // Brief delay for UX, then compute answer using latest sections from ref
    setTimeout(() => {
      const { text, refs } = findAnswer(question);
      setMessages((m) => [...m, { role: "assistant", text, refs }]);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-serif-bn text-xl md:text-2xl font-bold text-[#004d38] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#f42a41]" /> AI সহায়ক — বালাইনাশক আইন, ২০১৮
        </h3>
        <p className="text-sm text-[#3d5a4a] mt-1 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#006a4e]" />
          সম্পূর্ণ অফলাইন · ৩৬টি ধারার উপর ভিত্তি · কোনো ইন্টারনেট প্রয়োজন নেই
        </p>
      </div>

      {/* Chat window */}
      <Card className="border-[#c8e6d5] overflow-hidden">
        <div
          ref={scrollRef}
          className="bg-[#f7fdf9] p-4 space-y-3 max-h-[400px] overflow-y-auto"
        >
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div
                className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs ${
                  m.role === "user" ? "bg-[#f42a41]" : "bg-[#006a4e]"
                }`}
              >
                {m.role === "user" ? "আপ" : "⚖"}
              </div>
              <div
                className={`max-w-[80%] rounded-lg p-3 text-sm whitespace-pre-wrap leading-relaxed ${
                  m.role === "user"
                    ? "bg-[#f42a41] text-white"
                    : "bg-white border border-[#c8e6d5] text-[#0a1f15]"
                }`}
              >
                {m.text}
                {m.refs && m.refs.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-[#c8e6d5] flex flex-wrap gap-1">
                    {m.refs.map((r) => (
                      <span key={r} className="text-[10px] bg-[#e6f4ed] text-[#006a4e] px-2 py-0.5 rounded">
                        ধারা {r}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#006a4e] text-white flex items-center justify-center text-xs">⚖</div>
              <div className="bg-white border border-[#c8e6d5] rounded-lg p-3 text-sm text-[#5a7568] flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                চিন্তা করছি...
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-[#c8e6d5] p-3 bg-white flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendQuestion(input)}
            placeholder="যেমন: ভেজাল বালাইনাশক বিক্রি করলে কী শাস্তি?"
            className="border-[#c8e6d5]"
            disabled={loading}
          />
          <Button
            onClick={() => sendQuestion(input)}
            className="bg-[#006a4e] hover:bg-[#004d38] text-white"
            disabled={loading || !input.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Suggested questions */}
      <div>
        <h4 className="font-serif-bn font-bold text-[#004d38] mb-3 flex items-center gap-2 text-sm">
          <MessageCircle className="w-4 h-4 text-[#f42a41]" /> সাজেস্টেড প্রশ্ন — এক ক্লিকে জিজ্ঞাসা
        </h4>
        <div className="grid sm:grid-cols-2 gap-2">
          {AI_SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => sendQuestion(s.q)}
              disabled={loading}
              className="text-left p-2.5 bg-white border border-[#c8e6d5] rounded-lg hover:border-[#f42a41] hover:shadow-sm transition-all flex gap-2.5 items-center disabled:opacity-50"
            >
              <Badge className="bg-[#e6f4ed] text-[#006a4e] hover:bg-[#e6f4ed] text-[10px] flex-shrink-0">{s.tag}</Badge>
              <span className="text-xs text-[#0a1f15] leading-relaxed flex-1">{s.q}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Info card */}
      <Card className="p-3 border-[#c8e6d5] bg-[#e6f4ed]">
        <p className="text-xs text-[#3d5a4a] flex items-start gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#006a4e] flex-shrink-0 mt-0.5" />
          <span>
            এই AI সহায়ক সম্পূর্ণ অফলাইনে কাজ করে — কোনো ডেটা সার্ভারে পাঠানো হয় না।
            উত্তরগুলো সরাসরি বালাইনাশক আইন, ২০১৮-এর ৩৬টি ধারা থেকে নেওয়া। জটিল প্রশ্নের জন্য
            সংশ্লিষ্ট ধারা উল্লেখ সহ উত্তর দেওয়া হয়।
          </span>
        </p>
      </Card>
    </div>
  );
}

/* ============== Share Platform Button helper ============== */
function SharePlatformBtn({
  label,
  color,
  icon,
  onClick,
}: {
  label: string;
  color: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 p-3 bg-white border border-[#c8e6d5] rounded-lg hover:shadow-md hover:border-[#f42a41] transition-all"
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white"
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>
      <span className="text-[11px] text-[#0a1f15] font-sans-bn font-medium text-center leading-tight">{label}</span>
    </button>
  );
}
