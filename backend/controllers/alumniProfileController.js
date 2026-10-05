import AlumniProfile from "../models/AlumniProfile.js";
import cloudinary from "../config/cloudinaryConfig.js";
import fs from "fs";

/* =========================================================
   CONSTANTS
========================================================= */

const SINGLETON_KEY = "imsec-alumni";

/* =========================================================
   DEFAULT DATA
========================================================= */

const getDefaultAlumniProfile = () => ({
  singletonKey: SINGLETON_KEY,

  hero: {
    title: "IMSEC Alumni",
    subtitle: "Connecting the IMSEC family beyond the campus",
    breadcrumb: "Home / Alumni",
    buttonText: "Join Alumni Network",
    buttonLink: "#alumni-network",
    image: {},
  },

  about: {
    title: "IMSEC Alumni Network",
    subtitle: "A lifelong connection between IMSEC and its alumni",
    description1: "",
    description2: "",
    image: {},
    buttonText: "Know More",
    buttonLink: "",
  },

  statistics: {
    totalAlumni: "10,000+",
    successfulAlumni: "8,000+",
    countries: "20+",
    industryLeaders: "500+",
    alumniEvents: "100+",
    alumniChapters: "15+",
  },

  featuredAlumni: {
    displayCount: 6,
    profiles: [],
  },

  achievements: {
    displayCount: 6,
    items: [],
  },

  successStories: {
    displayCount: 6,
    items: [],
  },

  testimonials: {
    displayCount: 6,
    items: [],
  },

  events: {
    displayCount: 6,
    events: [],
  },

  chapters: {
    displayCount: 6,
    items: [],
  },

  network: {
    title: "Stay Connected With IMSEC",
    subtitle: "Your connection with IMSEC continues for life.",
    description: "",
    email: "",
    phone: "",
    linkedin: "",
    facebook: "",
    instagram: "",
    whatsapp: "",
    registrationText: "Join Alumni Network",
    registrationLink: "/alumni/registration",
    loginText: "Alumni Login",
    loginLink: "/alumni/login",
  },

  mentorship: {
    title: "Alumni Mentorship",
    description: "",
    buttonText: "Become a Mentor",
    buttonLink: "/contact-us",
    image: {},
  },

  contribution: {
    title: "Give Back to Your Alma Mater",
    description: "",
    buttonText: "Connect With IMSEC",
    buttonLink: "/contact-us",
  },

  cta: {
    title: "Be Part of the IMSEC Alumni Family",
    description: "",
    buttonText: "Join Alumni Network",
    buttonLink: "/alumni/registration",
  },
});

/* =========================================================
   FILE CLEANUP
========================================================= */

const removeTempFile = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error("Temporary file cleanup error:", error.message);
  }
};

/* =========================================================
   UPLOAD IMAGE TO CLOUDINARY
========================================================= */

const uploadImage = async (file, folder = "alumni-page") => {
  if (!file) {
    return {};
  }

  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder,
      resource_type: "image",
    });

    return {
      url: result.secure_url || result.url || "",
      publicId: result.public_id || "",
      fileName: file.originalname || "",
      fileType: file.mimetype || "",
    };
  } finally {
    removeTempFile(file.path);
  }
};

/* =========================================================
   DELETE CLOUDINARY IMAGE
========================================================= */

const deleteCloudinaryImage = async (image) => {
  if (!image?.publicId) {
    return;
  }

  try {
    await cloudinary.uploader.destroy(image.publicId);
  } catch (error) {
    console.error("Cloudinary image delete error:", error?.message || error);
  }
};

/* =========================================================
   FIND SINGLETON / CREATE DEFAULT
========================================================= */

const getOrCreateAlumniProfile = async () => {
  let profile = await AlumniProfile.findOne({
    singletonKey: SINGLETON_KEY,
  });

  if (!profile) {
    profile = await AlumniProfile.create(getDefaultAlumniProfile());
  }

  return profile;
};

/* =========================================================
   SAFE JSON PARSER
========================================================= */

const parseJson = (value, fallback = null) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  if (typeof value === "object") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
};

/* =========================================================
   DISPLAY COUNT
========================================================= */

