import Journal from "../models/Journal.js";

/* =========================================
   GET ALL JOURNALS / RESEARCH PAPERS
========================================= */

export const getJournals = async (req, res) => {
  try {
    const journals = await Journal.find().sort({
      displayOrder: 1,
      publicationYear: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: journals.length,
      data: journals,
    });
  } catch (error) {
    console.error("Get Journals Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch research publications",
    });
  }
};

/* =========================================
   GET SINGLE JOURNAL / RESEARCH PAPER
========================================= */

export const getJournal = async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);

    if (!journal) {
      return res.status(404).json({
        success: false,
        message: "Research publication not found",
      });
    }

    res.status(200).json({
      success: true,
      data: journal,
    });
  } catch (error) {
    console.error("Get Journal Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch research publication",
    });
  }
};

/* =========================================
   ADD JOURNAL / RESEARCH PAPER
========================================= */

export const createJournal = async (req, res) => {
  try {
    const {
      researchPaperTitle,
      authors,
      department,
      journal,
      publicationYear,
      indexingDatabase,
      issn,
      paperLink,
      status,
      displayOrder,
    } = req.body;

    if (!researchPaperTitle?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Research paper title is required",
      });
    }

    if (!authors?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Author name is required",
      });
    }

    if (!department?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Department is required",
      });
    }

    if (!journal?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Journal name is required",
      });
    }

    if (!publicationYear) {
      return res.status(400).json({
        success: false,
        message: "Publication year is required",
      });
    }

    if (!indexingDatabase?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Indexing database is required",
      });
    }

    const newJournal = await Journal.create({
      researchPaperTitle: researchPaperTitle.trim(),
      authors: authors.trim(),
      department: department.trim(),
      journal: journal.trim(),
      publicationYear: Number(publicationYear),
      indexingDatabase: indexingDatabase.trim(),
      issn: issn?.trim() || "",
      paperLink: paperLink?.trim() || "",
      status: status || "Active",
      displayOrder: Number(displayOrder) || 1,
    });

    res.status(201).json({
      success: true,
      message: "Research publication added successfully",
      data: newJournal,
    });
  } catch (error) {
    console.error("Create Journal Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to add research publication",
    });
  }
};

/* =========================================
   UPDATE JOURNAL / RESEARCH PAPER
========================================= */

export const updateJournal = async (req, res) => {
  try {
    const {
      researchPaperTitle,
      authors,
      department,
      journal,
      publicationYear,
      indexingDatabase,
      issn,
      paperLink,
      status,
      displayOrder,
    } = req.body;

    if (!researchPaperTitle?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Research paper title is required",
      });
    }

    if (!authors?.trim() || !department?.trim() || !journal?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Authors, department and journal are required",
      });
    }

    if (!publicationYear || !indexingDatabase?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Publication year and indexing database are required",
      });
    }

    const updatedJournal = await Journal.findByIdAndUpdate(
      req.params.id,
      {
        researchPaperTitle: researchPaperTitle.trim(),
        authors: authors.trim(),
        department: department.trim(),
        journal: journal.trim(),
        publicationYear: Number(publicationYear),
        indexingDatabase: indexingDatabase.trim(),
        issn: issn?.trim() || "",
        paperLink: paperLink?.trim() || "",
        status: status || "Active",
        displayOrder: Number(displayOrder) || 1,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedJournal) {
      return res.status(404).json({
        success: false,
        message: "Research publication not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Research publication updated successfully",
      data: updatedJournal,
    });
  } catch (error) {
    console.error("Update Journal Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to update research publication",
    });
  }
};

/* =========================================
   DELETE JOURNAL / RESEARCH PAPER
========================================= */

export const deleteJournal = async (req, res) => {
  try {
    const journal = await Journal.findByIdAndDelete(req.params.id);

    if (!journal) {
      return res.status(404).json({
        success: false,
        message: "Research publication not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Research publication deleted successfully",
    });
  } catch (error) {
    console.error("Delete Journal Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete research publication",
    });
  }
};
