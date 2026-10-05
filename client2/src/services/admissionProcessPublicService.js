import axios from "axios";

/* =========================================================
   API URL
========================================================= */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/admission-process`;

/* =========================================================
   GET PUBLIC ADMISSION PROCESS
========================================================= */

export const getPublicAdmissionProcess = async () => {
  const response = await axios.get(`${API_URL}/public`);

  return response.data;
};

/* =========================================================
   DEFAULT EXPORT
========================================================= */

const admissionProcessPublicService = {
  getPublicAdmissionProcess,
};

export default admissionProcessPublicService;
