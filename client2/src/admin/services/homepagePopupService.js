import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* =========================================================
   AUTH CONFIG
========================================================= */

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("imsec_admin_token")}`,
  },
});

/* =========================================================
   GET ALL POPUPS
========================================================= */

export const getAllHomepagePopups = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/homepage-popup`,
      getAuthConfig(),
    );

    return response.data;
  } catch (error) {
    console.error("Get All Homepage Popups Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to load homepage popup information.",
      }
    );
  }
};

/* =========================================================
   GET ACTIVE POPUPS
========================================================= */

export const getActiveHomepagePopups = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/homepage-popup/public`,
    );

    return response.data;
  } catch (error) {
    console.error("Get Active Homepage Popups Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to load homepage popup information.",
      }
    );
  }
};

/* =========================================================
   GET SINGLE POPUP
========================================================= */

export const getHomepagePopupById = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/homepage-popup/admin/${id}`,
      getAuthConfig(),
    );

    return response.data;
  } catch (error) {
    console.error("Get Homepage Popup Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to load popup.",
      }
    );
  }
};

/* =========================================================
   CREATE POPUP
   FORM DATA
========================================================= */

export const createHomepagePopup = async (formData) => {
  try {
    if (!(formData instanceof FormData)) {
      throw new Error("createHomepagePopup requires FormData.");
    }

    const response = await axios.post(
      `${API_BASE_URL}/api/homepage-popup/admin`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("imsec_admin_token")}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Create Homepage Popup Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to create popup.",
      }
    );
  }
};

/* =========================================================
   UPDATE POPUP
   FORM DATA
========================================================= */

export const updateHomepagePopup = async (id, formData) => {
  try {
    if (!(formData instanceof FormData)) {
      throw new Error("updateHomepagePopup requires FormData.");
    }

    const response = await axios.put(
      `${API_BASE_URL}/api/homepage-popup/admin/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("imsec_admin_token")}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Update Homepage Popup Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to update popup.",
      }
    );
  }
};

/* =========================================================
   DELETE POPUP
========================================================= */

export const deleteHomepagePopup = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/homepage-popup/admin/${id}`,
      getAuthConfig(),
    );

    return response.data;
  } catch (error) {
    console.error("Delete Homepage Popup Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to delete popup.",
      }
    );
  }
};

/* =========================================================
   UPDATE ROTATION SETTINGS
========================================================= */

export const updateHomepagePopupSettings = async (settings) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/homepage-popup/admin/settings`,
      settings,
      getAuthConfig(),
    );

    return response.data;
  } catch (error) {
    console.error("Update Homepage Popup Settings Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to update popup settings.",
      }
    );
  }
};

/* =========================================================
   RESET SETTINGS
========================================================= */

export const resetHomepagePopupSettings = async () => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/homepage-popup/admin/settings/reset`,
      {},
      getAuthConfig(),
    );

    return response.data;
  } catch (error) {
    console.error("Reset Homepage Popup Settings Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to reset popup settings.",
      }
    );
  }
};

/* =========================================================
   DEFAULT EXPORT
========================================================= */

const homepagePopupService = {
  getAllHomepagePopups,
  getActiveHomepagePopups,
  getHomepagePopupById,
  createHomepagePopup,
  updateHomepagePopup,
  deleteHomepagePopup,
  updateHomepagePopupSettings,
  resetHomepagePopupSettings,
};

export default homepagePopupService;
