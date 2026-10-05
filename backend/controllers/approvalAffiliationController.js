import ApprovalAffiliation from "../models/ApprovalAffiliation.js";

// =========================================================
// PUBLIC
// Get published Approval & Affiliation documents
// GET /api/approvals-affiliations
// =========================================================

export const getPublicApprovalAffiliations = async (req, res) => {
  try {
    const documents = await ApprovalAffiliation.find({
      isPublished: true,
    }).sort({
      displayOrder: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: documents,
    });
  } catch (error) {
    console.error("Get public approval/affiliation error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load approval and affiliation documents.",
    });
  }
};

// =========================================================
// ADMIN
// Get all documents
// GET /api/approvals-affiliations/admin
// =========================================================

export const getAdminApprovalAffiliations = async (req, res) => {
  try {
    const documents = await ApprovalAffiliation.find().sort({
      displayOrder: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: documents,
    });
  } catch (error) {
    console.error("Get admin approval/affiliation error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load approval and affiliation documents.",
    });
  }
};

// =========================================================
// ADMIN
// Create document
// POST /api/approvals-affiliations/admin
// =========================================================

export const createApprovalAffiliation = async (req, res) => {
  try {
    const {
      title,
      description,
      documentType,
      otherDocumentType,
      pdfLink,
      issuingAuthority,
      session,
      isPublished,
      displayOrder,
    } = req.body;

    // -------------------------------------------------------
    // Required fields
    // -------------------------------------------------------

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required.",
      });
    }

    if (!documentType) {
      return res.status(400).json({
        success: false,
        message: "Document type is required.",
      });
    }

    if (!pdfLink?.trim()) {
      return res.status(400).json({
        success: false,
        message: "PDF link is required.",
      });
    }

    // -------------------------------------------------------
    // OTHER VALIDATION
    // -------------------------------------------------------

    if (documentType === "Other" && !otherDocumentType?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter the document type name for Other.",
      });
    }

    const document = await ApprovalAffiliation.create({
      title: title.trim(),

      description: description?.trim() || "",

      documentType,

      otherDocumentType:
        documentType === "Other" ? otherDocumentType.trim() : "",

      pdfLink: pdfLink.trim(),

      issuingAuthority: issuingAuthority?.trim() || "",

      session: session?.trim() || "",

      isPublished: isPublished === true || isPublished === "true",

      displayOrder: Number(displayOrder) || 0,
    });

    res.status(201).json({
      success: true,
      message: "Approval/Affiliation document added successfully.",
      data: document,
    });
  } catch (error) {
    console.error("Create approval/affiliation error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Unable to create document.",
    });
  }
};

// =========================================================
// ADMIN
// Update document
// PUT /api/approvals-affiliations/admin/:id
// =========================================================

export const updateApprovalAffiliation = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await ApprovalAffiliation.findById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Approval/Affiliation document not found.",
      });
    }

    const {
      title,
      description,
      documentType,
      otherDocumentType,
      pdfLink,
      issuingAuthority,
      session,
      isPublished,
      displayOrder,
    } = req.body;

    // -------------------------------------------------------
    // VALIDATE TITLE
    // -------------------------------------------------------

    if (title !== undefined && !title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required.",
      });
    }

    // -------------------------------------------------------
    // DETERMINE DOCUMENT TYPE
    // -------------------------------------------------------

    const newDocumentType = documentType || document.documentType;

    // -------------------------------------------------------
    // OTHER VALIDATION
    // -------------------------------------------------------

    const newOtherDocumentType =
      otherDocumentType !== undefined
        ? otherDocumentType
        : document.otherDocumentType;

    if (newDocumentType === "Other" && !newOtherDocumentType?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter the document type name for Other.",
      });
    }

    // -------------------------------------------------------
    // UPDATE FIELDS
    // -------------------------------------------------------

    if (title !== undefined) {
      document.title = title.trim();
    }

    if (description !== undefined) {
      document.description = description.trim();
    }

    if (documentType !== undefined) {
      document.documentType = documentType;
    }

    if (newDocumentType === "Other") {
      document.otherDocumentType = newOtherDocumentType.trim();
    } else {
      document.otherDocumentType = "";
    }

    if (pdfLink !== undefined) {
      if (!pdfLink?.trim()) {
        return res.status(400).json({
          success: false,
          message: "PDF link is required.",
        });
      }

      document.pdfLink = pdfLink.trim();
    }

    if (issuingAuthority !== undefined) {
      document.issuingAuthority = issuingAuthority.trim();
    }

    if (session !== undefined) {
      document.session = session.trim();
    }

    if (isPublished !== undefined) {
      document.isPublished = isPublished === true || isPublished === "true";
    }

    if (displayOrder !== undefined) {
      document.displayOrder = Number(displayOrder) || 0;
    }

    const updatedDocument = await document.save();

    res.status(200).json({
      success: true,
      message: "Approval/Affiliation document updated successfully.",
      data: updatedDocument,
    });
  } catch (error) {
    console.error("Update approval/affiliation error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Unable to update document.",
    });
  }
};

// =========================================================
// ADMIN
// Publish document
// PATCH /api/approvals-affiliations/admin/:id/publish
// =========================================================

export const publishApprovalAffiliation = async (req, res) => {
  try {
    const document = await ApprovalAffiliation.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Approval/Affiliation document not found.",
      });
    }

    document.isPublished = true;

    await document.save();

    res.status(200).json({
      success: true,
      message: "Document published successfully.",
      data: document,
    });
  } catch (error) {
    console.error("Publish approval/affiliation error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to publish document.",
    });
  }
};

// =========================================================
// ADMIN
// Unpublish document
// PATCH /api/approvals-affiliations/admin/:id/unpublish
// =========================================================

export const unpublishApprovalAffiliation = async (req, res) => {
  try {
    const document = await ApprovalAffiliation.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Approval/Affiliation document not found.",
      });
    }

    document.isPublished = false;

    await document.save();

    res.status(200).json({
      success: true,
      message: "Document unpublished successfully.",
      data: document,
    });
  } catch (error) {
    console.error("Unpublish approval/affiliation error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to unpublish document.",
    });
  }
};

// =========================================================
// ADMIN
// Delete document
// DELETE /api/approvals-affiliations/admin/:id
// =========================================================

export const deleteApprovalAffiliation = async (req, res) => {
  try {
    const document = await ApprovalAffiliation.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Approval/Affiliation document not found.",
      });
    }

    await document.deleteOne();

    res.status(200).json({
      success: true,
      message: "Approval/Affiliation document deleted successfully.",
    });
  } catch (error) {
    console.error("Delete approval/affiliation error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete document.",
    });
  }
};
