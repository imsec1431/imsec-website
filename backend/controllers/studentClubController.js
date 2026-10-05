import mongoose from "mongoose";

import StudentClub from "../models/StudentClub.js";

import cloudinary5 from "../config/cloudinaryConfig5.js";

/* =========================================================
   DEFAULT DATA
========================================================= */

const DEFAULT_DATA = {
  singletonKey: "student-clubs",

  hero: {
    title: "Student Clubs",

    subtitle: "Explore student clubs and activities at IMSEC",

    breadcrumb: "Home / Life @ IMSEC / Student Clubs",
  },

  clubs: [],
};

/* =========================================================
   CLOUDINARY - UPLOAD IMAGE
========================================================= */

const uploadImage = async (file) => {
  if (!file) {
    return null;
  }

  if (!file.path) {
    throw new Error("Uploaded image file path is missing.");
  }

  const result = await cloudinary5.uploader.upload(file.path, {
    folder: "life-imsec/student-clubs",

    resource_type: "image",
  });

  return {
    url: result.secure_url,

    publicId: result.public_id,
  };
};

/* =========================================================
   CLOUDINARY - DELETE IMAGE
========================================================= */

const deleteImage = async (publicId) => {
  if (!publicId) {
    return;
  }

  try {
    await cloudinary5.uploader.destroy(publicId, {
      resource_type: "image",
    });

    // console.log("Cloudinary image deleted:", publicId);
  } catch (error) {
    /*
     * We do not stop the complete database operation
     * if Cloudinary deletion fails.
     */

    console.error("Cloudinary delete error:", publicId, error?.message);
  }
};

/* =========================================================
   GET / PUBLIC
========================================================= */

export const getStudentClubs = async (req, res) => {
  try {
    let data = await StudentClub.findOne({
      singletonKey: "student-clubs",
    }).lean();

    /* -----------------------------------------------------
       CREATE DEFAULT DOCUMENT IF NOT EXISTS
    ----------------------------------------------------- */

    if (!data) {
      const created = await StudentClub.create(DEFAULT_DATA);

      data = created.toObject();
    }

    return res.status(200).json({
      success: true,

      data,
    });
  } catch (error) {
    console.error("Get Student Clubs Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to fetch Student Clubs.",
    });
  }
};

/* =========================================================
   GET / ADMIN
========================================================= */

export const getStudentClubsAdmin = async (req, res) => {
  try {
    let data = await StudentClub.findOne({
      singletonKey: "student-clubs",
    }).lean();

    /* ---------------------------------------------------
         CREATE DEFAULT DOCUMENT
      --------------------------------------------------- */

    if (!data) {
      const created = await StudentClub.create(DEFAULT_DATA);

      data = created.toObject();
    }

    return res.status(200).json({
      success: true,

      data,
    });
  } catch (error) {
    console.error("Get Student Clubs Admin Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to fetch Student Clubs.",
    });
  }
};

/* =========================================================
   UPDATE STUDENT CLUBS
   PUT /api/student-clubs/admin
========================================================= */

