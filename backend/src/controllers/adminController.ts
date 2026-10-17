import { Request, Response } from 'express';
import { query } from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';
import fs from 'fs';
import path from 'path';

// --- Dashboard Overview ---
export const getDashboardStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const [
      enquiriesCount,
      newEnquiriesCount,
      achievementsCount,
      eventsCount,
      newsCount,
      mediaCount,
      instructorsCount,
      recentEnquiries
    ] = await Promise.all([
      query('SELECT COUNT(*)::int as count FROM enquiries'),
      query("SELECT COUNT(*)::int as count FROM enquiries WHERE status = 'new'"),
      query('SELECT COUNT(*)::int as count FROM achievements'),
      query('SELECT COUNT(*)::int as count FROM events'),
      query('SELECT COUNT(*)::int as count FROM news_articles'),
      query('SELECT COUNT(*)::int as count FROM media_assets'),
      query('SELECT COUNT(*)::int as count FROM instructors'),
      query('SELECT id, enquiry_type, full_name, email, phone, status, created_at FROM enquiries ORDER BY created_at DESC LIMIT 5')
    ]);

    res.json({
      success: true,
      stats: {
        totalEnquiries: enquiriesCount.rows[0].count,
        newEnquiries: newEnquiriesCount.rows[0].count,
        achievements: achievementsCount.rows[0].count,
        events: eventsCount.rows[0].count,
        articles: newsCount.rows[0].count,
        mediaAssets: mediaCount.rows[0].count,
        instructors: instructorsCount.rows[0].count,
      },
      recentEnquiries: recentEnquiries.rows
    });
  } catch (error) {
    console.error('getDashboardStats error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve dashboard statistics.' });
  }
};

// --- Site Sections & Settings ---
export const updateSectionSetting = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (!value) {
      res.status(400).json({ success: false, message: 'Value payload is required.' });
      return;
    }

    await query(`
      INSERT INTO site_settings (key, value, updated_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (key) DO UPDATE
      SET value = EXCLUDED.value, updated_at = NOW()
    `, [key, JSON.stringify(value)]);

    res.json({ success: true, message: `Setting "${key}" updated successfully.` });
  } catch (error) {
    console.error('updateSectionSetting error:', error);
    res.status(500).json({ success: false, message: 'Failed to update section setting.' });
  }
};

// --- Syllabus Stages Management ---
export const listSyllabusStages = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const result = await query('SELECT * FROM syllabus_stages ORDER BY stage_number ASC');
    res.json({ success: true, stages: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load syllabus stages.' });
  }
};

export const createSyllabusStage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { stage_number, tamil_name, english_name, overview, key_techniques, weapon_focus, animal_movements, sort_order } = req.body;
    const result = await query(`
      INSERT INTO syllabus_stages (
        stage_number, tamil_name, english_name, overview, key_techniques, weapon_focus, animal_movements, sort_order, is_published
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)
      RETURNING *
    `, [stage_number, tamil_name, english_name, overview, key_techniques, weapon_focus, animal_movements, sort_order || stage_number]);
    res.status(201).json({ success: true, stage: result.rows[0], message: 'Stage created successfully.' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Failed to create syllabus stage.' });
  }
};

export const updateSyllabusStage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { stage_number, tamil_name, english_name, overview, key_techniques, weapon_focus, animal_movements, sort_order, is_published } = req.body;
    const result = await query(`
      UPDATE syllabus_stages
      SET stage_number = COALESCE($1, stage_number),
          tamil_name = COALESCE($2, tamil_name),
          english_name = COALESCE($3, english_name),
          overview = COALESCE($4, overview),
          key_techniques = COALESCE($5, key_techniques),
          weapon_focus = COALESCE($6, weapon_focus),
          animal_movements = COALESCE($7, animal_movements),
          sort_order = COALESCE($8, sort_order),
          is_published = COALESCE($9, is_published)
      WHERE id = $10
      RETURNING *
    `, [stage_number, tamil_name, english_name, overview, key_techniques, weapon_focus, animal_movements, sort_order, is_published, id]);
    if (result.rowCount === 0) {
      res.status(404).json({ success: false, message: 'Stage not found.' });
      return;
    }
    res.json({ success: true, stage: result.rows[0], message: 'Stage updated successfully.' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Failed to update syllabus stage.' });
  }
};

