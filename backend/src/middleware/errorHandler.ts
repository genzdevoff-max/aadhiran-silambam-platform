import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('[API Error]:', err);

  if (err.name === 'MulterError') {
    res.status(400).json({
      success: false,
      message: `Upload Error: ${err.message}`
    });
    return;
  }

  if (err.name === 'ZodError') {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors
    });
    return;
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected internal server error occurred.'
  });
};
