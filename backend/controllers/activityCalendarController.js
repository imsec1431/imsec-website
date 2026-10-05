import ActivityCalendar from "../models/activityCalendarModel.js";

/* =========================================================
   CREATE ACTIVITY CALENDAR
   ADMIN ONLY
========================================================= */

export const createActivityCalendar = async (req, res) => {
  try {
    const {
      academicSession,
      semester,
      calendarName,
      pdfUrl,
      order,
      isPublished,
    } = req.body;

    if (!academicSession?.trim()) {
      return res.status(400).json({
        message: "Academic Session is required",
      });
    }

    if (!semester) {
      return res.status(400).json({
        message: "Semester is required",
      });
    }

    if (!["Odd", "Even"].includes(semester)) {
      return res.status(400).json({
        message: "Semester must be Odd or Even",
      });
    }

    if (!pdfUrl?.trim()) {
      return res.status(400).json({
        message: "PDF link is required",
      });
    }

    const activityCalendar = await ActivityCalendar.create({
      academicSession: academicSession.trim(),
      semester,
      calendarName: calendarName?.trim() || "Dean IQAC",
      pdfUrl: pdfUrl.trim(),
      order: Number(order) || 0,
      isPublished:
        isPublished === undefined
          ? true
          : isPublished === true || isPublished === "true",
    });

    res.status(201).json({
      message: "Activity Calendar created successfully",
      data: activityCalendar,
    });
  } catch (error) {
    console.error("Create Activity Calendar Error:", error);

    res.status(500).json({
      message: "Failed to create Activity Calendar",
      error: error.message,
    });
  }
};

/* =========================================================
   GET ALL ACTIVITY CALENDARS
   ADMIN ONLY
========================================================= */

export const getActivityCalendars = async (req, res) => {
  try {
    const calendars = await ActivityCalendar.find().sort({
      order: 1,
      createdAt: -1,
    });

    res.status(200).json(calendars);
  } catch (error) {
    console.error("Get Activity Calendars Error:", error);

    res.status(500).json({
      message: "Failed to fetch Activity Calendars",
      error: error.message,
    });
  }
};

/* =========================================================
   GET PUBLISHED ACTIVITY CALENDARS
   PUBLIC — NO AUTHENTICATION
========================================================= */

export const getPublicActivityCalendars = async (req, res) => {
  try {
    const calendars = await ActivityCalendar.find({
      isPublished: true,
    }).sort({
      order: 1,
      createdAt: -1,
    });

    res.status(200).json(calendars);
  } catch (error) {
    console.error("Get Public Activity Calendars Error:", error);

    res.status(500).json({
      message: "Failed to fetch public Activity Calendars",
      error: error.message,
    });
  }
};

/* =========================================================
   GET ACTIVITY CALENDAR BY ID
   ADMIN ONLY
========================================================= */

export const getActivityCalendarById = async (req, res) => {
  try {
    const calendar = await ActivityCalendar.findById(req.params.id);

    if (!calendar) {
      return res.status(404).json({
        message: "Activity Calendar not found",
      });
    }

    res.status(200).json(calendar);
  } catch (error) {
    console.error("Get Activity Calendar By ID Error:", error);

    res.status(500).json({
      message: "Failed to fetch Activity Calendar",
      error: error.message,
    });
  }
};

/* =========================================================
   GET PUBLIC ACTIVITY CALENDAR BY ID
   PUBLIC — NO AUTHENTICATION
========================================================= */

export const getPublicActivityCalendarById = async (req, res) => {
  try {
    const calendar = await ActivityCalendar.findOne({
      _id: req.params.id,
      isPublished: true,
    });

    if (!calendar) {
      return res.status(404).json({
        message: "Published Activity Calendar not found",
      });
    }

    res.status(200).json(calendar);
  } catch (error) {
    console.error("Get Public Activity Calendar By ID Error:", error);

    res.status(500).json({
      message: "Failed to fetch public Activity Calendar",
      error: error.message,
    });
  }
};

/* =========================================================
   UPDATE ACTIVITY CALENDAR
   ADMIN ONLY
========================================================= */

export const updateActivityCalendar = async (req, res) => {
  try {
    const {
      academicSession,
      semester,
      calendarName,
      pdfUrl,
      order,
      isPublished,
    } = req.body;

    const calendar = await ActivityCalendar.findById(req.params.id);

    if (!calendar) {
      return res.status(404).json({
        message: "Activity Calendar not found",
      });
    }

    if (academicSession !== undefined) {
      if (!academicSession.trim()) {
        return res.status(400).json({
          message: "Academic Session is required",
        });
      }

      calendar.academicSession = academicSession.trim();
    }

    if (semester !== undefined) {
      if (!["Odd", "Even"].includes(semester)) {
        return res.status(400).json({
          message: "Semester must be Odd or Even",
        });
      }

      calendar.semester = semester;
    }

    if (calendarName !== undefined) {
      calendar.calendarName = calendarName.trim() || "Dean IQAC";
    }

    if (pdfUrl !== undefined) {
      if (!pdfUrl.trim()) {
        return res.status(400).json({
          message: "PDF link is required",
        });
      }

      calendar.pdfUrl = pdfUrl.trim();
    }

    if (order !== undefined) {
      calendar.order = Number(order) || 0;
    }

    if (isPublished !== undefined) {
      calendar.isPublished = isPublished === true || isPublished === "true";
    }

    await calendar.save();

    res.status(200).json({
      message: "Activity Calendar updated successfully",
      data: calendar,
    });
  } catch (error) {
    console.error("Update Activity Calendar Error:", error);

    res.status(500).json({
      message: "Failed to update Activity Calendar",
      error: error.message,
    });
  }
};

/* =========================================================
   DELETE ACTIVITY CALENDAR
   ADMIN ONLY
========================================================= */

export const deleteActivityCalendar = async (req, res) => {
  try {
    const calendar = await ActivityCalendar.findById(req.params.id);

    if (!calendar) {
      return res.status(404).json({
        message: "Activity Calendar not found",
      });
    }

    await ActivityCalendar.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Activity Calendar deleted successfully",
    });
  } catch (error) {
    console.error("Delete Activity Calendar Error:", error);

    res.status(500).json({
      message: "Failed to delete Activity Calendar",
      error: error.message,
    });
  }
};
