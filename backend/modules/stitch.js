import mongoose from "mongoose";

const stitchSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  layerNumber: {
    type: Number,
    required: true,
    default: 0,
  },
  isStart: {
    type: Boolean,
    required: true,
  },
  isIncrease: {
    type: Boolean,
    required: true,
    default: false,
  },
  //   surroundingStitches: [
  //     {
  //       stitchId: {
  //         type: Schema.Types.ObjectId,
  //         ref: "stitch",
  //       },
  //     },
  //   ],
  insertedInto: [
    {
      type: mongoose.Types.ObjectId,
      ref: "stitch",
    },
  ],
  next: {
    type: mongoose.Types.ObjectId,
    ref: "stitch",
  },
  previous: {
    type: mongoose.Types.ObjectId,
    ref: "stitch",
  },
  x_cordinates: {
    type: Number,
    require: true,
  },
  y_cordinates: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
  },
});

const stitch = mongoose.model("stitch", stitchSchema);
export { stitch };