export const deleteSyllabusStage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await query('DELETE FROM syllabus_stages WHERE id = $1', [id]);
    res.json({ success: true, message: 'Stage deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to delete syllabus stage.' });
  }
};

// --- Instructors Management ---
export const listInstructors = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const result = await query('SELECT * FROM instructors ORDER BY sort_order ASC, created_at DESC');
    res.json({ success: true, instructors: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to list instructors.' });
  }
};

export const createInstructor = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, tamil_name, title, role_type, biography, years_experience, lineage_rank, photo_url, sort_order } = req.body;
    const result = await query(`
      INSERT INTO instructors (
        name, tamil_name, title, role_type, biography, years_experience, lineage_rank, photo_url, sort_order, is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
      RETURNING *
    `, [name, tamil_name, title, role_type || 'instructor', biography, years_experience || 0, lineage_rank, photo_url, sort_order || 0]);
    res.status(201).json({ success: true, instructor: result.rows[0], message: 'Instructor added successfully.' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Failed to add instructor.' });
  }
};

export const updateInstructor = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, tamil_name, title, role_type, biography, years_experience, lineage_rank, photo_url, sort_order, is_active } = req.body;
    const result = await query(`
      UPDATE instructors
      SET name = COALESCE($1, name),
          tamil_name = COALESCE($2, tamil_name),
          title = COALESCE($3, title),
          role_type = COALESCE($4, role_type),
          biography = COALESCE($5, biography),
          years_experience = COALESCE($6, years_experience),
          lineage_rank = COALESCE($7, lineage_rank),
          photo_url = COALESCE($8, photo_url),
          sort_order = COALESCE($9, sort_order),
          is_active = COALESCE($10, is_active)
      WHERE id = $11
      RETURNING *
    `, [name, tamil_name, title, role_type, biography, years_experience, lineage_rank, photo_url, sort_order, is_active, id]);
    if (result.rowCount === 0) {
      res.status(404).json({ success: false, message: 'Instructor not found.' });
      return;
    }
    res.json({ success: true, instructor: result.rows[0], message: 'Instructor updated successfully.' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Failed to update instructor.' });
  }
};

export const deleteInstructor = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await query('DELETE FROM instructors WHERE id = $1', [id]);
    res.json({ success: true, message: 'Instructor removed successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete instructor.' });
  }
};

// --- Achievements Management ---
export const listAchievements = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const result = await query('SELECT * FROM achievements ORDER BY sort_order ASC, year DESC');
    res.json({ success: true, achievements: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to list achievements.' });
  }
};

export const createAchievement = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { title, category, year, date_awarded, awarding_organization, description, cover_image_url, supporting_images, evidence_url, is_featured, status, sort_order } = req.body;
    const result = await query(`
      INSERT INTO achievements (
        title, category, year, date_awarded, awarding_organization, description, cover_image_url, supporting_images, evidence_url, is_featured, status, sort_order
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `, [
      title, category, year, date_awarded || null, awarding_organization, description,
      cover_image_url, JSON.stringify(supporting_images || []), evidence_url,
      is_featured ?? false, status || 'published', sort_order || 0
    ]);
    res.status(201).json({ success: true, achievement: result.rows[0], message: 'Achievement created successfully.' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Failed to create achievement.' });
  }
};

