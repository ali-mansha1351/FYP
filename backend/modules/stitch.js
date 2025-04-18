import mongoose from "mongoose";

const stitchSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: {
      values: ["default", "custom"],
    },
    default: "default",
  },
  layerNumber: {
    type: Number,
    required: true,
    default: 0,
  },
  isStart: {
    type: Boolean,
    required: true,
    default: "false",
  },
  isIncrease: {
    type: Boolean,
    required: true,
    default: "false",
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
      default: null,
    },
  ],
  next: {
    type: mongoose.Types.ObjectId,
    ref: "stitch",
    default: null,
  },
  previous: {
    type: mongoose.Types.ObjectId,
    ref: "stitch",
    default: null,
  },
  x_cordinates: {
    type: Number,
    required: true,
    default: 0,
  },
  y_cordinates: {
    type: Number,
    required: true,
    default: 0,
  },
  z_cordinates: {
    type: Number,
    required: true,
    default: 0,
  },
  vx: {
    type: Number,
    required: false,
    default: 0,
  },
  vy: {
    type: Number,
    required: false,
    default: 0,
  },
  vz: {
    type: Number,
    required: false,
    default: 0,
  },
  color: {
    type: String,
    default: null,
  },
});

const stitch = mongoose.model("stitch", stitchSchema);
export { stitch };
