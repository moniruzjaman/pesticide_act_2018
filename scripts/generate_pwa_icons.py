#!/usr/bin/env python3
"""Generate PWA icons (192px and 512px) for the Pesticide Act app."""
from PIL import Image, ImageDraw, ImageFont
import os

OUTPUT_DIR = "/home/z/my-project/public"
PRIMARY = (30, 77, 59)
ACCENT = (199, 145, 44)
CREAM = (250, 246, 238)

def find_font(size):
    candidates = [
        "/usr/share/fonts/truetype/noto-serif-sc/NotoSerifSC-Bold.otf",
        "/usr/share/fonts/truetype/chinese/NotoSansSC-Bold.otf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    ]
    for c in candidates:
        if os.path.exists(c):
            try:
                return ImageFont.truetype(c, size)
            except Exception:
                pass
    return ImageFont.load_default()

def make_icon(size, out_path):
    img = Image.new("RGB", (size, size), PRIMARY)
    d = ImageDraw.Draw(img)
    strip_h = max(4, size // 20)
    d.rectangle([0, 0, size, strip_h], fill=ACCENT)
    d.rectangle([0, size - strip_h, size, size], fill=ACCENT)
    font_size = int(size * 0.55)
    f = find_font(font_size)
    text = "§"
    try:
        bbox = d.textbbox((0, 0), text, font=f)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        y = (size - th) // 2 - bbox[1]
    except Exception:
        tw, th = font_size, font_size
        y = (size - th) // 2
    x = (size - tw) // 2
    d.text((x, y), text, fill=CREAM, font=f)
    dot_r = max(8, size // 12)
    cx = size - dot_r - size // 12
    cy = size - dot_r - size // 12
    d.ellipse([cx - dot_r, cy - dot_r, cx + dot_r, cy + dot_r], fill=ACCENT)
    img.save(out_path, "PNG", optimize=True)
    print(f"  Wrote {out_path} ({size}x{size})")

print("Generating PWA icons...")
make_icon(192, f"{OUTPUT_DIR}/icon-192.png")
make_icon(512, f"{OUTPUT_DIR}/icon-512.png")
make_icon(180, f"{OUTPUT_DIR}/apple-touch-icon.png")
make_icon(32, f"{OUTPUT_DIR}/favicon-32.png")
make_icon(16, f"{OUTPUT_DIR}/favicon-16.png")
print("Generating OG image...")
og = Image.new("RGB", (1200, 630), PRIMARY)
d = ImageDraw.Draw(og)
d.rectangle([0, 0, 1200, 30], fill=ACCENT)
d.rectangle([0, 600, 1200, 630], fill=ACCENT)
f_big = find_font(80)
f_small = find_font(36)
title_en = "Pesticide Act, 2018"
subtitle = "Retailer's Integrated Field Guide"
d.text((80, 180), title_en, fill=CREAM, font=f_big)
d.text((80, 290), subtitle, fill=ACCENT, font=f_small)
d.text((80, 410), "36 Sections - 47 Slides - Offline AI - Bengali", fill=CREAM, font=f_small)
d.text((80, 470), "Bangladesh Government - 2026 Edition", fill=(200, 220, 210), font=f_small)
og.save(f"{OUTPUT_DIR}/og-image.png", "PNG", optimize=True)
print(f"  Wrote {OUTPUT_DIR}/og-image.png (1200x630)")
print("Done.")
