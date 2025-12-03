# Akorfa Fixit - Project Documentation

## Overview
Akorfa Fixit is a purpose-aware assessment and coaching application that helps users understand and improve across 5 interconnected dimensions. The app supports 4 different contexts:
- **Personal**: Individual life improvement (Body & Health, Inner Beliefs, Values & Worldview, Daily Life, Self-Awareness)
- **Team**: Team performance consulting (Team Capacity, Team Culture, Shared Practices, Team Dynamics, Leadership Clarity)
- **Business**: Organizational optimization (Infrastructure, Company Culture, Market Position, Stakeholder Network, Strategic Vision)
- **Policy**: System-level analysis (Population Health, Institutional Norms, Policy Frameworks, Governance Systems, Research Insights)

## Project Architecture

### Frontend (React + Vite)
Located in: `purpose_aware_frontend-main/purpose_aware_frontend-main/public/`

```
public/
├── src/
│   ├── components/
│   │   ├── Auth/           # Login and Signup forms
│   │   ├── layout/         # Header and Sidebar
│   │   ├── Pages/          # Main application pages (Dashboard, Assessment, Analysis, Chat, Diagnosis)
│   │   └── ui/             # Reusable UI components
│   ├── services/           # API and authentication services
│   │   ├── auth.js         # Auth + API calls for assessments, chat, diagnosis
│   │   └── groq.js         # AI insights service
│   ├── config/
│   │   └── purposeConfig.js # Purpose-specific layer configurations
│   ├── styles/             # Global and component CSS
│   └── App.jsx             # Main application component
├── package.json
├── vite.config.js
└── tailwind.config.js
```

### Backend (Express.js + PostgreSQL)
Located in: `purpose_aware_frontend-main/backend/`

```
backend/
├── config/
│   └── purposeConfig.js    # Purpose-aware layer configurations
├── db/
│   └── init.js             # Database initialization and connection
├── middleware/
│   └── auth.js             # JWT authentication middleware
├── routes/
│   ├── auth.js             # /api/auth (signup, login)
│   ├── assessments.js      # /api/assessments (GET, POST)
│   └── ai.js               # /api/ai (chat, diagnosis, insights)
├── server.js               # Express server entry point
└── package.json
```

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
- `DATABASE_URL` - PostgreSQL connection string
- `GROQ_API_KEY` - Groq API key for AI features
- `JWT_SECRET` - Secret for JWT token signing
- `PORT` - Backend server port (default: 3000)

## Running the Application
- Backend runs on port 3000
- Frontend runs on port 5000 (with Vite proxy to backend)

## Recent Changes (Dec 2024)
- Added purpose-aware layer configurations to backend matching frontend
- Updated AI endpoints to support all 4 purpose types (personal, team, business, policy)
- Added conversation history support to chat endpoint
- Added `/api/ai/insights` endpoint for Analysis page
- Updated frontend services to use backend API instead of Netlify functions
- Added defensive checks for missing assessment data in AI routes
