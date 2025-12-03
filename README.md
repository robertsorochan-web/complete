# Akorfa Fixit

A purpose-aware assessment and coaching application that helps users understand and improve across 5 interconnected dimensions.

## Project Structure

```
├── frontend/          # React + Vite frontend (deploy to Netlify)
├── backend/           # Express.js backend (deploy to Render)
└── README.md
```

## Deployment Guide

### 1. Set Up Database (Supabase or Neon)

**Option A: Supabase**
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > Database
3. Copy the connection string (URI format)
4. Replace `[YOUR-PASSWORD]` with your database password

**Option B: Neon**
1. Create a new project at [neon.tech](https://neon.tech)
2. Copy the connection string from the dashboard
3. Make sure to use the pooled connection string for better performance

### 2. Deploy Backend to Render

**Option A: Using Render Blueprint (Recommended)**
1. Push this repo to GitHub
2. Go to [render.com](https://render.com) > Blueprints > New Blueprint Instance
3. Connect your GitHub repository
4. Render will auto-detect the `backend/render.yaml` configuration
5. Add the required environment variables when prompted

**Option B: Manual Setup**
1. Push this repo to GitHub
2. Go to [render.com](https://render.com) and create a new Web Service
3. Connect your GitHub repository
4. Configure the service:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node

5. Add Environment Variables in Render:
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: Your Supabase/Neon connection string
   - `JWT_SECRET`: A secure random string (use a password generator)
   - `GROQ_API_KEY`: Your Groq API key
   - `FRONTEND_URL`: Your Netlify URL (add after deploying frontend)

6. Deploy and copy your Render URL (e.g., `https://your-app.onrender.com`)

### 3. Deploy Frontend to Netlify

1. Go to [netlify.com](https://netlify.com) and create a new site
2. Connect your GitHub repository
3. Configure the build:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

4. Add Environment Variables in Netlify:
   - `VITE_API_URL`: Your Render backend URL + `/api` (e.g., `https://your-app.onrender.com/api`)

5. Deploy and copy your Netlify URL

### 4. Update CORS Settings

Go back to Render and add/update the `FRONTEND_URL` environment variable with your Netlify URL.

## Local Development

### Backend
```bash
cd backend
npm install
# Create .env file with your environment variables
npm run dev
```

### Frontend
```bash
cd frontend
npm install
# Create .env file with VITE_API_URL=http://localhost:3000/api
npm run dev
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret
GROQ_API_KEY=your-groq-key
FRONTEND_URL=https://your-app.netlify.app
NODE_ENV=production
PORT=3000
```

### Frontend (.env)
```
VITE_API_URL=https://your-backend.onrender.com/api
```

## Features

- **4 Purpose Contexts**: Personal, Team, Business, Policy
- **5-Layer Assessment**: Analyze different dimensions based on context
- **AI-Powered Chat**: Get personalized coaching advice
- **AI Diagnosis**: Analyze scenarios and get actionable insights
- **Analysis Dashboard**: View trends and recommendations

## API Endpoints

- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `GET /api/assessments` - Get assessment data
- `POST /api/assessments` - Update assessment
- `POST /api/ai/chat` - Chat with AI coach
- `POST /api/ai/diagnosis` - Get AI diagnosis
- `POST /api/ai/insights` - Get personalized insights
