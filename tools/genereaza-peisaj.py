#!/usr/bin/env python3
"""
tools/genereaza-peisaj.py – draws assets/img/peisaj.svg, the landscape at the top of the home page.

A landscape like in Bucovina: mountains in the distance (a little snow on the highest peaks),
a ridge covered with fir forest, rolling hills with strips of fields, haystacks, a small forest,
a few houses and a wooden church far away, a country road with fences coming down to the
entrance sign of the village.

The picture is 1600 x 420; the page shows it with "slice", so on phones only the middle is seen
(the road, the houses and a few haystacks are in the middle on purpose).
The bottom edge has exactly the color of the field of the page (#bfe29a), so the two join.
Nothing moves in it (a moving SVG background would keep the processor busy).
The random numbers use a fixed seed: running the script again gives exactly the same picture.

Run from the root of the repository:   python3 tools/genereaza-peisaj.py
"""
import math
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "img" / "peisaj.svg"
W, H = 1600, 420
FIELD = "#bfe29a"          # the field of the page (assets/css/village.css, --field)

rnd = random.Random(7)
parts = []


def f(v):
    return f"{v:.1f}".rstrip("0").rstrip(".")


def fir(x, base, h, dark="#3f7440", light="#4f8a4a"):
    """A fir tree: three stacked triangles (the top one lighter)."""
    w = h * 0.5
    return (f'<path d="M{f(x - w / 2)} {f(base)} L{f(x)} {f(base - h * 0.62)} L{f(x + w / 2)} {f(base)} Z" fill="{dark}"/>'
            f'<path d="M{f(x - w * 0.38)} {f(base - h * 0.32)} L{f(x)} {f(base - h * 0.86)} L{f(x + w * 0.38)} {f(base - h * 0.32)} Z" fill="{dark}"/>'
            f'<path d="M{f(x - w * 0.26)} {f(base - h * 0.58)} L{f(x)} {f(base - h)} L{f(x + w * 0.26)} {f(base - h * 0.58)} Z" fill="{light}"/>')


def haystack(x, base, h):
    """A haystack (căpiță): a rounded cone, two darker rings and the pole sticking out at the top."""
    w = h * 0.78
    return (f'<path d="M{f(x)} {f(base - h - h * 0.16)} V{f(base - h + 3)}" stroke="#7a4a22" stroke-width="{f(max(1.2, h * 0.05))}" stroke-linecap="round"/>'
            f'<path d="M{f(x - w / 2)} {f(base)} Q{f(x - w * 0.52)} {f(base - h * 0.62)} {f(x)} {f(base - h)} '
            f'Q{f(x + w * 0.52)} {f(base - h * 0.62)} {f(x + w / 2)} {f(base)} Z" fill="#d9b25a"/>'
            f'<path d="M{f(x)} {f(base - h)} Q{f(x + w * 0.52)} {f(base - h * 0.62)} {f(x + w / 2)} {f(base)} L{f(x + w * 0.12)} {f(base)} '
            f'Q{f(x + w * 0.22)} {f(base - h * 0.6)} {f(x)} {f(base - h)} Z" fill="#c29a45"/>'
            f'<path d="M{f(x - w * 0.36)} {f(base - h * 0.32)} Q{f(x)} {f(base - h * 0.4)} {f(x + w * 0.36)} {f(base - h * 0.32)}" '
            f'stroke="#a8813a" stroke-width="{f(max(1, h * 0.04))}" fill="none"/>'
            f'<ellipse cx="{f(x)}" cy="{f(base)}" rx="{f(w * 0.55)}" ry="{f(max(1.5, h * 0.06))}" fill="rgba(60,80,30,.25)"/>')


