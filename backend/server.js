import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './db/init.js';
import authRoutes from './routes/auth.js';
import assessmentRoutes from './routes/assessments.js';
import aiRoutes from './routes/ai.js';
import checkinRoutes from './routes/checkins.js';
import stackscoreRoutes from './routes/stackscore.js';
import communityRoutes from './routes/community.js';
import challengeRoutes from './routes/challenges.js';
import profileRoutes from './routes/profile.js';
import levelingRoutes from './routes/leveling.js';
import questsRoutes from './routes/quests.js';
import moodRoutes from './routes/mood.js';
import leaderboardRoutes from './routes/leaderboard.js';
import exportRoutes from './routes/export.js';
import achievementsRoutes from './routes/achievements.js';
import tipsRoutes from './routes/tips.js';
import { authMiddleware } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5000',
  'http://localhost:5173',
  'http://127.0.0.1:5000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(allowed => origin.startsWith(allowed.replace(/\/$/, '')))) {
      callback(null, true);
    } else if (process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'Akↄfa Fixit API', 
    version: '2.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      assessments: '/api/assessments',
      ai: '/api/ai',
      checkins: '/api/checkins',
      stackscore: '/api/stackscore',
      community: '/api/community',
      challenges: '/api/challenges',
      profile: '/api/profile'
    }
  });
});

app.use('/api/auth', authRoutes);

app.use('/api/assessments', authMiddleware, assessmentRoutes);
app.use('/api/ai', authMiddleware, aiRoutes);
app.use('/api/checkins', authMiddleware, checkinRoutes);
app.use('/api/stackscore', authMiddleware, stackscoreRoutes);
app.use('/api/community', authMiddleware, communityRoutes);
app.use('/api/challenges', authMiddleware, challengeRoutes);
app.use('/api/profile', authMiddleware, profileRoutes);
app.use('/api/leveling', authMiddleware, levelingRoutes);
app.use('/api/quests', authMiddleware, questsRoutes);
app.use('/api/mood', authMiddleware, moodRoutes);
app.use('/api/leaderboard', authMiddleware, leaderboardRoutes);
app.use('/api/export', authMiddleware, exportRoutes);
app.use('/api/achievements', authMiddleware, achievementsRoutes);
app.use('/api/tips', authMiddleware, tipsRoutes);

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    console.log('Contact form submission:', { name, email, message, timestamp: new Date().toISOString() });
    
    res.json({ success: true, message: 'Message received successfully' });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

const startServer = async () => {
  try {
    await initDb();
    console.log('Database initialized');
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Akↄfa Backend running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
