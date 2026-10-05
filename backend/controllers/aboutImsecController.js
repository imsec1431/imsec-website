import AboutImsec from "../models/AboutImsec.js";

/* =========================================================
   DEFAULT ABOUT IMSEC DATA
========================================================= */

const getDefaultAboutData = () => ({
  heroTitle: "About IMSEC",
  heroBreadcrumb: "Home / About / Overview",

  aboutImage:
    "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=80",

  aboutTag: "ABOUT IMSEC",

  aboutTitle: "IMS Engineering College, Ghaziabad",

  aboutTitleHighlight: "Ghaziabad",

  aboutDescription1:
    "IMS Engineering College (IMSEC), Ghaziabad, established in 2002, is one of the leading engineering institutions in North India. IMSEC is approved by AICTE, affiliated with Dr. A.P.J. Abdul Kalam Technical University (AKTU), Lucknow, and offers world-class infrastructure, experienced faculty, modern laboratories, research facilities, and excellent placement opportunities.",

  aboutDescription2:
    "The institute is dedicated to creating technically competent professionals through innovation, research, entrepreneurship, and industry collaboration.",

  highlights: [
    {
      title: "Established in 2002",
      description:
        "Over two decades of excellence in engineering and management education.",
      displayOrder: 1,
    },
    {
      title: "NAAC & NBA Accredited",
      description:
        "Committed to maintaining the highest standards of quality education.",
      displayOrder: 2,
    },
    {
      title: "Industry Collaboration",
      description:
        "Strong partnerships with leading industries for better learning and placements.",
      displayOrder: 3,
    },
  ],

  visionTag: "OUR VISION",

  visionTitle: "Our Vision",

  visionDescription:
    "To become a globally recognized institution by providing quality education, promoting innovation, research, entrepreneurship and producing socially responsible professionals.",

  missionTag: "OUR MISSION",

  missionTitle: "Our Mission",

  missionItems: [
    {
      text: "Provide quality technical education.",
      displayOrder: 1,
    },
    {
      text: "Develop leadership and innovation.",
      displayOrder: 2,
    },
    {
      text: "Promote industry collaboration.",
      displayOrder: 3,
    },
    {
      text: "Encourage research and entrepreneurship.",
      displayOrder: 4,
    },
    {
      text: "Build ethical and responsible professionals.",
      displayOrder: 5,
    },
  ],

  whyChooseTag: "WHY IMSEC",

  whyChooseTitle: "Why Choose IMSEC?",

  whyChooseDescription:
    "At IMSEC, students experience quality education, industry exposure, research opportunities and excellent placements that prepare them for successful careers.",

  whyChooseItems: [
    {
      icon: "🎓",
      title: "Quality Education",
      text: "Outcome-based education with experienced faculty.",
      displayOrder: 1,
    },
    {
      icon: "💼",
      title: "Excellent Placements",
      text: "250+ recruiters and outstanding placement records.",
      displayOrder: 2,
    },
    {
      icon: "🔬",
      title: "Research & Innovation",
      text: "Modern research labs and innovation ecosystem.",
      displayOrder: 3,
    },
    {
      icon: "🏢",
      title: "Industry Collaboration",
      text: "MoUs with industries for internships and training.",
      displayOrder: 4,
    },
    {
      icon: "🏆",
      title: "Student Achievements",
      text: "National level awards, hackathons and competitions.",
      displayOrder: 5,
    },
    {
      icon: "🌳",
      title: "Modern Campus",
      text: "Green campus with world-class infrastructure.",
      displayOrder: 6,
    },
  ],

  facilities: [
    {
      title: "Central Library",
      image:
        "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&q=80",
      displayOrder: 1,
    },
    {
      title: "Modern Laboratories",
      image:
        "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=1200&q=80",
      displayOrder: 2,
    },
    {
      title: "Smart Classrooms",
      image:
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&q=80",
      displayOrder: 3,
    },
    {
      title: "Sports Complex",
      image:
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=80",
      displayOrder: 4,
    },
    {
      title: "Hostel Facility",
      image:
        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&q=80",
      displayOrder: 5,
    },
    {
      title: "Innovation Center",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80",
      displayOrder: 6,
    },
  ],

  facilityTag: "CAMPUS LIFE",

  facilityTitle: "World-Class Facilities",

  facilityDescription:
    "IMSEC provides students with modern infrastructure, smart classrooms, laboratories, library, sports facilities and a vibrant campus environment.",

  ctaTitle: "Ready to Begin Your Journey at IMSEC?",

  ctaDescription:
    "Join one of the leading engineering institutions and shape your future with quality education, innovation, and excellent placements.",

  isPublished: true,

  displayOrder: 1,
});

