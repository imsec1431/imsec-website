import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const getAQAR = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/aqar`);

    return response.data;
  } catch (error) {
    console.error("Get AQAR Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to load AQAR information.",
      }
    );
  }
};

const aqarService = {
  getAQAR,
};

export default aqarService;
