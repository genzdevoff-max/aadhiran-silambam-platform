"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const publicRoutes_1 = __importDefault(require("./routes/publicRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Security Middleware
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
// CORS Configuration
const allowedOrigins = [
    process.env.CORS_ORIGIN || 'http://localhost:5173',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000'
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(null, true); // Allow during development
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Body parsing
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Static media serving
const uploadDir = path_1.default.resolve(__dirname, '../uploads');
app.use('/uploads', express_1.default.static(uploadDir));
// Rate limiter for public form submissions
const enquiryLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 requests per IP
    message: { success: false, message: 'Too many enquiry submissions from this IP. Please try again after 15 minutes.' }
});
app.use('/api/public/enquiries', enquiryLimiter);
app.use('/api/public/join-enquiry', enquiryLimiter);
app.use('/api/v1/public/enquiries', enquiryLimiter);
app.use('/api/v1/public/join-enquiry', enquiryLimiter);
// API Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/v1/auth', authRoutes_1.default);
app.use('/api/public', publicRoutes_1.default);
app.use('/api/v1/public', publicRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/v1/admin', adminRoutes_1.default);
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'Aadhiran Silambam API',
        version: '1.0.0'
    });
});
// Centralized Error Handler
app.use(errorHandler_1.errorHandler);
// Start Server
const startServer = async () => {
    const isDbConnected = await (0, db_1.checkDatabaseConnection)();
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
exports.default = app;
