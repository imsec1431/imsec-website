import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* =========================================================
   GET PUBLIC NAAC DATA
========================================================= */

export const getNAAC = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/naac`);

    return response.data;
  } catch (error) {
    console.error("Get NAAC Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to load NAAC information.",
      }
    );
  }
};

/* =========================================================
   DEFAULT EXPORT
========================================================= */

const naacService = {
  getNAAC,
};

export default naacService;
