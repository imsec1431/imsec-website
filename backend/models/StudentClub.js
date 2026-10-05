import mongoose from "mongoose";

/* =========================================================
   IMAGE SCHEMA
========================================================= */

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

/* =========================================================
   COORDINATOR SCHEMA
========================================================= */

const coordinatorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
      trim: true,
    },

    mobile: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      type: imageSchema,
      default: () => ({}),
    },
  },
  {
    _id: false,
  },
);

/* =========================================================
   CLUB SCHEMA
========================================================= */

const clubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    /* -----------------------------------------------------
       CLUB IMAGE
    ----------------------------------------------------- */

    image: {
      type: imageSchema,
      default: () => ({}),
    },

    /* -----------------------------------------------------
       COORDINATOR
    ----------------------------------------------------- */

    coordinator: {
      type: coordinatorSchema,
      default: () => ({}),
    },
  },
  {
    _id: true,
  },
);

/* =========================================================
   STUDENT CLUB SCHEMA
========================================================= */

const studentClubSchema = new mongoose.Schema(
  {
    /*
     * Only one Student Clubs document is required.
     */
    singletonKey: {
      type: String,
      required: true,
      unique: true,
      default: "student-clubs",
    },

    /* -----------------------------------------------------
       HERO / PAGE SETTINGS
    ----------------------------------------------------- */

    hero: {
      title: {
        type: String,
        default: "Student Clubs",
        trim: true,
      },

      subtitle: {
        type: String,
        default: "Explore student clubs and activities at IMSEC",
        trim: true,
      },

      breadcrumb: {
        type: String,
        default: "Home / Life @ IMSEC / Student Clubs",
        trim: true,
      },
    },

    /* -----------------------------------------------------
       CLUBS
    ----------------------------------------------------- */

    clubs: {
      type: [clubSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

/* =========================================================
   MODEL
========================================================= */

const StudentClub = mongoose.model("StudentClub", studentClubSchema);

export default StudentClub;
