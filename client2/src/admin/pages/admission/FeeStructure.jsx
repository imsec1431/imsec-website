import React, { useEffect, useState } from "react";

import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap";

import {
  getAdminFeeStructure,
  updateFeeStructure,
  publishFeeStructure,
  unpublishFeeStructure,
  resetFeeStructure,
} from "../../services/feeStructureService.js";

import "./FeeStructure.css";

/* =========================================================
   DEFAULT EMPTY OBJECTS
========================================================= */

const emptyFeeRow = () => ({
  particulars: "",
  amounts: [""],
  displayOrder: 1,
});

const emptyCourse = () => ({
  courseName: "",
  years: 4,
  feeRows: [emptyFeeRow()],
  displayOrder: 1,
});

const emptyHostelRow = () => ({
  title: "",
  amount: "",
  displayOrder: 1,
});

const emptyHostel = () => ({
  hostelName: "",
  locationLabel: "On Campus",
  rows: [emptyHostelRow()],
  displayOrder: 1,
});

const emptyPaymentOption = () => ({
  title: "",
  displayOrder: 1,
});

const emptyScholarship = () => ({
  title: "",
  description: "",
  displayOrder: 1,
});

const emptyLoan = () => ({
  title: "",
  description: "",
  displayOrder: 1,
});

/* =========================================================
   COMPONENT
========================================================= */

