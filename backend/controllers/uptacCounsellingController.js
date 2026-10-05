import fs from "fs";
import path from "path";

import UptacCounselling from "../models/UptacCounselling.js";

import cloudinary from "../config/cloudinaryConfig.js";

// ======================================================
// HELPER
// DELETE TEMPORARY MULTER FILE
// ======================================================

const deleteTempFile = (filePath) => {
  if (!filePath) {
    return;
  }

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error("Unable to delete temporary UPTAC file:", error);
  }
};

// ======================================================
// HELPER
// DELETE CLOUDINARY FILE
// ======================================================

const deleteCloudinaryFile = async (publicId, resourceType = "raw") => {
  if (!publicId) {
    return;
  }

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    console.error("Unable to delete UPTAC file from Cloudinary:", error);
  }
};

// ======================================================
// GET ADMIN UPTAC COUNSELLING
//
// AUTHENTICATED
// GET /api/uptac-counselling/admin
// ======================================================

export const getUptacCounselling = async (req, res) => {
  try {
    const counselling = await UptacCounselling.findOne().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,

      data: counselling || null,
    });
  } catch (error) {
    console.error("Get admin UPTAC counselling error:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to load UPTAC counselling.",
    });
  }
};

// ======================================================
// GET PUBLIC UPTAC COUNSELLING
//
// PUBLIC
// GET /api/uptac-counselling/public
//
// No authentication required.
// ======================================================

export const getPublicUptacCounselling = async (req, res) => {
  try {
    const counselling = await UptacCounselling.findOne({
      isPublished: true,
    })
      .sort({
        displayOrder: 1,
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,

      data: counselling || null,
    });
  } catch (error) {
    console.error("Get public UPTAC counselling error:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to load UPTAC counselling.",
    });
  }
};

// ======================================================
// CREATE / UPLOAD UPTAC COUNSELLING
//
// AUTHENTICATED
// POST /api/uptac-counselling/admin
//
// req.admin comes from protect middleware.
// req.file comes from multer.
// ======================================================

