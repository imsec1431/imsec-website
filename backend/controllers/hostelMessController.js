import HostelMess from "../models/HostelMess.js";
import cloudinary5 from "../config/cloudinaryConfig5.js";

/* =========================================================
   DEFAULT DATA
========================================================= */

export const getDefaultHostelMessData = () => ({
  singletonKey: "hostel-mess",

  hero: {
    title: "Hostel & Mess",
    breadcrumb: "Home / Life @ IMSEC / Hostel & Mess",
  },

  about: {
    tag: "LIFE @ IMSEC",
    title: "Comfortable",
    highlight: "Hostel Living",
    description1:
      "IMSEC provides comfortable and secure hostel facilities for students coming from different parts of the country. The hostels provide a peaceful environment that supports academic growth and personal development.",
    description2:
      "Separate hostel facilities are available for boys and girls with essential amenities, hygienic surroundings, security and a supportive residential environment.",
    image: {
      url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
      publicId: "",
    },
  },

  boysHostels: [
    {
      name: "Boys Hostel - A Block",
      image: {
        url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&q=80",
        publicId: "",
      },
      capacity: "300 Students",
      description:
        "A spacious residential block designed to provide students with a comfortable and disciplined living environment.",
      facilities: [
        "24×7 Security",
        "Wi-Fi Connectivity",
        "Power Backup",
        "Common Room",
      ],
    },
    {
      name: "Boys Hostel - B Block",
      image: {
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
        publicId: "",
      },
      capacity: "250 Students",
      description:
        "Modern hostel accommodation with essential facilities and a student-friendly environment.",
      facilities: [
        "24×7 Security",
        "Wi-Fi Connectivity",
        "Laundry Facility",
        "Recreation Area",
      ],
    },
  ],

  girlsHostels: [
    {
      name: "Girls Hostel",
      image: {
        url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80",
        publicId: "",
      },
      capacity: "350 Students",
      description:
        "A safe, secure and comfortable residential facility providing a supportive environment for girl students.",
      facilities: ["24×7 Security", "Wi-Fi Connectivity", "Common Room"],
    },
  ],

  mess: {
    tag: "MESS & DINING",
    title: "Healthy &",
    highlight: "Hygienic Food",
    description:
      "The hostel mess provides nutritious, hygienic and balanced meals prepared under proper supervision. The menu includes a variety of healthy meals to meet students' nutritional needs.",
    image: {
      url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=80",
      publicId: "",
    },
    items: [
      {
        icon: "utensils",
        title: "Nutritious Meals",
        description:
          "Balanced meals prepared to support students' health and well-being.",
      },
      {
        icon: "leaf",
        title: "Fresh Ingredients",
        description:
          "Fresh and quality ingredients are used for daily meal preparation.",
      },
      {
        icon: "shield",
        title: "Hygienic Kitchen",
        description:
          "Food preparation areas are maintained with proper hygiene standards.",
      },
      {
        icon: "clock",
        title: "Timely Meals",
        description:
          "Breakfast, lunch, snacks and dinner are served according to schedule.",
      },
    ],
  },

  facilities: [
    {
      icon: "wifi",
      title: "High-Speed Wi-Fi",
      description: "Internet connectivity for academic and personal use.",
    },
    {
      icon: "shield",
      title: "24×7 Security",
      description:
        "Secure residential environment with round-the-clock security.",
    },
    {
      icon: "bolt",
      title: "Power Backup",
      description:
        "Backup power facility for uninterrupted essential services.",
    },
    {
      icon: "water",
      title: "Clean Water",
      description: "Clean and safe drinking water facilities.",
    },
    {
      icon: "bed",
      title: "Comfortable Rooms",
      description: "Well-maintained rooms with essential furniture.",
    },
    {
      icon: "tv",
      title: "Common Room",
      description: "Recreation and relaxation space for hostel residents.",
    },
    {
      icon: "shirt",
      title: "Laundry",
      description: "Laundry facilities for students' convenience.",
    },
    {
      icon: "first-aid",
      title: "Medical Support",
      description: "Basic medical assistance available when required.",
    },
  ],

  gallery: [
    {
      url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&q=80",
      publicId: "",
    },
    {
      url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
      publicId: "",
    },
    {
      url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80",
      publicId: "",
    },
    {
      url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
      publicId: "",
    },
    {
      url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=80",
      publicId: "",
    },
    {
      url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80",
      publicId: "",
    },
  ],

  weeklyMenu: [
    {
      day: "Monday",
      breakfast: "Aloo Paratha, Curd, Tea",
      lunch: "Dal, Rice, Roti, Seasonal Vegetable",
      snacks: "Tea & Biscuits",
      dinner: "Paneer, Dal, Rice, Roti, Salad",
    },
    {
      day: "Tuesday",
      breakfast: "Poha, Banana, Tea",
      lunch: "Rajma, Rice, Roti, Vegetable",
      snacks: "Samosa & Tea",
      dinner: "Mix Vegetable, Dal, Rice, Roti",
    },
    {
      day: "Wednesday",
      breakfast: "Idli, Sambar, Tea",
      lunch: "Chole, Rice, Roti, Salad",
      snacks: "Sandwich & Tea",
      dinner: "Paneer Butter Masala, Dal, Rice, Roti",
    },
    {
      day: "Thursday",
      breakfast: "Paratha, Curd, Tea",
      lunch: "Dal Makhani, Rice, Roti, Vegetable",
      snacks: "Pakora & Tea",
      dinner: "Kadhi, Rice, Roti, Vegetable",
    },
    {
      day: "Friday",
      breakfast: "Bread, Butter, Egg, Tea",
      lunch: "Dal, Rice, Roti, Vegetable",
      snacks: "Noodles & Tea",
      dinner: "Chicken/Paneer, Dal, Rice, Roti",
    },
  ],

  rules: [
    "Students must maintain cleanliness and discipline inside the hostel.",
    "Hostel timings and entry regulations must be strictly followed.",
    "Ragging in any form is strictly prohibited.",
    "Students must carry their hostel identity card.",
    "Damage to hostel property may result in recovery of the cost.",
    "Visitors are permitted only according to hostel rules.",
  ],

  statistics: [
    {
      value: "900+",
      label: "Hostel Capacity",
      icon: "users",
    },
    {
      value: "3",
      label: "Hostel Blocks",
      icon: "building",
    },
    {
      value: "24×7",
      label: "Security",
      icon: "shield",
    },
    {
      value: "100%",
      label: "Student Support",
      icon: "heart",
    },
  ],

  faqs: [
    {
      question: "Who can apply for hostel accommodation?",
      answer:
        "Eligible students enrolled at IMSEC can apply for hostel accommodation according to the availability and hostel admission rules.",
    },
    {
      question: "Are separate hostels available for boys and girls?",
      answer:
        "Yes. Separate residential facilities are provided for boys and girls.",
    },
    {
      question: "Is food provided in the hostel?",
      answer:
        "Yes. Hostel residents can use the mess facility where hygienic and nutritious meals are served according to the weekly menu.",
    },
  ],

  cta: {
    title: "Experience Comfortable Campus Living",
    description:
      "Join IMSEC and enjoy a safe, comfortable and student-friendly residential environment.",
  },
});

