#!/usr/bin/env python3
"""Generate PWA icons + OG image based on the new Pesticide Act 2018 logo design."""
from PIL import Image, ImageDraw, ImageFont
import os

OUTPUT_DIR = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public"))
# Brand colors (must match public/logo.svg and the --bd-red / --bd-green CSS vars)
RED = (244, 42, 65)          # #f42a41
GREEN = (0, 106, 78)         # #006a4e
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
DARK_GREEN = (0, 77, 56)     # #004d38

FONT_PATH = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_REGULAR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

def font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

def draw_curved_text(base_img, text, cx, cy, radius, f, fill, start_deg=130, end_deg=50):
    """Draw text following the bottom of a circle (PIL has no native textPath).
    Angles use PIL's convention: 0=3 o'clock, increasing clockwise. start_deg
    should be the left end of the arc, end_deg the right end, both < 180 apart."""
    import math
    dummy = ImageDraw.Draw(Image.new("RGBA", (1, 1)))
    widths = [dummy.textlength(ch, font=f) for ch in text]
    total_w = sum(widths)
    if total_w <= 0:
        return
    span_deg = start_deg - end_deg  # positive: sweeping from left, through bottom, to right
    pos = 0.0
    for ch, w in zip(text, widths):
        mid = pos + w / 2
        theta_deg = start_deg - span_deg * (mid / total_w)
        theta = math.radians(theta_deg)
        px = cx + radius * math.cos(theta)
        py = cy + radius * math.sin(theta)
        glyph = Image.new("RGBA", (max(1, int(w) + 6), int(f.size * 1.6)), (0, 0, 0, 0))
        gd = ImageDraw.Draw(glyph)
        gd.text((3, 0), ch, font=f, fill=fill)
        # Rotate so each glyph's "up" points away from the circle's center
        # (i.e. baseline follows the tangent of the arc at this point).
        glyph = glyph.rotate(-(theta_deg - 90), expand=True, resample=Image.BICUBIC)
        base_img.paste(glyph, (int(px - glyph.width / 2), int(py - glyph.height / 2)), glyph)
        pos += w


