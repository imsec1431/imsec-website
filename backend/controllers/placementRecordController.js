import PlacementStudent from "../models/placementRecordModel.js";
import XLSX from "xlsx";

/* =========================================================
   HELPER - CONVERT EXCEL VALUE TO STRING
========================================================= */

const cleanValue = (value) => {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value).trim();
};

/* =========================================================
   HELPER - CONVERT PUBLISHED VALUE
========================================================= */

const parsePublished = (value) => {
  if (value === undefined || value === null || cleanValue(value) === "") {
    return true;
  }

  const normalized = cleanValue(value).toLowerCase();

  if (["yes", "true", "1", "published"].includes(normalized)) {
    return true;
  }

  if (["no", "false", "0", "draft", "unpublished"].includes(normalized)) {
    return false;
  }

  return null;
};

/* =========================================================
   HELPER - NORMALIZE EXCEL COLUMN NAME
========================================================= */

const normalizeHeader = (header) => {
  return cleanValue(header).toLowerCase().replace(/\s+/g, " ").trim();
};

/* =========================================================
   PUBLIC
========================================================= */

export const getPublicPlacementStudents = async (req, res) => {
  try {
    const students = await PlacementStudent.find({
      isPublished: true,
    })
      .sort({
        batch: -1,
        displayOrder: 1,
        name: 1,
      })
      .select("name rollNo branch placedIn batch displayOrder");

    return res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error("Public placement students error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load placement records.",
    });
  }
};

/* =========================================================
   ADMIN - ALL
========================================================= */

export const getAllPlacementStudents = async (req, res) => {
  try {
    const students = await PlacementStudent.find({}).sort({
      batch: -1,
      displayOrder: 1,
      name: 1,
    });

    return res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error("Get all placement students error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load placement records.",
    });
  }
};

/* =========================================================
   CREATE SINGLE STUDENT
========================================================= */

export const createPlacementStudent = async (req, res) => {
  try {
    const { name, rollNo, branch, placedIn, batch, displayOrder, isPublished } =
      req.body;

    if (
      !name?.trim() ||
      !rollNo?.trim() ||
      !branch?.trim() ||
      !placedIn?.trim() ||
      !batch?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, Roll No, Branch, Placed In and Batch are required.",
      });
    }

    const student = await PlacementStudent.create({
      name: name.trim(),

      rollNo: rollNo.trim(),

      branch: branch.trim(),

      placedIn: placedIn.trim(),

      batch: batch.trim(),

      displayOrder:
        displayOrder === undefined || displayOrder === ""
          ? 0
          : Number(displayOrder),

      isPublished:
        isPublished === undefined
          ? true
          : isPublished === true || isPublished === "true",

      createdBy: req.admin?._id || null,

      updatedBy: req.admin?._id || null,
    });

    return res.status(201).json({
      success: true,
      message: "Placement record created successfully.",
      data: student,
    });
  } catch (error) {
    console.error("Create placement record error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create placement record.",
    });
  }
};

/* =========================================================
   BULK IMPORT FROM EXCEL
========================================================= */

