import mongoose from "mongoose";

const placementStatSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["highest-package", "average-ctc", "recruiters", "placements"],
      unique: true,
    },

    figure: {
      type: String,
      required: true,
      trim: true,
    },

    order: {
      type: Number,
      default: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("PlacementStat", placementStatSchema);
