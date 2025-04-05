import { configDotenv } from "dotenv";
import { ErrorHandler } from "../utils/errorhandler.js";

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

    if (err.code === 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
      err = new ErrorHandler(message, 400);
    }
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }
};
