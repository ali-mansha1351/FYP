import { User } from "./user.js";
import mongoose from "mongoose";
import validator from "validator";

const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      validate: {
        validator: (value) => validator.isLength(value, { min: 6, max: 100 }),
      },
    },
    description: {
      type: String,
      maxLength: [100, "description exceeded maximum limit"],
      default: null,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: User,
        },
        commentStr: {
          type: String,
          maxLength: [150],
          default: null,
        },
      },
    ],
    shares: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);
export { Post };
