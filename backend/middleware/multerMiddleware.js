import multer from "multer";
import path from "path";

// Storage
const storage = multer.diskStorage({});

// Allow only explicitly supported file types.
const fileFilter = (req, file, cb) => {
  const allowedTypes = new Set([
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]);

  const allowedExtensions = new Set([
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".pdf",
    ".doc",
    ".docx",
  ]);

  const extension = path.extname(file.originalname || "").toLowerCase();

  if (
    allowedTypes.has(String(file.mimetype || "").toLowerCase()) &&
    allowedExtensions.has(extension)
  ) {
    return cb(null, true);
  }

  cb(
    new Error(
      "Only JPG, JPEG, PNG, WEBP, PDF, DOC and DOCX files are allowed.",
    ),
  );
};

// Upload configuration
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 8 * 1024 * 1024,
  },
});

export default upload;