const normalizeDisplayCount = (value, fallback = 6) => {
  const number = Number(value);

  if (!Number.isFinite(number) || number < 0) {
    return fallback;
  }

  return Math.floor(number);
};

/* =========================================================
   GET PUBLIC ALUMNI PROFILE
========================================================= */

export const getAlumniProfile = async (req, res) => {
  try {
    const profile = await getOrCreateAlumniProfile();

    const data = profile.toObject();

    /* -----------------------------------------------
       Featured Alumni
    ------------------------------------------------ */

    if (data.featuredAlumni) {
      const count = normalizeDisplayCount(data.featuredAlumni.displayCount, 6);

      data.featuredAlumni.profiles = (data.featuredAlumni.profiles || [])
        .filter((item) => item.published !== false)
        .filter((item) => item.featured !== false)
        .slice(0, count);
    }

    /* -----------------------------------------------
       Achievements
    ------------------------------------------------ */

    if (data.achievements) {
      const count = normalizeDisplayCount(data.achievements.displayCount, 6);

      data.achievements.items = (data.achievements.items || [])
        .filter((item) => item.published !== false)
        .slice(0, count);
    }

    /* -----------------------------------------------
       Success Stories
    ------------------------------------------------ */

    if (data.successStories) {
      const count = normalizeDisplayCount(data.successStories.displayCount, 6);

      data.successStories.items = (data.successStories.items || [])
        .filter((item) => item.published !== false)
        .slice(0, count);
    }

    /* -----------------------------------------------
       Testimonials
    ------------------------------------------------ */

    if (data.testimonials) {
      const count = normalizeDisplayCount(data.testimonials.displayCount, 6);

      data.testimonials.items = (data.testimonials.items || [])
        .filter((item) => item.published !== false)
        .slice(0, count);
    }

    /* -----------------------------------------------
       Events
    ------------------------------------------------ */

    if (data.events) {
      const count = normalizeDisplayCount(data.events.displayCount, 6);

      data.events.events = (data.events.events || [])
        .filter((item) => item.published !== false)
        .slice(0, count);
    }

    /* -----------------------------------------------
       Chapters
    ------------------------------------------------ */

    if (data.chapters) {
      const count = normalizeDisplayCount(data.chapters.displayCount, 6);

      data.chapters.items = (data.chapters.items || [])
        .filter((item) => item.published !== false)
        .slice(0, count);
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get Alumni Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch Alumni Profile",
      error: error.message,
    });
  }
};

/* =========================================================
   GET ADMIN ALUMNI PROFILE
========================================================= */

export const getAlumniProfileAdmin = async (req, res) => {
  try {
    const profile = await getOrCreateAlumniProfile();

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("Get Alumni Profile Admin Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch Alumni Profile",
      error: error.message,
    });
  }
};

/* =========================================================
   PROCESS TOP-LEVEL IMAGES
========================================================= */

const processTopLevelImages = async (payload, files) => {
  const result = {
    ...payload,
  };

  const fileMap = {};

  for (const file of files || []) {
    if (!file?.fieldname) continue;

    fileMap[file.fieldname] = file;
  }

  /* -----------------------------------------------
     HERO IMAGE
  ------------------------------------------------ */

  if (fileMap.heroImage) {
    const oldImage = result.hero?.image || {};

    const newImage = await uploadImage(fileMap.heroImage, "alumni-page/hero");

    if (oldImage.publicId) {
      await deleteCloudinaryImage(oldImage);
    }

    result.hero = {
      ...(result.hero || {}),
      image: newImage,
    };
  }

  /* -----------------------------------------------
     ABOUT IMAGE
  ------------------------------------------------ */

  if (fileMap.aboutImage) {
    const oldImage = result.about?.image || {};

    const newImage = await uploadImage(fileMap.aboutImage, "alumni-page/about");

    if (oldImage.publicId) {
      await deleteCloudinaryImage(oldImage);
    }

    result.about = {
      ...(result.about || {}),
      image: newImage,
    };
  }

  /* -----------------------------------------------
     MENTORSHIP IMAGE
  ------------------------------------------------ */

  if (fileMap.mentorshipImage) {
    const oldImage = result.mentorship?.image || {};

    const newImage = await uploadImage(
      fileMap.mentorshipImage,
      "alumni-page/mentorship",
    );

    if (oldImage.publicId) {
      await deleteCloudinaryImage(oldImage);
    }

    result.mentorship = {
      ...(result.mentorship || {}),
      image: newImage,
    };
  }

  return result;
};

