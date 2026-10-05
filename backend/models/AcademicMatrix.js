import mongoose from "mongoose";

const academicMatrixSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, "Program type is required"],
      enum: ["ug", "pg"],
      trim: true,
    },

    code: {
      type: String,
      required: [true, "Program code is required"],
      trim: true,
      maxlength: 100,
    },

    name: {
      type: String,
      required: [true, "Program name is required"],
      trim: true,
      maxlength: 250,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    duration: {
      type: String,
      required: [true, "Program duration is required"],
      trim: true,
      maxlength: 100,
    },

    basis: {
      type: String,
      required: [true, "Admission basis is required"],
      trim: true,
      maxlength: 250,
    },

    icon: {
      type: String,
      required: [true, "Program icon is required"],
      enum: [
        "Microchip",
        "Gear",
        "Briefcase",
        "GraduationCap",
        "Building",
        "Computer",
        "Database",
      ],
      default: "Microchip",
    },

    buttonText: {
      type: String,
      required: [true, "Button text is required"],
      trim: true,
      maxlength: 100,
      default: "More Details",
    },

    buttonLink: {
      type: String,
      trim: true,
      default: "#",
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

academicMatrixSchema.index({
  type: 1,
  isPublished: 1,
  displayOrder: 1,
  createdAt: -1,
});

const AcademicMatrix = mongoose.model("AcademicMatrix", academicMatrixSchema);

export default AcademicMatrix;
