import { Router } from 'express';
import {
  getHomeContent,
  getAboutContent,
  getLineage,
  getSyllabus,
  getInstructors,
  getAchievements,
  getAchievementById,
  getEvents,
  getEventBySlug,
  getAlbums,
  getPhotos,
  getVideos,
  getNews,
  getNewsBySlug,
  getHeritageProjects,
  getHeritageBySlug,
  getPartnersPress,
  getSettings,
  submitContactEnquiry,
  submitJoinEnquiry
} from '../controllers/publicController';

const router = Router();

router.get('/home', getHomeContent);
router.get('/about', getAboutContent);
router.get('/lineage', getLineage);
router.get('/syllabus', getSyllabus);
router.get('/instructors', getInstructors);
router.get('/achievements', getAchievements);
router.get('/achievements/:id', getAchievementById);
router.get('/events', getEvents);
router.get('/events/:slug', getEventBySlug);
router.get('/albums', getAlbums);
router.get('/photos', getPhotos);
router.get('/videos', getVideos);
router.get('/news', getNews);
router.get('/news/:slug', getNewsBySlug);
router.get('/heritage', getHeritageProjects);
router.get('/heritage/:slug', getHeritageBySlug);
router.get('/partners-press', getPartnersPress);
router.get('/settings', getSettings);

// Public form submissions
router.post('/enquiries', submitContactEnquiry);
router.post('/join-enquiry', submitJoinEnquiry);

export default router;
