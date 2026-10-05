import DepartmentResearchBook from "../models/DepartmentResearchBook.js";
import Department from "../models/Department.js";

/* =========================================================
   GET ALL BOOKS / CHAPTERS BY DEPARTMENT
   ========================================================= */

export const getDepartmentResearchBooks = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const department = await Department.findById(departmentId);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    const books = await DepartmentResearchBook.find({
      department: departmentId,
    }).sort({
      order: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: books,
    });
  } catch (error) {
    console.error("Get department research books error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch department research books",
      error: error.message,
    });
  }
};

/* =========================================================
   GET SINGLE BOOK / CHAPTER
   ========================================================= */

export const getDepartmentResearchBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await DepartmentResearchBook.findById(id).populate(
      "department",
      "name slug",
    );

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Research book / chapter not found",
      });
    }

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    console.error("Get department research book error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch research book / chapter",
      error: error.message,
    });
  }
};

/* =========================================================
   CREATE BOOK / CHAPTER
   ========================================================= */

export const createDepartmentResearchBook = async (req, res) => {
  try {
    const {
      department,
      title,
      authors,
      bookType,
      bookTitle,
      chapterTitle,
      publisher,
      publicationPlace,
      isbn,
      edition,
      year,
      pages,
      description,
      url,
      documentUrl,
      image,
      publicId,
      order,
      isActive,
    } = req.body;

    if (!department) {
      return res.status(400).json({
        success: false,
        message: "Department is required",
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Book / chapter title is required",
      });
    }

    const departmentExists = await Department.findById(department);

    if (!departmentExists) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    const book = await DepartmentResearchBook.create({
      department,

      title: title.trim(),

      authors: typeof authors === "string" ? authors.trim() : "",

      bookType:
        typeof bookType === "string" && bookType.trim()
          ? bookType.trim()
          : "Book",

      bookTitle: typeof bookTitle === "string" ? bookTitle.trim() : "",

      chapterTitle: typeof chapterTitle === "string" ? chapterTitle.trim() : "",

      publisher: typeof publisher === "string" ? publisher.trim() : "",

      publicationPlace:
        typeof publicationPlace === "string" ? publicationPlace.trim() : "",

      isbn: typeof isbn === "string" ? isbn.trim() : "",

      edition: typeof edition === "string" ? edition.trim() : "",

      year: typeof year === "string" ? year.trim() : "",

      pages: typeof pages === "string" ? pages.trim() : "",

      description: typeof description === "string" ? description.trim() : "",

      url: typeof url === "string" ? url.trim() : "",

      documentUrl: typeof documentUrl === "string" ? documentUrl.trim() : "",

      image: typeof image === "string" ? image.trim() : "",

      publicId: typeof publicId === "string" ? publicId.trim() : "",

      order: Number(order) || 0,

      isActive: typeof isActive === "boolean" ? isActive : true,
    });

    res.status(201).json({
      success: true,
      message: "Research book / chapter created successfully",
      data: book,
    });
  } catch (error) {
    console.error("Create department research book error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create research book / chapter",
      error: error.message,
    });
  }
};

/* =========================================================
   UPDATE BOOK / CHAPTER
   ========================================================= */

export const updateDepartmentResearchBook = async (req, res) => {
  try {
    const { id } = req.params;

    const existingBook = await DepartmentResearchBook.findById(id);

    if (!existingBook) {
      return res.status(404).json({
        success: false,
        message: "Research book / chapter not found",
      });
    }

    const {
      department,
      title,
      authors,
      bookType,
      bookTitle,
      chapterTitle,
      publisher,
      publicationPlace,
      isbn,
      edition,
      year,
      pages,
      description,
      url,
      documentUrl,
      image,
      publicId,
      order,
      isActive,
    } = req.body;

    /* -----------------------------------------------
       Validate department when supplied
       ----------------------------------------------- */

    if (department) {
      const departmentExists = await Department.findById(department);

      if (!departmentExists) {
        return res.status(404).json({
          success: false,
          message: "Department not found",
        });
      }

      existingBook.department = department;
    }

    /* -----------------------------------------------
       Update fields
       ----------------------------------------------- */

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Book / chapter title is required",
        });
      }

      existingBook.title = title.trim();
    }

    if (authors !== undefined) {
      existingBook.authors = typeof authors === "string" ? authors.trim() : "";
    }

    if (bookType !== undefined) {
      existingBook.bookType =
        typeof bookType === "string" && bookType.trim()
          ? bookType.trim()
          : "Book";
    }

    if (bookTitle !== undefined) {
      existingBook.bookTitle =
        typeof bookTitle === "string" ? bookTitle.trim() : "";
    }

    if (chapterTitle !== undefined) {
      existingBook.chapterTitle =
        typeof chapterTitle === "string" ? chapterTitle.trim() : "";
    }

    if (publisher !== undefined) {
      existingBook.publisher =
        typeof publisher === "string" ? publisher.trim() : "";
    }

    if (publicationPlace !== undefined) {
      existingBook.publicationPlace =
        typeof publicationPlace === "string" ? publicationPlace.trim() : "";
    }

    if (isbn !== undefined) {
      existingBook.isbn = typeof isbn === "string" ? isbn.trim() : "";
    }

    if (edition !== undefined) {
      existingBook.edition = typeof edition === "string" ? edition.trim() : "";
    }

    if (year !== undefined) {
      existingBook.year = typeof year === "string" ? year.trim() : "";
    }

    if (pages !== undefined) {
      existingBook.pages = typeof pages === "string" ? pages.trim() : "";
    }

    if (description !== undefined) {
      existingBook.description =
        typeof description === "string" ? description.trim() : "";
    }

    if (url !== undefined) {
      existingBook.url = typeof url === "string" ? url.trim() : "";
    }

    if (documentUrl !== undefined) {
      existingBook.documentUrl =
        typeof documentUrl === "string" ? documentUrl.trim() : "";
    }

    if (image !== undefined) {
      existingBook.image = typeof image === "string" ? image.trim() : "";
    }

    if (publicId !== undefined) {
      existingBook.publicId =
        typeof publicId === "string" ? publicId.trim() : "";
    }

    if (order !== undefined) {
      existingBook.order = Number(order) || 0;
    }

    if (isActive !== undefined) {
      existingBook.isActive = Boolean(isActive);
    }

    const updatedBook = await existingBook.save();

    res.status(200).json({
      success: true,
      message: "Research book / chapter updated successfully",
      data: updatedBook,
    });
  } catch (error) {
    console.error("Update department research book error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update research book / chapter",
      error: error.message,
    });
  }
};

/* =========================================================
   DELETE BOOK / CHAPTER
   ========================================================= */

export const deleteDepartmentResearchBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await DepartmentResearchBook.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Research book / chapter not found",
      });
    }

    await DepartmentResearchBook.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Research book / chapter deleted successfully",
    });
  } catch (error) {
    console.error("Delete department research book error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete research book / chapter",
      error: error.message,
    });
  }
};
