# Akorfa Fixit Backend

Express.js API server for Akorfa Fixit application.

## Quick Start

```bash
npm install
npm start
```

Server runs on port 3000.

## Environment Variables

```
DATABASE_URL=postgresql://...
GROQ_API_KEY=your_key
JWT_SECRET=your_secret
FRONTEND_URL=http://localhost:5000
NODE_ENV=development
```

## API Endpoints

- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `GET /api/assessments` - Get user assessment (protected)
- `POST /api/assessments` - Save assessment (protected)
- `POST /api/ai/chat` - Chat with AI (protected)
- `POST /api/ai/diagnosis` - Get diagnosis (protected)

## Deployment

Deploy to Render with this repo as root directory.