export const updateStudentClubs = async (req, res) => {
  try {
    /* ---------------------------------------------------
         FIND EXISTING DOCUMENT
      --------------------------------------------------- */

    let existing = await StudentClub.findOne({
      singletonKey: "student-clubs",
    });

    if (!existing) {
      existing = await StudentClub.create(DEFAULT_DATA);
    }

    /* ---------------------------------------------------
         PARSE FORM DATA
      --------------------------------------------------- */

    let data = {};

    try {
      data =
        typeof req.body?.data === "string"
          ? JSON.parse(req.body.data)
          : req.body?.data || {};
    } catch (error) {
      console.error("Student Clubs JSON Parse Error:", error);

      return res.status(400).json({
        success: false,

        message: "Invalid Student Clubs data.",
      });
    }

    /* ---------------------------------------------------
         FILES
      --------------------------------------------------- */

    const files = Array.isArray(req.files) ? req.files : [];

    // console.log("========================================");

    // console.log("STUDENT CLUB UPDATE");

    // console.log("FILES RECEIVED:", files.length);

    files.forEach((file) => {
      // console.log({
      //   fieldname: file.fieldname,
      //   originalname: file.originalname,
      //   mimetype: file.mimetype,
      //   size: file.size,
      //   path: file.path,
      // });
    });

    // console.log("========================================");

    /* ---------------------------------------------------
         CLUB ARRAYS
      --------------------------------------------------- */

    const submittedClubs = Array.isArray(data.clubs) ? data.clubs : [];

    const existingClubs = Array.isArray(existing.clubs) ? existing.clubs : [];

    /* ===================================================
         BUILD SUBMITTED IDS
      =================================================== */

    const submittedIds = submittedClubs
      .filter((club) => club?._id)
      .map((club) => String(club._id));

    /* ===================================================
         DELETE CLUBS REMOVED FROM FORM
         
         This protects us even if the admin deletes a
         club from the page and then clicks Save Changes.
      =================================================== */

    for (const oldClub of existingClubs) {
      const oldId = String(oldClub._id);

      if (!submittedIds.includes(oldId)) {
        // console.log("Club removed during update:", oldId);

        /* ---------------------------------------------
             DELETE CLUB IMAGE
          --------------------------------------------- */

        if (oldClub?.image?.publicId) {
          await deleteImage(oldClub.image.publicId);
        }

        /* ---------------------------------------------
             DELETE COORDINATOR IMAGE
          --------------------------------------------- */

        if (oldClub?.coordinator?.image?.publicId) {
          await deleteImage(oldClub.coordinator.image.publicId);
        }
      }
    }

    /* ===================================================
         BUILD UPDATED CLUB ARRAY
      =================================================== */

    const updatedClubs = [];

    for (let index = 0; index < submittedClubs.length; index++) {
      const submittedClub = submittedClubs[index];

      /* -----------------------------------------------
           FIND EXISTING CLUB
        ----------------------------------------------- */

      let oldClub = null;

      if (submittedClub?._id) {
        oldClub =
          existingClubs.find(
            (club) => String(club._id) === String(submittedClub._id),
          ) || null;
      }

      /* -----------------------------------------------
           OLD IMAGES
        ----------------------------------------------- */

      const oldClubImage = oldClub?.image || {};

      const oldCoordinatorImage = oldClub?.coordinator?.image || {};

      /* -----------------------------------------------
           CURRENT IMAGES
        ----------------------------------------------- */

      let clubImage = submittedClub?.image || {};

      let coordinatorImage = submittedClub?.coordinator?.image || {};

      /* =================================================
           FIND CLUB IMAGE FILE
        ================================================= */

      let clubImageFile = null;

      if (submittedClub?._id) {
        clubImageFile = files.find(
          (file) => file.fieldname === `clubImage_${submittedClub._id}`,
        );
      } else {
        clubImageFile = files.find(
          (file) => file.fieldname === `clubImage_new_${index}`,
        );
      }

      /* =================================================
           FIND COORDINATOR IMAGE FILE
        ================================================= */

      let coordinatorImageFile = null;

      if (submittedClub?._id) {
        coordinatorImageFile = files.find(
          (file) => file.fieldname === `coordinatorImage_${submittedClub._id}`,
        );
      } else {
        coordinatorImageFile = files.find(
          (file) => file.fieldname === `coordinatorImage_new_${index}`,
        );
      }

      /* =================================================
           REMOVE CLUB IMAGE
        ================================================= */

      const removeClubImage = submittedClub?._removeClubImage === true;

      if (removeClubImage && oldClubImage?.publicId && !clubImageFile) {
        await deleteImage(oldClubImage.publicId);

        clubImage = {};
      }

      /* =================================================
           REMOVE COORDINATOR IMAGE
        ================================================= */

      const removeCoordinatorImage =
        submittedClub?._removeCoordinatorImage === true;

      if (
        removeCoordinatorImage &&
        oldCoordinatorImage?.publicId &&
        !coordinatorImageFile
      ) {
        await deleteImage(oldCoordinatorImage.publicId);

        coordinatorImage = {};
      }

      /* =================================================
           UPLOAD NEW CLUB IMAGE
        ================================================= */

      if (clubImageFile) {
        // console.log("Uploading CLUB image:", clubImageFile.originalname);

        /*
         * Delete previous Cloudinary image
         * before replacing it.
         */

        if (oldClubImage?.publicId) {
          await deleteImage(oldClubImage.publicId);
        }

        const uploadedClubImage = await uploadImage(clubImageFile);

        if (uploadedClubImage) {
          clubImage = uploadedClubImage;

          // console.log("CLUB image uploaded:", uploadedClubImage.url);
        }
      }

      /* =================================================
           UPLOAD NEW COORDINATOR IMAGE
        ================================================= */

      if (coordinatorImageFile) {
        // console.log(
        //   "Uploading COORDINATOR image:",
        //   coordinatorImageFile.originalname,
        // );

        /*
         * Delete previous Cloudinary image
         * before replacing it.
         */

        if (oldCoordinatorImage?.publicId) {
          await deleteImage(oldCoordinatorImage.publicId);
        }

        const uploadedCoordinatorImage =
          await uploadImage(coordinatorImageFile);

        if (uploadedCoordinatorImage) {
          coordinatorImage = uploadedCoordinatorImage;

          // console.log(
          //   "COORDINATOR image uploaded:",
          //   uploadedCoordinatorImage.url,
          // );
        }
      }

      /* =================================================
           CREATE FINAL CLUB
        ================================================= */

      const finalClub = {
        name: String(submittedClub?.name || "").trim(),

        description: String(submittedClub?.description || "").trim(),

        image: clubImage || {},

        coordinator: {
          name: String(submittedClub?.coordinator?.name || "").trim(),

          mobile: String(submittedClub?.coordinator?.mobile || "").trim(),

          description: String(
            submittedClub?.coordinator?.description || "",
          ).trim(),

          image: coordinatorImage || {},
        },
      };

      /* -----------------------------------------------
           PRESERVE MONGOOSE ID
        ----------------------------------------------- */

      if (
        submittedClub?._id &&
        mongoose.Types.ObjectId.isValid(submittedClub._id)
      ) {
        finalClub._id = submittedClub._id;
      }

      updatedClubs.push(finalClub);
    }

    /* ===================================================
         HERO
      =================================================== */

    existing.hero = {
      title: data?.hero?.title || DEFAULT_DATA.hero.title,

      subtitle: data?.hero?.subtitle || DEFAULT_DATA.hero.subtitle,

      breadcrumb: data?.hero?.breadcrumb || DEFAULT_DATA.hero.breadcrumb,
    };

    /* ===================================================
         SAVE CLUBS
      =================================================== */

    existing.clubs = updatedClubs;

    await existing.save();

    /* ===================================================
         GET FRESH DATA
      =================================================== */

    const savedData = await StudentClub.findOne({
      singletonKey: "student-clubs",
    }).lean();

    return res.status(200).json({
      success: true,

      message: "Student Clubs updated successfully.",

      data: savedData,
    });
  } catch (error) {
    console.error("Update Student Clubs Error:", error);

    return res.status(500).json({
      success: false,

      message: error?.message || "Failed to update Student Clubs.",
    });
  }
};

