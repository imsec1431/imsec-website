import FacultyDevelopmentProgram from "../models/FacultyDevelopmentProgram.js";
import FacultyDevelopmentProgramContent from "../models/FacultyDevelopmentProgramContent.js";

// @desc    Get All FDPs
// @route   GET /api/research/fdp
export const getFDPs = async (req, res) => {
  try {
    const { search, mode, department } = req.query;
    const query = {};

    if (mode && mode !== "All") {
      query.mode = mode;
    }

    if (department && department !== "All") {
      query.department = department;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
        { speaker: { $regex: search, $options: "i" } },
        { organizer: { $regex: search, $options: "i" } },
      ];
    }

    const fdps = await FacultyDevelopmentProgram.find(query).sort({
      priority: -1,
      createdAt: -1,
    });

    const totalCount = await FacultyDevelopmentProgram.countDocuments();
    const offlineCount = await FacultyDevelopmentProgram.countDocuments({
      mode: "Offline",
    });
    const onlineCount = await FacultyDevelopmentProgram.countDocuments({
      mode: "Online",
    });
    const hybridCount = await FacultyDevelopmentProgram.countDocuments({
      mode: "Hybrid",
    });

    res.status(200).json({
      success: true,
      stats: {
        total: totalCount,
        offline: offlineCount,
        online: onlineCount,
        hybrid: hybridCount,
      },
      count: fdps.length,
      data: fdps,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get Single FDP
// @route   GET /api/research/fdp/:id
export const getFDPById = async (req, res) => {
  try {
    const fdp = await FacultyDevelopmentProgram.findById(req.params.id);
    if (!fdp) {
      return res.status(404).json({ success: false, message: "FDP not found" });
    }
    res.status(200).json({ success: true, data: fdp });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc    Create FDP
// @route   POST /api/research/fdp
export const createFDP = async (req, res) => {
  try {
    const fdp = await FacultyDevelopmentProgram.create(req.body);
    res.status(201).json({ success: true, data: fdp });
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

// @desc    Update FDP
// @route   PUT /api/research/fdp/:id
export const updateFDP = async (req, res) => {
  try {
    const fdp = await FacultyDevelopmentProgram.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!fdp) {
      return res.status(404).json({ success: false, message: "FDP not found" });
    }
    res.status(200).json({ success: true, data: fdp });
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

// @desc    Delete FDP
// @route   DELETE /api/research/fdp/:id
export const deleteFDP = async (req, res) => {
  try {
    const fdp = await FacultyDevelopmentProgram.findByIdAndDelete(
      req.params.id,
    );
    if (!fdp) {
      return res.status(404).json({ success: false, message: "FDP not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "FDP deleted successfully", data: {} });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc    Get FDP Content
// @route   GET /api/research/fdp/content
export const getFDPContent = async (req, res) => {
  try {
    let content = await FacultyDevelopmentProgramContent.findOne();
    if (!content) {
      content = await FacultyDevelopmentProgramContent.create({
        sectionTag: "CONTINUOUS LEARNING",
        title: "Faculty Development Programs",
        aboutImage:
          "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&q=80",
        description1:
          "IMS Engineering College regularly organizes Faculty Development Programs (FDPs), Short-Term Training Programs (STTPs), Workshops and Refresher Courses to enhance the teaching, research and professional competencies of faculty members.",
        description2:
          "These programs bridge the gap between academia and industry by providing exposure to emerging technologies, innovative teaching methodologies, research practices and leadership development.",
        stats: [
          { number: "150+", title: "FDPs Conducted" },
          { number: "3500+", title: "Faculty Participants" },
          { number: "85+", title: "Industry Experts" },
          { number: "40+", title: "Collaborating Organizations" },
        ],
        timeline: [
          { year: "2021", count: "18 FDPs" },
          { year: "2022", count: "24 FDPs" },
          { year: "2023", count: "31 FDPs" },
          { year: "2024", count: "39 FDPs" },
        ],
        categories: [
          "Artificial Intelligence",
          "Machine Learning",
          "Cyber Security",
          "Cloud Computing",
          "Data Science",
          "Research Methodology",
          "Outcome Based Education",
          "NEP 2020",
          "Teaching Pedagogy",
          "Innovation & IPR",
          "Leadership Development",
          "Industry Training",
        ],
      });
    }
    res.status(200).json({ success: true, data: content });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc    Update FDP Content
// @route   PUT /api/research/fdp/content
export const updateFDPContent = async (req, res) => {
  try {
    let content = await FacultyDevelopmentProgramContent.findOne();
    if (content) {
      content = await FacultyDevelopmentProgramContent.findByIdAndUpdate(
        content._id,
        req.body,
        {
          new: true,
          runValidators: true,
        },
      );
    } else {
      content = await FacultyDevelopmentProgramContent.create(req.body);
    }
    res.status(200).json({ success: true, data: content });
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
