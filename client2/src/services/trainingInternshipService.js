import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* =========================================================
   GET TRAINING & INTERNSHIP PUBLIC DATA
========================================================= */

export const getTrainingInternship = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/training-internship`);

    return response.data;
  } catch (error) {
    console.error("Get Training & Internship Error:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to load Training & Internship information.",
      }
    );
  }
};

/* =========================================================
   SERVICE OBJECT
========================================================= */

const trainingInternshipService = {
  getTrainingInternship,
};

export default trainingInternshipService;
