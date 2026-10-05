import axios from "axios";
import { getToken } from "../utils/token.js";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/convocation`;

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

// ==========================================
// Get All Convocations - Admin
// ==========================================
export const getAdminConvocations = async () => {
  const response = await axios.get(`${API_URL}/admin`, getAuthConfig());

  return response.data;
};

// ==========================================
// Create Convocation
// ==========================================
export const createConvocation = async (data) => {
  const response = await axios.post(`${API_URL}/admin`, data, getAuthConfig());

  return response.data;
};

// ==========================================
// Update Convocation
// ==========================================
export const updateConvocation = async (id, data) => {
  const response = await axios.put(
    `${API_URL}/admin/${id}`,
    data,
    getAuthConfig(),
  );

  return response.data;
};

// ==========================================
// Publish Convocation
// ==========================================
export const publishConvocation = async (id) => {
  const response = await axios.patch(
    `${API_URL}/admin/${id}/publish`,
    {},
    getAuthConfig(),
  );

  return response.data;
};

// ==========================================
// Unpublish Convocation
// ==========================================
export const unpublishConvocation = async (id) => {
  const response = await axios.patch(
    `${API_URL}/admin/${id}/unpublish`,
    {},
    getAuthConfig(),
  );

  return response.data;
};

// ==========================================
// Delete Convocation
// ==========================================
export const deleteConvocation = async (id) => {
  const response = await axios.delete(
    `${API_URL}/admin/${id}`,
    getAuthConfig(),
  );

  return response.data;
};
