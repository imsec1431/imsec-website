import Approval from "../models/Approval.js";

/**
 * @desc    Get published approvals
 * @route   GET /api/approvals
 * @access  Public
 */
export const getPublicApprovals = async (req, res) => {
  try {
    const approvals = await Approval.find({
      isPublished: true,
    }).sort({
      displayOrder: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: approvals,
    });
  } catch (error) {
    console.error("Get public approvals error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch approvals.",
    });
  }
};

/**
 * @desc    Get all approvals for admin
 * @route   GET /api/approvals/admin
 * @access  Private
 */
export const getAdminApprovals = async (req, res) => {
  try {
    const approvals = await Approval.find().sort({
      displayOrder: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: approvals,
    });
  } catch (error) {
    console.error("Get admin approvals error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch approvals.",
    });
  }
};

/**
 * @desc    Create approval
 * @route   POST /api/approvals/admin
 * @access  Private
 */
export const createApproval = async (req, res) => {
  try {
    const { title, description, isPublished, displayOrder } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required.",
      });
    }

    if (!description?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Description is required.",
      });
    }

    const approval = await Approval.create({
      title: title.trim(),
      description: description.trim(),
      isPublished: isPublished === true || isPublished === "true",
      displayOrder:
        displayOrder !== undefined && displayOrder !== ""
          ? Number(displayOrder)
          : 0,
    });

    res.status(201).json({
      success: true,
      message: "Approval created successfully.",
      data: approval,
    });
  } catch (error) {
    console.error("Create approval error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create approval.",
    });
  }
};

/**
 * @desc    Update approval
 * @route   PUT /api/approvals/admin/:id
 * @access  Private
 */
export const updateApproval = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, description, isPublished, displayOrder } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required.",
      });
    }

    if (!description?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Description is required.",
      });
    }

    const approval = await Approval.findById(id);

    if (!approval) {
      return res.status(404).json({
        success: false,
        message: "Approval not found.",
      });
    }

    approval.title = title.trim();
    approval.description = description.trim();

    if (isPublished !== undefined) {
      approval.isPublished = isPublished === true || isPublished === "true";
    }

    if (displayOrder !== undefined && displayOrder !== "") {
      approval.displayOrder = Number(displayOrder);
    } else {
      approval.displayOrder = 0;
    }

    await approval.save();

    res.status(200).json({
      success: true,
      message: "Approval updated successfully.",
      data: approval,
    });
  } catch (error) {
    console.error("Update approval error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update approval.",
    });
  }
};

/**
 * @desc    Publish approval
 * @route   PATCH /api/approvals/admin/:id/publish
 * @access  Private
 */
export const publishApproval = async (req, res) => {
  try {
    const { id } = req.params;

    const approval = await Approval.findById(id);

    if (!approval) {
      return res.status(404).json({
        success: false,
        message: "Approval not found.",
      });
    }

    approval.isPublished = true;

    await approval.save();

    res.status(200).json({
      success: true,
      message: "Approval published successfully.",
      data: approval,
    });
  } catch (error) {
    console.error("Publish approval error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to publish approval.",
    });
  }
};

/**
 * @desc    Unpublish approval
 * @route   PATCH /api/approvals/admin/:id/unpublish
 * @access  Private
 */
export const unpublishApproval = async (req, res) => {
  try {
    const { id } = req.params;

    const approval = await Approval.findById(id);

    if (!approval) {
      return res.status(404).json({
        success: false,
        message: "Approval not found.",
      });
    }

    approval.isPublished = false;

    await approval.save();

    res.status(200).json({
      success: true,
      message: "Approval unpublished successfully.",
      data: approval,
    });
  } catch (error) {
    console.error("Unpublish approval error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to unpublish approval.",
    });
  }
};

/**
 * @desc    Delete approval
 * @route   DELETE /api/approvals/admin/:id
 * @access  Private
 */
export const deleteApproval = async (req, res) => {
  try {
    const { id } = req.params;

    const approval = await Approval.findById(id);

    if (!approval) {
      return res.status(404).json({
        success: false,
        message: "Approval not found.",
      });
    }

    await approval.deleteOne();

    res.status(200).json({
      success: true,
      message: "Approval deleted successfully.",
    });
  } catch (error) {
    console.error("Delete approval error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete approval.",
    });
  }
};