/* =========================================================
   HELPER FUNCTIONS
========================================================= */

const safeJsonParse = (value, fallback = {}) => {
  try {
    return typeof value === "string" ? JSON.parse(value) : value || fallback;
  } catch (error) {
    return fallback;
  }
};

const getUploadedFile = (files, fieldName) => {
  if (!Array.isArray(files)) return null;

  return files.find((file) => file.fieldname === fieldName);
};

const uploadToCloudinary = async (file) => {
  if (!file) return null;

  const result = await cloudinary5.uploader.upload(file.path, {
    folder: "life-imsec/hostel-mess",
    resource_type: "image",
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
};

const deleteCloudinaryImage = async (publicId) => {
  if (!publicId) return;

  try {
    await cloudinary5.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error.message);
  }
};

/* =========================================================
   GET PUBLIC HOSTEL & MESS
   GET /api/hostel-mess
========================================================= */

export const getHostelMess = async (req, res) => {
  try {
    let hostelMess = await HostelMess.findOne({
      singletonKey: "hostel-mess",
    });

    /*
      If CMS record does not exist,
      automatically create it using defaults.
    */

    if (!hostelMess) {
      hostelMess = await HostelMess.create(getDefaultHostelMessData());
    }

    return res.status(200).json({
      success: true,
      data: hostelMess,
    });
  } catch (error) {
    console.error("Get Hostel & Mess Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch Hostel & Mess data",
    });
  }
};

/* =========================================================
   GET ADMIN HOSTEL & MESS
   GET /api/hostel-mess/admin
========================================================= */

export const getHostelMessAdmin = async (req, res) => {
  try {
    let hostelMess = await HostelMess.findOne({
      singletonKey: "hostel-mess",
    });

    if (!hostelMess) {
      hostelMess = await HostelMess.create(getDefaultHostelMessData());
    }

    return res.status(200).json({
      success: true,
      data: hostelMess,
    });
  } catch (error) {
    console.error("Get Admin Hostel & Mess Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch Hostel & Mess data",
    });
  }
};

/* =========================================================
   UPDATE ADMIN HOSTEL & MESS
   PUT /api/hostel-mess/admin
========================================================= */

