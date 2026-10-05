import NAAC from "../models/NAAC.js";

/* =========================================================
   DEFAULT DATA
========================================================= */

const getDefaultNAAC = () => ({
  singletonKey: "naac",

  hero: {
    title: "NAAC",
    subtitle: "National Assessment and Accreditation Council",
    breadcrumb: "Home / IQAC / NAAC",
  },

  records: [],
});

/* =========================================================
   GET OR CREATE NAAC
========================================================= */

const getOrCreateNAAC = async () => {
  let naac = await NAAC.findOne({
    singletonKey: "naac",
  });

  if (!naac) {
    naac = await NAAC.create(getDefaultNAAC());
  }

  return naac;
};

/* =========================================================
   PUBLIC
   GET /api/naac
========================================================= */

export const getNAAC = async (req, res) => {
  try {
    const naac = await getOrCreateNAAC();

    const responseData = naac.toObject();

    responseData.records = (responseData.records || [])
      .filter((item) => item.published !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    return res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Get NAAC Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch NAAC data.",
    });
  }
};

/* =========================================================
   ADMIN
   GET /api/naac/admin
========================================================= */

export const getNAACAdmin = async (req, res) => {
  try {
    const naac = await getOrCreateNAAC();

    return res.status(200).json({
      success: true,
      data: naac,
    });
  } catch (error) {
    console.error("Get NAAC Admin Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch NAAC admin data.",
    });
  }
};

/* =========================================================
   UPDATE
   PUT /api/naac/admin
========================================================= */

export const updateNAAC = async (req, res) => {
  try {
    const naac = await getOrCreateNAAC();

    let payload = req.body;

    /*
      Supports both normal JSON and
      FormData with a `data` field.
    */

    if (req.body?.data) {
      try {
        payload =
          typeof req.body.data === "string"
            ? JSON.parse(req.body.data)
            : req.body.data;
      } catch (parseError) {
        return res.status(400).json({
          success: false,
          message: "Invalid NAAC data format.",
        });
      }
    }

    /* =====================================================
       HERO
    ===================================================== */

    if (payload.hero) {
      naac.hero = {
        ...naac.hero.toObject?.(),
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

      /*
        Validate records before saving.
      */

      for (let index = 0; index < records.length; index++) {
        const item = records[index];

        if (!item.title) {
          return res.status(400).json({
            success: false,
            message: `NAAC record ${index + 1}: Title is required.`,
          });
        }

        if (!item.heading) {
          return res.status(400).json({
            success: false,
            message: `NAAC record ${index + 1}: Heading is required.`,
          });
        }

        if (!item.pdfUrl) {
          return res.status(400).json({
            success: false,
            message: `NAAC record ${index + 1}: PDF URL is required.`,
          });
        }
      }

      /*
        Replace records.
      */

      naac.records = records;
    }

    await naac.save();

    return res.status(200).json({
      success: true,
      message: "NAAC information updated successfully.",
      data: naac,
    });
  } catch (error) {
    console.error("Update NAAC Error:", error);

    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to update NAAC information.",
    });
  }
};

/* =========================================================
   DELETE RECORD
   DELETE /api/naac/admin/:id
========================================================= */

export const deleteNAACRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const naac = await getOrCreateNAAC();

    const record = naac.records.id(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "NAAC record not found.",
      });
    }

    record.deleteOne();

    await naac.save();

    return res.status(200).json({
      success: true,
      message: "NAAC record deleted successfully.",
      data: naac,
    });
  } catch (error) {
    console.error("Delete NAAC Record Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete NAAC record.",
    });
  }
};

/* =========================================================
   RESET DEFAULTS
   POST /api/naac/admin/reset-defaults
========================================================= */

export const resetNAAC = async (req, res) => {
  try {
    const defaults = getDefaultNAAC();

    const naac = await NAAC.findOneAndUpdate(
      {
        singletonKey: "naac",
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
      message: "NAAC defaults restored successfully.",
      data: naac,
    });
  } catch (error) {
    console.error("Reset NAAC Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reset NAAC defaults.",
    });
  }
};