export const updateAchievement = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, category, year, date_awarded, awarding_organization, description, cover_image_url, supporting_images, evidence_url, is_featured, status, sort_order } = req.body;
    const result = await query(`
      UPDATE achievements
      SET title = COALESCE($1, title),
          category = COALESCE($2, category),
          year = COALESCE($3, year),
          date_awarded = COALESCE($4, date_awarded),
          awarding_organization = COALESCE($5, awarding_organization),
          description = COALESCE($6, description),
          cover_image_url = COALESCE($7, cover_image_url),
          supporting_images = COALESCE($8, supporting_images),
          evidence_url = COALESCE($9, evidence_url),
          is_featured = COALESCE($10, is_featured),
          status = COALESCE($11, status),
          sort_order = COALESCE($12, sort_order)
      WHERE id = $13
      RETURNING *
    `, [
      title, category, year, date_awarded, awarding_organization, description,
      cover_image_url, supporting_images ? JSON.stringify(supporting_images) : null,
      evidence_url, is_featured, status, sort_order, id
    ]);
    if (result.rowCount === 0) {
      res.status(404).json({ success: false, message: 'Achievement not found.' });
      return;
    }
    res.json({ success: true, achievement: result.rows[0], message: 'Achievement updated successfully.' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Failed to update achievement.' });
  }
};

export const deleteAchievement = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await query('DELETE FROM achievements WHERE id = $1', [id]);
    res.json({ success: true, message: 'Achievement deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete achievement.' });
  }
};

// --- Events Management ---
export const listEvents = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const result = await query('SELECT * FROM events ORDER BY start_date DESC');
    res.json({ success: true, events: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to list events.' });
  }
};