def draw_logo_icon(size, out_path, detailed=True):
    """Draw the Pesticide Act 2018 logo — a red/green ring badge with a gap at the
    bottom where a red text band sits, matching public/logo.svg."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    cx, cy = size / 2, size / 2

    # Scale factors from the 256px base the SVG is authored at
    scale = size / 256

    # Base disc: red. This single fill IS the outer rim, the bottom band, and the
    # central disc all at once — the green ring below is only drawn on top for the
    # top ~280 degrees, leaving a gap at the bottom where this red shows through.
    rim_r = 122 * scale
    d.ellipse([cx - rim_r, cy - rim_r, cx + rim_r, cy + rim_r], fill=RED)
    d.ellipse([cx - rim_r, cy - rim_r, cx + rim_r, cy + rim_r],
              outline=WHITE, width=max(1, int(2 * scale)))

    # Green "C" ring, open across the bottom (40deg -> 140deg gap), white-edged.
    ring_r = 100 * scale
    ring_bbox = [cx - ring_r, cy - ring_r, cx + ring_r, cy + ring_r]
    ring_w = 28 * scale
    d.arc(ring_bbox, 140, 400, fill=WHITE, width=max(1, int(ring_w + 4 * scale)))
    d.arc(ring_bbox, 140, 400, fill=GREEN, width=max(1, int(ring_w)))

    # Subtle decorative highlight arc inside the green band
    if size >= 64:
        hl_r = 88 * scale
        d.arc([cx - hl_r, cy - hl_r, cx + hl_r, cy + hl_r], 160, 380,
              fill=WHITE, width=max(1, int(2 * scale)))

    if detailed and size >= 180:
        # Curved "Pesticide Act 2018" following the bottom red band
        text_size = max(8, int(15 * scale))
        f = font(FONT_PATH, text_size)
        draw_curved_text(img, "Pesticide Act 2018", cx, cy, 96 * scale, f, WHITE,
                          start_deg=131, end_deg=49)

        # The bottle and scale icons below use the exact same local coordinates
        # as the <g transform="translate(...)"> groups in public/logo.svg, just
        # re-based onto (cx, cy) and multiplied by `scale`, so both assets stay
        # in sync if the design is tweaked again later.
        def L(base_dx, base_dy, lx, ly):
            return (cx + (base_dx + lx) * scale, cy + (base_dy + ly) * scale)

        # --- Left icon: spray bottle with skull & crossbones ---
        BX, BY = -58, -20  # bottle group offset (matches translate(70,108) in the SVG)
        d.line([L(BX, BY, 14, -32), L(BX, BY, 26, -42)], fill=WHITE, width=max(1, int(3 * scale)))
        for dx, dy, r in [(34, -46, 2.4), (41, -50, 2), (30, -52, 1.7)]:
            p = L(BX, BY, dx, dy)
            rr = max(1, r * scale)
            d.ellipse([p[0] - rr, p[1] - rr, p[0] + rr, p[1] + rr], fill=WHITE)
        x0, y0 = L(BX, BY, -14, -18)
        x1, y1 = L(BX, BY, 14, 28)
        d.rounded_rectangle([x0, y0, x1, y1], radius=max(1, int(6 * scale)), fill=WHITE)
        skx, sky = L(BX, BY, 0, -1)
        skr = max(2, 8 * scale)
        d.ellipse([skx - skr, sky - skr, skx + skr, sky + skr], fill=GREEN)
        for ex in (-3.2, 3.2):
            p = L(BX, BY, ex, -2)
            er = max(1, 1.7 * scale)
            d.ellipse([p[0] - er, p[1] - er, p[0] + er, p[1] + er], fill=WHITE)
        d.line([L(BX, BY, -11, 12), L(BX, BY, 11, 22)], fill=WHITE, width=max(1, int(2.6 * scale)))
        d.line([L(BX, BY, 11, 12), L(BX, BY, -11, 22)], fill=WHITE, width=max(1, int(2.6 * scale)))

        # --- Right icon: scales of justice on an open book ---
        SX, SY = 60, -8  # scale group offset (matches translate(188,120) in the SVG)
        d.line([L(SX, SY, 0, -34), L(SX, SY, 0, 12)], fill=WHITE, width=max(1, int(3 * scale)))
        d.line([L(SX, SY, -26, -30), L(SX, SY, 26, -30)], fill=WHITE, width=max(1, int(3 * scale)))
        d.line([L(SX, SY, -26, -30), L(SX, SY, -26, -16)], fill=WHITE, width=max(1, int(2 * scale)))
        d.line([L(SX, SY, 26, -30), L(SX, SY, 26, -16)], fill=WHITE, width=max(1, int(2 * scale)))
        pan_r = max(1, 8 * scale)
        for pan_dx in (-26, 26):
            p = L(SX, SY, pan_dx, -16)
            d.pieslice([p[0] - pan_r, p[1] - pan_r * 0.9, p[0] + pan_r, p[1] + pan_r * 0.9],
                       0, 180, fill=WHITE)
        d.polygon([L(SX, SY, 0, -6), L(SX, SY, -5, 4), L(SX, SY, 5, 4)], fill=WHITE)
        # Open book: two shallow curves sampled as polygons
        import math as _m
        def quad(p0, p1, p2, n=10):
            return [(
                (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t ** 2 * p2[0],
                (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t ** 2 * p2[1],
            ) for t in [i / n for i in range(n + 1)]]
        top = quad(L(SX, SY, -30, 12), L(SX, SY, -15, 4), L(SX, SY, 0, 12)) + \
              quad(L(SX, SY, 0, 12), L(SX, SY, 15, 4), L(SX, SY, 30, 12))
        bot = quad(L(SX, SY, 30, 20), L(SX, SY, 15, 13), L(SX, SY, 0, 20)) + \
              quad(L(SX, SY, 0, 20), L(SX, SY, -15, 13), L(SX, SY, -30, 20))
        d.polygon(top + bot, fill=WHITE)
    
    img.save(out_path, "PNG", optimize=True)
    print(f"  Wrote {out_path} ({size}x{size}, {os.path.getsize(out_path)//1024} KB)")

# === Generate all icon sizes ===
print("Generating Pesticide Act 2018 logo icons...")

# Favicon sizes (simplified, no text/icons) — filenames must match src/app/layout.tsx
for size in [16, 32]:
    draw_logo_icon(size, f"{OUTPUT_DIR}/favicon-{size}.png", detailed=False)

# PWA launcher icons
draw_logo_icon(180, f"{OUTPUT_DIR}/apple-touch-icon.png", detailed=True)
draw_logo_icon(192, f"{OUTPUT_DIR}/icon-192.png", detailed=True)
draw_logo_icon(512, f"{OUTPUT_DIR}/icon-512.png", detailed=True)

# === Generate OG Image 1200x630 ===
print("\nGenerating OG image 1200x630...")
og = Image.new("RGBA", (1200, 630), (0, 0, 0, 0))
d = ImageDraw.Draw(og)

# Background - dark green
d.rectangle([0, 0, 1200, 630], fill=DARK_GREEN)

# Draw large logo in center-left area
cx, cy = 350, 315
scale = 350 / 128  # scale for 350px radius

# Outer red ring
outer_r = 120 * scale
d.ellipse([cx - outer_r, cy - outer_r, cx + outer_r, cy + outer_r], outline=RED, width=int(15 * scale))

# Inner green ring
inner_r = 90 * scale
d.ellipse([cx - inner_r, cy - inner_r, cx + inner_r, cy + inner_r], outline=GREEN, width=int(15 * scale))

# Central red circle
center_r = 60 * scale
d.ellipse([cx - center_r, cy - center_r, cx + center_r, cy + center_r], fill=RED)

# Text "Pesticide Act 2018" below logo
f_title = font(FONT_PATH, 48)
text = "Pesticide Act 2018"
bbox = d.textbbox((0, 0), text, font=f_title)
tw = bbox[2] - bbox[0]
d.text((cx - tw / 2, cy + outer_r + 30), text, fill=WHITE, font=f_title)

# Bengali text
f_bn = font(FONT_PATH, 42)
bn_text = "বালাইনাশক আইন, ২০১৮"
bbox = d.textbbox((0, 0), bn_text, font=f_bn)
tw = bbox[2] - bbox[0]
d.text((cx - tw / 2, cy + outer_r + 100), bn_text, fill=WHITE, font=f_bn)

# Right side - info
f_sub = font(FONT_PATH, 32)
f_small = font(FONT_REGULAR, 24)

info_x = 750
d.text((info_x, 150), "Government of Bangladesh", fill=RED, font=f_sub)
d.text((info_x, 210), "Pesticide Regulation Authority", fill=WHITE, font=f_small)
d.text((info_x, 260), "Act No. 24 of 2018", fill=WHITE, font=f_small)
d.text((info_x, 300), "29 July 2018", fill=WHITE, font=f_small)
d.text((info_x, 350), "36 Sections  ·  47 Slides", fill=WHITE, font=f_small)
d.text((info_x, 390), "Offline AI  ·  PWA  ·  বাংলা", fill=WHITE, font=f_small)

# Decorative red accent
d.ellipse([1000, 480, 1120, 600], fill=RED)

og_rgb = Image.new("RGB", (1200, 630), DARK_GREEN)
og_rgb.paste(og, mask=og.split()[3])
og_rgb.save(f"{OUTPUT_DIR}/og-image.png", "PNG", optimize=True)
print(f"  Wrote og-image.png (1200x630, {os.path.getsize(f'{OUTPUT_DIR}/og-image.png')//1024} KB)")

# === Generate OG Image 600x315 (mobile) ===
print("\nGenerating OG image 600x315...")
og_small = og.resize((600, 315), Image.LANCZOS)
og_small_rgb = Image.new("RGB", (600, 315), DARK_GREEN)
og_small_rgb.paste(og_small, mask=og_small.split()[3])
og_small_rgb.save(f"{OUTPUT_DIR}/og-image-small.png", "PNG", optimize=True)
print(f"  Wrote og-image-small.png (600x315, {os.path.getsize(f'{OUTPUT_DIR}/og-image-small.png')//1024} KB)")

# === Generate seal-transparent.png (simplified version of logo) ===
print("\nGenerating seal-transparent.png...")
img_t = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
d_t = ImageDraw.Draw(img_t)
cx, cy = 256, 256

# Outer red ring
d_t.ellipse([cx - 235, cy - 235, cx + 235, cy + 235], outline=RED, width=10)

# Inner green ring
d_t.ellipse([cx - 205, cy - 205, cx + 205, cy + 205], outline=GREEN, width=2)

# Central red circle
d_t.ellipse([cx - 112, cy - 112, cx + 112, cy + 112], fill=RED)

# Four decorative dots
for dx, dy in [(0, -1), (0, 1), (-1, 0), (1, 0)]:
    px = cx + dx * 220
    py = cy + dy * 220
    d_t.ellipse([px - 12, py - 12, px + 12, py + 12], fill=GREEN)

img_t.save(f"{OUTPUT_DIR}/seal-transparent.png", "PNG", optimize=True)
print(f"  Wrote seal-transparent.png (512x512)")

print("\nDone.")