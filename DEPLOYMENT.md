# Vercel Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (free tier)
- Push your code to GitHub

## Backend Deployment (Deploy First)

1. Go to https://vercel.com and sign in
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Select the `backend` folder as root directory
5. Add Environment Variables:
   - `DATABASE_URL` - Your Prisma Accelerate URL
   - `JWT_SECRET` - Your JWT secret
   - `GROQ_API_KEY` - Your Groq API key
   - `RAPIDAPI_KEY` - Your RapidAPI key
   - `OPENWEATHER_API_KEY` - Your OpenWeather API key
   - `SMTP_HOST` - smtp.gmail.com
   - `SMTP_PORT` - 587
   - `SMTP_USER` - Your Gmail
   - `SMTP_PASS` - Your Gmail app password
   - `FRONTEND_URL` - Will be your frontend URL (add after frontend deployment)
6. Click "Deploy"
7. Copy the deployment URL (e.g., https://your-backend.vercel.app)

## Frontend Deployment

1. Update `frontend/.env.production`:
   - Replace `VITE_API_URL` with your backend URL from step 7 above
2. Update all API calls in frontend to use environment variable:
   - Replace `http://localhost:5000/api` with `import.meta.env.VITE_API_URL || 'http://localhost:5000'` + `/api`
3. Go to Vercel → "Add New" → "Project"
4. Import your GitHub repository again
5. Select the `frontend` folder as root directory
6. Framework Preset: Vite
7. Build Command: `npm run build`
8. Output Directory: `dist`
9. Click "Deploy"
10. Copy the frontend URL and update backend's `FRONTEND_URL` environment variable

## Update Backend CORS

Add your frontend URL to CORS in `backend/server.js`:
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-frontend.vercel.app'],
  credentials: true
}));
```

## Database Setup

Your Prisma Accelerate connection is already configured. Make sure:
1. Database tables are created (run migrations locally first)
2. Connection string is added to Vercel environment variables

## Post-Deployment

1. Test all features on production URLs
2. Check browser console for any CORS or API errors
3. Verify environment variables are set correctly
4. Test authentication flow
5. Test trip planning and all features

## Free Tier Limits

- Vercel Free: 100GB bandwidth/month, serverless function timeout 10s
- Consider upgrading if you need more resources

## Troubleshooting

- If API calls fail: Check CORS settings and environment variables
- If build fails: Check Node version compatibility
- If functions timeout: Optimize API calls or upgrade plan
