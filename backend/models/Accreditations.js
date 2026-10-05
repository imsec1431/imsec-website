import mongoose from "mongoose";

/* =========================================================
   ACCREDITATION RECORD
   ========================================================= */

const accreditationRecordSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    accreditationBody: {
      type: String,
      default: "",
      trim: true,
    },

    validity: {
      type: String,
      default: "",
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

/* =========================================================
   MAIN ACCREDITATIONS MODEL
   ========================================================= */

const accreditationsSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      required: true,
      unique: true,
      default: "accreditations",
    },

    title: {
      type: String,
      required: true,
      trim: true,
      default: "Accreditations",
    },

    description: {
      type: String,
      default: "Institutional accreditations and recognitions of IMSEC.",
      trim: true,
    },

    published: {
      type: Boolean,
      default: true,
    },

    records: {
      type: [accreditationRecordSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

/* =========================================================
   DEFAULT DATA
   ========================================================= */

export const getDefaultAccreditations = () => ({
  singletonKey: "accreditations",

  title: "Accreditations",

  description: "Institutional accreditations and recognitions of IMSEC.",

  published: true,

  records: [
    {
      title: "NAAC Accreditation",

      description:
        "Institutional accreditation information and quality assurance details.",

      accreditationBody: "National Assessment and Accreditation Council",

      validity: "",

      photoUrl: "",

      photoPublicId: "",

      linkUrl: "",

      certificateUrl: "",

      isActive: true,

      order: 1,
    },

    {
      title: "NBA Accreditation",

      description:
        "Programme accreditation information and related quality standards.",

      accreditationBody: "National Board of Accreditation",

      validity: "",

      photoUrl: "",

      photoPublicId: "",

      linkUrl: "",

      certificateUrl: "",

      isActive: true,

      order: 2,
    },
  ],
});

/* =========================================================
   MODEL
   ========================================================= */

const Accreditations =
  mongoose.models.Accreditations ||
  mongoose.model("Accreditations", accreditationsSchema);

export default Accreditations;
