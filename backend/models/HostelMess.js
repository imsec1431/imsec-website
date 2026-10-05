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
  { _id: false },
);

const facilitySchema = new mongoose.Schema(
  {
    icon: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
  },
  { _id: false },
);

const hostelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    image: {
      type: imageSchema,
      default: () => ({}),
    },
    capacity: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    facilities: {
      type: [String],
      default: [],
    },
  },
  { _id: false },
);

const messItemSchema = new mongoose.Schema(
  {
    icon: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
  },
  { _id: false },
);

const menuSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      default: "",
    },
    breakfast: {
      type: String,
      default: "",
    },
    lunch: {
      type: String,
      default: "",
    },
    snacks: {
      type: String,
      default: "",
    },
    dinner: {
      type: String,
      default: "",
    },
  },
  { _id: false },
);

const statisticSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
  },
  { _id: false },
);

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      default: "",
    },
    answer: {
      type: String,
      default: "",
    },
  },
  { _id: false },
);

const hostelMessSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      required: true,
      unique: true,
      default: "hostel-mess",
    },

    hero: {
      title: {
        type: String,
        default: "Hostel & Mess",
      },
      breadcrumb: {
        type: String,
        default: "Home / Life @ IMSEC / Hostel & Mess",
      },
    },

    about: {
      tag: {
        type: String,
        default: "LIFE @ IMSEC",
      },
      title: {
        type: String,
        default: "Comfortable",
      },
      highlight: {
        type: String,
        default: "Hostel Living",
      },
      description1: {
        type: String,
        default: "",
      },
      description2: {
        type: String,
        default: "",
      },
      image: {
        type: imageSchema,
        default: () => ({}),
      },
    },

    boysHostels: {
      type: [hostelSchema],
      default: [],
    },

    girlsHostels: {
      type: [hostelSchema],
      default: [],
    },

    mess: {
      tag: {
        type: String,
        default: "MESS & DINING",
      },
      title: {
        type: String,
        default: "Healthy &",
      },
      highlight: {
        type: String,
        default: "Hygienic Food",
      },
      description: {
        type: String,
        default: "",
      },
      image: {
        type: imageSchema,
        default: () => ({}),
      },
      items: {
        type: [messItemSchema],
        default: [],
      },
    },

    facilities: {
      type: [facilitySchema],
      default: [],
    },

    gallery: {
      type: [imageSchema],
      default: [],
    },

    weeklyMenu: {
      type: [menuSchema],
      default: [],
    },

    rules: {
      type: [String],
      default: [],
    },

    statistics: {
      type: [statisticSchema],
      default: [],
    },

    faqs: {
      type: [faqSchema],
      default: [],
    },

    cta: {
      title: {
        type: String,
        default: "",
      },
      description: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  },
);

const HostelMess = mongoose.model("HostelMess", hostelMessSchema);

export default HostelMess;