export const createUptacCounselling = async (req, res) => {
  let cloudinaryFile = null;

  try {
    // ==================================================
    // AUTHENTICATION CHECK
    // ==================================================

    if (!req.admin) {
      if (req.file?.path) {
        deleteTempFile(req.file.path);
      }

      return res.status(401).json({
        success: false,

        message: "Not Authorized",
      });
    }

    // ==================================================
    // FILE CHECK
    // ==================================================

    if (!req.file) {
      return res.status(400).json({
        success: false,

        message: "Please upload the UPTAC counselling PDF.",
      });
    }

    // ==================================================
    // FILE EXTENSION CHECK
    // ==================================================

    const extension = path.extname(req.file.originalname).toLowerCase();

    if (extension !== ".pdf") {
      deleteTempFile(req.file.path);

      return res.status(400).json({
        success: false,

        message: "Only PDF files are allowed.",
      });
    }

    // ==================================================
    // FILE MIME CHECK
    // ==================================================

    if (req.file.mimetype && req.file.mimetype !== "application/pdf") {
      deleteTempFile(req.file.path);

      return res.status(400).json({
        success: false,

        message: "Only PDF files are allowed.",
      });
    }

    // ==================================================
    // FORM DATA
    // ==================================================

    const { session, title, description, isPublished } = req.body;

    // ==================================================
    // SESSION VALIDATION
    // ==================================================

    if (!session || !String(session).trim()) {
      deleteTempFile(req.file.path);

      return res.status(400).json({
        success: false,

        message: "Please enter the current session.",
      });
    }

    // ==================================================
    // TITLE VALIDATION
    // ==================================================

    if (!title || !String(title).trim()) {
      deleteTempFile(req.file.path);

      return res.status(400).json({
        success: false,

        message: "Please enter the UPTAC counselling title.",
      });
    }

    // ==================================================
    // CHECK EXISTING RECORD
    //
    // We allow one current UPTAC record.
    // ==================================================

    const existing = await UptacCounselling.findOne().sort({
      createdAt: -1,
    });

    // ==================================================
    // CLOUDINARY UPLOAD
    //
    // IMPORTANT:
    // PDF = raw
    // ==================================================

    cloudinaryFile = await cloudinary.uploader.upload(req.file.path, {
      folder: "imsec/uptac-counselling",

      resource_type: "raw",

      use_filename: true,

      unique_filename: true,

      overwrite: false,
    });

    // ==================================================
    // DELETE TEMP FILE
    // ==================================================

    deleteTempFile(req.file.path);

    // ==================================================
    // PUBLISH VALUE
    // ==================================================

    const publish =
      isPublished === true ||
      isPublished === "true" ||
      isPublished === "1" ||
      isPublished === "yes" ||
      isPublished === "Yes";

    // ==================================================
    // IF PUBLISHED
    //
    // Unpublish all other records first.
    // ==================================================

    if (publish) {
      await UptacCounselling.updateMany(
        {
          isPublished: true,
        },

        {
          $set: {
            isPublished: false,
          },
        },
      );
    }

    // ==================================================
    // IF OLD RECORD EXISTS
    //
    // We replace its database data instead of creating
    // unnecessary duplicate current-session records.
    // ==================================================

    if (existing) {
      // -----------------------------------------------
      // Delete old Cloudinary PDF
      // -----------------------------------------------

      if (existing.cloudinaryPublicId) {
        await deleteCloudinaryFile(
          existing.cloudinaryPublicId,

          existing.cloudinaryResourceType || "raw",
        );
      }

      // -----------------------------------------------
      // Update existing record
      // -----------------------------------------------

      existing.session = String(session).trim();

      existing.title = String(title).trim();

      existing.description = description ? String(description).trim() : "";

      existing.pdfFile = cloudinaryFile.secure_url;

      existing.pdfOriginalName = req.file.originalname;

      existing.cloudinaryPublicId = cloudinaryFile.public_id;

      existing.cloudinaryResourceType = "raw";

      existing.isPublished = publish;

      existing.updatedBy = req.admin?._id || null;

      await existing.save();

      return res.status(200).json({
        success: true,

        message: publish
          ? "UPTAC counselling PDF uploaded and published successfully."
          : "UPTAC counselling PDF uploaded successfully.",

        data: existing,
      });
    }

    // ==================================================
    // CREATE NEW RECORD
    // ==================================================

    const counselling = await UptacCounselling.create({
      session: String(session).trim(),

      title: String(title).trim(),

      description: description ? String(description).trim() : "",

      pdfFile: cloudinaryFile.secure_url,

      pdfOriginalName: req.file.originalname,

      cloudinaryPublicId: cloudinaryFile.public_id,

      cloudinaryResourceType: "raw",

      isPublished: publish,

      displayOrder: 1,

      createdBy: req.admin?._id || null,

      updatedBy: req.admin?._id || null,
    });

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(201).json({
      success: true,

      message: publish
        ? "UPTAC counselling PDF uploaded and published successfully."
        : "UPTAC counselling PDF uploaded successfully.",

      data: counselling,
    });
  } catch (error) {
    console.error("Create UPTAC counselling error:", error);

    // ==================================================
    // DELETE CLOUDINARY FILE IF DATABASE FAILED
    // ==================================================

    if (cloudinaryFile?.public_id) {
      await deleteCloudinaryFile(
        cloudinaryFile.public_id,

        "raw",
      );
    }

    // ==================================================
    // DELETE TEMP FILE
    // ==================================================

    if (req.file?.path) {
      deleteTempFile(req.file.path);
    }

    return res.status(500).json({
      success: false,

      message: error?.message || "Unable to upload UPTAC counselling PDF.",
    });
  }
};

// ======================================================
// UPDATE / REPLACE UPTAC COUNSELLING
//
// AUTHENTICATED
// PUT /api/uptac-counselling/admin/:id
// ======================================================

