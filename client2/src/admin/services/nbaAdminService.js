import axios from "axios";
import { getToken, removeToken } from "../utils/token";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* =========================================================
   GET NBA - ADMIN
========================================================= */

export const getNBAAdmin = async () => {
  try {
    const token = getToken();

    const response = await axios.get(`${API_BASE_URL}/api/nba/admin`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error?.response?.status === 401) {
      removeToken();
    }

    console.error("Get NBA Admin Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to load NBA information.",
      }
    );
  }
};

/* =========================================================
   UPDATE NBA
========================================================= */

export const updateNBA = async (data) => {
  try {
    const token = getToken();

    const response = await axios.put(`${API_BASE_URL}/api/nba/admin`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    if (error?.response?.status === 401) {
      removeToken();
    }

    console.error("Update NBA Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to update NBA information.",
      }
    );
  }
};

/* =========================================================
   DELETE NBA RECORD
========================================================= */

export const deleteNBARecord = async (id) => {
  try {
    const token = getToken();

    const response = await axios.delete(`${API_BASE_URL}/api/nba/admin/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error?.response?.status === 401) {
      removeToken();
    }

    console.error("Delete NBA Record Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to delete NBA record.",
      }
    );
  }
};

/* =========================================================
   RESET NBA
========================================================= */

export const resetNBA = async () => {
  try {
    const token = getToken();

    const response = await axios.post(
      `${API_BASE_URL}/api/nba/admin/reset-defaults`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    if (error?.response?.status === 401) {
      removeToken();
    }

    console.error("Reset NBA Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to reset NBA information.",
      }
    );
  }
};

/* =========================================================
   SERVICE OBJECT
========================================================= */

const nbaAdminService = {
  getNBAAdmin,
  updateNBA,
  deleteNBARecord,
  resetNBA,
};

export default nbaAdminService;