def house(x, base, s):
    """A small far-away house: white walls, a tall dark roof (as in the villages of Bucovina)."""
    w, h = 26 * s, 14 * s
    return (f'<rect x="{f(x - w / 2)}" y="{f(base - h)}" width="{f(w)}" height="{f(h)}" fill="#f7f3ea"/>'
            f'<path d="M{f(x - w / 2 - 3 * s)} {f(base - h + 1)} L{f(x - w * 0.28)} {f(base - h - 13 * s)} '
            f'L{f(x + w * 0.28)} {f(base - h - 13 * s)} L{f(x + w / 2 + 3 * s)} {f(base - h + 1)} Z" fill="#6b4a3a"/>'
            f'<rect x="{f(x - w * 0.3)}" y="{f(base - h * 0.7)}" width="{f(4 * s)}" height="{f(4 * s)}" fill="#7fb2d6"/>'
            f'<rect x="{f(x + w * 0.12)}" y="{f(base - h * 0.7)}" width="{f(4 * s)}" height="{f(4 * s)}" fill="#7fb2d6"/>')


def church(x, base, s):
    """A small wooden church: a long body with a tall roof and a slim tower with a cross."""
    return (f'<rect x="{f(x - 22 * s)}" y="{f(base - 14 * s)}" width="{f(40 * s)}" height="{f(14 * s)}" fill="#8a5a34"/>'
            f'<path d="M{f(x - 26 * s)} {f(base - 13 * s)} L{f(x - 12 * s)} {f(base - 30 * s)} L{f(x + 14 * s)} {f(base - 30 * s)} '
            f'L{f(x + 22 * s)} {f(base - 13 * s)} Z" fill="#5b3b22"/>'
            f'<rect x="{f(x - 5 * s)}" y="{f(base - 44 * s)}" width="{f(10 * s)}" height="{f(16 * s)}" fill="#8a5a34"/>'
            f'<path d="M{f(x - 7 * s)} {f(base - 43 * s)} L{f(x)} {f(base - 62 * s)} L{f(x + 7 * s)} {f(base - 43 * s)} Z" fill="#5b3b22"/>'
            f'<path d="M{f(x)} {f(base - 62 * s)} V{f(base - 72 * s)} M{f(x - 3.5 * s)} {f(base - 68 * s)} H{f(x + 3.5 * s)}" '
            f'stroke="#e9c46a" stroke-width="{f(1.6 * s)}" stroke-linecap="round"/>')


# ---------- 1. mountains in the distance ----------
parts.append('<path d="M0 232 L120 176 L210 204 L330 124 L430 178 L520 146 L640 204 L760 112 L880 172 L980 134 '
             'L1100 192 L1220 108 L1340 168 L1450 138 L1600 188 V280 H0 Z" fill="#bccde0"/>')
for px, py in [(330, 124), (760, 112), (1220, 108)]:
    parts.append(f'<path d="M{px} {py} L{px + 26} {py + 22} L{px + 12} {py + 18} L{px + 2} {py + 27} L{px - 9} {py + 17} '
                 f'L{px - 24} {py + 21} Z" fill="#fbfdff"/>')
parts.append('<path d="M0 252 L150 208 L300 232 L460 194 L600 236 L740 202 L900 242 L1050 208 L1200 240 L1380 204 '
             'L1600 232 V290 H0 Z" fill="#a3bad0"/>')

# ---------- 2. the ridge covered with fir forest ----------
ridge = "M0 268 C200 238 380 246 560 258 C760 272 960 236 1160 246 C1340 256 1480 242 1600 250 V320 H0 Z"
parts.append(f'<path d="{ridge}" fill="#5a8c4e"/>')


def ridge_y(x):
    # follows the curve of the ridge closely enough for the trees
    return 256 - 14 * math.sin(x / 1600 * math.pi * 2.3 + 0.4) - 6 * math.sin(x / 210)


x = 0
while x < W:
    h = rnd.uniform(12, 20)
    parts.append(fir(x, ridge_y(x) + 6, h, "#4a7a44", "#56894e"))
    x += rnd.uniform(6, 11)

