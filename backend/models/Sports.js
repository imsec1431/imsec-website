import mongoose from "mongoose";

/* =========================================================
   SPORTS IMAGE SCHEMA
   ========================================================= */

const sportsImageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },

    publicId: {
      type: String,
      default: "",
      trim: true,
    },

    altText: {
      type: String,
      default: "IMSEC Sports Facility",
      trim: true,
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
   SPORTS FACILITY SCHEMA
   ========================================================= */

const sportsFacilitySchema = new mongoose.Schema(
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

    category: {
      type: String,
      enum: ["Outdoor", "Indoor", "Fitness"],
      default: "Outdoor",
    },

    imageUrl: {
      type: String,
      default: "",
      trim: true,
    },

    publicId: {
      type: String,
      default: "",
      trim: true,
    },

    order: {
      type: Number,
      default: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: true,
  },
);

/* =========================================================
   SPORTS ACHIEVEMENT SCHEMA
   ========================================================= */

const sportsAchievementSchema = new mongoose.Schema(
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

    year: {
      type: String,
      default: "",
      trim: true,
    },

    imageUrl: {
      type: String,
      default: "",
      trim: true,
    },

    publicId: {
      type: String,
      default: "",
      trim: true,
    },

    order: {
      type: Number,
      default: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: true,
  },
);

/* =========================================================
   MAIN SPORTS SCHEMA
   ========================================================= */

const sportsSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      required: true,
      unique: true,
      default: "sports",
    },

    /* -------------------------
       HERO
       ------------------------- */

    title: {
      type: String,
      required: true,
      trim: true,
      default: "Sports",
    },

    heroSubtitle: {
      type: String,
      required: true,
      trim: true,
      default: "Sports, Fitness & Recreation",
    },

    breadcrumb: {
      type: String,
      required: true,
      trim: true,
      default: "Home / Student Welfare / Sports",
    },

    /* -------------------------
       INTRODUCTION
       ------------------------- */

    heading: {
      type: String,
      required: true,
      trim: true,
      default: "Sports & Physical Fitness",
    },

    description: {
      type: String,
      required: true,
      trim: true,
      default:
        "The institute encourages students to participate in sports and physical fitness activities as an important part of holistic education. Sports provide opportunities to develop discipline, teamwork, leadership, confidence and a healthy lifestyle.",
    },

    /* -------------------------
       SPORTS COORDINATOR
       ------------------------- */

    coordinatorName: {
      type: String,
      required: true,
      trim: true,
      default: "Sports Coordinator",
    },

    coordinatorDesignation: {
      type: String,
      required: true,
      trim: true,
      default: "Coordinator, Sports & Physical Education",
    },

    coordinatorEmail: {
      type: String,
      default: "",
      trim: true,
    },

    coordinatorPhone: {
      type: String,
      default: "",
      trim: true,
    },

    /* -------------------------
       FACILITIES DESCRIPTION
       ------------------------- */

    outdoorHeading: {
      type: String,
      default: "Outdoor Sports Facilities",
      trim: true,
    },

    outdoorDescription: {
      type: String,
      default:
        "The institute provides outdoor sports facilities that encourage students to participate in regular practice, recreational activities and competitive events.",
      trim: true,
    },

    indoorHeading: {
      type: String,
      default: "Indoor Sports Facilities",
      trim: true,
    },

    indoorDescription: {
      type: String,
      default:
        "Indoor sports facilities provide students with opportunities to practice recreational and competitive indoor games throughout the year.",
      trim: true,
    },

    fitnessHeading: {
      type: String,
      default: "Fitness & Recreation",
      trim: true,
    },

    fitnessDescription: {
      type: String,
      default:
        "Fitness and recreational activities help students maintain physical fitness, improve endurance and develop healthy lifestyle habits.",
      trim: true,
    },

    /* -------------------------
       TRAINING
       ------------------------- */

    trainingHeading: {
      type: String,
      default: "Coaching & Training",
      trim: true,
    },

    trainingDescription: {
      type: String,
      default:
        "Students are encouraged to participate in regular practice and sports activities under appropriate guidance. Coaching and training opportunities may be organized for different sports according to institutional requirements.",
      trim: true,
    },

    /* -------------------------
       ACTIVITIES
       ------------------------- */

    activitiesHeading: {
      type: String,
      default: "Sports Activities & Events",
      trim: true,
    },

    activitiesDescription: {
      type: String,
      default:
        "The institute promotes participation in inter-college competitions, sports events, tournaments, fitness activities and other recreational programmes.",
      trim: true,
    },

    /* -------------------------
       TIMINGS
       ------------------------- */

    timingsHeading: {
      type: String,
      default: "Sports Facility Timings",
      trim: true,
    },

    timings: {
      type: String,
      default: "Monday to Saturday: 7:00 AM to 8:00 PM",
      trim: true,
    },

    /* -------------------------
       FACILITIES
       ------------------------- */

    facilities: {
      type: [sportsFacilitySchema],
      default: [],
    },

    /* -------------------------
       ACHIEVEMENTS
       ------------------------- */

    achievements: {
      type: [sportsAchievementSchema],
      default: [],
    },

    /* -------------------------
       GALLERY
       ------------------------- */

    images: {
      type: [sportsImageSchema],
      default: [],
    },

    /* -------------------------
       PUBLISH
       ------------------------- */

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
   DEFAULT DATA
   ========================================================= */

