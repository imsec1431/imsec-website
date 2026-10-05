import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* =========================================================
   GET ACCREDITATIONS
   ========================================================= */

export const getAccreditations = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/accreditations`);

    return response.data;
  } catch (error) {
    console.error("Get Accreditations Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to load accreditations.",
      }
    );
  }
};

/* =========================================================
   DEFAULT SERVICE OBJECT
   ========================================================= */

const accreditationsService = {
  getAccreditations,
};

export default accreditationsService;
