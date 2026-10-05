import mongoose from "mongoose";

const PatentSchema = new mongoose.Schema(
  {
    applicationNo: {
      type: String,
      required: [true, "Application Number is required"],
      trim: true,
      unique: true,
    },
    patentNo: {
      type: String,
      trim: true,
      default: "",
    },
    title: {
      type: String,
      required: [true, "Patent Title is required"],
      trim: true,
    },
    inventors: {
      type: String,
      required: [true, "Inventor(s) are required"],
      trim: true,
    },
    applicant: {
      type: String,
      default: "IMS Engineering College",
      trim: true,
    },
    filedDate: {
      type: String,
      default: "",
    },
    publishedDate: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Filed", "Published", "Granted"],
      default: "Filed",
    },
    priority: {
      type: Number,
      default: 0,
      index: true,
    },
    url: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

PatentSchema.index({
  title: "text",
  inventors: "text",
  applicationNo: "text",
});

const Patent = mongoose.model("Patent", PatentSchema);

export default Patent;
