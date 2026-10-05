import TrainingInternship, {
  getDefaultTrainingInternship,
} from "../models/TrainingInternship.js";

import cloudinary2 from "../config/cloudinaryConfig2.js";
import fs from "fs";

/* =========================================================
   HELPER — DELETE LOCAL FILE
========================================================= */

const removeLocalFile = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error("Local File Delete Error:", error.message);
  }
};

/* =========================================================
   HELPER — UPLOAD FILE TO CLOUDINARY
========================================================= */

const uploadToCloudinary = async (
  file,
  folder = "imsec/training-internship",
) => {
  if (!file) return null;

  try {
    const result = await cloudinary2.uploader.upload(file.path, {
      folder,
      resource_type: "image",
    });

    removeLocalFile(file.path);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    removeLocalFile(file.path);

    console.error("Cloudinary Upload Error:", error.message);

    throw new Error("Unable to upload image.");
  }
};

/* =========================================================
   GET OR CREATE SINGLETON
========================================================= */

const getOrCreateTrainingInternship = async () => {
  let page = await TrainingInternship.findOne({
    singletonKey: "training-internship",
  });

  if (!page) {
    const defaults = getDefaultTrainingInternship();

    page = await TrainingInternship.create(defaults);
  }

  return page;
};

/* =========================================================
   PUBLIC — GET TRAINING & INTERNSHIP
========================================================= */

export const getTrainingInternship = async (req, res) => {
  try {
    const page = await getOrCreateTrainingInternship();

    const data = page.toObject();

    data.team = (data.team || [])
      .filter((member) => member.published !== false)
      .sort((a, b) => (a.order || 1) - (b.order || 1));

    data.details = (data.details || [])
      .filter((item) => item.published !== false)
      .sort((a, b) => (a.order || 1) - (b.order || 1));

    data.documents = (data.documents || [])
      .filter((item) => item.published !== false)
      .sort((a, b) => (a.order || 1) - (b.order || 1));

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get Training Internship Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load Training & Internship information.",
    });
  }
};

/* =========================================================
   ADMIN — GET TRAINING & INTERNSHIP
========================================================= */

export const getTrainingInternshipAdmin = async (req, res) => {
  try {
    const page = await getOrCreateTrainingInternship();

    return res.status(200).json({
      success: true,
      data: page,
    });
  } catch (error) {
    console.error("Get Training Internship Admin Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load Training & Internship information.",
    });
  }
};

/* =========================================================
   ADMIN — UPDATE PAGE
========================================================= */

