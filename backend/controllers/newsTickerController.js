import NewsTicker from "../models/NewsTicker.js";

// @desc    Get published news ticker items
// @route   GET /api/news-ticker
// @access  Public
export const getPublicNewsTicker = async (req, res) => {
  try {
    const news = await NewsTicker.find({
      isPublished: true,
    }).sort({
      displayOrder: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: news,
    });
  } catch (error) {
    console.error("Get public news ticker error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load news ticker.",
    });
  }
};

// @desc    Get all news ticker items for admin
// @route   GET /api/news-ticker/admin
// @access  Admin
export const getAdminNewsTicker = async (req, res) => {
  try {
    const news = await NewsTicker.find().sort({
      displayOrder: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: news,
    });
  } catch (error) {
    console.error("Get admin news ticker error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load news ticker.",
    });
  }
};

// @desc    Create news ticker item
// @route   POST /api/news-ticker/admin
// @access  Admin
export const createNewsTicker = async (req, res) => {
  try {
    const {
      title,
      description,
      pdfLink,
      buttonText,
      displayOrder,
      isPublished,
    } = req.body;

    const news = await NewsTicker.create({
      title,
      description,
      pdfLink,
      buttonText: buttonText || "View PDF",
      displayOrder: displayOrder || 0,
      isPublished: isPublished === true || isPublished === "true",
    });

    res.status(201).json({
      success: true,
      message: "News ticker created successfully.",
      data: news,
    });
  } catch (error) {
    console.error("Create news ticker error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Unable to create news ticker.",
    });
  }
};

// @desc    Update news ticker item
// @route   PUT /api/news-ticker/admin/:id
// @access  Admin
export const updateNewsTicker = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await NewsTicker.findById(id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News ticker item not found.",
      });
    }

    const {
      title,
      description,
      pdfLink,
      buttonText,
      displayOrder,
      isPublished,
    } = req.body;

    news.title = title;
    news.description = description;
    news.pdfLink = pdfLink;
    news.buttonText = buttonText || "View PDF";

    if (displayOrder !== undefined && displayOrder !== "") {
      news.displayOrder = Number(displayOrder);
    }

    if (isPublished !== undefined) {
      news.isPublished = isPublished === true || isPublished === "true";
    }

    const updatedNews = await news.save();

    res.status(200).json({
      success: true,
      message: "News ticker updated successfully.",
      data: updatedNews,
    });
  } catch (error) {
    console.error("Update news ticker error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Unable to update news ticker.",
    });
  }
};

// @desc    Publish news ticker item
// @route   PATCH /api/news-ticker/admin/:id/publish
// @access  Admin
export const publishNewsTicker = async (req, res) => {
  try {
    const news = await NewsTicker.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News ticker item not found.",
      });
    }

    news.isPublished = true;
    await news.save();

    res.status(200).json({
      success: true,
      message: "News ticker published successfully.",
      data: news,
    });
  } catch (error) {
    console.error("Publish news ticker error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to publish news ticker.",
    });
  }
};

// @desc    Unpublish news ticker item
// @route   PATCH /api/news-ticker/admin/:id/unpublish
// @access  Admin
export const unpublishNewsTicker = async (req, res) => {
  try {
    const news = await NewsTicker.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News ticker item not found.",
      });
    }

    news.isPublished = false;
    await news.save();

    res.status(200).json({
      success: true,
      message: "News ticker unpublished successfully.",
      data: news,
    });
  } catch (error) {
    console.error("Unpublish news ticker error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to unpublish news ticker.",
    });
  }
};

// @desc    Delete news ticker item
// @route   DELETE /api/news-ticker/admin/:id
// @access  Admin
export const deleteNewsTicker = async (req, res) => {
  try {
    const news = await NewsTicker.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News ticker item not found.",
      });
    }

    await news.deleteOne();

    res.status(200).json({
      success: true,
      message: "News ticker deleted successfully.",
    });
  } catch (error) {
    console.error("Delete news ticker error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete news ticker.",
    });
  }
};