/* =========================================================
   GET PUBLIC ABOUT IMSEC
========================================================= */

export const getPublicAboutImsec = async (req, res) => {
  try {
    let about = await AboutImsec.findOne({
      isPublished: true,
    }).sort({
      displayOrder: 1,
    });

    /*
      If no record exists, automatically create
      the default About IMSEC data.
    */

    if (!about) {
      about = await AboutImsec.create(getDefaultAboutData());
    }

    return res.status(200).json({
      success: true,
      data: about,
    });
  } catch (error) {
    console.error("Get Public About IMSEC Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch About IMSEC data.",
      error: error.message,
    });
  }
};

/* =========================================================
   GET ADMIN ABOUT IMSEC
========================================================= */

export const getAdminAboutImsec = async (req, res) => {
  try {
    let about = await AboutImsec.findOne().sort({
      displayOrder: 1,
    });

    /*
      Automatically create default data
      when admin opens the module for first time.
    */

    if (!about) {
      about = await AboutImsec.create(getDefaultAboutData());
    }

    return res.status(200).json({
      success: true,
      data: about,
    });
  } catch (error) {
    console.error("Get Admin About IMSEC Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch About IMSEC data.",
      error: error.message,
    });
  }
};

/* =========================================================
   CREATE ABOUT IMSEC
========================================================= */

export const createAboutImsec = async (req, res) => {
  try {
    const existingAbout = await AboutImsec.findOne();

    if (existingAbout) {
      return res.status(400).json({
        success: false,
        message:
          "About IMSEC data already exists. Please update the existing record.",
      });
    }

    const about = await AboutImsec.create(req.body);

    return res.status(201).json({
      success: true,
      message: "About IMSEC data created successfully.",
      data: about,
    });
  } catch (error) {
    console.error("Create About IMSEC Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create About IMSEC data.",
      error: error.message,
    });
  }
};

/* =========================================================
   UPDATE ABOUT IMSEC
========================================================= */

export const updateAboutImsec = async (req, res) => {
  try {
    const { id } = req.params;

    const about = await AboutImsec.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!about) {
      return res.status(404).json({
        success: false,
        message: "About IMSEC data not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "About IMSEC data updated successfully.",
      data: about,
    });
  } catch (error) {
    console.error("Update About IMSEC Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update About IMSEC data.",
      error: error.message,
    });
  }
};

/* =========================================================
   PUBLISH
========================================================= */

export const publishAboutImsec = async (req, res) => {
  try {
    const { id } = req.params;

    const about = await AboutImsec.findByIdAndUpdate(
      id,
      {
        isPublished: true,
      },
      {
        new: true,
      },
    );

    if (!about) {
      return res.status(404).json({
        success: false,
        message: "About IMSEC data not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "About IMSEC published successfully.",
      data: about,
    });
  } catch (error) {
    console.error("Publish About IMSEC Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to publish About IMSEC.",
      error: error.message,
    });
  }
};

/* =========================================================
   UNPUBLISH
========================================================= */

export const unpublishAboutImsec = async (req, res) => {
  try {
    const { id } = req.params;

    const about = await AboutImsec.findByIdAndUpdate(
      id,
      {
        isPublished: false,
      },
      {
        new: true,
      },
    );

    if (!about) {
      return res.status(404).json({
        success: false,
        message: "About IMSEC data not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "About IMSEC unpublished successfully.",
      data: about,
    });
  } catch (error) {
    console.error("Unpublish About IMSEC Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to unpublish About IMSEC.",
      error: error.message,
    });
  }
};

/* =========================================================
   DELETE
========================================================= */

export const deleteAboutImsec = async (req, res) => {
  try {
    const { id } = req.params;

    const about = await AboutImsec.findByIdAndDelete(id);

    if (!about) {
      return res.status(404).json({
        success: false,
        message: "About IMSEC data not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "About IMSEC data deleted successfully.",
    });
  } catch (error) {
    console.error("Delete About IMSEC Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete About IMSEC data.",
      error: error.message,
    });
  }
};
