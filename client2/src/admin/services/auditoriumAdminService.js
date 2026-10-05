import axios from "axios";
import { getToken, removeToken } from "../utils/token.js";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/auditorium`;

/*
|--------------------------------------------------------------------------
| Authentication Configuration
|--------------------------------------------------------------------------
*/

const authConfig = () => {
  const token = getToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/*
|--------------------------------------------------------------------------
| Authentication Error Handler
|--------------------------------------------------------------------------
*/

const handleAuthError = (error) => {
  if (error?.response?.status === 401) {
    removeToken();

    localStorage.removeItem("imsec_admin");

    window.location.href = "/imsec-control-center/login";
  }

  throw error;
};

/*
|--------------------------------------------------------------------------
| GET Auditorium - Admin
|--------------------------------------------------------------------------
| Fetch complete Auditorium data for admin panel.
|--------------------------------------------------------------------------
*/

export const getAuditoriumAdmin = async () => {
  try {
    const config = authConfig();

    const response = await axios.get(`${API_URL}/admin`, config);

    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE Auditorium - Admin
|--------------------------------------------------------------------------
| Sends:
|
| - Text data
| - Hero image
| - Introduction image
| - Gallery images
|
| using multipart/form-data.
|--------------------------------------------------------------------------
*/

export const updateAuditoriumAdmin = async (formData) => {
  try {
    const config = authConfig();

    const response = await axios.put(`${API_URL}/admin`, formData, {
      ...config,

      headers: {
        ...config.headers,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

/*
|--------------------------------------------------------------------------
| RESET Auditorium Defaults
|--------------------------------------------------------------------------
| Restores:
|
| - Default text
| - Default images
| - Default facilities
| - Default features
| - Default gallery
| - Default statistics
| - Default uses
| - Default rules
| - Default FAQs
| - Default CTA
|--------------------------------------------------------------------------
*/

export const resetAuditoriumDefaults = async () => {
  try {
    const config = authConfig();

    const response = await axios.post(
      `${API_URL}/admin/reset-defaults`,
      {},
      config,
    );

    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {
  getAuditoriumAdmin,
  updateAuditoriumAdmin,
  resetAuditoriumDefaults,
};
