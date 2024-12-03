import mongoose from "mongoose";
import validator from "validator";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter your name"],
    maxLength: [30],
  },
  username: {
    type: String,
    maxLength: 30,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: {
      values: ["male", "female"],
    },
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: "invalid email",
    },
    lowercase: true,
  },
  dateOfBirth: {
    type: Date,
  },
  password: {
    type: String,
    require: [true, "password is required"],
    minLength: [8, "password must be above 8 characters"],
  },
  role: {
    type: String,
    requierd: true,
    default: "user",
  },
  //   images: [
  //     {
  //       punlicId: {
  //         type: String,
  //         require: true,
  //       },
  //       url: {
  //         type: String,
  //         require: true,
  //       },
  //     },
  //   ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  //   booksRead: [
  //     {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "Book",
  //     },
  //   ],
});

const User = mongoose.model("User", userSchema);
export { User };
