import axios from "axios";

/* =========================================================
   API BASE URL
========================================================= */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* =========================================================
   GET ACTIVE HOMEPAGE POPUPS
   PUBLIC API
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
        message: "Unable to load homepage popups.",
      }
    );
  }
};

/* =========================================================
   DEFAULT EXPORT
========================================================= */

const homepagePopupService = {
  getActiveHomepagePopups,
};

export default homepagePopupService;
