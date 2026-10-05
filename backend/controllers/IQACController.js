import IQAC, { getDefaultIQAC } from "../models/IQAC.js";

/* =====================================================
   GET OR CREATE IQAC
===================================================== */

const getOrCreateIQAC = async () => {
  let iqac = await IQAC.findOne({
    singletonKey: "iqac",
  });

  if (!iqac) {
    iqac = await IQAC.create(getDefaultIQAC());
  }

  return iqac;
};

/* =====================================================
   PUBLIC GET
===================================================== */

export const getIQAC = async (req, res) => {
  try {
    const iqac = await getOrCreateIQAC();

    /*
     * If unpublished, keep basic public
     * page information but hide detailed
     * administrative content.
     */

    if (!iqac.published) {
      return res.status(200).json({
        success: true,

        data: {
          title: iqac.title,
          heroSubtitle: iqac.heroSubtitle,
          breadcrumb: iqac.breadcrumb,

          heading: iqac.heading,
          description: iqac.description,

          aboutHeading: iqac.aboutHeading,
          aboutDescription: iqac.aboutDescription,

          functionsHeading: iqac.functionsHeading,

          functionsDescription: iqac.functionsDescription,

          membersHeading: iqac.membersHeading,

          membersDescription: iqac.membersDescription,

          meetingsHeading: iqac.meetingsHeading,

          meetingsDescription: iqac.meetingsDescription,

          initiativesHeading: iqac.initiativesHeading,

          initiativesDescription: iqac.initiativesDescription,

          documentsHeading: iqac.documentsHeading,

          coordinatorName: "",
          coordinatorDesignation: "",
          coordinatorEmail: "",
          coordinatorPhone: "",

          members: [],
          documents: [],
          initiatives: [],

          published: false,
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: iqac,
    });
  } catch (error) {
    console.error("Get IQAC Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load IQAC information.",
    });
  }
};

/* =====================================================
   ADMIN GET
===================================================== */

export const getIQACAdmin = async (req, res) => {
  try {
    const iqac = await getOrCreateIQAC();

    return res.status(200).json({
      success: true,
      data: iqac,
    });
  } catch (error) {
    console.error("Get IQAC Admin Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load IQAC information.",
    });
  }
};

/* =====================================================
   UPDATE IQAC
===================================================== */

export const updateIQAC = async (req, res) => {
  try {
    const iqac = await getOrCreateIQAC();

    let incomingData = req.body;

    /*
     * Supports:
     *
     * JSON body
     *
     * OR
     *
     * {
     *   data: JSON string
     * }
     */

    if (req.body?.data) {
      try {
        incomingData =
          typeof req.body.data === "string"
            ? JSON.parse(req.body.data)
            : req.body.data;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid data format.",
        });
      }
    }

    /* =================================================
       TEXT FIELDS
    ================================================= */

    const textFields = [
      "title",
      "heroSubtitle",
      "breadcrumb",
      "heading",
      "description",

      "aboutHeading",
      "aboutDescription",

      "functionsHeading",
      "functionsDescription",

      "membersHeading",
      "membersDescription",

      "meetingsHeading",
      "meetingsDescription",

      "initiativesHeading",
      "initiativesDescription",

      "documentsHeading",

      "coordinatorName",
      "coordinatorDesignation",
      "coordinatorEmail",
      "coordinatorPhone",
    ];

    textFields.forEach((field) => {
      if (incomingData[field] !== undefined) {
        iqac[field] =
          typeof incomingData[field] === "string"
            ? incomingData[field].trim()
            : incomingData[field];
      }
    });

    /* =================================================
       PUBLISHED
    ================================================= */

    if (incomingData.published !== undefined) {
      iqac.published =
        incomingData.published === true || incomingData.published === "true";
    }

    /* =================================================
       MEMBERS
    ================================================= */

    if (incomingData.members !== undefined) {
      let members = incomingData.members;

      if (typeof members === "string") {
        try {
          members = JSON.parse(members);
        } catch (error) {
          return res.status(400).json({
            success: false,
            message: "Invalid members data.",
          });
        }
      }

      if (!Array.isArray(members)) {
        return res.status(400).json({
          success: false,
          message: "Members must be an array.",
        });
      }

      iqac.members = members;
    }

    /* =================================================
       DOCUMENTS
    ================================================= */

    if (incomingData.documents !== undefined) {
      let documents = incomingData.documents;

      if (typeof documents === "string") {
        try {
          documents = JSON.parse(documents);
        } catch (error) {
          return res.status(400).json({
            success: false,
            message: "Invalid documents data.",
          });
        }
      }

      if (!Array.isArray(documents)) {
        return res.status(400).json({
          success: false,
          message: "Documents must be an array.",
        });
      }

      iqac.documents = documents;
    }

    /* =================================================
       INITIATIVES
    ================================================= */

    if (incomingData.initiatives !== undefined) {
      let initiatives = incomingData.initiatives;

      if (typeof initiatives === "string") {
        try {
          initiatives = JSON.parse(initiatives);
        } catch (error) {
          return res.status(400).json({
            success: false,
            message: "Invalid initiatives data.",
          });
        }
      }

      if (!Array.isArray(initiatives)) {
        return res.status(400).json({
          success: false,
          message: "Initiatives must be an array.",
        });
      }

      iqac.initiatives = initiatives;
    }

    /* =================================================
       VALIDATION
    ================================================= */

    const requiredFields = [
      "title",
      "heroSubtitle",
      "breadcrumb",
      "heading",
      "description",

      "aboutHeading",
      "aboutDescription",

      "functionsHeading",
      "functionsDescription",

      "membersHeading",
      "membersDescription",

      "meetingsHeading",
      "meetingsDescription",

      "initiativesHeading",
      "initiativesDescription",

      "documentsHeading",
    ];

    for (const field of requiredFields) {
      if (!iqac[field] || String(iqac[field]).trim() === "") {
        return res.status(400).json({
          success: false,
          message: `${field} is required.`,
        });
      }
    }

    /* =================================================
       SAVE
    ================================================= */

    await iqac.save();

    return res.status(200).json({
      success: true,
      message: "IQAC information updated successfully.",
      data: iqac,
    });
  } catch (error) {
    console.error("Update IQAC Error:", error);

    return res.status(500).json({
      success: false,
      message: error?.message || "Unable to update IQAC information.",
    });
  }
};

/* =====================================================
   RESET DEFAULTS
===================================================== */

export const resetIQAC = async (req, res) => {
  try {
    const defaultData = getDefaultIQAC();

    const iqac = await IQAC.findOneAndUpdate(
      {
        singletonKey: "iqac",
      },
      defaultData,
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "IQAC information reset to defaults.",
      data: iqac,
    });
  } catch (error) {
    console.error("Reset IQAC Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to reset IQAC information.",
    });
  }
};
