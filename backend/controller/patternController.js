import { stitch } from "../modules/stitch.js";
import { pattern } from "../modules/pattern.js";
import { ErrorHandler } from "../utils/errorhandler.js";
import { User } from "../modules/user.js";
import { StatusCodes } from "http-status-codes";

export const createPattern = async (req, res, next) => {
  const { name, stitches } = req.body;
  const user = req.user.id;
  if (!name || !user || !stitches) {
    throw new Error("pattern can't be created from null");
  }

  const newPattern = new pattern({
    name,
    user,
  });

  try {
    await newPattern.save();
    const savedStitches = await Promise.all(
      stitches.map(async (stitchData) => {
        const newStitch = new stitch(stitchData);
        await newStitch.save();
        return newStitch._id;
      })
    );

    //console.log(JSON.stringify(savedStitches, null, 2));

    newPattern.stitches = savedStitches;
    await newPattern.save();

    const populatedPattern = await pattern
      .findById(newPattern._id)
      .populate("stitches")
      .exec();

    res.status(200).json({
      success: true,
      message: "pattern created successfuly",
      populatedPattern,
    });
  } catch (error) {
    if (error.message === "pattern can't be created from null") {
      return next(new ErrorHandler(error.message, 400));
    }
    return next(
      new ErrorHandler(error.message || "fault in creating pattern", 404)
    );
  }
};

export const getPattern = async (req, res, next) => {
  const user = req.user.id;
  try {
    if (!user) {
      throw new Error("login first to get patterns");
    }
    const patternToGet = await pattern.findById(req.params.id);
    if (!patternToGet) {
      throw new Error("pattern not found");
    }
    res.status(StatusCodes.OK).json({
      success: true,
      patternToGet,
    });
  } catch (error) {
    if (error.message === "login first to get patterns") {
      return next(new ErrorHandler(error.message, StatusCodes.UNAUTHORIZED));
    }
    if (error.message === "pattern not found") {
      return next(new ErrorHandler(error.message, StatusCodes.NOT_FOUND));
    }
    return next(
      new ErrorHandler(
        error.message || "error in getting pattern",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

export const updatePattern = async (req, res, next) => {
  const { name, stitches } = req.body;
  const user = req.user.id;
  if (!name || !stitches) {
    throw new Error("both name and stitches are required");
  }
  try {
    const existingPattern = await pattern.findById(req.params.id);
    if (!existingPattern) {
      throw new Error("pattern not found");
    }
    if (existingPattern.user.toString() != user) {
      //console.log(existingPattern.user.toString());
      throw new Error("unauthorized access, can not update pattern");
    }
    //updating existing stitches like their color or position

    const updatedStitchId = await Promise.all(
      stitches.map(async (stitchData) => {
        if (stitchData._id) {
          const updatedStitch = await stitch.findByIdAndUpdate(
            stitchData._id,
            stitchData,
            {
              new: true,
              runValidators: true,
            }
          );
          return updatedStitch._id;
        } else {
          const newStitch = new stitch(stitchData);
          await newStitch.save();
          return newStitch._id;
        }
      })
    );

    //comparing old stitches with new updated arraay and deleting them
    const oldStitchIds = existingPattern.stitches.map((id) => id.toString());
    //console.log(oldStitchIds);
    const stitchesToDelete = oldStitchIds.filter(
      (oldId) => !updatedStitchId.map((id) => id.toString()).includes(oldId)
    );
    //console.log("stitches to delete array is:", stitchesToDelete);

    //deleting removed stitches from the database
    if (stitchesToDelete.length) {
      await stitch.deleteMany({ _id: { $in: stitchesToDelete } });
    }

    existingPattern.name = name;
    existingPattern.stitches = updatedStitchId;
    await existingPattern.save();

    const populatedPattern = await pattern
      .findById(existingPattern._id)
      .populate("stitches")
      .exec();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "pattern has been updated",
      populatedPattern,
    });
  } catch (error) {
    if (error.message === "both name and stitches are required") {
      return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST));
    }
    if (error.message === "pattern not found") {
      return next(new ErrorHandler(error.message, StatusCodes.NOT_FOUND));
    }
    if (error.message === "unauthorized access, can not update pattern") {
      return next(new ErrorHandler(error.message, StatusCodes.UNAUTHORIZED));
    }
    return next(
      new ErrorHandler(
        error.message || "Error updating pattern",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

export const deletePattern = async (req, res, next) => {
  const user = req.user.id;

  try {
    const patternToDelete = await pattern.findById(req.params.id);
    if (!patternToDelete) {
      throw new Error("pattern not found");
    }
    if (patternToDelete.user.toString() != user) {
      throw new Error("uanuthrized access");
    }
    const stitchesToDelete = patternToDelete.stitches.map((id) =>
      id.toString()
    );
    if (stitchesToDelete.length) {
      await stitch.deleteMany({ _id: { $in: stitchesToDelete } });
    }
    await patternToDelete.deleteOne({ _id: req.params.id });
    res.status(StatusCodes.OK).json({
      success: true,
      message: "pattern deleted succesfully",
    });
  } catch (error) {
    if (error.message === "pattern not found") {
      return next(new ErrorHandler(error.message, StatusCodes.NOT_FOUND));
    }
    if (error.message === "unauthrized access") {
      return next(new ErrorHandler(error.message, StatusCodes.UNAUTHORIZED));
    }
    return next(
      new ErrorHandler(
        error || "error in deleting the pattern",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};