export const updateUptacCounselling = async (req, res) => {
  let newCloudinaryFile = null;

  try {
    // ==================================================
    // AUTHENTICATION
    // ==================================================

    if (!req.admin) {
      if (req.file?.path) {
        deleteTempFile(req.file.path);
      }

      return res.status(401).json({
        success: false,

        message: "Not Authorized",
      });
    }

    // ==================================================
    // FIND RECORD
    // ==================================================

    const counselling = await UptacCounselling.findById(req.params.id);

    if (!counselling) {
      if (req.file?.path) {
        deleteTempFile(req.file.path);
      }

      return res.status(404).json({
        success: false,

        message: "UPTAC counselling record not found.",
      });
    }

    // ==================================================
    // FORM DATA
    // ==================================================

    const { session, title, description, isPublished } = req.body;

    // ==================================================
    // SESSION
    // ==================================================

    if (session !== undefined) {
      if (!String(session).trim()) {
        if (req.file?.path) {
          deleteTempFile(req.file.path);
        }

        return res.status(400).json({
          success: false,

          message: "Session cannot be empty.",
        });
      }

      counselling.session = String(session).trim();
    }

    // ==================================================
    // TITLE
    // ==================================================

    if (title !== undefined) {
      if (!String(title).trim()) {
        if (req.file?.path) {
          deleteTempFile(req.file.path);
        }

        return res.status(400).json({
          success: false,

          message: "Title cannot be empty.",
        });
      }

      counselling.title = String(title).trim();
    }

    // ==================================================
    // DESCRIPTION
    // ==================================================

    if (description !== undefined) {
      counselling.description = String(description).trim();
    }

    // ==================================================
    // REPLACE PDF
    // ==================================================

    if (req.file) {
      const extension = path.extname(req.file.originalname).toLowerCase();

      if (extension !== ".pdf") {
        deleteTempFile(req.file.path);

        return res.status(400).json({
          success: false,

          message: "Only PDF files are allowed.",
        });
      }

      if (req.file.mimetype && req.file.mimetype !== "application/pdf") {
        deleteTempFile(req.file.path);

        return res.status(400).json({
          success: false,

          message: "Only PDF files are allowed.",
        });
      }

      // -----------------------------------------------
      // UPLOAD NEW PDF
      // -----------------------------------------------

      newCloudinaryFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "imsec/uptac-counselling",

        resource_type: "raw",

        use_filename: true,

        unique_filename: true,

        overwrite: false,
      });

      // -----------------------------------------------
      // DELETE TEMP FILE
      // -----------------------------------------------

      deleteTempFile(req.file.path);

      // -----------------------------------------------
      // DELETE OLD CLOUDINARY PDF
      // -----------------------------------------------

      if (counselling.cloudinaryPublicId) {
        await deleteCloudinaryFile(
          counselling.cloudinaryPublicId,

          counselling.cloudinaryResourceType || "raw",
        );
      }

      // -----------------------------------------------
      // SAVE NEW CLOUDINARY INFORMATION
      // -----------------------------------------------

      counselling.pdfFile = newCloudinaryFile.secure_url;

      counselling.pdfOriginalName = req.file.originalname;

      counselling.cloudinaryPublicId = newCloudinaryFile.public_id;

      counselling.cloudinaryResourceType = "raw";
    }

    // ==================================================
    // PUBLISH STATUS
    // ==================================================

    if (isPublished !== undefined) {
      const publish =
        isPublished === true ||
        isPublished === "true" ||
        isPublished === "1" ||
        isPublished === "yes" ||
        isPublished === "Yes";

      // -----------------------------------------------
      // If publishing this record, unpublish others.
      // -----------------------------------------------

      if (publish) {
        await UptacCounselling.updateMany(
          {
            _id: {
              $ne: counselling._id,
            },

            isPublished: true,
          },

          {
            $set: {
              isPublished: false,
            },
          },
        );
      }

      counselling.isPublished = publish;
    }

    // ==================================================
    // UPDATED BY
    // ==================================================

    counselling.updatedBy = req.admin?._id || null;

    // ==================================================
    // SAVE
    // ==================================================

    await counselling.save();

    return res.status(200).json({
      success: true,

      message: "UPTAC counselling updated successfully.",

      data: counselling,
    });
  } catch (error) {
    console.error("Update UPTAC counselling error:", error);

    // ==================================================
    // DELETE NEW CLOUDINARY FILE
    // ==================================================

    if (newCloudinaryFile?.public_id) {
      await deleteCloudinaryFile(
        newCloudinaryFile.public_id,

        "raw",
      );
    }

    // ==================================================
    // DELETE TEMP FILE
    // ==================================================

    if (req.file?.path) {
      deleteTempFile(req.file.path);
    }

    return res.status(500).json({
      success: false,

      message: error?.message || "Unable to update UPTAC counselling.",
    });
  }
};

