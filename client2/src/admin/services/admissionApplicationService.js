import axios from "axios";

import { getToken } from "../utils/token.js";

/* =========================================================
   API URL
========================================================= */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/admission-application`;

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
   GET ALL APPLICATIONS
========================================================= */

export const getAdmissionApplications = async (params = {}) => {
  const authConfig = getAuthConfig();

  const response = await axios.get(`${API_URL}/admin`, {
    ...authConfig,

    params,
  });

  return response.data;
};

/* =========================================================
   GET SINGLE APPLICATION
========================================================= */

export const getAdmissionApplication = async (id) => {
  if (!id) {
    throw new Error("Application ID is required.");
  }

  const response = await axios.get(`${API_URL}/admin/${id}`, getAuthConfig());

  return response.data;
};

/* =========================================================
   UPDATE APPLICATION STATUS
========================================================= */

export const updateAdmissionApplicationStatus = async (id, data) => {
  if (!id) {
    throw new Error("Application ID is required.");
  }

  const authConfig = getAuthConfig();

  const response = await axios.patch(`${API_URL}/admin/${id}/status`, data, {
    ...authConfig,

    headers: {
      ...authConfig.headers,

      "Content-Type": "application/json",
    },
  });

  return response.data;
};

/* =========================================================
   DELETE APPLICATION
========================================================= */

export const deleteAdmissionApplication = async (id) => {
  if (!id) {
    throw new Error("Application ID is required.");
  }

  const response = await axios.delete(
    `${API_URL}/admin/${id}`,
    getAuthConfig(),
  );

  return response.data;
};

/* =========================================================
   DOWNLOAD EXCEL
========================================================= */

export const downloadAdmissionApplicationsExcel = async (params = {}) => {
  const authConfig = getAuthConfig();

  const response = await axios.get(`${API_URL}/admin/export`, {
    ...authConfig,

    params,

    responseType: "blob",
  });

  /* =====================================================
       CREATE DOWNLOAD URL
    ===================================================== */

  const blob = new Blob([response.data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);

  /* =====================================================
       DOWNLOAD
    ===================================================== */

  const link = document.createElement("a");

  link.href = url;

  const date = new Date().toISOString().slice(0, 10);

  link.download = `Admission_Applications_${date}.xlsx`;

  document.body.appendChild(link);

  link.click();

  /* =====================================================
       CLEANUP
    ===================================================== */

  link.remove();

  window.URL.revokeObjectURL(url);

  return true;
};

/* =========================================================
   DEFAULT EXPORT
========================================================= */

const admissionApplicationService = {
  getAdmissionApplications,

  getAdmissionApplication,

  updateAdmissionApplicationStatus,

  deleteAdmissionApplication,

  downloadAdmissionApplicationsExcel,
};

export default admissionApplicationService;
