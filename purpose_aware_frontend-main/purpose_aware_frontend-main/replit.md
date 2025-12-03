# Akorfa Fixit

A life assessment and Akↄfa-powered coaching platform built with React + Vite.

## Overview

Akorfa Fixit helps users understand and improve complex systems using a "5-layer assessment system" (the Akorfa Stack Framework). It diagnoses problems and provides actionable insights with Akↄfa-powered coaching.

## Purpose-Specific Interfaces

The app adapts its interface based on user type selected during signup:

- **Personal Development** - Self-improvement focused (Bio Hardware, Internal OS, Cultural Software, Social Instance, Conscious User)
- **Team Performance** - Team management focused (Team Capacity, Team Culture, Shared Practices, Team Dynamics, Leadership Clarity)
- **Business Growth** - Organization focused (Infrastructure, Company Culture, Market Position, Stakeholder Network, Strategic Vision)
- **Policy & Research** - Systems/policy focused (Population Health, Institutional Norms, Policy Frameworks, Governance Systems, Research Insights)

Each purpose type gets:
- Purpose-specific navigation labels
- Tailored assessment layer names and descriptions
- Context-appropriate dashboard content
- Purpose-aware Akↄfa Coach interactions

## Project Structure

```
public/
├── src/
│   ├── components/
│   │   ├── Auth/           # Login and Signup forms
│   │   ├── layout/         # Header and Sidebar
│   │   ├── Pages/          # Main application pages
│   │   └── ui/             # Reusable UI components
│   ├── services/           # API and authentication services
│   ├── styles/             # Global and component CSS
│   ├── App.jsx             # Main application component
│   └── main.jsx            # React entry point
├── netlify/functions/      # Serverless API functions
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Charts**: Chart.js, Recharts
- **Icons**: Lucide React
- **Akↄfa Engine**: Groq SDK for Akↄfa-powered features

## Features

1. **User Authentication** - Signup/login system
2. **Dashboard** - Overview of assessment scores
3. **Assessment** - Rate yourself across 5 life areas:
   - Bio Hardware
   - Internal OS
   - Cultural Software
   - Social Instance
   - Conscious User
4. **Analysis** - Akↄfa-powered insights based on assessments
5. **Problem Solver (Diagnosis)** - Diagnose specific issues
6. **Akↄfa Coach (Chat)** - Interactive Akↄfa coaching

## Running the App

```bash
cd public && npm run dev
```

The app runs on port 5000.

## Netlify Deployment

The app is configured for Netlify deployment:

### Build Command
```bash
npm run build
```

### Publish Directory
```
dist
```

### Required Environment Variables
Set these in Netlify dashboard under Site Settings > Environment Variables:
- `GROQ_API_KEY` - Your Groq API key for Akↄfa-powered features

### Netlify Functions
The app uses serverless functions for Akↄfa features (located in `netlify/functions/`):
- `groqInsights.js` - Generates purpose-aware insights from assessments
- `chatInsights.js` - Powers the Akↄfa Coach chat with context
- `diagnosisInsights.js` - Provides purpose-specific problem diagnosis

All functions are purpose-aware and adapt responses based on user context (personal/team/business/policy).

### Deployment Steps
1. Connect your repository to Netlify
2. Set the build command to `npm run build`
3. Set the publish directory to `dist`
4. Add `GROQ_API_KEY` environment variable
5. Deploy

## Notes

- The app expects a backend API for authentication and data persistence
- Netlify serverless functions handle all Akↄfa-powered features
- Uses localStorage for client-side session management
