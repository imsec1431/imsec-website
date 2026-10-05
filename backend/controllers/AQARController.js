import AQAR, { getDefaultAQAR } from "../models/AQAR.js";

// Get existing AQAR or create default
const getOrCreateAQAR = async () => {
  let aqar = await AQAR.findOne({ singletonKey: "aqar" });

  if (!aqar) {
    aqar = await AQAR.create(getDefaultAQAR());
  }

  return aqar;
};

// Public AQAR
export const getAQAR = async (req, res) => {
  try {
    const aqar = await getOrCreateAQAR();

    if (!aqar.published) {
      return res.status(200).json({
        success: true,
        data: {
          title: aqar.title,
          pdfUrl: "",
          published: false,
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: aqar,
    });
  } catch (error) {
    console.error("Get AQAR Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load AQAR information.",
    });
  }
};

// Admin AQAR
export const getAQARAdmin = async (req, res) => {
  try {
    const aqar = await getOrCreateAQAR();

    return res.status(200).json({
      success: true,
      data: aqar,
    });
  } catch (error) {
    console.error("Get AQAR Admin Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load AQAR information.",
    });
  }
};

// Update AQAR
export const updateAQAR = async (req, res) => {
  try {
    let data = req.body;

    // Support { data: {...} } format as well
    if (req.body?.data && typeof req.body.data === "object") {
      data = req.body.data;
    }

    const aqar = await getOrCreateAQAR();

    if (data.title !== undefined) {
      const title = String(data.title).trim();

      if (!title) {
        return res.status(400).json({
          success: false,
          message: "AQAR title is required.",
        });
      }

      aqar.title = title;
    }

    if (data.pdfUrl !== undefined) {
      aqar.pdfUrl = String(data.pdfUrl).trim();
    }

    if (data.published !== undefined) {
      aqar.published = data.published === true || data.published === "true";
    }

    await aqar.save();

    return res.status(200).json({
      success: true,
      message: "AQAR updated successfully.",
      data: aqar,
    });
  } catch (error) {
    console.error("Update AQAR Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update AQAR information.",
    });
  }
};

// Reset AQAR
export const resetAQAR = async (req, res) => {
  try {
    const defaults = getDefaultAQAR();

    let aqar = await AQAR.findOne({
      singletonKey: "aqar",
    });

    if (!aqar) {
      aqar = await AQAR.create(defaults);
    } else {
      aqar.title = defaults.title;
      aqar.pdfUrl = defaults.pdfUrl;
      aqar.published = defaults.published;

      await aqar.save();
    }

    return res.status(200).json({
      success: true,
      message: "AQAR reset to default successfully.",
      data: aqar,
    });
  } catch (error) {
    console.error("Reset AQAR Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to reset AQAR.",
    });
  }
};
