import axios from "axios";

// ======================================================
// API URL
// ======================================================

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/uptac-counselling`;

// ======================================================
// GET PUBLIC UPTAC DATA
// ======================================================

export const getPublicUptacCounselling = async () => {
  const response = await axios.get(`${API_URL}/public`);

  return response.data;
};

// ======================================================
// GET PUBLIC PDF VIEW URL
//
// This is our backend PDF endpoint.
//
// It does NOT point directly to Cloudinary.
// ======================================================

export const getUptacPdfViewUrl = () => {
  return `${API_URL}/public/pdf`;
};

// ======================================================
// GET PUBLIC PDF DOWNLOAD URL
// ======================================================

export const getUptacPdfDownloadUrl = () => {
  return `${API_URL}/public/pdf?download=true`;
};

// ======================================================
// DEFAULT EXPORT
// ======================================================

const uptacCounsellingService = {
  getPublicUptacCounselling,

  getUptacPdfViewUrl,

  getUptacPdfDownloadUrl,
};

export default uptacCounsellingService;
