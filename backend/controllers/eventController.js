import mongoose from "mongoose";
import Event from "../models/Event.js";
import cloudinary5 from "../config/cloudinaryConfig5.js";

/* =========================================================
   DEFAULT DATA
========================================================= */

const DEFAULT_DATA = {
  hero: {
    title: "Events",
    subtitle: "Discover events, activities and memorable moments at IMSEC",
    breadcrumb: "Home / Life @ IMSEC / Events",
  },

  about: {
    title: "Events at IMSEC",
    description1: "",
    description2: "",
    image: {},
  },

  featuredEvent: null,

  latestEvents: {
    displayCount: 6,
    events: [],
  },

  memorableEvents: {
    displayCount: 6,
    events: [],
  },

  signatureEvents: {
    displayCount: 8,
    events: [],
  },

  statistics: {
    eventsEveryYear: "200+",
    participants: "15,000+",
    industrySpeakers: "500+",
    studentClubs: "50+",
  },

  cta: {
    title: "Be a Part of IMSEC Events",
    description:
      "Participate in events, activities and experiences that make campus life memorable.",
    buttonText: "Explore Events",
    buttonLink: "/events",
  },
};

/* =========================================================
   CONSTANTS
========================================================= */

const ALLOWED_STATUSES = ["Upcoming", "Ongoing", "Completed", "Cancelled"];

const SECTION_MAP = {
  latest: "latestEvents",
  memorable: "memorableEvents",
  signature: "signatureEvents",
};

/* =========================================================
   HELPERS
========================================================= */

const safeNumber = (value, fallback = 0) => {
  const number = Number(value);

  return Number.isFinite(number) ? number : fallback;
};

const parseBoolean = (value, fallback = false) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (normalized === "true") {
      return true;
    }

    if (normalized === "false") {
      return false;
    }
  }

  if (typeof value === "number") {
    return value === 1;
  }

  return fallback;
};

/* =========================================================
   PDF LINK
========================================================= */

const normalizePdfLink = (value) => {
  if (typeof value === "string") {
    return {
      url: value.trim(),
    };
  }

  if (value && typeof value === "object") {
    return {
      url: String(value.url || "").trim(),
    };
  }

  return {
    url: "",
  };
};

/* =========================================================
   SOCIAL LINKS
========================================================= */

const normalizeSocialLinks = (value) => {
  const source = value || {};

  return {
    facebook: String(source.facebook || "").trim(),
    instagram: String(source.instagram || "").trim(),
    youtube: String(source.youtube || "").trim(),
    linkedin: String(source.linkedin || "").trim(),
    twitter: String(source.twitter || "").trim(),
    website: String(source.website || "").trim(),
  };
};

/* =========================================================
   FIND UPLOADED FILE
========================================================= */

const findFile = (files, fieldName) => {
  if (!Array.isArray(files)) {
    return null;
  }

  return files.find((file) => file.fieldname === fieldName) || null;
};

/* =========================================================
   UPLOAD IMAGE ONLY
========================================================= */

const uploadImage = async (file) => {
  if (!file) {
    return null;
  }

  const extension = String(file.originalname || "")
    .split(".")
    .pop()
    .toLowerCase();

  if (file.mimetype === "application/pdf" || extension === "pdf") {
    throw new Error(
      "PDF uploads are disabled. Please provide a PDF URL instead.",
    );
  }

  const result = await cloudinary5.uploader.upload(file.path, {
    folder: "imsec/events",
    resource_type: "image",
  });

  return {
    url: result.secure_url || result.url || "",

    publicId: result.public_id || "",

    fileName: file.originalname || "",

    fileType: file.mimetype || "",
  };
};

/* =========================================================
   DELETE CLOUDINARY IMAGE
========================================================= */

const deleteCloudinaryImage = async (image) => {
  if (!image?.publicId) {
    return;
  }

  try {
    await cloudinary5.uploader.destroy(image.publicId, {
      resource_type: "image",
    });
  } catch (error) {
    console.error("CLOUDINARY IMAGE DELETE ERROR:", error);
  }
};

/* =========================================================
   NORMALIZE EVENT
========================================================= */

