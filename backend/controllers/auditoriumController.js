import Auditorium from "../models/Auditorium.js";
import cloudinary5 from "../config/cloudinaryConfig5.js";

/*
|--------------------------------------------------------------------------
| Default Auditorium Data
|--------------------------------------------------------------------------
| These defaults are automatically created when no Auditorium document
| exists in MongoDB.
|
| Admin can edit all text and replace all images later.
|--------------------------------------------------------------------------
*/

const DEFAULT_AUDITORIUM_DATA = {
  singletonKey: "auditorium",

  hero: {
    title: "Auditorium",
    breadcrumb: "Home / Life @ IMSEC / Auditorium",
    image: {
      url: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1600&q=85",
      publicId: "",
    },
  },

  introduction: {
    tag: "LIFE @ IMSEC",
    title: "A Space for",
    highlight: "Ideas & Events",

    description1:
      "The auditorium at IMS Engineering College provides a modern and well-equipped venue for academic, cultural and institutional events.",

    description2:
      "It serves as a central gathering space for students, faculty and guests for seminars, conferences, workshops, cultural programmes and other important events.",

    image: {
      url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1400&q=85",
      publicId: "",
    },
  },

  /*
  |--------------------------------------------------------------------------
  | Features
  |--------------------------------------------------------------------------
  */

  features: [
    {
      icon: "FaUsers",
      title: "Spacious Seating",
      description:
        "A comfortable seating arrangement designed to accommodate large gatherings and institutional programmes.",
    },
    {
      icon: "FaMicrophone",
      title: "Modern Audio System",
      description:
        "Audio facilities support lectures, seminars, conferences, cultural programmes and presentations.",
    },
    {
      icon: "FaVideo",
      title: "Visual Presentation",
      description:
        "Presentation and display facilities help deliver engaging academic and professional programmes.",
    },
    {
      icon: "FaLightbulb",
      title: "Stage Lighting",
      description:
        "Professional lighting arrangements enhance academic, cultural and ceremonial events.",
    },
  ],

  /*
  |--------------------------------------------------------------------------
  | Facilities
  |--------------------------------------------------------------------------
  */

  facilities: [
    {
      icon: "FaChair",
      title: "Comfortable Seating",
      description:
        "Well-arranged seating provides a comfortable experience for students, faculty members and guests.",
    },
    {
      icon: "FaMicrophone",
      title: "Sound System",
      description:
        "Suitable audio equipment supports speeches, lectures, performances and presentations.",
    },
    {
      icon: "FaDesktop",
      title: "Presentation Support",
      description:
        "Presentation facilities are available for seminars, workshops, conferences and academic activities.",
    },
    {
      icon: "FaLightbulb",
      title: "Stage Lighting",
      description:
        "Lighting facilities provide suitable illumination for different types of programmes.",
    },
    {
      icon: "FaFan",
      title: "Air Conditioned",
      description:
        "A comfortable indoor environment supports long-duration academic and institutional programmes.",
    },
    {
      icon: "FaShieldAlt",
      title: "Safe Environment",
      description:
        "The venue is maintained to provide a safe and organized environment for institutional activities.",
    },
  ],

  /*
  |--------------------------------------------------------------------------
  | Gallery
  |--------------------------------------------------------------------------
  */

  gallery: [
    {
      url: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&q=85",
      publicId: "",
    },
    {
      url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=85",
      publicId: "",
    },
    {
      url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=85",
      publicId: "",
    },
    {
      url: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&q=85",
      publicId: "",
    },
    {
      url: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=85",
      publicId: "",
    },
    {
      url: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&q=85",
      publicId: "",
    },
  ],

  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  statistics: [
    {
      value: "500+",
      label: "Seating Capacity",
      icon: "FaUsers",
    },
    {
      value: "100+",
      label: "Events Every Year",
      icon: "FaCalendarAlt",
    },
    {
      value: "24×7",
      label: "Institutional Support",
      icon: "FaHeadset",
    },
    {
      value: "1",
      label: "Central Auditorium",
      icon: "FaBuilding",
    },
  ],

  /*
  |--------------------------------------------------------------------------
  | Uses
  |--------------------------------------------------------------------------
  */

  uses: [
    "Seminars and Conferences",
    "Technical Workshops",
    "Guest Lectures",
    "Cultural Programmes",
    "Annual Functions",
    "Orientation Programmes",
    "Convocation Events",
    "Student Activities",
    "Faculty Development Programmes",
    "Institutional Meetings",
  ],

  /*
  |--------------------------------------------------------------------------
  | Rules
  |--------------------------------------------------------------------------
  */

  rules: [
    "The auditorium should be booked in advance through the designated authority.",
    "Users must maintain cleanliness and discipline inside the auditorium.",
    "Food and beverages should not be consumed inside the auditorium unless specifically permitted.",
    "Audio and visual equipment should be operated only by authorized personnel.",
    "Any damage to auditorium property may be subject to institutional recovery procedures.",
    "Students must follow the instructions of faculty coordinators during events.",
    "The auditorium should be left clean and organized after every programme.",
    "Emergency exits and safety equipment must remain accessible at all times.",
  ],

  /*
  |--------------------------------------------------------------------------
  | FAQs
  |--------------------------------------------------------------------------
  */

  faqs: [
    {
      question: "What type of events can be organized in the auditorium?",
      answer:
        "The auditorium can be used for seminars, conferences, workshops, cultural programmes, orientation programmes, guest lectures, meetings and other institutional activities.",
    },
    {
      question: "Can students use the auditorium?",
      answer:
        "Yes. Students can use the auditorium for approved academic, cultural and institutional activities under the guidance of the concerned faculty or coordinator.",
    },
    {
      question: "Is advance booking required?",
      answer:
        "Yes. Events should be scheduled and the auditorium should be booked in advance through the appropriate institutional authority.",
    },
    {
      question: "Are audio and presentation facilities available?",
      answer:
        "The auditorium provides facilities to support audio communication and visual presentations for institutional programmes.",
    },
  ],

  /*
  |--------------------------------------------------------------------------
  | Call To Action
  |--------------------------------------------------------------------------
  */

  cta: {
    title: "A Venue for Every Occasion",
    description:
      "The IMSEC auditorium provides the perfect environment for learning, collaboration, celebration and memorable institutional events.",
  },
};

