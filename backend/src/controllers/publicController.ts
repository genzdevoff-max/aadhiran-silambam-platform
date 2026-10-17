import { Request, Response } from 'express';
import { query } from '../config/db';

export const getHomeContent = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Site settings (hero, quick facts, general)
    const settingsRes = await query('SELECT key, value FROM site_settings WHERE key IN ($1, $2, $3)', [
      'hero', 'quick_facts', 'general'
    ]);
    const settingsMap: Record<string, any> = {};
    settingsRes.rows.forEach(r => { settingsMap[r.key] = r.value; });

    // 2. Featured achievements
    const achievementsRes = await query(`
      SELECT id, title, category, year, awarding_organization, description, cover_image_url, evidence_url
      FROM achievements
      WHERE status = 'published' AND is_featured = true
      ORDER BY sort_order ASC, year DESC
      LIMIT 4
    `);

    // 3. Upcoming events
    const eventsRes = await query(`
      SELECT id, title, slug, description, event_type, start_date, end_date, location, cover_image_url, registration_url
      FROM events
      WHERE status = 'upcoming'
      ORDER BY start_date ASC
      LIMIT 3
    `);

    // 4. Latest news
    const newsRes = await query(`
      SELECT id, title, slug, summary, category, tags, cover_image_url, published_at
      FROM news_articles
      WHERE status = 'published'
      ORDER BY published_at DESC
      LIMIT 3
    `);

    // 5. Featured photo gallery preview
    const galleryRes = await query(`
      SELECT id, file_name, original_name, file_path, alt_text, caption
      FROM media_assets
      WHERE is_featured = true
      ORDER BY created_at DESC
      LIMIT 8
    `);

    // 6. Active instructors preview
    const instructorsRes = await query(`
      SELECT id, name, tamil_name, title, role_type, photo_url, years_experience, lineage_rank
      FROM instructors
      WHERE is_active = true
      ORDER BY sort_order ASC
      LIMIT 4
    `);

    res.json({
      success: true,
      data: {
        hero: settingsMap.hero || null,
        quickFacts: settingsMap.quick_facts || [],
        general: settingsMap.general || null,
        featuredAchievements: achievementsRes.rows,
        upcomingEvents: eventsRes.rows,
        latestNews: newsRes.rows,
        galleryPreview: galleryRes.rows,
        instructorsPreview: instructorsRes.rows
      }
    });
  } catch (error) {
    console.error('getHomeContent error:', error);
    res.status(500).json({ success: false, message: 'Failed to load home page content.' });
  }
};

export const getAboutContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const generalRes = await query("SELECT value FROM site_settings WHERE key = 'general'");
    const instructorsRes = await query(`
      SELECT id, name, tamil_name, title, role_type, biography, years_experience, lineage_rank, photo_url
      FROM instructors
      WHERE is_active = true
      ORDER BY sort_order ASC
    `);

    res.json({
      success: true,
      data: {
        general: generalRes.rows[0]?.value || {},
        instructors: instructorsRes.rows
      }
    });
  } catch (error) {
    console.error('getAboutContent error:', error);
    res.status(500).json({ success: false, message: 'Failed to load about content.' });
  }
};

export const getLineage = async (req: Request, res: Response): Promise<void> => {
  try {
    const instructorsRes = await query(`
      SELECT id, name, tamil_name, title, role_type, biography, years_experience, lineage_rank, photo_url, sort_order
      FROM instructors
      WHERE is_active = true
      ORDER BY sort_order ASC
    `);

    const milestones = [
      {
        era: '5,000 Years Ago',
        title: 'Genesis in Kurunji Mountains',
        description: 'Emergence of stick twirling and tactical evasion among ancient Tamil warrior tribes in the Kurunji mountain terrain of South India.'
      },
      {
        era: 'Sangam Period to Colonial Rule',
        title: 'Royal Martial Traditions of Madurai',
        description: 'Preservation of the Guru-Student lineage across generations in Madurai, Tamil Nadu, developing the complete 10-stage curriculum.'
      },
      {
        era: '1936',
        title: 'Migration of 14th Descendant to Penang',
        description: 'Grandmaster Mariapakkiam migrates to George Town, Penang during the British colonial era, establishing authentic practice in Malaya.'
      },
      {
        era: '25 February 1975',
        title: 'Formal Association Registration',
        description: 'Registration of Persatuan Aadhiran Silambam Pulau Pinang, creating an unbroken institutional sanctuary for traditional Tamil martial arts.'
      },
      {
        era: '2017 – 2022',
        title: 'Global Heritage & National Primacy',
        description: 'International recognition from CNN Travel (2017), UNESCO Living Heritage engagement (2019), ICHCAP global publication (2020), and Malaysia Book of Records certification (2022).'
      }
    ];

    res.json({
      success: true,
      data: {
        masters: instructorsRes.rows,
        milestones
      }
    });
  } catch (error) {
    console.error('getLineage error:', error);
    res.status(500).json({ success: false, message: 'Failed to load lineage information.' });
  }
};

