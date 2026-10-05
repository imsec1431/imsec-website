import Cafeteria from "../models/Cafeteria.js";
import cloudinary5 from "../config/cloudinaryConfig5.js";

/*
|--------------------------------------------------------------------------
| Default Cafeteria Data
|--------------------------------------------------------------------------
*/

export const DEFAULT_CAFETERIA_DATA = {
  singletonKey: "cafeteria",

  hero: {
    title: "Cafeteria",
    breadcrumb: "Home / Life @ IMSEC / Cafeteria",

    image: {
      url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80",
      publicId: "",
    },
  },

  about: {
    title: "A Place to Relax & Refresh",

    description:
      "The cafeteria at IMS Engineering College provides students and staff with a comfortable and welcoming space to relax, refresh and enjoy meals during the academic day.",

    image: {
      url: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80",
      publicId: "",
    },
  },
};

/*
|--------------------------------------------------------------------------
| Helper
|--------------------------------------------------------------------------
*/

const getCafeteriaDocument = async () => {
  let cafeteria = await Cafeteria.findOne({
    singletonKey: "cafeteria",
  });

  if (!cafeteria) {
    cafeteria = await Cafeteria.create(DEFAULT_CAFETERIA_DATA);
  }

  return cafeteria;
};

/*
|--------------------------------------------------------------------------
| Public - Get Cafeteria
|--------------------------------------------------------------------------
*/

export const getCafeteria = async (req, res) => {
  try {
    const cafeteria = await getCafeteriaDocument();

    return res.status(200).json({
      success: true,
      data: cafeteria,
    });
  } catch (error) {
    console.error("Get Cafeteria Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load cafeteria data",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Admin - Get Cafeteria
|--------------------------------------------------------------------------
*/

export const getCafeteriaAdmin = async (req, res) => {
  try {
    const cafeteria = await getCafeteriaDocument();

    return res.status(200).json({
      success: true,
      data: cafeteria,
    });
  } catch (error) {
    console.error("Get Cafeteria Admin Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load cafeteria data",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Upload Image Helper
|--------------------------------------------------------------------------
*/

const uploadImage = async (file) => {
  if (!file) {
    return null;
  }

  const result = await cloudinary5.uploader.upload(file.path, {
    folder: "life-imsec/cafeteria",
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
};

/*
|--------------------------------------------------------------------------
| Delete Cloudinary Image
|--------------------------------------------------------------------------
*/

const deleteImage = async (publicId) => {
  if (!publicId) {
    return;
  }

  try {
    await cloudinary5.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary Delete Error:", error.message);
  }
};

/*
|--------------------------------------------------------------------------
| Admin - Update Cafeteria
|--------------------------------------------------------------------------
*/

export const updateCafeteria = async (req, res) => {
  try {
    let data;

    /*
    |--------------------------------------------------------------------------
    | Parse JSON Data
    |--------------------------------------------------------------------------
    */

    try {
      data =
        typeof req.body.data === "string"
          ? JSON.parse(req.body.data)
          : req.body.data;
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid cafeteria data",
      });
    }

    if (!data) {
      return res.status(400).json({
        success: false,
        message: "Cafeteria data is required",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Get Existing Document
    |--------------------------------------------------------------------------
    */

    const cafeteria = await getCafeteriaDocument();

    /*
    |--------------------------------------------------------------------------
    | Basic Text Data
    |--------------------------------------------------------------------------
    */

    cafeteria.hero.title = data.hero?.title ?? cafeteria.hero.title;

    cafeteria.hero.breadcrumb =
      data.hero?.breadcrumb ?? cafeteria.hero.breadcrumb;

    cafeteria.about.title = data.about?.title ?? cafeteria.about.title;

    cafeteria.about.description =
      data.about?.description ?? cafeteria.about.description;

    /*
    |--------------------------------------------------------------------------
    | Hero Image
    |--------------------------------------------------------------------------
    */

    const heroImage = req.files?.find((file) => file.fieldname === "heroImage");

    if (heroImage) {
      const oldPublicId = cafeteria.hero.image?.publicId;

      const uploadedImage = await uploadImage(heroImage);

      cafeteria.hero.image = uploadedImage;

      if (oldPublicId) {
        await deleteImage(oldPublicId);
      }
    } else if (data.hero?.image) {
      cafeteria.hero.image = {
        url: data.hero.image.url ?? cafeteria.hero.image?.url ?? "",
        publicId:
          data.hero.image.publicId ?? cafeteria.hero.image?.publicId ?? "",
      };
    }

    /*
    |--------------------------------------------------------------------------
    | About Image
    |--------------------------------------------------------------------------
    */

    const aboutImage = req.files?.find(
      (file) => file.fieldname === "aboutImage",
    );

    if (aboutImage) {
      const oldPublicId = cafeteria.about.image?.publicId;

      const uploadedImage = await uploadImage(aboutImage);

      cafeteria.about.image = uploadedImage;

      if (oldPublicId) {
        await deleteImage(oldPublicId);
      }
    } else if (data.about?.image) {
      cafeteria.about.image = {
        url: data.about.image.url ?? cafeteria.about.image?.url ?? "",
        publicId:
          data.about.image.publicId ?? cafeteria.about.image?.publicId ?? "",
      };
    }

    /*
    |--------------------------------------------------------------------------
    | Save
    |--------------------------------------------------------------------------
    */

    await cafeteria.save();

    return res.status(200).json({
      success: true,
      message: "Cafeteria updated successfully",
      data: cafeteria,
    });
  } catch (error) {
    console.error("Update Cafeteria Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update cafeteria",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Admin - Restore Defaults
|--------------------------------------------------------------------------
*/

export const resetCafeteriaDefaults = async (req, res) => {
  try {
    const cafeteria = await Cafeteria.findOne({
      singletonKey: "cafeteria",
    });

    /*
      |--------------------------------------------------------------------------
      | Delete Admin Uploaded Images
      |--------------------------------------------------------------------------
      */

    if (cafeteria) {
      const imageIds = [
        cafeteria.hero?.image?.publicId,
        cafeteria.about?.image?.publicId,
      ].filter(Boolean);

      for (const publicId of imageIds) {
        await deleteImage(publicId);
      }
    }

    /*
      |--------------------------------------------------------------------------
      | Remove Existing Data
      |--------------------------------------------------------------------------
      */

    await Cafeteria.deleteOne({
      singletonKey: "cafeteria",
    });

    /*
      |--------------------------------------------------------------------------
      | Create Defaults
      |--------------------------------------------------------------------------
      */

    const newCafeteria = await Cafeteria.create(DEFAULT_CAFETERIA_DATA);

    return res.status(200).json({
      success: true,
      message: "Cafeteria defaults restored successfully",
      data: newCafeteria,
    });
  } catch (error) {
    console.error("Reset Cafeteria Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to restore cafeteria defaults",
    });
  }
};
