import ResearchPublicationContent from "../models/ResearchPublicationContent.js";

/* =========================================
   GET PAGE CONTENT
========================================= */

export const getResearchPublicationContent = async (req, res) => {
  try {
    let content = await ResearchPublicationContent.findOne();

    if (!content) {
      content = await ResearchPublicationContent.create({});
    }

    res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error("Get Research Publication Content Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch research publication page content",
    });
  }
};

/* =========================================
   UPDATE PAGE CONTENT
========================================= */

export const updateResearchPublicationContent = async (req, res) => {
  try {
    const {
      heroTitle,
      sectionTag,
      sectionTitle,
      aboutImage,
      aboutDescriptionOne,
      aboutDescriptionTwo,
      statistics,
      timeline,
      indexingDatabases,
      ctaTitle,
      ctaDescription,
    } = req.body;

    let content = await ResearchPublicationContent.findOne();

    if (!content) {
      content = new ResearchPublicationContent();
    }

    content.heroTitle = heroTitle?.trim() || "Research Publications";

    content.sectionTag = sectionTag?.trim() || "RESEARCH EXCELLENCE";

    content.sectionTitle = sectionTitle?.trim() || "Research Publications";

    content.aboutImage = aboutImage?.trim() || "";

    content.aboutDescriptionOne = aboutDescriptionOne?.trim() || "";

    content.aboutDescriptionTwo = aboutDescriptionTwo?.trim() || "";

    content.statistics = Array.isArray(statistics) ? statistics : [];

    content.timeline = Array.isArray(timeline) ? timeline : [];

    content.indexingDatabases = Array.isArray(indexingDatabases)
      ? indexingDatabases
      : [];

    content.ctaTitle =
      ctaTitle?.trim() || "Publish with Impact. Inspire Through Research.";

    content.ctaDescription = ctaDescription?.trim() || "";

    await content.save();

    res.status(200).json({
      success: true,
      message: "Research publication page content updated successfully",
      data: content,
    });
  } catch (error) {
    console.error("Update Research Publication Content Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to update page content",
    });
  }
};