export const getDefaultSports = () => ({
  singletonKey: "sports",

  title: "Sports",

  heroSubtitle: "Sports, Fitness & Recreation",

  breadcrumb: "Home / Student Welfare / Sports",

  heading: "Sports & Physical Fitness",

  description:
    "The institute encourages students to participate in sports and physical fitness activities as an important part of holistic education. Sports provide opportunities to develop discipline, teamwork, leadership, confidence and a healthy lifestyle.",

  coordinatorName: "Sports Coordinator",

  coordinatorDesignation: "Coordinator, Sports & Physical Education",

  coordinatorEmail: "sports@imsec.ac.in",

  coordinatorPhone: "+91-120-4081999",

  outdoorHeading: "Outdoor Sports Facilities",

  outdoorDescription:
    "The institute provides outdoor sports facilities that encourage students to participate in regular practice, recreational activities and competitive events.",

  indoorHeading: "Indoor Sports Facilities",

  indoorDescription:
    "Indoor sports facilities provide students with opportunities to practice recreational and competitive indoor games throughout the year.",

  fitnessHeading: "Fitness & Recreation",

  fitnessDescription:
    "Fitness and recreational activities help students maintain physical fitness, improve endurance and develop healthy lifestyle habits.",

  trainingHeading: "Coaching & Training",

  trainingDescription:
    "Students are encouraged to participate in regular practice and sports activities under appropriate guidance. Coaching and training opportunities may be organized for different sports according to institutional requirements.",

  activitiesHeading: "Sports Activities & Events",

  activitiesDescription:
    "The institute promotes participation in inter-college competitions, sports events, tournaments, fitness activities and other recreational programmes.",

  timingsHeading: "Sports Facility Timings",

  timings: "Monday to Saturday: 7:00 AM to 8:00 PM",

  /* -------------------------
     DEFAULT FACILITIES
     ------------------------- */

  facilities: [
    {
      title: "Cricket",
      description: "Facilities for cricket practice and recreational play.",
      category: "Outdoor",
      order: 1,
      isActive: true,
    },
    {
      title: "Football",
      description:
        "Outdoor football facility for practice and student activities.",
      category: "Outdoor",
      order: 2,
      isActive: true,
    },
    {
      title: "Basketball",
      description:
        "Basketball facility for regular practice and recreational activities.",
      category: "Outdoor",
      order: 3,
      isActive: true,
    },
    {
      title: "Volleyball",
      description:
        "Volleyball facility for practice, recreation and competitions.",
      category: "Outdoor",
      order: 4,
      isActive: true,
    },
    {
      title: "Badminton",
      description: "Indoor badminton facility for regular student practice.",
      category: "Indoor",
      order: 5,
      isActive: true,
    },
    {
      title: "Table Tennis",
      description:
        "Indoor table tennis facility for recreational and competitive practice.",
      category: "Indoor",
      order: 6,
      isActive: true,
    },
    {
      title: "Chess & Carrom",
      description: "Indoor recreational games for students.",
      category: "Indoor",
      order: 7,
      isActive: true,
    },
    {
      title: "Gym & Fitness",
      description:
        "Fitness facilities supporting physical conditioning and healthy lifestyle activities.",
      category: "Fitness",
      order: 8,
      isActive: true,
    },
  ],

  /* -------------------------
     DEFAULT ACHIEVEMENTS
     ------------------------- */

  achievements: [
    {
      title: "Inter-College Sports Participation",
      description:
        "Students are encouraged to represent the institute in inter-college and university-level sporting events.",
      year: "2026",
      order: 1,
      isActive: true,
    },
    {
      title: "Annual Sports Activities",
      description:
        "The institute promotes annual sports activities and competitions for student participation.",
      year: "2026",
      order: 2,
      isActive: true,
    },
  ],

  /* -------------------------
     DEFAULT IMAGES
     ------------------------- */

  images: [
    {
      title: "Sports & Fitness",
      imageUrl:
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1400&q=85",
      publicId: "",
      altText: "Sports and athletics facility",
      order: 1,
    },
    {
      title: "Basketball Facility",
      imageUrl:
        "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1400&q=85",
      publicId: "",
      altText: "Basketball sports facility",
      order: 2,
    },
    {
      title: "Football Facility",
      imageUrl:
        "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1400&q=85",
      publicId: "",
      altText: "Football sports facility",
      order: 3,
    },
    {
      title: "Fitness Activity",
      imageUrl:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1400&q=85",
      publicId: "",
      altText: "Fitness activity",
      order: 4,
    },
  ],

  published: true,
});

/* =========================================================
   MODEL
   ========================================================= */

const Sports = mongoose.models.Sports || mongoose.model("Sports", sportsSchema);

export default Sports;
