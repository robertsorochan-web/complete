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

### Major Feature Implementation - 20 Recommendations (Latest - Dec 4, 2024)

#### Wave 1 - Core UX Improvements
- **Landing Page Redesign**: Added use-case selector with 8 templates (Fishing, Market, Farming, Education, Transport, Food Service, Health, Relationships)
- **Eliminated Academic Jargon**: All labels now use simple terms - Money, Team, Systems, Communication, Vision
- **Simplified Metrics**: Scores display with emojis (😰😕😐🙂😊) for instant understanding
- **Actionable Steps**: Every insight ends with "Do this first: [specific action]"

#### Wave 2 - Ghana-Specific Enhancements
- **Success Stories**: 8 real Ghanaian case studies on landing page showing problem/discovery/action/result
- **Local Resources**: Cooperatives, associations, government programs, microfinance options by sector
- **Voice Navigation**: Text-to-speech support for low literacy users (SpeakButton component)
- **Group Analysis**: Teams/families can analyze together with combined scores
- **Printable Reports**: PDF-ready reports for sharing with partners who can't use smartphones
- **WhatsApp/SMS Sharing**: Easy sharing of results via WhatsApp or SMS
- **Twi Translations**: Basic i18n support with language toggle (English/Twi)
- **Mobile Optimization**: CSS optimized for Tecno/Infinix phones (360-412px), touch-friendly targets

#### New Configuration Files
- `frontend/src/config/useCaseTemplates.js` - 8 use-case templates with sector-specific labels and tips
- `frontend/src/config/localResources.js` - Ghana cooperatives, associations, government programs
- `frontend/src/config/successStories.js` - 8 success stories with Ghanaian context
- `frontend/src/config/i18n.js` - English/Twi translations

#### New UI Components
- `frontend/src/components/ui/ShareableResults.jsx` - WhatsApp/SMS/Copy/Print sharing
- `frontend/src/components/ui/LanguageToggle.jsx` - English/Twi language switcher
- `frontend/src/components/ui/VoiceNavigation.jsx` - Text-to-speech support
- `frontend/src/components/ui/LocalResourcesPanel.jsx` - Sector-specific resources panel
- `frontend/src/components/ui/SuccessStories.jsx` - Success stories carousel/grid
- `frontend/src/components/ui/GroupAnalysis.jsx` - Multi-member assessment
- `frontend/src/components/ui/PrintableReport.jsx` - PDF-ready reports

#### Wave 3 - Planned (Require External Integration)
- SMS/Offline options for feature phones (needs Twilio)
- Weekly check-in reminders via SMS
- Emergency alerts (weather, fuel prices)
- Impact tracking dashboard
- Partner distribution system

### Conceptual Stress Test Fixes (Latest)
- **Uncertainty Metrics**: Stability scores now display as ranges with confidence intervals (e.g., "7.2 +/- 1.3")
- **Ethical Guardrails**: Added warning banners about framework limitations and ethical usage restrictions
- **Limitations Disclosure**: Clear list of what the framework cannot do (clinical diagnosis, predictions, etc.)
- **User Agreement**: Checkbox requiring users acknowledge the tool's limitations
- **Confidence Scores**: Each recommendation shows confidence level (40-95%)
- **Cultural Context Selector**: Users can choose cultural interpretation context (Default, Collectivist, Individualist, High-Context)
- **Temporal Dimensions**: Shows stability trends, rate of change, and system inertia
- **Feedback Loops**: Visual matrix showing how changes in one area affect others
- **Red Team Mode**: Alternative interpretations to challenge the analysis
- **Framework Health Score**: Meta-assessment of how appropriately the tool is being applied

### New Utility Files
- `frontend/src/utils/frameworkMetrics.js` - Calculations for uncertainty, confidence, cultural adjustments
- `frontend/src/components/ui/FrameworkWarnings.jsx` - Warning banners, ethical guardrails, user agreement
- `frontend/src/components/ui/AdvancedFramework.jsx` - Cultural context, temporal, feedback loops, red team mode
- `frontend/src/utils/ghanaWisdom.js` - Ghanaian proverbs (Twi/English), actionable tips, real-world examples

### Ghana-Specific Enhancements (Dec 2024)
- **Ghanaian Proverbs**: Dashboard and Analysis now show proverbs in Twi with English translations
- **Actionable Tips in Pidgin**: Specific, practical advice based on weakest area (e.g., "Wake up same time every day - even weekends. Na consistency dey help.")
- **Real-World Examples**: Relatable scenarios (market woman, chop bar owner, office worker) showing problem/solution
- **Use Case Tags on Signup**: Shows Ghana examples like "Sleep wahala", "Chop bar/shop", "Market stall"
- **Purpose-Aware Examples**: Different examples for personal (Kwame), team (office), business (Auntie Ama), and community contexts

### Previous Changes
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