export const createEvent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { title, slug, description, event_type, start_date, end_date, location, cover_image_url, registration_url, is_featured, status } = req.body;
    const cleanSlug = slug || title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const result = await query(`
      INSERT INTO events (
        title, slug, description, event_type, start_date, end_date, location, cover_image_url, registration_url, is_featured, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      title, cleanSlug, description, event_type || 'competition', start_date, end_date || null,
      location, cover_image_url, registration_url, is_featured ?? false, status || 'upcoming'
    ]);
    res.status(201).json({ success: true, event: result.rows[0], message: 'Event created successfully.' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Failed to create event.' });
  }
};

export const updateEvent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, slug, description, event_type, start_date, end_date, location, cover_image_url, registration_url, is_featured, status } = req.body;
    const result = await query(`
      UPDATE events
      SET title = COALESCE($1, title),
          slug = COALESCE($2, slug),
          description = COALESCE($3, description),
          event_type = COALESCE($4, event_type),
          start_date = COALESCE($5, start_date),
          end_date = COALESCE($6, end_date),
          location = COALESCE($7, location),
          cover_image_url = COALESCE($8, cover_image_url),
          registration_url = COALESCE($9, registration_url),
          is_featured = COALESCE($10, is_featured),
          status = COALESCE($11, status)
      WHERE id = $12
      RETURNING *
    `, [
      title, slug, description, event_type, start_date, end_date, location,
      cover_image_url, registration_url, is_featured, status, id
    ]);
    if (result.rowCount === 0) {
      res.status(404).json({ success: false, message: 'Event not found.' });
      return;
    }
    res.json({ success: true, event: result.rows[0], message: 'Event updated successfully.' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Failed to update event.' });
  }
};

export const deleteEvent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await query('DELETE FROM events WHERE id = $1', [id]);
    res.json({ success: true, message: 'Event deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete event.' });
  }
};

// --- News / Blog Management ---
export const listNews = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const result = await query('SELECT * FROM news_articles ORDER BY created_at DESC');
    res.json({ success: true, articles: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to list news articles.' });
  }
};

export const createNews = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { title, slug, summary, content, category, tags, cover_image_url, is_featured, status } = req.body;
    const cleanSlug = slug || title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const authorId = req.user?.id || null;
    const result = await query(`
      INSERT INTO news_articles (
        title, slug, summary, content, category, tags, cover_image_url, author_id, status, is_featured, published_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
      RETURNING *
    `, [
      title, cleanSlug, summary, content, category || 'News', tags || '',
      cover_image_url, authorId, status || 'published', is_featured ?? false
    ]);
    res.status(201).json({ success: true, article: result.rows[0], message: 'Article created successfully.' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Failed to create article.' });
  }
};

export const updateNews = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, slug, summary, content, category, tags, cover_image_url, is_featured, status } = req.body;
    const result = await query(`
      UPDATE news_articles
      SET title = COALESCE($1, title),
          slug = COALESCE($2, slug),
          summary = COALESCE($3, summary),
          content = COALESCE($4, content),
          category = COALESCE($5, category),
          tags = COALESCE($6, tags),
          cover_image_url = COALESCE($7, cover_image_url),
          is_featured = COALESCE($8, is_featured),
          status = COALESCE($9, status),
          updated_at = NOW()
      WHERE id = $10
      RETURNING *
    `, [title, slug, summary, content, category, tags, cover_image_url, is_featured, status, id]);
    if (result.rowCount === 0) {
      res.status(404).json({ success: false, message: 'Article not found.' });
      return;
    }
    res.json({ success: true, article: result.rows[0], message: 'Article updated successfully.' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Failed to update article.' });
  }
};

export const deleteNews = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await query('DELETE FROM news_articles WHERE id = $1', [id]);
    res.json({ success: true, message: 'Article deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete article.' });
  }
};

// --- Heritage Projects Management ---
export const listHeritage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const result = await query('SELECT * FROM heritage_projects ORDER BY year DESC, created_at DESC');
    res.json({ success: true, projects: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to list heritage projects.' });
  }
};

export const createHeritage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { title, slug, organization, year, overview, cultural_significance, full_content, cover_image_url, document_url, is_featured } = req.body;
    const cleanSlug = slug || title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const result = await query(`
      INSERT INTO heritage_projects (
        title, slug, organization, year, overview, cultural_significance, full_content, cover_image_url, document_url, is_featured
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [title, cleanSlug, organization, year, overview, cultural_significance, full_content, cover_image_url, document_url, is_featured ?? false]);
    res.status(201).json({ success: true, project: result.rows[0], message: 'Heritage project created successfully.' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Failed to create heritage project.' });
  }
};

export const updateHeritage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, slug, organization, year, overview, cultural_significance, full_content, cover_image_url, document_url, is_featured } = req.body;
    const result = await query(`
      UPDATE heritage_projects
      SET title = COALESCE($1, title),
          slug = COALESCE($2, slug),
          organization = COALESCE($3, organization),
          year = COALESCE($4, year),
          overview = COALESCE($5, overview),
          cultural_significance = COALESCE($6, cultural_significance),
          full_content = COALESCE($7, full_content),
          cover_image_url = COALESCE($8, cover_image_url),
          document_url = COALESCE($9, document_url),
          is_featured = COALESCE($10, is_featured)
      WHERE id = $11
      RETURNING *
    `, [title, slug, organization, year, overview, cultural_significance, full_content, cover_image_url, document_url, is_featured, id]);
    if (result.rowCount === 0) {
      res.status(404).json({ success: false, message: 'Heritage project not found.' });
      return;
    }
    res.json({ success: true, project: result.rows[0], message: 'Heritage project updated successfully.' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Failed to update heritage project.' });
  }
};

export const deleteHeritage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await query('DELETE FROM heritage_projects WHERE id = $1', [id]);
    res.json({ success: true, message: 'Heritage project deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete heritage project.' });
  }
};

// --- Partners & Press Management ---
export const listPartnersPress = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const result = await query('SELECT * FROM partners_press ORDER BY publication_date DESC, created_at DESC');
    res.json({ success: true, items: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to list partners and press.' });
  }
};

