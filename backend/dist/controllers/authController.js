"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.listUsers = exports.changePassword = exports.getMe = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../config/db");
const security_1 = require("../config/security");
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ success: false, message: 'Email and password are required.' });
            return;
        }
        const userRes = await (0, db_1.query)('SELECT id, email, password_hash, full_name, role, is_active FROM users WHERE LOWER(email) = LOWER($1)', [email.trim()]);
        if (userRes.rowCount === 0) {
            res.status(401).json({ success: false, message: 'Invalid email or password.' });
            return;
        }
        const user = userRes.rows[0];
        if (!user.is_active) {
            res.status(401).json({ success: false, message: 'Invalid email or password.' });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!isMatch) {
            res.status(401).json({ success: false, message: 'Invalid email or password.' });
            return;
        }
        // Update last login
        await (0, db_1.query)('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role, fullName: user.full_name }, (0, security_1.getJwtSecret)(), { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') });
        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.full_name,
                role: user.role
            }
        });
    }
    catch {
        console.error('Login request failed.');
        res.status(500).json({ success: false, message: 'Server error during login.' });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const userRes = await (0, db_1.query)('SELECT id, email, full_name, role, created_at, last_login FROM users WHERE id = $1', [req.user.id]);
        if (userRes.rowCount === 0) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        const u = userRes.rows[0];
        res.json({
            success: true,
            user: {
                id: u.id,
                email: u.email,
                fullName: u.full_name,
                role: u.role,
                createdAt: u.created_at,
                lastLogin: u.last_login
            }
        });
    }
    catch {
        console.error('Profile request failed.');
        res.status(500).json({ success: false, message: 'Failed to retrieve user profile.' });
    }
};
exports.getMe = getMe;
const changePassword = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            res.status(400).json({ success: false, message: 'Current and new password are required.' });
            return;
        }
        if (newPassword.length < 8) {
            res.status(400).json({ success: false, message: 'New password must be at least 8 characters long.' });
            return;
        }
        const userRes = await (0, db_1.query)('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
        if (userRes.rowCount === 0) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(currentPassword, userRes.rows[0].password_hash);
        if (!isMatch) {
            res.status(400).json({ success: false, message: 'Current password is incorrect.' });
            return;
        }
        const newHash = await bcryptjs_1.default.hash(newPassword, 10);
        await (0, db_1.query)('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [newHash, req.user.id]);
        res.json({ success: true, message: 'Password updated successfully.' });
    }
    catch {
        console.error('Password change request failed.');
        res.status(500).json({ success: false, message: 'Failed to update password.' });
    }
};
exports.changePassword = changePassword;
const listUsers = async (req, res) => {
    try {
        const usersRes = await (0, db_1.query)('SELECT id, email, full_name, role, is_active, last_login, created_at FROM users ORDER BY created_at ASC');
        res.json({ success: true, users: usersRes.rows });
    }
    catch (error) {
        console.error('listUsers error:', error);
        res.status(500).json({ success: false, message: 'Failed to list admin users.' });
    }
};
exports.listUsers = listUsers;
const createUser = async (req, res) => {
    try {
        const { email, password, fullName, role } = req.body;
        if (!email || !password || !fullName) {
            res.status(400).json({ success: false, message: 'Email, password, and full name are required.' });
            return;
        }
        const existing = await (0, db_1.query)('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [email.trim()]);
        if (existing.rowCount && existing.rowCount > 0) {
            res.status(400).json({ success: false, message: 'A user with this email already exists.' });
            return;
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const newRole = role === 'super_admin' ? 'super_admin' : 'editor';
        const insertRes = await (0, db_1.query)(`INSERT INTO users (email, password_hash, full_name, role, is_active)
       VALUES ($1, $2, $3, $4, true)
       RETURNING id, email, full_name, role, is_active, created_at`, [email.trim().toLowerCase(), passwordHash, fullName.trim(), newRole]);
        res.status(201).json({ success: true, user: insertRes.rows[0], message: 'Admin user created successfully.' });
    }
    catch (error) {
        console.error('createUser error:', error);
        res.status(500).json({ success: false, message: 'Failed to create user.' });
    }
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, role, isActive, newPassword } = req.body;
        let updateQuery = `
      UPDATE users 
      SET full_name = COALESCE($1, full_name),
          role = COALESCE($2, role),
          is_active = COALESCE($3, is_active),
          updated_at = NOW()
    `;
        const params = [fullName, role, isActive];
        if (newPassword && newPassword.length >= 8) {
            const hash = await bcryptjs_1.default.hash(newPassword, 10);
            params.push(hash);
            updateQuery += `, password_hash = $${params.length}`;
        }
        params.push(id);
        updateQuery += ` WHERE id = $${params.length} RETURNING id, email, full_name, role, is_active, updated_at`;
        const result = await (0, db_1.query)(updateQuery, params);
        if (result.rowCount === 0) {
            res.status(404).json({ success: false, message: 'User not found.' });
            return;
        }
        res.json({ success: true, user: result.rows[0], message: 'User updated successfully.' });
    }
    catch (error) {
        console.error('updateUser error:', error);
        res.status(500).json({ success: false, message: 'Failed to update user.' });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user && req.user.id === id) {
            res.status(400).json({ success: false, message: 'You cannot delete your own admin account.' });
            return;
        }
        const result = await (0, db_1.query)('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
        if (result.rowCount === 0) {
            res.status(404).json({ success: false, message: 'User not found.' });
            return;
        }
        res.json({ success: true, message: 'User deleted successfully.' });
    }
    catch (error) {
        console.error('deleteUser error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete user.' });
    }
};
exports.deleteUser = deleteUser;
