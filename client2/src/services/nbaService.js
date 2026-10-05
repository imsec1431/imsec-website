import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* =========================================================
   GET NBA PUBLIC DATA
========================================================= */

export const getNBA = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/nba`);

    return response.data;
  } catch (error) {
    console.error("Get NBA Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to load NBA information.",
      }
    );
  }
};

/* =========================================================
   SERVICE OBJECT
========================================================= */

const nbaService = {
  getNBA,
};

export default nbaService;
