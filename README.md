# ✨ Luxury Lifestyle Dashboard

A sleek luxury lifestyle dashboard built with React, Vite, and Tailwind CSS.

---

## 🚀 Running Locally (Easy Way)

Just double-click **`run.bat`** in the root folder!

It will:
1. Auto-install dependencies if needed (first time only)
2. Start the dev server
3. Tell you to open `http://localhost:3000` in your browser

---

## 🛠️ Manual Way (using VS Code Terminal)

```bash
cd artifacts/luxury-dashboard
npm install       # only needed the first time
npm run dev       # starts the site
```

Open `http://localhost:3000` in your browser.

---

## 📦 Pushing to GitHub

Open a terminal in VS Code (`Ctrl + ~`) and run these commands one by one:

```bash
git add .
git commit -m "your message here"
git push
```

If you haven't set a remote yet:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

---

## 🌐 Deploying to Vercel

### Option A – Vercel Website (Easiest)
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import your GitHub repo
4. Set the **Root Directory** to `artifacts/luxury-dashboard`
5. Vercel will auto-detect Vite — just click **Deploy**!

### Option B – Vercel CLI
```bash
npm install -g vercel
cd artifacts/luxury-dashboard
vercel
```
Follow the prompts and your site will be live!

---

## 🧱 Tech Stack

- **React 19** – UI framework
- **Vite 7** – Super fast build tool
- **Tailwind CSS 4** – Styling
- **shadcn/ui** – Beautiful components
- **Recharts** – Charts and graphs
- **Framer Motion** – Animations