# ---------- 3. rolling hills with strips of fields ----------
hills = [
    ("M-20 330 C160 274 380 270 560 300 C700 322 760 330 820 334 V420 H-20 Z", -14, 0),
    ("M700 334 C860 290 1060 270 1260 286 C1420 298 1520 300 1620 306 V420 H700 Z", 12, 1),
]
STRIPS = ["#a7d27c", "#c5dd86", "#e3d68c", "#96c96d", "#b6d97f", "#d9d283"]
for i, (shape, slope, k) in enumerate(hills):
    parts.append(f'<clipPath id="hill{i}"><path d="{shape}"/></clipPath>')
    parts.append(f'<path d="{shape}" fill="#a3cf78"/>')
    strips = []
    for j in range(-6, 14):
        y0 = 250 + j * 22
        col = STRIPS[(j + k * 3) % len(STRIPS)]
        strips.append(f'<path d="M-40 {y0} C400 {y0 + slope * 2} 1000 {y0 - slope * 3} 1640 {y0 + slope} '
                      f'L1640 {y0 + 22} C1000 {y0 + 22 - slope * 3} 400 {y0 + 22 + slope * 2} -40 {y0 + 22} Z" fill="{col}"/>')
    parts.append(f'<g clip-path="url(#hill{i})" opacity=".9">' + "".join(strips) + "</g>")

# haystacks in rows on the hills (small: far away)
for hx, hy, hh in [(150, 300, 13), (190, 296, 12), (232, 293, 12), (420, 292, 11), (455, 294, 11),
                   (980, 292, 11), (1015, 290, 12), (1052, 289, 11), (1330, 296, 12), (1370, 298, 13), (1410, 300, 12)]:
    parts.append(haystack(hx, hy, hh))

# a few houses and the wooden church far away (in the middle, so they are seen on phones too)
for hx, hy, s in [(640, 318, 1.0), (690, 324, 0.9), (930, 314, 1.0), (980, 320, 0.85), (1090, 306, 0.9)]:
    parts.append(house(hx, hy, s))
parts.append(church(860, 312, 0.95))

# ---------- 4. the small forest on the right hill (the entrance sign covers the left part on wide screens) ----------
forest = []
for _ in range(26):
    fx = rnd.uniform(1170, 1300)
    fy = 300 + rnd.uniform(-6, 8)
    forest.append((fy, fx, rnd.uniform(30, 52)))
for fy, fx, fh in sorted(forest):
    parts.append(fir(fx, fy, fh, "#356b38", "#46823f"))

# ---------- 5. the country road, from the hills down to the entrance of the village ----------
# At the bottom of the picture the middle of the road is at x = ROAD_END_X, it is ROAD_END_HALF * 2 wide and it
# goes straight down: there the road of the village (assets/js/road.js, same numbers) takes it over.
ROAD_END_X = 800
ROAD_END_HALF = 30


def road_center(t):
    # t = 0 far away (top), t = 1 at the bottom of the picture; (1 - t)^2 makes it go straight down at the end
    x = ROAD_END_X + 80 * math.sin(t * 3 + 0.3) * (1 - t) ** 2
    y = 300 + 124 * t          # a little below the picture, so no gap is seen
    return x, y


def road_half(t):
    # it narrows slowly towards the hills (a gentle curve), so it joins the road of the village smoothly
    return 4 + (ROAD_END_HALF - 4) * t ** 0.85


def band(lo, hi, n=60, t0=0.0, dy=0.0):
    """The part of the road between lo and hi (-1 = left edge, 1 = right edge), from t0 down to the bottom."""
    pts_l, pts_r = [], []
    for i in range(n + 1):
        t = t0 + (1 - t0) * i / n
        cx, cy = road_center(t)
        h = road_half(t)
        pts_l.append((cx + lo * h, cy + dy))
        pts_r.append((cx + hi * h, cy + dy))
    return "M" + " L".join(f"{f(x)} {f(y)}" for x, y in pts_l) + " L" + " L".join(f"{f(x)} {f(y)}" for x, y in reversed(pts_r)) + " Z"


