# -*- coding: utf-8 -*-
"""Keys the green plate out of src/assets/logo.jpeg and re-inks the wordmark.

Two outputs, both transparent:
  devpay-logo.png        ink-green wordmark + gold V  — for the Ledger's paper ground
  devpay-mark-light.png  parchment wordmark + gold V  — for the Vault's dark ground
"""
import os
from PIL import Image, ImageFilter

SRC   = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'src', 'assets', 'logo.jpeg')
BOX   = (120, 285, 985, 675)      # the wordmark, cropped off the square plate
W, H  = 420, 189
N     = W * H
PLATE = (11.0, 38.0, 33.0)        # #0B2621 — what we are keying out
LO, HI = 58.0, 128.0              # luminance ramp across the antialiased edge
WARM  = 27                        # R-G above this is the gold V, below is the wordmark
SEED  = 0.93                      # only near-opaque pixels have trustworthy hue

GOLD  = (230, 190, 88)            # #E6BE58
INK   = (11, 38, 33)              # #0B2621
PARCH = (213, 196, 124)           # #D5C47C — the logo's own wordmark colour

crop = (Image.open(SRC).convert('RGB').crop(BOX)
        .filter(ImageFilter.MedianFilter(3))     # kill the jpeg speckle before keying
        .resize((W, H), Image.LANCZOS))

alpha, raw_gold = [], []
for r, g, b in crop.getdata():
    lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
    a = max(0.0, min(1.0, (lum - LO) / (HI - LO)))
    alpha.append(a)
    inv = 1.0 - a                                # unmix the plate before judging hue
    fr = (r - PLATE[0] * inv) / max(a, 1e-3)
    fg = (g - PLATE[1] * inv) / max(a, 1e-3)
    raw_gold.append(a > 0.0 and (fr - fg) >= WARM)

# Hue is only trustworthy where the mark is opaque. Seed from those pixels and let the two
# regions race outwards, so each antialiased pixel takes the colour of whichever solid
# region reaches it first and no edge scatters into the wrong colour.
seed_g = [alpha[i] >= SEED and raw_gold[i] for i in range(N)]
seed_i = [alpha[i] >= SEED and not raw_gold[i] for i in range(N)]
owner  = [True if seed_g[i] else (False if seed_i[i] else None) for i in range(N)]

def as_mask(bits):
    m = Image.new('L', (W, H)); m.putdata([255 if v else 0 for v in bits]); return m

gm, im_ = as_mask(seed_g), as_mask(seed_i)
for _ in range(12):
    gm, im_ = gm.filter(ImageFilter.MaxFilter(3)), im_.filter(ImageFilter.MaxFilter(3))
    gd, idd = list(gm.getdata()), list(im_.getdata())
    for i in range(N):
        if owner[i] is not None or alpha[i] <= 0.0:
            continue
        if gd[i] > 127:                          # ties go gold — the V is the top layer
            owner[i] = True
        elif idd[i] > 127:
            owner[i] = False

def render(wordmark, path):
    px = []
    for i in range(N):
        a = alpha[i]
        if a <= 0.0:
            px.append((0, 0, 0, 0)); continue
        gold = owner[i] if owner[i] is not None else raw_gold[i]
        px.append((GOLD if gold else wordmark) + (int(round(a * 255)),))
    img = Image.new('RGBA', (W, H)); img.putdata(px)
    img.save(path, optimize=True)
    return img

OUT = os.path.dirname(SRC)
paper_mark = render(INK, os.path.join(OUT, 'devpay-logo.png'))
ink_mark   = render(PARCH, os.path.join(OUT, 'devpay-mark-light.png'))

print('wrote', paper_mark.size, '->', OUT)