export const updateTrainingInternship = async (req, res) => {
  try {
    const page = await getOrCreateTrainingInternship();

    let incomingData = req.body;

    /*
     * Supports FormData:
     * req.body.data = JSON.stringify({...})
     */

    if (req.body?.data) {
      try {
        incomingData = JSON.parse(req.body.data);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid data format.",
        });
      }
    }

    /* =====================================================
         HERO
      ===================================================== */

    if (incomingData.hero) {
      page.hero = {
        ...page.hero?.toObject?.(),
        ...incomingData.hero,
      };
    }

    /* =====================================================
         INTRODUCTION
      ===================================================== */

    if (incomingData.introduction) {
      page.introduction = {
        ...page.introduction?.toObject?.(),
        ...incomingData.introduction,
      };
    }

    /* =====================================================
         TEAM
      ===================================================== */

    if (Array.isArray(incomingData.team)) {
      const existingTeam = page.team || [];

      const incomingTeam = incomingData.team;

      page.team = incomingTeam.map((member, index) => {
        const existingMember = member._id ? existingTeam.id(member._id) : null;

        return {
          ...(existingMember ? existingMember.toObject() : {}),

          ...member,

          order: Number(member.order) || index + 1,
        };
      });
    }

    /* =====================================================
         DETAILS
      ===================================================== */

    if (Array.isArray(incomingData.details)) {
      page.details = incomingData.details.map((item, index) => ({
        ...item,
        order: Number(item.order) || index + 1,
      }));
    }

    /* =====================================================
         DOCUMENTS
      ===================================================== */

    if (Array.isArray(incomingData.documents)) {
      page.documents = incomingData.documents.map((item, index) => ({
        ...item,
        order: Number(item.order) || index + 1,
      }));
    }

    /* =====================================================
         TEAM PHOTO UPLOADS
      ===================================================== */

    const files = req.files || [];

    for (const file of files) {
      /*
       * Expected field names:
       *
       * teamPhoto_0
       * teamPhoto_1
       * teamPhoto_2
       *
       * or
       *
       * teamPhoto_<team-member-id>
       */

      if (!file.fieldname.startsWith("teamPhoto_")) {
        removeLocalFile(file.path);
        continue;
      }

      const identifier = file.fieldname.replace("teamPhoto_", "");

      const uploaded = await uploadToCloudinary(file);

      if (!uploaded) continue;

      /* ===================================================
           FIND TEAM MEMBER
        =================================================== */

      let memberIndex = Number(identifier);

      /*
       * If identifier is not a number,
       * search using MongoDB _id.
       */

      if (Number.isNaN(memberIndex)) {
        memberIndex = page.team.findIndex(
          (member) => String(member._id) === String(identifier),
        );
      }

      if (memberIndex >= 0 && page.team[memberIndex]) {
        /*
         * Delete previous Cloudinary image
         * when possible.
         */

        const oldPublicId = page.team[memberIndex].publicId;

        if (oldPublicId) {
          try {
            await cloudinary2.uploader.destroy(oldPublicId, {
              resource_type: "image",
            });
          } catch (error) {
            console.error("Old Team Photo Delete Error:", error.message);
          }
        }

        page.team[memberIndex].photo = uploaded.url;

        page.team[memberIndex].publicId = uploaded.publicId;
      }
    }

    /* =====================================================
         SAVE
      ===================================================== */

    await page.save();

    return res.status(200).json({
      success: true,
      message: "Training & Internship information updated successfully.",
      data: page,
    });
  } catch (error) {
    console.error("Update Training Internship Error:", error);

    /*
     * Clean any remaining uploaded files.
     */

    const files = req.files || [];

    files.forEach((file) => removeLocalFile(file.path));

    return res.status(500).json({
      success: false,
      message:
        error.message || "Unable to update Training & Internship information.",
    });
  }
};

/* =========================================================
   ADMIN — DELETE TEAM MEMBER
========================================================= */

export const deleteTrainingTeamMember = async (req, res) => {
  try {
    const page = await getOrCreateTrainingInternship();

    const member = page.team.id(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Team member not found.",
      });
    }

    /* ================================================
         DELETE CLOUDINARY PHOTO
      ================================================= */

    if (member.publicId) {
      try {
        await cloudinary2.uploader.destroy(member.publicId, {
          resource_type: "image",
        });
      } catch (error) {
        console.error("Delete Team Photo Error:", error.message);
      }
    }

    page.team.pull(req.params.id);

    await page.save();

    return res.status(200).json({
      success: true,
      message: "Team member deleted successfully.",
      data: page,
    });
  } catch (error) {
    console.error("Delete Team Member Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete team member.",
    });
  }
};

/* =========================================================
   ADMIN — DELETE DOCUMENT
========================================================= */

export const deleteTrainingDocument = async (req, res) => {
  try {
    const page = await getOrCreateTrainingInternship();

    const document = page.documents.id(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    page.documents.pull(req.params.id);

    await page.save();

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully.",
      data: page,
    });
  } catch (error) {
    console.error("Delete Training Document Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete document.",
    });
  }
};

/* =========================================================
   ADMIN — RESET DEFAULTS
========================================================= */

export const resetTrainingInternship = async (req, res) => {
  try {
    const defaults = getDefaultTrainingInternship();

    const page = await getOrCreateTrainingInternship();

    /* ================================================
         DELETE EXISTING TEAM PHOTOS
      ================================================= */

    for (const member of page.team || []) {
      if (member.publicId) {
        try {
          await cloudinary2.uploader.destroy(member.publicId, {
            resource_type: "image",
          });
        } catch (error) {
          console.error("Reset Photo Delete Error:", error.message);
        }
      }
    }

    page.hero = defaults.hero;

    page.introduction = defaults.introduction;

    page.team = defaults.team;

    page.details = defaults.details;

    page.documents = defaults.documents;

    await page.save();

    return res.status(200).json({
      success: true,
      message: "Training & Internship information reset to default data.",
      data: page,
    });
  } catch (error) {
    console.error("Reset Training Internship Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to reset Training & Internship information.",
    });
  }
};