const normalizeEvent = (event = {}) => {
  const source = event || {};

  const rawStatus = String(source.status || "Upcoming").trim();

  const status = ALLOWED_STATUSES.includes(rawStatus) ? rawStatus : "Upcoming";

  return {
    _id: source._id || undefined,

    title: String(source.title || "").trim(),

    shortDescription: String(source.shortDescription || "").trim(),

    description: String(source.description || "").trim(),

    category: String(source.category || "General").trim(),

    eventType: String(source.eventType || "College Event").trim(),

    startDate: String(source.startDate || "").trim(),

    endDate: String(source.endDate || "").trim(),

    time: String(source.time || "").trim(),

    venue: String(source.venue || "").trim(),

    organizer: String(source.organizer || "").trim(),

    department: String(source.department || "").trim(),

    program: String(source.program || "").trim(),

    academicYear: String(source.academicYear || "").trim(),

    participants: String(source.participants || "").trim(),

    status,

    featured: parseBoolean(source.featured, false),

    published: parseBoolean(source.published, true),

    image: source.image || {},

    photoPdf: normalizePdfLink(source.photoPdf),

    reportPdf: normalizePdfLink(source.reportPdf),

    registrationLink: String(source.registrationLink || "").trim(),

    socialLinks: normalizeSocialLinks(source.socialLinks),
  };
};

/* =========================================================
   NORMALIZE SECTION
========================================================= */

const normalizeSection = (section, defaultCount) => {
  return {
    displayCount: Math.max(0, safeNumber(section?.displayCount, defaultCount)),

    events: Array.isArray(section?.events)
      ? section.events.map(normalizeEvent)
      : [],
  };
};

/* =========================================================
   NORMALIZE PAGE
========================================================= */

const normalizePage = (document) => {
  if (!document) {
    return {
      ...DEFAULT_DATA,
    };
  }

  return {
    hero: {
      ...DEFAULT_DATA.hero,
      ...(document.hero || {}),
    },

    about: {
      ...DEFAULT_DATA.about,
      ...(document.about || {}),
      image: document.about?.image || {},
    },

    featuredEvent: document.featuredEvent
      ? normalizeEvent(document.featuredEvent)
      : null,

    latestEvents: normalizeSection(document.latestEvents, 6),

    memorableEvents: normalizeSection(document.memorableEvents, 6),

    signatureEvents: normalizeSection(document.signatureEvents, 8),

    statistics: {
      ...DEFAULT_DATA.statistics,
      ...(document.statistics || {}),
    },

    cta: {
      ...DEFAULT_DATA.cta,
      ...(document.cta || {}),
    },
  };
};

/* =========================================================
   CREATE / GET SINGLETON DOCUMENT
========================================================= */

const createDefaultDocument = async () => {
  let document = await Event.findOne({
    singletonKey: "events-page",
  });

  if (!document) {
    document = await Event.create({
      singletonKey: "events-page",
      ...DEFAULT_DATA,
    });
  }

  return document;
};

/* =========================================================
   GET PUBLIC EVENTS
========================================================= */

export const getEvents = async (req, res) => {
  try {
    const document = await createDefaultDocument();

    const data = normalizePage(document);

    const prepareSection = (section) => {
      const events = section.events.filter(
        (event) => event.published !== false,
      );

      return {
        displayCount: section.displayCount,

        totalCount: events.length,

        events,
      };
    };

    return res.status(200).json({
      success: true,

      data: {
        hero: data.hero,

        about: data.about,

        featuredEvent: data.featuredEvent,

        latestEvents: prepareSection(data.latestEvents),

        memorableEvents: prepareSection(data.memorableEvents),

        signatureEvents: prepareSection(data.signatureEvents),

        statistics: data.statistics,

        cta: data.cta,
      },
    });
  } catch (error) {
    console.error("GET PUBLIC EVENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load events.",
    });
  }
};

/* =========================================================
   GET ADMIN EVENTS
========================================================= */

export const getEventsAdmin = async (req, res) => {
  try {
    const document = await createDefaultDocument();

    return res.status(200).json({
      success: true,
      data: normalizePage(document),
    });
  } catch (error) {
    console.error("GET ADMIN EVENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load events.",
    });
  }
};

/* =========================================================
   UPDATE EVENTS
========================================================= */

