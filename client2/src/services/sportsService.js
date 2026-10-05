import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const getSports = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/sports`);
    return response.data;
  } catch (error) {
    console.error("Get Sports Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to load sports information.",
      }
    );
  }
};

const sportsService = {
  getSports,
};

export default sportsService;
