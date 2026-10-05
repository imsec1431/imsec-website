import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Get Industry Academics Collaboration
export const getIndustryAcademicsCollaboration = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/industry-academics-collaboration`,
    );

    return response.data;
  } catch (error) {
    console.error("Get Industry Academics Collaboration Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to load Industry Academics Collaboration.",
      }
    );
  }
};

const industryAcademicsService = {
  getIndustryAcademicsCollaboration,
};

export default industryAcademicsService;
