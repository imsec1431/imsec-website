import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* =========================================================
   GET GYM INFORMATION
   ========================================================= */

export const getGym = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/gym`);

    return response.data;
  } catch (error) {
    console.error("Get Gym Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to load gym information.",
      }
    );
  }
};

const gymService = {
  getGym,
};

export default gymService;
