import ConferencePaper from "../models/ConferencePaper.js";

const getPaperData = (body) => ({
  paperTitle: body.paperTitle?.trim(),

  authors: body.authors?.trim(),

  department: body.department?.trim(),

  conferenceName: body.conferenceName?.trim(),

  conferenceVenue: body.conferenceVenue?.trim() || "",

  conferenceDate: body.conferenceDate || null,

  publicationYear: Number(body.publicationYear),

  identifier: body.identifier?.trim() || "",

  publisher: body.publisher?.trim() || "",

  indexingDatabase: body.indexingDatabase?.trim() || "",

  isbn: body.isbn?.trim() || "",

  doi: body.doi?.trim() || "",

  paperLink: body.paperLink?.trim() || "",

  status: body.status || "Active",

  displayOrder: Number(body.displayOrder) || 1,
});

const validatePaper = (paper) => {
  if (!paper.paperTitle) {
    return "Paper title is required";
  }

  if (!paper.authors) {
    return "Author name is required";
  }

  if (!paper.department) {
    return "Department is required";
  }

  if (!paper.conferenceName) {
    return "Conference name is required";
  }

  if (
    !Number.isInteger(paper.publicationYear) ||
    paper.publicationYear < 1900 ||
    paper.publicationYear > 3000
  ) {
    return "A valid publication year is required";
  }

  if (!["Active", "Inactive"].includes(paper.status)) {
    return "Status must be Active or Inactive";
  }

  if (!Number.isFinite(paper.displayOrder) || paper.displayOrder < 1) {
    return "Display order must be at least 1";
  }

  return "";
};

/* =========================================
   GET ALL CONFERENCE PAPERS
========================================= */

export const getConferencePapers = async (req, res) => {
  try {
    const papers = await ConferencePaper.find().sort({
      displayOrder: 1,
      publicationYear: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: papers.length,
      data: papers,
    });
  } catch (error) {
    console.error("Get Conference Papers Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch conference papers",
    });
  }
};

/* =========================================
   GET SINGLE CONFERENCE PAPER
========================================= */

export const getConferencePaper = async (req, res) => {
  try {
    const paper = await ConferencePaper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: "Conference paper not found",
      });
    }

    res.status(200).json({
      success: true,
      data: paper,
    });
  } catch (error) {
    console.error("Get Conference Paper Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch conference paper",
    });
  }
};

/* =========================================
   CREATE CONFERENCE PAPER
========================================= */

export const createConferencePaper = async (req, res) => {
  try {
    const paperData = getPaperData(req.body);

    const validationError = validatePaper(paperData);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const paper = await ConferencePaper.create(paperData);

    res.status(201).json({
      success: true,
      message: "Conference paper added successfully",
      data: paper,
    });
  } catch (error) {
    console.error("Create Conference Paper Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to add conference paper",
    });
  }
};

/* =========================================
   UPDATE CONFERENCE PAPER
========================================= */

export const updateConferencePaper = async (req, res) => {
  try {
    const paperData = getPaperData(req.body);

    const validationError = validatePaper(paperData);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const paper = await ConferencePaper.findByIdAndUpdate(
      req.params.id,
      paperData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: "Conference paper not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Conference paper updated successfully",
      data: paper,
    });
  } catch (error) {
    console.error("Update Conference Paper Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to update conference paper",
    });
  }
};

/* =========================================
   DELETE CONFERENCE PAPER
========================================= */

export const deleteConferencePaper = async (req, res) => {
  try {
    const paper = await ConferencePaper.findByIdAndDelete(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: "Conference paper not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Conference paper deleted successfully",
    });
  } catch (error) {
    console.error("Delete Conference Paper Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete conference paper",
    });
  }
};
