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

/**
 * Get all Academic Matrix programs
 */
export const getAcademicMatrixAdmin = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/api/academic-matrix/admin`,
    getAuthConfig(),
  );

  return response.data;
};

/**
 * Create Academic Matrix program
 */
export const createAcademicMatrix = async (data) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/academic-matrix/admin`,
    data,
    getAuthConfig(),
  );

  return response.data;
};

/**
 * Update Academic Matrix program
 */
export const updateAcademicMatrix = async (id, data) => {
  const response = await axios.put(
    `${API_BASE_URL}/api/academic-matrix/admin/${id}`,
    data,
    getAuthConfig(),
  );

  return response.data;
};

/**
 * Publish Academic Matrix program
 */
export const publishAcademicMatrix = async (id) => {
  const response = await axios.patch(
    `${API_BASE_URL}/api/academic-matrix/admin/${id}/publish`,
    {},
    getAuthConfig(),
  );

  return response.data;
};

/**
 * Unpublish Academic Matrix program
 */
export const unpublishAcademicMatrix = async (id) => {
  const response = await axios.patch(
    `${API_BASE_URL}/api/academic-matrix/admin/${id}/unpublish`,
    {},
    getAuthConfig(),
  );

  return response.data;
};

/**
 * Delete Academic Matrix program
 */
export const deleteAcademicMatrix = async (id) => {
  const response = await axios.delete(
    `${API_BASE_URL}/api/academic-matrix/admin/${id}`,
    getAuthConfig(),
  );

  return response.data;
};
