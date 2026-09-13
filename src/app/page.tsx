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
  AlertTriangle,
  ShieldCheck,
  Send,
  MessageCircle,
  Loader2,
  WifiOff,
  Share2,
} from "lucide-react";

const TOTAL_SLIDES = 47;

// 7 chapter overview (mirrors the deck's TOC)
const CHAPTERS = [
  { num: "০১", title: "সংকটের প্রেক্ষাপট", range: "স্লাইড ৩–৬", summary: "ভেজাল বালাইনাশক কৃষক, ভোক্তা ও পরিবেশের জন্য বহুমুখী ক্ষতির কারণ — বাংলাদেশে বাজারের ১৫–২০% ভেজাল।" },
  { num: "০২", title: "ভেজাল চেনার বিজ্ঞান", range: "স্লাইড ৭–১৩", summary: "WHO সংজ্ঞা ও ৫টি শ্রেণির ভিত্তিতে চাক্ষুষ ও পরীক্ষাগার (HPLC/GC) শনাক্তকরণ।" },
  { num: "০৩", title: "বালাইনাশক আইন, ২০১৮", range: "স্লাইড ১৪–২০", summary: "নিবন্ধন, লাইসেন্সিং, MRP ও লেবেলিং — ৯ অধ্যায় ৬৮ ধারায় সরকারি নিয়ন্ত্রণের কাঠামো।" },
  { num: "০৪", title: "মাঠ পর্যায়ে শনাক্তকরণ", range: "স্লাইড ২১–২৭", summary: "৫-ধাপ চেকলিস্ট ও ৩-শ্রেণি রেড ফ্ল্যাগ দিয়ে দোকানে ভেজাল ধরা — দুটি বাস্তব কেসস্টাডি সহ।" },
  { num: "০৫", title: "প্রতিরোধ ক্ষমতা ও দীর্ঘমেয়াদি ক্ষতি", range: "স্লাইড ২৮–৩৪", summary: "অনিয়ন্ত্রিত ব্যবহার পোকা প্রতিরোধী করে — মাটি, পানি ও স্বাস্থ্যের স্থায়ী ক্ষতি।" },
  { num: "০৬", title: "আইন প্রয়োগ ও দণ্ডবিধি", range: "স্লাইড ৩৫–৩৯", summary: "পরিদর্শকের ক্ষমতা, নমুনা সংগ্রহ, জরিমানা (১–৩ লক্ষ ৳) ও বাজেয়াপ্তকরণ।" },
  { num: "০৭", title: "খুচরা বিক্রেতার সম্মানের পথ", range: "স্লাইড ৪০–৪৭", summary: "IRM প্রচার, নৈতিক অনুশীলন ও গ্রাহক শিক্ষার মাধ্যমে সম্মান — বিক্রেতা কৃষকের রক্ষক।" },
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

  // Web Share API
  const handleShare = async () => {
    const shareData = {
      title: "বালাইনাশক আইন, ২০১৮ — সমন্বিত ফিল্ড গাইড",
      text: "৩৬ ধারা · ৪৭ স্লাইড · অফলাইন AI · বাংলা — খুচরা বিক্রেতার সমন্বিত ফিল্ড গাইড",
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({ title: "লিঙ্ক কপি হয়েছে", description: "শেয়ার করতে পেস্ট করুন" });
      } catch {}
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6EE]">
      {/* Top accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-[#1E4D3B] from-70% to-[#C7912C] to-70%" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FAF6EE]/95 backdrop-blur border-b border-[#D9D2BF]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-[#1E4D3B] flex items-center justify-center text-[#FAF6EE] flex-shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h1 className="font-serif-bn font-bold text-[#14342A] text-base md:text-lg leading-tight truncate">
                বালাইনাশক আইন, ২০১৮
              </h1>
              <p className="text-[10px] md:text-xs text-[#6B6B6B] truncate">খুচরা বিক্রেতার সমন্বিত ফিল্ড গাইড</p>
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
              className="hidden sm:inline-flex items-center justify-center w-8 h-8 rounded-md border border-[#D9D2BF] text-[#1E4D3B] hover:bg-[#F2ECDD]"
              title="শেয়ার করুন"
              aria-label="শেয়ার"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <Button
              size="sm"
              className="bg-[#C7912C] hover:bg-[#9A6E1E] text-white hidden sm:inline-flex"
              onClick={() => setActiveTab("ai")}
            >
              <Sparkles className="w-4 h-4 mr-1.5" /> AI
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden border-[#D9D2BF]"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
            >
              {mobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileNavOpen && (
          <div className="md:hidden border-t border-[#D9D2BF] bg-[#FAF6EE] p-2 grid grid-cols-2 gap-1">
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
        <div className="bg-[#B23A2A] text-white text-center py-1.5 text-xs md:text-sm font-sans-bn flex items-center justify-center gap-2">
          <WifiOff className="w-3.5 h-3.5" />
          আপনি অফলাইনে আছেন — তবে আইন, স্লাইড ও AI সহায়ক কাজ করবে
        </div>
      )}
      {installPrompt && (
        <div className="bg-[#1E4D3B] text-[#FAF6EE] py-2 px-4 text-xs md:text-sm flex items-center justify-between gap-3">
          <span className="font-sans-bn">📱 অ্যাপ হোম স্ক্রিনে ইনস্টল করুন — অফলাইনে ব্যবহার করুন</span>
          <button onClick={handleInstall} className="bg-[#C7912C] hover:bg-[#9A6E1E] text-white px-3 py-1 rounded text-xs font-semibold">
            ইনস্টল
          </button>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-6 md:py-10">
        {activeTab === "overview" && <OverviewTab onNavigate={setActiveTab} />}
        {activeTab === "act" && <ActTab />}
        {activeTab === "slides" && <SlidesTab />}
        {activeTab === "downloads" && <DownloadsTab />}
        {activeTab === "ai" && <AiTab />}
      </main>

      {/* Footer */}
      <footer className="bg-[#14342A] text-[#CDE6DD] text-center py-5 text-xs md:text-sm">
        বালাইনাশক আইন, ২০১৮ · খুচরা বিক্রেতার সমন্বিত ফিল্ড গাইড · সমন্বিত সংস্করণ ২০২৬ · অফলাইন AI সহ
      </footer>

      {/* Floating AI button */}
      <button
        onClick={() => setActiveTab("ai")}
        className="fixed bottom-5 right-5 z-50 bg-[#C7912C] hover:bg-[#9A6E1E] text-white rounded-full shadow-2xl px-4 py-3 md:px-5 md:py-4 flex items-center gap-2 transition-all hover:scale-105"
        aria-label="AI সহায়ক খুলুন"
      >
        <Sparkles className="w-5 h-5" />
        <span className="font-sans-bn font-semibold text-sm hidden sm:inline">AI সহায়ক</span>
      </button>

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
          ? "bg-[#1E4D3B] text-[#FAF6EE]"
          : "text-[#1E4D3B] hover:bg-[#F2ECDD]"
      }`}
    >
      {children}
    </button>
  );
}

/* ============== Overview Tab ============== */
function OverviewTab({ onNavigate }: { onNavigate: (t: TabId) => void }) {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <Card className="bg-gradient-to-br from-[#1E4D3B] to-[#14342A] text-[#FAF6EE] border-none p-6 md:p-10">
        <Badge className="bg-[#C7912C] text-white hover:bg-[#C7912C] mb-3">খুচরা বিক্রেতার ফিল্ড গাইড</Badge>
        <h2 className="font-serif-bn text-3xl md:text-5xl font-bold leading-tight mb-3">
          বালাইনাশক আইন, ২০১৮
        </h2>
        <p className="font-serif-bn text-xl md:text-2xl text-[#E0B659] mb-4">
          সমন্বিত ফিল্ড গাইড ও আইনগত নির্দেশিকা
        </p>
        <p className="text-[#FAF6EE]/85 max-w-3xl text-sm md:text-base leading-relaxed mb-6">
          ভেজাল বালাইনাশক শনাক্তকরণ, আইনি বিধান, এবং নৈতিক ব্যবসায়িক অনুশীলন —
          ৪৭টি স্লাইডের প্রশিক্ষণ ডেক, ৩৬টি ধারার ইন্টারঅ্যাকটিভ আইনি রেফারেন্স, এবং Qwen AI সহ
          সমন্বিত ওয়েব অ্যাপ্লিকেশন।
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-white/10 text-white border-white/30">৪৭ স্লাইড</Badge>
          <Badge variant="outline" className="bg-white/10 text-white border-white/30">৭ অধ্যায়</Badge>
          <Badge variant="outline" className="bg-white/10 text-white border-white/30">৩৬ ধারা</Badge>
          <Badge variant="outline" className="bg-white/10 text-white border-white/30">Qwen AI সহ</Badge>
        </div>
        <div className="flex flex-wrap gap-3 mt-6">
          <Button onClick={() => onNavigate("act")} className="bg-[#C7912C] hover:bg-[#9A6E1E] text-white">
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

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { num: "৩০%", label: "উন্নয়নশীল দেশে ভেজালের হার", color: "#B23A2A" },
          { num: "৪৮০ crore ৳", label: "বাংলাদেশের বার্ষিক বাজার", color: "#1E4D3B" },
          { num: "৩২", label: "সীমান্ত জেলায় প্রবেশ", color: "#C7912C" },
          { num: "৩৬", label: "আইনি ধারা", color: "#2E7D44" },
        ].map((s, i) => (
          <Card key={i} className="p-4 text-center border-[#D9D2BF]">
            <div className="font-num font-bold text-2xl md:text-3xl" style={{ color: s.color }}>{s.num}</div>
            <div className="text-xs text-[#4A4A4A] mt-1.5 leading-tight">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Chapters */}
      <div>
        <h3 className="font-serif-bn text-xl md:text-2xl font-bold text-[#14342A] mb-4 flex items-center gap-2">
          <ListTree className="w-5 h-5 text-[#C7912C]" /> সাতটি অধ্যায় — এক নজরে
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          {CHAPTERS.map((c) => (
            <Card key={c.num} className="p-4 border-[#D9D2BF] hover:border-[#C7912C] hover:shadow-md transition-all">
              <div className="flex gap-3">
                <div className="w-11 h-11 rounded-full bg-[#1E4D3B] text-white flex items-center justify-center font-num font-bold text-base flex-shrink-0">
                  {c.num}
                </div>
                <div className="min-w-0">
                  <h4 className="font-serif-bn font-bold text-[#14342A] text-base mb-0.5">{c.title}</h4>
                  <p className="text-xs text-[#6B6B6B] mb-1.5 font-num">{c.range}</p>
                  <p className="text-sm text-[#4A4A4A] leading-relaxed">{c.summary}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid md:grid-cols-3 gap-3">
        <Card className="p-5 border-[#D9D2BF]">
          <BookOpen className="w-7 h-7 text-[#1E4D3B] mb-2" />
          <h4 className="font-serif-bn font-bold text-[#14342A] mb-1">ইন্টারঅ্যাকটিভ আইন</h4>
          <p className="text-sm text-[#4A4A4A]">৩৬টি ধারা — বাংলা/English দ্বিভাষিক, TTS অডিও, ট্যাব ভিউ, সার্চ সুবিধা সহ।</p>
        </Card>
        <Card className="p-5 border-[#D9D2BF]">
          <Presentation className="w-7 h-7 text-[#1E4D3B] mb-2" />
          <h4 className="font-serif-bn font-bold text-[#14342A] mb-1">স্লাইড ভিউয়ার</h4>
          <p className="text-sm text-[#4A4A4A]">৪৭টি স্লাইডের প্রশিক্ষণ ডেক — প্রিভিউ, নেক্সট, কীবোর্ড নেভিগেশন সহ।</p>
        </Card>
        <Card className="p-5 border-[#D9D2BF]">
          <Sparkles className="w-7 h-7 text-[#C7912C] mb-2" />
          <h4 className="font-serif-bn font-bold text-[#14342A] mb-1">অফলাইন AI সহায়ক</h4>
          <p className="text-sm text-[#4A4A4A]">আইনের ৩৬ ধারার উপর ভিত্তি করে স্মার্ট উত্তর — সম্পূর্ণ অফলাইনে, কোনো ইন্টারনেট ছাড়াই।</p>
        </Card>
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
          <h3 className="font-serif-bn text-xl md:text-2xl font-bold text-[#14342A] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#C7912C]" /> কীটনাশক আইন, ২০১৮ — সম্পূর্ণ রেফারেন্স
          </h3>
          <p className="text-sm text-[#4A4A4A] mt-1">৩৬টি ধারা · বাংলা/English দ্বিভাষিক · TTS অডিও সহ</p>
        </div>
        <Button asChild variant="outline" className="border-[#1E4D3B] text-[#1E4D3B] hover:bg-[#1E4D3B] hover:text-white">
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

/* ============== Slides Tab — image slideshow with autoplay ============== */
function SlidesTab() {
  const [idx, setIdx] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [interval, setIntervalSec] = useState(5);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = (delta: number) => {
    setIdx((prev) => {
      const next = prev + delta;
      if (next < 1) return TOTAL_SLIDES;
      if (next > TOTAL_SLIDES) return 1;
      return next;
    });
    setProgress(0);
  };

  const goTo = (n: number) => {
    setIdx(n);
    setProgress(0);
  };

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
  }, []);

  // Autoplay logic
  useEffect(() => {
    if (!playing) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
      return;
    }

    // Smooth progress bar
    const tickMs = 50;
    const totalMs = interval * 1000;
    let elapsed = 0;
    progressRef.current = setInterval(() => {
      elapsed += tickMs;
      setProgress(Math.min(100, (elapsed / totalMs) * 100));
    }, tickMs);

    // Advance slide
    timerRef.current = setTimeout(() => {
      setIdx((prev) => {
        const next = prev + 1;
        if (next > TOTAL_SLIDES) {
          setPlaying(false);
          setProgress(0);
          toast({ title: "প্রেজেন্টেশন সম্পন্ন", description: "৪৭টি স্লাইড প্রদর্শিত হয়েছে" });
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
  }, [playing, idx, interval]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, []);

  const slideNum = String(idx).padStart(2, "0");
  const bnIdx = idx.toLocaleString("bn-BD");
  const bnTotal = TOTAL_SLIDES.toLocaleString("bn-BD");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-serif-bn text-xl md:text-2xl font-bold text-[#14342A] flex items-center gap-2">
            <Presentation className="w-5 h-5 text-[#C7912C]" /> প্রশিক্ষণ ডেক — ৪৭টি স্লাইড
          </h3>
          <p className="text-sm text-[#4A4A4A] mt-1">← → কীবোর্ড তীর · স্পেসবার = প্লে/পজ · অটোপ্লে চালু করুন</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="border-[#1E4D3B] text-[#1E4D3B] font-num">
            স্লাইড {bnIdx} / {bnTotal}
          </Badge>
          <Button asChild size="sm" className="bg-[#1E4D3B] hover:bg-[#14342A] text-white">
            <a href="/assets/Balainashok_Ain_2018_Guide.pptx" download>
              <Download className="w-4 h-4 mr-1.5" /> PPTX
            </a>
          </Button>
        </div>
      </div>

      {/* Autoplay controls */}
      <Card className="p-3 border-[#D9D2BF] bg-[#F2ECDD]">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setPlaying((p) => !p)}
              size="sm"
              className={playing ? "bg-[#B23A2A] hover:bg-[#8B2D20] text-white" : "bg-[#1E4D3B] hover:bg-[#14342A] text-white"}
            >
              {playing ? (<><Pause className="w-4 h-4 mr-1.5" /> বিরতি</>) : (<><Play className="w-4 h-4 mr-1.5" /> অটোপ্লে</>)}
            </Button>
            <Button
              onClick={() => { setPlaying(false); setIdx(1); setProgress(0); }}
              size="sm"
              variant="outline"
              className="border-[#1E4D3B] text-[#1E4D3B] hover:bg-[#1E4D3B] hover:text-white"
            >
              <Square className="w-3.5 h-3.5 mr-1.5" /> শুরু থেকে
            </Button>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-[#4A4A4A] font-sans-bn">বিরতি:</span>
            {[3, 5, 8, 12].map((s) => (
              <button
                key={s}
                onClick={() => { setIntervalSec(s); setProgress(0); }}
                className={`px-2.5 py-1 rounded text-xs font-num font-semibold transition-colors ${
                  interval === s
                    ? "bg-[#C7912C] text-white"
                    : "bg-white text-[#1E4D3B] border border-[#D9D2BF] hover:bg-[#EBE3CE]"
                }`}
              >
                {s}s
              </button>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1.5 bg-[#D9D2BF] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#1E4D3B] to-[#C7912C] transition-all duration-100 ease-linear"
            style={{ width: `${playing ? progress : 0}%` }}
          />
        </div>
      </Card>

      {/* Slide viewer */}
      <div className="slide-frame relative bg-white">
        <img
          src={`/slides/slide-${slideNum}.png`}
          alt={`স্লাইড ${bnIdx}`}
          className="w-full h-full object-contain"
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

        {/* Playing indicator */}
        {playing && (
          <div className="absolute top-3 right-3 bg-[#1E4D3B] text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md">
            <span className="w-1.5 h-1.5 bg-[#C7912C] rounded-full animate-pulse" />
            <span className="font-sans-bn">চলছে</span>
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
        {Array.from({ length: TOTAL_SLIDES }).map((_, i) => {
          const n = i + 1;
          const s = String(n).padStart(2, "0");
          const isActive = n === idx;
          return (
            <button
              key={n}
              onClick={() => goTo(n)}
              className={`flex-shrink-0 w-20 h-12 rounded border-2 overflow-hidden transition-all ${
                isActive ? "border-[#C7912C] scale-105" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={`/slides/slide-${s}.png`} alt={`স্লাইড ${n}`} className="w-full h-full object-cover" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============== Downloads Tab ============== */
function DownloadsTab() {
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
        <h3 className="font-serif-bn text-xl md:text-2xl font-bold text-[#14342A] flex items-center gap-2">
          <Download className="w-5 h-5 text-[#C7912C]" /> ডাউনলোড সেন্টার
        </h3>
        <p className="text-sm text-[#4A4A4A] mt-1">সম্পূর্ণ প্যাকেজ বা আলাদা অংশ — যা খুশি ডাউনলোড করুন</p>
      </div>

      {/* Main downloads */}
      <div className="grid md:grid-cols-2 gap-3">
        <Card className="p-5 border-[#D9D2BF] bg-[#1E4D3B] text-[#FAF6EE]">
          <Presentation className="w-8 h-8 text-[#E0B659] mb-2" />
          <h4 className="font-serif-bn font-bold text-lg mb-1">সম্পূর্ণ প্রশিক্ষণ ডেক (PPTX)</h4>
          <p className="text-sm text-[#FAF6EE]/80 mb-4">৪৭টি স্লাইড — কভার, সূচি, ৭টি অধ্যায়, কেসস্টাডি, সমাপ্তি।</p>
          <Button asChild className="bg-[#C7912C] hover:bg-[#9A6E1E] text-white">
            <a href="/assets/Balainashok_Ain_2018_Guide.pptx" download>
              <Download className="w-4 h-4 mr-2" /> ২৯ মেগাবাইট PPTX
            </a>
          </Button>
        </Card>
        <Card className="p-5 border-[#D9D2BF]">
          <FileText className="w-8 h-8 text-[#1E4D3B] mb-2" />
          <h4 className="font-serif-bn font-bold text-lg mb-1 text-[#14342A]">ইন্টারঅ্যাকটিভ আইন HTML</h4>
          <p className="text-sm text-[#4A4A4A] mb-4">৩৬টি ধারা · TTS অডিও · বাংলা/English দ্বিভাষিক · অফলাইন কাজ করে।</p>
          <Button asChild variant="outline" className="border-[#1E4D3B] text-[#1E4D3B] hover:bg-[#1E4D3B] hover:text-white">
            <a href="/assets/pesticide-act-2018.html" download>
              <Download className="w-4 h-4 mr-2" /> ৪৩ কিলোবাইট HTML
            </a>
          </Button>
        </Card>
      </div>

      {/* Offline package highlight */}
      <Card className="p-5 border-2 border-[#C7912C] bg-gradient-to-br from-[#F7EED6] to-[#FAF6EE]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-4 items-start min-w-0 flex-1">
            <div className="w-12 h-12 rounded-xl bg-[#C7912C] text-white flex items-center justify-center flex-shrink-0">
              <Download className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h4 className="font-serif-bn font-bold text-[#14342A] text-lg mb-1">সম্পূর্ণ অফলাইন প্যাকেজ (ZIP)</h4>
              <p className="text-sm text-[#4A4A4A] leading-relaxed">
                সব একসাথে — অ্যাপ + ৪৭ স্লাইড + আইন HTML + PPTX + ৩৬ ধারার ডেটা। কোনো ইন্টারনেট ছাড়াই কাজ করে।
                শুধু <code className="bg-white px-1.5 py-0.5 rounded border border-[#D9D2BF] text-xs">index.html</code> খুলুন।
              </p>
              <p className="text-xs text-[#6B6B6B] mt-2">৩৪ মেগাবাইট · ৫৬টি ফাইল · কোনো ইনস্টল প্রয়োজন নেই</p>
            </div>
          </div>
          <Button asChild size="lg" className="bg-[#C7912C] hover:bg-[#9A6E1E] text-white flex-shrink-0">
            <a href="/assets/Balainashok_Ain_2018_Offline_Package.zip" download>
              <Download className="w-5 h-5 mr-2" /> ZIP ডাউনলোড
            </a>
          </Button>
        </div>
      </Card>

      {/* Per-section downloads */}
      <Card className="p-5 border-[#D9D2BF]">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h4 className="font-serif-bn font-bold text-[#14342A] text-lg">আলাদা ধারা ডাউনলোড</h4>
            <p className="text-sm text-[#4A4A4A]">৩৬টি ধারা থেকে যেকোনো একটি আলাদাভাবে ডাউনলোড করুন</p>
          </div>
          <Button onClick={downloadAllSections} size="sm" className="bg-[#1E4D3B] hover:bg-[#14342A] text-white">
            <Download className="w-4 h-4 mr-1.5" /> সকল ধারা (TXT)
          </Button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B]" />
          <Input
            placeholder="ধারা নম্বর বা শিরোনাম দিয়ে খুঁজুন..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="pl-9 border-[#D9D2BF]"
          />
        </div>

        <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
          {filtered.map((s) => (
            <div
              key={s.n}
              className="flex items-start gap-3 p-3 bg-[#F2ECDD] rounded-lg hover:bg-[#EBE3CE] transition-colors"
            >
              <div className="w-9 h-9 rounded-md bg-[#1E4D3B] text-white flex items-center justify-center font-num font-bold text-sm flex-shrink-0">
                {s.n}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h5 className="font-serif-bn font-semibold text-[#14342A] text-sm">{s.bn}</h5>
                  {s.p === 1 && <Badge variant="outline" className="border-[#B23A2A] text-[#B23A2A] text-[10px] py-0">শাস্তি</Badge>}
                </div>
                <p className="text-xs text-[#6B6B6B] mt-0.5">{s.en}</p>
                <p className="text-xs text-[#4A4A4A] mt-1 line-clamp-2">{s.bd}</p>
              </div>
              <Button
                onClick={() => downloadSection(s)}
                size="sm"
                variant="ghost"
                className="text-[#1E4D3B] hover:bg-[#1E4D3B] hover:text-white flex-shrink-0"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-8 text-sm text-[#6B6B6B]">কোনো ধারা পাওয়া যায়নি। অন্য শব্দ দিয়ে চেষ্টা করুন।</div>
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
        <h3 className="font-serif-bn text-xl md:text-2xl font-bold text-[#14342A] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#C7912C]" /> AI সহায়ক — বালাইনাশক আইন, ২০১৮
        </h3>
        <p className="text-sm text-[#4A4A4A] mt-1 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D44]" />
          সম্পূর্ণ অফলাইন · ৩৬টি ধারার উপর ভিত্তি · কোনো ইন্টারনেট প্রয়োজন নেই
        </p>
      </div>

      {/* Chat window */}
      <Card className="border-[#D9D2BF] overflow-hidden">
        <div
          ref={scrollRef}
          className="bg-[#FAF6EE] p-4 space-y-3 max-h-[400px] overflow-y-auto"
        >
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div
                className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs ${
                  m.role === "user" ? "bg-[#C7912C]" : "bg-[#1E4D3B]"
                }`}
              >
                {m.role === "user" ? "আপ" : "⚖"}
              </div>
              <div
                className={`max-w-[80%] rounded-lg p-3 text-sm whitespace-pre-wrap leading-relaxed ${
                  m.role === "user"
                    ? "bg-[#C7912C] text-white"
                    : "bg-white border border-[#D9D2BF] text-[#1A1A1A]"
                }`}
              >
                {m.text}
                {m.refs && m.refs.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-[#D9D2BF] flex flex-wrap gap-1">
                    {m.refs.map((r) => (
                      <span key={r} className="text-[10px] bg-[#F2ECDD] text-[#1E4D3B] px-2 py-0.5 rounded">
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
              <div className="w-8 h-8 rounded-full bg-[#1E4D3B] text-white flex items-center justify-center text-xs">⚖</div>
              <div className="bg-white border border-[#D9D2BF] rounded-lg p-3 text-sm text-[#6B6B6B] flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                চিন্তা করছি...
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-[#D9D2BF] p-3 bg-white flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendQuestion(input)}
            placeholder="যেমন: ভেজাল বালাইনাশক বিক্রি করলে কী শাস্তি?"
            className="border-[#D9D2BF]"
            disabled={loading}
          />
          <Button
            onClick={() => sendQuestion(input)}
            className="bg-[#1E4D3B] hover:bg-[#14342A] text-white"
            disabled={loading || !input.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Suggested questions */}
      <div>
        <h4 className="font-serif-bn font-bold text-[#14342A] mb-3 flex items-center gap-2 text-sm">
          <MessageCircle className="w-4 h-4 text-[#C7912C]" /> সাজেস্টেড প্রশ্ন — এক ক্লিকে জিজ্ঞাসা
        </h4>
        <div className="grid sm:grid-cols-2 gap-2">
          {AI_SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => sendQuestion(s.q)}
              disabled={loading}
              className="text-left p-2.5 bg-white border border-[#D9D2BF] rounded-lg hover:border-[#C7912C] hover:shadow-sm transition-all flex gap-2.5 items-center disabled:opacity-50"
            >
              <Badge className="bg-[#F2ECDD] text-[#1E4D3B] hover:bg-[#F2ECDD] text-[10px] flex-shrink-0">{s.tag}</Badge>
              <span className="text-xs text-[#1A1A1A] leading-relaxed flex-1">{s.q}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Info card */}
      <Card className="p-3 border-[#D9D2BF] bg-[#F2ECDD]">
        <p className="text-xs text-[#4A4A4A] flex items-start gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#1E4D3B] flex-shrink-0 mt-0.5" />
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
