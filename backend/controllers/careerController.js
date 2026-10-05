import XLSX from "xlsx";
import fs from "fs";
import path from "path";

import cloudinary5 from "../config/cloudinaryConfig5.js";

import CareerOpening from "../models/CareerOpening.js";
import CareerApplication from "../models/CareerApplication.js";

// ======================================================
// PUBLIC
// GET PUBLISHED CAREER OPENINGS
// ======================================================

export const getPublishedCareerOpenings = async (req, res) => {
  try {
    const today = new Date();

    const openings = await CareerOpening.find({
      active: true,

      status: "Published",

      applicationStartDate: {
        $lte: today,
      },

      $or: [
        {
          applicationEndDate: null,
        },

        {
          applicationEndDate: {
            $gte: today,
          },
        },
      ],
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,

      data: openings,
    });
  } catch (error) {
    console.error("Get career openings error:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to load career openings.",
    });
  }
};

// ======================================================
// PUBLIC
// GET SINGLE CAREER OPENING
// ======================================================

export const getCareerOpeningById = async (req, res) => {
  try {
    const opening = await CareerOpening.findById(req.params.id);

    if (!opening || !opening.active) {
      return res.status(404).json({
        success: false,

        message: "Career opening not found.",
      });
    }

    return res.status(200).json({
      success: true,

      data: opening,
    });
  } catch (error) {
    console.error("Get career opening error:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to load career opening.",
    });
  }
};

// ======================================================
// HR
// GET ALL CAREER OPENINGS
// ======================================================

export const getAllCareerOpenings = async (req, res) => {
  try {
    const openings = await CareerOpening.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,

      data: openings,
    });
  } catch (error) {
    console.error("Get all career openings error:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to load career openings.",
    });
  }
};

// ======================================================
// HR
// CREATE CAREER OPENING
// ======================================================

