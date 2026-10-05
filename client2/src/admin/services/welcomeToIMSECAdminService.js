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

export const getAdminWelcomeToIMSEC = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/api/welcome-to-imsec/admin`,
    getAuthConfig(),
  );

  return response.data;
};

export const createWelcomeToIMSEC = async (data) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/welcome-to-imsec/admin`,
    data,
    getAuthConfig(),
  );

  return response.data;
};

export const updateWelcomeToIMSEC = async (id, data) => {
  const response = await axios.put(
    `${API_BASE_URL}/api/welcome-to-imsec/admin/${id}`,
    data,
    getAuthConfig(),
  );

  return response.data;
};

export const publishWelcomeToIMSEC = async (id) => {
  const response = await axios.patch(
    `${API_BASE_URL}/api/welcome-to-imsec/admin/${id}/publish`,
    {},
    getAuthConfig(),
  );

  return response.data;
};

export const unpublishWelcomeToIMSEC = async (id) => {
  const response = await axios.patch(
    `${API_BASE_URL}/api/welcome-to-imsec/admin/${id}/unpublish`,
    {},
    getAuthConfig(),
  );

  return response.data;
};

export const deleteWelcomeToIMSEC = async (id) => {
  const response = await axios.delete(
    `${API_BASE_URL}/api/welcome-to-imsec/admin/${id}`,
    getAuthConfig(),
  );

  return response.data;
};