// ======================================================
// PUBLISH
//
// AUTHENTICATED
// PATCH /api/uptac-counselling/admin/:id/publish
// ======================================================

export const publishUptacCounselling = async (req, res) => {
  try {
    // ==================================================
    // AUTHENTICATION
    // ==================================================

    if (!req.admin) {
      return res.status(401).json({
        success: false,

        message: "Not Authorized",
      });
    }

    // ==================================================
    // FIND
    // ==================================================

    const counselling = await UptacCounselling.findById(req.params.id);

    if (!counselling) {
      return res.status(404).json({
        success: false,

        message: "UPTAC counselling record not found.",
      });
    }

    // ==================================================
    // UNPUBLISH ALL OTHER RECORDS
    // ==================================================

    await UptacCounselling.updateMany(
      {
        _id: {
          $ne: counselling._id,
        },

        isPublished: true,
      },

      {
        $set: {
          isPublished: false,
        },
      },
    );

    // ==================================================
    // PUBLISH
    // ==================================================

    counselling.isPublished = true;

    counselling.updatedBy = req.admin?._id || null;

    await counselling.save();

    return res.status(200).json({
      success: true,

      message: "UPTAC counselling published successfully.",

      data: counselling,
    });
  } catch (error) {
    console.error("Publish UPTAC counselling error:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to publish UPTAC counselling.",
    });
  }
};

// ======================================================
// UNPUBLISH
//
// AUTHENTICATED
// PATCH /api/uptac-counselling/admin/:id/unpublish
// ======================================================

export const unpublishUptacCounselling = async (req, res) => {
  try {
    // ==================================================
    // AUTHENTICATION
    // ==================================================

    if (!req.admin) {
      return res.status(401).json({
        success: false,

        message: "Not Authorized",
      });
    }

    // ==================================================
    // FIND
    // ==================================================

    const counselling = await UptacCounselling.findById(req.params.id);

    if (!counselling) {
      return res.status(404).json({
        success: false,

        message: "UPTAC counselling record not found.",
      });
    }

    // ==================================================
    // UNPUBLISH
    // ==================================================

    counselling.isPublished = false;

    counselling.updatedBy = req.admin?._id || null;

    await counselling.save();

    return res.status(200).json({
      success: true,

      message: "UPTAC counselling unpublished successfully.",

      data: counselling,
    });
  } catch (error) {
    console.error("Unpublish UPTAC counselling error:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to unpublish UPTAC counselling.",
    });
  }
};

// ======================================================
// DELETE
//
// AUTHENTICATED
// DELETE /api/uptac-counselling/admin/:id
// ======================================================

export const deleteUptacCounselling = async (req, res) => {
  try {
    // ==================================================
    // AUTHENTICATION
    // ==================================================

    if (!req.admin) {
      return res.status(401).json({
        success: false,

        message: "Not Authorized",
      });
    }

    // ==================================================
    // FIND
    // ==================================================

    const counselling = await UptacCounselling.findById(req.params.id);

    if (!counselling) {
      return res.status(404).json({
        success: false,

        message: "UPTAC counselling record not found.",
      });
    }

    // ==================================================
    // DELETE CLOUDINARY PDF
    // ==================================================

    if (counselling.cloudinaryPublicId) {
      await deleteCloudinaryFile(
        counselling.cloudinaryPublicId,

        counselling.cloudinaryResourceType || "raw",
      );
    }

    // ==================================================
    // DELETE DATABASE RECORD
    // ==================================================

    await counselling.deleteOne();

    return res.status(200).json({
      success: true,

      message: "UPTAC counselling deleted successfully.",
    });
  } catch (error) {
    console.error("Delete UPTAC counselling error:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to delete UPTAC counselling.",
    });
  }
};
// ======================================================
// PUBLIC — VIEW / DOWNLOAD UPTAC PDF
//
// GET
// /api/uptac-counselling/public/pdf
//
// Query:
// ?download=true
//
// Without download=true:
// PDF is displayed inline.
//
// With download=true:
// PDF is downloaded.
// ======================================================