export const createCareerOpening = async (req, res) => {
  try {
    const {
      title,
      department,
      location,
      employmentType,
      vacancies,
      description,
      eligibility,
      experience,
      applicationStartDate,
      applicationEndDate,
      notificationFile,
      status,
    } = req.body;

    if (!title || !department) {
      return res.status(400).json({
        success: false,

        message: "Post title and department are required.",
      });
    }

    const opening = await CareerOpening.create({
      title: title.trim(),

      department: department.trim(),

      location: location?.trim() || "Ghaziabad",

      employmentType: employmentType || "Full Time",

      vacancies: Number(vacancies) || 1,

      description: description?.trim() || "",

      eligibility: eligibility?.trim() || "",

      experience: experience?.trim() || "",

      applicationStartDate: applicationStartDate || new Date(),

      applicationEndDate: applicationEndDate || null,

      notificationFile: notificationFile?.trim() || "",

      status: status || "Draft",

      active: true,
    });

    return res.status(201).json({
      success: true,

      message: "Career opening created successfully.",

      data: opening,
    });
  } catch (error) {
    console.error("Create career opening error:", error);

    return res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};

// ======================================================
// HR
// UPDATE CAREER OPENING
// ======================================================

export const updateCareerOpening = async (req, res) => {
  try {
    const opening = await CareerOpening.findById(req.params.id);

    if (!opening) {
      return res.status(404).json({
        success: false,

        message: "Career opening not found.",
      });
    }

    const {
      title,
      department,
      location,
      employmentType,
      vacancies,
      description,
      eligibility,
      experience,
      applicationStartDate,
      applicationEndDate,
      notificationFile,
      status,
      active,
    } = req.body;

    opening.title = title?.trim() || opening.title;

    opening.department = department?.trim() || opening.department;

    opening.location = location?.trim() || opening.location;

    opening.employmentType = employmentType || opening.employmentType;

    opening.vacancies = Number(vacancies) || opening.vacancies;

    opening.description = description?.trim() || "";

    opening.eligibility = eligibility?.trim() || "";

    opening.experience = experience?.trim() || "";

    if (applicationStartDate) {
      opening.applicationStartDate = applicationStartDate;
    }

    if (applicationEndDate !== undefined) {
      opening.applicationEndDate = applicationEndDate || null;
    }

    opening.notificationFile = notificationFile?.trim() || "";

    opening.status = status || opening.status;

    if (active !== undefined) {
      opening.active = active === true || active === "true";
    }

    await opening.save();

    return res.status(200).json({
      success: true,

      message: "Career opening updated successfully.",

      data: opening,
    });
  } catch (error) {
    console.error("Update career opening error:", error);

    return res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};

// ======================================================
// HR
// DELETE CAREER OPENING
// ======================================================

export const deleteCareerOpening = async (req, res) => {
  try {
    const opening = await CareerOpening.findById(req.params.id);

    if (!opening) {
      return res.status(404).json({
        success: false,

        message: "Career opening not found.",
      });
    }

    await CareerApplication.deleteMany({
      careerOpeningId: opening._id,
    });

    await opening.deleteOne();

    return res.status(200).json({
      success: true,

      message: "Career opening deleted successfully.",
    });
  } catch (error) {
    console.error("Delete career opening error:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to delete career opening.",
    });
  }
};

// ======================================================
// PUBLIC
// SUBMIT CAREER APPLICATION
// ======================================================

export const submitCareerApplication = async (req, res) => {
  try {
    // --------------------------------------------------
    // CHECK CV
    // --------------------------------------------------

    if (!req.file) {
      return res.status(400).json({
        success: false,

        message: "Please upload your CV / Resume.",
      });
    }

    // --------------------------------------------------
    // FIND OPENING
    // --------------------------------------------------

    const today = new Date();

    const opening = await CareerOpening.findOne({
      _id: req.params.openingId,

      active: true,

      status: "Published",

      applicationStartDate: {
        $lte: today,
      },

      $or: [
        {
          applicationEndDate: null,
        },

        {
          applicationEndDate: {
            $gte: today,
          },
        },
      ],
    });

    if (!opening) {
      return res.status(404).json({
        success: false,

        message: "This opening is not accepting applications.",
      });
    }

    // --------------------------------------------------
    // UPLOAD CV / RESUME TO CLOUDINARY ACCOUNT 5
    // --------------------------------------------------

    const uploadedResume = await cloudinary5.uploader.upload(req.file.path, {
      resource_type: "raw",
      folder: "imsec/careers/resumes",
    });

    // Remove the temporary local multer file after Cloudinary upload.
    try {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    } catch (cleanupError) {
      console.warn("Career resume temporary file cleanup warning:", cleanupError.message);
    }

    // --------------------------------------------------
    // CREATE APPLICATION
    // --------------------------------------------------

    const application = await CareerApplication.create({
      careerOpeningId: opening._id,

      postApplied: opening.title,

      department: opening.department,

      // ----------------------------------------------
      // PERSONAL
      // ----------------------------------------------

      candidateName: req.body.candidateName,

      dateOfBirth: req.body.dateOfBirth,

      mobileNo: req.body.mobileNo,

      emailId: req.body.emailId,

      // ----------------------------------------------
      // 10TH / 12TH
      // ----------------------------------------------

      tenthDivision: req.body.tenthDivision,

      twelfthPercentage: req.body.twelfthPercentage,

      twelfthDivision: req.body.twelfthDivision,

      // ----------------------------------------------
      // GRADUATION
      // ----------------------------------------------

      graduationStream: req.body.graduationStream,

      graduationStreamOther: req.body.graduationStreamOther || "",

      graduationUniversity: req.body.graduationUniversity,

      ugPercentage: req.body.ugPercentage,

      ugDivision: req.body.ugDivision,

      // ----------------------------------------------
      // POST GRADUATION
      // ----------------------------------------------

      postGraduationStream: req.body.postGraduationStream,

      postGraduationStreamOther: req.body.postGraduationStreamOther || "",

      postGraduationUniversity: req.body.postGraduationUniversity,

      postGraduationSpecialisation: req.body.postGraduationSpecialisation,

      pgPercentage: req.body.pgPercentage,

      pgDivision: req.body.pgDivision,

      // ----------------------------------------------
      // NET
      // ----------------------------------------------

      netQualified: req.body.netQualified,

      // ----------------------------------------------
      // Ph.D.
      // ----------------------------------------------

      phdStatus: req.body.phdStatus,

      phdUniversity: req.body.phdUniversity || "",

      phdDetail: req.body.phdDetail || "",

      phdSpecialisation: req.body.phdSpecialisation || "",

      phdRegistrationDate: req.body.phdRegistrationDate || null,

      phdAwardedOn: req.body.phdAwardedOn || null,

      // ----------------------------------------------
      // OTHER QUALIFICATION
      // ----------------------------------------------

      otherQualification: req.body.otherQualification || "",

      // ----------------------------------------------
      // EXPERIENCE
      // ----------------------------------------------

      teachingExperience: req.body.teachingExperience || "",

      industryExperience: req.body.industryExperience || "",

      otherExperience: req.body.otherExperience || "",

      // ----------------------------------------------
      // PUBLICATIONS
      // ----------------------------------------------

      totalPublication: Number(req.body.totalPublication) || 0,

      nationalJournals: Number(req.body.nationalJournals) || 0,

      internationalJournals: Number(req.body.internationalJournals) || 0,

      nationalConference: Number(req.body.nationalConference) || 0,

      internationalConference: Number(req.body.internationalConference) || 0,

      sciIndexed: Number(req.body.sciIndexed) || 0,

      scopusIndexed: Number(req.body.scopusIndexed) || 0,

      ugcCareIndexed: Number(req.body.ugcCareIndexed) || 0,

      otherIndexed: Number(req.body.otherIndexed) || 0,

      // ----------------------------------------------
      // GRANT
      // ----------------------------------------------

      grantReceived: req.body.grantReceived,

      grantHead: req.body.grantHead || "",

      fundingAgency: req.body.fundingAgency || "",

      grantAmount:
        req.body.grantAmount === "" || req.body.grantAmount === undefined
          ? null
          : Number(req.body.grantAmount),

      // ----------------------------------------------
      // RESUME
      // ----------------------------------------------

      resumeFile: uploadedResume.secure_url,

      resumePublicId: uploadedResume.public_id,

      resumeOriginalName: req.file.originalname,

      submittedAt: new Date(),
    });

    // --------------------------------------------------
    // SUCCESS
    // --------------------------------------------------

    return res.status(201).json({
      success: true,

      message: "Your application has been submitted successfully.",

      data: {
        id: application._id,

        submittedAt: application.submittedAt,
      },
    });
  } catch (error) {
    console.error("Submit career application error:", error);

    return res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};

// ======================================================
// HR
// GET CAREER APPLICATIONS
// ======================================================

export const getCareerApplications = async (req, res) => {
  try {
    const filter = {};

    if (req.params.openingId) {
      filter.careerOpeningId = req.params.openingId;
    }

    const applications = await CareerApplication.find(filter)
      .populate("careerOpeningId", "title department location employmentType")
      .sort({
        submittedAt: -1,
      });

    return res.status(200).json({
      success: true,

      count: applications.length,

      data: applications,
    });
  } catch (error) {
    console.error("Get career applications error:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to load applications.",
    });
  }
};

// ======================================================
// HR
// GET SINGLE CAREER APPLICATION
// ======================================================

export const getCareerApplicationById = async (req, res) => {
  try {
    const application = await CareerApplication.findById(
      req.params.id,
    ).populate("careerOpeningId", "title department location employmentType");

    if (!application) {
      return res.status(404).json({
        success: false,

        message: "Application not found.",
      });
    }

    return res.status(200).json({
      success: true,

      data: application,
    });
  } catch (error) {
    console.error("Get career application error:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to load application.",
    });
  }
};

