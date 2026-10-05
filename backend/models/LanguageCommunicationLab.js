import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, default: "" },
    publicId: { type: String, default: "" },
  },
  { _id: false },
);

const languageCommunicationLabSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      required: true,
      unique: true,
      default: "language-communication-lab",
    },

    hero: {
      title: {
        type: String,
        default: "Language & Communication Lab",
        trim: true,
      },
      subtitle: {
        type: String,
        default:
          "Developing effective communication and language skills for academic and professional growth",
        trim: true,
      },
      breadcrumb: {
        type: String,
        default: "Home / Life @ IMSEC / Language & Communication Lab",
        trim: true,
      },
      image: {
        type: imageSchema,
        default: () => ({}),
      },
    },

    about: {
      title: {
        type: String,
        default: "Language & Communication Lab",
        trim: true,
      },
      description: {
        type: String,
        default:
          "The Language & Communication Lab at IMSEC provides students with a supportive environment to improve their communication, language and presentation skills. The lab helps students develop confidence and effective communication abilities required for academic and professional success.",
        trim: true,
      },
      image: {
        type: imageSchema,
        default: () => ({}),
      },
    },

    features: [
      {
        title: {
          type: String,
          default: "",
          trim: true,
        },
        description: {
          type: String,
          default: "",
          trim: true,
        },
      },
    ],

    cta: {
      title: {
        type: String,
        default: "Enhancing Communication Skills",
        trim: true,
      },
      description: {
        type: String,
        default:
          "The lab supports students in developing language proficiency, communication skills, confidence and professional presentation abilities.",
        trim: true,
      },
    },
  },
  { timestamps: true },
);

const LanguageCommunicationLab = mongoose.model(
  "LanguageCommunicationLab",
  languageCommunicationLabSchema,
);

export default LanguageCommunicationLab;
