import axios from "axios";

import { getToken } from "../utils/token.js";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/admission-process`;

/* =========================================================
   AUTH CONFIGURATION
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
   ADMIN
   GET ADMISSION PROCESS
========================================================= */

export const getAdminAdmissionProcess = async () => {
  const response = await axios.get(`${API_URL}/admin`, getAuthConfig());

  return response.data;
};

/* =========================================================
   ADMIN
   CREATE / INITIALIZE
========================================================= */

export const createAdmissionProcess = async () => {
  const response = await axios.post(`${API_URL}/admin`, {}, getAuthConfig());

  return response.data;
};

/* =========================================================
   ADMIN
   UPDATE
========================================================= */

export const updateAdmissionProcess = async (data) => {
  const response = await axios.put(`${API_URL}/admin`, data, {
    ...getAuthConfig(),

    headers: {
      ...getAuthConfig().headers,

      "Content-Type": "application/json",
    },
  });

  return response.data;
};

/* =========================================================
   ADMIN
   PUBLISH
========================================================= */

export const publishAdmissionProcess = async () => {
  const response = await axios.patch(
    `${API_URL}/admin/publish`,
    {},
    getAuthConfig(),
  );

  return response.data;
};

/* =========================================================
   ADMIN
   UNPUBLISH
========================================================= */

export const unpublishAdmissionProcess = async () => {
  const response = await axios.patch(
    `${API_URL}/admin/unpublish`,
    {},
    getAuthConfig(),
  );

  return response.data;
};

/* =========================================================
   ADMIN
   RESET TO DEFAULT
========================================================= */

export const resetAdmissionProcess = async () => {
  const response = await axios.post(
    `${API_URL}/admin/reset`,
    {},
    getAuthConfig(),
  );

  return response.data;
};

/* =========================================================
   DEFAULT EXPORT
========================================================= */

const admissionProcessService = {
  getAdminAdmissionProcess,

  createAdmissionProcess,

  updateAdmissionProcess,

  publishAdmissionProcess,

  unpublishAdmissionProcess,

  resetAdmissionProcess,
};

export default admissionProcessService;
