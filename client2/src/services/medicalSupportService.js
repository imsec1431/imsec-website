import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const getMedicalSupport = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/medical-support`);

    return response.data;
  } catch (error) {
    console.error("Get Medical Support Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to load medical support information.",
      }
    );
  }
};

const medicalSupportService = {
  getMedicalSupport,
};

export default medicalSupportService;
