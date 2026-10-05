import axios from "axios";

import { getToken } from "../utils/token.js";

/* =========================================================
   API URL
========================================================= */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/government-scholarship-policy`;

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
   GET ADMIN POLICY
========================================================= */

export const getAdminGovernmentScholarshipPolicy = async () => {
  const response = await axios.get(`${API_URL}/admin`, getAuthConfig());

  return response.data;
};

/* =========================================================
   CREATE POLICY
========================================================= */

export const createGovernmentScholarshipPolicy = async (data) => {
  const response = await axios.post(`${API_URL}/admin`, data, getAuthConfig());

  return response.data;
};

/* =========================================================
   UPDATE POLICY
========================================================= */

export const updateGovernmentScholarshipPolicy = async (data) => {
  const authConfig = getAuthConfig();

  const response = await axios.put(`${API_URL}/admin`, data, {
    ...authConfig,

    headers: {
      ...authConfig.headers,

      "Content-Type": "application/json",
    },
  });

  return response.data;
};

/* =========================================================
   PUBLISH
========================================================= */

export const publishGovernmentScholarshipPolicy = async () => {
  const response = await axios.patch(
    `${API_URL}/admin/publish`,
    {},
    getAuthConfig(),
  );

  return response.data;
};

/* =========================================================
   UNPUBLISH
========================================================= */

export const unpublishGovernmentScholarshipPolicy = async () => {
  const response = await axios.patch(
    `${API_URL}/admin/unpublish`,
    {},
    getAuthConfig(),
  );

  return response.data;
};

/* =========================================================
   PUBLIC POLICY
========================================================= */

export const getPublicGovernmentScholarshipPolicy = async () => {
  const response = await axios.get(`${API_URL}/public`);

  return response.data;
};

/* =========================================================
   DEFAULT EXPORT
========================================================= */

const governmentScholarshipPolicyService = {
  getAdminGovernmentScholarshipPolicy,

  createGovernmentScholarshipPolicy,

  updateGovernmentScholarshipPolicy,

  publishGovernmentScholarshipPolicy,

  unpublishGovernmentScholarshipPolicy,

  getPublicGovernmentScholarshipPolicy,
};

export default governmentScholarshipPolicyService;
