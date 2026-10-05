import PlacementHighlight from "../models/PlacementHighlight.js";

/* =========================================================
   CREATE PLACEMENT HIGHLIGHT
   POST /api/placement-highlights
========================================================= */

export const createPlacementHighlight = async (req, res) => {
  try {
    const { title, description, displayOrder, isPublished } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Highlight title is required.",
      });
    }

    const highlight = await PlacementHighlight.create({
      title: title.trim(),
      description: description || "",
      displayOrder: Number(displayOrder) || 0,
      isPublished:
        isPublished === false || isPublished === "false" ? false : true,
    });

    res.status(201).json({
      success: true,
      message: "Placement Highlight created successfully.",
      data: highlight,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   GET ALL PLACEMENT HIGHLIGHTS
   GET /api/placement-highlights
========================================================= */

export const getPlacementHighlights = async (req, res) => {
  try {
    const highlights = await PlacementHighlight.find().sort({
      displayOrder: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: highlights.length,
      data: highlights,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   GET SINGLE PLACEMENT HIGHLIGHT
   GET /api/placement-highlights/:id
========================================================= */

export const getPlacementHighlightById = async (req, res) => {
  try {
    const highlight = await PlacementHighlight.findById(req.params.id);

    if (!highlight) {
      return res.status(404).json({
        success: false,
        message: "Placement Highlight not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: highlight,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   UPDATE PLACEMENT HIGHLIGHT
   PUT /api/placement-highlights/:id
========================================================= */

export const updatePlacementHighlight = async (req, res) => {
  try {
    const { title, description, displayOrder, isPublished } = req.body;

    const highlight = await PlacementHighlight.findById(req.params.id);

    if (!highlight) {
      return res.status(404).json({
        success: false,
        message: "Placement Highlight not found.",
      });
    }

    if (title !== undefined) {
      if (!String(title).trim()) {
        return res.status(400).json({
          success: false,
          message: "Highlight title is required.",
        });
      }

      highlight.title = String(title).trim();
    }

    if (description !== undefined) {
      highlight.description = description;
    }

    if (displayOrder !== undefined) {
      highlight.displayOrder = Number(displayOrder) || 0;
    }

    if (isPublished !== undefined) {
      highlight.isPublished =
        isPublished === false || isPublished === "false" ? false : true;
    }

    await highlight.save();

    res.status(200).json({
      success: true,
      message: "Placement Highlight updated successfully.",
      data: highlight,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   DELETE PLACEMENT HIGHLIGHT
   DELETE /api/placement-highlights/:id
========================================================= */

export const deletePlacementHighlight = async (req, res) => {
  try {
    const highlight = await PlacementHighlight.findByIdAndDelete(req.params.id);

    if (!highlight) {
      return res.status(404).json({
        success: false,
        message: "Placement Highlight not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Placement Highlight deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   GET PUBLIC PLACEMENT HIGHLIGHTS
   GET /api/placement-highlights/public
========================================================= */

export const getPublicPlacementHighlights = async (req, res) => {
  try {
    const highlights = await PlacementHighlight.find({
      isPublished: true,
    }).sort({
      displayOrder: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: highlights.length,
      data: highlights,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