export const createPartnersPress = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { title, entity_type, organization_name, publication_date, quote_or_excerpt, article_url, logo_or_image_url, is_featured } = req.body;
    const result = await query(`
      INSERT INTO partners_press (
        title, entity_type, organization_name, publication_date, quote_or_excerpt, article_url, logo_or_image_url, is_featured
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [title, entity_type || 'press', organization_name, publication_date || null, quote_or_excerpt, article_url, logo_or_image_url, is_featured ?? false]);
    res.status(201).json({ success: true, item: result.rows[0], message: 'Item created successfully.' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Failed to create partner/press item.' });
  }
};

export const updatePartnersPress = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, entity_type, organization_name, publication_date, quote_or_excerpt, article_url, logo_or_image_url, is_featured } = req.body;
    const result = await query(`
      UPDATE partners_press
      SET title = COALESCE($1, title),
          entity_type = COALESCE($2, entity_type),
          organization_name = COALESCE($3, organization_name),
          publication_date = COALESCE($4, publication_date),
          quote_or_excerpt = COALESCE($5, quote_or_excerpt),
          article_url = COALESCE($6, article_url),
          logo_or_image_url = COALESCE($7, logo_or_image_url),
          is_featured = COALESCE($8, is_featured)
      WHERE id = $9
      RETURNING *
    `, [title, entity_type, organization_name, publication_date, quote_or_excerpt, article_url, logo_or_image_url, is_featured, id]);
    if (result.rowCount === 0) {
      res.status(404).json({ success: false, message: 'Item not found.' });
      return;
    }
    res.json({ success: true, item: result.rows[0], message: 'Item updated successfully.' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Failed to update partner/press item.' });
  }
};

export const deletePartnersPress = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await query('DELETE FROM partners_press WHERE id = $1', [id]);
    res.json({ success: true, message: 'Item deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete item.' });
  }
};

// --- Albums & Media Assets Management ---
export const listAlbums = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const result = await query(`
      SELECT a.*, COUNT(m.id)::int as photo_count
      FROM albums a
      LEFT JOIN media_assets m ON m.album_id = a.id
      GROUP BY a.id
      ORDER BY a.sort_order ASC
    `);
    res.json({ success: true, albums: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to list albums.' });
  }
};

export const createAlbum = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { title, slug, description, category, sort_order, is_published } = req.body;
    const cleanSlug = slug || title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const result = await query(`
      INSERT INTO albums (title, slug, description, category, sort_order, is_published)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [title, cleanSlug, description, category || 'general', sort_order || 0, is_published ?? true]);
    res.status(201).json({ success: true, album: result.rows[0], message: 'Album created successfully.' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Failed to create album.' });
  }
};

export const updateAlbum = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, slug, description, category, sort_order, is_published } = req.body;
    const result = await query(`
      UPDATE albums
      SET title = COALESCE($1, title),
          slug = COALESCE($2, slug),
          description = COALESCE($3, description),
          category = COALESCE($4, category),
          sort_order = COALESCE($5, sort_order),
          is_published = COALESCE($6, is_published)
      WHERE id = $7
      RETURNING *
    `, [title, slug, description, category, sort_order, is_published, id]);
    if (result.rowCount === 0) {
      res.status(404).json({ success: false, message: 'Album not found.' });
      return;
    }
    res.json({ success: true, album: result.rows[0], message: 'Album updated successfully.' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Failed to update album.' });
  }
};

export const deleteAlbum = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await query('DELETE FROM albums WHERE id = $1', [id]);
    res.json({ success: true, message: 'Album deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete album.' });
  }
};

// --- Multi-File Media Upload & Reference Tracking ---
export const uploadMedia = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ success: false, message: 'No files provided for upload.' });
      return;
    }

    const { album_id, caption, alt_text } = req.body;
    const uploadedAssets = [];

    for (const f of files) {
      const filePath = `/uploads/${f.filename}`;
      const insertRes = await query(`
        INSERT INTO media_assets (
          file_name, original_name, file_path, mime_type, file_size, alt_text, caption, album_id, is_featured
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, false)
        RETURNING *
      `, [
        f.filename,
        f.originalname,
        filePath,
        f.mimetype,
        f.size,
        alt_text || f.originalname,
        caption || '',
        album_id || null
      ]);
      uploadedAssets.push(insertRes.rows[0]);
    }

    res.status(201).json({
      success: true,
      message: `Successfully uploaded ${uploadedAssets.length} media asset(s).`,
      media: uploadedAssets
    });
  } catch (error: any) {
    console.error('uploadMedia error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to upload media files.' });
  }
};

