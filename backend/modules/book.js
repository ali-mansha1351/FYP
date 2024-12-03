import mongoose from "mongoose";
import validator from "validator";

const bookSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "enter book name"],
  },
  author: {
    type: String,
    required: [true, "enter author name"],
  },
  description: {
    type: String,
    required: [true, "dedcription is required"],
    maxLength: [5000, "description should be less then 5000 characters"],
  },
  publishedDate: {
    type: Date,
  },
  genre: [{ type: String }],
});

const Book = mongoose.model("Book", bookSchema);

export { Book };
