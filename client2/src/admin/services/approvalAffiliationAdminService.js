import axios from "axios";
import { getToken } from "../utils/token.js";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/approvals-affiliations`;

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
// GET ALL DOCUMENTS — ADMIN
// =========================================================

export const getAdminApprovalAffiliations = async () => {
  const response = await axios.get(`${API_URL}/admin`, getAuthConfig());

  return response.data;
};

// =========================================================
// CREATE DOCUMENT
// =========================================================

export const createApprovalAffiliation = async (data) => {
  const response = await axios.post(`${API_URL}/admin`, data, getAuthConfig());

  return response.data;
};

// =========================================================
// UPDATE DOCUMENT
// =========================================================

export const updateApprovalAffiliation = async (id, data) => {
  const response = await axios.put(
    `${API_URL}/admin/${id}`,
    data,
    getAuthConfig(),
  );

  return response.data;
};

// =========================================================
// PUBLISH
// =========================================================

export const publishApprovalAffiliation = async (id) => {
  const response = await axios.patch(
    `${API_URL}/admin/${id}/publish`,
    {},
    getAuthConfig(),
  );

  return response.data;
};

// =========================================================
// UNPUBLISH
// =========================================================

export const unpublishApprovalAffiliation = async (id) => {
  const response = await axios.patch(
    `${API_URL}/admin/${id}/unpublish`,
    {},
    getAuthConfig(),
  );

  return response.data;
};

// =========================================================
// DELETE
// =========================================================

export const deleteApprovalAffiliation = async (id) => {
  const response = await axios.delete(
    `${API_URL}/admin/${id}`,
    getAuthConfig(),
  );

  return response.data;
};
