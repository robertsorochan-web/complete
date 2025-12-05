import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});

pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

export const query = (text, params) => pool.query(text, params);

export const initDb = async () => {
  let client;
  try {
    client = await pool.connect();
    console.log('Connected to database');
    
    await client.query('SELECT NOW()');
    
    // Users table with tier support
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        purpose VARCHAR(50),
        tier VARCHAR(20) DEFAULT 'free',
        stack_score INTEGER DEFAULT 300,
        current_streak INTEGER DEFAULT 0,
        longest_streak INTEGER DEFAULT 0,
        total_checkins INTEGER DEFAULT 0,
        ai_insights_used INTEGER DEFAULT 0,
        ai_insights_reset_date DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Add new columns if they don't exist
    await client.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='tier') THEN
          ALTER TABLE users ADD COLUMN tier VARCHAR(20) DEFAULT 'free';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='stack_score') THEN
          ALTER TABLE users ADD COLUMN stack_score INTEGER DEFAULT 300;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='current_streak') THEN
          ALTER TABLE users ADD COLUMN current_streak INTEGER DEFAULT 0;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='longest_streak') THEN
          ALTER TABLE users ADD COLUMN longest_streak INTEGER DEFAULT 0;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='total_checkins') THEN
          ALTER TABLE users ADD COLUMN total_checkins INTEGER DEFAULT 0;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='ai_insights_used') THEN
          ALTER TABLE users ADD COLUMN ai_insights_used INTEGER DEFAULT 0;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='ai_insights_reset_date') THEN
          ALTER TABLE users ADD COLUMN ai_insights_reset_date DATE DEFAULT CURRENT_DATE;
        END IF;
      END $$;
    `);

    // Original assessments table
    await client.query(`
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

    // Daily Check-ins table
    await client.query(`
      CREATE TABLE IF NOT EXISTS daily_checkins (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        checkin_date DATE DEFAULT CURRENT_DATE,
        bio_hardware INTEGER DEFAULT 5,
        internal_os INTEGER DEFAULT 5,
        cultural_software INTEGER DEFAULT 5,
        social_instance INTEGER DEFAULT 5,
        conscious_user INTEGER DEFAULT 5,
        cultural_bug TEXT,
        mood INTEGER DEFAULT 5,
        energy_level INTEGER DEFAULT 5,
        daily_win TEXT,
        symptom_log TEXT,
        reflection_prompt TEXT,
        reflection_response TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, checkin_date)
      )
    `);

    // User badges table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_badges (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        badge_type VARCHAR(50) NOT NULL,
        badge_name VARCHAR(100) NOT NULL,
        badge_description TEXT,
        earned_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, badge_type, badge_name)
      )
    `);

    // StackScore history table
    await client.query(`
      CREATE TABLE IF NOT EXISTS stack_score_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        score INTEGER NOT NULL,
        consistency_score DECIMAL(5,2),
        progress_score DECIMAL(5,2),
        balance_score DECIMAL(5,2),
        ai_bonus INTEGER DEFAULT 0,
        recorded_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Community groups table
    await client.query(`
      CREATE TABLE IF NOT EXISTS community_groups (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        theme VARCHAR(50),
        icon VARCHAR(50),
        member_count INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // User group memberships
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_groups (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        group_id INTEGER REFERENCES community_groups(id) ON DELETE CASCADE,
        joined_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, group_id)
      )
    `);

    // Challenges table
    await client.query(`
      CREATE TABLE IF NOT EXISTS challenges (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        challenge_type VARCHAR(50),
        layer_focus VARCHAR(50),
        duration_days INTEGER DEFAULT 7,
        difficulty VARCHAR(20) DEFAULT 'medium',
        points INTEGER DEFAULT 100,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // User challenge participation
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_challenges (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        challenge_id INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'active',
        progress INTEGER DEFAULT 0,
        started_at TIMESTAMP DEFAULT NOW(),
        completed_at TIMESTAMP,
        UNIQUE(user_id, challenge_id)
      )
    `);

    // Accountability partners
    await client.query(`
      CREATE TABLE IF NOT EXISTS accountability_partners (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        partner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'pending',
        matched_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, partner_id)
      )
    `);

    // Success stories
    await client.query(`
      CREATE TABLE IF NOT EXISTS success_stories (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(200),
        story TEXT NOT NULL,
        improvement_type VARCHAR(50),
        improvement_percentage INTEGER,
        is_approved BOOLEAN DEFAULT false,
        is_anonymous BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Anonymous insights sharing
    await client.query(`
      CREATE TABLE IF NOT EXISTS shared_insights (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        insight_text TEXT NOT NULL,
        layer VARCHAR(50),
        improvement_value INTEGER,
        likes INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Progress milestones
    await client.query(`
      CREATE TABLE IF NOT EXISTS progress_milestones (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        milestone_type VARCHAR(50) NOT NULL,
        milestone_name VARCHAR(100) NOT NULL,
        milestone_value INTEGER,
        achieved_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Chat history
    await client.query(`
      CREATE TABLE IF NOT EXISTS chat_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(20),
        message TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Diagnosis history
    await client.query(`
      CREATE TABLE IF NOT EXISTS diagnosis_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        scenario TEXT,
        diagnosis JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Notification preferences
    await client.query(`
      CREATE TABLE IF NOT EXISTS notification_preferences (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
        daily_reminder_time TIME DEFAULT '09:00',
        weekly_review_day INTEGER DEFAULT 0,
        push_enabled BOOLEAN DEFAULT true,
        email_enabled BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // XP and Level tracking
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_xp (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
        total_xp INTEGER DEFAULT 0,
        current_level INTEGER DEFAULT 1,
        xp_to_next_level INTEGER DEFAULT 100,
        lifetime_xp INTEGER DEFAULT 0,
        last_xp_earned_at TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // XP transactions log
    await client.query(`
      CREATE TABLE IF NOT EXISTS xp_transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        xp_amount INTEGER NOT NULL,
        action_type VARCHAR(50) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Quests table
    await client.query(`
      CREATE TABLE IF NOT EXISTS quests (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        quest_type VARCHAR(50) DEFAULT 'daily',
        action_type VARCHAR(100) NOT NULL,
        target_count INTEGER DEFAULT 1,
        xp_reward INTEGER DEFAULT 25,
        difficulty VARCHAR(20) DEFAULT 'easy',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // User quest progress
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_quests (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        quest_id INTEGER REFERENCES quests(id) ON DELETE CASCADE,
        progress INTEGER DEFAULT 0,
        status VARCHAR(20) DEFAULT 'active',
        assigned_date DATE DEFAULT CURRENT_DATE,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, quest_id, assigned_date)
      )
    `);

    // Mood tracking enhanced
    await client.query(`
      CREATE TABLE IF NOT EXISTS mood_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        mood_score INTEGER NOT NULL CHECK (mood_score >= 1 AND mood_score <= 5),
        energy_score INTEGER CHECK (energy_score >= 1 AND energy_score <= 5),
        notes TEXT,
        tags TEXT[],
        time_of_day VARCHAR(20),
        logged_at TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Leaderboard snapshots (weekly/monthly)
    await client.query(`
      CREATE TABLE IF NOT EXISTS leaderboard_snapshots (
        id SERIAL PRIMARY KEY,
        period_type VARCHAR(20) NOT NULL,
        period_start DATE NOT NULL,
        period_end DATE NOT NULL,
        rankings JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Friend challenges
    await client.query(`
      CREATE TABLE IF NOT EXISTS friend_challenges (
        id SERIAL PRIMARY KEY,
        challenge_code VARCHAR(20) UNIQUE NOT NULL,
        creator_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        challenge_type VARCHAR(50) DEFAULT 'streak',
        target_value INTEGER DEFAULT 7,
        start_date DATE DEFAULT CURRENT_DATE,
        end_date DATE,
        status VARCHAR(20) DEFAULT 'pending',
        winner_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Friend challenge participants
    await client.query(`
      CREATE TABLE IF NOT EXISTS friend_challenge_participants (
        id SERIAL PRIMARY KEY,
        challenge_id INTEGER REFERENCES friend_challenges(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        current_progress INTEGER DEFAULT 0,
        joined_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(challenge_id, user_id)
      )
    `);

    // Streak recovery tracking
    await client.query(`
      CREATE TABLE IF NOT EXISTS streak_recovery (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        lost_streak INTEGER NOT NULL,
        recovery_used BOOLEAN DEFAULT false,
        lost_at TIMESTAMP DEFAULT NOW(),
        recovered_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // User favorites/saved items
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_favorites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        item_type VARCHAR(50) NOT NULL,
        item_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, item_type, item_id)
      )
    `);

    // Testimonials table
    await client.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        testimonial_text TEXT NOT NULL,
        before_score INTEGER,
        after_score INTEGER,
        layer_focus VARCHAR(50),
        is_approved BOOLEAN DEFAULT false,
        is_featured BOOLEAN DEFAULT false,
        display_name VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Feature waitlist
    await client.query(`
      CREATE TABLE IF NOT EXISTS feature_waitlist (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        email VARCHAR(255),
        feature_name VARCHAR(100) NOT NULL,
        vote_count INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, feature_name)
      )
    `);

    // Insert default quests
    await client.query(`
      INSERT INTO quests (title, description, quest_type, action_type, target_count, xp_reward, difficulty) 
      VALUES 
        ('Morning Check-in', 'Complete your daily check-in', 'daily', 'checkin', 1, 25, 'easy'),
        ('Reflection Master', 'Write a reflection response', 'daily', 'reflection', 1, 15, 'easy'),
        ('Mood Logger', 'Log your mood 3 times today', 'daily', 'mood_log', 3, 30, 'medium'),
        ('Community Contributor', 'Share an insight with the community', 'daily', 'share_insight', 1, 20, 'easy'),
        ('Week Warrior', 'Maintain a 7-day streak', 'weekly', 'streak', 7, 100, 'medium'),
        ('Challenge Starter', 'Start a new challenge', 'weekly', 'start_challenge', 1, 50, 'easy'),
        ('Layer Explorer', 'Rate all 5 layers in one check-in', 'daily', 'full_checkin', 1, 35, 'easy'),
        ('Consistency King', 'Complete check-ins for 30 days', 'monthly', 'streak', 30, 500, 'hard')
      ON CONFLICT DO NOTHING
    `);

    // Insert default community groups
    await client.query(`
      INSERT INTO community_groups (name, slug, description, theme, icon) 
      VALUES 
        ('Bio-Hackers', 'bio-hackers', 'Physical optimization and health enhancement', 'bioHardware', 'heart-pulse'),
        ('Mindfulness Masters', 'mindfulness-masters', 'Awareness training and mental clarity', 'consciousUser', 'brain'),
        ('Culture Coders', 'culture-coders', 'Examining and reprogramming cultural influences', 'culturalSoftware', 'code'),
        ('Relationship Architects', 'relationship-architects', 'Social optimization and connection building', 'socialInstance', 'users'),
        ('OS Optimizers', 'os-optimizers', 'Mental model debugging and belief system updates', 'internalOS', 'cpu')
      ON CONFLICT (slug) DO NOTHING
    `);

    // Insert default challenges
    await client.query(`
      INSERT INTO challenges (title, description, challenge_type, layer_focus, duration_days, difficulty, points) 
      VALUES 
        ('7-Day Sleep Optimization', 'Track and improve your sleep quality for 7 days', 'daily', 'bioHardware', 7, 'easy', 100),
        ('Mindful Morning', 'Start each day with 10 minutes of mindfulness', 'daily', 'consciousUser', 14, 'medium', 200),
        ('Belief Audit', 'Identify and examine 5 limiting beliefs', 'weekly', 'internalOS', 7, 'hard', 150),
        ('Connection Week', 'Have meaningful conversations with 3 people daily', 'daily', 'socialInstance', 7, 'medium', 150),
        ('Cultural Detective', 'Notice 3 cultural influences affecting your decisions daily', 'daily', 'culturalSoftware', 7, 'medium', 150),
        ('Energy Tracker', 'Log your energy levels 4 times daily', 'daily', 'bioHardware', 14, 'easy', 100),
        ('Gratitude Practice', 'Write 3 things you are grateful for each day', 'daily', 'consciousUser', 21, 'easy', 250),
        ('Social Media Audit', 'Examine how social media affects your worldview', 'weekly', 'culturalSoftware', 7, 'hard', 200)
      ON CONFLICT DO NOTHING
    `);

    console.log('Database tables created successfully');
  } catch (err) {
    console.error('Database initialization error:', err);
    throw err;
  } finally {
    if (client) client.release();
  }
};

export default pool;
