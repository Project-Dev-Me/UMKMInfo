
# Deployment Guide - UMKM Directory App

## Setup untuk Deployment

### 1. Persiapan Repository GitHub

1. **Push kode ke GitHub repository**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Struktur project harus seperti ini:**
   ```
   your-repo/
   ├── client/          # Frontend React app
   ├── server/          # Backend Express app
   ├── package.json     # Root package.json
   └── build scripts
   ```

### 2. Environment Variables untuk Production

**Untuk Vercel/Netlify (Frontend):**
```env
VITE_SUPABASE_URL=https://vpqjytpuudiqxrzeshuv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwcWp5dHB1dWRpcXhyemVzaHV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NzQwNzksImV4cCI6MjA2NDE1MDA3OX0.qiZVA-gV6gjDPVQ3tt-xQxuWwupLsmNO1NARWLXulb8
```

**Untuk Railway/Render (Backend):**
```env
SUPABASE_URL=https://vpqjytpuudiqxrzeshuv.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwcWp5dHB1dWRpcXhyemVzaHV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NzQwNzksImV4cCI6MjA2NDE1MDA3OX0.qiZVA-gV6gjDPVQ3tt-xQxuWwupLsmNO1NARWLXulb8
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwcWp5dHB1dWRpcXhyemVzaHV2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU3NDA3OSwiZXhwIjoyMDY0MTUwMDc5fQ.oAGS1KjZ8W0Fho6kB35hU-3bJ3kWHBYAAL1iNGk5dsU
NODE_ENV=production
PORT=5000
```

### 3. Setup Database di Supabase

1. **Jalankan SQL Schema:**
   - Buka Supabase Dashboard: https://supabase.com/dashboard
   - Pilih project: vpqjytpuudiqxrzeshuv
   - Buka SQL Editor
   - Copy paste isi file `supabase-schema.sql`
   - Klik "Run"

2. **Verifikasi Tables:**
   - Buka Table Editor
   - Pastikan semua table sudah terbuat:
     - users
     - categories
     - umkm_businesses
     - reviews
     - bookmarks
     - notifications

3. **Setup Storage:**
   - Buka Storage di dashboard
   - Pastikan bucket `umkm-images` dan `profile-images` sudah ada
   - Jika belum, buat manual di dashboard

### 4. Deploy Frontend (Vercel - Recommended)

1. **Pergi ke [vercel.com](https://vercel.com)**
2. **Import GitHub repository**
3. **Set Framework Preset:** Vite
4. **Set Build Command:**
   ```bash
   cd client && npm install && npm run build
   ```
5. **Set Output Directory:** `client/dist`
6. **Add Environment Variables:**
   ```
   VITE_SUPABASE_URL=https://vpqjytpuudiqxrzeshuv.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwcWp5dHB1dWRpcXhyemVzaHV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NzQwNzksImV4cCI6MjA2NDE1MDA3OX0.qiZVA-gV6gjDPVQ3tt-xQxuWwupLsmNO1NARWLXulb8
   ```
7. **Deploy**

### 5. Deploy Backend (Railway - Recommended)

1. **Pergi ke [railway.app](https://railway.app)**
2. **New Project → Deploy from GitHub repo**
3. **Select your repository**
4. **Add Environment Variables:**
   ```
   SUPABASE_URL=https://vpqjytpuudiqxrzeshuv.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwcWp5dHB1dWRpcXhyemVzaHV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NzQwNzksImV4cCI6MjA2NDE1MDA3OX0.qiZVA-gV6gjDPVQ3tt-xQxuWwupLsmNO1NARWLXulb8
   SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwcWp5dHB1dWRpcXhyemVzaHV2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU3NDA3OSwiZXhwIjoyMDY0MTUwMDc5fQ.oAGS1KjZ8W0Fho6kB35hU-3bJ3kWHBYAAL1iNGk5dsU
   NODE_ENV=production
   PORT=5000
   ```
5. **Deploy**

### 6. Update Frontend untuk Connect ke Backend

Setelah backend deployed, update file client dengan URL backend:

```typescript
// client/src/lib/api.ts
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.railway.app' 
  : 'http://localhost:5000';
```

### 7. Alternative: Deploy Full-Stack di Vercel

Jika ingin deploy full-stack di satu tempat:

1. **Update package.json root:**
   ```json
   {
     "scripts": {
       "build": "npm install && cd client && npm install && npm run build && cd ../server && npm install && npm run build",
       "start": "cd server && npm start",
       "dev": "npm run dev"
     }
   }
   ```

2. **Create vercel.json:**
   ```json
   {
     "builds": [
       {
         "src": "server/index.ts",
         "use": "@vercel/node"
       },
       {
         "src": "client/package.json",
         "use": "@vercel/static-build",
         "config": { "distDir": "dist" }
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "/server/index.ts"
       },
       {
         "src": "/(.*)",
         "dest": "/client/dist/$1"
       }
     ]
   }
   ```

### 8. Alternative Platforms

**Frontend Alternatives:**
- Netlify
- GitHub Pages
- Surge.sh

**Backend Alternatives:**
- Render.com
- Heroku
- DigitalOcean App Platform

### 9. Domain Custom (Optional)

1. **Beli domain di Namecheap/GoDaddy**
2. **Update DNS records:**
   - A record: point ke IP hosting
   - CNAME: www -> your-app.vercel.app
3. **Update Supabase redirect URLs**

### 10. Monitoring & Maintenance

1. **Setup monitoring:**
   - Vercel Analytics
   - Supabase Logs
   - Error tracking (Sentry)

2. **Backup strategy:**
   - Supabase automatic backups
   - Code backups di GitHub

### 11. Security Checklist

- ✅ Environment variables tidak di-commit
- ✅ Supabase RLS policies aktif
- ✅ CORS configuration benar
- ✅ API rate limiting (optional)
- ✅ Input validation di backend

### 12. Testing Production

1. **Test semua fitur:**
   - User registration/login
   - UMKM CRUD operations
   - Reviews system
   - Bookmarks
   - Image uploads

2. **Performance testing:**
   - Page load speeds
   - API response times
   - Mobile responsiveness

## Troubleshooting

**Common Issues:**

1. **Environment variables tidak terload:**
   - Pastikan prefix VITE_ untuk frontend
   - Restart deployment setelah update env vars

2. **CORS errors:**
   - Update Supabase settings
   - Add frontend domain ke allowed origins

3. **Database connection issues:**
   - Verify Supabase credentials
   - Check RLS policies
   - Ensure tables exist

4. **Build failures:**
   - Check Node.js version compatibility
   - Ensure all dependencies installed
   - Check build logs untuk specific errors

**Need Help?**
- Check Vercel/Railway logs
- Supabase dashboard logs
- Browser developer console
