import LibraryTiming from "../models/LibraryTiming.js";

// ======================================
// Get Library Timing
// ======================================

export const getLibraryTiming = async (req, res) => {
  try {
    const timing = await LibraryTiming.findOne();

    res.status(200).json({
      success: true,
      data: timing,
    });
  } catch (error) {
    // console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Save / Update Library Timing
// ======================================

export const saveLibraryTiming = async (req, res) => {
  try {
    let timing = await LibraryTiming.findOne();

    if (timing) {
      timing.mondayFriday = req.body.mondayFriday;
      timing.saturday = req.body.saturday;
      timing.sunday = req.body.sunday;
      timing.holidayNote = req.body.holidayNote;
      timing.active = req.body.active;

      await timing.save();
    } else {
      timing = await LibraryTiming.create({
        mondayFriday: req.body.mondayFriday,
        saturday: req.body.saturday,
        sunday: req.body.sunday,
        holidayNote: req.body.holidayNote,
        active: req.body.active,
      });
    }

    res.status(200).json({
      success: true,
      message: "Library Timing Saved Successfully",
      data: timing,
    });
  } catch (error) {
    // console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
