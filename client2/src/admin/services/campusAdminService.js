import axios from "axios";
import { getToken } from "../utils/token.js";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

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
   UPLOAD CAMPUS IMAGE
   Uses existing /api/photos endpoint
   ========================================================= */

export const uploadCampusImage = async (file) => {
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
   GET ADMIN CAMPUS
   ========================================================= */

export const getAdminCampus = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/api/campus/admin`,
    getAuthConfig(),
  );

  return response.data;
};

/* =========================================================
   CREATE CAMPUS
   ========================================================= */

export const createCampus = async (data) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/campus/admin`,
    data,
    getAuthConfig(),
  );

  return response.data;
};

/* =========================================================
   UPDATE CAMPUS
   ========================================================= */

export const updateCampus = async (id, data) => {
  const response = await axios.put(
    `${API_BASE_URL}/api/campus/admin/${id}`,
    data,
    getAuthConfig(),
  );

  return response.data;
};

/* =========================================================
   PUBLISH CAMPUS
   ========================================================= */

export const publishCampus = async (id) => {
  const response = await axios.patch(
    `${API_BASE_URL}/api/campus/admin/${id}/publish`,
    {},
    getAuthConfig(),
  );

  return response.data;
};

/* =========================================================
   UNPUBLISH CAMPUS
   ========================================================= */

export const unpublishCampus = async (id) => {
  const response = await axios.patch(
    `${API_BASE_URL}/api/campus/admin/${id}/unpublish`,
    {},
    getAuthConfig(),
  );

  return response.data;
};

/* =========================================================
   DELETE CAMPUS
   ========================================================= */

export const deleteCampus = async (id) => {
  const response = await axios.delete(
    `${API_BASE_URL}/api/campus/admin/${id}`,
    getAuthConfig(),
  );

  return response.data;
};