export const importPlacementStudentsFromExcel = async (req, res) => {
  try {
    /* -----------------------------------------
         CHECK FILE
      ----------------------------------------- */

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an Excel file.",
      });
    }

    /* -----------------------------------------
         CHECK EXTENSION
      ----------------------------------------- */

    const fileName = req.file.originalname || "";

    const extension = fileName.split(".").pop()?.toLowerCase();

    if (!["xlsx", "xls"].includes(extension)) {
      return res.status(400).json({
        success: false,
        message: "Only .xlsx and .xls Excel files are allowed.",
      });
    }

    /* -----------------------------------------
         READ EXCEL FILE
      ----------------------------------------- */

    const workbook = XLSX.read(req.file.buffer, {
      type: "buffer",
      cellDates: true,
    });

    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      return res.status(400).json({
        success: false,
        message: "The Excel file does not contain any worksheet.",
      });
    }

    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const rows = XLSX.utils.sheet_to_json(worksheet, {
      defval: "",
      raw: false,
    });

    if (!rows.length) {
      return res.status(400).json({
        success: false,
        message: "The Excel worksheet is empty.",
      });
    }

    /* -----------------------------------------
         REQUIRED EXCEL COLUMNS
      ----------------------------------------- */

    const requiredColumns = ["name", "roll no", "branch", "placed in", "batch"];

    const firstRow = rows[0];

    const actualColumns = Object.keys(firstRow).map(normalizeHeader);

    const missingColumns = requiredColumns.filter(
      (column) => !actualColumns.includes(column),
    );

    if (missingColumns.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Required Excel columns are missing.",
        missingColumns,
        requiredColumns: ["Name", "Roll No", "Branch", "Placed In", "Batch"],
      });
    }

    /* -----------------------------------------
         MAP EXCEL ROWS
      ----------------------------------------- */

    const validStudents = [];
    const errors = [];

    const rollNumbersInExcel = new Set();

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];

      /*
          Excel row number:
          Header = row 1
          First data row = row 2
        */
      const excelRowNumber = index + 2;

      const rowData = {};

      Object.keys(row).forEach((key) => {
        rowData[normalizeHeader(key)] = row[key];
      });

      const name = cleanValue(rowData["name"]);

      const rollNo = cleanValue(rowData["roll no"]);

      const branch = cleanValue(rowData["branch"]);

      const placedIn = cleanValue(rowData["placed in"]);

      const batch = cleanValue(rowData["batch"]);

      const displayOrderValue = cleanValue(rowData["display order"]);

      const publishedValue = rowData["published"];

      /*
          -----------------------------------------
          SKIP COMPLETELY EMPTY ROWS
          -----------------------------------------
        */

      const isEmptyRow =
        !name &&
        !rollNo &&
        !branch &&
        !placedIn &&
        !batch &&
        !displayOrderValue &&
        !cleanValue(publishedValue);

      if (isEmptyRow) {
        continue;
      }

      const rowErrors = [];

      /*
          -----------------------------------------
          REQUIRED VALIDATION
          -----------------------------------------
        */

      if (!name) {
        rowErrors.push("Name is required.");
      }

      if (!rollNo) {
        rowErrors.push("Roll No is required.");
      }

      if (!branch) {
        rowErrors.push("Branch is required.");
      }

      if (!placedIn) {
        rowErrors.push("Placed In is required.");
      }

      if (!batch) {
        rowErrors.push("Batch is required.");
      }

      /*
          -----------------------------------------
          DUPLICATE ROLL NO INSIDE EXCEL
          -----------------------------------------
        */

      const normalizedRollNo = rollNo.toLowerCase();

      if (rollNo && rollNumbersInExcel.has(normalizedRollNo)) {
        rowErrors.push(
          `Duplicate Roll No "${rollNo}" found in the Excel file.`,
        );
      }

      if (rollNo) {
        rollNumbersInExcel.add(normalizedRollNo);
      }

      /*
          -----------------------------------------
          DISPLAY ORDER VALIDATION
          -----------------------------------------
        */

      let displayOrder = 0;

      if (displayOrderValue) {
        displayOrder = Number(displayOrderValue);

        if (Number.isNaN(displayOrder) || displayOrder < 0) {
          rowErrors.push("Display Order must be a valid non-negative number.");
        }
      }

      /*
          -----------------------------------------
          PUBLISHED VALIDATION
          -----------------------------------------
        */

      const isPublished = parsePublished(publishedValue);

      if (isPublished === null) {
        rowErrors.push(
          'Published must be "Yes", "No", "True", "False", "1" or "0".',
        );
      }

      /*
          -----------------------------------------
          STORE ROW ERRORS
          -----------------------------------------
        */

      if (rowErrors.length > 0) {
        errors.push({
          row: excelRowNumber,
          errors: rowErrors,
        });

        continue;
      }

      /*
          -----------------------------------------
          VALID STUDENT
          -----------------------------------------
        */

      validStudents.push({
        name,
        rollNo,
        branch,
        placedIn,
        batch,
        displayOrder,
        isPublished: isPublished === null ? true : isPublished,
        createdBy: req.admin?._id || null,
        updatedBy: req.admin?._id || null,
      });
    }

    /* -----------------------------------------
         NO VALID ROWS
      ----------------------------------------- */

    if (validStudents.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid student records were found in the Excel file.",
        imported: 0,
        failed: errors.length,
        errors,
      });
    }

    /* -----------------------------------------
         CHECK DUPLICATES IN DATABASE
      ----------------------------------------- */

    const excelRollNumbers = validStudents.map((student) => student.rollNo);

    const existingStudents = await PlacementStudent.find({
      rollNo: {
        $in: excelRollNumbers,
      },
    }).select("rollNo");

    const existingRollNumbers = new Set(
      existingStudents.map((student) => student.rollNo.toLowerCase()),
    );

    const studentsToInsert = [];

    validStudents.forEach((student) => {
      if (existingRollNumbers.has(student.rollNo.toLowerCase())) {
        errors.push({
          row: "Database",
          rollNo: student.rollNo,
          errors: [
            `Roll No "${student.rollNo}" already exists in the database.`,
          ],
        });

        return;
      }

      studentsToInsert.push(student);
    });

    /* -----------------------------------------
         INSERT VALID RECORDS
      ----------------------------------------- */

    let insertedStudents = [];

    if (studentsToInsert.length > 0) {
      insertedStudents = await PlacementStudent.insertMany(studentsToInsert, {
        ordered: true,
      });
    }

    /* -----------------------------------------
         RESPONSE
      ----------------------------------------- */

    return res.status(200).json({
      success: true,
      message: "Excel placement records processed successfully.",
      imported: insertedStudents.length,
      failed: errors.length,
      totalRows: rows.length,
      errors,
      data: insertedStudents,
    });
  } catch (error) {
    console.error("Excel placement import error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to import placement records from Excel.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/* =========================================================
   UPDATE
========================================================= */

export const updatePlacementStudent = async (req, res) => {
  try {
    const student = await PlacementStudent.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Placement record not found.",
      });
    }

    const { name, rollNo, branch, placedIn, batch, displayOrder, isPublished } =
      req.body;

    if (name !== undefined && !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Student name cannot be empty.",
      });
    }

    if (rollNo !== undefined && !rollNo.trim()) {
      return res.status(400).json({
        success: false,
        message: "Roll number cannot be empty.",
      });
    }

    if (branch !== undefined && !branch.trim()) {
      return res.status(400).json({
        success: false,
        message: "Branch cannot be empty.",
      });
    }

    if (placedIn !== undefined && !placedIn.trim()) {
      return res.status(400).json({
        success: false,
        message: "Placed In cannot be empty.",
      });
    }

    if (batch !== undefined && !batch.trim()) {
      return res.status(400).json({
        success: false,
        message: "Batch cannot be empty.",
      });
    }

    if (name !== undefined) {
      student.name = name.trim();
    }

    if (rollNo !== undefined) {
      student.rollNo = rollNo.trim();
    }

    if (branch !== undefined) {
      student.branch = branch.trim();
    }

    if (placedIn !== undefined) {
      student.placedIn = placedIn.trim();
    }

    if (batch !== undefined) {
      student.batch = batch.trim();
    }

    if (displayOrder !== undefined) {
      const order = Number(displayOrder);

      if (Number.isNaN(order) || order < 0) {
        return res.status(400).json({
          success: false,
          message: "Display order must be a valid non-negative number.",
        });
      }

      student.displayOrder = order;
    }

    if (isPublished !== undefined) {
      student.isPublished = isPublished === true || isPublished === "true";
    }

    student.updatedBy = req.admin?._id || null;

    await student.save();

    return res.status(200).json({
      success: true,
      message: "Placement record updated successfully.",
      data: student,
    });
  } catch (error) {
    console.error("Update placement record error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update placement record.",
    });
  }
};

/* =========================================================
   DELETE
========================================================= */

export const deletePlacementStudent = async (req, res) => {
  try {
    const student = await PlacementStudent.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Placement record not found.",
      });
    }

    await student.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Placement record deleted successfully.",
    });
  } catch (error) {
    console.error("Delete placement record error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete placement record.",
    });
  }
};
