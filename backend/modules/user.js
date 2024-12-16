import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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
    select: false,
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
  resetPasswordToken: String,
  resetPasswordExpireDate: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWTSECRET, {
    expiresIn: process.env.JWTEXPIRESIN,
  });
};

userSchema.methods.comparePassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    console.error("Error comparing password:", error);
  }
};

const User = mongoose.model("User", userSchema);
export { User };
