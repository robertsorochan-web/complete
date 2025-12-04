# Akↄfa Fixit - Project Documentation

## Overview
Akↄfa Fixit is a problem-solving app wey help users find the root cause of their problems across 5 life areas. The app uses West African everyday language to make things simple and clear - no jargon, no tech speak.

The 5 Life Areas:
- **Body & Health** - Your physical wellbeing, energy, sleep, exercise
- **Inner Beliefs** - What you believe about yourself, your fears and confidence
- **Values & Worldview** - Your culture, upbringing, and how you see the world
- **Daily Life** - Your relationships, job, money, and everyday responsibilities
- **Self-Awareness** - How well you understand yourself and can make decisions

## App Purpose by Context
- **Personal**: Individual life improvement
- **Team**: Team performance consulting
- **Business**: Organizational optimization
- **Policy**: System-level analysis

## Project Structure

```
├── frontend/          # React + Vite frontend (deploy to Netlify)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/           # Login and Signup forms
│   │   │   ├── layout/         # Header and Sidebar
│   │   │   ├── Pages/          # Dashboard, Assessment, Analysis, Chat, Diagnosis
│   │   │   └── ui/             # Reusable UI components
│   │   ├── services/           # API and authentication services
│   │   ├── config/             # Purpose-specific configurations
│   │   └── styles/             # Global and component CSS
│   ├── netlify.toml            # Netlify deployment config
│   ├── vite.config.js          # Vite configuration
│   └── package.json
│
├── backend/           # Express.js backend (deploy to Render)
│   ├── config/                 # Purpose-aware layer configurations
│   ├── db/                     # Database initialization
│   ├── middleware/             # JWT authentication
│   ├── routes/                 # API routes (auth, assessments, ai)
│   ├── render.yaml             # Render deployment config
│   ├── server.js               # Express server entry point
│   └── package.json
│
└── README.md          # Deployment guide
```

## Deployment Architecture

- **Frontend**: Netlify (via GitHub)
- **Backend**: Render (via GitHub)
- **Database**: Supabase or Neon (PostgreSQL)

## API Endpoints

### Public Routes
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Authenticate user

### Protected Routes (require JWT)
- `GET /api/assessments` - Get user's assessment data
- `POST /api/assessments` - Update user's assessment
- `POST /api/ai/chat` - Chat with Akↄfa (purpose-aware)
- `POST /api/ai/diagnosis` - Get diagnosis for a scenario
- `POST /api/ai/insights` - Get personalized insights

## Database Schema
- `users` - User accounts (email, password, name, purpose)
- `assessments` - User assessments (5 dimension scores)
- `chat_history` - Chat conversation history
- `diagnosis_history` - Past diagnoses

## Environment Variables

### Backend (Render)
- `DATABASE_URL` - Supabase/Neon PostgreSQL connection string
- `GROQ_API_KEY` - Groq API key for AI features
- `JWT_SECRET` - Secret for JWT token signing
- `FRONTEND_URL` - Netlify frontend URL (for CORS)
- `NODE_ENV` - Set to `production`
- `PORT` - Server port (Render sets this automatically)

### Frontend (Netlify)
- `VITE_API_URL` - Backend API URL (e.g., https://your-backend.onrender.com/api)

## Local Development
- Backend runs on port 3000
- Frontend runs on port 5000 (with Vite proxy to backend)

## User Preferences
- West African pidgin English for all user-facing text
- No technical jargon - use everyday language
- Akↄfa branding (with ↄ character) throughout

## Recent Changes (Dec 2024)
- Replaced all "Akorfa/AI" branding with "Akↄfa"
- Rewrote all UI text to use West African pidgin English
- Converted technical framework terms to everyday language:
  - Bio Hardware → Body & Health
  - Internal OS → Inner Beliefs
  - Cultural Software → Values & Worldview
  - Social Instance → Daily Life
  - Conscious User → Self-Awareness
- Updated homepage with compelling messaging ("Stop Chasing Symptoms. Fix The Real Problem.")
- Added pidgin expressions: "You dey try different things but nothing dey work?"
- Updated Chat, Diagnosis, and Dashboard pages with West African language
- Updated backend config and AI prompts with new terminology
- Added retention features: daily check-ins, progress tracking
- Updated error messages to use everyday language

## User Experience Flow
1. User signs up with email, password, name, and purpose selection
2. After signup, taken to 5-question quick assessment (one per layer)
3. Assessment generates personalized insights showing strengths and weak areas
4. User lands on dashboard with their initial assessment saved
5. Can refine assessment, talk to Akↄfa, or get diagnosis for specific problems
