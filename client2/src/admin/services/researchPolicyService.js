import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API = `${API_BASE_URL}/api/research/policies`;

/* =========================================
   GET ALL
========================================= */

export const getResearchPolicies = async () => {
  return await axios.get(API);
};

/* =========================================
   GET SINGLE
========================================= */

export const getResearchPolicy = async (id) => {
  return await axios.get(`${API}/${id}`);
};

/* =========================================
   CREATE
========================================= */

export const addResearchPolicy = async (data) => {
  // console.log("CREATE POLICY DATA:", data);

  return await axios.post(API, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

/* =========================================
   UPDATE
========================================= */

export const updateResearchPolicy = async (id, data) => {
  // console.log("UPDATE POLICY DATA:", data);

  return await axios.put(`${API}/${id}`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

/* =========================================
   DELETE
========================================= */

export const deleteResearchPolicy = async (id) => {
  return await axios.delete(`${API}/${id}`);
};
