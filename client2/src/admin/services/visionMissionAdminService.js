import axios from "axios";
import { getToken } from "../utils/token.js";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* =====================================================
   AUTH CONFIG
===================================================== */

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

/* =====================================================
   GET ADMIN
===================================================== */

export const getVisionMissionAdmin = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/api/vision-mission/admin`,
    getAuthConfig(),
  );

  return response.data;
};

/* =====================================================
   CREATE
===================================================== */

export const createVisionMission = async (data) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/vision-mission/admin`,
    data,
    getAuthConfig(),
  );

  return response.data;
};

/* =====================================================
   UPDATE
===================================================== */

export const updateVisionMission = async (id, data) => {
  const response = await axios.put(
    `${API_BASE_URL}/api/vision-mission/admin/${id}`,
    data,
    getAuthConfig(),
  );

  return response.data;
};

/* =====================================================
   PUBLISH
===================================================== */

export const publishVisionMission = async (id) => {
  const response = await axios.patch(
    `${API_BASE_URL}/api/vision-mission/admin/${id}/publish`,
    {},
    getAuthConfig(),
  );

  return response.data;
};

/* =====================================================
   UNPUBLISH
===================================================== */

export const unpublishVisionMission = async (id) => {
  const response = await axios.patch(
    `${API_BASE_URL}/api/vision-mission/admin/${id}/unpublish`,
    {},
    getAuthConfig(),
  );

  return response.data;
};

/* =====================================================
   DELETE
===================================================== */

export const deleteVisionMission = async (id) => {
  const response = await axios.delete(
    `${API_BASE_URL}/api/vision-mission/admin/${id}`,
    getAuthConfig(),
  );

  return response.data;
};

/* =====================================================
   IMAGE UPLOAD
===================================================== */

export const uploadVisionMissionImage = async (file) => {
  if (!file) {
    throw new Error("Please select an image.");
  }

  const token = getToken();

  if (!token) {
    throw new Error(
      "Admin authentication token not found. Please login again.",
    );
  }

  const formData = new FormData();

  formData.append("file", file);

  const response = await axios.post(`${API_BASE_URL}/api/photos`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export default {
  getVisionMissionAdmin,
  createVisionMission,
  updateVisionMission,
  publishVisionMission,
  unpublishVisionMission,
  deleteVisionMission,
  uploadVisionMissionImage,
};
