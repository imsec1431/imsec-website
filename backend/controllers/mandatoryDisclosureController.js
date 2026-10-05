import MandatoryDisclosure from "../models/MandatoryDisclosure.js";

/**
 * @desc    Get published Mandatory Disclosure documents
 * @route   GET /api/mandatory-disclosure
 * @access  Public
 */
export const getPublicMandatoryDisclosure = async (req, res) => {
  try {
    const disclosures = await MandatoryDisclosure.find({
      isPublished: true,
    }).sort({
      displayOrder: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: disclosures,
    });
  } catch (error) {
    console.error("Error fetching public Mandatory Disclosure:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch Mandatory Disclosure.",
    });
  }
};

/**
 * @desc    Get all Mandatory Disclosure documents
 * @route   GET /api/mandatory-disclosure/admin
 * @access  Protected
 */
export const getAdminMandatoryDisclosure = async (req, res) => {
  try {
    const disclosures = await MandatoryDisclosure.find().sort({
      displayOrder: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: disclosures,
    });
  } catch (error) {
    console.error("Error fetching admin Mandatory Disclosure:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch Mandatory Disclosure.",
    });
  }
};

/**
 * @desc    Create Mandatory Disclosure
 * @route   POST /api/mandatory-disclosure/admin
 * @access  Protected
 */
export const createMandatoryDisclosure = async (req, res) => {
  try {
    const { title, pdfLink, isPublished, displayOrder } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required.",
      });
    }

    if (!pdfLink || !pdfLink.trim()) {
      return res.status(400).json({
        success: false,
        message: "PDF link is required.",
      });
    }

    const disclosure = await MandatoryDisclosure.create({
      title: title.trim(),
      pdfLink: pdfLink.trim(),
      isPublished: typeof isPublished === "boolean" ? isPublished : false,
      displayOrder: displayOrder !== undefined ? Number(displayOrder) || 0 : 0,
    });

    res.status(201).json({
      success: true,
      message: "Mandatory Disclosure created successfully.",
      data: disclosure,
    });
  } catch (error) {
    console.error("Error creating Mandatory Disclosure:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create Mandatory Disclosure.",
    });
  }
};

/**
 * @desc    Update Mandatory Disclosure
 * @route   PUT /api/mandatory-disclosure/admin/:id
 * @access  Protected
 */
export const updateMandatoryDisclosure = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, pdfLink, isPublished, displayOrder } = req.body;

    const disclosure = await MandatoryDisclosure.findById(id);

    if (!disclosure) {
      return res.status(404).json({
        success: false,
        message: "Mandatory Disclosure not found.",
      });
    }

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Title is required.",
        });
      }

      disclosure.title = title.trim();
    }

    if (pdfLink !== undefined) {
      if (!pdfLink.trim()) {
        return res.status(400).json({
          success: false,
          message: "PDF link is required.",
        });
      }

      disclosure.pdfLink = pdfLink.trim();
    }

    if (typeof isPublished === "boolean") {
      disclosure.isPublished = isPublished;
    }

    if (displayOrder !== undefined) {
      disclosure.displayOrder = Number(displayOrder) || 0;
    }

    await disclosure.save();

    res.status(200).json({
      success: true,
      message: "Mandatory Disclosure updated successfully.",
      data: disclosure,
    });
  } catch (error) {
    console.error("Error updating Mandatory Disclosure:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update Mandatory Disclosure.",
    });
  }
};

/**
 * @desc    Publish Mandatory Disclosure
 * @route   PATCH /api/mandatory-disclosure/admin/:id/publish
 * @access  Protected
 */
export const publishMandatoryDisclosure = async (req, res) => {
  try {
    const { id } = req.params;

    const disclosure = await MandatoryDisclosure.findByIdAndUpdate(
      id,
      { isPublished: true },
      { new: true },
    );

    if (!disclosure) {
      return res.status(404).json({
        success: false,
        message: "Mandatory Disclosure not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Mandatory Disclosure published successfully.",
      data: disclosure,
    });
  } catch (error) {
    console.error("Error publishing Mandatory Disclosure:", error);

    res.status(500).json({
      success: false,
      message: "Failed to publish Mandatory Disclosure.",
    });
  }
};

/**
 * @desc    Unpublish Mandatory Disclosure
 * @route   PATCH /api/mandatory-disclosure/admin/:id/unpublish
 * @access  Protected
 */
export const unpublishMandatoryDisclosure = async (req, res) => {
  try {
    const { id } = req.params;

    const disclosure = await MandatoryDisclosure.findByIdAndUpdate(
      id,
      { isPublished: false },
      { new: true },
    );

    if (!disclosure) {
      return res.status(404).json({
        success: false,
        message: "Mandatory Disclosure not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Mandatory Disclosure unpublished successfully.",
      data: disclosure,
    });
  } catch (error) {
    console.error("Error unpublishing Mandatory Disclosure:", error);

    res.status(500).json({
      success: false,
      message: "Failed to unpublish Mandatory Disclosure.",
    });
  }
};

/**
 * @desc    Delete Mandatory Disclosure
 * @route   DELETE /api/mandatory-disclosure/admin/:id
 * @access  Protected
 */
export const deleteMandatoryDisclosure = async (req, res) => {
  try {
    const { id } = req.params;

    const disclosure = await MandatoryDisclosure.findById(id);

    if (!disclosure) {
      return res.status(404).json({
        success: false,
        message: "Mandatory Disclosure not found.",
      });
    }

    await disclosure.deleteOne();

    res.status(200).json({
      success: true,
      message: "Mandatory Disclosure deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting Mandatory Disclosure:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete Mandatory Disclosure.",
    });
  }
};
