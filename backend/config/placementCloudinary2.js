import crypto from "crypto";
import fs from "fs/promises";
import dotenv from "dotenv";

dotenv.config();

// ======================================================
// PLACEMENTS CLOUDINARY - ACCOUNT 2 ONLY
// ======================================================
// This helper intentionally does NOT call cloudinary.config().
// It uses Cloudinary's signed REST API with Account 2 credentials
// so placement uploads cannot be redirected by another module's
// Cloudinary configuration.
//
// Required .env variables:
// CLOUD_NAME2
// API_KEY2
// API_SECRET2
// ======================================================

const CLOUD_NAME = process.env.CLOUD_NAME2;
const API_KEY = process.env.API_KEY2;
const API_SECRET = process.env.API_SECRET2;

const validateCredentials = () => {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    throw new Error(
      "Cloudinary Account 2 credentials are not configured. Please check CLOUD_NAME2, API_KEY2 and API_SECRET2 in .env.",
    );
  }
};

const generateSignature = (params) => {
  const signatureBase = Object.keys(params)
    .filter(
      (key) =>
        params[key] !== undefined &&
        params[key] !== null &&
        params[key] !== "",
    )
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return crypto
    .createHash("sha1")
    .update(`${signatureBase}${API_SECRET}`)
    .digest("hex");
};

// ======================================================
// UPLOAD PLACEMENT IMAGE
// ======================================================

export const uploadPlacementImage = async (filePath, folder) => {
  validateCredentials();

  if (!filePath) {
    throw new Error("Placement image path is missing.");
  }

  const fileBuffer = await fs.readFile(filePath);
  const timestamp = Math.floor(Date.now() / 1000);

  const uploadParams = {
    folder,
    timestamp,
  };

  const signature = generateSignature(uploadParams);
  const formData = new FormData();

  formData.append(
    "file",
    new Blob([fileBuffer], {
      type: "application/octet-stream",
    }),
    "placement-image",
  );
  formData.append("api_key", API_KEY);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  const result = await response.json();

  if (!response.ok || result.error) {
    console.error("Cloudinary Account 2 placement upload error:", result);
    throw new Error(
      result?.error?.message ||
        "Placement image upload to Cloudinary Account 2 failed.",
    );
  }

  console.log(
    "Placement image uploaded to Cloudinary Account 2:",
    result.secure_url,
  );

  return result;
};

// ======================================================
// DELETE PLACEMENT IMAGE
// ======================================================

export const deletePlacementImage = async (publicId) => {
  if (!publicId) return null;

  try {
    validateCredentials();

    const timestamp = Math.floor(Date.now() / 1000);
    const deleteParams = {
      public_id: publicId,
      timestamp,
    };

    const signature = generateSignature(deleteParams);
    const formData = new URLSearchParams();

    formData.append("public_id", publicId);
    formData.append("api_key", API_KEY);
    formData.append("timestamp", String(timestamp));
    formData.append("signature", signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      },
    );

    const result = await response.json();

    if (!response.ok || result.error) {
      console.error("Cloudinary Account 2 placement delete error:", result);
      return null;
    }

    console.log("Placement image deleted from Cloudinary Account 2:", result);
    return result;
  } catch (error) {
    console.error("Cloudinary Account 2 placement delete error:", error);
    return null;
  }
};

export default {
  uploadPlacementImage,
  deletePlacementImage,
};
