import mongoose from "mongoose";

/* =========================================================
   HIGHLIGHT SCHEMA
========================================================= */

const infrastructureHighlightSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

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

    displayOrder: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  {
    _id: true,
  },
);

/* =========================================================
   FACILITY SCHEMA
========================================================= */

const infrastructureFacilitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    icon: {
      type: String,
      default: "desktop",
      trim: true,
    },

    displayOrder: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  {
    _id: true,
  },
);

/* =========================================================
   GALLERY SCHEMA
========================================================= */

const infrastructureGallerySchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
      trim: true,
    },

    publicId: {
      type: String,
      required: true,
      trim: true,
    },

    displayOrder: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  {
    _id: true,
  },
);

/* =========================================================
   MAIN INFRASTRUCTURE SCHEMA
========================================================= */

const departmentInfrastructureSchema = new mongoose.Schema(
  {
    /* =====================================================
         DEPARTMENT
      ===================================================== */

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      unique: true,
      index: true,
    },

    /* =====================================================
         MAIN INFRASTRUCTURE
      ===================================================== */

    title: {
      type: String,
      default: "Department Infrastructure",
      trim: true,
    },

    mainImage: {
      type: String,
      default: "",
      trim: true,
    },

    mainImagePublicId: {
      type: String,
      default: "",
      trim: true,
    },

    description1: {
      type: String,
      default: "",
      trim: true,
    },

    description2: {
      type: String,
      default: "",
      trim: true,
    },

    /* =====================================================
         INFRASTRUCTURE HIGHLIGHTS
      ===================================================== */

    highlights: {
      type: [infrastructureHighlightSchema],
      default: [],
    },

    /* =====================================================
         FACILITIES
      ===================================================== */

    facilities: {
      type: [infrastructureFacilitySchema],
      default: [],
    },

    /* =====================================================
         GALLERY
      ===================================================== */

    gallery: {
      type: [infrastructureGallerySchema],
      default: [],
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

export default mongoose.model(
  "DepartmentInfrastructure",
  departmentInfrastructureSchema,
);
