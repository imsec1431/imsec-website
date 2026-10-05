import Rule from "../models/Rule.js";

// =====================================
// Add Rule
// =====================================

export const addRule = async (req, res) => {
  try {
    const rule = await Rule.create({
      title: req.body.title,
      category: req.body.category,
      description: req.body.description,
      pdfLink: req.body.pdfLink,
      important: req.body.important,
      displayOrder: req.body.displayOrder,
      active: req.body.active,
    });

    res.status(201).json({
      success: true,
      message: "Rule Added Successfully",
      data: rule,
    });
  } catch (error) {
    // console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Get All Rules
// =====================================

export const getRules = async (req, res) => {
  try {
    const rules = await Rule.find().sort({
      displayOrder: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: rules.length,
      data: rules,
    });
  } catch (error) {
    // console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Get Single Rule
// =====================================

export const getRule = async (req, res) => {
  try {
    const rule = await Rule.findById(req.params.id);

    if (!rule) {
      return res.status(404).json({
        success: false,
        message: "Rule not found",
      });
    }

    res.status(200).json({
      success: true,
      data: rule,
    });
  } catch (error) {
    // console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Update Rule
// =====================================

export const updateRule = async (req, res) => {
  try {
    const rule = await Rule.findById(req.params.id);

    if (!rule) {
      return res.status(404).json({
        success: false,
        message: "Rule not found",
      });
    }

    rule.title = req.body.title;
    rule.category = req.body.category;
    rule.description = req.body.description;
    rule.pdfLink = req.body.pdfLink;
    rule.important = req.body.important;
    rule.displayOrder = req.body.displayOrder;
    rule.active = req.body.active;

    await rule.save();

    res.status(200).json({
      success: true,
      message: "Rule Updated Successfully",
      data: rule,
    });
  } catch (error) {
    // console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Delete Rule
// =====================================

export const deleteRule = async (req, res) => {
  try {
    const rule = await Rule.findById(req.params.id);

    if (!rule) {
      return res.status(404).json({
        success: false,
        message: "Rule not found",
      });
    }

    await rule.deleteOne();

    res.status(200).json({
      success: true,
      message: "Rule Deleted Successfully",
    });
  } catch (error) {
    // console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
