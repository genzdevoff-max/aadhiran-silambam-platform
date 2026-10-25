import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError, z } from 'zod';

export const validateBody = (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
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

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().trim().email('Valid email address is required'),
  password: z.string().min(1, 'Password is required'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
});

export const createUserSchema = z.object({
  email: z.string().trim().email('Valid email address is required'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  role: z.enum(['super_admin', 'editor']).default('editor'),
});

export const updateUserSchema = z.object({
  fullName: z.string().trim().min(2).optional(),
  role: z.enum(['super_admin', 'editor']).optional(),
  isActive: z.boolean().optional(),
  newPassword: z.string().min(8).optional(),
});

// Public Form Schemas
export const contactEnquirySchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().trim().email('Valid email is required'),
  phone: z.string().trim().min(5, 'Valid phone number is required').max(30),
  message: z.string().trim().min(5, 'Message must be at least 5 characters').max(3000),
});

export const joinEnquirySchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().trim().email('Valid email is required'),
  phone: z.string().trim().min(5, 'Valid phone number is required').max(30),
  ageGroup: z.string().optional(),
  experienceLevel: z.string().optional(),
  preferredLocation: z.string().optional(),
  message: z.string().max(3000).optional(),
});

// Section Update Schema
export const sectionUpdateSchema = z.object({
  value: z.any().refine((val) => val !== undefined && val !== null, {
    message: 'Value payload is required',
  }),
});

