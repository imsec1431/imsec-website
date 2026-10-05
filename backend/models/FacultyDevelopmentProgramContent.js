import mongoose from "mongoose";

const FacultyDevelopmentProgramContentSchema = new mongoose.Schema(
  {
    sectionTag: {
      type: String,
      default: "CONTINUOUS LEARNING",
    },
    title: {
      type: String,
      default: "Faculty Development Programs",
    },
    aboutImage: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&q=80",
    },
    description1: {
      type: String,
      default:
        "IMS Engineering College regularly organizes Faculty Development Programs (FDPs), Short-Term Training Programs (STTPs), Workshops and Refresher Courses to enhance the teaching, research and professional competencies of faculty members.",
    },
    description2: {
      type: String,
      default:
        "These programs bridge the gap between academia and industry by providing exposure to emerging technologies, innovative teaching methodologies, research practices and leadership development.",
    },
    stats: [
      {
        number: { type: String, default: "150+" },
        title: { type: String, default: "FDPs Conducted" },
      },
      {
        number: { type: String, default: "3500+" },
        title: { type: String, default: "Faculty Participants" },
      },
      {
        number: { type: String, default: "85+" },
        title: { type: String, default: "Industry Experts" },
      },
      {
        number: { type: String, default: "40+" },
        title: { type: String, default: "Collaborating Organizations" },
      },
    ],
    timeline: [
      {
        year: { type: String, required: true },
        count: { type: String, required: true },
      },
    ],
    categories: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

const FacultyDevelopmentProgramContent = mongoose.model(
  "FacultyDevelopmentProgramContent",
  FacultyDevelopmentProgramContentSchema,
);

export default FacultyDevelopmentProgramContent;
