import PlacementNotice from "../models/placementNoticeModel.js";

/* =========================================================
   GET PUBLIC PLACEMENT NOTICES
   Only published notices
========================================================= */

export const getPublicPlacementNotices = async (req, res) => {
  try {
    const notices = await PlacementNotice.find({
      isPublished: true,
    })
      .sort({
        noticeDate: -1,
        order: 1,
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      data: notices,
    });
  } catch (error) {
    console.error("Get public placement notices error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load placement notices.",
    });
  }
};

/* =========================================================
   GET ALL PLACEMENT NOTICES - ADMIN
========================================================= */

export const getAdminPlacementNotices = async (req, res) => {
  try {
    const notices = await PlacementNotice.find()
      .sort({
        noticeDate: -1,
        order: 1,
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      data: notices,
    });
  } catch (error) {
    console.error("Get admin placement notices error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load placement notices.",
    });
  }
};

/* =========================================================
   GET SINGLE PLACEMENT NOTICE - ADMIN
========================================================= */

export const getPlacementNoticeById = async (req, res) => {
  try {
    const { id } = req.params;

    const notice = await PlacementNotice.findById(id).lean();

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Placement notice not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: notice,
    });
  } catch (error) {
    console.error("Get placement notice by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load placement notice.",
    });
  }
};

/* =========================================================
   CREATE PLACEMENT NOTICE
========================================================= */

export const createPlacementNotice = async (req, res) => {
  try {
    const {
      title,
      description,
      noticeDate,
      documentLink,
      documentLabel,
      category,
      order,
      isPublished,
    } = req.body;

    /* =========================================
         VALIDATION
      ========================================= */

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Notice title is required.",
      });
    }

    if (!noticeDate) {
      return res.status(400).json({
        success: false,
        message: "Notice date is required.",
      });
    }

    /* =========================================
         CREATE
      ========================================= */

    const notice = await PlacementNotice.create({
      title: title.trim(),

      description: description?.trim() || "",

      noticeDate,

      documentLink: documentLink?.trim() || "",

      documentLabel: documentLabel?.trim() || "View Notice",

      category: category || "placement",

      order: Number(order) || 0,

      isPublished:
        isPublished === false || isPublished === "false" ? false : true,

      createdBy: req.admin?._id || req.admin?.id || null,

      updatedBy: req.admin?._id || req.admin?.id || null,
    });

    return res.status(201).json({
      success: true,

      message: "Placement notice created successfully.",

      data: notice,
    });
  } catch (error) {
    console.error("Create placement notice error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create placement notice.",
    });
  }
};

/* =========================================================
   UPDATE PLACEMENT NOTICE
========================================================= */

export const updatePlacementNotice = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      noticeDate,
      documentLink,
      documentLabel,
      category,
      order,
      isPublished,
    } = req.body;

    /* =========================================
         FIND NOTICE
      ========================================= */

    const notice = await PlacementNotice.findById(id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Placement notice not found.",
      });
    }

    /* =========================================
         VALIDATION
      ========================================= */

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Notice title cannot be empty.",
      });
    }

    /* =========================================
         UPDATE FIELDS
      ========================================= */

    if (title !== undefined) {
      notice.title = title.trim();
    }

    if (description !== undefined) {
      notice.description = description.trim();
    }

    if (noticeDate !== undefined) {
      notice.noticeDate = noticeDate;
    }

    if (documentLink !== undefined) {
      notice.documentLink = documentLink.trim();
    }

    if (documentLabel !== undefined) {
      notice.documentLabel = documentLabel.trim() || "View Notice";
    }

    if (category !== undefined) {
      notice.category = category;
    }

    if (order !== undefined) {
      notice.order = Number(order) || 0;
    }

    if (isPublished !== undefined) {
      notice.isPublished = isPublished === true || isPublished === "true";
    }

    /* =========================================
         UPDATED BY
      ========================================= */

    notice.updatedBy = req.admin?._id || req.admin?.id || null;

    await notice.save();

    return res.status(200).json({
      success: true,

      message: "Placement notice updated successfully.",

      data: notice,
    });
  } catch (error) {
    console.error("Update placement notice error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update placement notice.",
    });
  }
};

/* =========================================================
   DELETE PLACEMENT NOTICE
========================================================= */

export const deletePlacementNotice = async (req, res) => {
  try {
    const { id } = req.params;

    const notice = await PlacementNotice.findById(id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Placement notice not found.",
      });
    }

    await PlacementNotice.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,

      message: "Placement notice deleted successfully.",
    });
  } catch (error) {
    console.error("Delete placement notice error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete placement notice.",
    });
  }
};

/* =========================================================
   TOGGLE PUBLISHED STATUS
========================================================= */

export const togglePlacementNoticeStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const notice = await PlacementNotice.findById(id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Placement notice not found.",
      });
    }

    notice.isPublished = !notice.isPublished;

    notice.updatedBy = req.admin?._id || req.admin?.id || null;

    await notice.save();

    return res.status(200).json({
      success: true,

      message: notice.isPublished
        ? "Placement notice published successfully."
        : "Placement notice unpublished successfully.",

      data: notice,
    });
  } catch (error) {
    console.error("Toggle placement notice status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update placement notice status.",
    });
  }
};
