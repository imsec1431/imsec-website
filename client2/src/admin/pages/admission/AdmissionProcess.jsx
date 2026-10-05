import React, { useEffect, useState } from "react";

import { Modal, Button, Spinner } from "react-bootstrap";

import {
  FaSave,
  FaUndo,
  FaPlus,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

import {
  getAdminAdmissionProcess,
  updateAdmissionProcess,
  publishAdmissionProcess,
  unpublishAdmissionProcess,
  resetAdmissionProcess,
} from "../../services/admissionProcessService";

import "./AdmissionProcess.css";

/* =========================================================
   EMPTY / DEFAULT FORM
========================================================= */

const emptyForm = {
  heroTag: "Admissions Open for this Session",

  heroTitle: "Admission",

  heroTitleHighlight: "Process",

  heroDescription:
    "Begin your journey toward academic excellence with IMS Engineering College. Our admission process is transparent, student-friendly and designed to make your enrollment simple and hassle-free.",

  applyButtonText: "Apply Now",

  brochureButtonText: "Download Brochure",

  /* =====================================================
     JOURNEY
  ===================================================== */

  journeyLabel: "Admission Journey",

  journeyTitle: "Your Admission in 6 Simple Steps",

  journeyDescription:
    "Follow these simple steps to complete your admission and become a part of the IMSEC family.",

  admissionSteps: [
    {
      id: 1,
      title: "Explore Programmes",
      description:
        "Choose the programme that matches your academic interests, career goals and eligibility.",
      icon: "search",
      displayOrder: 1,
    },

    {
      id: 2,
      title: "Check Eligibility",
      description:
        "Review the eligibility criteria and make sure you meet the required academic qualifications.",
      icon: "check",
      displayOrder: 2,
    },

    {
      id: 3,
      title: "Apply for Admission",
      description:
        "Complete the admission application through the applicable admission channel.",
      icon: "edit",
      displayOrder: 3,
    },

    {
      id: 4,
      title: "Document Verification",
      description:
        "Submit the required documents for verification by the admission team.",
      icon: "file",
      displayOrder: 4,
    },

    {
      id: 5,
      title: "Fee Submission",
      description:
        "After confirmation of admission, complete the required fee payment within the prescribed time.",
      icon: "payment",
      displayOrder: 5,
    },

    {
      id: 6,
      title: "Admission Confirmation",
      description:
        "Complete the final formalities and become an official member of the IMSEC academic community.",
      icon: "university",
      displayOrder: 6,
    },
  ],

  /* =====================================================
     ELIGIBILITY
  ===================================================== */

  eligibilityLabel: "Eligibility",

  eligibilityTitle: "Programme Eligibility Criteria",

  eligibilityDescription:
    "Before applying, ensure that you meet the minimum eligibility requirements for your desired programme.",

  eligibility: [
    {
      course: "B.Tech",
      qualification: "10+2 / Intermediate or equivalent examination",
      marks: "As per current UPTAC / university eligibility norms",
      displayOrder: 1,
    },

    {
      course: "MCA",
      qualification:
        "Bachelor's degree with Mathematics / relevant eligibility",
      marks: "As per current university / admission authority norms",
      displayOrder: 2,
    },

    {
      course: "MBA",
      qualification: "Bachelor's degree from a recognized university",
      marks: "As per current university / admission authority norms",
      displayOrder: 3,
    },

    {
      course: "M.Tech",
      qualification: "Relevant Bachelor's degree in Engineering / Technology",
      marks: "As per current university / admission authority norms",
      displayOrder: 4,
    },
  ],

  /* =====================================================
     ADMISSION MODES
  ===================================================== */

  admissionModeLabel: "Admission Modes",

  admissionModeTitle: "Choose Your Admission Path",

  admissionModeDescription:
    "Students can secure admission through different admission channels as per university and institute guidelines.",

  admissionModes: [
    {
      title: "UPTAC Counselling",

      description:
        "Admission through the Uttar Pradesh Technical Admission Counselling process as applicable to the programme.",

      displayOrder: 1,
    },

    {
      title: "Direct Admission",

      description:
        "Eligible candidates may apply directly to the institute as per applicable rules and seat availability.",

      displayOrder: 2,
    },

    {
      title: "Management / Institute Level",

      description:
        "Admission may be available through institute-level seats according to applicable regulations.",

      displayOrder: 3,
    },

    {
      title: "Lateral Entry",

      description:
        "Eligible candidates may apply for lateral entry programmes wherever applicable.",

      displayOrder: 4,
    },
  ],

  /* =====================================================
     DOCUMENTS
  ===================================================== */

  documentLabel: "Documents Required",

  documentTitle: "Admission Checklist",

  documentDescription:
    "Keep the following documents ready before reporting for admission.",

  requiredDocuments: [
    {
      title: "10th Marksheet / Certificate",
      displayOrder: 1,
    },

    {
      title: "12th Marksheet / Certificate",
      displayOrder: 2,
    },

    {
      title: "Graduation Marksheet / Degree",
      displayOrder: 3,
    },

    {
      title: "Transfer Certificate",
      displayOrder: 4,
    },

    {
      title: "Migration Certificate",
      displayOrder: 5,
    },

    {
      title: "Character Certificate",
      displayOrder: 6,
    },

    {
      title: "Category Certificate, if applicable",
      displayOrder: 7,
    },

    {
      title: "Recent Passport Size Photographs",
      displayOrder: 8,
    },

    {
      title: "Valid Government ID Proof",
      displayOrder: 9,
    },
  ],

  /* =====================================================
     IMPORTANT DATES
  ===================================================== */

  importantDatesEnabled: false,

  importantDateLabel: "Admission Schedule",

  importantDateTitle: "Important Dates",

  isPublished: true,
};

/* =========================================================
   COMPONENT
========================================================= */

const AdmissionProcess = () => {
  /* =======================================================
     FORM
  ======================================================= */

  const [form, setForm] = useState(emptyForm);

  /* =======================================================
     LOADING
  ======================================================= */

  const [loading, setLoading] = useState(true);

  /* =======================================================
     SAVING
  ======================================================= */

  const [saving, setSaving] = useState(false);

  /* =======================================================
     ERROR
  ======================================================= */

  const [error, setError] = useState("");

  /* =======================================================
     MODAL
  ======================================================= */

  const [showModal, setShowModal] = useState(false);

  const [modalTitle, setModalTitle] = useState("");

  const [modalMessage, setModalMessage] = useState("");

  const [modalType, setModalType] = useState("success");

  /* =======================================================
     LOAD DATA
  ======================================================= */

  const loadData = async () => {
    try {
      setLoading(true);

      setError("");

      const response = await getAdminAdmissionProcess();

      const data = response?.data;

      if (!data) {
        throw new Error("Admission process data not found.");
      }

      setForm({
        ...emptyForm,

        ...data,

        admissionSteps: Array.isArray(data.admissionSteps)
          ? data.admissionSteps
          : emptyForm.admissionSteps,

        eligibility: Array.isArray(data.eligibility)
          ? data.eligibility
          : emptyForm.eligibility,

        admissionModes: Array.isArray(data.admissionModes)
          ? data.admissionModes
          : emptyForm.admissionModes,

        requiredDocuments: Array.isArray(data.requiredDocuments)
          ? data.requiredDocuments
          : emptyForm.requiredDocuments,
      });
    } catch (err) {
      console.error("Admission process loading error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load admission process.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    loadData();
  }, []);

  /* =======================================================
     SIMPLE INPUT CHANGE
  ======================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,

      [name]: value,
    }));
  };

  /* =======================================================
     CHECKBOX CHANGE
  ======================================================= */

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;

    setForm((previous) => ({
      ...previous,

      [name]: checked,
    }));
  };

  /* =======================================================
     STEP CHANGE
  ======================================================= */

  const handleStepChange = (index, field, value) => {
    setForm((previous) => {
      const steps = [...previous.admissionSteps];

      steps[index] = {
        ...steps[index],

        [field]: value,
      };

      return {
        ...previous,

        admissionSteps: steps,
      };
    });
  };

  /* =======================================================
     ADD STEP
  ======================================================= */

  const addStep = () => {
    setForm((previous) => {
      const steps = previous.admissionSteps;

      const nextId =
        steps.length > 0
          ? Math.max(...steps.map((item) => Number(item.id || 0))) + 1
          : 1;

      return {
        ...previous,

        admissionSteps: [
          ...steps,

          {
            id: nextId,

            title: "New Admission Step",

            description: "Enter admission step description.",

            icon: "file",

            displayOrder: steps.length + 1,
          },
        ],
      };
    });
  };

  /* =======================================================
     REMOVE STEP
  ======================================================= */

  const removeStep = (index) => {
    setForm((previous) => {
      const steps = previous.admissionSteps
        .filter((_, itemIndex) => itemIndex !== index)
        .map((item, itemIndex) => ({
          ...item,

          displayOrder: itemIndex + 1,
        }));

      return {
        ...previous,

        admissionSteps: steps,
      };
    });
  };

  /* =======================================================
     MOVE STEP
  ======================================================= */

  const moveStep = (index, direction) => {
    setForm((previous) => {
      const steps = [...previous.admissionSteps];

      const target = index + direction;

      if (target < 0 || target >= steps.length) {
        return previous;
      }

      [steps[index], steps[target]] = [steps[target], steps[index]];

      const updated = steps.map((item, itemIndex) => ({
        ...item,

        displayOrder: itemIndex + 1,
      }));

      return {
        ...previous,

        admissionSteps: updated,
      };
    });
  };

  /* =======================================================
     ELIGIBILITY CHANGE
  ======================================================= */

  const handleEligibilityChange = (index, field, value) => {
    setForm((previous) => {
      const items = [...previous.eligibility];

      items[index] = {
        ...items[index],

        [field]: value,
      };

      return {
        ...previous,

        eligibility: items,
      };
    });
  };

  /* =======================================================
     ADD ELIGIBILITY
  ======================================================= */

  const addEligibility = () => {
    setForm((previous) => ({
      ...previous,

      eligibility: [
        ...previous.eligibility,

        {
          course: "New Programme",

          qualification: "Enter qualification",

          marks: "Enter eligibility marks",

          displayOrder: previous.eligibility.length + 1,
        },
      ],
    }));
  };

  /* =======================================================
     REMOVE ELIGIBILITY
  ======================================================= */

  const removeEligibility = (index) => {
    setForm((previous) => ({
      ...previous,

      eligibility: previous.eligibility
        .filter((_, itemIndex) => itemIndex !== index)
        .map((item, itemIndex) => ({
          ...item,

          displayOrder: itemIndex + 1,
        })),
    }));
  };

  /* =======================================================
     ADMISSION MODE CHANGE
  ======================================================= */

  const handleModeChange = (index, field, value) => {
    setForm((previous) => {
      const modes = [...previous.admissionModes];

      modes[index] = {
        ...modes[index],

        [field]: value,
      };

      return {
        ...previous,

        admissionModes: modes,
      };
    });
  };

  /* =======================================================
     ADD MODE
  ======================================================= */

  const addMode = () => {
    setForm((previous) => ({
      ...previous,

      admissionModes: [
        ...previous.admissionModes,

        {
          title: "New Admission Mode",

          description: "Enter admission mode description.",

          displayOrder: previous.admissionModes.length + 1,
        },
      ],
    }));
  };

  /* =======================================================
     REMOVE MODE
  ======================================================= */

  const removeMode = (index) => {
    setForm((previous) => ({
      ...previous,

      admissionModes: previous.admissionModes
        .filter((_, itemIndex) => itemIndex !== index)
        .map((item, itemIndex) => ({
          ...item,

          displayOrder: itemIndex + 1,
        })),
    }));
  };

  /* =======================================================
     DOCUMENT CHANGE
  ======================================================= */

  const handleDocumentChange = (index, value) => {
    setForm((previous) => {
      const documents = [...previous.requiredDocuments];

      documents[index] = {
        ...documents[index],

        title: value,
      };

      return {
        ...previous,

        requiredDocuments: documents,
      };
    });
  };

  /* =======================================================
     ADD DOCUMENT
  ======================================================= */

  const addDocument = () => {
    setForm((previous) => ({
      ...previous,

      requiredDocuments: [
        ...previous.requiredDocuments,

        {
          title: "New Required Document",

          displayOrder: previous.requiredDocuments.length + 1,
        },
      ],
    }));
  };

  /* =======================================================
     REMOVE DOCUMENT
  ======================================================= */

  const removeDocument = (index) => {
    setForm((previous) => ({
      ...previous,

      requiredDocuments: previous.requiredDocuments
        .filter((_, itemIndex) => itemIndex !== index)
        .map((item, itemIndex) => ({
          ...item,

          displayOrder: itemIndex + 1,
        })),
    }));
  };

  /* =======================================================
     SHOW MESSAGE
  ======================================================= */

  const showMessage = (title, message, type = "success") => {
    setModalTitle(title);

    setModalMessage(message);

    setModalType(type);

    setShowModal(true);
  };

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validateForm = () => {
    if (!form.heroTitle.trim()) {
      return "Hero title is required.";
    }

    if (!form.heroDescription.trim()) {
      return "Hero description is required.";
    }

    for (const step of form.admissionSteps) {
      if (!step.title?.trim()) {
        return "Every admission step must have a title.";
      }

      if (!step.description?.trim()) {
        return "Every admission step must have a description.";
      }
    }

    for (const item of form.eligibility) {
      if (!item.course?.trim()) {
        return "Every eligibility row must have a programme.";
      }

      if (!item.qualification?.trim()) {
        return "Every eligibility row must have a qualification.";
      }
    }

    for (const item of form.admissionModes) {
      if (!item.title?.trim()) {
        return "Every admission mode must have a title.";
      }
    }

    for (const item of form.requiredDocuments) {
      if (!item.title?.trim()) {
        return "Every required document must have a title.";
      }
    }

    return "";
  };

  /* =======================================================
     SAVE
  ======================================================= */

  const handleSave = async () => {
    const validationError = validateForm();

    if (validationError) {
      showMessage("Validation Error", validationError, "error");

      return;
    }

    try {
      setSaving(true);

      setError("");

      const response = await updateAdmissionProcess(form);

      const updated = response?.data;

      if (updated) {
        setForm((previous) => ({
          ...previous,

          ...updated,

          admissionSteps: updated.admissionSteps || previous.admissionSteps,

          eligibility: updated.eligibility || previous.eligibility,

          admissionModes: updated.admissionModes || previous.admissionModes,

          requiredDocuments:
            updated.requiredDocuments || previous.requiredDocuments,
        }));
      }

      showMessage(
        "Saved Successfully",
        "Admission Process has been updated successfully.",
        "success",
      );
    } catch (err) {
      console.error("Admission process save error:", err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to save admission process.";

      setError(message);

      showMessage("Save Failed", message, "error");
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

      setError("");

      const response = await publishAdmissionProcess();

      setForm((previous) => ({
        ...previous,

        isPublished: true,
      }));

      showMessage(
        "Published Successfully",
        response?.message ||
          "Admission Process is now visible on the public website.",
        "success",
      );
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to publish Admission Process.";

      setError(message);

      showMessage("Publish Failed", message, "error");
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

      setError("");

      const response = await unpublishAdmissionProcess();

      setForm((previous) => ({
        ...previous,

        isPublished: false,
      }));

      showMessage(
        "Unpublished",
        response?.message ||
          "Admission Process has been removed from the public website.",
        "success",
      );
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to unpublish Admission Process.";

      setError(message);

      showMessage("Unpublish Failed", message, "error");
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     RESET DEFAULT
  ======================================================= */

  const handleReset = async () => {
    const confirmed = window.confirm(
      "Reset Admission Process to the original default content? Your current changes will be replaced.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);

      setError("");

      const response = await resetAdmissionProcess();

      const data = response?.data;

      if (data) {
        setForm({
          ...emptyForm,

          ...data,

          admissionSteps: data.admissionSteps || emptyForm.admissionSteps,

          eligibility: data.eligibility || emptyForm.eligibility,

          admissionModes: data.admissionModes || emptyForm.admissionModes,

          requiredDocuments:
            data.requiredDocuments || emptyForm.requiredDocuments,
        });
      }

      showMessage(
        "Reset Successfully",
        "Admission Process has been restored to the default content.",
        "success",
      );
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to reset Admission Process.";

      setError(message);

      showMessage("Reset Failed", message, "error");
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="admissionAdminPage">
        <div className="admissionAdminLoading">
          <Spinner animation="border" />

          <p>Loading Admission Process...</p>
        </div>
      </div>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div className="admissionAdminPage">
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="admissionAdminHeader">
        <div>
          <span>ADMISSIONS CMS</span>

          <h1>Admission Process</h1>

          <p>
            Manage the content displayed on the public Admission Process page.
          </p>
        </div>

        <div className="admissionAdminHeaderActions">
          <div
            className={
              form.isPublished
                ? "admissionStatus published"
                : "admissionStatus unpublished"
            }
          >
            <span></span>

            {form.isPublished ? "Published" : "Unpublished"}
          </div>

          <button
            type="button"
            className="admissionResetButton"
            onClick={handleReset}
            disabled={saving}
          >
            <FaUndo />
            Reset Default
          </button>

          {form.isPublished ? (
            <button
              type="button"
              className="admissionUnpublishButton"
              onClick={handleUnpublish}
              disabled={saving}
            >
              <FaEyeSlash />
              Unpublish
            </button>
          ) : (
            <button
              type="button"
              className="admissionPublishButton"
              onClick={handlePublish}
              disabled={saving}
            >
              <FaEye />
              Publish
            </button>
          )}

          <button
            type="button"
            className="admissionSaveButton"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? <Spinner size="sm" animation="border" /> : <FaSave />}

            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* ===================================================
          ERROR
      =================================================== */}

      {error && <div className="admissionAdminError">{error}</div>}

      {/* ===================================================
          HERO SECTION
      =================================================== */}

      <section className="admissionAdminCard">
        <div className="admissionAdminSectionHeader">
          <div>
            <span>SECTION 01</span>

            <h2>Hero Section</h2>
          </div>
        </div>

        <div className="admissionAdminGrid">
          <div className="admissionAdminField full">
            <label>Hero Tag</label>

            <input
              type="text"
              name="heroTag"
              value={form.heroTag}
              onChange={handleChange}
            />
          </div>

          <div className="admissionAdminField">
            <label>Main Title</label>

            <input
              type="text"
              name="heroTitle"
              value={form.heroTitle}
              onChange={handleChange}
            />
          </div>

          <div className="admissionAdminField">
            <label>Highlight Title</label>

            <input
              type="text"
              name="heroTitleHighlight"
              value={form.heroTitleHighlight}
              onChange={handleChange}
            />
          </div>

          <div className="admissionAdminField full">
            <label>Hero Description</label>

            <textarea
              name="heroDescription"
              value={form.heroDescription}
              onChange={handleChange}
              rows="5"
            />
          </div>

          <div className="admissionAdminField">
            <label>Apply Button Text</label>

            <input
              type="text"
              name="applyButtonText"
              value={form.applyButtonText}
              onChange={handleChange}
            />
          </div>

          <div className="admissionAdminField">
            <label>Brochure Button Text</label>

            <input
              type="text"
              name="brochureButtonText"
              value={form.brochureButtonText}
              onChange={handleChange}
            />
          </div>
        </div>
      </section>

      {/* ===================================================
          ADMISSION JOURNEY
      =================================================== */}

      <section className="admissionAdminCard">
        <div className="admissionAdminSectionHeader">
          <div>
            <span>SECTION 02</span>

            <h2>Admission Journey</h2>
          </div>

          <button
            type="button"
            className="admissionAddButton"
            onClick={addStep}
          >
            <FaPlus />
            Add Step
          </button>
        </div>

        <div className="admissionAdminGrid">
          <div className="admissionAdminField">
            <label>Section Label</label>

            <input
              type="text"
              name="journeyLabel"
              value={form.journeyLabel}
              onChange={handleChange}
            />
          </div>

          <div className="admissionAdminField">
            <label>Section Title</label>

            <input
              type="text"
              name="journeyTitle"
              value={form.journeyTitle}
              onChange={handleChange}
            />
          </div>

          <div className="admissionAdminField full">
            <label>Section Description</label>

            <textarea
              name="journeyDescription"
              value={form.journeyDescription}
              onChange={handleChange}
              rows="3"
            />
          </div>
        </div>

        <div className="admissionRepeatList">
          {form.admissionSteps.map((step, index) => (
            <div className="admissionRepeatItem" key={step.id || index}>
              <div className="admissionRepeatNumber">{index + 1}</div>

              <div className="admissionRepeatContent">
                <div className="admissionAdminGrid">
                  <div className="admissionAdminField">
                    <label>Step Title</label>

                    <input
                      type="text"
                      value={step.title || ""}
                      onChange={(e) =>
                        handleStepChange(index, "title", e.target.value)
                      }
                    />
                  </div>

                  <div className="admissionAdminField">
                    <label>Icon</label>

                    <input
                      type="text"
                      value={step.icon || ""}
                      onChange={(e) =>
                        handleStepChange(index, "icon", e.target.value)
                      }
                      placeholder="search / check / file"
                    />
                  </div>

                  <div className="admissionAdminField full">
                    <label>Description</label>

                    <textarea
                      value={step.description || ""}
                      onChange={(e) =>
                        handleStepChange(index, "description", e.target.value)
                      }
                      rows="3"
                    />
                  </div>
                </div>

                <div className="admissionRepeatActions">
                  <button
                    type="button"
                    onClick={() => moveStep(index, -1)}
                    disabled={index === 0}
                    title="Move Up"
                  >
                    <FaArrowUp />
                  </button>

                  <button
                    type="button"
                    onClick={() => moveStep(index, 1)}
                    disabled={index === form.admissionSteps.length - 1}
                    title="Move Down"
                  >
                    <FaArrowDown />
                  </button>

                  <button
                    type="button"
                    className="delete"
                    onClick={() => removeStep(index)}
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================================================
          ELIGIBILITY
      =================================================== */}

      <section className="admissionAdminCard">
        <div className="admissionAdminSectionHeader">
          <div>
            <span>SECTION 03</span>

            <h2>Eligibility</h2>
          </div>

          <button
            type="button"
            className="admissionAddButton"
            onClick={addEligibility}
          >
            <FaPlus />
            Add Programme
          </button>
        </div>

        <div className="admissionAdminGrid">
          <div className="admissionAdminField">
            <label>Section Label</label>

            <input
              type="text"
              name="eligibilityLabel"
              value={form.eligibilityLabel}
              onChange={handleChange}
            />
          </div>

          <div className="admissionAdminField">
            <label>Section Title</label>

            <input
              type="text"
              name="eligibilityTitle"
              value={form.eligibilityTitle}
              onChange={handleChange}
            />
          </div>

          <div className="admissionAdminField full">
            <label>Description</label>

            <textarea
              name="eligibilityDescription"
              value={form.eligibilityDescription}
              onChange={handleChange}
              rows="3"
            />
          </div>
        </div>

        <div className="admissionEligibilityList">
          {form.eligibility.map((item, index) => (
            <div className="admissionEligibilityItem" key={index}>
              <div className="admissionEligibilityIndex">{index + 1}</div>

              <div className="admissionAdminGrid">
                <div className="admissionAdminField">
                  <label>Programme</label>

                  <input
                    type="text"
                    value={item.course || ""}
                    onChange={(e) =>
                      handleEligibilityChange(index, "course", e.target.value)
                    }
                  />
                </div>

                <div className="admissionAdminField">
                  <label>Marks / Requirement</label>

                  <input
                    type="text"
                    value={item.marks || ""}
                    onChange={(e) =>
                      handleEligibilityChange(index, "marks", e.target.value)
                    }
                  />
                </div>

                <div className="admissionAdminField full">
                  <label>Qualification</label>

                  <textarea
                    value={item.qualification || ""}
                    onChange={(e) =>
                      handleEligibilityChange(
                        index,
                        "qualification",
                        e.target.value,
                      )
                    }
                    rows="3"
                  />
                </div>
              </div>

              <button
                type="button"
                className="admissionDeleteStandalone"
                onClick={() => removeEligibility(index)}
                title="Delete Programme"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ===================================================
          ADMISSION MODES
      =================================================== */}

      <section className="admissionAdminCard">
        <div className="admissionAdminSectionHeader">
          <div>
            <span>SECTION 04</span>

            <h2>Admission Modes</h2>
          </div>

          <button
            type="button"
            className="admissionAddButton"
            onClick={addMode}
          >
            <FaPlus />
            Add Admission Mode
          </button>
        </div>

        <div className="admissionAdminGrid">
          <div className="admissionAdminField">
            <label>Section Label</label>

            <input
              type="text"
              name="admissionModeLabel"
              value={form.admissionModeLabel}
              onChange={handleChange}
            />
          </div>

          <div className="admissionAdminField">
            <label>Section Title</label>

            <input
              type="text"
              name="admissionModeTitle"
              value={form.admissionModeTitle}
              onChange={handleChange}
            />
          </div>

          <div className="admissionAdminField full">
            <label>Description</label>

            <textarea
              name="admissionModeDescription"
              value={form.admissionModeDescription}
              onChange={handleChange}
              rows="3"
            />
          </div>
        </div>

        <div className="admissionModeList">
          {form.admissionModes.map((item, index) => (
            <div className="admissionModeItem" key={index}>
              <div className="admissionModeNumber">{index + 1}</div>

              <div className="admissionModeContent">
                <div className="admissionAdminGrid">
                  <div className="admissionAdminField">
                    <label>Mode Title</label>

                    <input
                      type="text"
                      value={item.title || ""}
                      onChange={(e) =>
                        handleModeChange(index, "title", e.target.value)
                      }
                    />
                  </div>

                  <div className="admissionAdminField full">
                    <label>Description</label>

                    <textarea
                      value={item.description || ""}
                      onChange={(e) =>
                        handleModeChange(index, "description", e.target.value)
                      }
                      rows="3"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="admissionDeleteStandalone"
                onClick={() => removeMode(index)}
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ===================================================
          REQUIRED DOCUMENTS
      =================================================== */}

      <section className="admissionAdminCard">
        <div className="admissionAdminSectionHeader">
          <div>
            <span>SECTION 05</span>

            <h2>Required Documents</h2>
          </div>

          <button
            type="button"
            className="admissionAddButton"
            onClick={addDocument}
          >
            <FaPlus />
            Add Document
          </button>
        </div>

        <div className="admissionAdminGrid">
          <div className="admissionAdminField">
            <label>Section Label</label>

            <input
              type="text"
              name="documentLabel"
              value={form.documentLabel}
              onChange={handleChange}
            />
          </div>

          <div className="admissionAdminField">
            <label>Section Title</label>

            <input
              type="text"
              name="documentTitle"
              value={form.documentTitle}
              onChange={handleChange}
            />
          </div>

          <div className="admissionAdminField full">
            <label>Description</label>

            <textarea
              name="documentDescription"
              value={form.documentDescription}
              onChange={handleChange}
              rows="3"
            />
          </div>
        </div>

        <div className="admissionDocumentsList">
          {form.requiredDocuments.map((item, index) => (
            <div className="admissionDocumentItem" key={index}>
              <div className="admissionDocumentNumber">{index + 1}</div>

              <input
                type="text"
                value={item.title || ""}
                onChange={(e) => handleDocumentChange(index, e.target.value)}
              />

              <button
                type="button"
                className="admissionDeleteDocument"
                onClick={() => removeDocument(index)}
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ===================================================
          IMPORTANT DATES
      =================================================== */}

      <section className="admissionAdminCard">
        <div className="admissionAdminSectionHeader">
          <div>
            <span>SECTION 06</span>

            <h2>Important Dates</h2>
          </div>
        </div>

        <div className="admissionImportantDatesToggle">
          <label>
            <input
              type="checkbox"
              name="importantDatesEnabled"
              checked={Boolean(form.importantDatesEnabled)}
              onChange={handleCheckboxChange}
            />

            <span>Enable Important Dates section</span>
          </label>
        </div>

        <div className="admissionAdminGrid">
          <div className="admissionAdminField">
            <label>Section Label</label>

            <input
              type="text"
              name="importantDateLabel"
              value={form.importantDateLabel}
              onChange={handleChange}
              disabled={!form.importantDatesEnabled}
            />
          </div>

          <div className="admissionAdminField">
            <label>Section Title</label>

            <input
              type="text"
              name="importantDateTitle"
              value={form.importantDateTitle}
              onChange={handleChange}
              disabled={!form.importantDatesEnabled}
            />
          </div>
        </div>
      </section>

      {/* ===================================================
          BOTTOM SAVE
      =================================================== */}

      <div className="admissionAdminBottomActions">
        <button
          type="button"
          className="admissionResetButton"
          onClick={handleReset}
          disabled={saving}
        >
          <FaUndo />
          Reset Default
        </button>

        <button
          type="button"
          className="admissionSaveButton"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? <Spinner size="sm" animation="border" /> : <FaSave />}

          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* ===================================================
          BOOTSTRAP MESSAGE MODAL
      =================================================== */}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === "error" ? "Error" : modalTitle}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div
            className={
              modalType === "error"
                ? "admissionModalError"
                : "admissionModalSuccess"
            }
          >
            <div className="admissionModalIcon">
              {modalType === "error" ? "!" : "✓"}
            </div>

            <div>
              <h4>{modalTitle}</h4>

              <p>{modalMessage}</p>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant={modalType === "error" ? "danger" : "primary"}
            onClick={() => setShowModal(false)}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdmissionProcess;
