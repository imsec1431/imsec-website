import mongoose from "mongoose";

/* =========================================================
   HOMEPAGE POPUP
========================================================= */

const homepagePopupSchema = new mongoose.Schema(
  {
    /* -----------------------------------------------------
       POPUP TITLE
    ----------------------------------------------------- */

    title: {
      type: String,
      required: [true, "Popup title is required."],
      trim: true,
    },

    /* -----------------------------------------------------
       POPUP TYPE
    ----------------------------------------------------- */

    type: {
      type: String,
      enum: ["image", "pdf"],
      default: "image",
    },

    /* -----------------------------------------------------
       POPUP FILE URL
       
       This can be:
       - Cloudinary image URL
       - PDF URL
       - Any valid public file URL
    ----------------------------------------------------- */

    filePath: {
      type: String,
      required: [true, "Popup file is required."],
      trim: true,
    },

    /* -----------------------------------------------------
       ORIGINAL FILE NAME
    ----------------------------------------------------- */

    fileName: {
      type: String,
      default: "",
      trim: true,
    },

    /* -----------------------------------------------------
       CLOUDINARY PUBLIC ID
       
       Kept for existing upload/delete functionality.
    ----------------------------------------------------- */

    publicId: {
      type: String,
      default: "",
      trim: true,
    },

    /* -----------------------------------------------------
       ACTIVE / INACTIVE
       
       MULTIPLE POPUPS CAN BE ACTIVE.
    ----------------------------------------------------- */

    isActive: {
      type: Boolean,
      default: true,
    },

    /* -----------------------------------------------------
       DISPLAY ORDER
       
       1 = first popup
       2 = second popup
       3 = third popup
    ----------------------------------------------------- */

    displayOrder: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

/* =========================================================
   INDEX
========================================================= */

homepagePopupSchema.index({
  isActive: 1,
  displayOrder: 1,
});

/* =========================================================
   POPUP ROTATION SETTINGS
       
   ONE SINGLE DOCUMENT.
========================================================= */

const homepagePopupSettingsSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      required: true,
      unique: true,
      default: "homepage-popup-settings",
    },

    /* -----------------------------------------------------
       ENABLE / DISABLE AUTOMATIC ROTATION
    ----------------------------------------------------- */

    rotationEnabled: {
      type: Boolean,
      default: true,
    },

    /* -----------------------------------------------------
       ROTATION INTERVAL

       Stored in SECONDS.

       Example:
       5  = every 5 seconds
       10 = every 10 seconds
       30 = every 30 seconds
       60 = every 1 minute
    ----------------------------------------------------- */

    rotationInterval: {
      type: Number,
      default: 5,
      min: 2,
      max: 300,
    },

    /* -----------------------------------------------------
       PUBLISH / UNPUBLISH POPUP SECTION
    ----------------------------------------------------- */

    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

/* =========================================================
   DEFAULT SETTINGS
========================================================= */

export const getDefaultHomepagePopupSettings = () => ({
  singletonKey: "homepage-popup-settings",

  rotationEnabled: true,

  rotationInterval: 5,

  published: true,
});

/* =========================================================
   MODELS
========================================================= */

const HomepagePopup =
  mongoose.models.HomepagePopup ||
  mongoose.model("HomepagePopup", homepagePopupSchema);

const HomepagePopupSettings =
  mongoose.models.HomepagePopupSettings ||
  mongoose.model("HomepagePopupSettings", homepagePopupSettingsSchema);

/* =========================================================
   EXPORT
========================================================= */

export { HomepagePopup, HomepagePopupSettings };

export default HomepagePopup;
