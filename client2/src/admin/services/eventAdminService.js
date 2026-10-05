import axios from "axios";
import { getToken, removeToken } from "../utils/token";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/*
|--------------------------------------------------------------------------
| AUTH CONFIG
|--------------------------------------------------------------------------
*/

const getAuthConfig = () => {
  const token = getToken();

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/*
|--------------------------------------------------------------------------
| AUTH ERROR HANDLER
|--------------------------------------------------------------------------
*/

const handleAuthError = (error) => {
  if (error?.response?.status === 401) {
    removeToken();

    localStorage.removeItem("imsec_admin");

    window.location.href = "/imsec-control-center/login";
  }

  throw error;
};

/*
|--------------------------------------------------------------------------
| GET PUBLIC EVENTS
|--------------------------------------------------------------------------
*/

export const getEvents = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/events`);

    return response;
  } catch (error) {
    console.error("GET EVENTS ERROR:", error);

    throw error;
  }
};

/*
|--------------------------------------------------------------------------
| GET EVENTS - ADMIN
|--------------------------------------------------------------------------
*/

export const getEventsAdmin = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/events/admin`,
      getAuthConfig(),
    );

    return response;
  } catch (error) {
    console.error("GET EVENTS ADMIN ERROR:", error);

    return handleAuthError(error);
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE EVENTS - ADMIN
|--------------------------------------------------------------------------
|
| FormData contains:
|
| - hero
| - about
| - featuredEvent
| - latestEvents
| - memorableEvents
| - signatureEvents
| - statistics
| - cta
|
| Images are uploaded as files.
|
| PDFs are NOT uploaded.
| PDF fields contain URL/link values.
|
*/

export const updateEventsAdmin = async (formData) => {
  try {
    if (!(formData instanceof FormData)) {
      throw new Error("updateEventsAdmin requires FormData.");
    }

    const response = await axios.put(
      `${API_BASE_URL}/api/events/admin`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          // Do NOT manually set Content-Type.
          // Axios will automatically add the
          // multipart/form-data boundary.
        },
      },
    );

    return response;
  } catch (error) {
    console.error("UPDATE EVENTS ADMIN ERROR:", error);

    return handleAuthError(error);
  }
};

/*
|--------------------------------------------------------------------------
| DELETE EVENT
|--------------------------------------------------------------------------
|
| section:
|   latest
|   memorable
|   signature
|
| eventId:
|   MongoDB event _id
|
*/

export const deleteEvent = async (section, eventId) => {
  try {
    if (!section) {
      throw new Error("Event section is required.");
    }

    if (!eventId) {
      throw new Error("Event ID is required.");
    }

    const allowedSections = ["latest", "memorable", "signature"];

    if (!allowedSections.includes(section)) {
      throw new Error("Invalid event section.");
    }

    const response = await axios.delete(
      `${API_BASE_URL}/api/events/admin/${section}/${eventId}`,
      getAuthConfig(),
    );

    return response;
  } catch (error) {
    console.error("DELETE EVENT ERROR:", error);

    return handleAuthError(error);
  }
};

/*
|--------------------------------------------------------------------------
| DELETE FEATURED EVENT
|--------------------------------------------------------------------------
*/

export const deleteFeaturedEvent = async () => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/events/admin/featured`,
      getAuthConfig(),
    );

    return response;
  } catch (error) {
    console.error("DELETE FEATURED EVENT ERROR:", error);

    return handleAuthError(error);
  }
};

/*
|--------------------------------------------------------------------------
| RESET EVENTS DEFAULTS
|--------------------------------------------------------------------------
*/

export const resetEventsDefaults = async () => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/events/admin/reset-defaults`,
      {},
      getAuthConfig(),
    );

    return response;
  } catch (error) {
    console.error("RESET EVENTS DEFAULTS ERROR:", error);

    return handleAuthError(error);
  }
};

/*
|--------------------------------------------------------------------------
| DEFAULT SERVICE OBJECT
|--------------------------------------------------------------------------
*/

const eventAdminService = {
  getEvents,
  getEventsAdmin,
  updateEventsAdmin,
  deleteEvent,
  deleteFeaturedEvent,
  resetEventsDefaults,
};

export default eventAdminService;
