import NIRF from "../models/NIRF.js";

/* =========================================================
   DEFAULT DATA
========================================================= */

const getDefaultNIRF = () => ({
  singletonKey: "nirf",

  hero: {
    title: "NIRF",
    subtitle: "National Institutional Ranking Framework",
    breadcrumb: "Home / IQAC / NIRF",
  },

  records: [],
});

/* =========================================================
   GET OR CREATE NIRF
========================================================= */

const getOrCreateNIRF = async () => {
  let nirf = await NIRF.findOne({
    singletonKey: "nirf",
  });

  if (!nirf) {
    nirf = await NIRF.create(getDefaultNIRF());
  }

  return nirf;
};

/* =========================================================
   PUBLIC
   GET /api/nirf
========================================================= */

export const getNIRF = async (req, res) => {
  try {
    const nirf = await getOrCreateNIRF();

    const responseData = nirf.toObject();

    responseData.records = (responseData.records || [])
      .filter((item) => item.published !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    return res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Get NIRF Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch NIRF data.",
    });
  }
};

/* =========================================================
   ADMIN
   GET /api/nirf/admin
========================================================= */

export const getNIRFAdmin = async (req, res) => {
  try {
    const nirf = await getOrCreateNIRF();

    return res.status(200).json({
      success: true,
      data: nirf,
    });
  } catch (error) {
    console.error("Get NIRF Admin Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch NIRF admin data.",
    });
  }
};

/* =========================================================
   UPDATE
   PUT /api/nirf/admin
========================================================= */

export const updateNIRF = async (req, res) => {
  try {
    const nirf = await getOrCreateNIRF();

    let payload = req.body;

    /*
      Supports normal JSON as well as
      FormData containing a `data` field.
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
          message: "Invalid NIRF data format.",
        });
      }
    }

    /* =====================================================
       HERO
    ===================================================== */

    if (payload.hero) {
      nirf.hero = {
        ...nirf.hero?.toObject?.(),
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
            message: `NIRF record ${index + 1}: Title is required.`,
          });
        }

        if (!item.heading) {
          return res.status(400).json({
            success: false,
            message: `NIRF record ${index + 1}: Heading is required.`,
          });
        }

        if (!item.pdfUrl) {
          return res.status(400).json({
            success: false,
            message: `NIRF record ${index + 1}: PDF URL is required.`,
          });
        }
      }

      nirf.records = records;
    }

    await nirf.save();

    return res.status(200).json({
      success: true,
      message: "NIRF information updated successfully.",
      data: nirf,
    });
  } catch (error) {
    console.error("Update NIRF Error:", error);

    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to update NIRF information.",
    });
  }
};

/* =========================================================
   DELETE RECORD
   DELETE /api/nirf/admin/:id
========================================================= */

export const deleteNIRFRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const nirf = await getOrCreateNIRF();

    const record = nirf.records.id(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "NIRF record not found.",
      });
    }

    record.deleteOne();

    await nirf.save();

    return res.status(200).json({
      success: true,
      message: "NIRF record deleted successfully.",
      data: nirf,
    });
  } catch (error) {
    console.error("Delete NIRF Record Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete NIRF record.",
    });
  }
};

/* =========================================================
   RESET DEFAULTS
   POST /api/nirf/admin/reset-defaults
========================================================= */

export const resetNIRF = async (req, res) => {
  try {
    const defaults = getDefaultNIRF();

    const nirf = await NIRF.findOneAndUpdate(
      {
        singletonKey: "nirf",
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
      message: "NIRF defaults restored successfully.",
      data: nirf,
    });
  } catch (error) {
    console.error("Reset NIRF Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reset NIRF defaults.",
    });
  }
};
