"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const router = (0, express_1.Router)();
// Public auth with validation
router.post('/login', (0, validate_1.validateBody)(validate_1.loginSchema), authController_1.login);
// Authenticated user
router.get('/me', auth_1.requireAuth, authController_1.getMe);
router.post('/change-password', auth_1.requireAuth, (0, validate_1.validateBody)(validate_1.changePasswordSchema), authController_1.changePassword);
// Super admin user management
router.get('/users', auth_1.requireAuth, auth_1.requireSuperAdmin, authController_1.listUsers);
router.post('/users', auth_1.requireAuth, auth_1.requireSuperAdmin, (0, validate_1.validateBody)(validate_1.createUserSchema), authController_1.createUser);
router.put('/users/:id', auth_1.requireAuth, auth_1.requireSuperAdmin, (0, validate_1.validateBody)(validate_1.updateUserSchema), authController_1.updateUser);
router.delete('/users/:id', auth_1.requireAuth, auth_1.requireSuperAdmin, authController_1.deleteUser);
exports.default = router;
