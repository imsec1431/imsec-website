import ConferencePaperContent from "../models/ConferencePaperContent.js";

/* =========================================
   GET COMPLETE CONFERENCE PAGE CONTENT
========================================= */

export const getConferencePaperContent = async (req, res) => {
  try {
    let content = await ConferencePaperContent.findOne();

    /*
      This collection keeps one document only:
      Hero, About, Statistics, Timeline,
      Categories and CTA.
    */
    if (!content) {
      content = await ConferencePaperContent.create({});
    }

    res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error("Get Conference Content Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch conference page content",
    });
  }
};

/* =========================================
   UPDATE COMPLETE CONFERENCE PAGE CONTENT
========================================= */

export const updateConferencePaperContent = async (req, res) => {
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
      conferenceCategories,
      ctaTitle,
      ctaDescription,
    } = req.body;

    let content = await ConferencePaperContent.findOne();

    if (!content) {
      content = new ConferencePaperContent();
    }

    content.heroTitle = heroTitle?.trim() || "Conference Publications";

    content.sectionTag = sectionTag?.trim() || "RESEARCH DISSEMINATION";

    content.sectionTitle = sectionTitle?.trim() || "Conference Publications";

    content.aboutImage = aboutImage?.trim() || "";

    content.aboutDescriptionOne = aboutDescriptionOne?.trim() || "";

    content.aboutDescriptionTwo = aboutDescriptionTwo?.trim() || "";

    content.statistics = Array.isArray(statistics) ? statistics : [];

    content.timeline = Array.isArray(timeline) ? timeline : [];

    content.conferenceCategories = Array.isArray(conferenceCategories)
      ? conferenceCategories
      : [];

    content.ctaTitle =
      ctaTitle?.trim() || "Present Research. Build Global Connections.";

    content.ctaDescription = ctaDescription?.trim() || "";

    await content.save();

    res.status(200).json({
      success: true,
      message: "Conference page content updated successfully",
      data: content,
    });
  } catch (error) {
    console.error("Update Conference Content Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to update conference page content",
    });
  }
};
