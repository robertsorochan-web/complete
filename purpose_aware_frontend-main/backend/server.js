import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './db/init.js';
import authRoutes from './routes/auth.js';
import assessmentRoutes from './routes/assessments.js';
import aiRoutes from './routes/ai.js';
import { authMiddleware } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/assessments', authMiddleware, assessmentRoutes);
app.use('/api/ai', authMiddleware, aiRoutes);

// Initialize database and start server
const startServer = async () => {
  try {
    await initDb();
    console.log('Database initialized');
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Akorfa Backend running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
