import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export const query = (text, params) => pool.query(text, params);

export const initDb = async () => {
  try {
    await pool.query('SELECT NOW()');
    
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        purpose VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create assessments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS assessments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        bio_hardware INTEGER DEFAULT 5,
        internal_os INTEGER DEFAULT 5,
        cultural_software INTEGER DEFAULT 5,
        social_instance INTEGER DEFAULT 5,
        conscious_user INTEGER DEFAULT 5,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create chat history table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS chat_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(20),
        message TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create diagnosis history table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS diagnosis_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        scenario TEXT,
        diagnosis JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('Database tables created successfully');
  } catch (err) {
    console.error('Database initialization error:', err);
    throw err;
  }
};

export default pool;
