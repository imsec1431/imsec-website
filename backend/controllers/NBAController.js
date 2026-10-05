import NBA from "../models/NBA.js";

/* =========================================================
   DEFAULT DATA
========================================================= */

const getDefaultNBA = () => ({
  singletonKey: "nba",

  hero: {
    title: "NBA",
    subtitle: "National Board of Accreditation",
    breadcrumb: "Home / IQAC / NBA",
  },

  records: [],
});

/* =========================================================
   GET OR CREATE NBA
========================================================= */

const getOrCreateNBA = async () => {
  let nba = await NBA.findOne({
    singletonKey: "nba",
  });

  if (!nba) {
    nba = await NBA.create(getDefaultNBA());
  }

  return nba;
};

/* =========================================================
   PUBLIC
   GET /api/nba
========================================================= */

export const getNBA = async (req, res) => {
  try {
    const nba = await getOrCreateNBA();

    const responseData = nba.toObject();

    responseData.records = (responseData.records || [])
      .filter((item) => item.published !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    return res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Get NBA Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch NBA data.",
    });
  }
};

/* =========================================================
   ADMIN
   GET /api/nba/admin
========================================================= */

export const getNBAAdmin = async (req, res) => {
  try {
    const nba = await getOrCreateNBA();

    return res.status(200).json({
      success: true,
      data: nba,
    });
  } catch (error) {
    console.error("Get NBA Admin Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch NBA admin data.",
    });
  }
};

/* =========================================================
   UPDATE
   PUT /api/nba/admin
========================================================= */

export const updateNBA = async (req, res) => {
  try {
    const nba = await getOrCreateNBA();

    let payload = req.body;

    /* =====================================================
       SUPPORT `data` PAYLOAD
    ===================================================== */

    if (req.body?.data) {
      try {
        payload =
          typeof req.body.data === "string"
            ? JSON.parse(req.body.data)
            : req.body.data;
      } catch (parseError) {
        return res.status(400).json({
          success: false,
          message: "Invalid NBA data format.",
        });
      }
    }

    /* =====================================================
       HERO
    ===================================================== */

    if (payload.hero) {
      nba.hero = {
        ...nba.hero?.toObject?.(),
        ...payload.hero,
      };
    }

    /* =====================================================
       RECORDS
    ===================================================== */

    if (Array.isArray(payload.records)) {
      const records = payload.records
        .filter((item) => item && typeof item === "object")
        .map((item, index) => ({
          _id: item._id || undefined,

          title: String(item.title || "").trim(),

          heading: String(item.heading || "").trim(),

          pdfUrl: String(item.pdfUrl || "").trim(),

          published: item.published !== false,

          order: Number.isFinite(Number(item.order))
            ? Number(item.order)
            : index + 1,
        }));

      /* ===================================================
         VALIDATION
      =================================================== */

      for (let index = 0; index < records.length; index++) {
        const item = records[index];

        if (!item.title) {
          return res.status(400).json({
            success: false,
            message: `NBA record ${index + 1}: Title is required.`,
          });
        }

        if (!item.heading) {
          return res.status(400).json({
            success: false,
            message: `NBA record ${index + 1}: Heading is required.`,
          });
        }

        if (!item.pdfUrl) {
          return res.status(400).json({
            success: false,
            message: `NBA record ${index + 1}: PDF URL is required.`,
          });
        }
      }

      nba.records = records;
    }

    await nba.save();

    return res.status(200).json({
      success: true,
      message: "NBA information updated successfully.",
      data: nba,
    });
  } catch (error) {
    console.error("Update NBA Error:", error);

    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to update NBA information.",
    });
  }
};

/* =========================================================
   DELETE RECORD
   DELETE /api/nba/admin/:id
========================================================= */

export const deleteNBARecord = async (req, res) => {
  try {
    const { id } = req.params;

    const nba = await getOrCreateNBA();

    const record = nba.records.id(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "NBA record not found.",
      });
    }

    record.deleteOne();

    await nba.save();

    return res.status(200).json({
      success: true,
      message: "NBA record deleted successfully.",
      data: nba,
    });
  } catch (error) {
    console.error("Delete NBA Record Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete NBA record.",
    });
  }
};

/* =========================================================
   RESET DEFAULTS
   POST /api/nba/admin/reset-defaults
========================================================= */

export const resetNBA = async (req, res) => {
  try {
    const defaults = getDefaultNBA();

    const nba = await NBA.findOneAndUpdate(
      {
        singletonKey: "nba",
      },
      defaults,
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "NBA defaults restored successfully.",
      data: nba,
    });
  } catch (error) {
    console.error("Reset NBA Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reset NBA defaults.",
    });
  }
};