// ======================================================
// HR ONLY
// EXPORT APPLICATIONS TO EXCEL
// ======================================================

export const exportCareerApplicationsExcel = async (req, res) => {
  try {
    const applications = await CareerApplication.find()
      .populate("careerOpeningId", "title department location employmentType")
      .sort({
        submittedAt: -1,
      })
      .lean();

    // ------------------------------------------------
    // EXCEL DATA
    // ------------------------------------------------

    const excelData = applications.map((application, index) => ({
      "S.No.": index + 1,

      "Post Applied": application.postApplied || "",

      Department: application.department || "",

      Location: application.careerOpeningId?.location || "",

      "Employment Type": application.careerOpeningId?.employmentType || "",

      // ------------------------------------------
      // PERSONAL
      // ------------------------------------------

      "Candidate Name": application.candidateName || "",

      "Date of Birth": application.dateOfBirth
        ? new Date(application.dateOfBirth).toLocaleDateString("en-IN")
        : "",

      "Mobile No": application.mobileNo || "",

      "Email ID": application.emailId || "",

      // ------------------------------------------
      // EDUCATION
      // ------------------------------------------

      "10th Division": application.tenthDivision || "",

      "12th Percentage": application.twelfthPercentage ?? "",

      "12th Division": application.twelfthDivision || "",

      "Graduation Stream": application.graduationStream || "",

      "Graduation Stream Other": application.graduationStreamOther || "",

      "Graduation University": application.graduationUniversity || "",

      "UG Percentage": application.ugPercentage ?? "",

      "UG Division": application.ugDivision || "",

      "Post Graduation Stream": application.postGraduationStream || "",

      "Post Graduation Stream Other":
        application.postGraduationStreamOther || "",

      "Post Graduation University": application.postGraduationUniversity || "",

      "PG Specialisation": application.postGraduationSpecialisation || "",

      "PG Percentage": application.pgPercentage ?? "",

      "PG Division": application.pgDivision || "",

      "NET Qualified": application.netQualified || "",

      // ------------------------------------------
      // Ph.D.
      // ------------------------------------------

      "Ph.D. Status": application.phdStatus || "",

      "Ph.D. University": application.phdUniversity || "",

      "Ph.D. Detail": application.phdDetail || "",

      "Ph.D. Specialisation": application.phdSpecialisation || "",

      "Ph.D. Registration Date": application.phdRegistrationDate
        ? new Date(application.phdRegistrationDate).toLocaleDateString("en-IN")
        : "",

      "Ph.D. Awarded On": application.phdAwardedOn
        ? new Date(application.phdAwardedOn).toLocaleDateString("en-IN")
        : "",

      // ------------------------------------------
      // OTHER QUALIFICATION
      // ------------------------------------------

      "Other Qualification": application.otherQualification || "",

      // ------------------------------------------
      // EXPERIENCE
      // ------------------------------------------

      "Teaching Experience": application.teachingExperience || "",

      "Industry Experience": application.industryExperience || "",

      "Other Experience": application.otherExperience || "",

      // ------------------------------------------
      // PUBLICATIONS
      // ------------------------------------------

      "Total Publications": application.totalPublication ?? 0,

      "National Journals": application.nationalJournals ?? 0,

      "International Journals": application.internationalJournals ?? 0,

      "National Conference": application.nationalConference ?? 0,

      "International Conference": application.internationalConference ?? 0,

      "SCI Indexed": application.sciIndexed ?? 0,

      "Scopus Indexed": application.scopusIndexed ?? 0,

      "UGC CARE Indexed": application.ugcCareIndexed ?? 0,

      "Other Indexed": application.otherIndexed ?? 0,

      // ------------------------------------------
      // GRANTS
      // ------------------------------------------

      "Grant Received": application.grantReceived || "",

      "Grant Head": application.grantHead || "",

      "Funding Agency": application.fundingAgency || "",

      "Grant Amount": application.grantAmount ?? "",

      // ------------------------------------------
      // CV
      // ------------------------------------------

      "CV / Resume": application.resumeOriginalName || "",

      // ------------------------------------------
      // SUBMITTED
      // ------------------------------------------

      "Submitted At": application.submittedAt
        ? new Date(application.submittedAt).toLocaleString("en-IN")
        : "",
    }));

    // ------------------------------------------------
    // WORKSHEET
    // ------------------------------------------------

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // ------------------------------------------------
    // WORKBOOK
    // ------------------------------------------------

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Career Applications");

    // ------------------------------------------------
    // COLUMN WIDTH
    // ------------------------------------------------

    const headers = Object.keys(excelData[0] || {});

    worksheet["!cols"] = headers.map((header) => ({
      wch: Math.min(Math.max(header.length + 4, 15), 35),
    }));

    // ------------------------------------------------
    // EXCEL BUFFER
    // ------------------------------------------------

    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",

      bookType: "xlsx",
    });

    // ------------------------------------------------
    // RESPONSE
    // ------------------------------------------------

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="career-applications.xlsx"',
    );

    return res.send(excelBuffer);
  } catch (error) {
    console.error("Career application Excel export error:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to export career applications.",
    });
  }
};

