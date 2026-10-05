import ClassroomLab from "../models/ClassroomLab.js";
import cloudinary5 from "../config/cloudinaryConfig5.js";

/* =========================================================
   DEFAULT DATA
========================================================= */

export const DEFAULT_CLASSROOM_LAB_DATA = {
  singletonKey: "classroom-lab",

  hero: {
    title: "Class Rooms & Labs",
    subtitle:
      "Modern learning spaces and practical facilities for academic excellence",
    breadcrumb: "Home / Life @ IMSEC / Class Rooms & Labs",
    image: {
      url: "",
      publicId: "",
    },
  },

  about: {
    title: "Modern Classrooms & Well-Equipped Laboratories",
    description:
      "IMS Engineering College provides a comfortable and supportive academic environment through modern classrooms and well-equipped laboratories. The academic facilities are designed to support effective teaching, practical learning, experimentation, interaction and overall student development. Well-planned learning spaces and technology-enabled facilities help students connect theoretical concepts with practical applications.",
    additionalDescription:
      "The classrooms provide a conducive environment for lectures, discussions, presentations and collaborative learning, while the laboratories provide opportunities for experimentation and hands-on practice. These facilities form an important part of the academic experience at IMSEC.",
    image: {
      url: "",
      publicId: "",
    },
  },

  classrooms: {
    title: "Modern & Comfortable Classrooms",
    description:
      "The classrooms at IMSEC are designed to provide students with a comfortable, focused and interactive learning environment. Spacious academic spaces support lectures, classroom discussions, presentations and various teaching-learning activities.",
    features: [
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

  laboratories: {
    title: "Well-Equipped Laboratories",
    description:
      "Practical laboratories provide students with opportunities to apply classroom concepts through experimentation, observation and hands-on activities. The laboratory environment supports practical understanding and development of technical skills.",
    features: [
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

  technology: {
    title: "Technology-Enabled Learning",
    description:
      "Technology-enabled classrooms and academic facilities support contemporary teaching methods, presentations, demonstrations and interactive learning. Digital resources help faculty make classroom teaching more engaging and effective.",
    features: [
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

  learningEnvironment: {
    title: "A Conducive Learning Environment",
    description:
      "The academic facilities at IMSEC are planned to create a disciplined, comfortable and supportive learning environment. Classrooms and laboratories together provide students with opportunities for conceptual learning, practical application and academic interaction.",
    features: [
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

  highlights: {
    classroomTitle: "Modern Classrooms",
    classroomDescription:
      "Spacious and comfortable classrooms provide an effective environment for teaching, interaction and academic learning.",

    laboratoryTitle: "Well-Equipped Laboratories",
    laboratoryDescription:
      "Practical laboratories provide students with opportunities to apply theoretical concepts, conduct experiments and develop hands-on technical skills.",

    technologyTitle: "ICT-Enabled Learning",
    technologyDescription:
      "Technology-enabled facilities support modern teaching methods, presentations, demonstrations and interactive learning.",

    environmentTitle: "Supportive Learning Environment",
    environmentDescription:
      "Well-maintained academic spaces provide a comfortable and supportive environment for students and faculty.",
  },

  academicExperience: {
    title: "Supporting Academic Excellence",
    description:
      "The combination of modern classrooms, practical laboratories and technology-enabled learning facilities supports a balanced academic experience. Students get opportunities to learn concepts, participate in discussions, perform practical activities and develop skills required for their academic and professional growth.",
  },

  cta: {
    title: "Learning Beyond the Classroom",
    description:
      "At IMSEC, classrooms and laboratories work together to provide students with meaningful opportunities for learning, experimentation and practical skill development.",
  },
};

/* =========================================================
   GET /api/classroom-lab
   PUBLIC
========================================================= */

export const getClassroomLab = async (req, res) => {
  try {
    let data = await ClassroomLab.findOne({
      singletonKey: "classroom-lab",
    }).lean();

    if (!data) {
      data = await ClassroomLab.create(DEFAULT_CLASSROOM_LAB_DATA);

      data = data.toObject();
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get Classroom & Lab Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch Class Rooms & Labs data",
    });
  }
};

/* =========================================================
   GET /api/classroom-lab/admin
   PROTECTED
========================================================= */

export const getClassroomLabAdmin = async (req, res) => {
  try {
    let data = await ClassroomLab.findOne({
      singletonKey: "classroom-lab",
    });

    if (!data) {
      data = await ClassroomLab.create(DEFAULT_CLASSROOM_LAB_DATA);
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get Classroom & Lab Admin Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch Class Rooms & Labs admin data",
    });
  }
};

/* =========================================================
   CLOUDINARY UPLOAD
========================================================= */

const uploadImage = async (file) => {
  if (!file) return null;

  const result = await cloudinary5.uploader.upload(file.path, {
    folder: "life-imsec/classroom-labs",
    resource_type: "image",
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
};

/* =========================================================
   CLOUDINARY DELETE
========================================================= */

const deleteImage = async (publicId) => {
  if (!publicId) return;

  try {
    await cloudinary5.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary Delete Error:", error.message);
  }
};

/* =========================================================
   PUT /api/classroom-lab/admin
   PROTECTED
========================================================= */

export const updateClassroomLab = async (req, res) => {
  try {
    let parsedData = {};

    /* ---------------------------------------------
       Parse JSON data sent through FormData
    --------------------------------------------- */

    if (req.body?.data) {
      try {
        parsedData =
          typeof req.body.data === "string"
            ? JSON.parse(req.body.data)
            : req.body.data;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid classroom-lab data format",
        });
      }
    } else {
      parsedData = req.body || {};
    }

    /* ---------------------------------------------
       Find existing document
    --------------------------------------------- */

    let existing = await ClassroomLab.findOne({
      singletonKey: "classroom-lab",
    });

    if (!existing) {
      existing = await ClassroomLab.create(DEFAULT_CLASSROOM_LAB_DATA);
    }

    /* ---------------------------------------------
       Preserve existing images
    --------------------------------------------- */

    const heroImage = existing.hero?.image || {
      url: "",
      publicId: "",
    };

    const aboutImage = existing.about?.image || {
      url: "",
      publicId: "",
    };

    /* ---------------------------------------------
       Update normal fields
    --------------------------------------------- */

    if (parsedData.hero) {
      existing.hero.title = parsedData.hero.title ?? existing.hero.title;

      existing.hero.subtitle =
        parsedData.hero.subtitle ?? existing.hero.subtitle;

      existing.hero.breadcrumb =
        parsedData.hero.breadcrumb ?? existing.hero.breadcrumb;
    }

    if (parsedData.about) {
      existing.about.title = parsedData.about.title ?? existing.about.title;

      existing.about.description =
        parsedData.about.description ?? existing.about.description;

      existing.about.additionalDescription =
        parsedData.about.additionalDescription ??
        existing.about.additionalDescription;
    }

    if (parsedData.classrooms) {
      existing.classrooms.title =
        parsedData.classrooms.title ?? existing.classrooms.title;

      existing.classrooms.description =
        parsedData.classrooms.description ?? existing.classrooms.description;

      if (Array.isArray(parsedData.classrooms.features)) {
        existing.classrooms.features = parsedData.classrooms.features;
      }
    }

    if (parsedData.laboratories) {
      existing.laboratories.title =
        parsedData.laboratories.title ?? existing.laboratories.title;

      existing.laboratories.description =
        parsedData.laboratories.description ??
        existing.laboratories.description;

      if (Array.isArray(parsedData.laboratories.features)) {
        existing.laboratories.features = parsedData.laboratories.features;
      }
    }

    if (parsedData.technology) {
      existing.technology.title =
        parsedData.technology.title ?? existing.technology.title;

      existing.technology.description =
        parsedData.technology.description ?? existing.technology.description;

      if (Array.isArray(parsedData.technology.features)) {
        existing.technology.features = parsedData.technology.features;
      }
    }

    if (parsedData.learningEnvironment) {
      existing.learningEnvironment.title =
        parsedData.learningEnvironment.title ??
        existing.learningEnvironment.title;

      existing.learningEnvironment.description =
        parsedData.learningEnvironment.description ??
        existing.learningEnvironment.description;

      if (Array.isArray(parsedData.learningEnvironment.features)) {
        existing.learningEnvironment.features =
          parsedData.learningEnvironment.features;
      }
    }

    if (parsedData.highlights) {
      Object.keys(parsedData.highlights).forEach((key) => {
        if (parsedData.highlights[key] !== undefined) {
          existing.highlights[key] = parsedData.highlights[key];
        }
      });
    }

    if (parsedData.academicExperience) {
      existing.academicExperience.title =
        parsedData.academicExperience.title ??
        existing.academicExperience.title;

      existing.academicExperience.description =
        parsedData.academicExperience.description ??
        existing.academicExperience.description;
    }

    if (parsedData.cta) {
      existing.cta.title = parsedData.cta.title ?? existing.cta.title;

      existing.cta.description =
        parsedData.cta.description ?? existing.cta.description;
    }

    /* ---------------------------------------------
       Handle HERO IMAGE
    --------------------------------------------- */

    const heroFile = req.files?.find((file) => file.fieldname === "heroImage");

    if (heroFile) {
      const uploadedHero = await uploadImage(heroFile);

      if (existing.hero?.image?.publicId) {
        await deleteImage(existing.hero.image.publicId);
      }

      existing.hero.image = uploadedHero;
    } else {
      existing.hero.image = heroImage;
    }

    /* ---------------------------------------------
       Handle ABOUT IMAGE
    --------------------------------------------- */

    const aboutFile = req.files?.find(
      (file) => file.fieldname === "aboutImage",
    );

    if (aboutFile) {
      const uploadedAbout = await uploadImage(aboutFile);

      if (existing.about?.image?.publicId) {
        await deleteImage(existing.about.image.publicId);
      }

      existing.about.image = uploadedAbout;
    } else {
      existing.about.image = aboutImage;
    }

    /* ---------------------------------------------
       Save
    --------------------------------------------- */

    const savedData = await existing.save();

    return res.status(200).json({
      success: true,
      message: "Class Rooms & Labs updated successfully",
      data: savedData,
    });
  } catch (error) {
    console.error("Update Classroom & Lab Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update Class Rooms & Labs",
    });
  }
};

/* =========================================================
   POST /api/classroom-lab/admin/reset-defaults
   PROTECTED
========================================================= */

export const resetClassroomLabDefaults = async (req, res) => {
  try {
    const existing = await ClassroomLab.findOne({
      singletonKey: "classroom-lab",
    });

    /* ---------------------------------------------
       Delete uploaded images
    --------------------------------------------- */

    if (existing?.hero?.image?.publicId) {
      await deleteImage(existing.hero.image.publicId);
    }

    if (existing?.about?.image?.publicId) {
      await deleteImage(existing.about.image.publicId);
    }

    /* ---------------------------------------------
       Remove old document
    --------------------------------------------- */

    await ClassroomLab.deleteOne({
      singletonKey: "classroom-lab",
    });

    /* ---------------------------------------------
       Create fresh defaults
    --------------------------------------------- */

    const data = await ClassroomLab.create(DEFAULT_CLASSROOM_LAB_DATA);

    return res.status(200).json({
      success: true,
      message: "Class Rooms & Labs restored to default successfully",
      data,
    });
  } catch (error) {
    console.error("Reset Classroom & Lab Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to restore Class Rooms & Labs defaults",
    });
  }
};
