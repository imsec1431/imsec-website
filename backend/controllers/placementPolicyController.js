import PlacementPolicy from "../models/placementPolicyModel.js";

/* =========================================================
   CREATE PLACEMENT POLICY
   POST /api/placement-policies
========================================================= */

export const createPlacementPolicy = async (req, res) => {
  try {
    const {
      title,
      shortDescription,
      content,
      pdfLink,
      documentTitle,
      order,
      isPublished,
    } = req.body;

    /* =========================================
       VALIDATION
    ========================================= */

    if (!title?.trim()) {
      return res.status(400).json({
        message: "Policy title is required.",
      });
    }

    /* =========================================
       CREATE
    ========================================= */

    const policy = await PlacementPolicy.create({
      title: title.trim(),

      shortDescription: shortDescription?.trim() || "",

      content: content?.trim() || "",

      pdfLink: pdfLink?.trim() || "",

      documentTitle: documentTitle?.trim() || "",

      order: Number(order) || 0,

      isPublished: isPublished === true || isPublished === "true",

      createdBy: req.user?._id || null,

      updatedBy: req.user?._id || null,
    });

    return res.status(201).json({
      message: "Placement policy created successfully.",

      data: policy,
    });
  } catch (error) {
    console.error("Create placement policy error:", error);

    return res.status(500).json({
      message: "Failed to create placement policy.",
      error: error.message,
    });
  }
};

/* =========================================================
   GET ALL POLICIES
   ADMIN
   GET /api/placement-policies
========================================================= */

export const getAllPlacementPolicies = async (req, res) => {
  try {
    const policies = await PlacementPolicy.find().sort({
      order: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      message: "Placement policies fetched successfully.",

      data: policies,
    });
  } catch (error) {
    console.error("Get placement policies error:", error);

    return res.status(500).json({
      message: "Failed to fetch placement policies.",
      error: error.message,
    });
  }
};

/* =========================================================
   GET PUBLISHED POLICIES
   PUBLIC
   GET /api/placement-policies/public
========================================================= */

export const getPublishedPlacementPolicies = async (req, res) => {
  try {
    const policies = await PlacementPolicy.find({
      isPublished: true,
    }).sort({
      order: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      message: "Published placement policies fetched successfully.",

      data: policies,
    });
  } catch (error) {
    console.error("Get published placement policies error:", error);

    return res.status(500).json({
      message: "Failed to fetch published placement policies.",
      error: error.message,
    });
  }
};

/* =========================================================
   GET SINGLE POLICY
   ADMIN
   GET /api/placement-policies/:id
========================================================= */

export const getPlacementPolicyById = async (req, res) => {
  try {
    const { id } = req.params;

    const policy = await PlacementPolicy.findById(id);

    if (!policy) {
      return res.status(404).json({
        message: "Placement policy not found.",
      });
    }

    return res.status(200).json({
      message: "Placement policy fetched successfully.",

      data: policy,
    });
  } catch (error) {
    console.error("Get placement policy error:", error);

    return res.status(500).json({
      message: "Failed to fetch placement policy.",
      error: error.message,
    });
  }
};

/* =========================================================
   UPDATE POLICY
   PUT /api/placement-policies/:id
========================================================= */

export const updatePlacementPolicy = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      shortDescription,
      content,
      pdfLink,
      documentTitle,
      order,
      isPublished,
    } = req.body;

    /* =========================================
       VALIDATION
    ========================================= */

    if (!title?.trim()) {
      return res.status(400).json({
        message: "Policy title is required.",
      });
    }

    /* =========================================
       UPDATE
    ========================================= */

    const policy = await PlacementPolicy.findByIdAndUpdate(
      id,

      {
        title: title.trim(),

        shortDescription: shortDescription?.trim() || "",

        content: content?.trim() || "",

        pdfLink: pdfLink?.trim() || "",

        documentTitle: documentTitle?.trim() || "",

        order: Number(order) || 0,

        isPublished: isPublished === true || isPublished === "true",

        updatedBy: req.user?._id || null,
      },

      {
        new: true,
        runValidators: true,
      },
    );

    if (!policy) {
      return res.status(404).json({
        message: "Placement policy not found.",
      });
    }

    return res.status(200).json({
      message: "Placement policy updated successfully.",

      data: policy,
    });
  } catch (error) {
    console.error("Update placement policy error:", error);

    return res.status(500).json({
      message: "Failed to update placement policy.",
      error: error.message,
    });
  }
};

/* =========================================================
   DELETE POLICY
   DELETE /api/placement-policies/:id
========================================================= */

export const deletePlacementPolicy = async (req, res) => {
  try {
    const { id } = req.params;

    const policy = await PlacementPolicy.findByIdAndDelete(id);

    if (!policy) {
      return res.status(404).json({
        message: "Placement policy not found.",
      });
    }

    return res.status(200).json({
      message: "Placement policy deleted successfully.",

      data: policy,
    });
  } catch (error) {
    console.error("Delete placement policy error:", error);

    return res.status(500).json({
      message: "Failed to delete placement policy.",
      error: error.message,
    });
  }
};

/* =========================================================
   TOGGLE PUBLISHED / DRAFT
   PATCH /api/placement-policies/:id/status
========================================================= */

export const togglePlacementPolicyStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const policy = await PlacementPolicy.findById(id);

    if (!policy) {
      return res.status(404).json({
        message: "Placement policy not found.",
      });
    }

    policy.isPublished = !policy.isPublished;

    policy.updatedBy = req.user?._id || null;

    await policy.save();

    return res.status(200).json({
      message: policy.isPublished
        ? "Placement policy published successfully."
        : "Placement policy moved to draft successfully.",

      data: policy,
    });
  } catch (error) {
    console.error("Toggle placement policy status error:", error);

    return res.status(500).json({
      message: "Failed to update policy status.",
      error: error.message,
    });
  }
};
