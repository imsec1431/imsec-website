import mongoose from "mongoose";

const collaborationItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    photoUrl: {
      type: String,
      default: "",
      trim: true,
    },

    photoPublicId: {
      type: String,
      default: "",
      trim: true,
    },

    linkUrl: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    certificateUrl: {
      type: String,
      default: "",
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    order: {
      type: Number,
      default: 1,
    },
  },
  {
    _id: true,
  },
);

const industryAcademicsCollaborationSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      required: true,
      unique: true,
      default: "industry-academics-collaboration",
    },

    title: {
      type: String,
      required: true,
      trim: true,
      default: "Industry Academics Collaboration",
    },

    description: {
      type: String,
      default: "Industry-academia collaboration and Centres of Excellence.",
      trim: true,
    },

    items: {
      type: [collaborationItemSchema],
      default: [],
    },

    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const getDefaultIndustryAcademicsCollaboration = () => ({
  singletonKey: "industry-academics-collaboration",

  title: "Industry Academics Collaboration",

  description: "Industry-academia collaboration and Centres of Excellence.",

  items: [],

  published: true,
});

const IndustryAcademicsCollaboration =
  mongoose.models.IndustryAcademicsCollaboration ||
  mongoose.model(
    "IndustryAcademicsCollaboration",
    industryAcademicsCollaborationSchema,
  );

export default IndustryAcademicsCollaboration;
