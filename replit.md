# Akↄfa Fixit - Project Documentation

## Overview
Akↄfa Fixit is a problem-solving application designed to help users identify the root causes of their challenges across five key life areas: Body & Health, Inner Beliefs, Values & Worldview, Daily Life, and Self-Awareness. The app aims to simplify problem identification and resolution by using accessible West African everyday language, avoiding technical jargon. It serves personal, team, business, and policy contexts, providing tools for individual improvement, team performance, organizational optimization, and system-level analysis. The project envisions a future where complex problems are demystified through culturally relevant, actionable insights, leveraging AI to provide personalized guidance and foster a supportive community.

## User Preferences
- West African pidgin English for all user-facing text
- No technical jargon - use everyday language
- Akↄfa branding (with ↄ character) throughout

## System Architecture
The application follows a client-server architecture with a React + Vite frontend, an Express.js backend, and a PostgreSQL database.

**UI/UX Decisions:**
- **Language & Tone:** All user-facing text utilizes West African pidgin English, avoiding jargon for clarity and cultural relevance.
- **Branding:** Consistent use of "Akↄfa" with the 'ↄ' character.
- **Simplified Metrics:** Assessment scores are displayed with emojis (😰😕😐🙂😊) for intuitive understanding.
- **Actionable Steps:** Insights conclude with direct, actionable advice ("Do this first: [specific action]").
- **Mobile-First Design:** Optimized for mobile devices (360-412px) with touch-friendly targets, bottom navigation, and PWA support.
- **Accessibility:** Includes Text-to-Speech support for low literacy users and Twi translations.
- **Gamification:** Incorporates a "StackScore" system (300-850 range) with tiers (Novice to Guru), streak tracking, and an anonymous leaderboard to encourage engagement.

**Technical Implementations:**
- **Frontend:** Built with React and Vite, deployed on Netlify. It includes components for authentication, layout, core pages (Dashboard, Assessment, Analysis, Chat, Diagnosis), and reusable UI elements.
- **Backend:** Developed with Express.js, deployed on Render. It handles API routes for authentication, assessments, and AI interactions, with JWT for securing protected routes.
- **AI Integration:** Utilizes Groq API for purpose-aware chat, diagnosis, and personalized insights.
- **Daily Check-in System:** Implements 5-layer micro-assessments, mood tracking, cultural bug logging, and AI reflection prompts.
- **Community Features:** Supports themed challenge groups, anonymous insight sharing, success stories, and accountability partners.
- **Monetization Tiers:** Structured with Free, Pro, Teams, and Enterprise tiers offering varying levels of features.

**Feature Specifications:**
- **Core Problem Solving:** Guides users through a 5-dimension assessment (Body & Health, Inner Beliefs, Values & Worldview, Daily Life, Self-Awareness) to identify root causes.
- **Purpose-Aware Context:** Adapts app functionality and examples for personal, team, business, and policy contexts.
- **Ghana-Specific Enhancements:** Integrates Ghanaian proverbs, actionable tips in pidgin, real-world examples, local resources, and success stories.
- **Progress Tracking:** Features a daily check-in system, streak tracking, a StackScore with historical data, and progress timelines.
- **Challenge Marketplace:** Offers themed challenges with difficulty levels and point systems.
- **Communication & Sharing:** Includes WhatsApp/SMS sharing, printable reports, and voice navigation.

**System Design Choices:**
- **Modularity:** Clear separation of frontend and backend concerns.
- **Scalability:** Designed for cloud deployment with Netlify and Render.
- **Database:** PostgreSQL (Supabase/Neon) for robust data storage.
- **Security:** JWT-based authentication for protecting user data and API access.
- **Offline Capability:** Service worker for basic offline functionality.
- **Ethical AI:** Incorporates uncertainty metrics, ethical guardrails, and limitations disclosure to promote responsible usage.

## External Dependencies
- **Deployment Platforms:** Netlify (Frontend), Render (Backend)
- **Database:** Supabase or Neon (PostgreSQL)
- **AI Service:** Groq API
- **Potential Future Integrations:** Twilio (for SMS), Real-time Market Price APIs, Mobile Money integration.