/*
|--------------------------------------------------------------------------
| Helper: Delete Cloudinary Image
|--------------------------------------------------------------------------
*/

const deleteCloudinaryImage = async (publicId) => {
  if (!publicId) return;

  try {
    await cloudinary5.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error?.message || error);
  }
};

/*
|--------------------------------------------------------------------------
| Helper: Upload Image
|--------------------------------------------------------------------------
*/

const uploadImage = async (file, folder = "life-imsec/auditorium") => {
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

/*
|--------------------------------------------------------------------------
| PUBLIC - Get Auditorium
|--------------------------------------------------------------------------
| GET /api/auditorium
|--------------------------------------------------------------------------
*/

export const getAuditorium = async (req, res) => {
  try {
    let auditorium = await Auditorium.findOne({
      singletonKey: "auditorium",
    });

    /*
    |--------------------------------------------------------------------------
    | Create default document automatically
    |--------------------------------------------------------------------------
    */

    if (!auditorium) {
      auditorium = await Auditorium.create(DEFAULT_AUDITORIUM_DATA);
    }

    return res.status(200).json({
      success: true,
      data: auditorium,
    });
  } catch (error) {
    console.error("Get Auditorium Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch auditorium data",
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| ADMIN - Get Auditorium
|--------------------------------------------------------------------------
| GET /api/auditorium/admin
|--------------------------------------------------------------------------
*/

export const getAuditoriumAdmin = async (req, res) => {
  try {
    let auditorium = await Auditorium.findOne({
      singletonKey: "auditorium",
    });

    if (!auditorium) {
      auditorium = await Auditorium.create(DEFAULT_AUDITORIUM_DATA);
    }

    return res.status(200).json({
      success: true,
      data: auditorium,
    });
  } catch (error) {
    console.error("Get Auditorium Admin Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch auditorium data",
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| ADMIN - Update Auditorium
|--------------------------------------------------------------------------
| PUT /api/auditorium/admin
|
| Supports:
| - Text updates
| - Hero image
| - Introduction image
| - Gallery images
|--------------------------------------------------------------------------
*/

export const updateAuditorium = async (req, res) => {
  try {
    let data = req.body.data;

    /*
    |--------------------------------------------------------------------------
    | Parse JSON data
    |--------------------------------------------------------------------------
    */

    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid auditorium data JSON",
        });
      }
    }

    if (!data || typeof data !== "object") {
      return res.status(400).json({
        success: false,
        message: "Auditorium data is required",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Find existing document
    |--------------------------------------------------------------------------
    */

    let auditorium = await Auditorium.findOne({
      singletonKey: "auditorium",
    });

    if (!auditorium) {
      auditorium = await Auditorium.create(DEFAULT_AUDITORIUM_DATA);
    }

    /*
    |--------------------------------------------------------------------------
    | Image Files
    |--------------------------------------------------------------------------
    */

    const files = req.files || [];

    const getFile = (fieldName) => {
      return files.find((file) => file.fieldname === fieldName);
    };

    /*
    |--------------------------------------------------------------------------
    | HERO IMAGE
    |--------------------------------------------------------------------------
    */

    const heroImageFile = getFile("heroImage");

    if (heroImageFile) {
      const newImage = await uploadImage(heroImageFile);

      if (auditorium.hero?.image?.publicId) {
        await deleteCloudinaryImage(auditorium.hero.image.publicId);
      }

      data.hero = {
        ...(data.hero || {}),
        image: newImage,
      };
    }

    /*
    |--------------------------------------------------------------------------
    | INTRODUCTION IMAGE
    |--------------------------------------------------------------------------
    */

    const introductionImageFile = getFile("introductionImage");

    if (introductionImageFile) {
      const newImage = await uploadImage(introductionImageFile);

      if (auditorium.introduction?.image?.publicId) {
        await deleteCloudinaryImage(auditorium.introduction.image.publicId);
      }

      data.introduction = {
        ...(data.introduction || {}),
        image: newImage,
      };
    }

    /*
    |--------------------------------------------------------------------------
    | GALLERY IMAGES
    |--------------------------------------------------------------------------
    |
    | Admin frontend sends:
    |
    | galleryImage_0
    | galleryImage_1
    | galleryImage_2
    |
    |--------------------------------------------------------------------------
    */

    const galleryData = Array.isArray(data.gallery) ? [...data.gallery] : [];

    for (const file of files) {
      if (!file.fieldname.startsWith("galleryImage_")) {
        continue;
      }

      const indexString = file.fieldname.replace("galleryImage_", "");

      const index = Number(indexString);

      if (Number.isNaN(index)) continue;

      const newImage = await uploadImage(file);

      /*
      |--------------------------------------------------------------------------
      | Delete old Cloudinary image
      |--------------------------------------------------------------------------
      */

      const oldImage = auditorium.gallery?.[index];

      if (oldImage?.publicId) {
        await deleteCloudinaryImage(oldImage.publicId);
      }

      galleryData[index] = newImage;
    }

    data.gallery = galleryData;

    /*
    |--------------------------------------------------------------------------
    | Update Document
    |--------------------------------------------------------------------------
    */

    data.singletonKey = "auditorium";

    auditorium.set(data);

    await auditorium.save();

    /*
    |--------------------------------------------------------------------------
    | Return Updated Data
    |--------------------------------------------------------------------------
    */

    return res.status(200).json({
      success: true,
      message: "Auditorium updated successfully",
      data: auditorium,
    });
  } catch (error) {
    console.error("Update Auditorium Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update auditorium",
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| ADMIN - Reset Auditorium
|--------------------------------------------------------------------------
| POST /api/auditorium/admin/reset-defaults
|--------------------------------------------------------------------------
*/

export const resetAuditoriumDefaults = async (req, res) => {
  try {
    const auditorium = await Auditorium.findOne({
      singletonKey: "auditorium",
    });

    /*
    |--------------------------------------------------------------------------
    | Delete Admin Uploaded Cloudinary Images
    |--------------------------------------------------------------------------
    */

    if (auditorium) {
      /*
      | Hero
      */

      if (auditorium.hero?.image?.publicId) {
        await deleteCloudinaryImage(auditorium.hero.image.publicId);
      }

      /*
      | Introduction
      */

      if (auditorium.introduction?.image?.publicId) {
        await deleteCloudinaryImage(auditorium.introduction.image.publicId);
      }

      /*
      | Gallery
      */

      if (Array.isArray(auditorium.gallery)) {
        for (const image of auditorium.gallery) {
          if (image?.publicId) {
            await deleteCloudinaryImage(image.publicId);
          }
        }
      }

      await Auditorium.deleteOne({
        singletonKey: "auditorium",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Re-create defaults
    |--------------------------------------------------------------------------
    */

    const defaultAuditorium = await Auditorium.create(DEFAULT_AUDITORIUM_DATA);

    return res.status(200).json({
      success: true,
      message: "Auditorium restored to default data",
      data: defaultAuditorium,
    });
  } catch (error) {
    console.error("Reset Auditorium Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to restore auditorium defaults",
      error: error.message,
    });
  }
};
