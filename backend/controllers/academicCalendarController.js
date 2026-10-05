import AcademicCalendar from "../models/AcademicCalendar.js";

/* =====================================================
   CREATE ACADEMIC CALENDAR
   ===================================================== */

export const createAcademicCalendar = async (req, res) => {
  try {
    const {
      academicSession,
      semester,
      calendarName,
      pdfUrl,
      order,
      isPublished,
    } = req.body;

    /* ---------------------------------------------
       VALIDATION
       --------------------------------------------- */

    if (!academicSession?.trim()) {
      return res.status(400).json({
        message: "Academic session is required.",
      });
    }

    if (!semester || !["Odd", "Even"].includes(semester)) {
      return res.status(400).json({
        message: "Semester must be Odd or Even.",
      });
    }

    if (!calendarName?.trim()) {
      return res.status(400).json({
        message: "Academic calendar name is required.",
      });
    }

    if (!pdfUrl?.trim()) {
      return res.status(400).json({
        message: "PDF URL is required.",
      });
    }

    /* ---------------------------------------------
       PDF URL VALIDATION
       --------------------------------------------- */

    try {
      new URL(pdfUrl.trim());
    } catch {
      return res.status(400).json({
        message: "Please enter a valid PDF URL.",
      });
    }

    /* ---------------------------------------------
       CREATE
       --------------------------------------------- */

    const academicCalendar = await AcademicCalendar.create({
      academicSession: academicSession.trim(),

      semester,

      calendarName: calendarName.trim() || "Academics Calendar",

      pdfUrl: pdfUrl.trim(),

      order: Number(order) || 0,

      isPublished: typeof isPublished === "boolean" ? isPublished : true,
    });

    return res.status(201).json({
      message: "Academic calendar created successfully.",
      data: academicCalendar,
    });
  } catch (error) {
    console.error("Create academic calendar error:", error);

    return res.status(500).json({
      message: "Failed to create academic calendar.",
    });
  }
};

/* =====================================================
   GET ALL ACADEMIC CALENDARS - ADMIN
   ===================================================== */

export const getAcademicCalendars = async (req, res) => {
  try {
    const calendars = await AcademicCalendar.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      data: calendars,
    });
  } catch (error) {
    console.error("Get academic calendars error:", error);

    return res.status(500).json({
      message: "Failed to fetch academic calendars.",
    });
  }
};

/* =====================================================
   GET PUBLISHED ACADEMIC CALENDARS - PUBLIC
   ===================================================== */

export const getPublicAcademicCalendars = async (req, res) => {
  try {
    const calendars = await AcademicCalendar.find({
      isPublished: true,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      data: calendars,
    });
  } catch (error) {
    console.error("Get public academic calendars error:", error);

    return res.status(500).json({
      message: "Failed to fetch academic calendars.",
    });
  }
};

/* =====================================================
   GET ACADEMIC CALENDAR BY ID - ADMIN
   ===================================================== */

export const getAcademicCalendarById = async (req, res) => {
  try {
    const calendar = await AcademicCalendar.findById(req.params.id);

    if (!calendar) {
      return res.status(404).json({
        message: "Academic calendar not found.",
      });
    }

    return res.status(200).json({
      data: calendar,
    });
  } catch (error) {
    console.error("Get academic calendar by ID error:", error);

    return res.status(500).json({
      message: "Failed to fetch academic calendar.",
    });
  }
};

/* =====================================================
   GET PUBLIC ACADEMIC CALENDAR BY ID
   ===================================================== */

export const getPublicAcademicCalendarById = async (req, res) => {
  try {
    const calendar = await AcademicCalendar.findOne({
      _id: req.params.id,
      isPublished: true,
    });

    if (!calendar) {
      return res.status(404).json({
        message: "Academic calendar not found.",
      });
    }

    return res.status(200).json({
      data: calendar,
    });
  } catch (error) {
    console.error("Get public academic calendar by ID error:", error);

    return res.status(500).json({
      message: "Failed to fetch academic calendar.",
    });
  }
};

/* =====================================================
   UPDATE ACADEMIC CALENDAR
   ===================================================== */

export const updateAcademicCalendar = async (req, res) => {
  try {
    const {
      academicSession,
      semester,
      calendarName,
      pdfUrl,
      order,
      isPublished,
    } = req.body;

    /* ---------------------------------------------
       VALIDATION
       --------------------------------------------- */

    if (!academicSession?.trim()) {
      return res.status(400).json({
        message: "Academic session is required.",
      });
    }

    if (!semester || !["Odd", "Even"].includes(semester)) {
      return res.status(400).json({
        message: "Semester must be Odd or Even.",
      });
    }

    if (!calendarName?.trim()) {
      return res.status(400).json({
        message: "Academic calendar name is required.",
      });
    }

    if (!pdfUrl?.trim()) {
      return res.status(400).json({
        message: "PDF URL is required.",
      });
    }

    /* ---------------------------------------------
       PDF URL VALIDATION
       --------------------------------------------- */

    try {
      new URL(pdfUrl.trim());
    } catch {
      return res.status(400).json({
        message: "Please enter a valid PDF URL.",
      });
    }

    /* ---------------------------------------------
       FIND
       --------------------------------------------- */

    const calendar = await AcademicCalendar.findById(req.params.id);

    if (!calendar) {
      return res.status(404).json({
        message: "Academic calendar not found.",
      });
    }

    /* ---------------------------------------------
       UPDATE
       --------------------------------------------- */

    calendar.academicSession = academicSession.trim();

    calendar.semester = semester;

    calendar.calendarName = calendarName.trim();

    calendar.pdfUrl = pdfUrl.trim();

    calendar.order = Number(order) || 0;

    calendar.isPublished =
      typeof isPublished === "boolean" ? isPublished : calendar.isPublished;

    const updatedCalendar = await calendar.save();

    return res.status(200).json({
      message: "Academic calendar updated successfully.",
      data: updatedCalendar,
    });
  } catch (error) {
    console.error("Update academic calendar error:", error);

    return res.status(500).json({
      message: "Failed to update academic calendar.",
    });
  }
};

/* =====================================================
   DELETE ACADEMIC CALENDAR
   ===================================================== */

export const deleteAcademicCalendar = async (req, res) => {
  try {
    const calendar = await AcademicCalendar.findById(req.params.id);

    if (!calendar) {
      return res.status(404).json({
        message: "Academic calendar not found.",
      });
    }

    await AcademicCalendar.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "Academic calendar deleted successfully.",
    });
  } catch (error) {
    console.error("Delete academic calendar error:", error);

    return res.status(500).json({
      message: "Failed to delete academic calendar.",
    });
  }
};
