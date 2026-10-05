import Newsletter from "../models/Newsletter.js";

// @desc    Get all newsletters
// @route   GET /api/newsletters
// @access  Public
export const getAllNewsletters = async (req, res) => {
  try {
    const newsletters = await Newsletter.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: newsletters.length,
      data: newsletters,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single newsletter by ID
// @route   GET /api/newsletters/:id
// @access  Public
export const getNewsletterById = async (req, res) => {
  try {
    const { id } = req.params;
    const newsletter = await Newsletter.findById(id);

    if (!newsletter) {
      return res.status(404).json({
        success: false,
        message: "Newsletter not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: newsletter,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new newsletter
// @route   POST /api/newsletters
// @access  Private/Admin
export const createNewsletter = async (req, res) => {
  try {
    const { isFeatured } = req.body;

    // Reset previous featured newsletter if current is marked as featured
    if (isFeatured) {
      await Newsletter.updateMany({}, { isFeatured: false });
    }

    const newNewsletter = await Newsletter.create(req.body);

    return res.status(201).json({
      success: true,
      data: newNewsletter,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update newsletter
// @route   PUT /api/newsletters/:id
// @access  Private/Admin
export const updateNewsletter = async (req, res) => {
  try {
    const { id } = req.params;
    const { isFeatured } = req.body;

    // Reset other featured flags if current item is set to true
    if (isFeatured) {
      await Newsletter.updateMany({ _id: { $ne: id } }, { isFeatured: false });
    }

    const updatedNewsletter = await Newsletter.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedNewsletter) {
      return res.status(404).json({
        success: false,
        message: "Newsletter not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedNewsletter,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete newsletter
// @route   DELETE /api/newsletters/:id
// @access  Private/Admin
export const deleteNewsletter = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNewsletter = await Newsletter.findByIdAndDelete(id);

    if (!deletedNewsletter) {
      return res.status(404).json({
        success: false,
        message: "Newsletter not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Newsletter deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
