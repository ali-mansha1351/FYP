import { ErrorHandler } from "../utils/errorhandler.js";
import jwt from "jsonwebtoken";
import { User } from "../modules/user.js";
const isAuthenticatedUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("login first to access this resource");
    }

    const decoded = jwt.verify(token, process.env.JWTSECRET);
    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    if (error.message === "login first to access this resource") {
      return next(new ErrorHandler(error.message, 401));
    }
    if (error.message === "user verification failed") {
      return next(new ErrorHandler(error.message, 404));
    }
    if (error.name === "JsonWebTokenError") {
      return next(new ErrorHandler("Invalid token, please log in again", 401));
    }
    if (error.name === "TokenExpiredError") {
      return next(new ErrorHandler("Token expired, please log in again", 401));
    }
  }
};
export { isAuthenticatedUser };
