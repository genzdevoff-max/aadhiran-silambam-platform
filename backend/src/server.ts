import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import dotenv from 'dotenv';
import { checkDatabaseConnection } from './config/db';
import authRoutes from './routes/authRoutes';
import publicRoutes from './routes/publicRoutes';
import adminRoutes from './routes/adminRoutes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS Configuration
const allowedOrigins = [
  process.env.CORS_ORIGIN || 'http://localhost:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow during development
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static media serving
const uploadDir = path.resolve(__dirname, '../uploads');
app.use('/uploads', express.static(uploadDir));

// Rate limiter for public form submissions
const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per IP
  message: { success: false, message: 'Too many enquiry submissions from this IP. Please try again after 15 minutes.' }
});

app.use('/api/public/enquiries', enquiryLimiter);
app.use('/api/public/join-enquiry', enquiryLimiter);
app.use('/api/v1/public/enquiries', enquiryLimiter);
app.use('/api/v1/public/join-enquiry', enquiryLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/v1/auth', authRoutes);

app.use('/api/public', publicRoutes);
app.use('/api/v1/public', publicRoutes);

app.use('/api/admin', adminRoutes);
app.use('/api/v1/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Aadhiran Silambam API',
    version: '1.0.0'
  });
});

// Centralized Error Handler
app.use(errorHandler);

// Start Server
const startServer = async () => {
  const isDbConnected = await checkDatabaseConnection();
  if (!isDbConnected) {
    console.error('CRITICAL: Database connection failed. Verify PostgreSQL configuration.');
  }

  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🗡️  Aadhiran Silambam Backend Server is running!`);
    console.log(`🚀 API Base URL:  http://localhost:${PORT}/api`);
    console.log(`📁 Media Uploads: http://localhost:${PORT}/uploads`);
    console.log(`🔒 Environment:   ${process.env.NODE_ENV || 'development'}`);
    console.log(`=======================================================`);
  });
};

startServer();

export default app;
