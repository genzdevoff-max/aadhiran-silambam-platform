"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sectionUpdateSchema = exports.joinEnquirySchema = exports.contactEnquirySchema = exports.updateUserSchema = exports.createUserSchema = exports.changePasswordSchema = exports.loginSchema = exports.validateBody = void 0;
const zod_1 = require("zod");
const validateBody = (schema) => async (req, res, next) => {
    try {
        req.body = await schema.parseAsync(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: error.errors.map((e) => ({
                    field: e.path.join('.'),
                    message: e.message,
                })),
            });
            return;
        }
        next(error);
    }
};
exports.validateBody = validateBody;
// Auth Schemas
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().trim().email('Valid email address is required'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
exports.changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1, 'Current password is required'),
    newPassword: zod_1.z.string().min(8, 'New password must be at least 8 characters long'),
});
exports.createUserSchema = zod_1.z.object({
    email: zod_1.z.string().trim().email('Valid email address is required'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters long'),
    fullName: zod_1.z.string().trim().min(2, 'Full name must be at least 2 characters'),
    role: zod_1.z.enum(['super_admin', 'editor']).default('editor'),
});
exports.updateUserSchema = zod_1.z.object({
    fullName: zod_1.z.string().trim().min(2).optional(),
    role: zod_1.z.enum(['super_admin', 'editor']).optional(),
    isActive: zod_1.z.boolean().optional(),
    newPassword: zod_1.z.string().min(8).optional(),
});
// Public Form Schemas
exports.contactEnquirySchema = zod_1.z.object({
    fullName: zod_1.z.string().trim().min(2, 'Full name must be at least 2 characters').max(100),
    email: zod_1.z.string().trim().email('Valid email is required'),
    phone: zod_1.z.string().trim().min(5, 'Valid phone number is required').max(30),
    message: zod_1.z.string().trim().min(5, 'Message must be at least 5 characters').max(3000),
});
exports.joinEnquirySchema = zod_1.z.object({
    fullName: zod_1.z.string().trim().min(2, 'Full name must be at least 2 characters').max(100),
    email: zod_1.z.string().trim().email('Valid email is required'),
    phone: zod_1.z.string().trim().min(5, 'Valid phone number is required').max(30),
    ageGroup: zod_1.z.string().optional(),
    experienceLevel: zod_1.z.string().optional(),
    preferredLocation: zod_1.z.string().optional(),
    message: zod_1.z.string().max(3000).optional(),
});
// Section Update Schema
exports.sectionUpdateSchema = zod_1.z.object({
    value: zod_1.z.any().refine((val) => val !== undefined && val !== null, {
        message: 'Value payload is required',
    }),
});
