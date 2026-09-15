#!/usr/bin/env python3
"""Generate BD government PWA icons + OG image with Bengali font support."""
from PIL import Image, ImageDraw, ImageFont
import os

OUTPUT_DIR = "/home/z/my-project/public"
BD_GREEN = (0, 106, 78)
BD_GREEN_DEEP = (0, 77, 56)
BD_RED = (244, 42, 65)
CREAM = (247, 253, 249)
WHITE = (255, 255, 255)

FONT_BN_BOLD = "/tmp/NotoSerifBengali-Bold.ttf"
FONT_BN_REG = "/tmp/NotoSansBengali-Regular.ttf"
FONT_EN_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

def font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

def draw_launcher_icon(size, out_path, with_text=True):
    """BD government launcher icon — green bg + red disc + cream ring."""
    img = Image.new("RGBA", (size, size), BD_GREEN + (255,))
    d = ImageDraw.Draw(img)
    cx, cy = size / 2, size / 2

    # Outer cream ring (border)
    ring_r = size * 0.46
    ring_w = max(2, size // 50)
    d.ellipse([cx - ring_r, cy - ring_r, cx + ring_r, cy + ring_r],
              outline=CREAM, width=ring_w)

    # Inner thin ring
    inner_r = size * 0.40
    d.ellipse([cx - inner_r, cy - inner_r, cx + inner_r, cy + inner_r],
              outline=CREAM, width=max(1, size // 100))

    # Central red disc (Bangladesh flag)
    disc_r = size * 0.22
    d.ellipse([cx - disc_r, cy - disc_r, cx + disc_r, cy + disc_r],
              fill=BD_RED + (255,))

    # 4 decorative dots (seal pattern)
    dot_r = max(2, size // 40)
    for dx, dy in [(0, -1), (0, 1), (-1, 0), (1, 0)]:
        px = cx + dx * size * 0.43
        py = cy + dy * size * 0.43
        d.ellipse([px - dot_r, py - dot_r, px + dot_r, py + dot_r], fill=CREAM)

    if with_text and size >= 180:
        # "২০১৮" Bengali at top
        try:
            f = font(FONT_BN_BOLD, max(12, size // 14))
            text = "২০১৮"
            bbox = d.textbbox((0, 0), text, font=f)
            tw = bbox[2] - bbox[0]
            th = bbox[3] - bbox[1]
            d.text((cx - tw / 2, cy - ring_r * 0.95 - th / 2 - 2), text, fill=CREAM, font=f)
        except Exception as e:
            print(f"  Bengali text failed: {e}")

        # "ACT" at bottom
        try:
            f2 = font(FONT_EN_BOLD, max(8, size // 18))
            text2 = "ACT"
            bbox2 = d.textbbox((0, 0), text2, font=f2)
            tw2 = bbox2[2] - bbox2[0]
            d.text((cx - tw2 / 2, cy + ring_r * 0.72), text2, fill=CREAM, font=f2)
        except Exception:
            pass

    img.save(out_path, "PNG", optimize=True)
    print(f"  Wrote {out_path} ({size}x{size}, {os.path.getsize(out_path)//1024} KB)")

print("Generating BD government launcher icons (with Bengali text)...")
draw_launcher_icon(192, f"{OUTPUT_DIR}/icon-192.png", with_text=True)
draw_launcher_icon(512, f"{OUTPUT_DIR}/icon-512.png", with_text=True)
draw_launcher_icon(180, f"{OUTPUT_DIR}/apple-touch-icon.png", with_text=False)
draw_launcher_icon(32, f"{OUTPUT_DIR}/favicon-32.png", with_text=False)
draw_launcher_icon(16, f"{OUTPUT_DIR}/favicon-16.png", with_text=False)

# Transparent seal
img_t = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
d_t = ImageDraw.Draw(img_t)
cx, cy = 256, 256
d_t.ellipse([cx - 235, cy - 235, cx + 235, cy + 235], outline=BD_GREEN, width=10)
d_t.ellipse([cx - 205, cy - 205, cx + 205, cy + 205], outline=BD_GREEN, width=2)
d_t.ellipse([cx - 112, cy - 112, cx + 112, cy + 112], fill=BD_RED)
for dx, dy in [(0, -1), (0, 1), (-1, 0), (1, 0)]:
    px = cx + dx * 220
    py = cy + dy * 220
    d_t.ellipse([px - 12, py - 12, px + 12, py + 12], fill=BD_GREEN)
img_t.save(f"{OUTPUT_DIR}/seal-transparent.png", "PNG", optimize=True)
print(f"  Wrote seal-transparent.png (512x512)")

# === OG Image 1200x630 (Facebook/WhatsApp/Twitter recommended) ===
print("\nGenerating OG image 1200x630 (with Bengali text)...")
og = Image.new("RGB", (1200, 630), BD_GREEN)
d = ImageDraw.Draw(og)

# Left red accent column (flag-inspired)
d.rectangle([0, 0, 14, 630], fill=BD_RED)

# Top + bottom thin cream strips
d.rectangle([14, 0, 1200, 6], fill=CREAM)
d.rectangle([14, 624, 1200, 630], fill=CREAM)

# Big transparent seal in top-right corner
seal_img = Image.open(f"{OUTPUT_DIR}/seal-transparent.png").resize((220, 220), Image.LANCZOS)
og.paste(seal_img, (940, 50), seal_img)

# Red disc decoration in bottom-left
d.ellipse([80, 480, 80 + 80, 480 + 80], fill=BD_RED)

# === Text (Bengali + English) ===
f_title_en = font(FONT_EN_BOLD, 72)
f_sub_en = font(FONT_EN_BOLD, 38)
f_title_bn = font(FONT_BN_BOLD, 60)
f_sub_bn = font(FONT_BN_REG, 32)
f_meta = font(FONT_EN_BOLD, 26)

# English title
d.text((100, 100), "Pesticide Act, 2018", fill=CREAM, font=f_title_en)
# English subtitle (red — BD government)
d.text((100, 190), "Government of Bangladesh", fill=BD_RED, font=f_sub_en)

# Bengali title
d.text((100, 270), "বালাইনাশক আইন, ২০১৮", fill=CREAM, font=f_title_bn)

# Bengali subtitle
d.text((100, 355), "খুচরা বিক্রেতার সমন্বিত ফিল্ড গাইড", fill=CREAM, font=f_sub_bn)

# Features line (Bengali + English mix)
d.text((100, 425), "৩৬ ধারা  ·  ৪৭ স্লাইড  ·  অফলাইন AI  ·  PWA  ·  বাংলা", fill=CREAM, font=f_sub_bn)

# Bottom — act number + edition
d.text((100, 545), "Act No. 24 of 2018  ·  29 July 2018  ·  2026 Edition", fill=(220, 240, 230), font=f_meta)

og.save(f"{OUTPUT_DIR}/og-image.png", "PNG", optimize=True)
print(f"  Wrote og-image.png (1200x630, {os.path.getsize(f'{OUTPUT_DIR}/og-image.png')//1024} KB)")

# === Smaller OG image for WhatsApp (600x315 — faster load on mobile) ===
print("\nGenerating OG image 600x315 (mobile-optimized)...")
og_small = og.resize((600, 315), Image.LANCZOS)
og_small.save(f"{OUTPUT_DIR}/og-image-small.png", "PNG", optimize=True)
print(f"  Wrote og-image-small.png (600x315, {os.path.getsize(f'{OUTPUT_DIR}/og-image-small.png')//1024} KB)")

print("\nDone.")
