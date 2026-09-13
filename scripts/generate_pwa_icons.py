#!/usr/bin/env python3
"""Generate Bangladesh government-style PWA icons — flag-inspired green + red."""
from PIL import Image, ImageDraw, ImageFont
import os
import math

OUTPUT_DIR = "/home/z/my-project/public"
# Bangladesh government official colors
BD_GREEN = (0, 106, 78)       # #006a4e — Bangladesh flag green
BD_RED = (244, 42, 65)        # #f42a41 — Bangladesh flag red
CREAM = (247, 253, 249)       # #f7fdf9 — soft background
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

def draw_bd_flag_seal(size, out_path, with_text=True, bg="green"):
    """Draw a Bangladesh flag-inspired government seal icon.
    bg: "green" (filled green bg) or "transparent".
    Design: green background, central red disc (flag), thin ring border, "2018" text.
    """
    if bg == "green":
        img = Image.new("RGBA", (size, size), BD_GREEN + (255,))
    else:
        img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    cx, cy = size / 2, size / 2

    # Subtle thin border ring (cream/white) — gives "seal" feel
    ring_r = size * 0.46
    ring_width = max(2, size // 50)
    border_color = CREAM if bg == "green" else BD_GREEN
    d.ellipse(
        [cx - ring_r, cy - ring_r, cx + ring_r, cy + ring_r],
        outline=border_color,
        width=ring_width,
    )

    # Inner thin ring (decorative)
    inner_r = size * 0.40
    d.ellipse(
        [cx - inner_r, cy - inner_r, cx + inner_r, cy + inner_r],
        outline=border_color,
        width=max(1, size // 100),
    )

    # Central red disc — Bangladesh flag's signature element
    # The flag's red disc is slightly offset toward the hoist side; here we keep it centered for icon balance
    disc_r = size * 0.22
    d.ellipse(
        [cx - disc_r, cy - disc_r, cx + disc_r, cy + disc_r],
        fill=BD_RED + (255,),
    )

    # 4 decorative dots at cardinal points (seal pattern)
    dot_r = max(2, size // 40)
    dot_offset = size * 0.43
    for dx, dy in [(0, -1), (0, 1), (-1, 0), (1, 0)]:
        dx_px = cx + dx * dot_offset
        dy_px = cy + dy * dot_offset
        d.ellipse(
            [dx_px - dot_r, dy_px - dot_r, dx_px + dot_r, dy_px + dot_r],
            fill=border_color,
        )

    if with_text and size >= 180:
        # "২০১৮" at top inside ring (Bengali numerals may not render — fallback to "2018")
        f = find_font(max(12, size // 14))
        # Try Bengali "২০১৮", fallback "2018"
        text = "2018"
        try:
            bbox = d.textbbox((0, 0), text, font=f)
            tw = bbox[2] - bbox[0]
            th = bbox[3] - bbox[1]
            d.text((cx - tw / 2, cy - ring_r * 0.95 - th / 2), text, fill=CREAM, font=f)
        except Exception:
            pass

        # "আইন" / "ACT" at bottom inside ring
        f2 = find_font(max(10, size // 16))
        text2 = "ACT 2018"
        try:
            bbox2 = d.textbbox((0, 0), text2, font=f2)
            tw2 = bbox2[2] - bbox2[0]
            d.text((cx - tw2 / 2, cy + ring_r * 0.75), text2, fill=CREAM, font=f2)
        except Exception:
            pass

    img.save(out_path, "PNG", optimize=True)
    print(f"  Wrote {out_path} ({size}x{size})")

print("Generating Bangladesh government-style PWA icons...")
draw_bd_flag_seal(192, f"{OUTPUT_DIR}/icon-192.png", with_text=True, bg="green")
draw_bd_flag_seal(512, f"{OUTPUT_DIR}/icon-512.png", with_text=True, bg="green")
draw_bd_flag_seal(180, f"{OUTPUT_DIR}/apple-touch-icon.png", with_text=False, bg="green")
draw_bd_flag_seal(32, f"{OUTPUT_DIR}/favicon-32.png", with_text=False, bg="green")
draw_bd_flag_seal(16, f"{OUTPUT_DIR}/favicon-16.png", with_text=False, bg="green")

# Transparent version
draw_bd_flag_seal(512, f"{OUTPUT_DIR}/seal-transparent.png", with_text=False, bg="transparent")

print("\nGenerating updated OG image (1200x630) — BD green + red theme...")
og = Image.new("RGB", (1200, 630), BD_GREEN)
d = ImageDraw.Draw(og)

# Left red accent column (flag-inspired)
d.rectangle([0, 0, 12, 630], fill=BD_RED)

# Top + bottom thin cream strips
d.rectangle([12, 0, 1200, 8], fill=CREAM)
d.rectangle([12, 622, 1200, 630], fill=CREAM)

# Big seal in top-right corner
seal_img = Image.open(f"{OUTPUT_DIR}/seal-transparent.png").resize((240, 240), Image.LANCZOS)
og.paste(seal_img, (920, 50), seal_img)

# Red disc decoration in bottom-left
d.ellipse([80, 470, 80 + 90, 470 + 90], fill=BD_RED)

# Title (English) — large
f_title = find_font(78)
f_sub = find_font(40, bold=False)
f_meta = find_font(28, bold=False)

d.text((100, 110), "Pesticide Act, 2018", fill=CREAM, font=f_title)
d.text((100, 210), "Government of Bangladesh", fill=BD_RED, font=f_sub)

# Bengali title
try:
    f_bn = find_font(58)
    d.text((100, 290), "বালাইনাশক আইন, ২০১৮", fill=CREAM, font=f_bn)
except Exception:
    pass

# Subtitle
d.text((100, 380), "Retailer's Integrated Field Guide", fill=CREAM, font=f_sub)

# Features line
d.text((100, 450), "36 Sections  ·  47 Slides  ·  Offline AI  ·  PWA  ·  Bengali", fill=CREAM, font=f_meta)

# Bottom line
d.text((200, 510), "Act No. 24 of 2018  ·  29 July 2018  ·  2026 Edition", fill=(220, 240, 230), font=f_meta)

og.save(f"{OUTPUT_DIR}/og-image.png", "PNG", optimize=True)
print(f"  Wrote {OUTPUT_DIR}/og-image.png (1200x630)")

print("\nDone.")
