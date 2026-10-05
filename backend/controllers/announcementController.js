import Announcement from "../models/Announcement.js";

/* ==========================================
        Add Announcement
========================================== */

export const addAnnouncement = async (req, res) => {
  try {
    const { title, description, date, active } = req.body;

    const announcement = await Announcement.create({
      title,
      description,
      date,
      active,
    });

    res.status(201).json({
      success: true,
      message: "Announcement Added Successfully",
      data: announcement,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
        Get All Announcements
========================================== */

export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({
      date: -1,
    });

    res.status(200).json({
      success: true,
      count: announcements.length,
      data: announcements,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
        Get Single Announcement
========================================== */

export const getAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    res.status(200).json({
      success: true,
      data: announcement,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
        Update Announcement
========================================== */

export const updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    announcement.title = req.body.title;
    announcement.description = req.body.description;
    announcement.date = req.body.date;
    announcement.active = req.body.active;

    await announcement.save();

    res.status(200).json({
      success: true,
      message: "Announcement Updated Successfully",
      data: announcement,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
        Delete Announcement
========================================== */

export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    await announcement.deleteOne();

    res.status(200).json({
      success: true,
      message: "Announcement Deleted Successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
