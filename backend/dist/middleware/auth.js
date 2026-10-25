"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSuperAdmin = exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../config/db");
const security_1 = require("../config/security");
const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
            return;
        }
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, (0, security_1.getJwtSecret)());
        const userRes = await (0, db_1.query)('SELECT id, email, role, full_name, is_active FROM users WHERE id = $1', [decoded.id]);
        if (userRes.rowCount === 0 || !userRes.rows[0].is_active) {
            res.status(401).json({ success: false, message: 'Invalid token or inactive user account.' });
            return;
        }
        req.user = {
            id: userRes.rows[0].id,
            email: userRes.rows[0].email,
            role: userRes.rows[0].role,
            fullName: userRes.rows[0].full_name
        };
        next();
    }
    catch (error) {
        res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
    }
};
exports.requireAuth = requireAuth;
const requireSuperAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'super_admin') {
        res.status(403).json({ success: false, message: 'Forbidden. Super Admin access required.' });
        return;
    }
    next();
};
exports.requireSuperAdmin = requireSuperAdmin;
