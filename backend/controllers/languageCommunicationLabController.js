import LanguageCommunicationLab from "../models/LanguageCommunicationLab.js";
import cloudinary5 from "../config/cloudinaryConfig5.js";

const DEFAULT_LANGUAGE_COMMUNICATION_LAB_DATA = {
  singletonKey: "language-communication-lab",

  hero: {
    title: "Language & Communication Lab",
    subtitle:
      "Developing effective communication and language skills for academic and professional growth",
    breadcrumb: "Home / Life @ IMSEC / Language & Communication Lab",
    image: {},
  },

  about: {
    title: "Language & Communication Lab",
    description:
      "The Language & Communication Lab at IMSEC provides students with a supportive environment to improve their communication, language and presentation skills. The lab helps students develop confidence and effective communication abilities required for academic and professional success.",
    image: {},
  },

  features: [
    {
      title: "Communication Skills",
      description:
        "Students develop effective verbal and written communication skills through guided learning activities.",
    },
    {
      title: "Language Development",
      description:
        "The lab supports improvement in language proficiency, vocabulary and overall language usage.",
    },
    {
      title: "Presentation Skills",
      description:
        "Students get opportunities to improve their presentation, speaking and public communication abilities.",
    },
    {
      title: "Confidence Building",
      description:
        "Regular communication activities help students build confidence for academic and professional interactions.",
    },
  ],

  cta: {
    title: "Enhancing Communication Skills",
    description:
      "The lab supports students in developing language proficiency, communication skills, confidence and professional presentation abilities.",
  },
};

// Get public data
export const getLanguageCommunicationLab = async (req, res) => {
  try {
    let data = await LanguageCommunicationLab.findOne({
      singletonKey: "language-communication-lab",
    }).lean();

    if (!data) {
      data = await LanguageCommunicationLab.create(
        DEFAULT_LANGUAGE_COMMUNICATION_LAB_DATA,
      );

      data = data.toObject();
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get Language Communication Lab Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load Language & Communication Lab data",
    });
  }
};

// Get admin data
export const getLanguageCommunicationLabAdmin = async (req, res) => {
  try {
    let data = await LanguageCommunicationLab.findOne({
      singletonKey: "language-communication-lab",
    });

    if (!data) {
      data = await LanguageCommunicationLab.create(
        DEFAULT_LANGUAGE_COMMUNICATION_LAB_DATA,
      );
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get Language Communication Lab Admin Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load admin data",
    });
  }
};

// Upload image to Cloudinary
const uploadImage = async (file, folder) => {
  if (!file) return null;

  const result = await cloudinary5.uploader.upload(file.path, {
    folder,
    resource_type: "image",
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
};

// Delete image from Cloudinary
const deleteImage = async (publicId) => {
  if (!publicId) return;

  try {
    await cloudinary5.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error.message);
  }
};

// Update data
export const updateLanguageCommunicationLab = async (req, res) => {
  try {
    let data = {};

    if (req.body.data) {
      try {
        data = JSON.parse(req.body.data);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid data format",
        });
      }
    }

    let existing = await LanguageCommunicationLab.findOne({
      singletonKey: "language-communication-lab",
    });

    if (!existing) {
      existing = await LanguageCommunicationLab.create(
        DEFAULT_LANGUAGE_COMMUNICATION_LAB_DATA,
      );
    }

    const folder = "life-imsec/language-communication-lab";

    // Hero image
    const heroImageFile = req.files?.find(
      (file) => file.fieldname === "heroImage",
    );

    if (heroImageFile) {
      const uploaded = await uploadImage(heroImageFile, folder);

      if (existing.hero?.image?.publicId) {
        await deleteImage(existing.hero.image.publicId);
      }

      data.hero = {
        ...(data.hero || {}),
        image: uploaded,
      };
    }

    // About image
    const aboutImageFile = req.files?.find(
      (file) => file.fieldname === "aboutImage",
    );

    if (aboutImageFile) {
      const uploaded = await uploadImage(aboutImageFile, folder);

      if (existing.about?.image?.publicId) {
        await deleteImage(existing.about.image.publicId);
      }

      data.about = {
        ...(data.about || {}),
        image: uploaded,
      };
    }

    const updated = await LanguageCommunicationLab.findOneAndUpdate(
      {
        singletonKey: "language-communication-lab",
      },
      {
        $set: data,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      message: "Language & Communication Lab updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update Language Communication Lab Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to update Language & Communication Lab",
    });
  }
};

// Reset to default data
export const resetLanguageCommunicationLabDefaults = async (req, res) => {
  try {
    const existing = await LanguageCommunicationLab.findOne({
      singletonKey: "language-communication-lab",
    });

    if (existing) {
      if (existing.hero?.image?.publicId) {
        await deleteImage(existing.hero.image.publicId);
      }

      if (existing.about?.image?.publicId) {
        await deleteImage(existing.about.image.publicId);
      }
    }

    const data = await LanguageCommunicationLab.findOneAndUpdate(
      {
        singletonKey: "language-communication-lab",
      },
      DEFAULT_LANGUAGE_COMMUNICATION_LAB_DATA,
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    res.status(200).json({
      success: true,
      message: "Language & Communication Lab restored to default data",
      data,
    });
  } catch (error) {
    console.error("Reset Language Communication Lab Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to restore default data",
    });
  }
};
