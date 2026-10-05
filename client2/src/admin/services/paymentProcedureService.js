import axios from "axios";

import { getToken } from "../utils/token.js";

/* =========================================================
   API URL
========================================================= */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/payment-procedure`;

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
   GET ADMIN PAYMENT PROCEDURE
========================================================= */

export const getAdminPaymentProcedure = async () => {
  const authConfig = getAuthConfig();

  const response = await axios.get(`${API_URL}/admin`, authConfig);

  return response.data;
};

/* =========================================================
   CREATE PAYMENT PROCEDURE
========================================================= */

export const createPaymentProcedure = async (data) => {
  const authConfig = getAuthConfig();

  const response = await axios.post(`${API_URL}/admin`, data, {
    headers: {
      ...authConfig.headers,
    },
  });

  return response.data;
};

/* =========================================================
   UPDATE PAYMENT PROCEDURE
========================================================= */

export const updatePaymentProcedure = async (data) => {
  const authConfig = getAuthConfig();

  /*
   * IMPORTANT:
   *
   * data can be FormData when a QR image
   * is being uploaded.
   *
   * Do NOT manually set:
   *
   * Content-Type: application/json
   *
   * Axios will automatically set:
   *
   * multipart/form-data
   *
   * including the required boundary.
   */

  const response = await axios.put(`${API_URL}/admin`, data, {
    headers: {
      ...authConfig.headers,
    },
  });

  return response.data;
};

/* =========================================================
   PUBLISH
========================================================= */

export const publishPaymentProcedure = async () => {
  const authConfig = getAuthConfig();

  const response = await axios.patch(
    `${API_URL}/admin/publish`,
    {},
    authConfig,
  );

  return response.data;
};

/* =========================================================
   UNPUBLISH
========================================================= */

export const unpublishPaymentProcedure = async () => {
  const authConfig = getAuthConfig();

  const response = await axios.patch(
    `${API_URL}/admin/unpublish`,
    {},
    authConfig,
  );

  return response.data;
};

/* =========================================================
   DEFAULT EXPORT
========================================================= */

const paymentProcedureService = {
  getAdminPaymentProcedure,

  createPaymentProcedure,

  updatePaymentProcedure,

  publishPaymentProcedure,

  unpublishPaymentProcedure,
};

export default paymentProcedureService;
