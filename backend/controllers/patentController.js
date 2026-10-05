import Patent from "../models/Patent.js";
import PatentContent from "../models/PatentContent.js";

// @desc    Get all patents (with dynamic stats calculation)
// @route   GET /api/patents
export const getPatents = async (req, res) => {
  try {
    const { search, status } = req.query;
    const query = {};

    if (status && status !== "All") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { inventors: { $regex: search, $options: "i" } },
        { applicationNo: { $regex: search, $options: "i" } },
      ];
    }

    const patents = await Patent.find(query).sort({
      priority: -1,
      createdAt: -1,
    });

    const filedCount = await Patent.countDocuments({ status: "Filed" });
    const grantedCount = await Patent.countDocuments({ status: "Granted" });
    const publishedCount = await Patent.countDocuments({ status: "Published" });
    const totalCount = await Patent.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        total: totalCount,
        filed: filedCount,
        granted: grantedCount,
        published: publishedCount,
      },
      count: patents.length,
      data: patents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get single patent by ID
// @route   GET /api/patents/:id
export const getPatentById = async (req, res) => {
  try {
    const patent = await Patent.findById(req.params.id);
    if (!patent) {
      return res
        .status(404)
        .json({ success: false, message: "Patent not found" });
    }
    res.status(200).json({ success: true, data: patent });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc    Create new patent
// @route   POST /api/patents
export const createPatent = async (req, res) => {
  try {
    const patent = await Patent.create(req.body);
    res.status(201).json({ success: true, data: patent });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Application Number already exists.",
      });
    }
    res.status(400).json({
      success: false,
      message: "Validation Error",
      error: error.message,
    });
  }
};

// @desc    Update patent
// @route   PUT /api/patents/:id
export const updatePatent = async (req, res) => {
  try {
    const patent = await Patent.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!patent) {
      return res
        .status(404)
        .json({ success: false, message: "Patent not found" });
    }
    res.status(200).json({ success: true, data: patent });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Validation Error",
      error: error.message,
    });
  }
};

// @desc    Delete patent
// @route   DELETE /api/patents/:id
export const deletePatent = async (req, res) => {
  try {
    const patent = await Patent.findByIdAndDelete(req.params.id);
    if (!patent) {
      return res
        .status(404)
        .json({ success: false, message: "Patent not found" });
    }
    res.status(200).json({
      success: true,
      message: "Patent deleted successfully",
      data: {},
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};
export const getPatentContent = async (req, res) => {
  try {
    let content = await PatentContent.findOne();
    if (!content) {
      // Seed default if empty
      content = await PatentContent.create({
        sectionTag: "RESEARCH & INNOVATION",
        title: "Intellectual Property & Patents",
        aboutImage:
          "https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=1200&q=80",
        description1:
          "IMS Engineering College promotes innovation, creativity and intellectual property through quality research and patent filing. Faculty members and students are encouraged to transform innovative ideas into valuable intellectual assets.",
        description2:
          "The institute actively supports patent drafting, filing, publication and commercialization through its Research & Development Cell.",
        stats: [
          { number: "150+", title: "Patent Filed" },
          { number: "40+", title: "Patent Granted" },
          { number: "12", title: "Copyrights" },
          { number: "18", title: "Design Patents" },
        ],
        timeline: [
          { year: "2022", count: "15 Filed" },
          { year: "2023", count: "28 Filed" },
          { year: "2024", count: "42 Filed" },
          { year: "2025", count: "55 Filed" },
        ],
      });
    }

    res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc    Update Patent Page Content
// @route   PUT /api/research/patent/content
export const updatePatentContent = async (req, res) => {
  try {
    let content = await PatentContent.findOne();
    if (content) {
      content = await PatentContent.findByIdAndUpdate(content._id, req.body, {
        new: true,
        runValidators: true,
      });
    } else {
      content = await PatentContent.create(req.body);
    }

    res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error) {
    res
      .status(400)
      .json({
        success: false,
        message: "Validation Error",
        error: error.message,
      });
  }
};
