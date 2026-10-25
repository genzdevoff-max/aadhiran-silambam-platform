import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';
import type { NextFunction, Request, Response } from 'express';
import { getSafeUploadExtension, UploadValidationError, validateMediaFile } from './uploadValidation';

const uploadDir = path.resolve(__dirname, '../../uploads');
export const MAX_UPLOAD_FILE_SIZE = 100 * 1024 * 1024;
export const MAX_UPLOAD_FILE_COUNT = 15;
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const extension = getSafeUploadExtension(file.originalname);
    if (!extension) {
      cb(new UploadValidationError(), '');
      return;
    }
    cb(null, `${randomUUID()}${extension}`);
  },
});

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (!getSafeUploadExtension(file.originalname)) {
    cb(new UploadValidationError());
    return;
  }
  cb(null, true);
};

export const createUploadMiddleware = (
  limits: { fileSize?: number; files?: number } = {}
) => multer({
  storage,
  fileFilter,
  limits: {
    fileSize: limits.fileSize ?? MAX_UPLOAD_FILE_SIZE,
    files: limits.files ?? MAX_UPLOAD_FILE_COUNT,
  },
});

export const upload = createUploadMiddleware();

export const validateUploadedFiles = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const files = (req.files || []) as Express.Multer.File[];

  try {
    for (const file of files) {
      const handle = await fs.promises.open(file.path, 'r');
      const header = Buffer.alloc(32);
      let bytesRead: number;
      try {
        ({ bytesRead } = await handle.read(header, 0, header.length, 0));
      } finally {
        await handle.close();
      }

      if (!validateMediaFile(file.originalname, file.mimetype, header.subarray(0, bytesRead))) {
        throw new UploadValidationError();
      }
    }
    next();
  } catch (error) {
    const cleanup = await Promise.allSettled(files.map((file) => fs.promises.unlink(file.path)));
    if (cleanup.some((result) => result.status === 'rejected')) {
      console.error('Failed to remove rejected upload files.');
      next(new Error('Upload cleanup failed.'));
      return;
    }
    next(error);
  }
};
