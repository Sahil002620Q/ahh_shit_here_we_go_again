# Quick Setup Guide

## Backend Setup

1. Navigate to backend:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. The `.env` file is already configured with SQLite (no database setup needed!)

4. Start the server:
```bash
python main.py
```

Backend will run on http://localhost:8000

## Frontend Setup

1. Navigate to frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. The `.env.local` file is already configured!

4. Start the development server:
```bash
npm run dev
```

Frontend will run on http://localhost:3000

## Test the App

1. Open http://localhost:3000
2. Click "Get Started" to register
3. Choose "Seller" role to create listings
4. Choose "Buyer" role to browse and send buy requests

## Features

✅ Animated UI with glass morphism effects
✅ Smooth transitions and hover effects
✅ Responsive design (mobile-ready)
✅ SQLite database (no setup required)
✅ JWT authentication
✅ Role-based access (Buyer, Seller, Admin)
✅ Search and filter system
✅ Buy request workflow
✅ Dashboard for all roles

## Troubleshooting

If registration doesn't work:
- Make sure backend is running on port 8000
- Check browser console for errors
- Verify CORS is enabled in backend

If you see database errors:
- Delete `marketplace.db` file and restart backend
- Database will be recreated automatically
