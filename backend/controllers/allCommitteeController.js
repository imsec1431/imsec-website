import AllCommittee from "../models/allCommitteeModel.js";

/* =========================================================
   GET ALL COMMITTEES
   ADMIN
========================================================= */

export const getAllCommittees = async (req, res) => {
  try {
    const committees = await AllCommittee.find().sort({
      displayOrder: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,

      message: "Committees fetched successfully.",

      data: committees,
    });
  } catch (error) {
    console.error("Get committees error:", error);

    res.status(500).json({
      success: false,

      message: "Unable to load committees.",

      error: error.message,
    });
  }
};

/* =========================================================
   GET PUBLISHED COMMITTEES
   PUBLIC
========================================================= */

export const getPublishedCommittees = async (req, res) => {
  try {
    const committees = await AllCommittee.find({
      status: "published",
    }).sort({
      displayOrder: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,

      message: "Published committees fetched successfully.",

      data: committees,
    });
  } catch (error) {
    console.error("Get published committees error:", error);

    res.status(500).json({
      success: false,

      message: "Unable to load published committees.",

      error: error.message,
    });
  }
};

/* =========================================================
   GET SINGLE COMMITTEE
   ADMIN
========================================================= */

export const getCommitteeById = async (req, res) => {
  try {
    const committee = await AllCommittee.findById(req.params.id);

    if (!committee) {
      return res.status(404).json({
        success: false,

        message: "Committee not found.",
      });
    }

    res.status(200).json({
      success: true,

      data: committee,
    });
  } catch (error) {
    console.error("Get committee by ID error:", error);

    res.status(500).json({
      success: false,

      message: "Unable to load committee.",

      error: error.message,
    });
  }
};

/* =========================================================
   CREATE COMMITTEE
   ADMIN
========================================================= */

export const createCommittee = async (req, res) => {
  try {
    const { committeeName, pdfLink, displayOrder, status } = req.body;

    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!committeeName || !committeeName.trim()) {
      return res.status(400).json({
        success: false,

        message: "Committee name is required.",
      });
    }

    if (!pdfLink || !pdfLink.trim()) {
      return res.status(400).json({
        success: false,

        message: "PDF link is required.",
      });
    }

    /* =====================================================
       CREATE
    ===================================================== */

    const committee = await AllCommittee.create({
      committeeName: committeeName.trim(),

      pdfLink: pdfLink.trim(),

      displayOrder: Number(displayOrder) || 0,

      status: status === "draft" ? "draft" : "published",
    });

    res.status(201).json({
      success: true,

      message: "Committee created successfully.",

      data: committee,
    });
  } catch (error) {
    console.error("Create committee error:", error);

    res.status(500).json({
      success: false,

      message: "Unable to create committee.",

      error: error.message,
    });
  }
};

/* =========================================================
   UPDATE COMMITTEE
   ADMIN
========================================================= */

export const updateCommittee = async (req, res) => {
  try {
    const { committeeName, pdfLink, displayOrder, status } = req.body;

    const committee = await AllCommittee.findById(req.params.id);

    if (!committee) {
      return res.status(404).json({
        success: false,

        message: "Committee not found.",
      });
    }

    /* =====================================================
       UPDATE ONLY PROVIDED VALUES
    ===================================================== */

    if (committeeName !== undefined) {
      if (!committeeName.trim()) {
        return res.status(400).json({
          success: false,

          message: "Committee name is required.",
        });
      }

      committee.committeeName = committeeName.trim();
    }

    if (pdfLink !== undefined) {
      if (!pdfLink.trim()) {
        return res.status(400).json({
          success: false,

          message: "PDF link is required.",
        });
      }

      committee.pdfLink = pdfLink.trim();
    }

    if (displayOrder !== undefined) {
      committee.displayOrder = Number(displayOrder) || 0;
    }

    if (status !== undefined) {
      committee.status = status === "draft" ? "draft" : "published";
    }

    const updatedCommittee = await committee.save();

    res.status(200).json({
      success: true,

      message: "Committee updated successfully.",

      data: updatedCommittee,
    });
  } catch (error) {
    console.error("Update committee error:", error);

    res.status(500).json({
      success: false,

      message: "Unable to update committee.",

      error: error.message,
    });
  }
};

/* =========================================================
   DELETE COMMITTEE
   ADMIN
========================================================= */

export const deleteCommittee = async (req, res) => {
  try {
    const committee = await AllCommittee.findById(req.params.id);

    if (!committee) {
      return res.status(404).json({
        success: false,

        message: "Committee not found.",
      });
    }

    await committee.deleteOne();

    res.status(200).json({
      success: true,

      message: "Committee deleted successfully.",
    });
  } catch (error) {
    console.error("Delete committee error:", error);

    res.status(500).json({
      success: false,

      message: "Unable to delete committee.",

      error: error.message,
    });
  }
};
