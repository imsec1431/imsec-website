import BookContent from "../models/BookContent.js";

/* =========================================
   GET PAGE CONTENT (SINGLETON)
========================================= */
export const getBookContent = async (req, res) => {
  try {
    let content = await BookContent.findOne();
    if (!content) {
      content = await BookContent.create({});
    }
    res.status(200).json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================================
   UPDATE PAGE CONTENT
========================================= */
export const updateBookContent = async (req, res) => {
  try {
    let content = await BookContent.findOne();
    if (!content) {
      content = await BookContent.create(req.body);
    } else {
      content = await BookContent.findByIdAndUpdate(content._id, req.body, {
        new: true,
        runValidators: true,
      });
    }
    res.status(200).json({
      success: true,
      data: content,
      message: "Page content updated successfully",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
