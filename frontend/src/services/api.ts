import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to attach JWT bearer token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aadhiran_admin_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercept responses to handle 401 unauthenticated
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If unauthorized on admin route, clear token
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        localStorage.removeItem('aadhiran_admin_token');
        localStorage.removeItem('aadhiran_admin_user');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Public API
export const publicApi = {
  getHome: () => api.get('/public/home').then((r) => r.data.data),
  getAbout: () => api.get('/public/about').then((r) => r.data.data),
  getLineage: () => api.get('/public/lineage').then((r) => r.data.data),
  getSyllabus: () => api.get('/public/syllabus').then((r) => r.data.data),
  getInstructors: () => api.get('/public/instructors').then((r) => r.data.data),
  getAchievements: (params?: { category?: string; year?: string | number }) =>
    api.get('/public/achievements', { params }).then((r) => r.data),
  getAchievementById: (id: string) => api.get(`/public/achievements/${id}`).then((r) => r.data.data),
  getEvents: (params?: { status?: string }) => api.get('/public/events', { params }).then((r) => r.data.data),
  getEventBySlug: (slug: string) => api.get(`/public/events/${slug}`).then((r) => r.data.data),
  getAlbums: () => api.get('/public/albums').then((r) => r.data.data),
  getPhotos: (albumSlug?: string) => api.get('/public/photos', { params: { albumSlug } }).then((r) => r.data.data),
  getVideos: () => api.get('/public/videos').then((r) => r.data.data),
  getNews: (params?: { category?: string; tag?: string }) => api.get('/public/news', { params }).then((r) => r.data.data),
  getNewsBySlug: (slug: string) => api.get(`/public/news/${slug}`).then((r) => r.data.data),
  getHeritage: () => api.get('/public/heritage').then((r) => r.data.data),
  getHeritageBySlug: (slug: string) => api.get(`/public/heritage/${slug}`).then((r) => r.data.data),
  getPartnersPress: () => api.get('/public/partners-press').then((r) => r.data.data),
  getSettings: () => api.get('/public/settings').then((r) => r.data.data),
  submitContact: (data: any) => api.post('/public/enquiries', data).then((r) => r.data),
  submitJoin: (data: any) => api.post('/public/join-enquiry', data).then((r) => r.data),
};

// Admin API
export const adminApi = {
  // Auth
  login: (credentials: { email: string; password: string }) => api.post('/auth/login', credentials).then((r) => r.data),
  getMe: () => api.get('/auth/me').then((r) => r.data.user),
  changePassword: (data: any) => api.post('/auth/change-password', data).then((r) => r.data),
  listUsers: () => api.get('/auth/users').then((r) => r.data.users),
  createUser: (data: any) => api.post('/auth/users', data).then((r) => r.data),
  updateUser: (id: string, data: any) => api.put(`/auth/users/${id}`, data).then((r) => r.data),
  deleteUser: (id: string) => api.delete(`/auth/users/${id}`).then((r) => r.data),

  // Dashboard
  getDashboard: () => api.get('/admin/dashboard').then((r) => r.data),

  // Sections
  updateSection: (key: string, value: any) => api.put(`/admin/sections/${key}`, { value }).then((r) => r.data),

  // Syllabus
  getSyllabus: () => api.get('/admin/syllabus').then((r) => r.data.stages),
  createStage: (data: any) => api.post('/admin/syllabus', data).then((r) => r.data),
  updateStage: (id: string, data: any) => api.put(`/admin/syllabus/${id}`, data).then((r) => r.data),
  deleteStage: (id: string) => api.delete(`/admin/syllabus/${id}`).then((r) => r.data),

  // Instructors
  getInstructors: () => api.get('/admin/instructors').then((r) => r.data.instructors),
  createInstructor: (data: any) => api.post('/admin/instructors', data).then((r) => r.data),
  updateInstructor: (id: string, data: any) => api.put(`/admin/instructors/${id}`, data).then((r) => r.data),
  deleteInstructor: (id: string) => api.delete(`/admin/instructors/${id}`).then((r) => r.data),

  // Achievements
  getAchievements: () => api.get('/admin/achievements').then((r) => r.data.achievements),
  createAchievement: (data: any) => api.post('/admin/achievements', data).then((r) => r.data),
  updateAchievement: (id: string, data: any) => api.put(`/admin/achievements/${id}`, data).then((r) => r.data),
  deleteAchievement: (id: string) => api.delete(`/admin/achievements/${id}`).then((r) => r.data),

  // Events
  getEvents: () => api.get('/admin/events').then((r) => r.data.events),
  createEvent: (data: any) => api.post('/admin/events', data).then((r) => r.data),
  updateEvent: (id: string, data: any) => api.put(`/admin/events/${id}`, data).then((r) => r.data),
  deleteEvent: (id: string) => api.delete(`/admin/events/${id}`).then((r) => r.data),

  // News
  getNews: () => api.get('/admin/news').then((r) => r.data.articles),
  createNews: (data: any) => api.post('/admin/news', data).then((r) => r.data),
  updateNews: (id: string, data: any) => api.put(`/admin/news/${id}`, data).then((r) => r.data),
  deleteNews: (id: string) => api.delete(`/admin/news/${id}`).then((r) => r.data),

  // Heritage
  getHeritage: () => api.get('/admin/heritage').then((r) => r.data.projects),
  createHeritage: (data: any) => api.post('/admin/heritage', data).then((r) => r.data),
  updateHeritage: (id: string, data: any) => api.put(`/admin/heritage/${id}`, data).then((r) => r.data),
  deleteHeritage: (id: string) => api.delete(`/admin/heritage/${id}`).then((r) => r.data),

  // Partners
  getPartners: () => api.get('/admin/partners').then((r) => r.data.items),
  createPartner: (data: any) => api.post('/admin/partners', data).then((r) => r.data),
  updatePartner: (id: string, data: any) => api.put(`/admin/partners/${id}`, data).then((r) => r.data),
  deletePartner: (id: string) => api.delete(`/admin/partners/${id}`).then((r) => r.data),

  // Albums
  getAlbums: () => api.get('/admin/albums').then((r) => r.data.albums),
  createAlbum: (data: any) => api.post('/admin/albums', data).then((r) => r.data),
  updateAlbum: (id: string, data: any) => api.put(`/admin/albums/${id}`, data).then((r) => r.data),
  deleteAlbum: (id: string) => api.delete(`/admin/albums/${id}`).then((r) => r.data),

  // Media
  getMedia: (params?: { albumId?: string; search?: string }) => api.get('/admin/media', { params }).then((r) => r.data.media),
  uploadMedia: (formData: FormData) =>
    api.post('/admin/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),
  updateMedia: (id: string, data: any) => api.put(`/admin/media/${id}`, data).then((r) => r.data),
  getMediaReferences: (id: string) => api.get(`/admin/media/${id}/references`).then((r) => r.data.references),
  deleteMedia: (id: string, force = false) =>
    api.delete(`/admin/media/${id}`, { params: { force } }).then((r) => r.data),

  // Enquiries
  getEnquiries: (params?: { status?: string; type?: string; search?: string }) =>
    api.get('/admin/enquiries', { params }).then((r) => r.data.enquiries),
  updateEnquiry: (id: string, data: any) => api.put(`/admin/enquiries/${id}`, data).then((r) => r.data),
  deleteEnquiry: (id: string) => api.delete(`/admin/enquiries/${id}`).then((r) => r.data),
};