export const updateHostelMess = async (req, res) => {
  try {
    /*
      The frontend sends the complete CMS data
      inside req.body.data.
    */

    const incomingData = safeJsonParse(req.body.data, {});

    let hostelMess = await HostelMess.findOne({
      singletonKey: "hostel-mess",
    });

    if (!hostelMess) {
      hostelMess = new HostelMess(getDefaultHostelMessData());
    }

    /* =====================================================
       BASIC DATA
    ===================================================== */

    hostelMess.hero = {
      ...hostelMess.hero?.toObject?.(),
      ...(incomingData.hero || {}),
    };

    hostelMess.about = {
      ...hostelMess.about?.toObject?.(),
      ...(incomingData.about || {}),
    };

    hostelMess.mess = {
      ...hostelMess.mess?.toObject?.(),
      ...(incomingData.mess || {}),
    };

    hostelMess.boysHostels = incomingData.boysHostels || [];

    hostelMess.girlsHostels = incomingData.girlsHostels || [];

    hostelMess.facilities = incomingData.facilities || [];

    hostelMess.gallery = incomingData.gallery || [];

    hostelMess.weeklyMenu = incomingData.weeklyMenu || [];

    hostelMess.rules = incomingData.rules || [];

    hostelMess.statistics = incomingData.statistics || [];

    hostelMess.faqs = incomingData.faqs || [];

    hostelMess.cta = {
      ...hostelMess.cta?.toObject?.(),
      ...(incomingData.cta || {}),
    };

    /* =====================================================
       ABOUT IMAGE
    ===================================================== */

    const aboutFile = getUploadedFile(req.files, "aboutImage");

    if (aboutFile) {
      const oldPublicId = hostelMess.about?.image?.publicId;

      const uploadedImage = await uploadToCloudinary(aboutFile);

      hostelMess.about.image = uploadedImage;

      if (oldPublicId) {
        await deleteCloudinaryImage(oldPublicId);
      }
    }

    /* =====================================================
       MESS IMAGE
    ===================================================== */

    const messFile = getUploadedFile(req.files, "messImage");

    if (messFile) {
      const oldPublicId = hostelMess.mess?.image?.publicId;

      const uploadedImage = await uploadToCloudinary(messFile);

      hostelMess.mess.image = uploadedImage;

      if (oldPublicId) {
        await deleteCloudinaryImage(oldPublicId);
      }
    }

    /* =====================================================
       BOYS HOSTEL IMAGES
    ===================================================== */

    for (let index = 0; index < hostelMess.boysHostels.length; index++) {
      const file = getUploadedFile(req.files, `boysImage_${index}`);

      if (!file) continue;

      const oldPublicId = hostelMess.boysHostels[index]?.image?.publicId;

      const uploadedImage = await uploadToCloudinary(file);

      hostelMess.boysHostels[index].image = uploadedImage;

      if (oldPublicId) {
        await deleteCloudinaryImage(oldPublicId);
      }
    }

    /* =====================================================
       GIRLS HOSTEL IMAGES
    ===================================================== */

    for (let index = 0; index < hostelMess.girlsHostels.length; index++) {
      const file = getUploadedFile(req.files, `girlsImage_${index}`);

      if (!file) continue;

      const oldPublicId = hostelMess.girlsHostels[index]?.image?.publicId;

      const uploadedImage = await uploadToCloudinary(file);

      hostelMess.girlsHostels[index].image = uploadedImage;

      if (oldPublicId) {
        await deleteCloudinaryImage(oldPublicId);
      }
    }

    /* =====================================================
       GALLERY IMAGES
    ===================================================== */

    for (let index = 0; index < hostelMess.gallery.length; index++) {
      const file = getUploadedFile(req.files, `galleryImage_${index}`);

      if (!file) continue;

      const oldPublicId = hostelMess.gallery[index]?.publicId;

      const uploadedImage = await uploadToCloudinary(file);

      hostelMess.gallery[index] = uploadedImage;

      if (oldPublicId) {
        await deleteCloudinaryImage(oldPublicId);
      }
    }

    /* =====================================================
       SAVE
    ===================================================== */

    await hostelMess.save();

    return res.status(200).json({
      success: true,
      message: "Hostel & Mess updated successfully",
      data: hostelMess,
    });
  } catch (error) {
    console.error("Update Hostel & Mess Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update Hostel & Mess",
    });
  }
};

/* =========================================================
   RESET DEFAULTS
   POST /api/hostel-mess/admin/reset-defaults
========================================================= */

export const resetHostelMessDefaults = async (req, res) => {
  try {
    const existing = await HostelMess.findOne({
      singletonKey: "hostel-mess",
    });

    /*
      Remove existing Cloudinary images before
      restoring the default CMS content.
    */

    if (existing) {
      const publicIds = [];

      if (existing.about?.image?.publicId) {
        publicIds.push(existing.about.image.publicId);
      }

      if (existing.mess?.image?.publicId) {
        publicIds.push(existing.mess.image.publicId);
      }

      existing.boysHostels.forEach((item) => {
        if (item.image?.publicId) {
          publicIds.push(item.image.publicId);
        }
      });

      existing.girlsHostels.forEach((item) => {
        if (item.image?.publicId) {
          publicIds.push(item.image.publicId);
        }
      });

      existing.gallery.forEach((item) => {
        if (item.publicId) {
          publicIds.push(item.publicId);
        }
      });

      for (const publicId of publicIds) {
        await deleteCloudinaryImage(publicId);
      }

      await HostelMess.deleteOne({
        _id: existing._id,
      });
    }

    const defaults = await HostelMess.create(getDefaultHostelMessData());

    return res.status(200).json({
      success: true,
      message: "Hostel & Mess restored to default data",
      data: defaults,
    });
  } catch (error) {
    console.error("Reset Hostel & Mess Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to restore default Hostel & Mess data",
    });
  }
};
