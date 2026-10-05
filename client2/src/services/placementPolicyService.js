import axios from "axios";

/* =========================================================
   API
========================================================= */
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/placement-policies`;

/* =========================================================
   GET PUBLIC PLACEMENT POLICIES
========================================================= */

export const fetchPlacementPolicies = async () => {
  const response = await axios.get(API_URL);

  return response.data;
};
