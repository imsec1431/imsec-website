import Campus from "../models/Campus.js";

/*
  DEFAULT CAMPUS DATA
  Taken from the existing Campus page.
  Images are kept as the initial/default image URLs.
  Admin can replace them later using ImageUploader.
*/

const defaultCampusData = {
  overviewImage:
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80",

  overviewTag: "CAMPUS OVERVIEW",

  overviewTitle: "Discover the IMSEC Campus",

  overviewDescription:
    "IMS Engineering College offers a vibrant, technology-enabled campus with smart classrooms, advanced laboratories, modern library, sports facilities, innovation centers and lush green surroundings that create the perfect learning environment.",

  overviewStats: [
    {
      value: "50+",
      label: "Labs",
      displayOrder: 1,
    },
    {
      value: "25+",
      label: "Acres",
      displayOrder: 2,
    },
    {
      value: "100%",
      label: "Wi-Fi",
      displayOrder: 3,
    },
  ],

  gallery: [
    {
      title: "Main Building",
      image:
        "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=80",
      displayOrder: 1,
    },
    {
      title: "Central Library",
      image:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80",
      displayOrder: 2,
    },
    {
      title: "Computer Lab",
      image:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80",
      displayOrder: 3,
    },
    {
      title: "Seminar Hall",
      image:
        "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80",
      displayOrder: 4,
    },
    {
      title: "Sports Complex",
      image:
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=80",
      displayOrder: 5,
    },
    {
      title: "Campus Garden",
      image:
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&q=80",
      displayOrder: 6,
    },
  ],

  facilities: [
    {
      icon: "BookOpen",
      title: "Digital Library",
      displayOrder: 1,
    },
    {
      icon: "Computer",
      title: "Modern Labs",
      displayOrder: 2,
    },
    {
      icon: "Building",
      title: "Smart Classrooms",
      displayOrder: 3,
    },
    {
      icon: "Futbol",
      title: "Sports Arena",
      displayOrder: 4,
    },
    {
      icon: "Wifi",
      title: "Wi-Fi Campus",
      displayOrder: 5,
    },
    {
      icon: "Laptop",
      title: "A.C. Classes",
      displayOrder: 6,
    },
  ],

  tourImage:
    "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1200&q=80",

  tourTag: "VIRTUAL CAMPUS TOUR",

  tourTitle: "Explore Our Campus Virtually",

  tourDescription:
    "Experience IMSEC from anywhere through our virtual campus tour. Discover classrooms, laboratories, innovation centers, sports facilities and beautiful green surroundings.",

  tourVideoLink: "https://www.youtube.com/",

  tourButtonText: "Watch Tour",

  greenTag: "GREEN CAMPUS",

  greenTitle: "Sustainable & Eco Friendly",

  greenDescription:
    "IMSEC promotes sustainable development through lush green gardens, energy-efficient infrastructure, clean surroundings and environmentally responsible practices.",

  greenCardTitle: "Green Environment",

  greenCardDescription:
    "Beautiful landscapes, eco-friendly initiatives and a peaceful learning atmosphere.",

  studentLifeTag: "STUDENT LIFE",

  studentLifeTitle: "Life at IMSEC",

  studentLife: [
    {
      title: "Technical Clubs",
      displayOrder: 1,
    },
    {
      title: "Cultural Events",
      displayOrder: 2,
    },
    {
      title: "Hackathons",
      displayOrder: 3,
    },
    {
      title: "Sports Activities",
      displayOrder: 4,
    },
    {
      title: "Innovation Cell",
      displayOrder: 5,
    },
    {
      title: "Industrial Visits",
      displayOrder: 6,
    },
  ],

  ctaTitle: "Visit Our Beautiful Campus",

  ctaDescription:
    "Experience modern infrastructure, academic excellence and vibrant student life by visiting IMS Engineering College.",

  isPublished: true,

  displayOrder: 1,
};

/* =========================================================
   PUBLIC
   ========================================================= */

export const getPublicCampus = async (req, res) => {
  try {
    let campus = await Campus.findOne({
      isPublished: true,
    }).sort({
      displayOrder: 1,
      createdAt: -1,
    });

    /*
      If no Campus record exists, create the default record.
    */
    if (!campus) {
      campus = await Campus.create(defaultCampusData);
    }

    return res.status(200).json({
      success: true,
      data: campus,
    });
  } catch (error) {
    console.error("Get public campus error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch campus data",
      error: error.message,
    });
  }
};

/* =========================================================
   ADMIN
   ========================================================= */

export const getAdminCampus = async (req, res) => {
  try {
    let campus = await Campus.findOne().sort({
      displayOrder: 1,
      createdAt: -1,
    });

    /*
      Create default Campus automatically
      if admin opens the page for the first time.
    */
    if (!campus) {
      campus = await Campus.create(defaultCampusData);
    }

    return res.status(200).json({
      success: true,
      data: campus,
    });
  } catch (error) {
    console.error("Get admin campus error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch campus data",
      error: error.message,
    });
  }
};

/* =========================================================
   CREATE
   ========================================================= */

export const createCampus = async (req, res) => {
  try {
    const campus = await Campus.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Campus created successfully",
      data: campus,
    });
  } catch (error) {
    console.error("Create campus error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create campus",
      error: error.message,
    });
  }
};

/* =========================================================
   UPDATE
   ========================================================= */

export const updateCampus = async (req, res) => {
  try {
    const { id } = req.params;

    const campus = await Campus.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!campus) {
      return res.status(404).json({
        success: false,
        message: "Campus not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Campus updated successfully",
      data: campus,
    });
  } catch (error) {
    console.error("Update campus error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update campus",
      error: error.message,
    });
  }
};

/* =========================================================
   PUBLISH
   ========================================================= */

export const publishCampus = async (req, res) => {
  try {
    const { id } = req.params;

    const campus = await Campus.findByIdAndUpdate(
      id,
      {
        isPublished: true,
      },
      {
        new: true,
      },
    );

    if (!campus) {
      return res.status(404).json({
        success: false,
        message: "Campus not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Campus published successfully",
      data: campus,
    });
  } catch (error) {
    console.error("Publish campus error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to publish campus",
      error: error.message,
    });
  }
};

/* =========================================================
   UNPUBLISH
   ========================================================= */

export const unpublishCampus = async (req, res) => {
  try {
    const { id } = req.params;

    const campus = await Campus.findByIdAndUpdate(
      id,
      {
        isPublished: false,
      },
      {
        new: true,
      },
    );

    if (!campus) {
      return res.status(404).json({
        success: false,
        message: "Campus not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Campus unpublished successfully",
      data: campus,
    });
  } catch (error) {
    console.error("Unpublish campus error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to unpublish campus",
      error: error.message,
    });
  }
};

/* =========================================================
   DELETE
   ========================================================= */

export const deleteCampus = async (req, res) => {
  try {
    const { id } = req.params;

    const campus = await Campus.findByIdAndDelete(id);

    if (!campus) {
      return res.status(404).json({
        success: false,
        message: "Campus not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Campus deleted successfully",
    });
  } catch (error) {
    console.error("Delete campus error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete campus",
      error: error.message,
    });
  }
};