export const updateEvents = async (req, res) => {
  try {
    let payload = {};

    /*
     * Frontend sends:
     * FormData -> data -> JSON
     */

    if (req.body?.data) {
      try {
        payload =
          typeof req.body.data === "string"
            ? JSON.parse(req.body.data)
            : req.body.data;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid event data.",
        });
      }
    } else {
      payload = req.body || {};
    }

    const files = Array.isArray(req.files) ? req.files : [];

    const document = await createDefaultDocument();

    /* =====================================================
       HERO
    ===================================================== */

    document.hero = {
      title: String(payload.hero?.title || "Events").trim(),

      subtitle: String(payload.hero?.subtitle || "").trim(),

      breadcrumb: String(
        payload.hero?.breadcrumb || "Home / Life @ IMSEC / Events",
      ).trim(),
    };

    /* =====================================================
       ABOUT
    ===================================================== */

    document.about.title = String(
      payload.about?.title || "Events at IMSEC",
    ).trim();

    document.about.description1 = String(
      payload.about?.description1 || "",
    ).trim();

    document.about.description2 = String(
      payload.about?.description2 || "",
    ).trim();

    const aboutImageFile = findFile(files, "about_image");

    if (aboutImageFile) {
      const uploaded = await uploadImage(aboutImageFile);

      await deleteCloudinaryImage(document.about.image);

      document.about.image = uploaded;
    } else if (payload.about?.removeImage) {
      await deleteCloudinaryImage(document.about.image);

      document.about.image = {};
    } else {
      document.about.image = payload.about?.image || document.about.image || {};
    }

    /* =====================================================
       PROCESS NORMAL EVENTS
    ===================================================== */

    const processEvents = async (incomingEvents, prefix, oldEvents) => {
      if (!Array.isArray(incomingEvents)) {
        return [];
      }

      const previous = Array.isArray(oldEvents) ? oldEvents : [];

      const result = [];

      for (let index = 0; index < incomingEvents.length; index++) {
        const incoming = incomingEvents[index] || {};

        const oldEvent = previous.find(
          (item) => String(item._id) === String(incoming._id),
        );

        const event = normalizeEvent(incoming);

        /*
         * Preserve MongoDB ID
         */

        if (incoming._id && mongoose.Types.ObjectId.isValid(incoming._id)) {
          event._id = incoming._id;
        }

        /* -----------------------------------------------
           IMAGE
        ----------------------------------------------- */

        const imageFile = findFile(files, `${prefix}_${index}_image`);

        if (imageFile) {
          const uploaded = await uploadImage(imageFile);

          await deleteCloudinaryImage(oldEvent?.image);

          event.image = uploaded;
        } else if (incoming.removeImage) {
          await deleteCloudinaryImage(oldEvent?.image);

          event.image = {};
        } else {
          event.image = incoming.image || oldEvent?.image || {};
        }

        /* -----------------------------------------------
           PDF LINKS
        ----------------------------------------------- */

        event.photoPdf = normalizePdfLink(incoming.photoPdf);

        event.reportPdf = normalizePdfLink(incoming.reportPdf);

        /*
         * Explicit status preservation
         */

        event.status = ALLOWED_STATUSES.includes(
          String(incoming.status || "Upcoming"),
        )
          ? String(incoming.status || "Upcoming")
          : "Upcoming";

        event.published = parseBoolean(incoming.published, true);

        event.featured = parseBoolean(incoming.featured, false);

        result.push(event);
      }

      return result;
    };

    /* =====================================================
       LATEST EVENTS
    ===================================================== */

    document.latestEvents = {
      displayCount: Math.max(
        0,
        safeNumber(payload.latestEvents?.displayCount, 6),
      ),

      events: await processEvents(
        payload.latestEvents?.events,
        "latest",
        document.latestEvents?.events,
      ),
    };

    /* =====================================================
       MEMORABLE EVENTS
    ===================================================== */

    document.memorableEvents = {
      displayCount: Math.max(
        0,
        safeNumber(payload.memorableEvents?.displayCount, 6),
      ),

      events: await processEvents(
        payload.memorableEvents?.events,
        "memorable",
        document.memorableEvents?.events,
      ),
    };

    /* =====================================================
       SIGNATURE EVENTS
    ===================================================== */

    document.signatureEvents = {
      displayCount: Math.max(
        0,
        safeNumber(payload.signatureEvents?.displayCount, 8),
      ),

      events: await processEvents(
        payload.signatureEvents?.events,
        "signature",
        document.signatureEvents?.events,
      ),
    };

    /* =====================================================
       FEATURED EVENT
    ===================================================== */

    if (payload.featuredEvent) {
      const incoming = payload.featuredEvent;

      const oldFeatured = document.featuredEvent;

      const featured = normalizeEvent(incoming);

      const featuredImageFile = findFile(files, "featured_image");

      if (featuredImageFile) {
        const uploaded = await uploadImage(featuredImageFile);

        await deleteCloudinaryImage(oldFeatured?.image);

        featured.image = uploaded;
      } else if (incoming.removeImage) {
        await deleteCloudinaryImage(oldFeatured?.image);

        featured.image = {};
      } else {
        featured.image = incoming.image || oldFeatured?.image || {};
      }

      featured.photoPdf = normalizePdfLink(incoming.photoPdf);

      featured.reportPdf = normalizePdfLink(incoming.reportPdf);

      featured.status = ALLOWED_STATUSES.includes(
        String(incoming.status || "Upcoming"),
      )
        ? String(incoming.status || "Upcoming")
        : "Upcoming";

      featured.featured = true;

      featured.published = parseBoolean(incoming.published, true);

      if (incoming._id && mongoose.Types.ObjectId.isValid(incoming._id)) {
        featured._id = incoming._id;
      }

      document.featuredEvent = featured;
    } else {
      document.featuredEvent = null;
    }

    /* =====================================================
       STATISTICS
    ===================================================== */

    document.statistics = {
      eventsEveryYear: String(
        payload.statistics?.eventsEveryYear || "200+",
      ).trim(),

      participants: String(
        payload.statistics?.participants || "15,000+",
      ).trim(),

      industrySpeakers: String(
        payload.statistics?.industrySpeakers || "500+",
      ).trim(),

      studentClubs: String(payload.statistics?.studentClubs || "50+").trim(),
    };

    /* =====================================================
       CTA
    ===================================================== */

    document.cta = {
      title: String(payload.cta?.title || "Be a Part of IMSEC Events").trim(),

      description: String(payload.cta?.description || "").trim(),

      buttonText: String(payload.cta?.buttonText || "Explore Events").trim(),

      buttonLink: String(payload.cta?.buttonLink || "/events").trim(),
    };

    await document.save();

    const freshDocument = await Event.findOne({
      singletonKey: "events-page",
    });

    return res.status(200).json({
      success: true,
      message: "Events updated successfully.",
      data: normalizePage(freshDocument),
    });
  } catch (error) {
    console.error("UPDATE EVENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to update events.",
    });
  }
};

