import { Request, Response, NextFunction } from 'express';
import AppError from './AppError';

// I created a global error handler
// so all errors from all routes
// are caught and handled in one place
// this keeps my controllers clean

const errorHandler = (
  error : Error,
  _req  : Request,
  res   : Response,
  _next : NextFunction
): void => {

  // I check if it is my custom error
  // which has a status code attached
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success : false,
      message : error.message
    });
    return;
  }

  // I handle unexpected errors here
  // something crashed that I did not expect
  console.error("Unexpected error:", error);
  res.status(500).json({
    success : false,
    message : "Something went wrong"
  });

};

export default errorHandler;