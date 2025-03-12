import mongoose from "mongoose";
import { stitch } from "./stitch.js";
import { User } from "./user.js";
const patternSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "pattern should have a name"],
    default: "untitled",
  },
  stitches: [
    {
      type: mongoose.Types.ObjectId,
      ref: stitch,
    },
  ],
  user: {
    type: mongoose.Types.ObjectId,
    ref: User,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const pattern = mongoose.model("pattern", patternSchema);
export { pattern };
