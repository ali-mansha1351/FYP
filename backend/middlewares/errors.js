import { configDotenv } from "dotenv";

export const errorMiddleware = (err, req, res, next) => {
  if (process.env.NODE_ENV === "DEVELOPMENT") {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "internal server error";

    res.status(err.statusCode).json({
      success: false,
      errorCode: err.statusCode,
      error: err.stack,
    });
  } else {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "internal server error";

    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }
};
