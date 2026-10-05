import ResearchPolicy from "../models/ResearchPolicy.js";

const POLICY_TYPES = [
  "Research Policy",
  "IPR Policy",
  "Plagiarism Policy",
  "Research Ethics Guidelines",
];

/* =========================================
   GET ALL
========================================= */

export const getResearchPolicies = async (req, res) => {
  try {
    const policies = await ResearchPolicy.find().sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: policies.length,
      data: policies,
    });
  } catch (error) {
    console.error("Get Research Policies Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch research policies",
    });
  }
};

/* =========================================
   GET SINGLE
========================================= */

export const getResearchPolicy = async (req, res) => {
  try {
    const policy = await ResearchPolicy.findById(req.params.id);

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Research policy not found",
      });
    }

    res.status(200).json({
      success: true,
      data: policy,
    });
  } catch (error) {
    console.error("Get Research Policy Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch research policy",
    });
  }
};

/* =========================================
   CREATE
========================================= */

export const createResearchPolicy = async (req, res) => {
  try {
    const { title, pdfUrl, status } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Policy title is required",
      });
    }

    if (!POLICY_TYPES.includes(title)) {
      return res.status(400).json({
        success: false,
        message: "Invalid policy type",
      });
    }

    if (!pdfUrl || !pdfUrl.trim()) {
      return res.status(400).json({
        success: false,
        message: "PDF link is required",
      });
    }

    const existingPolicy = await ResearchPolicy.findOne({ title });

    if (existingPolicy) {
      return res.status(409).json({
        success: false,
        message: "This policy already exists. Please update it.",
      });
    }

    const policy = await ResearchPolicy.create({
      title,
      pdfUrl,
      status: status || "Active",
    });

    res.status(201).json({
      success: true,
      message: "Research policy added successfully",
      data: policy,
    });
  } catch (error) {
    console.error("Create Research Policy Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add research policy",
    });
  }
};

/* =========================================
   UPDATE
========================================= */

export const updateResearchPolicy = async (req, res) => {
  try {
    const { title, pdfUrl, status } = req.body;

    if (!pdfUrl || !pdfUrl.trim()) {
      return res.status(400).json({
        success: false,
        message: "PDF link is required",
      });
    }

    const policy = await ResearchPolicy.findByIdAndUpdate(
      req.params.id,
      {
        title,
        pdfUrl,
        status,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Research policy not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Research policy updated successfully",
      data: policy,
    });
  } catch (error) {
    console.error("Update Research Policy Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update research policy",
    });
  }
};

/* =========================================
   DELETE
========================================= */

export const deleteResearchPolicy = async (req, res) => {
  try {
    const policy = await ResearchPolicy.findByIdAndDelete(req.params.id);

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Research policy not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Research policy deleted successfully",
    });
  } catch (error) {
    console.error("Delete Research Policy Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete research policy",
    });
  }
};
