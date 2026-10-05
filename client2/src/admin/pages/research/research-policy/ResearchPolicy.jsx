import React, { useEffect, useState } from "react";

import {
  FaFilePdf,
  FaEye,
  FaLink,
  FaSyncAlt,
  FaTrash,
} from "react-icons/fa";

import {
  getResearchPolicies,
  addResearchPolicy,
  updateResearchPolicy,
  deleteResearchPolicy,
} from "../../../services/researchPolicyService";

import "./research-policy.css";


const POLICY_TYPES = [
  "Research Policy",
  "IPR Policy",
  "Plagiarism Policy",
  "Research Ethics Guidelines",
];


const ResearchPolicy = () => {

  const [activeTab, setActiveTab] =
    useState("documents");

  const [policies, setPolicies] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [selectedPolicy, setSelectedPolicy] =
    useState("");

  const [pdfLink, setPdfLink] =
    useState("");

  const [saving, setSaving] =
    useState(false);


  /* =====================================================
     FETCH POLICIES
  ===================================================== */

  const fetchPolicies = async () => {

    try {

      setLoading(true);
      setError("");

      const response =
        await getResearchPolicies();

      setPolicies(
        response.data?.data || []
      );

    } catch (err) {

      console.error(
        "Research Policy Error:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Failed to load research policy documents."
      );

    } finally {

      setLoading(false);

    }

  };


  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {

    fetchPolicies();

  }, []);


  /* =====================================================
     OPEN MODAL
  ===================================================== */

  const openModal = (policy = "") => {

    setSelectedPolicy(policy);

    setPdfLink("");

    setError("");

    setSuccess("");

    setShowModal(true);

  };


  /* =====================================================
     CLOSE MODAL
  ===================================================== */

  const closeModal = () => {

    if (saving) return;

    setShowModal(false);

    setSelectedPolicy("");

    setPdfLink("");

  };


  /* =====================================================
     SAVE / UPDATE PDF LINK
  ===================================================== */

  const handleSave = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");


    /* ---------------------------------------------
       VALIDATE POLICY
    --------------------------------------------- */

    if (!selectedPolicy) {

      setError(
        "Please select a policy document."
      );

      return;

    }


    /* ---------------------------------------------
       VALIDATE PDF LINK
    --------------------------------------------- */

    if (!pdfLink.trim()) {

      setError(
        "Please enter the PDF link."
      );

      return;

    }


    /* ---------------------------------------------
       BASIC URL VALIDATION
    --------------------------------------------- */

    try {

      new URL(pdfLink.trim());

    } catch {

      setError(
        "Please enter a valid PDF URL."
      );

      return;

    }


    /* ---------------------------------------------
       REQUEST DATA
    --------------------------------------------- */

    const data = {

      title: selectedPolicy,

      pdfUrl: pdfLink.trim(),

      status: "Active",

    };


    try {

      setSaving(true);


      /* -------------------------------------------
         CHECK EXISTING POLICY
      ------------------------------------------- */

      const existingPolicy =
        policies.find(
          (policy) =>
            policy.title === selectedPolicy
        );


      /* -------------------------------------------
         UPDATE
      ------------------------------------------- */

      if (existingPolicy) {

        await updateResearchPolicy(
          existingPolicy._id,
          data
        );

        setSuccess(
          "Research policy updated successfully."
        );

      }

      /* -------------------------------------------
         CREATE
      ------------------------------------------- */

      else {

        await addResearchPolicy(data);

        setSuccess(
          "Research policy added successfully."
        );

      }


      /* -------------------------------------------
         CLOSE
      ------------------------------------------- */

      setShowModal(false);

      setSelectedPolicy("");

      setPdfLink("");


      /* -------------------------------------------
         REFRESH
      ------------------------------------------- */

      await fetchPolicies();

      setActiveTab("documents");


    } catch (err) {

      console.error(
        "Save Research Policy Error:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Failed to save research policy."
      );

    } finally {

      setSaving(false);

    }

  };


  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this policy document?"
      );


    if (!confirmDelete) {

      return;

    }


    try {

      setError("");
      setSuccess("");


      await deleteResearchPolicy(id);


      setSuccess(
        "Research policy deleted successfully."
      );


      await fetchPolicies();


    } catch (err) {

      console.error(
        "Delete Research Policy Error:",
        err
      );


      setError(
        err.response?.data?.message ||
        "Failed to delete research policy."
      );

    }

  };


  /* =====================================================
     FIND POLICY
  ===================================================== */

  const getPolicy = (title) => {

    return policies.find(
      (policy) =>
        policy.title === title
    );

  };


  return (

    <div className="research-policy-page">


      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="page-header mb-4">

        <h2>
          Research Policy
        </h2>

        <p>
          Manage research-related policy
          documents and guidelines.
        </p>

      </div>


      {/* =================================================
          TABS
      ================================================= */}

      <div className="research-policy-tabs">

        <button
          type="button"
          className={
            activeTab === "documents"
              ? "research-policy-tab active"
              : "research-policy-tab"
          }
          onClick={() =>
            setActiveTab("documents")
          }
        >

          <strong>
            Policy Documents
          </strong>

          <span>
            View and manage research policies
          </span>

        </button>


        <button
          type="button"
          className={
            activeTab === "manage"
              ? "research-policy-tab active"
              : "research-policy-tab"
          }
          onClick={() =>
            setActiveTab("manage")
          }
        >

          <strong>
            Manage Policy Links
          </strong>

          <span>
            Add or update PDF links
          </span>

        </button>

      </div>


      {/* =================================================
          ALERTS
      ================================================= */}

      {success && (

        <div className="alert alert-success">

          {success}

        </div>

      )}


      {error && (

        <div className="alert alert-danger">

          {error}

        </div>

      )}


      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="research-policy-content">


        {/* =================================================
            DOCUMENTS TAB
        ================================================= */}

        {activeTab === "documents" && (

          <div>

            <div className="research-section-header">

              <div>

                <h4>
                  Policy Documents
                </h4>

                <p>
                  Manage approved research
                  policy documents.
                </p>

              </div>


              <button
                type="button"
                className="research-primary-btn"
                onClick={() =>
                  setActiveTab("manage")
                }
              >

                <FaLink />

                Manage Links

              </button>

            </div>


            {loading ? (

              <div className="research-policy-loading">

                <FaSyncAlt className="loading-icon" />

                <p>
                  Loading policy documents...
                </p>

              </div>

            ) : (

              <div className="policy-list">

                {POLICY_TYPES.map(
                  (title) => {

                    const policy =
                      getPolicy(title);


                    return (

                      <div
                        className="policy-card"
                        key={title}
                      >


                        {/* PDF ICON */}

                        <div className="policy-icon">

                          <FaFilePdf />

                        </div>


                        {/* INFORMATION */}

                        <div className="policy-info">

                          <h5>
                            {title}
                          </h5>

                          <span>

                            {policy
                              ? "PDF Link Available"
                              : "PDF Link Not Added"}

                          </span>

                        </div>


                        {/* ACTIONS */}

                        <div className="policy-actions">


                          {policy ? (

                            <>

                              <a
                                href={
                                  policy.pdfUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="policy-view-btn"
                              >

                                <FaEye />

                                View

                              </a>


                              <button
                                type="button"
                                className="policy-replace-btn"
                                onClick={() =>
                                  openModal(
                                    title
                                  )
                                }
                              >

                                <FaSyncAlt />

                                Update

                              </button>


                              <button
                                type="button"
                                className="policy-delete-btn"
                                onClick={() =>
                                  handleDelete(
                                    policy._id
                                  )
                                }
                              >

                                <FaTrash />

                                Delete

                              </button>

                            </>

                          ) : (

                            <button
                              type="button"
                              className="policy-upload-btn"
                              onClick={() =>
                                openModal(
                                  title
                                )
                              }
                            >

                              <FaLink />

                              Add Link

                            </button>

                          )}

                        </div>

                      </div>

                    );

                  }
                )}

              </div>

            )}

          </div>

        )}


        {/* =================================================
            MANAGE LINKS TAB
        ================================================= */}

        {activeTab === "manage" && (

          <div>

            <div className="research-section-header">

              <div>

                <h4>
                  Manage Policy Links
                </h4>

                <p>
                  Add or update the PDF link
                  for a research policy.
                </p>

              </div>

            </div>


            <div className="policy-upload-box">

              <div className="upload-icon">

                <FaFilePdf />

              </div>


              <h5>
                Add PDF Link
              </h5>


              <p>
                Select a policy and enter
                its PDF document URL.
              </p>


              <form onSubmit={handleSave}>


                {/* POLICY */}

                <div className="mb-3">

                  <label className="form-label">

                    Policy Document

                  </label>


                  <select
                    className="form-select"
                    value={selectedPolicy}
                    onChange={(e) =>
                      setSelectedPolicy(
                        e.target.value
                      )
                    }
                  >

                    <option value="">
                      Select Policy
                    </option>


                    {POLICY_TYPES.map(
                      (title) => (

                        <option
                          key={title}
                          value={title}
                        >
                          {title}
                        </option>

                      )
                    )}

                  </select>

                </div>


                {/* PDF URL */}

                <div className="mb-4">

                  <label className="form-label">

                    PDF Link

                  </label>


                  <div className="policy-url-input">

                    <FaLink />

                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://example.com/research-policy.pdf"
                      value={pdfLink}
                      onChange={(e) =>
                        setPdfLink(
                          e.target.value
                        )
                      }
                    />

                  </div>


                  <small className="text-muted">

                    Enter the complete URL of
                    the PDF document.

                  </small>

                </div>


                <button
                  type="submit"
                  className="research-primary-btn"
                  disabled={saving}
                >

                  {saving ? (

                    <>

                      <FaSyncAlt className="spin" />

                      Saving...

                    </>

                  ) : (

                    <>

                      <FaLink />

                      Save PDF Link

                    </>

                  )}

                </button>


              </form>

            </div>

          </div>

        )}

      </div>


      {/* =================================================
          UPDATE MODAL
      ================================================= */}

      {showModal && (

        <div className="policy-modal-overlay">

          <div className="policy-modal">


            <div className="policy-modal-header">

              <h5>

                {getPolicy(selectedPolicy)
                  ? "Update PDF Link"
                  : "Add PDF Link"}

              </h5>


              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
              >

                ×

              </button>

            </div>


            <form onSubmit={handleSave}>


              <div className="policy-modal-body">


                <label className="form-label">

                  Policy

                </label>


                <select
                  className="form-select mb-3"
                  value={selectedPolicy}
                  onChange={(e) =>
                    setSelectedPolicy(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Select Policy
                  </option>


                  {POLICY_TYPES.map(
                    (title) => (

                      <option
                        key={title}
                        value={title}
                      >
                        {title}
                      </option>

                    )
                  )}

                </select>


                <label className="form-label">

                  PDF Link

                </label>


                <input
                  type="url"
                  className="form-control"
                  placeholder="https://example.com/policy.pdf"
                  value={pdfLink}
                  onChange={(e) =>
                    setPdfLink(
                      e.target.value
                    )
                  }
                />

              </div>


              <div className="policy-modal-footer">

                <button
                  type="button"
                  className="policy-cancel-btn"
                  onClick={closeModal}
                  disabled={saving}
                >

                  Cancel

                </button>


                <button
                  type="submit"
                  className="research-primary-btn"
                  disabled={saving}
                >

                  {saving
                    ? "Saving..."
                    : "Save PDF Link"}

                </button>

              </div>


            </form>

          </div>

        </div>

      )}

    </div>

  );

};


export default ResearchPolicy;