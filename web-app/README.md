# Electronic Parts Marketplace

A full-stack marketplace for buying and selling old, broken, and spare electronic devices and machine parts.

## Project Structure

```
/backend          - FastAPI backend
/frontend         - Next.js frontend
```

## Tech Stack

- **Backend**: Python (FastAPI), PostgreSQL
- **Frontend**: Next.js, React, Tailwind CSS
- **Auth**: JWT sessions
- **Deploy**: Vercel (frontend), Railway/Render (backend), Supabase/Neon (DB)

## Quick Start

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Features

- User authentication (email/phone + password/OTP)
- Seller: Create, edit, delete listings
- Buyer: Browse, filter, send buy requests
- Admin: Dashboard for listings and commissions
- No payment gateway (commission tracking only)
- No shipping integration
