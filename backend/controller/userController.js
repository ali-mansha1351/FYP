import { User } from "../modules/user.js";
import { ErrorHandler } from "../utils/errorhandler.js";
import { sendToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";

export const registerUser = async (req, res, next) => {
  const newuser = new User({
    name: req.body.name,
    username: req.body.username,
    gender: req.body.gender,
    email: req.body.email,
    password: req.body.password,
    dateOfBirth: req.body.dateOfBirth,
  });

  try {
    await newuser.save();
    sendToken(newuser, 200, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    res.staus(400).json({ message: "problem finding users", error });
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    return next(new ErrorHandler(error.message, 404));
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const loginuser = await User.findOne({ email }).select("+password");
    if (!loginuser) {
      throw new Error("invalid user");
    }
    const isPasswordMatched = await loginuser.comparePassword(password);
    if (!isPasswordMatched) {
      throw new Error("invalid credentials");
    }
    sendToken(loginuser, 200, res);
  } catch (error) {
    if (error.message === "invalid user")
      return next(new ErrorHandler(error.message, 404));
    if (error.message === "invalid credentials")
      return next(new ErrorHandler(error.message), 401);
    return next(
      new ErrorHandler("An unexpected error occurred: " + error.message, 500)
    );
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "logged out",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 404));
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Error("user not found with this email");
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    //generate reset url

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/user/password/reset/${resetToken}`;

    const message = `Your password reset token is as follows:\n\n${resetUrl}\n\nif you have not requested this then ignore it`;

    try {
      await sendEmail({
        email: user.email,
        subject: "mybookshelf password recovery",
        message,
      });

      res.status(200).json({
        success: true,
        message: `Email sent to: ${user.email}`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpireDate = undefined;

      return next(ErrorHandler(error.message, 500));
    }
  } catch (error) {
    if (error.message === "user not found with this email") {
      return next(new ErrorHandler(error.message, 404));
    }
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    //hash url token and compare it with hashed resettoken sotred in db
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpireDate: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("password reset token is invalid or has been expired");
    }

    if (req.body.password !== req.body.confirmPassword) {
      throw new Error("password does not match");
    }

    user.password = req.body.password;
    user.resetPasswordExpireDate = undefined;
    user.resetPasswordToken = undefined;

    await user.save();

    sendToken(user, 200, res);
  } catch (error) {
    if (
      error.message === "password reset token is invalid or has been expired"
    ) {
      return next(new ErrorHandler(error.message, 404));
    }
    if (error.message === "password does not match") {
      return next(new ErrorHandler(error.message, 404));
    }
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const deluser = await User.deleteOne({ _id: req.params.id });
    if (deluser.deletedCount === 0) {
      throw new Error("user not found");
    }

    res.status(200).json({
      success: true,
      message: "user deleted",
    });
  } catch (error) {
    if (error.message === "user not found") {
      return next(new ErrorHandler(error.message, 404));
    }
  }
};
