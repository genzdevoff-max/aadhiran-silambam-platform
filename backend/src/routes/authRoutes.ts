import { Router } from 'express';
import {
  login,
  getMe,
  changePassword,
  listUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/authController';
import { requireAuth, requireSuperAdmin } from '../middleware/auth';
import {
  validateBody,
  loginSchema,
  changePasswordSchema,
  createUserSchema,
  updateUserSchema,
} from '../middleware/validate';

const router = Router();

// Public auth with validation
router.post('/login', validateBody(loginSchema), login);

// Authenticated user
router.get('/me', requireAuth, getMe);
router.post('/change-password', requireAuth, validateBody(changePasswordSchema), changePassword);

// Super admin user management
router.get('/users', requireAuth, requireSuperAdmin, listUsers);
router.post('/users', requireAuth, requireSuperAdmin, validateBody(createUserSchema), createUser);
router.put('/users/:id', requireAuth, requireSuperAdmin, validateBody(updateUserSchema), updateUser);
router.delete('/users/:id', requireAuth, requireSuperAdmin, deleteUser);

export default router;