export const getSyllabus = async (req: Request, res: Response): Promise<void> => {
  try {
    const stagesRes = await query(`
      SELECT id, stage_number, tamil_name, english_name, overview, key_techniques, weapon_focus, animal_movements
      FROM syllabus_stages
      WHERE is_published = true
      ORDER BY stage_number ASC
    `);

    res.json({
      success: true,
      data: stagesRes.rows
    });
  } catch (error) {
    console.error('getSyllabus error:', error);
    res.status(500).json({ success: false, message: 'Failed to load syllabus.' });
  }
};

export const getInstructors = async (req: Request, res: Response): Promise<void> => {
  try {
    const instructorsRes = await query(`
      SELECT id, name, tamil_name, title, role_type, biography, years_experience, lineage_rank, photo_url, sort_order
      FROM instructors
      WHERE is_active = true
      ORDER BY sort_order ASC
    `);

    res.json({
      success: true,
      data: instructorsRes.rows
    });
  } catch (error) {
    console.error('getInstructors error:', error);
    res.status(500).json({ success: false, message: 'Failed to load instructors.' });
  }
};

export const getAchievements = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, year } = req.query;
    let sql = `
      SELECT id, title, category, year, date_awarded, awarding_organization, description, cover_image_url, supporting_images, evidence_url, is_featured
      FROM achievements
      WHERE status = 'published'
    `;
    const params: any[] = [];

    if (category) {
      params.push(category);
      sql += ` AND category = $${params.length}`;
    }
    if (year) {
      params.push(year);
      sql += ` AND year = $${params.length}`;
    }

    sql += ` ORDER BY sort_order ASC, year DESC`;

    const achievementsRes = await query(sql, params);

    // Get categories for filtering
    const categoriesRes = await query(`
      SELECT DISTINCT category FROM achievements WHERE status = 'published' ORDER BY category ASC
    `);

    res.json({
      success: true,
      data: achievementsRes.rows,
      categories: categoriesRes.rows.map(r => r.category)
    });
  } catch (error) {
    console.error('getAchievements error:', error);
    res.status(500).json({ success: false, message: 'Failed to load achievements.' });
  }
};

export const getAchievementById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const achRes = await query(`
      SELECT id, title, category, year, date_awarded, awarding_organization, description, cover_image_url, supporting_images, evidence_url, is_featured
      FROM achievements
      WHERE id = $1 AND status = 'published'
    `, [id]);

    if (achRes.rowCount === 0) {
      res.status(404).json({ success: false, message: 'Achievement not found.' });
      return;
    }

    res.json({ success: true, data: achRes.rows[0] });
  } catch (error) {
    console.error('getAchievementById error:', error);
    res.status(500).json({ success: false, message: 'Failed to load achievement details.' });
  }
};

export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    let sql = `
      SELECT id, title, slug, description, event_type, start_date, end_date, location, cover_image_url, registration_url, is_featured, status
      FROM events
    `;
    const params: any[] = [];

    if (status) {
      params.push(status);
      sql += ` WHERE status = $${params.length}`;
    }

    sql += ` ORDER BY start_date ASC`;

    const eventsRes = await query(sql, params);
    res.json({ success: true, data: eventsRes.rows });
  } catch (error) {
    console.error('getEvents error:', error);
    res.status(500).json({ success: false, message: 'Failed to load events.' });
  }
};

export const getEventBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const eventRes = await query(`
      SELECT id, title, slug, description, event_type, start_date, end_date, location, cover_image_url, registration_url, is_featured, status
      FROM events
      WHERE slug = $1
    `, [slug]);

    if (eventRes.rowCount === 0) {
      res.status(404).json({ success: false, message: 'Event not found.' });
      return;
    }

    res.json({ success: true, data: eventRes.rows[0] });
  } catch (error) {
    console.error('getEventBySlug error:', error);
    res.status(500).json({ success: false, message: 'Failed to load event.' });
  }
};

