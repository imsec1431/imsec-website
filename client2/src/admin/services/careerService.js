import axios from "axios";

import { getToken } from "../utils/token.js";

/*
|--------------------------------------------------------------------------
| API CONFIGURATION
|--------------------------------------------------------------------------
*/

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/careers`;

/*
|--------------------------------------------------------------------------
| ADMIN AUTH CONFIG
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| CAREER OPENINGS
|--------------------------------------------------------------------------
*/

// GET ALL OPENINGS

export const getCareerOpeningsAdmin = async () => {
  const response = await axios.get(
    `${API_URL}/admin/openings`,
    getAuthConfig(),
  );

  return response.data;
};

// GET SINGLE OPENING

export const getCareerOpeningAdmin = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getAuthConfig());

  return response.data;
};

// CREATE OPENING

export const createCareerOpening = async (data) => {
  const response = await axios.post(
    `${API_URL}/admin/openings`,
    data,
    getAuthConfig(),
  );

  return response.data;
};

// UPDATE OPENING

export const updateCareerOpening = async (id, data) => {
  const response = await axios.put(
    `${API_URL}/admin/openings/${id}`,
    data,
    getAuthConfig(),
  );

  return response.data;
};

// DELETE OPENING

export const deleteCareerOpening = async (id) => {
  const response = await axios.delete(
    `${API_URL}/admin/openings/${id}`,
    getAuthConfig(),
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| CAREER APPLICATIONS
|--------------------------------------------------------------------------
*/

// GET ALL APPLICATIONS

export const getCareerApplications = async () => {
  const response = await axios.get(
    `${API_URL}/admin/applications`,
    getAuthConfig(),
  );

  return response.data;
};

// GET APPLICATIONS FOR ONE OPENING

export const getCareerApplicationsByOpening = async (openingId) => {
  const response = await axios.get(
    `${API_URL}/admin/applications/opening/${openingId}`,
    getAuthConfig(),
  );

  return response.data;
};

// GET ONE APPLICATION

export const getCareerApplication = async (applicationId) => {
  const response = await axios.get(
    `${API_URL}/admin/applications/${applicationId}`,
    getAuthConfig(),
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| DOWNLOAD EXCEL
|--------------------------------------------------------------------------
*/

export const downloadCareerApplicationsExcel = async () => {
  const token = getToken();

  if (!token) {
    throw new Error(
      "Admin authentication token not found. Please login again.",
    );
  }

  const response = await axios.get(`${API_URL}/admin/applications/export`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },

    responseType: "blob",
  });

  return response.data;
};

/*
|--------------------------------------------------------------------------
| DOWNLOAD / VIEW CV
|--------------------------------------------------------------------------
|
| HR ONLY
|
| Backend route:
|
| GET /api/careers/admin/applications/:id/resume
|
|--------------------------------------------------------------------------
*/

export const downloadCareerApplicationResume = async (applicationId) => {
  const token = getToken();

  if (!token) {
    throw new Error(
      "Admin authentication token not found. Please login again.",
    );
  }

  const response = await axios.get(
    `${API_URL}/admin/applications/${applicationId}/resume`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },

      responseType: "blob",
    },
  );

  return {
    blob: response.data,

    contentType: response.headers["content-type"],

    contentDisposition: response.headers["content-disposition"],
  };
};
