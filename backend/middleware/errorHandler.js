export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error response
  let error = {
    success: false,
    message: 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  // Handle specific error types
  if (err.name === 'ValidationError') {
    error.message = 'Validation Error';
    error.details = err.details;
    return res.status(400).json(error);
  }

  if (err.code === '23505') { // PostgreSQL unique violation
    error.message = 'Resource already exists';
    return res.status(409).json(error);
  }

  if (err.code === '23503') { // PostgreSQL foreign key violation
    error.message = 'Referenced resource not found';
    return res.status(400).json(error);
  }

  if (err.name === 'CastError') {
    error.message = 'Invalid ID format';
    return res.status(400).json(error);
  }

  // Custom error status
  const statusCode = err.statusCode || 500;
  if (err.message) {
    error.message = err.message;
  }

  res.status(statusCode).json(error);
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};