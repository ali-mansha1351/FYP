import { stitch } from "../modules/stitch.js";
import { pattern } from "../modules/pattern.js";
import { ErrorHandler } from "../utils/errorhandler.js";
import { User } from "../modules/user.js";

export const createPattern = async (req, res, next) => {
  const { name, stitches } = req.body;
  const user = req.user.id;
  if (!name || !user || !stitches) {
    throw new Error("pattern can't be created from null");
  }
  const newPattern = new pattern({
    name,
    user,
    stitches,
  });

  newPattern.save();
  res.status(200).json({
    success: true,
    message: "pattern created successfuly",
  });
  try {
  } catch (error) {
    if (error.message === "pattern can't be created from null") {
      return next(new ErrorHandler(error.message, 400));
    }
    return next(
      new ErrorHandler(error.message || "fault in creating pattern", 404)
    );
  }
};
