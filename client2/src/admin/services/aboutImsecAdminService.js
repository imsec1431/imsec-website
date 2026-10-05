import axios from "axios";
import { getToken } from "../utils/token.js";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* =========================================================
   AUTH CONFIG
========================================================= */

const getAuthConfig = () => {
  const token = getToken();

  if (!token) {
    throw new Error(
      "Admin authentication token not found. Please login again.",
    );
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/* =========================================================
   GET ADMIN ABOUT IMSEC
========================================================= */

export const getAdminAboutImsec = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/api/about-imsec/admin`,
    getAuthConfig(),
  );

  return response.data;
};

/* =========================================================
   CREATE ABOUT IMSEC
========================================================= */

export const createAboutImsec = async (data) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/about-imsec/admin`,
    data,
    getAuthConfig(),
  );

  return response.data;
};

/* =========================================================
   UPDATE ABOUT IMSEC
========================================================= */

export const updateAboutImsec = async (id, data) => {
  const response = await axios.put(
    `${API_BASE_URL}/api/about-imsec/admin/${id}`,
    data,
    getAuthConfig(),
  );

  return response.data;
};

/* =========================================================
   PUBLISH ABOUT IMSEC
========================================================= */

export const publishAboutImsec = async (id) => {
  const response = await axios.patch(
    `${API_BASE_URL}/api/about-imsec/admin/${id}/publish`,
    {},
    getAuthConfig(),
  );

  return response.data;
};

/* =========================================================
   UNPUBLISH ABOUT IMSEC
========================================================= */

export const unpublishAboutImsec = async (id) => {
  const response = await axios.patch(
    `${API_BASE_URL}/api/about-imsec/admin/${id}/unpublish`,
    {},
    getAuthConfig(),
  );

  return response.data;
};

/* =========================================================
   DELETE ABOUT IMSEC
========================================================= */

export const deleteAboutImsec = async (id) => {
  const response = await axios.delete(
    `${API_BASE_URL}/api/about-imsec/admin/${id}`,
    getAuthConfig(),
  );

  return response.data;
};

/* =========================================================
   UPLOAD ABOUT IMSEC IMAGE
   Uses existing /api/photos upload system.
   No change to upload route/controller.
========================================================= */

export const uploadAboutImsecImage = async (file) => {
  if (!file) {
    throw new Error("Please select an image.");
  }

  const token = getToken();

  if (!token) {
    throw new Error(
      "Admin authentication token not found. Please login again.",
    );
  }

  const formData = new FormData();

  formData.append("file", file);

  const response = await axios.post(`${API_BASE_URL}/api/photos`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default {
  getAdminAboutImsec,
  createAboutImsec,
  updateAboutImsec,
  publishAboutImsec,
  unpublishAboutImsec,
  deleteAboutImsec,
  uploadAboutImsecImage,
};