/* =========================================================
   DELETE EVENT
========================================================= */

export const deleteEvent = async (req, res) => {
  try {
    const { section, eventId } = req.params;

    // console.log("DELETE EVENT:", section, eventId);

    const sectionKey = SECTION_MAP[section];

    if (!sectionKey) {
      return res.status(400).json({
        success: false,
        message: "Invalid event section.",
      });
    }

    if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID.",
      });
    }

    const document = await Event.findOne({
      singletonKey: "events-page",
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Events page document not found.",
      });
    }

    const events = document[sectionKey]?.events || [];

    const index = events.findIndex(
      (event) => String(event._id) === String(eventId),
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    const event = events[index];

    /*
     * Delete only image from Cloudinary.
     * PDF URLs require no deletion.
     */

    await deleteCloudinaryImage(event.image);

    /*
     * Remove exact event.
     */

    document[sectionKey].events = events.filter(
      (item) => String(item._id) !== String(eventId),
    );

    await document.save();

    const freshDocument = await Event.findOne({
      singletonKey: "events-page",
    });

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully.",
      data: normalizePage(freshDocument),
    });
  } catch (error) {
    console.error("DELETE EVENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to delete event.",
    });
  }
};

/* =========================================================
   DELETE FEATURED EVENT
========================================================= */

export const deleteFeaturedEvent = async (req, res) => {
  try {
    const document = await Event.findOne({
      singletonKey: "events-page",
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Events page document not found.",
      });
    }

    await deleteCloudinaryImage(document.featuredEvent?.image);

    document.featuredEvent = null;

    await document.save();

    const freshDocument = await Event.findOne({
      singletonKey: "events-page",
    });

    return res.status(200).json({
      success: true,
      message: "Featured event deleted successfully.",
      data: normalizePage(freshDocument),
    });
  } catch (error) {
    console.error("DELETE FEATURED EVENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to delete featured event.",
    });
  }
};

/* =========================================================
   RESET EVENTS DEFAULTS
========================================================= */

export const resetEventsDefaults = async (req, res) => {
  try {
    const document = await Event.findOne({
      singletonKey: "events-page",
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Events page document not found.",
      });
    }

    /*
     * Delete all Cloudinary images.
     */

    const allSections = ["latestEvents", "memorableEvents", "signatureEvents"];

    for (const sectionKey of allSections) {
      const events = document[sectionKey]?.events || [];

      for (const event of events) {
        await deleteCloudinaryImage(event.image);
      }
    }

    await deleteCloudinaryImage(document.about?.image);

    await deleteCloudinaryImage(document.featuredEvent?.image);

    /*
     * Restore defaults.
     */

    document.hero = {
      ...DEFAULT_DATA.hero,
    };

    document.about = {
      ...DEFAULT_DATA.about,
    };

    document.featuredEvent = null;

    document.latestEvents = {
      displayCount: 6,
      events: [],
    };

    document.memorableEvents = {
      displayCount: 6,
      events: [],
    };

    document.signatureEvents = {
      displayCount: 8,
      events: [],
    };

    document.statistics = {
      ...DEFAULT_DATA.statistics,
    };

    document.cta = {
      ...DEFAULT_DATA.cta,
    };

    await document.save();

    const freshDocument = await Event.findOne({
      singletonKey: "events-page",
    });

    return res.status(200).json({
      success: true,
      message: "Events reset successfully.",
      data: normalizePage(freshDocument),
    });
  } catch (error) {
    console.error("RESET EVENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to reset events.",
    });
  }
};
