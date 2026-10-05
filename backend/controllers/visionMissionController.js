import VisionMission from "../models/VisionMission.js";

const getDefaultVisionMissionData = () => ({
  heroTitle: "Vision & Mission",

  heroBreadcrumb: "Home / About / Vision & Mission",

  introImage:
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80",

  introTitle: "Inspiring Future Leaders",

  introTitleHighlight: "Leaders",

  introDescription:
    "To become a globally recognized institution by providing quality education, promoting research, innovation, entrepreneurship and producing competent professionals with ethical values.",

  visionTitle: "Our Vision",

  visionDescription:
    "To become a globally recognized institution by providing quality education, promoting innovation, research, entrepreneurship and producing socially responsible professionals.",

  missionTitle: "Our Mission",

  missionItems: [
    "Provide quality technical education.",
    "Develop leadership and innovation.",
    "Promote industry collaboration.",
    "Encourage research and entrepreneurship.",
    "Build ethical and responsible professionals.",
  ],

  missionSectionTag: "OUR MISSION",

  missionSectionTitle: "What We Believe",

  missionSectionHighlight: "Believe",

  missionCards: [
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

  valuesSectionTitle: "Core Values",

  valuesSectionHighlight: "Values",

  values: [
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

  philosophyTitle: "Our Educational Philosophy",

  philosophyHighlight: "Philosophy",

  philosophyDescription:
    "IMSEC believes in holistic education where academic excellence, innovation, research, leadership and ethics together prepare students to become responsible professionals and global citizens.",

  philosophyImage:
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80",

  ctaTitle: "Shape Your Future With IMSEC",

  ctaDescription:
    "Join one of the leading engineering institutions committed to academic excellence and innovation.",

  isPublished: true,

  displayOrder: 1,
});

// =====================================================
// PUBLIC
// =====================================================

export const getPublicVisionMission = async (req, res) => {
  try {
    let data = await VisionMission.findOne({
      isPublished: true,
    }).sort({
      displayOrder: 1,
      createdAt: -1,
    });

    if (!data) {
      data = await VisionMission.create(getDefaultVisionMissionData());
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get Public Vision Mission Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load Vision & Mission.",
    });
  }
};

// =====================================================
// ADMIN GET
// =====================================================

export const getAdminVisionMission = async (req, res) => {
  try {
    let data = await VisionMission.findOne().sort({
      displayOrder: 1,
      createdAt: -1,
    });

    if (!data) {
      data = await VisionMission.create(getDefaultVisionMissionData());
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get Admin Vision Mission Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load Vision & Mission.",
    });
  }
};

// =====================================================
// CREATE
// =====================================================

export const createVisionMission = async (req, res) => {
  try {
    const data = await VisionMission.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Vision & Mission created successfully.",
      data,
    });
  } catch (error) {
    console.error("Create Vision Mission Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create Vision & Mission.",
    });
  }
};

// =====================================================
// UPDATE
// =====================================================

export const updateVisionMission = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await VisionMission.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Vision & Mission record not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vision & Mission updated successfully.",
      data,
    });
  } catch (error) {
    console.error("Update Vision Mission Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update Vision & Mission.",
    });
  }
};

// =====================================================
// PUBLISH
// =====================================================

export const publishVisionMission = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await VisionMission.findByIdAndUpdate(
      id,
      {
        isPublished: true,
      },
      {
        new: true,
      },
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Vision & Mission record not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vision & Mission published successfully.",
      data,
    });
  } catch (error) {
    console.error("Publish Vision Mission Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to publish Vision & Mission.",
    });
  }
};

// =====================================================
// UNPUBLISH
// =====================================================

export const unpublishVisionMission = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await VisionMission.findByIdAndUpdate(
      id,
      {
        isPublished: false,
      },
      {
        new: true,
      },
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Vision & Mission record not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vision & Mission unpublished successfully.",
      data,
    });
  } catch (error) {
    console.error("Unpublish Vision Mission Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to unpublish Vision & Mission.",
    });
  }
};

// =====================================================
// DELETE
// =====================================================

export const deleteVisionMission = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await VisionMission.findByIdAndDelete(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Vision & Mission record not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vision & Mission deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Vision Mission Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete Vision & Mission.",
    });
  }
};
