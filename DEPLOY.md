# 🚀 Quick Deploy Guide

## Deploy to GitHub Pages (FREE)

```bash
# 1. Create GitHub repo
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/habit-piggy.git
git push -u origin main

# 2. Enable GitHub Pages
# Go to: Settings → Pages → Source: main branch → Save

# 3. Your app will be live at:
# https://YOUR_USERNAME.github.io/habit-piggy/
```

## Deploy to Netlify (FREE)

1. Go to [netlify.com](https://netlify.com)
2. Drag & drop the `habit-piggy` folder
3. Done! You get a URL like: `https://habit-piggy-xyz.netlify.app`

## Deploy to Vercel (FREE)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
cd habit-piggy
vercel

# Follow prompts, done!
```

## Local Testing

```bash
# Option 1: Python
python3 -m http.server 8000

# Option 2: Node.js
npx serve

# Then open: http://localhost:8000
```

## 📱 After Deployment

1. Open your deployed URL on mobile
2. **Android:** Chrome → Menu → "Add to Home screen"
3. **iPhone:** Safari → Share → "Add to Home Screen"
4. App installs like native app!

## ✅ PWA Checklist

- [x] manifest.json created
- [x] service-worker.js created
- [x] Meta tags added
- [ ] Create icons (192x192 and 512x512)
- [ ] Deploy to HTTPS host
- [ ] Test installation on mobile

## 🎨 Create Icons

Use this online tool: [icon.kitchen](https://icon.kitchen)

Or create manually:
- 192x192px PNG
- 512x512px PNG
- Save in `assets/` folder
