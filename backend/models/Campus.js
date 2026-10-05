import mongoose from "mongoose";

const campusSchema = new mongoose.Schema(
  {
    overviewImage: {
      type: String,
      default: "",
      trim: true,
    },

    overviewTag: {
      type: String,
      default: "CAMPUS OVERVIEW",
      trim: true,
    },

    overviewTitle: {
      type: String,
      default: "Discover the IMSEC Campus",
      trim: true,
    },

    overviewDescription: {
      type: String,
      default: "",
      trim: true,
    },

    overviewStats: [
      {
        value: {
          type: String,
          trim: true,
        },
        label: {
          type: String,
          trim: true,
        },
        displayOrder: {
          type: Number,
          default: 0,
        },
      },
    ],

    gallery: [
      {
        title: {
          type: String,
          trim: true,
        },
        image: {
          type: String,
          trim: true,
        },
        displayOrder: {
          type: Number,
          default: 0,
        },
      },
    ],

    facilities: [
      {
        icon: {
          type: String,
          enum: [
            "BookOpen",
            "Computer",
            "Building",
            "Futbol",
            "Wifi",
            "Laptop",
          ],
          default: "Building",
        },
        title: {
          type: String,
          trim: true,
        },
        displayOrder: {
          type: Number,
          default: 0,
        },
      },
    ],

    tourImage: {
      type: String,
      default: "",
      trim: true,
    },

    tourTag: {
      type: String,
      default: "VIRTUAL CAMPUS TOUR",
      trim: true,
    },

    tourTitle: {
      type: String,
      default: "Explore Our Campus Virtually",
      trim: true,
    },

    tourDescription: {
      type: String,
      default: "",
      trim: true,
    },

    tourVideoLink: {
      type: String,
      default: "https://www.youtube.com/",
      trim: true,
    },

    tourButtonText: {
      type: String,
      default: "Watch Tour",
      trim: true,
    },

    greenTag: {
      type: String,
      default: "GREEN CAMPUS",
      trim: true,
    },

    greenTitle: {
      type: String,
      default: "Sustainable & Eco Friendly",
      trim: true,
    },

    greenDescription: {
      type: String,
      default: "",
      trim: true,
    },

    greenCardTitle: {
      type: String,
      default: "Green Environment",
      trim: true,
    },

    greenCardDescription: {
      type: String,
      default: "",
      trim: true,
    },

    studentLifeTag: {
      type: String,
      default: "STUDENT LIFE",
      trim: true,
    },

    studentLifeTitle: {
      type: String,
      default: "Life at IMSEC",
      trim: true,
    },

    studentLife: [
      {
        title: {
          type: String,
          trim: true,
        },
        displayOrder: {
          type: Number,
          default: 0,
        },
      },
    ],

    ctaTitle: {
      type: String,
      default: "Visit Our Beautiful Campus",
      trim: true,
    },

    ctaDescription: {
      type: String,
      default: "",
      trim: true,
    },

    isPublished: {
      type: Boolean,
      default: true,
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

campusSchema.index({
  isPublished: 1,
  displayOrder: 1,
});

const Campus = mongoose.model("Campus", campusSchema);

export default Campus;
