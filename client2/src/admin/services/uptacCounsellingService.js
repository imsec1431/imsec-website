import axios from "axios";

import { getToken } from "../utils/token.js";

// ======================================================
// API BASE URL
// ======================================================

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/uptac-counselling`;

// ======================================================
// AUTH CONFIG
// ======================================================

const getAuthConfig = () => {
  const token = getToken();

  if (!token) {
    throw new Error("Authentication token not found. Please login again.");
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ======================================================
// GET ADMIN UPTAC COUNSELLING
// ======================================================

export const getAdminUptacCounselling = async () => {
  const response = await axios.get(`${API_URL}/admin`, getAuthConfig());

  return response.data;
};

// ======================================================
// GET PUBLIC UPTAC COUNSELLING
// ======================================================

export const getPublicUptacCounselling = async () => {
  const response = await axios.get(`${API_URL}/public`);

  return response.data;
};

// ======================================================
// CREATE / UPLOAD PDF
// ======================================================

export const createUptacCounselling = async (formData) => {
  const response = await axios.post(
    `${API_URL}/admin`,
    formData,
    getAuthConfig(),
  );

  return response.data;
};

// ======================================================
// UPDATE / REPLACE PDF
// ======================================================

export const updateUptacCounselling = async (id, formData) => {
  const response = await axios.put(
    `${API_URL}/admin/${id}`,
    formData,
    getAuthConfig(),
  );

  return response.data;
};

// ======================================================
// PUBLISH
// ======================================================

export const publishUptacCounselling = async (id) => {
  const response = await axios.patch(
    `${API_URL}/admin/${id}/publish`,
    {},
    getAuthConfig(),
  );

  return response.data;
};

// ======================================================
// UNPUBLISH
// ======================================================

export const unpublishUptacCounselling = async (id) => {
  const response = await axios.patch(
    `${API_URL}/admin/${id}/unpublish`,
    {},
    getAuthConfig(),
  );

  return response.data;
};

// ======================================================
// DELETE
// ======================================================

export const deleteUptacCounselling = async (id) => {
  const response = await axios.delete(
    `${API_URL}/admin/${id}`,
    getAuthConfig(),
  );

  return response.data;
};

// ======================================================
// PDF URL
// ======================================================

export const getUptacPdfUrl = (pdfFile) => {
  if (!pdfFile) {
    return "";
  }

  if (pdfFile.startsWith("http://") || pdfFile.startsWith("https://")) {
    return pdfFile;
  }

  return pdfFile;
};

// ======================================================
// FETCH CLOUDINARY PDF AS BLOB
//
// IMPORTANT:
// Do NOT send the admin JWT to Cloudinary.
//
// The JWT is only used for your own backend API.
// ======================================================

export const getUptacPdfBlob = async (pdfUrl) => {
  if (!pdfUrl) {
    throw new Error("UPTAC counselling PDF URL is not available.");
  }

  const response = await axios.get(pdfUrl, {
    responseType: "blob",

    headers: {
      Accept: "application/pdf",
    },
  });

  if (!response.data) {
    throw new Error("PDF file was not returned by Cloudinary.");
  }

  return new Blob([response.data], {
    type: "application/pdf",
  });
};

// ======================================================
// DEFAULT EXPORT
// ======================================================

const uptacCounsellingService = {
  getAdminUptacCounselling,

  getPublicUptacCounselling,

  createUptacCounselling,

  updateUptacCounselling,

  publishUptacCounselling,

  unpublishUptacCounselling,

  deleteUptacCounselling,

  getUptacPdfUrl,

  getUptacPdfBlob,
};

export default uptacCounsellingService;
