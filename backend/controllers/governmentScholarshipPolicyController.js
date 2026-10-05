import GovernmentScholarshipPolicy from "../models/GovernmentScholarshipPolicy.js";

/* =========================================================
   DEFAULT DATA
========================================================= */

const DEFAULT_POLICY = {
  title: "Government Scholarship Policies",

  pdfUrl: "",

  isPublished: false,
};

/* =========================================================
   GET ADMIN POLICY
========================================================= */

export const getAdminGovernmentScholarshipPolicy = async (req, res) => {
  try {
    let policy = await GovernmentScholarshipPolicy.findOne();

    /*
     * Create default record on first use.
     */

    if (!policy) {
      policy = await GovernmentScholarshipPolicy.create(DEFAULT_POLICY);
    }

    return res.status(200).json({
      success: true,

      data: policy,
    });
  } catch (error) {
    console.error("GET ADMIN GOVERNMENT SCHOLARSHIP POLICY ERROR:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to load government scholarship policy.",
    });
  }
};

/* =========================================================
   GET PUBLIC POLICY
========================================================= */

export const getPublicGovernmentScholarshipPolicy = async (req, res) => {
  try {
    const policy = await GovernmentScholarshipPolicy.findOne({
      isPublished: true,
    });

    return res.status(200).json({
      success: true,

      data: policy || null,
    });
  } catch (error) {
    console.error("GET PUBLIC GOVERNMENT SCHOLARSHIP POLICY ERROR:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to load government scholarship policy.",
    });
  }
};

/* =========================================================
   UPDATE POLICY
========================================================= */

export const updateGovernmentScholarshipPolicy = async (req, res) => {
  try {
    let policy = await GovernmentScholarshipPolicy.findOne();

    /*
     * Create if it doesn't exist.
     */

    if (!policy) {
      policy = await GovernmentScholarshipPolicy.create(DEFAULT_POLICY);
    }

    /* -----------------------------------------------------
         TITLE
      ----------------------------------------------------- */

    if (req.body.title !== undefined) {
      const title = String(req.body.title).trim();

      if (!title) {
        return res.status(400).json({
          success: false,

          message: "Policy title is required.",
        });
      }

      policy.title = title;
    }

    /* -----------------------------------------------------
         PDF URL
      ----------------------------------------------------- */

    if (req.body.pdfUrl !== undefined) {
      policy.pdfUrl = String(req.body.pdfUrl || "").trim();
    }

    /* -----------------------------------------------------
         PUBLISHED
      ----------------------------------------------------- */

    if (req.body.isPublished !== undefined) {
      policy.isPublished = Boolean(req.body.isPublished);
    }

    await policy.save();

    return res.status(200).json({
      success: true,

      message: "Government scholarship policy updated successfully.",

      data: policy,
    });
  } catch (error) {
    console.error("UPDATE GOVERNMENT SCHOLARSHIP POLICY ERROR:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to update government scholarship policy.",
    });
  }
};

/* =========================================================
   CREATE POLICY
========================================================= */

export const createGovernmentScholarshipPolicy = async (req, res) => {
  try {
    let policy = await GovernmentScholarshipPolicy.findOne();

    /*
     * We maintain one policy record.
     *
     * Therefore create behaves as save/update
     * if a record already exists.
     */

    if (!policy) {
      policy = await GovernmentScholarshipPolicy.create({
        title: String(req.body.title || DEFAULT_POLICY.title).trim(),

        pdfUrl: String(req.body.pdfUrl || "").trim(),

        isPublished:
          req.body.isPublished !== undefined
            ? Boolean(req.body.isPublished)
            : false,
      });
    } else {
      policy.title = String(req.body.title || policy.title).trim();

      policy.pdfUrl = String(req.body.pdfUrl || "").trim();

      if (req.body.isPublished !== undefined) {
        policy.isPublished = Boolean(req.body.isPublished);
      }

      await policy.save();
    }

    return res.status(200).json({
      success: true,

      message: "Government scholarship policy saved successfully.",

      data: policy,
    });
  } catch (error) {
    console.error("CREATE GOVERNMENT SCHOLARSHIP POLICY ERROR:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to save government scholarship policy.",
    });
  }
};

/* =========================================================
   PUBLISH
========================================================= */

export const publishGovernmentScholarshipPolicy = async (req, res) => {
  try {
    const policy = await GovernmentScholarshipPolicy.findOne();

    if (!policy) {
      return res.status(404).json({
        success: false,

        message: "Government scholarship policy not found.",
      });
    }

    if (!policy.pdfUrl || !policy.pdfUrl.trim()) {
      return res.status(400).json({
        success: false,

        message: "Please add the PDF URL before publishing.",
      });
    }

    policy.isPublished = true;

    await policy.save();

    return res.status(200).json({
      success: true,

      message: "Government scholarship policy published successfully.",

      data: policy,
    });
  } catch (error) {
    console.error("PUBLISH GOVERNMENT SCHOLARSHIP POLICY ERROR:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to publish government scholarship policy.",
    });
  }
};

/* =========================================================
   UNPUBLISH
========================================================= */

export const unpublishGovernmentScholarshipPolicy = async (req, res) => {
  try {
    const policy = await GovernmentScholarshipPolicy.findOne();

    if (!policy) {
      return res.status(404).json({
        success: false,

        message: "Government scholarship policy not found.",
      });
    }

    policy.isPublished = false;

    await policy.save();

    return res.status(200).json({
      success: true,

      message: "Government scholarship policy unpublished successfully.",

      data: policy,
    });
  } catch (error) {
    console.error("UNPUBLISH GOVERNMENT SCHOLARSHIP POLICY ERROR:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to unpublish government scholarship policy.",
    });
  }
};
