import mongoose from "mongoose";

const libraryTimingSchema = new mongoose.Schema(
  {
    mondayFriday: {
      type: String,
      required: true,
      trim: true,
    },

    saturday: {
      type: String,
      required: true,
      trim: true,
    },

    sunday: {
      type: String,
      default: "Closed",
      trim: true,
    },

    holidayNote: {
      type: String,
      default: "",
      trim: true,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("LibraryTiming", libraryTimingSchema);
