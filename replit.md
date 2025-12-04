# Akorfa Fixit - Project Documentation

## Overview
Akorfa Fixit is a purpose-aware assessment and coaching application that helps users understand and improve across 5 interconnected dimensions. The app supports 4 different contexts:
- **Personal**: Individual life improvement (Body & Health, Inner Beliefs, Values & Worldview, Daily Life, Self-Awareness)
- **Team**: Team performance consulting (Team Capacity, Team Culture, Shared Practices, Team Dynamics, Leadership Clarity)
- **Business**: Organizational optimization (Infrastructure, Company Culture, Market Position, Stakeholder Network, Strategic Vision)
- **Policy**: System-level analysis (Population Health, Institutional Norms, Policy Frameworks, Governance Systems, Research Insights)

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
- `POST /api/ai/chat` - Chat with AI coach (purpose-aware)
- `POST /api/ai/diagnosis` - Get AI diagnosis for a scenario
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

## Recent Changes (Dec 2024)
- Restructured codebase into separate frontend/ and backend/ directories
- Configured for deployment: Netlify (frontend), Render (backend), Supabase/Neon (database)
- Added production-ready CORS configuration
- Added render.yaml for Render deployment
- Updated netlify.toml for Netlify deployment
- Added .env.example files for both frontend and backend
- Added comprehensive deployment documentation in README.md
- Updated AI model from deprecated mixtral-8x7b-32768 to llama-3.3-70b-versatile
- Added favicon and site metadata
- Added "How It Works" section to homepage
- Added social proof section with stats and testimonials
- Added functional contact form with backend endpoint (/api/contact)
- Integrated Google Analytics with custom tracking utility
- Added result sharing feature with social media integration (Twitter, LinkedIn, Email)
- Fixed analytics to track both public and authenticated pages
- Enhanced signup form with real-time email validation (format + uniqueness check)
- Added password visibility toggle and strength indicators
- Created engaging onboarding flow with quick 5-question assessment
- New users get immediate personalized insights after signup ("aha moment" experience)
- Fixed async/await bugs in authentication flow for purpose persistence

## User Experience Flow
1. User signs up with email, password, name, and purpose selection
2. After signup, taken to 5-question quick assessment (one per layer)
3. Assessment generates personalized insights showing strengths and bottlenecks
4. User lands on dashboard with their initial assessment saved
5. Can refine assessment, chat with AI coach, or get diagnosis for specific problems
