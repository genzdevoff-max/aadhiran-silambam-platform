"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public auth
router.post('/login', authController_1.login);
// Authenticated user
router.get('/me', auth_1.requireAuth, authController_1.getMe);
router.post('/change-password', auth_1.requireAuth, authController_1.changePassword);
// Super admin user management
router.get('/users', auth_1.requireAuth, auth_1.requireSuperAdmin, authController_1.listUsers);
router.post('/users', auth_1.requireAuth, auth_1.requireSuperAdmin, authController_1.createUser);
router.put('/users/:id', auth_1.requireAuth, auth_1.requireSuperAdmin, authController_1.updateUser);
router.delete('/users/:id', auth_1.requireAuth, auth_1.requireSuperAdmin, authController_1.deleteUser);
exports.default = router;
