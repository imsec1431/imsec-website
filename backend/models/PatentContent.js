import mongoose from "mongoose";

const PatentContentSchema = new mongoose.Schema(
  {
    // About Section
    sectionTag: {
      type: String,
      default: "RESEARCH & INNOVATION",
    },
    title: {
      type: String,
      default: "Intellectual Property & Patents",
    },
    aboutImage: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=1200&q=80",
    },
    description1: {
      type: String,
      default:
        "IMS Engineering College promotes innovation, creativity and intellectual property through quality research and patent filing. Faculty members and students are encouraged to transform innovative ideas into valuable intellectual assets.",
    },
    description2: {
      type: String,
      default:
        "The institute actively supports patent drafting, filing, publication and commercialization through its Research & Development Cell.",
    },

    // Custom Stats Counters (Optional override for custom labels)
    stats: [
      {
        number: { type: String, default: "150+" },
        title: { type: String, default: "Patent Filed" },
      },
    ],

    // Patent Timeline (Year Wise Progress)
    timeline: [
      {
        year: { type: String, required: true },
        count: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const PatentContent = mongoose.model("PatentContent", PatentContentSchema);

export default PatentContent;
