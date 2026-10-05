import mongoose from "mongoose";

const departmentEventSchema = new mongoose.Schema(
  {
    /* =====================================================
       DEPARTMENT
    ===================================================== */

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      index: true,
    },

    /* =====================================================
       EVENT TITLE
    ===================================================== */

    title: {
      type: String,
      required: true,
      trim: true,
    },

    /* =====================================================
       CATEGORY
    ===================================================== */

    category: {
      type: String,
      required: true,
      trim: true,
    },

    /* =====================================================
       DATE
    ===================================================== */

    date: {
      type: Date,
      required: true,
    },

    /* =====================================================
       VENUE
    ===================================================== */

    venue: {
      type: String,
      required: true,
      trim: true,
    },

    /* =====================================================
       COORDINATOR
    ===================================================== */

    coordinator: {
      type: String,
      required: true,
      trim: true,
    },

    /* =====================================================
       DESCRIPTION
    ===================================================== */

    description: {
      type: String,
      required: true,
      trim: true,
    },

    /* =====================================================
       CLOUDINARY IMAGE
    ===================================================== */

    image: {
      type: String,
      default: "",
      trim: true,
    },

    publicId: {
      type: String,
      default: "",
      trim: true,
    },

    /* =====================================================
       SOCIAL MEDIA LINKS
    ===================================================== */

    socialLinks: {
      linkedin: {
        type: String,
        default: "",
        trim: true,
      },

      instagram: {
        type: String,
        default: "",
        trim: true,
      },

      facebook: {
        type: String,
        default: "",
        trim: true,
      },

      twitter: {
        type: String,
        default: "",
        trim: true,
      },
    },

    /* =====================================================
       FEATURED EVENT
    ===================================================== */

    featured: {
      type: Boolean,
      default: false,
    },

    /* =====================================================
       DISPLAY ORDER
    ===================================================== */

    displayOrder: {
      type: Number,
      default: 1,
      min: 1,
    },

    /* =====================================================
       STATUS
    ===================================================== */

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("DepartmentEvent", departmentEventSchema);
