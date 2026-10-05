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

const featureSchema = new mongoose.Schema(
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
  { _id: false },
);

const classroomLabSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      required: true,
      unique: true,
      default: "classroom-lab",
    },

    /* =====================================================
       HERO SECTION
    ===================================================== */

    hero: {
      title: {
        type: String,
        default: "Class Rooms & Labs",
        trim: true,
      },

      subtitle: {
        type: String,
        default:
          "Modern learning spaces and practical facilities for academic excellence",
        trim: true,
      },

      breadcrumb: {
        type: String,
        default: "Home / Life @ IMSEC / Class Rooms & Labs",
        trim: true,
      },

      image: {
        type: imageSchema,
        default: () => ({}),
      },
    },

    /* =====================================================
       INTRODUCTION / ABOUT
    ===================================================== */

    about: {
      title: {
        type: String,
        default: "Modern Classrooms & Well-Equipped Laboratories",
        trim: true,
      },

      description: {
        type: String,
        default:
          "IMS Engineering College provides a comfortable and supportive academic environment through modern classrooms and well-equipped laboratories. The academic facilities are designed to support effective teaching, practical learning, experimentation, interaction and overall student development. Well-planned learning spaces and technology-enabled facilities help students connect theoretical concepts with practical applications.",
        trim: true,
      },

      additionalDescription: {
        type: String,
        default:
          "The classrooms provide a conducive environment for lectures, discussions, presentations and collaborative learning, while the laboratories provide opportunities for experimentation and hands-on practice. These facilities form an important part of the academic experience at IMSEC.",
        trim: true,
      },

      image: {
        type: imageSchema,
        default: () => ({}),
      },
    },

    /* =====================================================
       CLASSROOM FACILITIES
    ===================================================== */

    classrooms: {
      title: {
        type: String,
        default: "Modern & Comfortable Classrooms",
        trim: true,
      },

      description: {
        type: String,
        default:
          "The classrooms at IMSEC are designed to provide students with a comfortable, focused and interactive learning environment. Spacious academic spaces support lectures, classroom discussions, presentations and various teaching-learning activities.",
        trim: true,
      },

      features: {
        type: [featureSchema],
        default: [
          {
            title: "Spacious Learning Spaces",
            description:
              "Comfortable classrooms provide an appropriate environment for regular academic activities and student interaction.",
          },
          {
            title: "Modern Teaching Aids",
            description:
              "Teaching-learning activities are supported through modern instructional and presentation facilities.",
          },
          {
            title: "Interactive Learning",
            description:
              "Classroom spaces encourage interaction, discussion, presentations and collaborative learning.",
          },
          {
            title: "Comfortable Environment",
            description:
              "Well-maintained classrooms provide a pleasant and focused environment for students and faculty.",
          },
        ],
      },
    },

    /* =====================================================
       LABORATORIES
    ===================================================== */

    laboratories: {
      title: {
        type: String,
        default: "Well-Equipped Laboratories",
        trim: true,
      },

      description: {
        type: String,
        default:
          "Practical laboratories provide students with opportunities to apply classroom concepts through experimentation, observation and hands-on activities. The laboratory environment supports practical understanding and development of technical skills.",
        trim: true,
      },

      features: {
        type: [featureSchema],
        default: [
          {
            title: "Practical Learning",
            description:
              "Students can apply theoretical concepts through practical exercises and experiments.",
          },
          {
            title: "Hands-on Experience",
            description:
              "Laboratory activities provide opportunities to develop practical and technical skills.",
          },
          {
            title: "Experimental Learning",
            description:
              "Students gain experience through observation, experimentation, analysis and problem-solving activities.",
          },
          {
            title: "Academic Support",
            description:
              "Laboratories complement classroom teaching and strengthen conceptual understanding.",
          },
        ],
      },
    },

    /* =====================================================
       TECHNOLOGY / DIGITAL LEARNING
    ===================================================== */

    technology: {
      title: {
        type: String,
        default: "Technology-Enabled Learning",
        trim: true,
      },

      description: {
        type: String,
        default:
          "Technology-enabled classrooms and academic facilities support contemporary teaching methods, presentations, demonstrations and interactive learning. Digital resources help faculty make classroom teaching more engaging and effective.",
        trim: true,
      },

      features: {
        type: [featureSchema],
        default: [
          {
            title: "ICT-Enabled Teaching",
            description:
              "Technology-supported facilities assist faculty in delivering effective and engaging academic sessions.",
          },
          {
            title: "Audio-Visual Support",
            description:
              "Presentation and demonstration facilities support different teaching-learning methods.",
          },
          {
            title: "Digital Learning",
            description:
              "Digital resources can be incorporated into classroom teaching and academic activities.",
          },
        ],
      },
    },

    /* =====================================================
       LEARNING ENVIRONMENT
    ===================================================== */

    learningEnvironment: {
      title: {
        type: String,
        default: "A Conducive Learning Environment",
        trim: true,
      },

      description: {
        type: String,
        default:
          "The academic facilities at IMSEC are planned to create a disciplined, comfortable and supportive learning environment. Classrooms and laboratories together provide students with opportunities for conceptual learning, practical application and academic interaction.",
        trim: true,
      },

      features: {
        type: [featureSchema],
        default: [
          {
            title: "Focused Academic Environment",
            description:
              "Dedicated learning spaces help students maintain focus on academic activities.",
          },
          {
            title: "Student Interaction",
            description:
              "Classroom environments encourage communication and interaction between students and faculty.",
          },
          {
            title: "Theory to Practice",
            description:
              "Laboratory activities help students connect theoretical knowledge with practical applications.",
          },
          {
            title: "Overall Development",
            description:
              "Academic facilities contribute to the development of practical, analytical and problem-solving skills.",
          },
        ],
      },
    },

    /* =====================================================
       FACILITIES HIGHLIGHTS
    ===================================================== */

    highlights: {
      classroomTitle: {
        type: String,
        default: "Modern Classrooms",
        trim: true,
      },

      classroomDescription: {
        type: String,
        default:
          "Spacious and comfortable classrooms provide an effective environment for teaching, interaction and academic learning.",
        trim: true,
      },

      laboratoryTitle: {
        type: String,
        default: "Well-Equipped Laboratories",
        trim: true,
      },

      laboratoryDescription: {
        type: String,
        default:
          "Practical laboratories provide students with opportunities to apply theoretical concepts, conduct experiments and develop hands-on technical skills.",
        trim: true,
      },

      technologyTitle: {
        type: String,
        default: "ICT-Enabled Learning",
        trim: true,
      },

      technologyDescription: {
        type: String,
        default:
          "Technology-enabled facilities support modern teaching methods, presentations, demonstrations and interactive learning.",
        trim: true,
      },

      environmentTitle: {
        type: String,
        default: "Supportive Learning Environment",
        trim: true,
      },

      environmentDescription: {
        type: String,
        default:
          "Well-maintained academic spaces provide a comfortable and supportive environment for students and faculty.",
        trim: true,
      },
    },

    /* =====================================================
       ADDITIONAL INFORMATION
    ===================================================== */

    academicExperience: {
      title: {
        type: String,
        default: "Supporting Academic Excellence",
        trim: true,
      },

      description: {
        type: String,
        default:
          "The combination of modern classrooms, practical laboratories and technology-enabled learning facilities supports a balanced academic experience. Students get opportunities to learn concepts, participate in discussions, perform practical activities and develop skills required for their academic and professional growth.",
        trim: true,
      },
    },

    /* =====================================================
       CTA
    ===================================================== */

    cta: {
      title: {
        type: String,
        default: "Learning Beyond the Classroom",
        trim: true,
      },

      description: {
        type: String,
        default:
          "At IMSEC, classrooms and laboratories work together to provide students with meaningful opportunities for learning, experimentation and practical skill development.",
        trim: true,
      },
    },
  },

  {
    timestamps: true,
  },
);

const ClassroomLab = mongoose.model("ClassroomLab", classroomLabSchema);

export default ClassroomLab;
