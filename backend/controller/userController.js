import { User } from "../modules/user.js";
import { ErrorHandler } from "../utils/errorhandler.js";
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
    res.status(201).json({ message: "user created successfully", newuser });
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
    return next(new ErrorHandler("user not found", 404));
  }
};
