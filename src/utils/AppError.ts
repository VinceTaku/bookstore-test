// I created a custom error class
// so I can attach a status code to any error
// this allows me to send the correct HTTP status
// from any layer without repeating myself

class AppError extends Error {
  statusCode : number;
  success    : boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.success    = false;
  }
}

export default AppError;