# ---------- 6. the meadow in front (ends with the color of the page) ----------
parts.append(f'<path d="M-20 360 C300 336 560 344 800 352 C1060 360 1300 338 1620 348 V420 H-20 Z" fill="#b2db8c"/>')
parts.append(f'<path d="M-20 396 C300 386 600 392 800 394 C1100 398 1320 386 1620 392 V420 H-20 Z" fill="{FIELD}"/>')
# the road, drawn like the road of the village (assets/js/road.js and assets/css/village.css, .village-road):
# a soft shadow in the grass, the earth with a darker rim, a lighter middle, two quiet wheel tracks,
# little stones along the edges and small tufts of grass, all smaller far away
parts.append(f'<path d="{band(-1, 1, dy=2)}" fill="rgba(70,100,40,.2)"/>')
parts.append(f'<path d="{band(-1, 1)}" fill="#dcc196" stroke="#b98f5a" stroke-width="2" stroke-linejoin="round"/>')
parts.append(f'<path d="{band(-0.5, 0.42)}" fill="#e8d4ab"/>')
for lo, hi in [(-0.36, -0.25), (0.25, 0.36)]:
    parts.append(f'<path d="{band(lo, hi, t0=0.25)}" fill="#c4a06a" opacity=".5"/>')
for side in (-1, 1):
    for i in range(18, 61):
        t = i / 60
        if math.sin(t * 9 + side * 2) < 0.45:
            continue
        cx, cy = road_center(t)
        ex = cx + side * road_half(t)
        k = 0.35 + 0.65 * t
        parts.append(f'<ellipse cx="{f(ex)}" cy="{f(cy)}" rx="{f(2.6 * k)}" ry="{f(2 * k)}" fill="#cfc4b2" stroke="#a99a83" stroke-width="{f(0.8 * k)}"/>')
    for i in range(10, 60, 7):
        t = i / 60 + rnd.uniform(0, 0.03)
        cx, cy = road_center(t)
        ex, k = cx + side * road_half(t), 0.4 + 0.6 * t
        for j in range(2):
            x0, h = ex + (j - 0.5) * 4 * k, (8 + rnd.uniform(0, 4)) * k
            parts.append(f'<path d="M{f(x0)} {f(cy + 1)} q-2 -{f(h * .5)} -4 -{f(h * .8)} M{f(x0)} {f(cy + 1)} q0 -{f(h * .6)} 0 -{f(h)} '
                         f'M{f(x0)} {f(cy + 1)} q2 -{f(h * .5)} 4 -{f(h * .75)}" stroke="#6aa84a" stroke-width="{f(1.6 * k)}" fill="none" stroke-linecap="round"/>')

# fences along the near part of the road (posts and two rails)
for side in (-1, 1):
    posts = []
    for i in range(16, 41, 3):
        t = i / 40
        cx, cy = road_center(t)
        posts.append((cx + side * (road_half(t) + 10 + 26 * t), cy, 6 + 26 * t))
    for (x1, y1, h1), (x2, y2, h2) in zip(posts, posts[1:]):
        for k in (0.35, 0.7):
            parts.append(f'<path d="M{f(x1)} {f(y1 - h1 * k)} L{f(x2)} {f(y2 - h2 * k)}" stroke="#8a5a32" '
                         f'stroke-width="{f(1 + 3 * (y1 - 300) / 120)}" stroke-linecap="round"/>')
    for x, y, h in posts:
        parts.append(f'<path d="M{f(x)} {f(y)} V{f(y - h)}" stroke="#6b4426" stroke-width="{f(1.5 + h * 0.12)}" stroke-linecap="round"/>')

# big haystacks in front, left and right (the middle ones are seen on phones too)
for hx, hy, hh in [(150, 404, 78), (250, 396, 58), (600, 392, 44), (1060, 392, 46), (1360, 398, 62), (1460, 406, 80)]:
    parts.append(haystack(hx, hy, hh))

# small flowers in the meadow
for _ in range(90):
    fx, fy = rnd.uniform(0, W), rnd.uniform(370, 414)
    col = rnd.choice(["#ffffff", "#ffe066", "#ff9eb5", "#c9a3ff"])
    parts.append(f'<circle cx="{f(fx)}" cy="{f(fy)}" r="{f(rnd.uniform(1.6, 2.6))}" fill="{col}"/>')

svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMax slice">'
       + "".join(parts) + "</svg>\n")
OUT.write_text(svg, encoding="utf-8")
print(f"{OUT.relative_to(ROOT)}: {len(svg) // 1024} KB")
