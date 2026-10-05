import axios from "axios";

/* =========================================================
   API BASE URL
========================================================= */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* =========================================================
   PUBLIC EVENTS API
========================================================= */

const EVENTS_API_URL = `${API_BASE_URL}/api/events`;

/* =========================================================
   GET PUBLIC EVENTS
========================================================= */

export const getPublicEvents = async () => {
  try {
    const response = await axios.get(EVENTS_API_URL);

    return response;
  } catch (error) {
    console.error("GET PUBLIC EVENTS ERROR:", error);

    throw error;
  }
};

/* =========================================================
   NORMALIZED PUBLIC DATA
========================================================= */

export const fetchPublicEvents = async () => {
  try {
    const response = await getPublicEvents();

    const data = response?.data?.data || response?.data || {};

    return {
      hero: data?.hero || {},

      about: data?.about || {},

      featuredEvent: data?.featuredEvent || null,

      latestEvents: data?.latestEvents || {
        displayCount: 6,
        totalCount: 0,
        events: [],
      },

      memorableEvents: data?.memorableEvents || {
        displayCount: 6,
        totalCount: 0,
        events: [],
      },

      signatureEvents: data?.signatureEvents || {
        displayCount: 8,
        totalCount: 0,
        events: [],
      },

      statistics: data?.statistics || {
        eventsEveryYear: "200+",

        participants: "15,000+",

        industrySpeakers: "500+",

        studentClubs: "50+",
      },

      cta: data?.cta || {},
    };
  } catch (error) {
    console.error("FETCH PUBLIC EVENTS ERROR:", error);

    throw error;
  }
};

/* =========================================================
   HELPER — SECTION EVENTS
========================================================= */

export const getEventSection = (data, section) => {
  if (!data) {
    return {
      displayCount: 0,
      totalCount: 0,
      events: [],
    };
  }

  const sectionData = data?.[section];

  if (!sectionData) {
    return {
      displayCount: 0,
      totalCount: 0,
      events: [],
    };
  }

  return {
    displayCount: Number(sectionData.displayCount || 0),

    totalCount: Number(
      sectionData.totalCount ?? sectionData.events?.length ?? 0,
    ),

    events: Array.isArray(sectionData.events) ? sectionData.events : [],
  };
};

/* =========================================================
   HELPER — PDF URL
========================================================= */

export const getPdfUrl = (pdf) => {
  if (typeof pdf === "string") {
    return pdf.trim();
  }

  return String(pdf?.url || "").trim();
};

/* =========================================================
   HELPER — EVENT IMAGE
========================================================= */

export const getEventImageUrl = (image) => {
  if (typeof image === "string") {
    return image.trim();
  }

  return String(image?.url || "").trim();
};

/* =========================================================
   HELPER — SOCIAL LINKS
========================================================= */

export const getEventSocialLinks = (socialLinks) => {
  const links = socialLinks || {};

  return {
    facebook: String(links.facebook || "").trim(),

    instagram: String(links.instagram || "").trim(),

    youtube: String(links.youtube || "").trim(),

    linkedin: String(links.linkedin || "").trim(),

    twitter: String(links.twitter || "").trim(),

    website: String(links.website || "").trim(),
  };
};

/* =========================================================
   DEFAULT EXPORT
========================================================= */

const eventService = {
  getPublicEvents,
  fetchPublicEvents,
  getEventSection,
  getPdfUrl,
  getEventImageUrl,
  getEventSocialLinks,
};

export default eventService;
