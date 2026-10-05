import axios from "axios";
import { getToken, removeToken } from "../utils/token.js";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/cafeteria`;

/*
|--------------------------------------------------------------------------
| Authentication Config
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
| Get Cafeteria - Admin
|--------------------------------------------------------------------------
*/

export const getCafeteriaAdmin = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin`, authConfig());

    return response.data;
  } catch (error) {
    return handleAuthError(error);
  }
};

/*
|--------------------------------------------------------------------------
| Update Cafeteria
|--------------------------------------------------------------------------
|
| formData should contain:
|
| data:
|   JSON string containing cafeteria content
|
| heroImage:
|   Optional new hero image
|
| aboutImage:
|   Optional new about image
|--------------------------------------------------------------------------
*/

export const updateCafeteriaAdmin = async (formData) => {
  try {
    const response = await axios.put(`${API_URL}/admin`, formData, {
      ...authConfig(),

      headers: {
        ...authConfig().headers,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    return handleAuthError(error);
  }
};

/*
|--------------------------------------------------------------------------
| Restore Default Cafeteria
|--------------------------------------------------------------------------
*/

export const resetCafeteriaDefaults = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/admin/reset-defaults`,
      {},
      authConfig(),
    );

    return response.data;
  } catch (error) {
    return handleAuthError(error);
  }
};

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {
  getCafeteriaAdmin,
  updateCafeteriaAdmin,
  resetCafeteriaDefaults,
};
