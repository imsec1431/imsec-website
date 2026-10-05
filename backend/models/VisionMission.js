import mongoose from "mongoose";

const missionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
      trim: true,
    },

    icon: {
      type: String,
      default: "🎓",
      trim: true,
    },

    desc: {
      type: String,
      default: "",
      trim: true,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  },
);

const valueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
      trim: true,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  },
);

const visionMissionSchema = new mongoose.Schema(
  {
    heroTitle: {
      type: String,
      default: "Vision & Mission",
      trim: true,
    },

    heroBreadcrumb: {
      type: String,
      default: "Home / About / Vision & Mission",
      trim: true,
    },

    introImage: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80",
      trim: true,
    },

    introTitle: {
      type: String,
      default: "Inspiring Future Leaders",
      trim: true,
    },

    introTitleHighlight: {
      type: String,
      default: "Leaders",
      trim: true,
    },

    introDescription: {
      type: String,
      default:
        "To become a globally recognized institution by providing quality education, promoting research, innovation, entrepreneurship and producing competent professionals with ethical values.",
      trim: true,
    },

    visionTitle: {
      type: String,
      default: "Our Vision",
      trim: true,
    },

    visionDescription: {
      type: String,
      default:
        "To become a globally recognized institution by providing quality education, promoting innovation, research, entrepreneurship and producing socially responsible professionals.",
      trim: true,
    },

    missionTitle: {
      type: String,
      default: "Our Mission",
      trim: true,
    },

    missionItems: {
      type: [String],
      default: [
        "Provide quality technical education.",
        "Develop leadership and innovation.",
        "Promote industry collaboration.",
        "Encourage research and entrepreneurship.",
        "Build ethical and responsible professionals.",
      ],
    },

    missionSectionTag: {
      type: String,
      default: "OUR MISSION",
      trim: true,
    },

    missionSectionTitle: {
      type: String,
      default: "What We Believe",
      trim: true,
    },

    missionSectionHighlight: {
      type: String,
      default: "Believe",
      trim: true,
    },

    missionCards: {
      type: [missionSchema],
      default: [
        {
          title: "Quality Education",
          icon: "🎓",
          desc: "Provide outcome-based quality technical education.",
          displayOrder: 1,
        },
        {
          title: "Research",
          icon: "🔬",
          desc: "Promote innovation and interdisciplinary research.",
          displayOrder: 2,
        },
        {
          title: "Industry Connect",
          icon: "🏢",
          desc: "Build strong collaboration with industries.",
          displayOrder: 3,
        },
        {
          title: "Leadership",
          icon: "👨‍💼",
          desc: "Develop ethical and responsible leaders.",
          displayOrder: 4,
        },
        {
          title: "Entrepreneurship",
          icon: "🚀",
          desc: "Encourage startup culture and innovation.",
          displayOrder: 5,
        },
        {
          title: "Global Exposure",
          icon: "🌎",
          desc: "Prepare students for global opportunities.",
          displayOrder: 6,
        },
      ],
    },

    valuesSectionTitle: {
      type: String,
      default: "Core Values",
      trim: true,
    },

    valuesSectionHighlight: {
      type: String,
      default: "Values",
      trim: true,
    },

    values: {
      type: [valueSchema],
      default: [
        {
          name: "Integrity",
          displayOrder: 1,
        },
        {
          name: "Innovation",
          displayOrder: 2,
        },
        {
          name: "Leadership",
          displayOrder: 3,
        },
        {
          name: "Excellence",
          displayOrder: 4,
        },
        {
          name: "Research",
          displayOrder: 5,
        },
        {
          name: "Team Work",
          displayOrder: 6,
        },
      ],
    },

    philosophyTitle: {
      type: String,
      default: "Our Educational Philosophy",
      trim: true,
    },

    philosophyHighlight: {
      type: String,
      default: "Philosophy",
      trim: true,
    },

    philosophyDescription: {
      type: String,
      default:
        "IMSEC believes in holistic education where academic excellence, innovation, research, leadership and ethics together prepare students to become responsible professionals and global citizens.",
      trim: true,
    },

    philosophyImage: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80",
      trim: true,
    },

    ctaTitle: {
      type: String,
      default: "Shape Your Future With IMSEC",
      trim: true,
    },

    ctaDescription: {
      type: String,
      default:
        "Join one of the leading engineering institutions committed to academic excellence and innovation.",
      trim: true,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },

    displayOrder: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

visionMissionSchema.index({
  isPublished: 1,
  displayOrder: 1,
});

const VisionMission = mongoose.model("VisionMission", visionMissionSchema);

export default VisionMission;
