import AdmissionApplication from "../models/AdmissionApplication.js";
import XLSX from "xlsx";
/* =========================================================
   SUBMIT ADMISSION APPLICATION
========================================================= */

export const submitAdmissionApplication = async (req, res) => {
  try {
    const data = req.body;

    /* =====================================================
       BASIC VALIDATION
    ===================================================== */

    if (!data.firstName || !data.email || !data.mobile || !data.programme) {
      return res.status(400).json({
        success: false,

        message: "Please complete all required fields.",
      });
    }

    /* =====================================================
       EMAIL DUPLICATE CHECK
    ===================================================== */

    const existingApplication = await AdmissionApplication.findOne({
      email: data.email.trim().toLowerCase(),

      session: data.session || "2026-27",
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,

        message:
          "An admission application already exists with this email for this session.",

        applicationNo: existingApplication.applicationNo,
      });
    }

    /* =====================================================
       CREATE APPLICATION
    ===================================================== */

    const application = await AdmissionApplication.create({
      /* -----------------------------------------------
           PERSONAL
        ----------------------------------------------- */

      firstName: data.firstName,

      middleName: data.middleName || "",

      lastName: data.lastName || "",

      email: data.email.trim().toLowerCase(),

      mobile: data.mobile,

      alternateMobile: data.alternateMobile || "",

      dob: data.dob || null,

      gender: data.gender || "",

      bloodGroup: data.bloodGroup || "",

      category: data.category || "",

      nationality: data.nationality || "Indian",

      aadhaar: data.aadhaar || "",

      /* -----------------------------------------------
           PARENT
        ----------------------------------------------- */

      fatherName: data.fatherName || "",

      fatherOccupation: data.fatherOccupation || "",

      motherName: data.motherName || "",

      motherOccupation: data.motherOccupation || "",

      annualIncome: data.annualIncome || "",

      religion: data.religion || "",

      /* -----------------------------------------------
           ADDRESS
        ----------------------------------------------- */

      address: data.address || "",

      state: data.state || "",

      district: data.district || "",

      city: data.city || "",

      pinCode: data.pinCode || "",

      /* -----------------------------------------------
           10TH
        ----------------------------------------------- */

      board10: data.board10 || "",

      school10: data.school10 || "",

      roll10: data.roll10 || "",

      year10: data.year10 || "",

      marks10: data.marks10 || "",

      medium10: data.medium10 || "",

      /* -----------------------------------------------
           12TH
        ----------------------------------------------- */

      board12: data.board12 || "",

      school12: data.school12 || "",

      roll12: data.roll12 || "",

      year12: data.year12 || "",

      marks12: data.marks12 || "",

      stream12: data.stream12 || "",

      /* -----------------------------------------------
           GRADUATION
        ----------------------------------------------- */

      graduationUniversity: data.graduationUniversity || "",

      graduationCollege: data.graduationCollege || "",

      graduationProgramme: data.graduationProgramme || "",

      graduationBranch: data.graduationBranch || "",

      graduationYear: data.graduationYear || "",

      graduationMarks: data.graduationMarks || "",

      /* -----------------------------------------------
           ENTRANCE
        ----------------------------------------------- */

      entranceExam: data.entranceExam || "",

      entranceAppNo: data.entranceAppNo || "",

      entranceRollNo: data.entranceRollNo || "",

      entranceRank: data.entranceRank || "",

      entranceScore: data.entranceScore || "",

      entranceYear: data.entranceYear || "",

      achievements: data.achievements || "",

      /* -----------------------------------------------
           COURSE
        ----------------------------------------------- */

      programme: data.programme,

      branch: data.branch || "",

      admissionType: data.admissionType || "",

      session: data.session || "2026-27",

      hostel: data.hostel || "No",

      transport: data.transport || "No",

      scholarship: data.scholarship || "No",

      /* -----------------------------------------------
           DECLARATION
        ----------------------------------------------- */

      declarationAccepted: Boolean(data.declarationAccepted),

      submittedAt: new Date(),
    });

    /* =====================================================
       RESPONSE
    ===================================================== */

    return res.status(201).json({
      success: true,

      message: "Admission application submitted successfully.",

      data: {
        id: application._id,

        applicationNo: application.applicationNo,

        status: application.status,

        submittedAt: application.submittedAt,
      },
    });
  } catch (error) {
    console.error("SUBMIT ADMISSION APPLICATION ERROR:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to submit admission application.",

      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/* =========================================================
   ADMIN — GET ALL APPLICATIONS
========================================================= */

export const getAdmissionApplications = async (req, res) => {
  try {
    const {
      status,
      session,
      programme,
      search,
      page = 1,
      limit = 25,
    } = req.query;

    const filter = {};

    /* ---------------------------------------------------
         FILTERS
      --------------------------------------------------- */

    if (status) {
      filter.status = status;
    }

    if (session) {
      filter.session = session;
    }

    if (programme) {
      filter.programme = programme;
    }

    /* ---------------------------------------------------
         SEARCH
      --------------------------------------------------- */

    if (search) {
      const searchRegex = new RegExp(search, "i");

      filter.$or = [
        {
          applicationNo: searchRegex,
        },

        {
          firstName: searchRegex,
        },

        {
          lastName: searchRegex,
        },

        {
          email: searchRegex,
        },

        {
          mobile: searchRegex,
        },
      ];
    }

    /* ---------------------------------------------------
         PAGINATION
      --------------------------------------------------- */

    const currentPage = Math.max(Number(page) || 1, 1);

    const pageLimit = Math.min(Math.max(Number(limit) || 25, 1), 100);

    const skip = (currentPage - 1) * pageLimit;

    /* ---------------------------------------------------
         QUERY
      --------------------------------------------------- */

    const [applications, total] = await Promise.all([
      AdmissionApplication.find(filter)
        .sort({
          submittedAt: -1,
        })
        .skip(skip)
        .limit(pageLimit)
        .lean(),

      AdmissionApplication.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,

      data: applications,

      pagination: {
        page: currentPage,

        limit: pageLimit,

        total,

        totalPages: Math.ceil(total / pageLimit),
      },
    });
  } catch (error) {
    console.error("GET ADMISSION APPLICATIONS ERROR:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to load admission applications.",
    });
  }
};
/* =========================================================
   ADMIN — EXPORT APPLICATIONS TO EXCEL
========================================================= */

export const exportAdmissionApplications = async (req, res) => {
  try {
    const { status, session, programme, search } = req.query;

    /* =====================================================
         BUILD SAME FILTER AS ADMIN LIST
      ===================================================== */

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (session) {
      filter.session = session;
    }

    if (programme) {
      filter.programme = programme;
    }

    /* =====================================================
         SEARCH
      ===================================================== */

    if (search) {
      const searchRegex = new RegExp(search, "i");

      filter.$or = [
        {
          applicationNo: searchRegex,
        },

        {
          firstName: searchRegex,
        },

        {
          middleName: searchRegex,
        },

        {
          lastName: searchRegex,
        },

        {
          email: searchRegex,
        },

        {
          mobile: searchRegex,
        },

        {
          programme: searchRegex,
        },

        {
          branch: searchRegex,
        },
      ];
    }

    /* =====================================================
         GET ALL MATCHING APPLICATIONS
      ===================================================== */

    const applications = await AdmissionApplication.find(filter)
      .sort({
        submittedAt: -1,
      })
      .lean();

    /* =====================================================
         EXCEL ROWS
      ===================================================== */

    const rows = applications.map((application, index) => ({
      "S.No.": index + 1,

      "Application No.": application.applicationNo || "",

      Status: application.status || "",

      Session: application.session || "",

      /* ---------------------------------------------
               PERSONAL
            --------------------------------------------- */

      "First Name": application.firstName || "",

      "Middle Name": application.middleName || "",

      "Last Name": application.lastName || "",

      Email: application.email || "",

      Mobile: application.mobile || "",

      "Alternate Mobile": application.alternateMobile || "",

      "Date of Birth": application.dob
        ? new Date(application.dob).toLocaleDateString("en-IN")
        : "",

      Gender: application.gender || "",

      "Blood Group": application.bloodGroup || "",

      Category: application.category || "",

      Nationality: application.nationality || "",

      Aadhaar: application.aadhaar || "",

      /* ---------------------------------------------
               PARENTS
            --------------------------------------------- */

      "Father Name": application.fatherName || "",

      "Father Occupation": application.fatherOccupation || "",

      "Mother Name": application.motherName || "",

      "Mother Occupation": application.motherOccupation || "",

      "Annual Income": application.annualIncome || "",

      Religion: application.religion || "",

      /* ---------------------------------------------
               ADDRESS
            --------------------------------------------- */

      Address: application.address || "",

      State: application.state || "",

      District: application.district || "",

      City: application.city || "",

      "PIN Code": application.pinCode || "",

      /* ---------------------------------------------
               10TH
            --------------------------------------------- */

      "10th Board": application.board10 || "",

      "10th School": application.school10 || "",

      "10th Roll No.": application.roll10 || "",

      "10th Year": application.year10 || "",

      "10th Marks": application.marks10 || "",

      "10th Medium": application.medium10 || "",

      /* ---------------------------------------------
               12TH
            --------------------------------------------- */

      "12th Board": application.board12 || "",

      "12th School": application.school12 || "",

      "12th Roll No.": application.roll12 || "",

      "12th Year": application.year12 || "",

      "12th Marks": application.marks12 || "",

      "12th Stream": application.stream12 || "",

      /* ---------------------------------------------
               GRADUATION
            --------------------------------------------- */

      "Graduation University": application.graduationUniversity || "",

      "Graduation College": application.graduationCollege || "",

      "Graduation Programme": application.graduationProgramme || "",

      "Graduation Branch": application.graduationBranch || "",

      "Graduation Year": application.graduationYear || "",

      "Graduation Marks": application.graduationMarks || "",

      /* ---------------------------------------------
               ENTRANCE EXAM
            --------------------------------------------- */

      "Entrance Exam": application.entranceExam || "",

      "Entrance Application No.": application.entranceAppNo || "",

      "Entrance Roll No.": application.entranceRollNo || "",

      "Entrance Rank": application.entranceRank || "",

      "Entrance Score": application.entranceScore || "",

      "Entrance Year": application.entranceYear || "",

      Achievements: application.achievements || "",

      /* ---------------------------------------------
               COURSE
            --------------------------------------------- */

      Programme: application.programme || "",

      Branch: application.branch || "",

      "Admission Type": application.admissionType || "",

      Hostel: application.hostel || "",

      Transport: application.transport || "",

      Scholarship: application.scholarship || "",

      /* ---------------------------------------------
               DOCUMENTS
            --------------------------------------------- */

      "Photograph URL": application.photographUrl || "",

      "Aadhaar Document URL": application.aadhaarDocumentUrl || "",

      "10th Marksheet URL": application.marksheet10Url || "",

      "12th Marksheet URL": application.marksheet12Url || "",

      "Other Document URL": application.otherDocumentUrl || "",

      /* ---------------------------------------------
               DECLARATION
            --------------------------------------------- */

      "Declaration Accepted": application.declarationAccepted ? "Yes" : "No",

      /* ---------------------------------------------
               ADMIN
            --------------------------------------------- */

      "Admin Remarks": application.adminRemarks || "",

      "Reviewed At": application.reviewedAt
        ? new Date(application.reviewedAt).toLocaleString("en-IN")
        : "",

      "Submitted At": application.submittedAt
        ? new Date(application.submittedAt).toLocaleString("en-IN")
        : "",
    }));

    /* =====================================================
         CREATE WORKBOOK
      ===================================================== */

    const workbook = XLSX.utils.book_new();

    const worksheet = XLSX.utils.json_to_sheet(rows);

    /* =====================================================
         COLUMN WIDTHS
      ===================================================== */

    const columnWidths = [];

    if (rows.length > 0) {
      const headers = Object.keys(rows[0]);

      headers.forEach((header) => {
        let maxLength = header.length;

        rows.forEach((row) => {
          const value =
            row[header] === null || row[header] === undefined
              ? ""
              : String(row[header]);

          maxLength = Math.max(maxLength, value.length);
        });

        columnWidths.push({
          wch: Math.min(Math.max(maxLength + 2, 12), 45),
        });
      });
    }

    worksheet["!cols"] = columnWidths;

    /* =====================================================
         FREEZE HEADER
      ===================================================== */

    worksheet["!freeze"] = {
      xSplit: 0,
      ySplit: 1,
    };

    /* =====================================================
         ADD SHEET
      ===================================================== */

    XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");

    /* =====================================================
         CREATE BUFFER
      ===================================================== */

    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    /* =====================================================
         FILE NAME
      ===================================================== */

    const date = new Date().toISOString().slice(0, 10);

    const fileName = `Admission_Applications_${date}.xlsx`;

    /* =====================================================
         RESPONSE HEADERS
      ===================================================== */

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    res.setHeader("Content-Length", excelBuffer.length);

    return res.status(200).send(excelBuffer);
  } catch (error) {
    console.error("EXPORT ADMISSION APPLICATIONS ERROR:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to export admission applications.",
    });
  }
};
/* =========================================================
   ADMIN — GET SINGLE APPLICATION
========================================================= */