export const getAlbums = async (req: Request, res: Response): Promise<void> => {
  try {
    const albumsRes = await query(`
      SELECT a.id, a.title, a.slug, a.description, a.category, a.sort_order,
             COUNT(m.id)::int as photo_count,
             (SELECT file_path FROM media_assets WHERE album_id = a.id ORDER BY is_featured DESC, created_at DESC LIMIT 1) as cover_photo
      FROM albums a
      LEFT JOIN media_assets m ON m.album_id = a.id
      WHERE a.is_published = true
      GROUP BY a.id
      ORDER BY a.sort_order ASC
    `);

    res.json({ success: true, data: albumsRes.rows });
  } catch (error) {
    console.error('getAlbums error:', error);
    res.status(500).json({ success: false, message: 'Failed to load albums.' });
  }
};

export const getPhotos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { albumSlug } = req.query;
    let sql = `
      SELECT m.id, m.file_name, m.original_name, m.file_path, m.mime_type, m.file_size, m.alt_text, m.caption, m.is_featured,
             a.title as album_title, a.slug as album_slug
      FROM media_assets m
      LEFT JOIN albums a ON m.album_id = a.id
    `;
    const params: any[] = [];

    if (albumSlug) {
      params.push(albumSlug);
      sql += ` WHERE a.slug = $${params.length}`;
    }

    sql += ` ORDER BY m.is_featured DESC, m.created_at DESC`;

    const photosRes = await query(sql, params);
    res.json({ success: true, data: photosRes.rows });
  } catch (error) {
    console.error('getPhotos error:', error);
    res.status(500).json({ success: false, message: 'Failed to load photos.' });
  }
};

export const getVideos = async (req: Request, res: Response): Promise<void> => {
  try {
    const videos = [
      {
        id: 'vid-1',
        title: 'Aadhiran Silambam of Penang: The Untold Story',
        description: 'Documentary detailing the historic migration of 14th descendant Grandmaster Mariapakkiam in 1936 from Madurai to George Town, Penang, and the preservation of authentic Kurunji stick twirling.',
        videoUrl: '/uploads/VID-20231026-WA0019.mp4',
        thumbnailUrl: '/uploads/silambam-back.jpg',
        duration: 'Authentic Archive',
        category: 'Documentary',
        featured: true
      },
      {
        id: 'vid-2',
        title: 'Master Demonstration: High-Velocity Kambu Veechu Twirling',
        description: 'Dynamic demonstration of two-handed and reverse-grip staff rotations executed by senior masters of the association.',
        videoUrl: '/uploads/VID-20231026-WA0020.mp4',
        thumbnailUrl: '/uploads/1129754474.jpg',
        duration: 'Demonstration',
        category: 'Technique',
        featured: true
      },
      {
        id: 'vid-3',
        title: 'Athletic Agility & Footwork Synchrony',
        description: 'Training sequences highlighting the rigorous physical conditioning and continuous rotational flow required in traditional Silambam combat.',
        videoUrl: '/uploads/athletica.mp4',
        thumbnailUrl: '/uploads/mariapaqiam4.png',
        duration: 'Training',
        category: 'Conditioning',
        featured: false
      }
    ];

    res.json({ success: true, data: videos });
  } catch (error) {
    console.error('getVideos error:', error);
    res.status(500).json({ success: false, message: 'Failed to load videos.' });
  }
};

export const getNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, tag } = req.query;
    let sql = `
      SELECT id, title, slug, summary, category, tags, cover_image_url, published_at
      FROM news_articles
      WHERE status = 'published'
    `;
    const params: any[] = [];

    if (category) {
      params.push(category);
      sql += ` AND category = $${params.length}`;
    }
    if (tag) {
      params.push(`%${tag}%`);
      sql += ` AND tags ILIKE $${params.length}`;
    }

    sql += ` ORDER BY published_at DESC`;

    const newsRes = await query(sql, params);
    res.json({ success: true, data: newsRes.rows });
  } catch (error) {
    console.error('getNews error:', error);
    res.status(500).json({ success: false, message: 'Failed to load news articles.' });
  }
};

