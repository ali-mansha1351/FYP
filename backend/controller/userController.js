import { StatusCodes } from "http-status-codes";
import { User } from "../modules/user.js";
import { ErrorHandler } from "../utils/errorhandler.js";
import { sendToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../utils/s3Client.js";
import {
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import crypto from "crypto";
import mongoose from "mongoose";
import {
  deleteImage,
  getImage,
  uploadImage,
} from "../utils/s3BucketCommands.js";

dotenv.config({ path: "backend/config/config.env" });

export const registerUser = async (req, res, next) => {
  const newuser = new User({
    name: req.body.name,
    username: req.body.username,
    gender: req.body.gender,
    email: req.body.email,
    password: req.body.password,
    dateOfBirth: req.body.dateOfBirth,
    skillLevel: req.body.skillLevel,
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
    const user = await User.findById({ _id: req.params.id });
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

export const currentUser = async (req, res, next) => {
  try {
    const user = await User.findById({ _id: req.user.id });
    const getProfileImageParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: user.profileImage.name,
    };
    const getCoverImageParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: user.coverImage.name,
    };
    //const getCommand = new GetObjectCommand(getObjectParams);
    const p_url = await getImage(getProfileImageParams);
    const c_url = await getImage(getCoverImageParams);
    // console.log(url);
    user.profileImage.url = p_url;
    user.coverImage.url = c_url;
    await user.save();
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 404));
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "none",
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

export const updateUser = async (req, res, next) => {
  const updates = req.body;
  const image = req.files["coverImage"]?.[0];
  const pimage = req.files["profileImage"]?.[0];

  try {
    if (pimage) {
      updates.profileImage = {
        name: pimage.originalname,
        mimetype: pimage.mimetype,
      };
      try {
        const profileImageParams = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: pimage.originalname,
          Body: pimage.buffer,
          ContentType: pimage.mimetype,
        };

        await uploadImage(profileImageParams);
        console.log(uploadImage);
      } catch (error) {
        return next(new ErrorHandler(error.message, 404));
      }
    } else {
      try {
        const userToUpdate = await User.findById(req.user.id);
        const deleteObjectParam = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: userToUpdate.profileImage.name,
        };

        await deleteImage(deleteObjectParam);
        userToUpdate.profileImage = {};
        await userToUpdate.save();
      } catch (error) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST));
      }
    }

    if (image) {
      updates.coverImage = {
        name: image.originalname,
        mimetype: image.mimetype,
      };
      try {
        const coverImageParams = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: image.originalname,
          Body: image.buffer,
          ContentType: image.mimetype,
        };

        await uploadImage(coverImageParams);
      } catch (error) {
        return next(new ErrorHandler(error.message, 404));
      }
    } else {
      try {
        const userToUpdate = await User.findById(req.user.id);
        if (userToUpdate.coverImage.name) {
          const deleteObjectParam = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: userToUpdate.coverImage.name,
          };

          await deleteImage(deleteObjectParam);
          userToUpdate.coverImage = {};
          await userToUpdate.save();
        }
      } catch (error) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST));
      }
    }

    const user = await User.findByIdAndUpdate({ _id: req.user.id }, updates, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      throw new Error("user not found,invalid ID");
    }
    if (!updates) {
      throw new Error("no updates provided");
    }

    res.status(201).json({
      success: true,
      message: "user successfuly updated",
      user,
    });
  } catch (error) {
    if (error.message === "user not found,invalid ID") {
      return next(new ErrorHandler(error.message, 404));
    }
    if (error.message === "no updates provided") {
      return next(new ErrorHandler(error.message, 400));
    }

    return next(new ErrorHandler(error.message || "something went wrong", 500));
  }
};

export const followUser = async (req, res, next) => {
  const user = req.user.id;
  const user_to_follow = req.params.id;
  try {
    if (!user) {
      throw new Error("unauthorized access");
    }
    if (!mongoose.Types.ObjectId.isValid(user_to_follow)) {
      throw new Error("invalid user to follow id format");
    }
    const updatedUser = await User.findById(user);
    const userToFollow = await User.findById(user_to_follow);
    if (!updatedUser) {
      throw new Error("can not find user");
    }
    if (!userToFollow) {
      throw new Error("user to follow not found");
    }
    //const followId = mongoose.Types.ObjectId(user_to_follow);

    if (updatedUser.following.includes(user_to_follow)) {
      console.log(user_to_follow);
      throw new Error("already following this user");
    }

    // if(userToFollow.followers.includes(user)){
    //   throw new Error("user is already following you")
    // }

    updatedUser.following.push(userToFollow._id);
    userToFollow.followers.push(user);
    userToFollow.save();
    updatedUser.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "user successfully followed",
    });
  } catch (error) {
    if (error.message === "unauthorized access") {
      return next(new ErrorHandler(error.message, StatusCodes.UNAUTHORIZED));
    }
    if (error.message === "can not find user") {
      return next(new ErrorHandler(error.message, StatusCodes.NOT_FOUND));
    }
    if (error.message === "user to follow not found") {
      return next(new ErrorHandler(error.message, StatusCodes.NOT_FOUND));
    }
    if (error.message === "already following this user") {
      return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST));
    }
    if (error.message === "invalid user to follow id format") {
      return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST));
    } else {
      return next(
        new ErrorHandler(
          error.message || "internal server error",
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
};

export const unFollowUser = async (req, res, next) => {
  const user = req.user.id;
  const user_to_unfollow = req.params.id;
  try {
    if (!user) {
      throw new Error("unauthorized access");
    }
    if (!mongoose.Types.ObjectId.isValid(user_to_unfollow)) {
      throw new Error("invalid user to unfollow id format");
    }
    const updatedUser = await User.findById(user);
    const userTounFollow = await User.findById(user_to_unfollow);
    if (!updatedUser) {
      throw new Error("can not find user");
    }
    if (!userTounFollow) {
      throw new Error("user to unfollow not found");
    }
    //const followId = mongoose.Types.ObjectId(user_to_follow);

    if (!updatedUser.following.includes(user_to_unfollow)) {
      throw new Error("already unfollowed this user");
    }

    // if(userToFollow.followers.includes(user)){
    //   throw new Error("user is already following you")
    // }

    updatedUser.following.pull(userTounFollow._id);
    userTounFollow.followers.pull(user);
    userTounFollow.save();
    updatedUser.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "user successfully unfollowed",
    });
  } catch (error) {
    if (error.message === "unauthorized access") {
      return next(new ErrorHandler(error.message, StatusCodes.UNAUTHORIZED));
    }
    if (error.message === "can not find user") {
      return next(new ErrorHandler(error.message, StatusCodes.NOT_FOUND));
    }
    if (error.message === "user to unfollow not found") {
      return next(new ErrorHandler(error.message, StatusCodes.NOT_FOUND));
    }
    if (error.message === "already unfollowed this user") {
      return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST));
    }
    if (error.message === "invalid user to unfollow id format") {
      return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST));
    } else {
      return next(
        new ErrorHandler(
          error.message || "internal server error",
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
};
