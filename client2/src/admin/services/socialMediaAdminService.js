import axios from "axios";
import { getToken } from "../utils/token.js";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/social-media`;

// =========================================================
// AUTH CONFIG
// =========================================================

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

// =========================================================
// GET ALL SOCIAL MEDIA — ADMIN
// =========================================================

export const getAdminSocialMedia = async () => {
  const response = await axios.get(`${API_URL}/admin`, getAuthConfig());

  return response.data;
};

// =========================================================
// CREATE SOCIAL MEDIA
// =========================================================

export const createSocialMedia = async (data) => {
  const response = await axios.post(`${API_URL}/admin`, data, getAuthConfig());

  return response.data;
};

// =========================================================
// UPDATE SOCIAL MEDIA
// =========================================================

export const updateSocialMedia = async (id, data) => {
  const response = await axios.put(
    `${API_URL}/admin/${id}`,
    data,
    getAuthConfig(),
  );

  return response.data;
};

// =========================================================
// ACTIVATE
// =========================================================

export const activateSocialMedia = async (id) => {
  const response = await axios.patch(
    `${API_URL}/admin/${id}/activate`,
    {},
    getAuthConfig(),
  );

  return response.data;
};

// =========================================================
// DEACTIVATE
// =========================================================

export const deactivateSocialMedia = async (id) => {
  const response = await axios.patch(
    `${API_URL}/admin/${id}/deactivate`,
    {},
    getAuthConfig(),
  );

  return response.data;
};

// =========================================================
// DELETE
// =========================================================

export const deleteSocialMedia = async (id) => {
  const response = await axios.delete(
    `${API_URL}/admin/${id}`,
    getAuthConfig(),
  );

  return response.data;
};
