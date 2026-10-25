import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { upload, validateUploadedFiles } from '../middleware/upload';
import { validateBody, sectionUpdateSchema } from '../middleware/validate';
import {
  getDashboardStats,
  updateSectionSetting,
  listSyllabusStages,
  createSyllabusStage,
  updateSyllabusStage,
  deleteSyllabusStage,
  listInstructors,
  createInstructor,
  updateInstructor,
  deleteInstructor,
  listAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  listEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  listNews,
  createNews,
  updateNews,
  deleteNews,
  listHeritage,
  createHeritage,
  updateHeritage,
  deleteHeritage,
  listPartnersPress,
  createPartnersPress,
  updatePartnersPress,
  deletePartnersPress,
  listAlbums,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  uploadMedia,
  listMediaAssets,
  updateMediaAsset,
  getMediaReferences,
  deleteMediaAsset,
  listEnquiries,
  updateEnquiry,
  deleteEnquiry
} from '../controllers/adminController';

const router = Router();

// Protect all admin routes
router.use(requireAuth);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Sections & Settings
router.put('/sections/:key', validateBody(sectionUpdateSchema), updateSectionSetting);

// Syllabus Stages
router.get('/syllabus', listSyllabusStages);
router.post('/syllabus', createSyllabusStage);
router.put('/syllabus/:id', updateSyllabusStage);
router.delete('/syllabus/:id', deleteSyllabusStage);

// Instructors
router.get('/instructors', listInstructors);
router.post('/instructors', createInstructor);
router.put('/instructors/:id', updateInstructor);
router.delete('/instructors/:id', deleteInstructor);

// Achievements
router.get('/achievements', listAchievements);
router.post('/achievements', createAchievement);
router.put('/achievements/:id', updateAchievement);
router.delete('/achievements/:id', deleteAchievement);

// Events
router.get('/events', listEvents);
router.post('/events', createEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

// News / Blog
router.get('/news', listNews);
router.post('/news', createNews);
router.put('/news/:id', updateNews);
router.delete('/news/:id', deleteNews);

// Heritage Projects
router.get('/heritage', listHeritage);
router.post('/heritage', createHeritage);
router.put('/heritage/:id', updateHeritage);
router.delete('/heritage/:id', deleteHeritage);

// Partners & Press
router.get('/partners', listPartnersPress);
router.post('/partners', createPartnersPress);
router.put('/partners/:id', updatePartnersPress);
router.delete('/partners/:id', deletePartnersPress);

// Photo Albums
router.get('/albums', listAlbums);
router.post('/albums', createAlbum);
router.put('/albums/:id', updateAlbum);
router.delete('/albums/:id', deleteAlbum);

// Media Assets & Uploads
router.post('/media/upload', upload.array('files', 15), validateUploadedFiles, uploadMedia);
router.get('/media', listMediaAssets);
router.put('/media/:id', updateMediaAsset);
router.get('/media/:id/references', getMediaReferences);
router.delete('/media/:id', deleteMediaAsset);

// Enquiries (Contact & Join Training)
router.get('/enquiries', listEnquiries);
router.put('/enquiries/:id', updateEnquiry);
router.delete('/enquiries/:id', deleteEnquiry);

export default router;
