"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = exports.name = exports.id = void 0;
const schemaUtils_1 = require("./schemaUtils");
exports.id = '002_content';
exports.name = 'Syllabus, instructors, achievements, events, news, heritage and press';
const up = async (client) => {
    await (0, schemaUtils_1.ensureTable)(client, `
    CREATE TABLE IF NOT EXISTS syllabus_stages (
      id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
      stage_number INT UNIQUE NOT NULL,
      tamil_name VARCHAR(255) NOT NULL,
      english_name VARCHAR(255) NOT NULL,
      overview TEXT NOT NULL,
      key_techniques TEXT,
      weapon_focus TEXT,
      animal_movements TEXT,
      sort_order INT DEFAULT 0,
      is_published BOOLEAN DEFAULT true,
      created_at DATETIME DEFAULT NOW()
    )
  `);
    await (0, schemaUtils_1.ensureTable)(client, `
    CREATE TABLE IF NOT EXISTS instructors (
      id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
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
      created_at DATETIME DEFAULT NOW()
    )
  `);
    await (0, schemaUtils_1.ensureTable)(client, `
    CREATE TABLE IF NOT EXISTS achievements (
      id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
      title VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      year INT NOT NULL,
      date_awarded DATE,
      awarding_organization VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      cover_image_url VARCHAR(500),
      supporting_images JSON,
      evidence_url VARCHAR(500),
      is_featured BOOLEAN DEFAULT false,
      status VARCHAR(50) DEFAULT 'published',
      sort_order INT DEFAULT 0,
      created_at DATETIME DEFAULT NOW()
    )
  `);
    await (0, schemaUtils_1.ensureTable)(client, `
    CREATE TABLE IF NOT EXISTS events (
      id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      description TEXT NOT NULL,
      event_type VARCHAR(100) DEFAULT 'competition',
      start_date DATETIME NOT NULL,
      end_date DATETIME,
      location VARCHAR(255) NOT NULL,
      cover_image_url VARCHAR(500),
      registration_url VARCHAR(500),
      is_featured BOOLEAN DEFAULT false,
      status VARCHAR(50) DEFAULT 'upcoming',
      created_at DATETIME DEFAULT NOW()
    )
  `);
    await (0, schemaUtils_1.ensureTable)(client, `
    CREATE TABLE IF NOT EXISTS news_articles (
      id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      summary TEXT NOT NULL,
      content TEXT NOT NULL,
      category VARCHAR(100) DEFAULT 'news',
      tags VARCHAR(255) DEFAULT '',
      cover_image_url VARCHAR(500),
      author_id CHAR(36),
      status VARCHAR(50) DEFAULT 'published',
      is_featured BOOLEAN DEFAULT false,
      published_at DATETIME DEFAULT NOW(),
      created_at DATETIME DEFAULT NOW(),
      updated_at DATETIME DEFAULT NOW(),
      CONSTRAINT fk_news_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);
    await (0, schemaUtils_1.ensureTable)(client, `
    CREATE TABLE IF NOT EXISTS heritage_projects (
      id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
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
      created_at DATETIME DEFAULT NOW()
    )
  `);
    await (0, schemaUtils_1.ensureTable)(client, `
    CREATE TABLE IF NOT EXISTS partners_press (
      id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
      title VARCHAR(255) NOT NULL,
      entity_type VARCHAR(50) NOT NULL,
      organization_name VARCHAR(255) NOT NULL,
      publication_date DATE,
      quote_or_excerpt TEXT,
      article_url VARCHAR(500),
      logo_or_image_url VARCHAR(500),
      is_featured BOOLEAN DEFAULT false,
      created_at DATETIME DEFAULT NOW()
    )
  `);
    await (0, schemaUtils_1.ensureIndex)(client, 'achievements', 'idx_achievements_status', 'status');
    await (0, schemaUtils_1.ensureIndex)(client, 'events', 'idx_events_status', 'status');
    await (0, schemaUtils_1.ensureIndex)(client, 'news_articles', 'idx_news_status', 'status');
};
exports.up = up;
