import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API = `${API_BASE_URL}/api/academic-coordinators`;

/* ==============================
   Get All Academic Coordinators
============================== */
export const getAcademicCoordinators = () => {
  return axios.get(API);
};

/* ==============================
   Get Single Academic Coordinator
============================== */
export const getAcademicCoordinator = (id) => {
  return axios.get(`${API}/${id}`);
};

/* ==============================
   Add Academic Coordinator
============================== */
export const createAcademicCoordinator = (formData) => {
  return axios.post(API, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/* ==============================
   Update Academic Coordinator
============================== */
export const updateAcademicCoordinator = (id, formData) => {
  return axios.put(`${API}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/* ==============================
   Delete Academic Coordinator
============================== */
export const deleteAcademicCoordinator = (id) => {
  return axios.delete(`${API}/${id}`);
};
