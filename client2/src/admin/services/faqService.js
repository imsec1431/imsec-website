import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/faq`;

/* =========================================================
   GET FAQ
========================================================= */

export const getAdminFAQ = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/admin`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

/* =========================================================
   CREATE FAQ
========================================================= */

export const createFAQ = async (data) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(`${API_URL}/admin`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

/* =========================================================
   UPDATE FAQ
========================================================= */

export const updateFAQ = async (data) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(`${API_URL}/admin`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

/* =========================================================
   PUBLISH FAQ
========================================================= */

export const publishFAQ = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.patch(
    `${API_URL}/admin/publish`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

/* =========================================================
   UNPUBLISH FAQ
========================================================= */

export const unpublishFAQ = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.patch(
    `${API_URL}/admin/unpublish`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

/* =========================================================
   RESET DEFAULT FAQ
========================================================= */

export const resetFAQ = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API_URL}/admin/reset`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
