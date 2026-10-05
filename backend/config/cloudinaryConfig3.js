import crypto from "crypto";
import fs from "fs/promises";
import dotenv from "dotenv";

dotenv.config();

// ======================================================
// CLOUDINARY ACCOUNT 3
// ======================================================
// Department module uses this isolated Cloudinary Account 3
// configuration. It does NOT call cloudinary.config(), so it
// cannot overwrite the Cloudinary configuration used by any
// other module/account in this backend.
//
// Required .env:
// CLOUD_NAME3
// API_KEY3
// API_SECRET3
// ======================================================

const CLOUD_NAME = process.env.CLOUD_NAME3;
const API_KEY = process.env.API_KEY3;
const API_SECRET = process.env.API_SECRET3;

const validateCredentials = () => {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    throw new Error(
      "Cloudinary Account 3 credentials are not configured. Please check CLOUD_NAME3, API_KEY3 and API_SECRET3 in .env.",
    );
  }
};

const generateSignature = (params) => {
  const signatureBase = Object.keys(params)
    .filter(
      (key) =>
        params[key] !== undefined && params[key] !== null && params[key] !== "",
    )
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return crypto
    .createHash("sha1")
    .update(`${signatureBase}${API_SECRET}`)
    .digest("hex");
};

const getResourceType = (options = {}) => options.resource_type || "image";

const getUploadEndpoint = (resourceType) => {
  const type = resourceType === "auto" ? "auto" : resourceType;
  return `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${type}/upload`;
};

const getDestroyEndpoint = (resourceType) => {
  const type = resourceType === "auto" ? "image" : resourceType;
  return `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${type}/destroy`;
};

const upload = async (filePath, options = {}) => {
  validateCredentials();

  if (!filePath) {
    throw new Error("Cloudinary upload file path is missing.");
  }

  const fileBuffer = await fs.readFile(filePath);
  const timestamp = Math.floor(Date.now() / 1000);
  const resourceType = getResourceType(options);

  const uploadParams = {
    timestamp,
    folder: options.folder || "",
  };

  const signature = generateSignature(uploadParams);

  const formData = new FormData();

  formData.append(
    "file",
    new Blob([fileBuffer]),
    filePath.split(/[\\/]/).pop() || "upload",
  );
  formData.append("api_key", API_KEY);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);

  if (options.folder) {
    formData.append("folder", options.folder);
  }

  const response = await fetch(getUploadEndpoint(resourceType), {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (!response.ok || result.error) {
    console.error("Cloudinary Account 3 upload error:", result);

    throw new Error(
      result?.error?.message || "Upload to Cloudinary Account 3 failed.",
    );
  }

  return result;
};

const destroy = async (publicId, options = {}) => {
  validateCredentials();

  if (!publicId) {
    return null;
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const resourceType = getResourceType(options);

  const destroyParams = {
    public_id: publicId,
    timestamp,
  };

  const signature = generateSignature(destroyParams);

  const formData = new URLSearchParams();
  formData.append("public_id", publicId);
  formData.append("api_key", API_KEY);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);

  const response = await fetch(getDestroyEndpoint(resourceType), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  const result = await response.json();

  if (!response.ok || result.error) {
    console.error("Cloudinary Account 3 destroy error:", result);
    throw new Error(
      result?.error?.message || "Delete from Cloudinary Account 3 failed.",
    );
  }

  return result;
};

const cloudinary3 = {
  uploader: {
    upload,
    destroy,
  },
};

export default cloudinary3;
