#!/usr/bin/env python3
"""Generate PWA icons + OG image based on the new Pesticide Act 2018 logo design."""
from PIL import Image, ImageDraw, ImageFont
import os

OUTPUT_DIR = "/workspace/4d4d6a95-d659-49d3-a74a-2cc6d4bbbe57/sessions/agent_23c6027a-abca-45d8-bce5-7a56fcec2868/public"
RED = (255, 0, 0)
GREEN = (0, 128, 0)
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
DARK_GREEN = (0, 100, 0)

FONT_PATH = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_REGULAR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

def font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

def draw_logo_icon(size, out_path, detailed=True):
    """Draw the new Pesticide Act 2018 logo at given size."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    cx, cy = size / 2, size / 2
    
    # Scale factors from 256 base
    scale = size / 256
    
    # Outer red ring
    outer_r = 120 * scale
    ring_width = max(1, int(10 * scale))
    d.ellipse([cx - outer_r, cy - outer_r, cx + outer_r, cy + outer_r], 
              outline=RED, width=ring_width)
    
    # Inner green ring
    inner_r = 90 * scale
    d.ellipse([cx - inner_r, cy - inner_r, cx + inner_r, cy + inner_r],
              outline=GREEN, width=ring_width)
    
    # Central red circle
    center_r = 60 * scale
    d.ellipse([cx - center_r, cy - center_r, cx + center_r, cy + center_r],
              fill=RED)
    
    if detailed and size >= 180:
        # Text: "Pesticide Act 2018"
        text_size = max(10, int(20 * scale))
        f = font(FONT_PATH, text_size)
        text = "Pesticide Act 2018"
        bbox = d.textbbox((0, 0), text, font=f)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        text_y = cy + 92 * scale
        d.text((cx - tw / 2, text_y - th / 2), text, fill=WHITE, font=f)
        
        # Left spray bottle icon
        bottle_x = int((60 + 12.5) * scale)
        bottle_y = int(125 * scale)
        bottle_w = max(2, int(25 * scale))
        bottle_h = max(4, int(50 * scale))
        
        # Bottle body
        d.rounded_rectangle(
            [bottle_x - bottle_w/2, bottle_y - bottle_h/2, 
             bottle_x + bottle_w/2, bottle_y + bottle_h/2],
            radius=max(1, int(5 * scale)),
            fill=WHITE
        )
        
        # Skull
        skull_size = max(6, int(14 * scale))
        d.text((bottle_x, bottle_y - int(10 * scale)), "☠", fill=BLACK, font=font(FONT_PATH, skull_size), anchor="mm")
        
        # Spray nozzle
        nozzle_x = bottle_x + int(25 * scale)
        nozzle_y = bottle_y - int(25 * scale)
        d.line([nozzle_x, nozzle_y, nozzle_x + int(10 * scale), nozzle_y - int(10 * scale)], 
               fill=WHITE, width=max(1, int(3 * scale)))
        # Spray dots
        for i in range(3):
            dot_x = nozzle_x + int((12 + i*4) * scale)
            dot_y = nozzle_y - int((12 + i*3) * scale)
            d.ellipse([dot_x - max(1, int(2*scale)), dot_y - max(1, int(2*scale)),
                       dot_x + max(1, int(2*scale)), dot_y + max(1, int(2*scale))], 
                      fill=WHITE)
        
        # Right scales of justice on book
        book_x = int(190 * scale)
        book_y = int(150 * scale)
        book_w = int(40 * scale)
        book_h = int(10 * scale)
        
        # Book base
        d.rectangle([book_x - book_w/2, book_y, book_x + book_w/2, book_y + book_h], fill=WHITE)
        
        # Scales post
        post_x = book_x
        post_top = book_y - int(50 * scale)
        d.line([post_x, post_top, post_x, book_y], fill=WHITE, width=max(1, int(3 * scale)))
        
        # Scales beam
        beam_left = post_x - int(20 * scale)
        beam_right = post_x + int(20 * scale)
        d.line([beam_left, post_top, beam_right, post_top], fill=WHITE, width=max(1, int(3 * scale)))
        
        # Left pan
        pan_r = int(10 * scale)
        d.ellipse([post_x - int(15 * scale) - pan_r, post_top + int(15 * scale) - pan_r,
                   post_x - int(15 * scale) + pan_r, post_top + int(15 * scale) + pan_r],
                  outline=WHITE, width=max(1, int(2 * scale)))
        
        # Right pan
        d.ellipse([post_x + int(15 * scale) - pan_r, post_top + int(15 * scale) - pan_r,
                   post_x + int(15 * scale) + pan_r, post_top + int(15 * scale) + pan_r],
                  outline=WHITE, width=max(1, int(2 * scale)))
    
    img.save(out_path, "PNG", optimize=True)
    print(f"  Wrote {out_path} ({size}x{size}, {os.path.getsize(out_path)//1024} KB)")

# === Generate all icon sizes ===
print("Generating Pesticide Act 2018 logo icons...")

# Favicon sizes (simplified, no text/icons)
for size in [16, 32, 48, 64]:
    draw_logo_icon(size, f"{OUTPUT_DIR}/favicon-{size}x{size}.png", detailed=False)

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
d.ellipse([cx - outer_r, cy - outer_r, cx + outer_r, cx + outer_r], outline=RED, width=int(15 * scale))

# Inner green ring
inner_r = 90 * scale
d.ellipse([cx - inner_r, cy - inner_r, cx + inner_r, cx + inner_r], outline=GREEN, width=int(15 * scale))

# Central red circle
center_r = 60 * scale
d.ellipse([cx - center_r, cy - center_r, cx + center_r, cx + center_r], fill=RED)

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
d_t.ellipse([cx - 235, cy - 235, cx + 235, cx + 235], outline=RED, width=10)

# Inner green ring
d_t.ellipse([cx - 205, cy - 205, cx + 205, cx + 205], outline=GREEN, width=2)

# Central red circle
d_t.ellipse([cx - 112, cy - 112, cx + 112, cx + 112], fill=RED)

# Four decorative dots
for dx, dy in [(0, -1), (0, 1), (-1, 0), (1, 0)]:
    px = cx + dx * 220
    py = cy + dy * 220
    d_t.ellipse([px - 12, py - 12, px + 12, py + 12], fill=GREEN)

img_t.save(f"{OUTPUT_DIR}/seal-transparent.png", "PNG", optimize=True)
print(f"  Wrote seal-transparent.png (512x512)")

print("\nDone.")