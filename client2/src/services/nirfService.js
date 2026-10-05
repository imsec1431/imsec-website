import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* =========================================================
   GET PUBLIC NIRF DATA
========================================================= */

export const getNIRF = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/nirf`);

    return response.data;
  } catch (error) {
    console.error("Get NIRF Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to load NIRF information.",
      }
    );
  }
};

/* =========================================================
   DEFAULT EXPORT
========================================================= */

const nirfService = {
  getNIRF,
};

export default nirfService;
