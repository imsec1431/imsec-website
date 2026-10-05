import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      default: "",
    },

    publicId: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  },
);

const cafeteriaSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      required: true,
      unique: true,
      default: "cafeteria",
    },

    /*
    |--------------------------------------------------------------------------
    | Hero
    |--------------------------------------------------------------------------
    */

    hero: {
      title: {
        type: String,
        default: "Cafeteria",
      },

      breadcrumb: {
        type: String,
        default: "Home / Life @ IMSEC / Cafeteria",
      },

      image: {
        type: imageSchema,
        default: () => ({}),
      },
    },

    /*
    |--------------------------------------------------------------------------
    | About Cafeteria
    |--------------------------------------------------------------------------
    */

    about: {
      title: {
        type: String,
        default: "A Place to Relax & Refresh",
      },

      description: {
        type: String,
        default:
          "The cafeteria at IMS Engineering College provides students and staff with a comfortable and welcoming space to relax, refresh and enjoy meals during the academic day.",
      },

      image: {
        type: imageSchema,
        default: () => ({}),
      },
    },
  },
  {
    timestamps: true,
  },
);

const Cafeteria = mongoose.model("Cafeteria", cafeteriaSchema);

export default Cafeteria;
