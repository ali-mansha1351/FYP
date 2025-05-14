import { configDotenv } from "dotenv";
import { ErrorHandler } from "../utils/errorhandler.js";
import multer from "multer";
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

export const multerErrorMiddleware = async (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        errorCode: 400,
        error: "file size is too large",
      });
    }
    return res.status(400).json({
      success: false,
      errorCode: 400,
      error: err.message,
    });
  } else if (err) {
    return res.status(500).json({
      success: false,
      error: err.message || "An unknown error occurred during file upload.",
    });
  }
  next();
};

export const multerFileFilter = async (req, res, next) => {
  if (!req.files) {
    next();
  }
  const allFiles = [];
  if (req.files.postImages) {
    allFiles.push(...req.files.postImages);
  }
  if (req.files.postVideos) {
    allFiles.push(...req.files.postVideos);
  }
  const invalidFiles = allFiles.filter((file) => {
    return (
      !file.mimetype.startsWith("image/") && !file.mimetype.startsWith("video/")
    );
  });
  if (invalidFiles.length > 0) {
    return res.status(400).json({
      success: false,
      errorCode: 400,
      error: "file type should be image or video only",
    });
  }
  next();
};
