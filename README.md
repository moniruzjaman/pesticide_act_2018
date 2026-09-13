# বালাইনাশক আইন, ২০১৮ — খুচরা বিক্রেতার সমন্বিত ফিল্ড গাইড

> **Pesticide Act, 2018 (Bangladesh) — Comprehensive Retailer Field Guide**
> A Next.js 16 web app integrating the full Pesticide Act 2018 (Bangla), a 47-slide training deck viewer, a download center, and Qwen AI smart assistant.

## 🌟 Features

### Five-Tab Single-Page App
| Tab | Description |
|-----|-------------|
| **সূচি (Overview)** | Hero, quick stats, 7-chapter grid, feature cards |
| **আইন (Act)** | Full Pesticide Act 2018 embedded as interactive iframe — 36 sections, bilingual (BN/EN), TTS audio, tabs, search |
| **স্লাইড (Slides)** | Image-based slideshow of all 47 PPT slides with **autoplay**, speed control (3/5/8/12s), progress bar, keyboard navigation |
| **ডাউনলোড (Downloads)** | Full PPTX (29MB), HTML act (43KB), all-sections TXT, per-section download (36 individual files) with live search, offline ZIP (34MB) |
| **Qwen AI** | Smart assistant — 8 suggested questions, custom input, popup + clipboard copy |

### Smart Qwen AI Integration
- Floating button (bottom-right) on every page
- Popup approach (Qwen blocks iframe embedding via `X-Frame-Options: SAMEORIGIN`)
- Click suggested question → auto-copies to clipboard → opens Qwen popup → toast notification
- 8 pre-built questions: Section 18 licensing, fake detection, penalties, inspector powers, retailer responsibilities, MRP, IRM, pest resistance

### Bengali Typography & Palette
- **Fonts:** Noto Serif Bengali (headings), Noto Sans Bengali (body), Inter (numerals)
- **Palette:** Cream background (#FAF6EE), deep forest green primary (#1E4D3B), harvest gold accent (#C7912C)
- **Responsive:** Mobile-first with hamburger nav, desktop horizontal tabs

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm/bun package manager

### Installation
```bash
# Clone the repository
git clone https://github.com/moniruzjaman/pesticide_act_2018.git
cd pesticide_act_2018

# Install dependencies
bun install
# or: npm install

# Start development server
bun run dev
# or: npm run dev

# Open http://localhost:3000
```

### Build for Production
```bash
bun run build
bun run start
```

## 📁 Project Structure

```
pesticide_act_2018/
├── src/
│   └── app/
│       ├── layout.tsx          # Root layout with Bengali fonts
│       ├── page.tsx            # Main 5-tab SPA
│       └── globals.css         # Palette overrides + utility classes
├── public/
│   ├── assets/
│   │   ├── pesticide-act-2018.html    # Interactive act (36 sections, TTS)
│   │   ├── Balainashok_Ain_2018_Guide.pptx  # 47-slide deck (29MB)
│   │   ├── sections.json               # 36 sections data
│   │   └── keys.json                   # 8 key statements
│   └── slides/
│       └── slide-01.png ... slide-47.png  # 47 slide images (4.7MB)
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── deploy.sh                   # GitHub push helper script
└── README.md
```

## 🎮 Slides Tab — Autoplay Controls

| Control | Action |
|---------|--------|
| **অটোপ্লে / বিরতি** | Green → Red toggle; start/pause autoplay |
| **শুরু থেকে** | Return to slide 1, stop autoplay |
| **৩সে / ৫সে / ৮সে / ১২সে** | Interval selector (seconds per slide) |
| **← →** | Previous / Next slide (keyboard) |
| **Spacebar** | Toggle play/pause |
| **Progress bar** | Smooth gradient bar, updates every 50ms |
| **"চলছে" badge** | Pulsing indicator when playing |

After slide 47, autoplay stops automatically with a toast notification.

## 📦 Offline Package

A standalone ZIP package is available for offline use:
- `Balainashok_Ain_2018_Offline_Package.zip` (34MB, 56 files)
- Contains: standalone HTML app + 47 slides + PPTX + Act HTML + JSON data
- Works without internet (except Qwen AI tab)
- Just extract and open `index.html`

## 🛠 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **UI Components:** shadcn/ui (New York style) with Lucide icons
- **Fonts:** next/font (Noto Serif Bengali, Noto Sans Bengali, Inter)

## 📚 Content Source

- **Pesticide Act, 2018** (Act No. 24 of 2018), Government of Bangladesh
- **36 sections** extracted from the official act
- **47-slide training deck** compiled from three source decks:
  - Pesticide Integrity Field Guide
  - Securing Our Agricultural Future
  - Pesticide Law 2018 Compliance Guide

## 🤖 Qwen AI Integration

The Qwen AI assistant is integrated via popup window (not iframe) due to Qwen's `X-Frame-Options: SAMEORIGIN` security policy.

**Workflow:**
1. Click a suggested question or type your own
2. Question is auto-copied to clipboard
3. Qwen chat opens in a new popup window (900×700)
4. Paste with `Ctrl+V` and send
5. Qwen responds in Bengali with legal references

**Qwen URL:** `https://chat.qwen.ai/s/deploy/t_8e6f0064-5286-4512-9b2a-4b0f79c1507b`

## 📄 License

This project is for educational and training purposes. The Pesticide Act, 2018 is public legislation of Bangladesh.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Contact

- **Repository:** [github.com/moniruzjaman/pesticide_act_2018](https://github.com/moniruzjaman/pesticide_act_2018)
- **Version:** Integrated Edition 2026

---

**শপথ:** ভেজালের বিরুদ্ধে দাঁড়ানো শুধু আইনি দায়িত্ব নয় — এটি সামাজিক ও নৈতিক দায়বদ্ধতা।
