"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUploadedFiles = exports.upload = exports.createUploadMiddleware = exports.MAX_UPLOAD_FILE_COUNT = exports.MAX_UPLOAD_FILE_SIZE = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const crypto_1 = require("crypto");
const uploadValidation_1 = require("./uploadValidation");
const os_1 = __importDefault(require("os"));
const defaultUploadDir = (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME)
    ? path_1.default.join(os_1.default.tmpdir(), 'uploads')
    : path_1.default.resolve(__dirname, '../../uploads');
const uploadDir = process.env.UPLOAD_DIR
    ? path_1.default.resolve(process.env.UPLOAD_DIR)
    : defaultUploadDir;
exports.MAX_UPLOAD_FILE_SIZE = 100 * 1024 * 1024;
exports.MAX_UPLOAD_FILE_COUNT = 15;
try {
    if (!fs_1.default.existsSync(uploadDir)) {
        fs_1.default.mkdirSync(uploadDir, { recursive: true });
    }
}
catch (err) {
    console.warn('[upload] Warning: Could not create upload directory:', err);
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        try {
            if (!fs_1.default.existsSync(uploadDir)) {
                fs_1.default.mkdirSync(uploadDir, { recursive: true });
            }
            cb(null, uploadDir);
        }
        catch (err) {
            cb(err, '');
        }
    },
    filename: (_req, file, cb) => {
        const extension = (0, uploadValidation_1.getSafeUploadExtension)(file.originalname);
        if (!extension) {
            cb(new uploadValidation_1.UploadValidationError(), '');
            return;
        }
        cb(null, `${(0, crypto_1.randomUUID)()}${extension}`);
    },
});
const fileFilter = (_req, file, cb) => {
    if (!(0, uploadValidation_1.getSafeUploadExtension)(file.originalname)) {
        cb(new uploadValidation_1.UploadValidationError());
        return;
    }
    cb(null, true);
};
const createUploadMiddleware = (limits = {}) => (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: limits.fileSize ?? exports.MAX_UPLOAD_FILE_SIZE,
        files: limits.files ?? exports.MAX_UPLOAD_FILE_COUNT,
    },
});
exports.createUploadMiddleware = createUploadMiddleware;
exports.upload = (0, exports.createUploadMiddleware)();
const validateUploadedFiles = async (req, _res, next) => {
    const files = (req.files || []);
    try {
        for (const file of files) {
            const handle = await fs_1.default.promises.open(file.path, 'r');
            const header = Buffer.alloc(32);
            let bytesRead;
            try {
                ({ bytesRead } = await handle.read(header, 0, header.length, 0));
            }
            finally {
                await handle.close();
            }
            if (!(0, uploadValidation_1.validateMediaFile)(file.originalname, file.mimetype, header.subarray(0, bytesRead))) {
                throw new uploadValidation_1.UploadValidationError();
            }
        }
        next();
    }
    catch (error) {
        const cleanup = await Promise.allSettled(files.map((file) => fs_1.default.promises.unlink(file.path)));
        if (cleanup.some((result) => result.status === 'rejected')) {
            console.error('Failed to remove rejected upload files.');
            next(new Error('Upload cleanup failed.'));
            return;
        }
        next(error);
    }
};
exports.validateUploadedFiles = validateUploadedFiles;
