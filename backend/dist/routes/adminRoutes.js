"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const adminController_1 = require("../controllers/adminController");
const router = (0, express_1.Router)();
// Protect all admin routes
router.use(auth_1.requireAuth);
// Dashboard
router.get('/dashboard', adminController_1.getDashboardStats);
// Sections & Settings
router.put('/sections/:key', adminController_1.updateSectionSetting);
// Syllabus Stages
router.get('/syllabus', adminController_1.listSyllabusStages);
router.post('/syllabus', adminController_1.createSyllabusStage);
router.put('/syllabus/:id', adminController_1.updateSyllabusStage);
router.delete('/syllabus/:id', adminController_1.deleteSyllabusStage);
// Instructors
router.get('/instructors', adminController_1.listInstructors);
router.post('/instructors', adminController_1.createInstructor);
router.put('/instructors/:id', adminController_1.updateInstructor);
router.delete('/instructors/:id', adminController_1.deleteInstructor);
// Achievements
router.get('/achievements', adminController_1.listAchievements);
router.post('/achievements', adminController_1.createAchievement);
router.put('/achievements/:id', adminController_1.updateAchievement);
router.delete('/achievements/:id', adminController_1.deleteAchievement);
// Events
router.get('/events', adminController_1.listEvents);
router.post('/events', adminController_1.createEvent);
router.put('/events/:id', adminController_1.updateEvent);
router.delete('/events/:id', adminController_1.deleteEvent);
// News / Blog
router.get('/news', adminController_1.listNews);
router.post('/news', adminController_1.createNews);
router.put('/news/:id', adminController_1.updateNews);
router.delete('/news/:id', adminController_1.deleteNews);
// Heritage Projects
router.get('/heritage', adminController_1.listHeritage);
router.post('/heritage', adminController_1.createHeritage);
router.put('/heritage/:id', adminController_1.updateHeritage);
router.delete('/heritage/:id', adminController_1.deleteHeritage);
// Partners & Press
router.get('/partners', adminController_1.listPartnersPress);
router.post('/partners', adminController_1.createPartnersPress);
router.put('/partners/:id', adminController_1.updatePartnersPress);
router.delete('/partners/:id', adminController_1.deletePartnersPress);
// Photo Albums
router.get('/albums', adminController_1.listAlbums);
router.post('/albums', adminController_1.createAlbum);
router.put('/albums/:id', adminController_1.updateAlbum);
router.delete('/albums/:id', adminController_1.deleteAlbum);
// Media Assets & Uploads
router.post('/media/upload', upload_1.upload.array('files', 15), adminController_1.uploadMedia);
router.get('/media', adminController_1.listMediaAssets);
router.put('/media/:id', adminController_1.updateMediaAsset);
router.get('/media/:id/references', adminController_1.getMediaReferences);
router.delete('/media/:id', adminController_1.deleteMediaAsset);
// Enquiries (Contact & Join Training)
router.get('/enquiries', adminController_1.listEnquiries);
router.put('/enquiries/:id', adminController_1.updateEnquiry);
router.delete('/enquiries/:id', adminController_1.deleteEnquiry);
exports.default = router;
