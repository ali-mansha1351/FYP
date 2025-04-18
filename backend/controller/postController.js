import { Post } from "../modules/post.js";
import { ErrorHandler } from "../utils/errorhandler.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

export const createPost = async (req, res, next) => {
  const data = req.body;
  const user = req.user.id;
  data.createdBy = user;

  try {
    if (!user) {
      throw new Error("unauthorized access");
    }
    const newPost = new Post(data);
    await newPost.save();
    res.status(StatusCodes.OK).json({
      success: true,
      message: "post successfuly created",
      newPost,
    });
  } catch (error) {
    if (error.message === "unauthorized access") {
      return next(new ErrorHandler(error.message, StatusCodes.UNAUTHORIZED));
    }
    return next(
      new ErrorHandler(
        error.message || "failed to create new post",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

export const updatePost = async (req, res, next) => {
  const { title, description } = req.body;
  const data = { title, description };
  const user = req.user.id;
  const postId = req.params.id;

  try {
    if (!user) {
      throw new Error("unauthorized access");
    }
    const updatedPost = await Post.findByIdAndUpdate(
      { _id: req.params.id },
      data,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new Error("invalid post id format");
    }
    if (!updatedPost) {
      throw new Error("post can't be found");
    }
    res.status(StatusCodes.OK).json({
      success: true,
      messaage: "post updated successfully",
      updatedPost,
    });
  } catch (error) {
    if (error.message === "unauthorized access") {
      return next(new ErrorHandler(error.message, StatusCodes.UNAUTHORIZED));
    }
    if (error.message === "invalid post id format") {
      return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST));
    }
    if (error.message === "post can't be found") {
      return next(new ErrorHandler(error.message, StatusCodes.NOT_FOUND));
    }
    return next(
      new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR)
    );
  }
};

export const getPost = async (req, res, next) => {
  const user = req.user.id;

  try {
    if (!user) {
      throw new Error();
    }
  } catch (error) {}
};
