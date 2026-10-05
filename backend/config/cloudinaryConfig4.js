import crypto from "crypto";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// ======================================================
// HOMEPAGE CLOUDINARY - ACCOUNT 4 ONLY
// ======================================================
// This adapter intentionally does NOT call cloudinary.config().
// It exposes the small uploader API required by homepage
// controllers while signing requests directly for Account 4.
// ======================================================

const CLOUD_NAME = process.env.CLOUD_NAME4;
const API_KEY = process.env.API_KEY4;
const API_SECRET = process.env.API_SECRET4;

const validateCredentials = () => {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    throw new Error(
      "Cloudinary Account 4 credentials are not configured. Please check CLOUD_NAME4, API_KEY4 and API_SECRET4 in .env.",
    );
  }
};

const signParams = (params) => {
  const signatureBase = Object.keys(params)
    .filter((key) => params[key] !== undefined && params[key] !== null && params[key] !== "")
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return crypto.createHash("sha1").update(`${signatureBase}${API_SECRET}`).digest("hex");
};

const upload = async (filePath, options = {}) => {
  validateCredentials();

  const timestamp = Math.floor(Date.now() / 1000);
  const params = { ...options, timestamp };
  const signature = signParams(params);
  const form = new FormData();

  const buffer = await fs.promises.readFile(filePath);
  const filename = filePath.split(/[\\/]/).pop() || "upload";

  form.append("file", new Blob([buffer]), filename);
  form.append("api_key", API_KEY);
  form.append("timestamp", String(timestamp));
  form.append("signature", signature);

  for (const [key, value] of Object.entries(options)) {
    if (value !== undefined && value !== null) {
      form.append(key, typeof value === "boolean" ? String(value) : String(value));
    }
  }

  const resourceType = options.resource_type || "image";
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
    { method: "POST", body: form },
  );
  const result = await response.json();

  if (!response.ok || result.error) {
    console.error("Cloudinary Account 4 upload error:", result);
    throw new Error(result?.error?.message || "Cloudinary Account 4 upload failed.");
  }

  return result;
};

const destroy = async (publicId, options = {}) => {
  if (!publicId) return null;
  validateCredentials();

  const timestamp = Math.floor(Date.now() / 1000);
  const params = { public_id: publicId, timestamp };
  const signature = signParams(params);
  const form = new URLSearchParams();

  form.append("public_id", publicId);
  form.append("api_key", API_KEY);
  form.append("timestamp", String(timestamp));
  form.append("signature", signature);

  const resourceType = options.resource_type || "image";
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/destroy`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    },
  );
  const result = await response.json();

  if (!response.ok || result.error) {
    console.error("Cloudinary Account 4 delete error:", result);
    return null;
  }

  return result;
};

const cloudinary4 = {
  uploader: { upload, destroy },
};

export default cloudinary4;
