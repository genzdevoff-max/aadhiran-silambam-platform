import { pool } from '../config/db';

export const runMigrations = async () => {
  const client = await pool.connect();
  try {
    console.log('--- Starting Database Migrations for Aadhiran Silambam ---');
    await client.query('BEGIN');

    // Enable UUID extension
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    // 1. Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'editor',
        is_active BOOLEAN DEFAULT true,
        last_login TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 2. Albums Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS albums (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        category VARCHAR(100) DEFAULT 'general',
        sort_order INT DEFAULT 0,
        is_published BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 3. Media Assets Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS media_assets (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        file_name VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        file_size BIGINT NOT NULL,
        width INT,
        height INT,
        alt_text VARCHAR(255) DEFAULT '',
        caption TEXT DEFAULT '',
        album_id UUID REFERENCES albums(id) ON DELETE SET NULL,
        is_featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 4. Media References Table (Safe Reference Tracking)
    await client.query(`
      CREATE TABLE IF NOT EXISTS media_references (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        media_id UUID NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
        entity_type VARCHAR(100) NOT NULL,
        entity_id UUID NOT NULL,
        field_name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 5. Syllabus Stages Table (The 10 traditional stages)
    await client.query(`
      CREATE TABLE IF NOT EXISTS syllabus_stages (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        stage_number INT UNIQUE NOT NULL,
        tamil_name VARCHAR(255) NOT NULL,
        english_name VARCHAR(255) NOT NULL,
        overview TEXT NOT NULL,
        key_techniques TEXT,
        weapon_focus TEXT,
        animal_movements TEXT,
        sort_order INT DEFAULT 0,
        is_published BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 6. Instructors Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS instructors (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        tamil_name VARCHAR(255),
        title VARCHAR(255) NOT NULL,
        role_type VARCHAR(100) DEFAULT 'instructor',
        biography TEXT NOT NULL,
        years_experience INT DEFAULT 0,
        lineage_rank VARCHAR(100),
        photo_url VARCHAR(500),
        sort_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 7. Achievements Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS achievements (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        year INT NOT NULL,
        date_awarded DATE,
        awarding_organization VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        cover_image_url VARCHAR(500),
        supporting_images JSONB DEFAULT '[]'::jsonb,
        evidence_url VARCHAR(500),
        is_featured BOOLEAN DEFAULT false,
        status VARCHAR(50) DEFAULT 'published',
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 8. Events Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS events (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT NOT NULL,
        event_type VARCHAR(100) DEFAULT 'competition',
        start_date TIMESTAMP WITH TIME ZONE NOT NULL,
        end_date TIMESTAMP WITH TIME ZONE,
        location VARCHAR(255) NOT NULL,
        cover_image_url VARCHAR(500),
        registration_url VARCHAR(500),
        is_featured BOOLEAN DEFAULT false,
        status VARCHAR(50) DEFAULT 'upcoming',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 9. News & Blog Articles Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS news_articles (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        summary TEXT NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(100) DEFAULT 'news',
        tags VARCHAR(255) DEFAULT '',
        cover_image_url VARCHAR(500),
        author_id UUID REFERENCES users(id) ON DELETE SET NULL,
        status VARCHAR(50) DEFAULT 'published',
        is_featured BOOLEAN DEFAULT false,
        published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 10. Heritage Projects Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS heritage_projects (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        organization VARCHAR(255) NOT NULL,
        year INT NOT NULL,
        overview TEXT NOT NULL,
        cultural_significance TEXT NOT NULL,
        full_content TEXT,
        cover_image_url VARCHAR(500),
        document_url VARCHAR(500),
        is_featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 11. Partners & Press Coverage Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS partners_press (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        entity_type VARCHAR(50) NOT NULL, -- 'press' or 'partner'
        organization_name VARCHAR(255) NOT NULL,
        publication_date DATE,
        quote_or_excerpt TEXT,
        article_url VARCHAR(500),
        logo_or_image_url VARCHAR(500),
        is_featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 12. Enquiries Table (Contact & Join Training)
    await client.query(`
      CREATE TABLE IF NOT EXISTS enquiries (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        enquiry_type VARCHAR(50) NOT NULL, -- 'general' or 'join_training'
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100) NOT NULL,
        age_group VARCHAR(100),
        experience_level VARCHAR(100),
        preferred_location VARCHAR(255),
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'new', -- 'new', 'contacted', 'enrolled', 'archived'
        admin_notes TEXT DEFAULT '',
        ip_address VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 13. Site Settings Table (Dynamic Section Content, SEO, Footer, Hero, Socials)
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        key VARCHAR(100) PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 14. Audit Logs Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        action VARCHAR(100) NOT NULL,
        entity_type VARCHAR(100) NOT NULL,
        entity_id UUID,
        details JSONB,
        ip_address VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Indexes for fast lookup
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_media_album ON media_assets(album_id);
      CREATE INDEX IF NOT EXISTS idx_media_ref_media ON media_references(media_id);
      CREATE INDEX IF NOT EXISTS idx_media_ref_entity ON media_references(entity_type, entity_id);
      CREATE INDEX IF NOT EXISTS idx_achievements_status ON achievements(status);
      CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
      CREATE INDEX IF NOT EXISTS idx_news_slug ON news_articles(slug);
      CREATE INDEX IF NOT EXISTS idx_news_status ON news_articles(status);
      CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
      CREATE INDEX IF NOT EXISTS idx_enquiries_type ON enquiries(enquiry_type);
    `);

    await client.query('COMMIT');
    console.log('✓ All migrations applied successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('✗ Migration error:', error);
    throw error;
  } finally {
    client.release();
  }
};

if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
