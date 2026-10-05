import mongoose from "mongoose";

const institutionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    courses: {
      type: [String],
      default: [],
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    website: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: true,
  },
);

const imsGroupSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: "IMS Group of Institutions",
      trim: true,
    },

    subtitle: {
      type: String,
      default: "",
      trim: true,
    },

    stats: {
      campuses: {
        type: String,
        default: "3",
      },

      students: {
        type: String,
        default: "8500+",
      },

      programs: {
        type: String,
        default: "20+",
      },

      experience: {
        type: String,
        default: "30 Years",
      },
    },

    institutions: {
      type: [institutionSchema],
      default: [],
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

const IMSGroup = mongoose.model("IMSGroup", imsGroupSchema);

export default IMSGroup;
