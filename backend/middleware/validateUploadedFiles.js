import fs from "fs/promises";

/*
 * Validates uploaded file CONTENT after Multer has received the file.
 * This is intentionally independent of controllers/models/database.
 */

const readUploadedFile = async (file) => {
  if (file?.buffer) {
    return file.buffer;
  }

  if (file?.path) {
    return fs.readFile(file.path);
  }

  return null;
};

const startsWith = (buffer, bytes) => {
  if (!buffer || buffer.length < bytes.length) return false;
  return bytes.every((value, index) => buffer[index] === value);
};

const isZip = (buffer) =>
  startsWith(buffer, [0x50, 0x4b, 0x03, 0x04]) ||
  startsWith(buffer, [0x50, 0x4b, 0x05, 0x06]) ||
  startsWith(buffer, [0x50, 0x4b, 0x07, 0x08]);

const isValidFileContent = (file, buffer) => {
  const mime = String(file?.mimetype || "").toLowerCase();
  const extension = String(file?.originalname || "")
    .toLowerCase()
    .split(".")
    .pop();

  const extensionMap = {
    "image/jpeg": new Set(["jpg", "jpeg"]),
    "image/jpg": new Set(["jpg", "jpeg"]),
    "image/png": new Set(["png"]),
    "image/webp": new Set(["webp"]),
    "application/pdf": new Set(["pdf"]),
    "application/msword": new Set(["doc"]),
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      new Set(["docx"]),
    "application/vnd.ms-excel": new Set(["xls"]),
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      new Set(["xlsx"]),
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      new Set(["pptx"]),
    "application/octet-stream": new Set(["xls", "xlsx"]),
  };

  if (!extensionMap[mime]?.has(extension)) {
    return false;
  }

  if (mime === "image/jpeg" || mime === "image/jpg") {
    return startsWith(buffer, [0xff, 0xd8, 0xff]);
  }

  if (mime === "image/png") {
    return startsWith(buffer, [
      0x89, 0x50, 0x4e, 0x47,
      0x0d, 0x0a, 0x1a, 0x0a,
    ]);
  }

  if (mime === "image/webp") {
    return (
      startsWith(buffer, [0x52, 0x49, 0x46, 0x46]) &&
      buffer.length >= 12 &&
      buffer.subarray(8, 12).toString("ascii") === "WEBP"
    );
  }

  if (mime === "application/pdf") {
    return buffer.subarray(0, 5).toString("ascii") === "%PDF-";
  }

  if (mime === "application/msword") {
    return startsWith(buffer, [
      0xd0, 0xcf, 0x11, 0xe0,
      0xa1, 0xb1, 0x1a, 0xe1,
    ]);
  }

  if (
    mime ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mime ===
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    mime ===
    "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  ) {
    return isZip(buffer);
  }

  if (
    mime === "application/vnd.ms-excel" ||
    mime === "application/vnd.ms-office" ||
    (mime === "application/octet-stream" && extension === "xls")
  ) {
    return startsWith(buffer, [
      0xd0, 0xcf, 0x11, 0xe0,
      0xa1, 0xb1, 0x1a, 0xe1,
    ]);
  }

  if (
    (mime === "application/octet-stream" && extension === "xlsx")
  ) {
    return isZip(buffer);
  }

  return false;
};

const cleanupFiles = async (files) => {
  await Promise.all(
    files
      .filter((file) => file?.path)
      .map(async (file) => {
        try {
          await fs.unlink(file.path);
        } catch {
          // File may already have been removed by the controller.
        }
      }),
  );
};

export const validateUploadedFiles = async (req, res, next) => {
  const files = [];

  if (req.file) {
    files.push(req.file);
  }

  if (Array.isArray(req.files)) {
    files.push(...req.files);
  } else if (req.files && typeof req.files === "object") {
    for (const fieldFiles of Object.values(req.files)) {
      if (Array.isArray(fieldFiles)) {
        files.push(...fieldFiles);
      }
    }
  }

  if (files.length === 0) {
    return next();
  }

  try {
    for (const file of files) {
      const buffer = await readUploadedFile(file);

      if (!buffer || !isValidFileContent(file, buffer)) {
        await cleanupFiles(files);

        return res.status(400).json({
          success: false,
          message: `Invalid or corrupted uploaded file: ${file.originalname || "file"}.`,
        });
      }
    }

    return next();
  } catch (error) {
    await cleanupFiles(files);

    console.error("Upload validation error:", error);

    return res.status(400).json({
      success: false,
      message: "Uploaded file could not be validated.",
    });
  }
};

export default validateUploadedFiles;
