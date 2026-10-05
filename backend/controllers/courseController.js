import Course from "../models/courseModel.js";

/* =========================================================
   GET ALL COURSES
   Admin
========================================================= */

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({
      category: 1,
      courseName: 1,
      year: 1,
      displayOrder: 1,
    });

    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error("Get courses error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load courses.",
    });
  }
};

/* =========================================================
   GET PUBLISHED COURSES
   Public
========================================================= */

export const getPublishedCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      status: "published",
    }).sort({
      category: 1,
      courseName: 1,
      year: 1,
      displayOrder: 1,
    });

    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error("Get published courses error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load published courses.",
    });
  }
};

/* =========================================================
   GET COURSES BY CATEGORY
   UG / PG
========================================================= */

export const getCoursesByCategory = async (req, res) => {
  try {
    const category = String(req.params.category || "")
      .trim()
      .toUpperCase();

    if (!["UG", "PG"].includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Category must be either UG or PG.",
      });
    }

    const courses = await Course.find({
      category,
      status: "published",
    }).sort({
      courseName: 1,
      year: 1,
      displayOrder: 1,
    });

    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error("Get courses by category error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load courses by category.",
    });
  }
};

/* =========================================================
   GET COURSES BY CATEGORY + COURSE
========================================================= */

export const getCoursesByCourse = async (req, res) => {
  try {
    const category = String(req.params.category || "")
      .trim()
      .toUpperCase();

    const courseName = String(req.params.courseName || "").trim();

    if (!["UG", "PG"].includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Category must be either UG or PG.",
      });
    }

    if (!courseName) {
      return res.status(400).json({
        success: false,
        message: "Course name is required.",
      });
    }

    const courses = await Course.find({
      category,
      courseName,
      status: "published",
    }).sort({
      year: 1,
      displayOrder: 1,
    });

    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error("Get courses by course error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load selected course.",
    });
  }
};

/* =========================================================
   CREATE COURSE
   Admin
========================================================= */

export const createCourse = async (req, res) => {
  try {
    const {
      category,
      courseName,
      year,
      title,
      description,
      pdfLink,
      displayOrder,
      status,
    } = req.body;

    /* ---------------------------------------------
       VALIDATION
    --------------------------------------------- */

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Course category is required.",
      });
    }

    if (!["UG", "PG"].includes(String(category).toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: "Category must be either UG or PG.",
      });
    }

    if (!courseName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Course name is required.",
      });
    }

    if (!year?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Year is required.",
      });
    }

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required.",
      });
    }

    if (!pdfLink?.trim()) {
      return res.status(400).json({
        success: false,
        message: "PDF link is required.",
      });
    }

    /* ---------------------------------------------
       CREATE
    --------------------------------------------- */

    const course = await Course.create({
      category: String(category).trim().toUpperCase(),

      courseName: courseName.trim(),

      year: year.trim(),

      title: title.trim(),

      description: description?.trim() || "",

      pdfLink: pdfLink.trim(),

      displayOrder: Number(displayOrder) || 0,

      status: status === "draft" ? "draft" : "published",
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully.",
      data: course,
    });
  } catch (error) {
    console.error("Create course error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create course.",
    });
  }
};

/* =========================================================
   UPDATE COURSE
   Admin
========================================================= */

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      category,
      courseName,
      year,
      title,
      description,
      pdfLink,
      displayOrder,
      status,
    } = req.body;

    /* ---------------------------------------------
       FIND
    --------------------------------------------- */

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    /* ---------------------------------------------
       VALIDATION
    --------------------------------------------- */

    if (
      category !== undefined &&
      !["UG", "PG"].includes(String(category).toUpperCase())
    ) {
      return res.status(400).json({
        success: false,
        message: "Category must be either UG or PG.",
      });
    }

    if (courseName !== undefined && !courseName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Course name is required.",
      });
    }

    if (year !== undefined && !year.trim()) {
      return res.status(400).json({
        success: false,
        message: "Year is required.",
      });
    }

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required.",
      });
    }

    if (pdfLink !== undefined && !pdfLink.trim()) {
      return res.status(400).json({
        success: false,
        message: "PDF link is required.",
      });
    }

    /* ---------------------------------------------
       UPDATE
    --------------------------------------------- */

    if (category !== undefined) {
      course.category = String(category).trim().toUpperCase();
    }

    if (courseName !== undefined) {
      course.courseName = courseName.trim();
    }

    if (year !== undefined) {
      course.year = year.trim();
    }

    if (title !== undefined) {
      course.title = title.trim();
    }

    if (description !== undefined) {
      course.description = description.trim();
    }

    if (pdfLink !== undefined) {
      course.pdfLink = pdfLink.trim();
    }

    if (displayOrder !== undefined) {
      course.displayOrder = Number(displayOrder) || 0;
    }

    if (status !== undefined) {
      course.status = status === "draft" ? "draft" : "published";
    }

    await course.save();

    res.status(200).json({
      success: true,
      message: "Course updated successfully.",
      data: course,
    });
  } catch (error) {
    console.error("Update course error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update course.",
    });
  }
};

/* =========================================================
   DELETE COURSE
   Admin
========================================================= */

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    await Course.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Course deleted successfully.",
    });
  } catch (error) {
    console.error("Delete course error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete course.",
    });
  }
};