export const getAdmissionApplication = async (req, res) => {
  try {
    const application = await AdmissionApplication.findById(
      req.params.id,
    ).lean();

    if (!application) {
      return res.status(404).json({
        success: false,

        message: "Admission application not found.",
      });
    }

    return res.status(200).json({
      success: true,

      data: application,
    });
  } catch (error) {
    console.error("GET ADMISSION APPLICATION ERROR:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to load admission application.",
    });
  }
};

/* =========================================================
   ADMIN — UPDATE STATUS
========================================================= */

export const updateAdmissionApplicationStatus = async (req, res) => {
  try {
    const { status, adminRemarks } = req.body;

    const allowedStatuses = [
      "Submitted",

      "Under Review",

      "Shortlisted",

      "Approved",

      "Rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,

        message: "Invalid application status.",
      });
    }

    const application = await AdmissionApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,

        message: "Admission application not found.",
      });
    }

    application.status = status;

    if (adminRemarks !== undefined) {
      application.adminRemarks = adminRemarks;
    }

    application.reviewedAt = new Date();

    /*
     * Use your existing authenticated
     * User ID from the auth middleware.
     */

    if (req.user?._id) {
      application.reviewedBy = req.user._id;
    }

    await application.save();

    return res.status(200).json({
      success: true,

      message: "Application status updated successfully.",

      data: application,
    });
  } catch (error) {
    console.error("UPDATE ADMISSION STATUS ERROR:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to update application status.",
    });
  }
};

/* =========================================================
   ADMIN — DELETE APPLICATION
========================================================= */

export const deleteAdmissionApplication = async (req, res) => {
  try {
    const application = await AdmissionApplication.findByIdAndDelete(
      req.params.id,
    );

    if (!application) {
      return res.status(404).json({
        success: false,

        message: "Admission application not found.",
      });
    }

    return res.status(200).json({
      success: true,

      message: "Admission application deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE ADMISSION APPLICATION ERROR:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to delete admission application.",
    });
  }
};
