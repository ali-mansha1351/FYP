import { Post } from "../modules/post.js";
import { ErrorHandler } from "../utils/errorhandler.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import dotenv from "dotenv";
import {
  uploadMultipleImages,
  deleteMultipleImages,
  getMultipleImages,
  getImage,
} from "../utils/s3BucketCommands.js";
dotenv.config({ path: "backend/config/config.env" });

export const createPost = async (req, res, next) => {
  const data = req.body;
  const files = req.files;
  const user = req.user.id;
  data.createdBy = user;
  var allFiles = [];

  try {
    data.content = [];
    if (!user) {
      throw new Error("unauthorized access");
    }
    if (files.postImages) {
      allFiles = [...files.postImages];
      files.postImages.forEach((element) => {
        data.content.push({
          name: element.originalname,
          mimetype: element.mimetype,
        });
      });
    }
    if (files.postVideos) {
      allFiles = [...files.postVideos];
      files.postVideos.forEach((element) => {
        data.content.push({
          name: element.originalname,
          mimetype: element.mimetype,
        });
      });
    }

    const newPost = new Post(data);
    await uploadMultipleImages(allFiles);
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
    if (
      error.messaage === "file type not supported should only be image or video"
    ) {
      return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST));
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
  const files = req.files;
  const user = req.user.id;
  const postId = req.params.id;
  var allNewFiles = [];
  try {
    if (!user) {
      throw new Error("unauthorized access");
    }
    if (files.postImages) {
      allNewFiles = [...files.postImages];
    }
    if (files.postVideos) {
      allNewFiles = [...files.postVideos];
    }
    const updatedPost = await Post.findById(req.params.id);
    const allExistingFiles = updatedPost.content;

    const filesToRemove = allExistingFiles.filter((existingFile) => {
      return !allNewFiles.some((newFile) => {
        return newFile.originalname === existingFile.name;
      });
    });

    const filesToAdd = allNewFiles.filter((newFile) => {
      return !allExistingFiles.some((existingFile) => {
        return existingFile.name === newFile.originalname;
      });
    });

    // console.log("files to remove: ", filesToRemove);
    // console.log("files to add: ", filesToAdd);

    await deleteMultipleImages(filesToRemove);
    await uploadMultipleImages(filesToAdd);

    if (filesToRemove.length > 0) {
      updatedPost.content = updatedPost.content.filter((file) => {
        !filesToRemove.includes(file.name);
      });
    }

    if (filesToAdd.length > 0) {
      filesToAdd.forEach((file) => {
        updatedPost.content.push({
          name: file.originalname,
          url: null,
          mimetype: file.mimetype,
        });
      });
    }

    await updatedPost.save();
    const post = await Post.findByIdAndUpdate({ _id: req.params.id }, data, {
      new: true,
      runValidators: true,
    });

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new Error("invalid post id format");
    }
    if (!updatedPost) {
      throw new Error("post can't be found");
    }
    res.status(StatusCodes.OK).json({
      success: true,
      messaage: "post updated successfully",
      post,
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
  const postToGet = req.params.id;
  try {
    if (!user) {
      throw new Error("unauthrized access");
    }
    const post = await Post.findOne({
      _id: postToGet,
    });
    if (!post) {
      throw new Error("post not found");
    }
    const allFiles = post.content;
    const { urls } = await getMultipleImages(allFiles);
    urls.forEach((url, index) => {
      console.log(url);
      if (post.content[index]) {
        post.content[index].url = url;
      }
    });
    await post.save();
    res.status(StatusCodes.OK).json({
      success: true,
      post,
    });
  } catch (error) {
    if (error.message === "unauthrized access") {
      return next(new ErrorHandler(error.message, StatusCodes.UNAUTHORIZED));
    }
    if (error.message === "post not found") {
      return next(new ErrorHandler(error.message, StatusCodes.NOT_FOUND));
    }
    return next(
      new ErrorHandler(
        error.message || "internal server error",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

export const getAllPost = async (req, res, next) => {
  const user = new mongoose.Types.ObjectId(String(req.user.id));

  try {
    if (!user) {
      throw new Error("unauthrized access");
    }
    const posts = await Post.find({ createdBy: user });
    if (posts.length === 0) {
      throw new Error("post not found");
    }
    var allFiles = [];
    posts.forEach((post) => allFiles.push(...post.content));
    //console.log(allFiles);
    const { urls } = await getMultipleImages(allFiles);
    //console.log(urls);
    let index = 0;
    posts.forEach((post) => {
      post.content.forEach((content) => {
        if (content.name === allFiles[index].name) {
          content.url = urls[index];
          index++;
        }
      });
    });

    posts.forEach((post) => post.save());
    res.status(StatusCodes.OK).json({
      success: true,
      posts,
    });
  } catch (error) {
    if (error.message === "unauthrized access") {
      return next(new ErrorHandler(error.message, StatusCodes.UNAUTHORIZED));
    }
    if (error.message === "post not found") {
      return next(new ErrorHandler(error.message, StatusCodes.NOT_FOUND));
    }
    return next(
      new ErrorHandler(
        error.message || "internal server error",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

export const deletePost = async (req, res, next) => {
  const user = req.user.id;
  try {
    const post = await Post.findById(req.params.id);
    const allFiles = post.content;
    await deleteMultipleImages(allFiles);
    if (user != post.createdBy) {
      throw new Error("can not delete this post, unauhtorized access");
    }
    const result = await Post.findByIdAndDelete(req.params.id);
    if (!user) {
      throw new Error("unauthorized access");
    }
    if (!result) {
      throw new Error("post not found");
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "post deleted successfully",
    });
  } catch (error) {
    if (error.message === "unauthorized access") {
      return next(new ErrorHandler(error.message, StatusCodes.UNAUTHORIZED));
    }
    if (error.message === "can not delete this post, unauhtorized access") {
      return next(new ErrorHandler(error.message, StatusCodes.UNAUTHORIZED));
    }
    if (error.message === "post not found") {
      return next(new ErrorHandler(error.message, StatusCodes.NOT_FOUND));
    }
    return next(
      new ErrorHandler(
        error.message || "internal server error",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};