// ======================================================
// HR ONLY
// DOWNLOAD CAREER APPLICATION CV / RESUME
// ======================================================

export const downloadCareerApplicationResume = async (req, res) => {
  try {
    // ------------------------------------------------
    // FIND APPLICATION
    // ------------------------------------------------

    const application = await CareerApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,

        message: "Application not found.",
      });
    }

    // ------------------------------------------------
    // CHECK RESUME
    // ------------------------------------------------

    if (!application.resumeFile) {
      return res.status(404).json({
        success: false,

        message: "CV / Resume not found.",
      });
    }

    // ------------------------------------------------
    // GET FILE PATH
    // ------------------------------------------------

    let filePath = String(application.resumeFile).trim();

    // New applications store the Cloudinary Account 5 secure URL.
    // Keep the old local-file fallback for existing applications.
    if (/^https?:\/\//i.test(filePath)) {
      return res.redirect(filePath);
    }

    /*
     * If the database contains a relative
     * path, convert it into an absolute path.
     */

    if (!path.isAbsolute(filePath)) {
      filePath = path.resolve(process.cwd(), filePath);
    }

    // console.log("Career resume requested:", filePath);

    // ------------------------------------------------
    // CHECK FILE EXISTS
    // ------------------------------------------------

    if (!fs.existsSync(filePath)) {
      console.error("Career resume file does not exist:", filePath);

      return res.status(404).json({
        success: false,

        message: "CV / Resume file could not be found on the server.",
      });
    }

    // ------------------------------------------------
    // ORIGINAL FILE NAME
    // ------------------------------------------------

    const originalName =
      application.resumeOriginalName ||
      path.basename(filePath) ||
      "candidate-cv";

    // ------------------------------------------------
    // CONTENT TYPE
    // ------------------------------------------------

    const extension = path.extname(originalName).toLowerCase();

    const contentTypes = {
      ".pdf": "application/pdf",

      ".doc": "application/msword",

      ".docx":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    };

    const contentType = contentTypes[extension] || "application/octet-stream";

    // ------------------------------------------------
    // RESPONSE HEADERS
    // ------------------------------------------------

    res.setHeader("Content-Type", contentType);

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${originalName.replace(/"/g, "")}"`,
    );

    // ------------------------------------------------
    // DOWNLOAD
    // ------------------------------------------------

    return res.download(
      filePath,

      originalName,

      (error) => {
        if (error) {
          console.error("Career resume download error:", error);

          if (!res.headersSent) {
            res.status(500).json({
              success: false,

              message: "Unable to download CV / Resume.",
            });
          }
        }
      },
    );
  } catch (error) {
    console.error("Download career resume error:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,

        message: "Unable to download CV / Resume.",
      });
    }
  }
};
