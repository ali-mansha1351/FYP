import { User } from "../modules/user.js";
import { ErrorHandler } from "../utils/errorhandler.js";
import { sendToken } from "../utils/jwtToken.js";

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
    res.status(400).json({ message: "user creation failed", error });
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
