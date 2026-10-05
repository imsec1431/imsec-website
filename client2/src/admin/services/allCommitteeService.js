import axios from "axios";

import { getToken } from "../utils/token";
import { getConfiguredApiBase } from "../utils/adminHttp";

/* =========================================================
   API
========================================================= */

const API = axios.create({
  baseURL: `${getConfiguredApiBase()}/api`,
});

/* =========================================================
   AUTH CONFIG
========================================================= */

const getAuthConfig = () => {
  const token = getToken();

  if (!token) {
    throw new Error(
      "Admin authentication token not found. Please login again.",
    );
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/* =========================================================
   GET ALL COMMITTEES
   ADMIN
========================================================= */

export const getAllCommittees = async () => {
  return API.get("/all-committees", getAuthConfig());
};

/* =========================================================
   GET SINGLE COMMITTEE
   ADMIN
========================================================= */

export const getCommitteeById = async (id) => {
  return API.get(`/all-committees/${id}`, getAuthConfig());
};

/* =========================================================
   CREATE COMMITTEE
   ADMIN
========================================================= */

export const createCommittee = async (committeeData) => {
  return API.post("/all-committees", committeeData, getAuthConfig());
};

/* =========================================================
   UPDATE COMMITTEE
   ADMIN
========================================================= */

export const updateCommittee = async (id, committeeData) => {
  return API.put(`/all-committees/${id}`, committeeData, getAuthConfig());
};

/* =========================================================
   DELETE COMMITTEE
   ADMIN
========================================================= */

export const deleteCommittee = async (id) => {
  return API.delete(`/all-committees/${id}`, getAuthConfig());
};

/* =========================================================
   PUBLIC
   GET PUBLISHED COMMITTEES
========================================================= */

export const getPublishedCommittees = async () => {
  return API.get("/all-committees/public");
};

export default API;
