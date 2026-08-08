<div align="center">

<img src="./vvlogo.png" alt="Vessel Vision" width="88" />

# Vessel Vision 

**"Precision diagnosis for every patient."**

The internship project where we tried to make an AI healthcare startup look and feel real.
</div>
<br>

---

## 🩺 So, what is this?

Vessel Vision is (a concept for) an AI healthcare platform — think smarter, faster medical screening for hospitals and clinics. Instead of a doctor squinting at an X-ray for ten minutes, the idea is an AI flags what needs a closer look in seconds.

We built the whole product website for it during our internship — landing page, product pages, the works. It's not a real hospital tool (yet 👀), but everything on the site was designed to *feel* like a real, funded healthcare-AI company shipped it.

<br>

## 🧰 What's actually in the product suite

We designed (well, "invented" for the brief) four tools:

- 🦴 **BoneScan X** — spots fractures in X-rays in under 5 seconds, boxes them up with a confidence score
- 👁️ **DR Detection** — screens eye scans for diabetic retinopathy before it gets serious
- 🫁 **TB Detection** — reads chest X-rays for TB, built for places that are short on radiologists
- 🔧 **Retrofit Kits** — for clinics that don't want to buy new machines, just smarten up the old ones

<br>

## ⚙️ Built with

Nothing fancy on purpose — kept it a plain static site so it's easy to run and easy to hand off:

- HTML + Tailwind (via CDN, with our own custom colors/type scale)
- Plain JavaScript for the page switching, scroll animations, and that little animated "AI scanning an X-ray" bit
- Plus Jakarta Sans + Inter for the fonts, Material Symbols for icons

<br>

## 🚀 Wanna run it locally?

```bash
git clone https://github.com/mahi-p02/Vessel-Vision.git
cd Vessel-Vision
```

Easiest way — just open `index.html` in your browser. Done. ✅

If you want it a little more "proper" (some assets behave better served, not just opened):

```bash
python -m http.server 5500
# or
npx serve .
```

then go to `http://localhost:5500` 🌐
<br>
<br>

## 📁 What's in here

```
Vessel-Vision/
├── index.html                   # everything — home, product, blog, about, contact
├── style.css                    # the custom bits Tailwind doesn't cover
├── script.js                    # page switching + all the little animations
├── vvlogo.png                   # logo
├── BoneScanX.jfif                # the demo X-ray used on the product page
├── biotech-illustration.png     # illustrations
├── healthtech-illustration.png  # illustrations
├── webdesigner.png               # team photos
├── ContentWriter.webp            # team photos
└── brij.png                      # team photo
```
<br>

## 🤝 The team behind it

| Who | Did what |
|:--|:--|
| **Mahi Priyadarshi** 🎨 | UI Designer — Designed the visual identity, user interface, and overall look and feel of every screen. |
| **Aftab Aalam** ✍️ | Content Writer — Crafted the content and copy that brings the brand to life |
<br>
<br>

## 💡 Why we made this

Internship project — focused on creating a realistic healthcare AI startup from the ground up. We combined thoughtful UI design, strong content, and healthcare-focused solutions to build a polished, cohesive digital experience.

---

<div align="center">
<sub>made during our internship, with more coffee than sleep ☕</sub>
</div>

