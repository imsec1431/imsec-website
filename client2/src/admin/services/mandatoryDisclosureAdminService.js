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
 * Get all Mandatory Disclosure documents
 */
export const getMandatoryDisclosureAdmin = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/api/mandatory-disclosure/admin`,
    getAuthConfig(),
  );

  return response.data;
};

/**
 * Create Mandatory Disclosure
 */
export const createMandatoryDisclosure = async (data) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/mandatory-disclosure/admin`,
    data,
    getAuthConfig(),
  );

  return response.data;
};

/**
 * Update Mandatory Disclosure
 */
export const updateMandatoryDisclosure = async (id, data) => {
  const response = await axios.put(
    `${API_BASE_URL}/api/mandatory-disclosure/admin/${id}`,
    data,
    getAuthConfig(),
  );

  return response.data;
};

/**
 * Publish Mandatory Disclosure
 */
export const publishMandatoryDisclosure = async (id) => {
  const response = await axios.patch(
    `${API_BASE_URL}/api/mandatory-disclosure/admin/${id}/publish`,
    {},
    getAuthConfig(),
  );

  return response.data;
};

/**
 * Unpublish Mandatory Disclosure
 */
export const unpublishMandatoryDisclosure = async (id) => {
  const response = await axios.patch(
    `${API_BASE_URL}/api/mandatory-disclosure/admin/${id}/unpublish`,
    {},
    getAuthConfig(),
  );

  return response.data;
};

/**
 * Delete Mandatory Disclosure
 */
export const deleteMandatoryDisclosure = async (id) => {
  const response = await axios.delete(
    `${API_BASE_URL}/api/mandatory-disclosure/admin/${id}`,
    getAuthConfig(),
  );

  return response.data;
};
