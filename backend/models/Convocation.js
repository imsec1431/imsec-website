import mongoose from "mongoose";

const convocationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 250,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: 2000,
    },

    year: {
      type: Number,
      required: [true, "Year is required"],
      min: 1900,
      max: 2200,
    },

    pdfLink: {
      type: String,
      required: [true, "Photos PDF link is required"],
      trim: true,
    },

    socialMedia: {
      facebook: {
        type: String,
        trim: true,
        default: "",
      },

      instagram: {
        type: String,
        trim: true,
        default: "",
      },

      youtube: {
        type: String,
        trim: true,
        default: "",
      },

      linkedin: {
        type: String,
        trim: true,
        default: "",
      },

      x: {
        type: String,
        trim: true,
        default: "",
      },
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

// Public listing priority
convocationSchema.index({
  isPublished: 1,
  displayOrder: 1,
  year: -1,
  createdAt: -1,
});

const Convocation = mongoose.model("Convocation", convocationSchema);

export default Convocation;
