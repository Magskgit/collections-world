# Collections World — Complete Setup & Hosting Guide
## Stack: FastAPI (Python) + React + SQLite → Deploy FREE on Railway + Vercel

---

## 📁 PROJECT STRUCTURE

```
collections-world/
├── backend/               ← FastAPI Python API
│   ├── main.py            ← All API routes
│   ├── models.py          ← Database tables
│   ├── schemas.py         ← Request/Response shapes
│   ├── auth.py            ← Admin login & JWT tokens
│   ├── database.py        ← SQLite connection
│   ├── seed_data.py       ← Initial products & categories
│   ├── requirements.txt
│   ├── Dockerfile
│   └── railway.toml
├── frontend/              ← React app
│   ├── src/
│   │   ├── App.js         ← Routes
│   │   ├── index.css      ← All styles
│   │   ├── context/
│   │   │   └── CartContext.js
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── CartDrawer.js
│   │   │   ├── ProductCard.js
│   │   │   └── Footer.js
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── ProductsPage.js
│   │   │   ├── ProductDetailPage.js
│   │   │   ├── CheckoutPage.js
│   │   │   ├── OrderPages.js
│   │   │   └── AdminPage.js
│   │   └── services/
│   │       └── api.js
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
└── docker-compose.yml     ← Run everything locally
```

---

## 🖥️ STEP 1: RUN LOCALLY (Your PC)

### Prerequisites
- Install **Python 3.11+**: https://python.org/downloads
- Install **Node.js 18+**: https://nodejs.org
- Install **Git**: https://git-scm.com

### 1A — Start the Backend
```bash
cd collections-world/backend

# Create a virtual environment (recommended)
python -m venv venv
source venv/bin/activate        # Mac/Linux
venv\Scripts\activate           # Windows

# Install Python packages
pip install -r requirements.txt "bcrypt==4.0.1"

# Seed the database (creates products & admin user)
python seed_data.py

# Start the API server
uvicorn main:app --reload --port 8000
```
✅ API is now running at: http://localhost:8000
✅ Auto-docs at: http://localhost:8000/docs

### 1B — Start the Frontend
```bash
# Open a NEW terminal window
cd collections-world/frontend

# Install Node packages
npm install

# Start the dev server
npm start
```
✅ Website is now running at: http://localhost:3000

### Admin Login
- URL: http://localhost:3000/admin
- Username: **admin**
- Password: **admin@CW2024**
  ⚠️ Change this password before going live!

---

## 🚀 STEP 2: DEPLOY TO THE CLOUD (FREE)

### Recommended Stack (All FREE tiers):
| Service    | What For           | Cost          |
|------------|--------------------|---------------|
| Railway    | Backend (FastAPI)  | Free 500hrs/mo|
| Vercel     | Frontend (React)   | Free forever  |
| GitHub     | Code storage       | Free          |

---

## 📤 STEP 3: PUSH CODE TO GITHUB

```bash
# In the collections-world folder
git init
git add .
git commit -m "Initial commit — Collections World"

# Create a repo on github.com (name: collections-world)
git remote add origin https://github.com/YOUR_USERNAME/collections-world.git
git push -u origin main
```

---

## 🚂 STEP 4: DEPLOY BACKEND ON RAILWAY

Railway is the easiest free Python hosting.

1. Go to https://railway.app — Sign up with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your **collections-world** repo
4. Railway detects the Dockerfile automatically
5. Set the **Root Directory** to: `backend`
6. Add these **Environment Variables** in Railway dashboard:
   ```
   PORT=8000
   ```
7. Click **Deploy** — wait ~2 minutes
8. Go to **Settings → Networking → Generate Domain**
9. Copy your URL, e.g.: `https://collections-world-backend.up.railway.app`

✅ Your API is live!

---

## ▲ STEP 5: DEPLOY FRONTEND ON VERCEL

1. Go to https://vercel.com — Sign up with GitHub
2. Click **"New Project"** → Import your **collections-world** repo
3. Set **Root Directory** to: `frontend`
4. Under **Environment Variables**, add:
   ```
   REACT_APP_API_URL = https://YOUR-RAILWAY-URL.up.railway.app
   ```
   (Replace with your actual Railway URL from Step 4)
5. Click **Deploy** — wait ~3 minutes
6. Your website is live at: `https://collections-world.vercel.app`

✅ Your full website is live!

---

## 🔧 STEP 6: CUSTOM DOMAIN (Optional, ~₹700/year)

1. Buy a domain from GoDaddy / Namecheap / Google Domains
   - Suggested: `collectionsworldchennai.com` (~₹800/yr)

2. In Vercel:
   - Go to Project Settings → Domains
   - Add your domain
   - Copy the DNS records shown

3. In your domain registrar:
   - Go to DNS settings
   - Add the CNAME/A records from Vercel

4. Wait 10–30 minutes → your site is live on your domain!

---

## 📱 STEP 7: MAKE IT MOBILE-READY (Future)

The website is already mobile-responsive. For a proper mobile app later:

### Option A — React Native (Recommended)
- Reuse your backend API
- Build iOS + Android from one codebase
- Use Expo: https://expo.dev (free to develop)

### Option B — PWA (Progressive Web App)
- Add to `frontend/public/manifest.json`
- Users can "Add to Home Screen"
- Works offline too!

---

## 💰 COST SUMMARY

| Item                    | Cost         |
|-------------------------|--------------|
| Railway (backend)       | FREE         |
| Vercel (frontend)       | FREE         |
| GitHub                  | FREE         |
| Domain name (optional)  | ~₹700/year   |
| **TOTAL**               | **₹0 – ₹700/year** |

---

## 🛠️ USEFUL COMMANDS

```bash
# Add more products via admin panel
# Go to: your-site.vercel.app/admin

# Check backend logs on Railway
# Railway dashboard → Deployments → View Logs

# Update & redeploy (automatic!)
git add .
git commit -m "Update products"
git push
# Railway & Vercel auto-deploy on every git push ✅
```

---

## 🔐 SECURITY CHECKLIST (Before Going Live)

1. **Change admin password** — go to `/admin` and update
2. **Update SECRET_KEY** in `backend/auth.py` — use a random 32-char string
3. **Set CORS origins** in `backend/main.py`:
   ```python
   allow_origins=["https://your-site.vercel.app"]  # not "*"
   ```
4. **Backup your database** — download `collections_world.db` regularly

---

## 📞 SUPPORT & NEXT STEPS

Built for: **Collections World, No.9A Chokkanathar Street, Chennai – 600095**
Phone: 9994090118

Next features to add:
- [ ] WhatsApp order notifications (Twilio / WA Business API)
- [ ] UPI payment gateway (Razorpay — ₹0 setup, 2% per transaction)
- [ ] Product image uploads from admin panel
- [ ] Customer login & order history
- [ ] SMS order updates
- [ ] Mobile app (React Native / Expo)
