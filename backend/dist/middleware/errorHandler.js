"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, _req, res, _next) => {
    console.error('[API Error]', {
        name: typeof err?.name === 'string' ? err.name : 'UnknownError',
        statusCode: err?.name === 'MulterError'
            ? 400
            : typeof err?.statusCode === 'number'
                ? err.statusCode
                : 500,
    });
    if (err.name === 'MulterError') {
        const message = err.code === 'LIMIT_FILE_SIZE'
            ? 'Upload rejected because a file exceeds the configured size limit.'
            : err.code === 'LIMIT_FILE_COUNT' || err.code === 'LIMIT_UNEXPECTED_FILE'
                ? 'Upload rejected because the configured file-count limit was exceeded.'
                : 'Upload rejected. Check the selected files and try again.';
        res.status(400).json({
            success: false,
            message,
        });
        return;
    }
    if (err.name === 'UploadValidationError') {
        res.status(400).json({ success: false, message: err.message });
        return;
    }
    if (err.name === 'ZodError') {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: err.errors,
        });
        return;
    }
    const statusCode = err.statusCode || 500;
    const isProduction = process.env.NODE_ENV === 'production';
    // Prevent information disclosure in production for 500 server errors
    const safeMessage = statusCode >= 500 && isProduction
        ? 'An unexpected internal server error occurred.'
        : err.message || 'An unexpected internal server error occurred.';
    res.status(statusCode).json({
        success: false,
        message: safeMessage,
    });
};
exports.errorHandler = errorHandler;