export const getPublicUptacPdf = async (req, res) => {
  try {
    // ==================================================
    // GET PUBLISHED COUNSELLING
    // ==================================================

    const counselling = await UptacCounselling.findOne({
      isPublished: true,
    })
      .sort({
        displayOrder: 1,
        createdAt: -1,
      })
      .lean();

    // ==================================================
    // RECORD NOT FOUND
    // ==================================================

    if (!counselling) {
      return res.status(404).json({
        success: false,
        message: "UPTAC counselling PDF not found.",
      });
    }

    // ==================================================
    // PDF URL CHECK
    // ==================================================

    if (!counselling.pdfFile) {
      return res.status(404).json({
        success: false,
        message: "UPTAC counselling PDF is not available.",
      });
    }

    // ==================================================
    // FETCH PDF FROM CLOUDINARY
    //
    // Node.js 24 has native fetch().
    // No new axios package is required.
    // ==================================================

    const cloudinaryResponse = await fetch(counselling.pdfFile);

    // ==================================================
    // CLOUDINARY ERROR
    // ==================================================

    if (!cloudinaryResponse.ok) {
      console.error(
        "Cloudinary PDF response:",
        cloudinaryResponse.status,
        cloudinaryResponse.statusText,
      );

      return res.status(502).json({
        success: false,
        message: "Unable to retrieve the UPTAC counselling PDF.",
      });
    }

    // ==================================================
    // CONTENT TYPE
    // ==================================================

    const contentType = cloudinaryResponse.headers.get("content-type");

    // ==================================================
    // PDF HEADERS
    //
    // THIS IS THE IMPORTANT PART.
    //
    // inline = browser displays PDF
    // attachment = browser downloads PDF
    // ==================================================

    res.setHeader(
      "Content-Type",
      contentType?.includes("pdf") ? "application/pdf" : "application/pdf",
    );

    res.setHeader("Cache-Control", "public, max-age=3600");

    // ==================================================
    // DOWNLOAD OR VIEW
    // ==================================================

    const download = req.query.download === "true";

    const originalName = counselling.pdfOriginalName || "UPTAC-Counselling.pdf";

    // Remove characters that should not be placed
    // directly into the Content-Disposition header.

    const safeFileName = originalName.replace(/[\r\n"]/g, "");

    if (download) {
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${safeFileName}"`,
      );
    } else {
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${safeFileName}"`,
      );
    }

    // ==================================================
    // CONTENT LENGTH
    // ==================================================

    const contentLength = cloudinaryResponse.headers.get("content-length");

    if (contentLength) {
      res.setHeader("Content-Length", contentLength);
    }

    // ==================================================
    // STREAM PDF
    // ==================================================

    if (!cloudinaryResponse.body) {
      return res.status(502).json({
        success: false,
        message: "PDF stream is not available.",
      });
    }

    const { Readable } = await import("stream");

    const nodeStream = Readable.fromWeb(cloudinaryResponse.body);

    nodeStream.on("error", (error) => {
      console.error("UPTAC PDF stream error:", error);

      if (!res.headersSent) {
        res.status(500).end();
      } else {
        res.end();
      }
    });

    nodeStream.pipe(res);
  } catch (error) {
    console.error("Get public UPTAC PDF error:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Unable to load UPTAC counselling PDF.",
      });
    }

    res.end();
  }
};