export const getNewsBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const articleRes = await query(`
      SELECT n.id, n.title, n.slug, n.summary, n.content, n.category, n.tags, n.cover_image_url, n.published_at,
             u.full_name as author_name
      FROM news_articles n
      LEFT JOIN users u ON n.author_id = u.id
      WHERE n.slug = $1 AND n.status = 'published'
    `, [slug]);

    if (articleRes.rowCount === 0) {
      res.status(404).json({ success: false, message: 'Article not found.' });
      return;
    }

    res.json({ success: true, data: articleRes.rows[0] });
  } catch (error) {
    console.error('getNewsBySlug error:', error);
    res.status(500).json({ success: false, message: 'Failed to load article.' });
  }
};

export const getHeritageProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const projectsRes = await query(`
      SELECT id, title, slug, organization, year, overview, cultural_significance, full_content, cover_image_url, document_url, is_featured
      FROM heritage_projects
      ORDER BY year DESC, created_at DESC
    `);

    res.json({ success: true, data: projectsRes.rows });
  } catch (error) {
    console.error('getHeritageProjects error:', error);
    res.status(500).json({ success: false, message: 'Failed to load heritage projects.' });
  }
};

export const getHeritageBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const projectRes = await query(`
      SELECT id, title, slug, organization, year, overview, cultural_significance, full_content, cover_image_url, document_url, is_featured
      FROM heritage_projects
      WHERE slug = $1
    `, [slug]);

    if (projectRes.rowCount === 0) {
      res.status(404).json({ success: false, message: 'Heritage project not found.' });
      return;
    }

    res.json({ success: true, data: projectRes.rows[0] });
  } catch (error) {
    console.error('getHeritageBySlug error:', error);
    res.status(500).json({ success: false, message: 'Failed to load project details.' });
  }
};

export const getPartnersPress = async (req: Request, res: Response): Promise<void> => {
  try {
    const itemsRes = await query(`
      SELECT id, title, entity_type, organization_name, publication_date, quote_or_excerpt, article_url, logo_or_image_url, is_featured
      FROM partners_press
      ORDER BY publication_date DESC, created_at DESC
    `);

    res.json({ success: true, data: itemsRes.rows });
  } catch (error) {
    console.error('getPartnersPress error:', error);
    res.status(500).json({ success: false, message: 'Failed to load partners and press coverage.' });
  }
};

export const getSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const settingsRes = await query('SELECT key, value FROM site_settings');
    const settingsMap: Record<string, any> = {};
    settingsRes.rows.forEach(r => { settingsMap[r.key] = r.value; });

    res.json({ success: true, data: settingsMap });
  } catch (error) {
    console.error('getSettings error:', error);
    res.status(500).json({ success: false, message: 'Failed to load site settings.' });
  }
};

export const submitContactEnquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, phone, message } = req.body;

    if (!fullName || !email || !phone || !message) {
      res.status(400).json({ success: false, message: 'Please provide full name, email, phone, and your message.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
      return;
    }

    const ip = req.ip || req.socket.remoteAddress || '';

    await query(`
      INSERT INTO enquiries (enquiry_type, full_name, email, phone, message, status, ip_address)
      VALUES ('general', $1, $2, $3, $4, 'new', $5)
    `, [fullName.trim(), email.trim().toLowerCase(), phone.trim(), message.trim(), ip]);

    res.status(201).json({
      success: true,
      message: 'Thank you! Your enquiry has been received. Our association officers will contact you shortly.'
    });
  } catch (error) {
    console.error('submitContactEnquiry error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit enquiry. Please try again later.' });
  }
};

export const submitJoinEnquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, phone, ageGroup, experienceLevel, preferredLocation, message } = req.body;

    if (!fullName || !email || !phone) {
      res.status(400).json({ success: false, message: 'Full name, email, and phone number are required.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
      return;
    }

    const ip = req.ip || req.socket.remoteAddress || '';

    await query(`
      INSERT INTO enquiries (
        enquiry_type, full_name, email, phone, age_group, experience_level, preferred_location, message, status, ip_address
      )
      VALUES ('join_training', $1, $2, $3, $4, $5, $6, $7, 'new', $8)
    `, [
      fullName.trim(),
      email.trim().toLowerCase(),
      phone.trim(),
      ageGroup || 'adult',
      experienceLevel || 'beginner',
      preferredLocation || 'George Town',
      message ? message.trim() : 'Admission enquiry for Aadhiran traditional syllabus training.',
      ip
    ]);

    res.status(201).json({
      success: true,
      message: 'Admission enquiry received! Our chief instructor will reach out regarding batch timing and venue location.'
    });
  } catch (error) {
    console.error('submitJoinEnquiry error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit admission enquiry.' });
  }
};