export const listMediaAssets = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { albumId, search } = req.query;
    let sql = `
      SELECT m.*, a.title as album_title,
             (SELECT COUNT(*)::int FROM media_references r WHERE r.media_id = m.id) as reference_count
      FROM media_assets m
      LEFT JOIN albums a ON m.album_id = a.id
    `;
    const params: any[] = [];

    if (albumId) {
      params.push(albumId);
      sql += ` WHERE m.album_id = $${params.length}`;
    }
    if (search) {
      params.push(`%${search}%`);
      sql += (params.length === 1 ? ' WHERE' : ' AND') + ` (m.original_name ILIKE $${params.length} OR m.caption ILIKE $${params.length})`;
    }

    sql += ` ORDER BY m.created_at DESC`;

    const result = await query(sql, params);
    res.json({ success: true, media: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to list media assets.' });
  }
};

export const updateMediaAsset = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { alt_text, caption, album_id, is_featured } = req.body;
    const result = await query(`
      UPDATE media_assets
      SET alt_text = COALESCE($1, alt_text),
          caption = COALESCE($2, caption),
          album_id = COALESCE($3, album_id),
          is_featured = COALESCE($4, is_featured)
      WHERE id = $5
      RETURNING *
    `, [alt_text, caption, album_id, is_featured, id]);
    if (result.rowCount === 0) {
      res.status(404).json({ success: false, message: 'Media asset not found.' });
      return;
    }
    res.json({ success: true, media: result.rows[0], message: 'Media asset updated successfully.' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Failed to update media asset.' });
  }
};

export const getMediaReferences = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const refs = await query('SELECT * FROM media_references WHERE media_id = $1', [id]);
    res.json({ success: true, references: refs.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to check media references.' });
  }
};

export const deleteMediaAsset = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { force } = req.query;

    // Check active references
    const refs = await query('SELECT * FROM media_references WHERE media_id = $1', [id]);
    if (refs.rowCount && refs.rowCount > 0 && force !== 'true') {
      res.status(400).json({
        success: false,
        message: `This image is currently referenced in ${refs.rowCount} place(s). Use force=true to delete anyway.`,
        referenceCount: refs.rowCount
      });
      return;
    }

    const mediaRes = await query('SELECT file_name FROM media_assets WHERE id = $1', [id]);
    if (mediaRes.rowCount === 0) {
      res.status(404).json({ success: false, message: 'Media asset not found.' });
      return;
    }

    const fileName = mediaRes.rows[0].file_name;
    await query('DELETE FROM media_assets WHERE id = $1', [id]);

    // Attempt to unlink physical file if exists in uploads
    const diskPath = path.resolve(__dirname, '../../uploads', fileName);
    if (fs.existsSync(diskPath)) {
      try {
        fs.unlinkSync(diskPath);
      } catch (err) {
        console.warn('Could not unlink physical file:', diskPath);
      }
    }

    res.json({ success: true, message: 'Media asset deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete media asset.' });
  }
};

// --- Enquiries Management ---
export const listEnquiries = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { status, type, search } = req.query;
    let sql = 'SELECT * FROM enquiries';
    const params: any[] = [];
    const conditions: string[] = [];

    if (status) {
      params.push(status);
      conditions.push(`status = $${params.length}`);
    }
    if (type) {
      params.push(type);
      conditions.push(`enquiry_type = $${params.length}`);
    }
    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(full_name ILIKE $${params.length} OR email ILIKE $${params.length} OR phone ILIKE $${params.length})`);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY created_at DESC';

    const result = await query(sql, params);
    res.json({ success: true, enquiries: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to list enquiries.' });
  }
};

export const updateEnquiry = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;
    const result = await query(`
      UPDATE enquiries
      SET status = COALESCE($1, status),
          admin_notes = COALESCE($2, admin_notes),
          updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `, [status, admin_notes, id]);
    if (result.rowCount === 0) {
      res.status(404).json({ success: false, message: 'Enquiry not found.' });
      return;
    }
    res.json({ success: true, enquiry: result.rows[0], message: 'Enquiry updated successfully.' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Failed to update enquiry.' });
  }
};

export const deleteEnquiry = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await query('DELETE FROM enquiries WHERE id = $1', [id]);
    res.json({ success: true, message: 'Enquiry deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete enquiry.' });
  }
};
