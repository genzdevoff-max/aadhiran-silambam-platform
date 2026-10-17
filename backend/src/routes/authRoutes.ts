import { Router } from 'express';
import { login, getMe, changePassword, listUsers, createUser, updateUser, deleteUser } from '../controllers/authController';
import { requireAuth, requireSuperAdmin } from '../middleware/auth';

const router = Router();

// Public auth
router.post('/login', login);

// Authenticated user
router.get('/me', requireAuth, getMe);
router.post('/change-password', requireAuth, changePassword);

// Super admin user management
router.get('/users', requireAuth, requireSuperAdmin, listUsers);
router.post('/users', requireAuth, requireSuperAdmin, createUser);
router.put('/users/:id', requireAuth, requireSuperAdmin, updateUser);
router.delete('/users/:id', requireAuth, requireSuperAdmin, deleteUser);

export default router;