const FeeStructure = () => {
  const [feeStructure, setFeeStructure] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [modalType, setModalType] = useState("success");

  const [modalMessage, setModalMessage] = useState("");

  const [confirmAction, setConfirmAction] = useState(null);

  /* =======================================================
     LOAD
  ======================================================= */

  const loadFeeStructure = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminFeeStructure();

      if (!response?.success) {
        throw new Error(response?.message || "Unable to load fee structure.");
      }

      setFeeStructure(response.data);
    } catch (err) {
      console.error("Fee Structure load error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load fee structure.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeeStructure();
  }, []);

  /* =======================================================
     GENERIC FIELD UPDATE
  ======================================================= */

  const updateField = (field, value) => {
    setFeeStructure((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  /* =======================================================
     COURSE UPDATE
  ======================================================= */

  const updateCourse = (courseIndex, field, value) => {
    setFeeStructure((previous) => {
      const courses = [...(previous.courses || [])];

      courses[courseIndex] = {
        ...courses[courseIndex],
        [field]: value,
      };

      return {
        ...previous,
        courses,
      };
    });
  };

  /* =======================================================
     FEE ROW UPDATE
  ======================================================= */

  const updateFeeRow = (courseIndex, rowIndex, field, value) => {
    setFeeStructure((previous) => {
      const courses = [...(previous.courses || [])];

      const course = {
        ...courses[courseIndex],
      };

      const feeRows = [...(course.feeRows || [])];

      feeRows[rowIndex] = {
        ...feeRows[rowIndex],
        [field]: value,
      };

      course.feeRows = feeRows;

      courses[courseIndex] = course;

      return {
        ...previous,
        courses,
      };
    });
  };

  /* =======================================================
     FEE AMOUNT UPDATE
  ======================================================= */

  const updateFeeAmount = (courseIndex, rowIndex, amountIndex, value) => {
    setFeeStructure((previous) => {
      const courses = [...(previous.courses || [])];

      const course = {
        ...courses[courseIndex],
      };

      const feeRows = [...(course.feeRows || [])];

      const amounts = [...(feeRows[rowIndex]?.amounts || [])];

      amounts[amountIndex] = value;

      feeRows[rowIndex] = {
        ...feeRows[rowIndex],
        amounts,
      };

      course.feeRows = feeRows;

      courses[courseIndex] = course;

      return {
        ...previous,
        courses,
      };
    });
  };

  /* =======================================================
     ADD COURSE
  ======================================================= */

  const addCourse = () => {
    setFeeStructure((previous) => {
      const courses = [...(previous.courses || [])];

      courses.push({
        ...emptyCourse(),
        displayOrder: courses.length + 1,
      });

      return {
        ...previous,
        courses,
      };
    });
  };

  /* =======================================================
     DELETE COURSE
  ======================================================= */

  const deleteCourse = (courseIndex) => {
    setFeeStructure((previous) => {
      const courses = [...(previous.courses || [])];

      courses.splice(courseIndex, 1);

      return {
        ...previous,
        courses,
      };
    });
  };

  /* =======================================================
     ADD FEE ROW
  ======================================================= */

  const addFeeRow = (courseIndex) => {
    setFeeStructure((previous) => {
      const courses = [...(previous.courses || [])];

      const course = {
        ...courses[courseIndex],
      };

      const feeRows = [...(course.feeRows || [])];

      feeRows.push({
        ...emptyFeeRow(),
        displayOrder: feeRows.length + 1,
      });

      course.feeRows = feeRows;

      courses[courseIndex] = course;

      return {
        ...previous,
        courses,
      };
    });
  };

  /* =======================================================
     DELETE FEE ROW
  ======================================================= */

  const deleteFeeRow = (courseIndex, rowIndex) => {
    setFeeStructure((previous) => {
      const courses = [...(previous.courses || [])];

      const course = {
        ...courses[courseIndex],
      };

      const feeRows = [...(course.feeRows || [])];

      feeRows.splice(rowIndex, 1);

      course.feeRows = feeRows;

      courses[courseIndex] = course;

      return {
        ...previous,
        courses,
      };
    });
  };

  /* =======================================================
     ADD AMOUNT COLUMN
  ======================================================= */

  const addAmountColumn = (courseIndex) => {
    setFeeStructure((previous) => {
      const courses = [...(previous.courses || [])];

      const course = {
        ...courses[courseIndex],
      };

      const feeRows = [...(course.feeRows || [])];

      feeRows.forEach((row) => {
        row.amounts = [...(row.amounts || []), ""];
      });

      course.feeRows = feeRows;

      courses[courseIndex] = course;

      return {
        ...previous,
        courses,
      };
    });
  };

  /* =======================================================
     REMOVE AMOUNT COLUMN
  ======================================================= */

  const removeAmountColumn = (courseIndex, amountIndex) => {
    setFeeStructure((previous) => {
      const courses = [...(previous.courses || [])];

      const course = {
        ...courses[courseIndex],
      };

      const feeRows = [...(course.feeRows || [])];

      feeRows.forEach((row) => {
        const amounts = [...(row.amounts || [])];

        amounts.splice(amountIndex, 1);

        row.amounts = amounts;
      });

      course.feeRows = feeRows;

      courses[courseIndex] = course;

      return {
        ...previous,
        courses,
      };
    });
  };

  /* =======================================================
     HOSTEL UPDATE
  ======================================================= */

  const updateHostel = (hostelIndex, field, value) => {
    setFeeStructure((previous) => {
      const hostels = [...(previous.hostels || [])];

      hostels[hostelIndex] = {
        ...hostels[hostelIndex],
        [field]: value,
      };

      return {
        ...previous,
        hostels,
      };
    });
  };

  /* =======================================================
     HOSTEL ROW UPDATE
  ======================================================= */

  const updateHostelRow = (hostelIndex, rowIndex, field, value) => {
    setFeeStructure((previous) => {
      const hostels = [...(previous.hostels || [])];

      const hostel = {
        ...hostels[hostelIndex],
      };

      const rows = [...(hostel.rows || [])];

      rows[rowIndex] = {
        ...rows[rowIndex],
        [field]: value,
      };

      hostel.rows = rows;

      hostels[hostelIndex] = hostel;

      return {
        ...previous,
        hostels,
      };
    });
  };

  /* =======================================================
     ADD HOSTEL
  ======================================================= */

  const addHostel = () => {
    setFeeStructure((previous) => {
      const hostels = [...(previous.hostels || [])];

      hostels.push({
        ...emptyHostel(),
        displayOrder: hostels.length + 1,
      });

      return {
        ...previous,
        hostels,
      };
    });
  };

  /* =======================================================
     DELETE HOSTEL
  ======================================================= */

  const deleteHostel = (hostelIndex) => {
    setFeeStructure((previous) => {
      const hostels = [...(previous.hostels || [])];

      hostels.splice(hostelIndex, 1);

      return {
        ...previous,
        hostels,
      };
    });
  };

  /* =======================================================
     ADD HOSTEL ROW
  ======================================================= */

  const addHostelRow = (hostelIndex) => {
    setFeeStructure((previous) => {
      const hostels = [...(previous.hostels || [])];

      const hostel = {
        ...hostels[hostelIndex],
      };

      const rows = [...(hostel.rows || [])];

      rows.push({
        ...emptyHostelRow(),
        displayOrder: rows.length + 1,
      });

      hostel.rows = rows;

      hostels[hostelIndex] = hostel;

      return {
        ...previous,
        hostels,
      };
    });
  };

  /* =======================================================
     DELETE HOSTEL ROW
  ======================================================= */

  const deleteHostelRow = (hostelIndex, rowIndex) => {
    setFeeStructure((previous) => {
      const hostels = [...(previous.hostels || [])];

      const hostel = {
        ...hostels[hostelIndex],
      };

      const rows = [...(hostel.rows || [])];

      rows.splice(rowIndex, 1);

      hostel.rows = rows;

      hostels[hostelIndex] = hostel;

      return {
        ...previous,
        hostels,
      };
    });
  };

  /* =======================================================
     PAYMENT UPDATE
  ======================================================= */

  const updatePaymentOption = (index, value) => {
    setFeeStructure((previous) => {
      const paymentOptions = [...(previous.paymentOptions || [])];

      paymentOptions[index] = {
        ...paymentOptions[index],
        title: value,
      };

      return {
        ...previous,
        paymentOptions,
      };
    });
  };

  const addPaymentOption = () => {
    setFeeStructure((previous) => {
      const paymentOptions = [...(previous.paymentOptions || [])];

      paymentOptions.push(emptyPaymentOption());

      return {
        ...previous,
        paymentOptions,
      };
    });
  };

  const deletePaymentOption = (index) => {
    setFeeStructure((previous) => {
      const paymentOptions = [...(previous.paymentOptions || [])];

      paymentOptions.splice(index, 1);

      return {
        ...previous,
        paymentOptions,
      };
    });
  };

  /* =======================================================
     SCHOLARSHIP UPDATE
  ======================================================= */

  const updateScholarship = (index, field, value) => {
    setFeeStructure((previous) => {
      const scholarships = [...(previous.scholarships || [])];

      scholarships[index] = {
        ...scholarships[index],
        [field]: value,
      };

      return {
        ...previous,
        scholarships,
      };
    });
  };

  const addScholarship = () => {
    setFeeStructure((previous) => {
      const scholarships = [...(previous.scholarships || [])];

      scholarships.push(emptyScholarship());

      return {
        ...previous,
        scholarships,
      };
    });
  };

  const deleteScholarship = (index) => {
    setFeeStructure((previous) => {
      const scholarships = [...(previous.scholarships || [])];

      scholarships.splice(index, 1);

      return {
        ...previous,
        scholarships,
      };
    });
  };

  /* =======================================================
     LOAN UPDATE
  ======================================================= */

  const updateLoan = (index, field, value) => {
    setFeeStructure((previous) => {
      const educationLoans = [...(previous.educationLoans || [])];

      educationLoans[index] = {
        ...educationLoans[index],
        [field]: value,
      };

      return {
        ...previous,
        educationLoans,
      };
    });
  };

  const addLoan = () => {
    setFeeStructure((previous) => {
      const educationLoans = [...(previous.educationLoans || [])];

      educationLoans.push(emptyLoan());

      return {
        ...previous,
        educationLoans,
      };
    });
  };

  const deleteLoan = (index) => {
    setFeeStructure((previous) => {
      const educationLoans = [...(previous.educationLoans || [])];

      educationLoans.splice(index, 1);

      return {
        ...previous,
        educationLoans,
      };
    });
  };

  /* =======================================================
     IMPORTANT NOTE
  ======================================================= */

  const updateImportantNote = (index, value) => {
    setFeeStructure((previous) => {
      const importantNotes = [...(previous.importantNotes || [])];

      importantNotes[index] = value;

      return {
        ...previous,
        importantNotes,
      };
    });
  };

  const addImportantNote = () => {
    setFeeStructure((previous) => {
      const importantNotes = [...(previous.importantNotes || [])];

      importantNotes.push("");

      return {
        ...previous,
        importantNotes,
      };
    });
  };

  const deleteImportantNote = (index) => {
    setFeeStructure((previous) => {
      const importantNotes = [...(previous.importantNotes || [])];

      importantNotes.splice(index, 1);

      return {
        ...previous,
        importantNotes,
      };
    });
  };

  /* =======================================================
     SUCCESS MODAL
  ======================================================= */

  const showMessage = (message, type = "success") => {
    setModalType(type);

    setModalMessage(message);

    setShowModal(true);
  };

  /* =======================================================
     SAVE
  ======================================================= */

  const handleSave = async () => {
    try {
      setSaving(true);

      setError("");

      const response = await updateFeeStructure(feeStructure);

      if (!response?.success) {
        throw new Error(response?.message || "Unable to save fee structure.");
      }

      setFeeStructure(response.data);

      showMessage("Fee Structure has been updated successfully.");
    } catch (err) {
      console.error("Save Fee Structure error:", err);

      showMessage(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to save fee structure.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     PUBLISH
  ======================================================= */

  const handlePublish = async () => {
    try {
      setSaving(true);

      const response = await publishFeeStructure();

      if (!response?.success) {
        throw new Error(
          response?.message || "Unable to publish fee structure.",
        );
      }

      setFeeStructure(response.data);

      showMessage("Fee Structure has been published successfully.");
    } catch (err) {
      showMessage(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to publish fee structure.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     UNPUBLISH
  ======================================================= */

  const handleUnpublish = async () => {
    try {
      setSaving(true);

      const response = await unpublishFeeStructure();

      if (!response?.success) {
        throw new Error(
          response?.message || "Unable to unpublish fee structure.",
        );
      }

      setFeeStructure(response.data);

      showMessage("Fee Structure has been unpublished successfully.");
    } catch (err) {
      showMessage(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to unpublish fee structure.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     RESET
  ======================================================= */

  const handleReset = async () => {
    try {
      setSaving(true);

      const response = await resetFeeStructure();

      if (!response?.success) {
        throw new Error(response?.message || "Unable to reset fee structure.");
      }

      setFeeStructure(response.data);

      showMessage("Fee Structure has been reset to default successfully.");
    } catch (err) {
      showMessage(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to reset fee structure.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     CONFIRM ACTION
  ======================================================= */

  const requestAction = (action) => {
    setConfirmAction(action);
  };

  const executeConfirmedAction = async () => {
    const action = confirmAction;

    setConfirmAction(null);

    if (action === "reset") {
      await handleReset();
    }

    if (action === "publish") {
      await handlePublish();
    }

    if (action === "unpublish") {
      await handleUnpublish();
    }
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="feeAdminPage">
        <div className="feeAdminLoading">
          <Spinner animation="border" />

          <p>Loading Fee Structure...</p>
        </div>
      </div>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error && !feeStructure) {
    return (
      <div className="feeAdminPage">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  if (!feeStructure) {
    return null;
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="feeAdminPage">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="feeAdminHeader">
        <div>
          <span>ADMISSIONS CMS</span>

          <h1>Fee Structure</h1>

          <p>
            Manage programme fees, hostel charges, scholarships and payment
            information.
          </p>
        </div>

        <div className="feeAdminHeaderActions">
          <div
            className={
              feeStructure.isPublished
                ? "feeStatus published"
                : "feeStatus unpublished"
            }
          >
            <span />

            {feeStructure.isPublished ? "Published" : "Unpublished"}
          </div>

          <Button
            className="feeResetButton"
            disabled={saving}
            onClick={() => requestAction("reset")}
          >
            Reset Default
          </Button>

          {feeStructure.isPublished ? (
            <Button
              className="feeUnpublishButton"
              disabled={saving}
              onClick={() => requestAction("unpublish")}
            >
              Unpublish
            </Button>
          ) : (
            <Button
              className="feePublishButton"
              disabled={saving}
              onClick={() => requestAction("publish")}
            >
              Publish
            </Button>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* =================================================
          BASIC INFORMATION
      ================================================= */}

      <section className="feeAdminCard">
        <div className="feeSectionHeader">
          <div>
            <span>SECTION 01</span>

            <h2>Basic Information</h2>
          </div>
        </div>

        <div className="feeAdminGrid">
          <Form.Group>
            <Form.Label>Page Title</Form.Label>

            <Form.Control
              value={feeStructure.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Academic Year</Form.Label>

            <Form.Control
              value={feeStructure.academicYear || ""}
              onChange={(e) => updateField("academicYear", e.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Subtitle</Form.Label>

            <Form.Control
              value={feeStructure.subtitle || ""}
              onChange={(e) => updateField("subtitle", e.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Hero Label</Form.Label>

            <Form.Control
              value={feeStructure.heroLabel || ""}
              onChange={(e) => updateField("heroLabel", e.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Hero Title</Form.Label>

            <Form.Control
              value={feeStructure.heroTitle || ""}
              onChange={(e) => updateField("heroTitle", e.target.value)}
            />
          </Form.Group>

          <Form.Group className="feeFullField">
            <Form.Label>Hero Description</Form.Label>

            <Form.Control
              as="textarea"
              rows={3}
              value={feeStructure.heroDescription || ""}
              onChange={(e) => updateField("heroDescription", e.target.value)}
            />
          </Form.Group>

          <Form.Group className="feeFullField">
            <Form.Label>General Note</Form.Label>

            <Form.Control
              as="textarea"
              rows={3}
              value={feeStructure.note || ""}
              onChange={(e) => updateField("note", e.target.value)}
            />
          </Form.Group>
        </div>
      </section>

      {/* =================================================
          COURSE FEES
      ================================================= */}

      <section className="feeAdminCard">
        <div className="feeSectionHeader">
          <div>
            <span>SECTION 02</span>

            <h2>Programme Fee Structure</h2>
          </div>

          <Button className="feeAddButton" onClick={addCourse}>
            + Add Course
          </Button>
        </div>

        <div className="feeCourseList">
          {(feeStructure.courses || []).map((course, courseIndex) => (
            <div className="feeCourseCard" key={course._id || courseIndex}>
              <div className="feeCourseHeader">
                <div>
                  <span>
                    PROGRAMME {String(courseIndex + 1).padStart(2, "0")}
                  </span>

                  <h3>{course.courseName || "New Course"}</h3>
                </div>

                <Button
                  className="feeDeleteButton"
                  onClick={() => deleteCourse(courseIndex)}
                >
                  Delete Course
                </Button>
              </div>

              <div className="feeAdminGrid">
                <Form.Group>
                  <Form.Label>Course Name</Form.Label>

                  <Form.Control
                    value={course.courseName || ""}
                    onChange={(e) =>
                      updateCourse(courseIndex, "courseName", e.target.value)
                    }
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Number of Years</Form.Label>

                  <Form.Control
                    type="number"
                    min="1"
                    value={course.years || ""}
                    onChange={(e) =>
                      updateCourse(courseIndex, "years", Number(e.target.value))
                    }
                  />
                </Form.Group>
              </div>

              <div className="feeRowsHeader">
                <h4>Fee Details</h4>

                <div>
                  <Button
                    className="feeSmallButton"
                    onClick={() => addFeeRow(courseIndex)}
                  >
                    + Add Fee Row
                  </Button>

                  <Button
                    className="feeSmallButton"
                    onClick={() => addAmountColumn(courseIndex)}
                  >
                    + Add Year
                  </Button>
                </div>
              </div>

              <div className="feeRows">
                {(course.feeRows || []).map((row, rowIndex) => (
                  <div className="feeRowEditor" key={row._id || rowIndex}>
                    <Form.Control
                      className="feeParticularInput"
                      placeholder="Particular"
                      value={row.particulars || ""}
                      onChange={(e) =>
                        updateFeeRow(
                          courseIndex,
                          rowIndex,
                          "particulars",
                          e.target.value,
                        )
                      }
                    />

                    <div className="feeAmountInputs">
                      {(row.amounts || []).map((amount, amountIndex) => (
                        <Form.Control
                          key={amountIndex}
                          placeholder={`Year ${amountIndex + 1}`}
                          value={amount || ""}
                          onChange={(e) =>
                            updateFeeAmount(
                              courseIndex,
                              rowIndex,
                              amountIndex,
                              e.target.value,
                            )
                          }
                        />
                      ))}
                    </div>

                    <Button
                      className="feeRowDelete"
                      onClick={() => deleteFeeRow(courseIndex, rowIndex)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>

              {(course.feeRows?.[0]?.amounts?.length || 0) > 1 && (
                <div className="feeYearRemove">
                  <span>Remove last year column:</span>

                  <Button
                    onClick={() =>
                      removeAmountColumn(
                        courseIndex,
                        course.feeRows[0].amounts.length - 1,
                      )
                    }
                  >
                    Remove Year
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* =================================================
          HOSTEL
      ================================================= */}

      <section className="feeAdminCard">
        <div className="feeSectionHeader">
          <div>
            <span>SECTION 03</span>

            <h2>Hostel Fee</h2>
          </div>

          <Button className="feeAddButton" onClick={addHostel}>
            + Add Hostel
          </Button>
        </div>

        <div className="feeHostelList">
          {(feeStructure.hostels || []).map((hostel, hostelIndex) => (
            <div className="feeHostelCard" key={hostel._id || hostelIndex}>
              <div className="feeCourseHeader">
                <div>
                  <span>HOSTEL {String(hostelIndex + 1).padStart(2, "0")}</span>

                  <h3>{hostel.hostelName || "New Hostel"}</h3>
                </div>

                <Button
                  className="feeDeleteButton"
                  onClick={() => deleteHostel(hostelIndex)}
                >
                  Delete Hostel
                </Button>
              </div>

              <div className="feeAdminGrid">
                <Form.Group>
                  <Form.Label>Hostel Name</Form.Label>

                  <Form.Control
                    value={hostel.hostelName || ""}
                    onChange={(e) =>
                      updateHostel(hostelIndex, "hostelName", e.target.value)
                    }
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Location</Form.Label>

                  <Form.Control
                    value={hostel.locationLabel || ""}
                    onChange={(e) =>
                      updateHostel(hostelIndex, "locationLabel", e.target.value)
                    }
                  />
                </Form.Group>
              </div>

              <div className="feeRowsHeader">
                <h4>Charges</h4>

                <Button
                  className="feeSmallButton"
                  onClick={() => addHostelRow(hostelIndex)}
                >
                  + Add Charge
                </Button>
              </div>

              <div className="feeRows">
                {(hostel.rows || []).map((row, rowIndex) => (
                  <div className="feeRowEditor" key={row._id || rowIndex}>
                    <Form.Control
                      placeholder="Charge Name"
                      value={row.title || ""}
                      onChange={(e) =>
                        updateHostelRow(
                          hostelIndex,
                          rowIndex,
                          "title",
                          e.target.value,
                        )
                      }
                    />

                    <Form.Control
                      placeholder="Amount"
                      value={row.amount || ""}
                      onChange={(e) =>
                        updateHostelRow(
                          hostelIndex,
                          rowIndex,
                          "amount",
                          e.target.value,
                        )
                      }
                    />

                    <Button
                      className="feeRowDelete"
                      onClick={() => deleteHostelRow(hostelIndex, rowIndex)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =================================================
          PAYMENT OPTIONS
      ================================================= */}

      <section className="feeAdminCard">
        <div className="feeSectionHeader">
          <div>
            <span>SECTION 04</span>

            <h2>Payment Options</h2>
          </div>

          <Button className="feeAddButton" onClick={addPaymentOption}>
            + Add Option
          </Button>
        </div>

        <div className="feeSimpleList">
          {(feeStructure.paymentOptions || []).map((option, index) => (
            <div className="feeSimpleRow" key={option._id || index}>
              <span>{index + 1}</span>

              <Form.Control
                value={option.title || ""}
                onChange={(e) => updatePaymentOption(index, e.target.value)}
              />

              <Button
                className="feeRowDelete"
                onClick={() => deletePaymentOption(index)}
              >
                ×
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* =================================================
          SCHOLARSHIPS
      ================================================= */}

      <section className="feeAdminCard">
        <div className="feeSectionHeader">
          <div>
            <span>SECTION 05</span>

            <h2>Scholarships</h2>
          </div>

          <Button className="feeAddButton" onClick={addScholarship}>
            + Add Scholarship
          </Button>
        </div>

        <div className="feeContentList">
          {(feeStructure.scholarships || []).map((item, index) => (
            <div className="feeContentEditor" key={item._id || index}>
              <div className="feeContentNumber">{index + 1}</div>

              <div className="feeContentFields">
                <Form.Control
                  placeholder="Scholarship Title"
                  value={item.title || ""}
                  onChange={(e) =>
                    updateScholarship(index, "title", e.target.value)
                  }
                />

                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Scholarship Description"
                  value={item.description || ""}
                  onChange={(e) =>
                    updateScholarship(index, "description", e.target.value)
                  }
                />
              </div>

              <Button
                className="feeRowDelete"
                onClick={() => deleteScholarship(index)}
              >
                ×
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* =================================================
          EDUCATION LOANS
      ================================================= */}

      <section className="feeAdminCard">
        <div className="feeSectionHeader">
          <div>
            <span>SECTION 06</span>

            <h2>Education Loans</h2>
          </div>

          <Button className="feeAddButton" onClick={addLoan}>
            + Add Loan Information
          </Button>
        </div>

        <div className="feeContentList">
          {(feeStructure.educationLoans || []).map((item, index) => (
            <div className="feeContentEditor" key={item._id || index}>
              <div className="feeContentNumber">{index + 1}</div>

              <div className="feeContentFields">
                <Form.Control
                  placeholder="Title"
                  value={item.title || ""}
                  onChange={(e) => updateLoan(index, "title", e.target.value)}
                />

                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Description"
                  value={item.description || ""}
                  onChange={(e) =>
                    updateLoan(index, "description", e.target.value)
                  }
                />
              </div>

              <Button
                className="feeRowDelete"
                onClick={() => deleteLoan(index)}
              >
                ×
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* =================================================
          IMPORTANT NOTES
      ================================================= */}

      <section className="feeAdminCard">
        <div className="feeSectionHeader">
          <div>
            <span>SECTION 07</span>

            <h2>Important Notes</h2>
          </div>

          <Button className="feeAddButton" onClick={addImportantNote}>
            + Add Note
          </Button>
        </div>

        <div className="feeNotesList">
          {(feeStructure.importantNotes || []).map((note, index) => (
            <div className="feeNoteRow" key={index}>
              <span>{index + 1}</span>

              <Form.Control
                as="textarea"
                rows={2}
                value={note || ""}
                onChange={(e) => updateImportantNote(index, e.target.value)}
              />

              <Button
                className="feeRowDelete"
                onClick={() => deleteImportantNote(index)}
              >
                ×
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* =================================================
          SAVE
      ================================================= */}

      <div className="feeAdminBottomActions">
        <Button
          className="feeSaveButton"
          disabled={saving}
          onClick={handleSave}
        >
          {saving ? (
            <>
              <Spinner animation="border" size="sm" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>

      {/* =================================================
          MESSAGE MODAL
      ================================================= */}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === "success" ? "Success" : "Error"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div
            className={
              modalType === "success"
                ? "feeModalMessage success"
                : "feeModalMessage error"
            }
          >
            <div className="feeModalIcon">
              {modalType === "success" ? "✓" : "!"}
            </div>

            <div>
              <h4>
                {modalType === "success"
                  ? "Successfully Completed"
                  : "Something Went Wrong"}
              </h4>

              <p>{modalMessage}</p>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant={modalType === "success" ? "primary" : "danger"}
            onClick={() => setShowModal(false)}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      {/* =================================================
          CONFIRM MODAL
      ================================================= */}

      <Modal
        show={Boolean(confirmAction)}
        onHide={() => setConfirmAction(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Action</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {confirmAction === "reset" && (
            <p>
              Are you sure you want to reset the Fee Structure to the default
              data?
              <br />
              <strong>Your current changes will be replaced.</strong>
            </p>
          )}

          {confirmAction === "publish" && (
            <p>Publish the current Fee Structure on the public website?</p>
          )}

          {confirmAction === "unpublish" && (
            <p>Unpublish the Fee Structure from the public website?</p>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmAction(null)}>
            Cancel
          </Button>

          <Button
            variant={confirmAction === "unpublish" ? "danger" : "primary"}
            onClick={executeConfirmedAction}
            disabled={saving}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FeeStructure;