/* =========================================================
   DELETE SINGLE CLUB
   DELETE /api/student-clubs/admin/:clubId
========================================================= */

export const deleteStudentClub = async (req, res) => {
  try {
    const { clubId } = req.params;

    /* ---------------------------------------------------
         VALIDATE ID
      --------------------------------------------------- */

    if (!clubId || !mongoose.Types.ObjectId.isValid(clubId)) {
      return res.status(400).json({
        success: false,

        message: "Invalid Student Club ID.",
      });
    }

    /* ---------------------------------------------------
         FIND MAIN DOCUMENT
      --------------------------------------------------- */

    const studentClubs = await StudentClub.findOne({
      singletonKey: "student-clubs",
    });

    if (!studentClubs) {
      return res.status(404).json({
        success: false,

        message: "Student Clubs data not found.",
      });
    }

    /* ---------------------------------------------------
         FIND CLUB
      --------------------------------------------------- */

    const club = studentClubs.clubs.find(
      (item) => String(item._id) === String(clubId),
    );

    if (!club) {
      return res.status(404).json({
        success: false,

        message: "Student Club not found.",
      });
    }

    // console.log("Deleting Student Club:", club.name, clubId);

    /* =================================================
         DELETE CLUB IMAGE
      ================================================= */

    if (club?.image?.publicId) {
      await deleteImage(club.image.publicId);
    }

    /* =================================================
         DELETE COORDINATOR IMAGE
      ================================================= */

    if (club?.coordinator?.image?.publicId) {
      await deleteImage(club.coordinator.image.publicId);
    }

    /* =================================================
         REMOVE CLUB FROM ARRAY
      ================================================= */

    studentClubs.clubs = studentClubs.clubs.filter(
      (item) => String(item._id) !== String(clubId),
    );

    /* =================================================
         SAVE
      ================================================= */

    await studentClubs.save();

    /* =================================================
         RETURN FRESH DATA
      ================================================= */

    const savedData = await StudentClub.findOne({
      singletonKey: "student-clubs",
    }).lean();

    return res.status(200).json({
      success: true,

      message: "Student Club deleted successfully.",

      data: savedData,
    });
  } catch (error) {
    console.error("Delete Student Club Error:", error);

    return res.status(500).json({
      success: false,

      message: error?.message || "Failed to delete Student Club.",
    });
  }
};

/* =========================================================
   RESET DEFAULTS
========================================================= */

export const resetStudentClubsDefaults = async (req, res) => {
  try {
    const existing = await StudentClub.findOne({
      singletonKey: "student-clubs",
    });

    /* ---------------------------------------------------
         DELETE ALL CLUB IMAGES
      --------------------------------------------------- */

    if (existing) {
      for (const club of existing.clubs || []) {
        if (club?.image?.publicId) {
          await deleteImage(club.image.publicId);
        }

        if (club?.coordinator?.image?.publicId) {
          await deleteImage(club.coordinator.image.publicId);
        }
      }
    }

    /* ---------------------------------------------------
         RESET DATABASE
      --------------------------------------------------- */

    const data = await StudentClub.findOneAndUpdate(
      {
        singletonKey: "student-clubs",
      },

      DEFAULT_DATA,

      {
        new: true,

        upsert: true,

        setDefaultsOnInsert: true,
      },
    );

    return res.status(200).json({
      success: true,

      message: "Student Clubs reset successfully.",

      data,
    });
  } catch (error) {
    console.error("Reset Student Clubs Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to reset Student Clubs.",
    });
  }
};
