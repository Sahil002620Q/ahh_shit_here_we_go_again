# Deployment Guide

## Database Setup (Supabase/Neon)

1. Create a PostgreSQL database on Supabase or Neon
2. Copy the connection string
3. Update `backend/.env` with your DATABASE_URL

## Backend Deployment (Railway/Render)

### Railway
1. Connect your GitHub repo
2. Add environment variables from `.env.example`
3. Railway will auto-detect FastAPI and deploy

### Render
1. Create new Web Service
2. Build Command: `pip install -r requirements.txt`
3. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables

## Frontend Deployment (Vercel)

1. Import your GitHub repo to Vercel
2. Framework: Next.js (auto-detected)
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL`: Your backend URL
4. Deploy

## Post-Deployment

1. Update CORS origins in `backend/main.py` to include your frontend URL
2. Test authentication flow
3. Create admin user via API or database

## Environment Variables

### Backend
```
DATABASE_URL=postgresql://user:pass@host:5432/db
SECRET_KEY=your-secret-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```
