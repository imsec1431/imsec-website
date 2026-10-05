import mongoose from "mongoose";

const academicCoordinatorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    photo: {
      type: String,
      required: true,
      trim: true,
    },

    photoPublicId: {
      type: String,
      default: "",
      trim: true,
    },

    responsibilities: {
      type: String,
      required: true,
      trim: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const AcademicCoordinator = mongoose.model(
  "AcademicCoordinator",
  academicCoordinatorSchema,
);

export default AcademicCoordinator;
