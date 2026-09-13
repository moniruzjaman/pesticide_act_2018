#!/usr/bin/env python3
"""Generate government-style PWA icons — seal + lotus + water waves."""
from PIL import Image, ImageDraw, ImageFont
import os
import math

OUTPUT_DIR = "/home/z/my-project/public"
PRIMARY = (30, 77, 59)         # #1E4D3B deep forest green
PRIMARY_DEEP = (20, 52, 42)    # #14342A
ACCENT = (199, 145, 44)        # #C7912C harvest gold
ACCENT_SOFT = (224, 182, 89)   # #E0B659
CREAM = (250, 246, 238)        # #FAF6EE
WHITE = (255, 255, 255)

def find_font(size, bold=True):
    candidates = [
        "/usr/share/fonts/truetype/noto-serif-sc/NotoSerifSC-Bold.otf",
        "/usr/share/fonts/truetype/chinese/NotoSansSC-Bold.otf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for c in candidates:
        if os.path.exists(c):
            try:
                return ImageFont.truetype(c, size)
            except Exception:
                pass
    return ImageFont.load_default()

def draw_lotus(d, cx, cy, size, color):
    """Draw stylized lotus with 5 petals."""
    petal_h = size
    petal_w = size * 0.45
    # Center petal (tallest)
    points = [
        (cx, cy - petal_h),
        (cx - petal_w * 0.3, cy - petal_h * 0.3),
        (cx, cy),
        (cx + petal_w * 0.3, cy - petal_h * 0.3),
    ]
    d.polygon(points, fill=color)
    # Side petals (4)
    for angle_deg in [-50, -25, 25, 50]:
        rad = math.radians(angle_deg - 90)
        tip_x = cx + math.cos(rad) * petal_h * 0.85
        tip_y = cy + math.sin(rad) * petal_h * 0.85
        base_x = cx + math.cos(rad) * petal_h * 0.2
        base_y = cy + math.sin(rad) * petal_h * 0.2
        # Approximate petal with ellipse
        d.ellipse([
            tip_x - petal_w * 0.35, tip_y - petal_h * 0.5,
            tip_x + petal_w * 0.35, tip_y + petal_h * 0.5
        ], fill=color)

def draw_waves(d, cx, cy, width, color, wave_height=8):
    """Draw 2 stylized water waves."""
    for offset_y in [0, wave_height * 1.6]:
        points = []
        for x in range(int(cx - width / 2), int(cx + width / 2) + 1, 2):
            t = (x - (cx - width / 2)) / width
            y = cy + offset_y + math.sin(t * math.pi * 2) * wave_height * 0.5
            points.append((x, y))
        if len(points) >= 2:
            d.line(points, fill=color, width=max(2, wave_height // 3))

def draw_govt_seal(size, out_path, with_text=True, bg="green"):
    """Draw a government-style seal icon.
    bg: "green" (filled green bg) or "transparent" (just the seal).
    """
    if bg == "green":
        img = Image.new("RGBA", (size, size), PRIMARY + (255,))
    else:
        img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    # If green background, add subtle border accent at top/bottom
    if bg == "green":
        strip_h = max(3, size // 30)
        d.rectangle([0, 0, size, strip_h], fill=ACCENT + (255,))
        d.rectangle([0, size - strip_h, size, size], fill=ACCENT + (255,))

    cx, cy = size / 2, size / 2

    # Outer seal ring
    ring_r_outer = size * 0.42
    ring_r_inner = size * 0.38
    seal_color = CREAM if bg == "green" else PRIMARY
    # Draw ring (annulus)
    d.ellipse([cx - ring_r_outer, cy - ring_r_outer, cx + ring_r_outer, cy + ring_r_outer],
              outline=seal_color, width=max(2, size // 60))
    # Inner thin ring
    d.ellipse([cx - ring_r_inner, cy - ring_r_inner, cx + ring_r_inner, cy + ring_r_inner],
              outline=seal_color, width=max(1, size // 120))

    # Lotus in center
    lotus_size = size * 0.18
    lotus_cy = cy - size * 0.05
    lotus_color = CREAM if bg == "green" else PRIMARY
    # Draw lotus using polygon (simplified, more reliable)
    # Center petal
    petal_h = lotus_size * 1.4
    petal_w = lotus_size * 0.4
    d.polygon([
        (cx, lotus_cy - petal_h),
        (cx - petal_w, lotus_cy),
        (cx + petal_w, lotus_cy),
    ], fill=lotus_color)
    # Side petals (4) — rotated ellipses approximation
    for angle_deg in [-45, -22, 22, 45]:
        rad = math.radians(angle_deg - 90)
        tip_x = cx + math.cos(rad) * petal_h * 0.85
        tip_y = lotus_cy + math.sin(rad) * petal_h * 0.85
        # Draw small ellipse as petal
        pw = petal_w * 0.6
        ph = petal_h * 0.5
        # Simple circle at tip
        d.ellipse([tip_x - pw, tip_y - pw, tip_x + pw, tip_y + pw], fill=lotus_color)

    # Water waves below lotus
    waves_y = lotus_cy + petal_h * 0.5
    waves_width = size * 0.45
    wave_color = ACCENT_SOFT if bg == "green" else ACCENT
    draw_waves(d, cx, waves_y, waves_width, wave_color, wave_height=size // 35)
    draw_waves(d, cx, waves_y + size * 0.08, waves_width, wave_color, wave_height=size // 40)

    if with_text and bg == "green":
        # "২০১৮" at top inside ring, "আইন" at bottom
        f_top = find_font(max(10, size // 12))
        text_top = "২০১৮" if size >= 100 else ""
        if text_top:
            bbox = d.textbbox((0, 0), text_top, font=f_top)
            tw = bbox[2] - bbox[0]
            d.text((cx - tw / 2, cy - ring_r_outer * 0.95), text_top, fill=CREAM, font=f_top)

    img.save(out_path, "PNG", optimize=True)
    print(f"  Wrote {out_path} ({size}x{size})")

print("Generating government-style PWA icons...")
draw_govt_seal(192, f"{OUTPUT_DIR}/icon-192.png", with_text=True, bg="green")
draw_govt_seal(512, f"{OUTPUT_DIR}/icon-512.png", with_text=True, bg="green")
draw_govt_seal(180, f"{OUTPUT_DIR}/apple-touch-icon.png", with_text=False, bg="green")
draw_govt_seal(32, f"{OUTPUT_DIR}/favicon-32.png", with_text=False, bg="green")
draw_govt_seal(16, f"{OUTPUT_DIR}/favicon-16.png", with_text=False, bg="green")

# Transparent (no bg) version for inline use
draw_govt_seal(512, f"{OUTPUT_DIR}/seal-transparent.png", with_text=False, bg="transparent")

print("\nGenerating updated OG image (1200x630)...")
og = Image.new("RGB", (1200, 630), PRIMARY)
d = ImageDraw.Draw(og)

# Top + bottom accent strips
d.rectangle([0, 0, 1200, 30], fill=ACCENT)
d.rectangle([0, 600, 1200, 630], fill=ACCENT)

# Left vertical accent
d.rectangle([0, 30, 8, 600], fill=ACCENT)

# Big seal in top-right corner
seal_img = Image.open(f"{OUTPUT_DIR}/seal-transparent.png").resize((220, 220), Image.LANCZOS)
og.paste(seal_img, (920, 60), seal_img)

# Title (English) — large
f_title = find_font(78)
f_sub = find_font(40, bold=False)
f_meta = find_font(28, bold=False)

d.text((80, 130), "Pesticide Act, 2018", fill=CREAM, font=f_title)
d.text((80, 230), "Bangladesh Government", fill=ACCENT_SOFT, font=f_sub)

# Bengali title (may not render with DejaVu, but try)
try:
    f_bn = find_font(60)
    d.text((80, 310), "বালাইনাশক আইন, ২০১৮", fill=CREAM, font=f_bn)
except Exception:
    pass

# Subtitle
d.text((80, 400), "Retailer's Integrated Field Guide", fill=CREAM, font=f_sub)

# Features line
d.text((80, 470), "36 Sections  ·  47 Slides  ·  Offline AI  ·  PWA  ·  Bengali", fill=ACCENT_SOFT, font=f_meta)

# Bottom line
d.text((80, 540), "Act No. 24 of 2018  ·  29 July 2018  ·  2026 Edition", fill=(200, 220, 210), font=f_meta)

og.save(f"{OUTPUT_DIR}/og-image.png", "PNG", optimize=True)
print(f"  Wrote {OUTPUT_DIR}/og-image.png (1200x630)")

print("\nDone.")