/* =========================================================
   PROCESS INDIVIDUAL ALUMNI PHOTOS
========================================================= */

/*
  The admin page can send fields such as:

  featuredAlumniImage_0
  featuredAlumniImage_1

  achievementsImage_0
  achievementsImage_1

  successStoriesImage_0
  successStoriesImage_1

  testimonialsImage_0
  testimonialsImage_1

  eventsImage_0
  eventsImage_1

  chaptersImage_0
  chaptersImage_1
*/

const processArrayImages = async (payload, files) => {
  const result = {
    ...payload,
  };

  for (const file of files || []) {
    if (!file?.fieldname) {
      continue;
    }

    const fieldName = file.fieldname;

    /* =====================================================
       FEATURED ALUMNI
    ===================================================== */

    let match = fieldName.match(/^featuredAlumniImage_(\d+)$/);

    if (match) {
      const index = Number(match[1]);

      if (
        result.featuredAlumni?.profiles &&
        result.featuredAlumni.profiles[index]
      ) {
        const oldImage = result.featuredAlumni.profiles[index].image || {};

        const newImage = await uploadImage(file, "alumni-page/featured-alumni");

        if (oldImage.publicId) {
          await deleteCloudinaryImage(oldImage);
        }

        result.featuredAlumni.profiles[index].image = newImage;
      }

      continue;
    }

    /* =====================================================
       ACHIEVEMENTS
    ===================================================== */

    match = fieldName.match(/^achievementsImage_(\d+)$/);

    if (match) {
      const index = Number(match[1]);

      if (result.achievements?.items && result.achievements.items[index]) {
        const oldImage = result.achievements.items[index].image || {};

        const newImage = await uploadImage(file, "alumni-page/achievements");

        if (oldImage.publicId) {
          await deleteCloudinaryImage(oldImage);
        }

        result.achievements.items[index].image = newImage;
      }

      continue;
    }

    /* =====================================================
       SUCCESS STORIES
    ===================================================== */

    match = fieldName.match(/^successStoriesImage_(\d+)$/);

    if (match) {
      const index = Number(match[1]);

      if (result.successStories?.items && result.successStories.items[index]) {
        const oldImage = result.successStories.items[index].image || {};

        const newImage = await uploadImage(file, "alumni-page/success-stories");

        if (oldImage.publicId) {
          await deleteCloudinaryImage(oldImage);
        }

        result.successStories.items[index].image = newImage;
      }

      continue;
    }

    /* =====================================================
       TESTIMONIALS
    ===================================================== */

    match = fieldName.match(/^testimonialsImage_(\d+)$/);

    if (match) {
      const index = Number(match[1]);

      if (result.testimonials?.items && result.testimonials.items[index]) {
        const oldImage = result.testimonials.items[index].image || {};

        const newImage = await uploadImage(file, "alumni-page/testimonials");

        if (oldImage.publicId) {
          await deleteCloudinaryImage(oldImage);
        }

        result.testimonials.items[index].image = newImage;
      }

      continue;
    }

    /* =====================================================
       EVENTS
    ===================================================== */

    match = fieldName.match(/^eventsImage_(\d+)$/);

    if (match) {
      const index = Number(match[1]);

      if (result.events?.events && result.events.events[index]) {
        const oldImage = result.events.events[index].image || {};

        const newImage = await uploadImage(file, "alumni-page/events");

        if (oldImage.publicId) {
          await deleteCloudinaryImage(oldImage);
        }

        result.events.events[index].image = newImage;
      }

      continue;
    }

    /* =====================================================
       CHAPTERS
    ===================================================== */

    match = fieldName.match(/^chaptersImage_(\d+)$/);

    if (match) {
      const index = Number(match[1]);

      if (result.chapters?.items && result.chapters.items[index]) {
        const oldImage = result.chapters.items[index].image || {};

        const newImage = await uploadImage(file, "alumni-page/chapters");

        if (oldImage.publicId) {
          await deleteCloudinaryImage(oldImage);
        }

        result.chapters.items[index].image = newImage;
      }

      continue;
    }
  }

  return result;
};

