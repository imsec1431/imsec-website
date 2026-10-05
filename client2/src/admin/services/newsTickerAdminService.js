import axios from "axios";
import { getToken } from "../utils/token.js";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/news-ticker`;

// Authentication configuration
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

// Get all news ticker items
export const getAdminNewsTicker = async () => {
  const response = await axios.get(`${API_URL}/admin`, getAuthConfig());

  return response.data;
};

// Create news ticker
export const createNewsTicker = async (data) => {
  const response = await axios.post(`${API_URL}/admin`, data, getAuthConfig());

  return response.data;
};

// Update news ticker
export const updateNewsTicker = async (id, data) => {
  const response = await axios.put(
    `${API_URL}/admin/${id}`,
    data,
    getAuthConfig(),
  );

  return response.data;
};

// Publish news ticker
export const publishNewsTicker = async (id) => {
  const response = await axios.patch(
    `${API_URL}/admin/${id}/publish`,
    {},
    getAuthConfig(),
  );

  return response.data;
};

// Unpublish news ticker
export const unpublishNewsTicker = async (id) => {
  const response = await axios.patch(
    `${API_URL}/admin/${id}/unpublish`,
    {},
    getAuthConfig(),
  );

  return response.data;
};

// Delete news ticker
export const deleteNewsTicker = async (id) => {
  const response = await axios.delete(
    `${API_URL}/admin/${id}`,
    getAuthConfig(),
  );

  return response.data;
};
