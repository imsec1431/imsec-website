import mongoose from "mongoose";

const FacultyDevelopmentProgramSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "FDP Title is required"],
      trim: true,
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },
    speaker: {
      type: String,
      required: [true, "Speaker / Resource Person is required"],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
      trim: true,
    },
    mode: {
      type: String,
      enum: ["Offline", "Online", "Hybrid"],
      default: "Offline",
    },
    date: {
      type: String,
      required: [true, "Date is required"],
      trim: true,
    },
    organizer: {
      type: String,
      required: [true, "Organizer is required"],
      trim: true,
    },
    brochure: {
      type: String,
      trim: true,
      default: "",
    },
    priority: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

FacultyDevelopmentProgramSchema.index({
  title: "text",
  department: "text",
  speaker: "text",
});

const FacultyDevelopmentProgram = mongoose.model(
  "FacultyDevelopmentProgram",
  FacultyDevelopmentProgramSchema,
);

export default FacultyDevelopmentProgram;
