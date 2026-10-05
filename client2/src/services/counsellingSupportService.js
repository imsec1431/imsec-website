import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* =========================================================
   GET COUNSELLING SUPPORT - PUBLIC
========================================================= */

export const getCounsellingSupport = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/counselling-support`);

    return response.data;
  } catch (error) {
    console.error("Get Counselling Support Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to load counselling support information.",
      }
    );
  }
};

/* =========================================================
   SERVICE OBJECT
========================================================= */

const counsellingSupportService = {
  getCounsellingSupport,
};

export default counsellingSupportService;
