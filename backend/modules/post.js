import { User } from "./user";
import mongoose from "mongoose";

const postSchema = mongoose.Schema({
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
      user: {
        type: mongoose.Types.ObjectId,
        ref: User,
      },
    },
  ],
  comments: [
    {
      user: {
        type: mongoose.Types.ObjectId,
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
      userShared: mongoose.Types.ObjectId,
      ref: User,
    },
  ],
});

const Post = mongoose.model("Post", postSchema);
export { Post };