/* =========================================================
   UPDATE ALUMNI PROFILE
========================================================= */

export const updateAlumniProfile = async (req, res) => {
  const uploadedFiles = req.files || [];

  try {
    /*
     * IMPORTANT:
     *
     * Admin frontend sends:
     *
     * formData.append("data", JSON.stringify(jsonData))
     *
     * So we MUST read req.body.data first.
     */

    let payload = parseJson(req.body?.data, null);

    /*
     * Fallback for normal JSON/body requests.
     */

    if (!payload) {
      payload = {
        ...req.body,
      };
    }

    /*
     * Remove fields that should never be saved.
     */

    delete payload._id;
    delete payload.__v;
    delete payload.createdAt;
    delete payload.updatedAt;

    payload.singletonKey = SINGLETON_KEY;

    /* =====================================================
       PARSE NESTED JSON FIELDS IF REQUIRED
    ===================================================== */

    const jsonFields = [
      "hero",
      "about",
      "statistics",
      "featuredAlumni",
      "achievements",
      "successStories",
      "testimonials",
      "events",
      "chapters",
      "network",
      "mentorship",
      "contribution",
      "cta",
    ];

    for (const field of jsonFields) {
      if (typeof payload[field] === "string") {
        const parsed = parseJson(payload[field], null);

        if (parsed !== null) {
          payload[field] = parsed;
        }
      }
    }

    /* =====================================================
       GET CURRENT DATA
    ===================================================== */

    const currentProfile = await getOrCreateAlumniProfile();

    /*
     * Convert current MongoDB document to plain object.
     */

    const currentData = currentProfile.toObject();

    /* =====================================================
       PRESERVE EXISTING IMAGES
    ===================================================== */

    /*
     * If frontend sends the complete JSON object,
     * existing images should not disappear just because
     * no new file was selected.
     */

    if (
      payload.hero &&
      !payload.hero.image?.url &&
      currentData.hero?.image?.url
    ) {
      payload.hero.image = currentData.hero.image;
    }

    if (
      payload.about &&
      !payload.about.image?.url &&
      currentData.about?.image?.url
    ) {
      payload.about.image = currentData.about.image;
    }

    if (
      payload.mentorship &&
      !payload.mentorship.image?.url &&
      currentData.mentorship?.image?.url
    ) {
      payload.mentorship.image = currentData.mentorship.image;
    }

    /* =====================================================
       PRESERVE INDIVIDUAL ALUMNI IMAGES
    ===================================================== */

    const preserveArrayImages = (newArray, oldArray) => {
      if (!Array.isArray(newArray)) {
        return newArray;
      }

      if (!Array.isArray(oldArray)) {
        return newArray;
      }

      return newArray.map((item, index) => {
        const oldItem = oldArray[index];

        if (
          item &&
          (!item.image?.url || item.image.url === "") &&
          oldItem?.image?.url
        ) {
          return {
            ...item,
            image: oldItem.image,
          };
        }

        return item;
      });
    };

    /* Featured Alumni */

    if (payload.featuredAlumni) {
      payload.featuredAlumni.profiles = preserveArrayImages(
        payload.featuredAlumni.profiles,
        currentData.featuredAlumni?.profiles,
      );
    }

    /* Achievements */

    if (payload.achievements) {
      payload.achievements.items = preserveArrayImages(
        payload.achievements.items,
        currentData.achievements?.items,
      );
    }

    /* Success Stories */

    if (payload.successStories) {
      payload.successStories.items = preserveArrayImages(
        payload.successStories.items,
        currentData.successStories?.items,
      );
    }

    /* Testimonials */

    if (payload.testimonials) {
      payload.testimonials.items = preserveArrayImages(
        payload.testimonials.items,
        currentData.testimonials?.items,
      );
    }

    /* Events */

    if (payload.events) {
      payload.events.events = preserveArrayImages(
        payload.events.events,
        currentData.events?.events,
      );
    }

    /* Chapters */

    if (payload.chapters) {
      payload.chapters.items = preserveArrayImages(
        payload.chapters.items,
        currentData.chapters?.items,
      );
    }

    /* =====================================================
       PROCESS TOP-LEVEL UPLOADS
    ===================================================== */

    payload = await processTopLevelImages(payload, uploadedFiles);

    /* =====================================================
       PROCESS INDIVIDUAL RECORD PHOTOS
    ===================================================== */

    payload = await processArrayImages(payload, uploadedFiles);

    /* =====================================================
       DISPLAY COUNTS
    ===================================================== */

    if (payload.featuredAlumni) {
      payload.featuredAlumni.displayCount = normalizeDisplayCount(
        payload.featuredAlumni.displayCount,
        6,
      );
    }

    if (payload.achievements) {
      payload.achievements.displayCount = normalizeDisplayCount(
        payload.achievements.displayCount,
        6,
      );
    }

    if (payload.successStories) {
      payload.successStories.displayCount = normalizeDisplayCount(
        payload.successStories.displayCount,
        6,
      );
    }

    if (payload.testimonials) {
      payload.testimonials.displayCount = normalizeDisplayCount(
        payload.testimonials.displayCount,
        6,
      );
    }

    if (payload.events) {
      payload.events.displayCount = normalizeDisplayCount(
        payload.events.displayCount,
        6,
      );
    }

    if (payload.chapters) {
      payload.chapters.displayCount = normalizeDisplayCount(
        payload.chapters.displayCount,
        6,
      );
    }

    /* =====================================================
       UPDATE DATABASE
    ===================================================== */

    const updatedProfile = await AlumniProfile.findOneAndUpdate(
      {
        singletonKey: SINGLETON_KEY,
      },
      {
        $set: payload,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Alumni Profile updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    /*
     * Make sure uploaded temporary files are removed if
     * something fails before they are uploaded.
     */

    for (const file of uploadedFiles) {
      if (file?.path) {
        removeTempFile(file.path);
      }
    }

    console.error("Update Alumni Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update Alumni Profile",
      error: error.message,
    });
  }
};

/* =========================================================
   RESET DEFAULTS
========================================================= */

export const resetAlumniProfile = async (req, res) => {
  try {
    const currentProfile = await AlumniProfile.findOne({
      singletonKey: SINGLETON_KEY,
    });

    /*
     * Delete existing Cloudinary page-level images.
     */

    if (currentProfile) {
      const currentData = currentProfile.toObject();

      /* Hero */

      if (currentData.hero?.image?.publicId) {
        await deleteCloudinaryImage(currentData.hero.image);
      }

      /* About */

      if (currentData.about?.image?.publicId) {
        await deleteCloudinaryImage(currentData.about.image);
      }

      /* Mentorship */

      if (currentData.mentorship?.image?.publicId) {
        await deleteCloudinaryImage(currentData.mentorship.image);
      }

      /* Featured Alumni */

      for (const item of currentData.featuredAlumni?.profiles || []) {
        if (item.image?.publicId) {
          await deleteCloudinaryImage(item.image);
        }
      }

      /* Achievements */

      for (const item of currentData.achievements?.items || []) {
        if (item.image?.publicId) {
          await deleteCloudinaryImage(item.image);
        }
      }

      /* Success Stories */

      for (const item of currentData.successStories?.items || []) {
        if (item.image?.publicId) {
          await deleteCloudinaryImage(item.image);
        }
      }

      /* Testimonials */

      for (const item of currentData.testimonials?.items || []) {
        if (item.image?.publicId) {
          await deleteCloudinaryImage(item.image);
        }
      }

      /* Events */

      for (const item of currentData.events?.events || []) {
        if (item.image?.publicId) {
          await deleteCloudinaryImage(item.image);
        }
      }

      /* Chapters */

      for (const item of currentData.chapters?.items || []) {
        if (item.image?.publicId) {
          await deleteCloudinaryImage(item.image);
        }
      }
    }

    const defaults = getDefaultAlumniProfile();

    const profile = await AlumniProfile.findOneAndUpdate(
      {
        singletonKey: SINGLETON_KEY,
      },
      {
        $set: defaults,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Alumni Profile reset successfully",
      data: profile,
    });
  } catch (error) {
    console.error("Reset Alumni Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reset Alumni Profile",
      error: error.message,
    });
  }
};

/* =========================================================
   EXPORT DEFAULTS
========================================================= */

export { getDefaultAlumniProfile };
