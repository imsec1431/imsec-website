import React, { useEffect, useState } from "react";

import {
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
  FaSave,
  FaUsers,
  FaUserTie,
} from "react-icons/fa";

import ImageUploader from "../../components/common/ImageUploader";

import {
  getStudentClubsAdmin,
  updateStudentClubsAdmin,
  deleteStudentClub,
  resetStudentClubsDefaults,
} from "../../services/studentClubAdminService";

import "./StudentClubsManagement.css";

/* =========================================================
   DEFAULT HERO
========================================================= */

const DEFAULT_HERO = {
  title: "Student Clubs",

  subtitle: "Explore student clubs and activities at IMSEC",

  breadcrumb: "Home / Life @ IMSEC / Student Clubs",
};

/* =========================================================
   CREATE EMPTY CLUB
========================================================= */

const createEmptyClub = () => ({
  _id: null,

  name: "",

  description: "",

  image: {
    url: "",
    publicId: "",
  },

  coordinator: {
    name: "",

    mobile: "",

    description: "",

    image: {
      url: "",
      publicId: "",
    },
  },

  /*
   * Temporary frontend-only values.
   * These are NOT sent inside JSON.
   */

  _clubPreview: "",

  _clubNewImage: null,

  _removeClubImage: false,

  _coordinatorPreview: "",

  _coordinatorNewImage: null,

  _removeCoordinatorImage: false,
});

/* =========================================================
   NORMALIZE CLUB
========================================================= */

const normalizeClub = (club) => ({
  _id: club?._id || null,

  name: club?.name || "",

  description: club?.description || "",

  image: {
    url: club?.image?.url || "",

    publicId: club?.image?.publicId || "",
  },

  coordinator: {
    name: club?.coordinator?.name || "",

    mobile: club?.coordinator?.mobile || "",

    description: club?.coordinator?.description || "",

    image: {
      url: club?.coordinator?.image?.url || "",

      publicId: club?.coordinator?.image?.publicId || "",
    },
  },

  _clubPreview: "",

  _clubNewImage: null,

  _removeClubImage: false,

  _coordinatorPreview: "",

  _coordinatorNewImage: null,

  _removeCoordinatorImage: false,
});

/* =========================================================
   COMPONENT
========================================================= */

const StudentClubsManagement = () => {
  /* =======================================================
     STATE
  ======================================================= */

  const [hero, setHero] = useState(DEFAULT_HERO);

  const [clubs, setClubs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  /* -------------------------------------------------------
     MODAL
  ------------------------------------------------------- */

  const [showModal, setShowModal] = useState(false);

  const [modalMode, setModalMode] = useState("add");

  const [modalClub, setModalClub] = useState(null);

  /* =======================================================
     LOAD DATA
  ======================================================= */

  const loadData = async () => {
    try {
      setLoading(true);

      setError("");

      const response = await getStudentClubsAdmin();

      const data = response?.data || {};

      setHero({
        title: data?.hero?.title || DEFAULT_HERO.title,

        subtitle: data?.hero?.subtitle || DEFAULT_HERO.subtitle,

        breadcrumb: data?.hero?.breadcrumb || DEFAULT_HERO.breadcrumb,
      });

      setClubs(Array.isArray(data?.clubs) ? data.clubs.map(normalizeClub) : []);
    } catch (err) {
      console.error("Load Student Clubs Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load Student Clubs.",
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
     HERO CHANGE
  ======================================================= */

  const handleHeroChange = (field, value) => {
    setHero((previous) => ({
      ...previous,

      [field]: value,
    }));

    setError("");

    setSuccess("");
  };

  /* =======================================================
     ADD CLUB
  ======================================================= */

  const handleAdd = () => {
    setModalMode("add");

    setModalClub(createEmptyClub());

    setError("");

    setSuccess("");

    setShowModal(true);
  };

  /* =======================================================
     VIEW CLUB
  ======================================================= */

  const handleView = (club) => {
    setModalMode("view");

    setModalClub({
      ...normalizeClub(club),

      _clubPreview: club?.image?.url || "",

      _coordinatorPreview: club?.coordinator?.image?.url || "",
    });

    setError("");

    setSuccess("");

    setShowModal(true);
  };

  /* =======================================================
     EDIT CLUB
  ======================================================= */

  const handleEdit = (club) => {
    setModalMode("edit");

    setModalClub({
      ...normalizeClub(club),

      _clubPreview: club?.image?.url || "",

      _coordinatorPreview: club?.coordinator?.image?.url || "",
    });

    setError("");

    setSuccess("");

    setShowModal(true);
  };

  /* =======================================================
     CLOSE MODAL
  ======================================================= */

  const closeModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);

    setModalClub(null);
  };

  /* =======================================================
     MODAL CLUB FIELD
  ======================================================= */

  const handleModalClubChange = (field, value) => {
    setModalClub((previous) => ({
      ...previous,

      [field]: value,
    }));

    setError("");
  };

  /* =======================================================
     MODAL COORDINATOR FIELD
  ======================================================= */

  const handleCoordinatorChange = (field, value) => {
    setModalClub((previous) => ({
      ...previous,

      coordinator: {
        ...previous.coordinator,

        [field]: value,
      },
    }));

    setError("");
  };

  /* =======================================================
     CLUB IMAGE
  ======================================================= */

  const handleClubImage = (file) => {
    if (!file) {
      return;
    }

    // console.log(
    //   "CLUB IMAGE SELECTED:",
    //   file,
    //   file?.name,
    //   file?.type,
    //   file?.size,
    // );

    setModalClub((previous) => ({
      ...previous,

      _clubNewImage: file,

      _clubPreview: URL.createObjectURL(file),

      _removeClubImage: false,
    }));

    setError("");
  };

  /* =======================================================
     CLUB IMAGE PREVIEW
  ======================================================= */

  const handleClubPreview = (preview) => {
    setModalClub((previous) => ({
      ...previous,

      _clubPreview: preview,
    }));
  };

  /* =======================================================
     REMOVE CLUB IMAGE
  ======================================================= */

  const handleRemoveClubImage = () => {
    setModalClub((previous) => ({
      ...previous,

      _clubNewImage: null,

      _clubPreview: "",

      _removeClubImage: true,
    }));
  };

  /* =======================================================
     COORDINATOR IMAGE
  ======================================================= */

  const handleCoordinatorImage = (file) => {
    if (!file) {
      return;
    }

    // console.log(
    //   "COORDINATOR IMAGE SELECTED:",
    //   file,
    //   file?.name,
    //   file?.type,
    //   file?.size,
    // );

    setModalClub((previous) => ({
      ...previous,

      _coordinatorNewImage: file,

      _coordinatorPreview: URL.createObjectURL(file),

      _removeCoordinatorImage: false,
    }));

    setError("");
  };

  /* =======================================================
     COORDINATOR PREVIEW
  ======================================================= */

  const handleCoordinatorPreview = (preview) => {
    setModalClub((previous) => ({
      ...previous,

      _coordinatorPreview: preview,
    }));
  };

  /* =======================================================
     REMOVE COORDINATOR IMAGE
  ======================================================= */

  const handleRemoveCoordinatorImage = () => {
    setModalClub((previous) => ({
      ...previous,

      _coordinatorNewImage: null,

      _coordinatorPreview: "",

      _removeCoordinatorImage: true,
    }));
  };

  /* =======================================================
     SAVE MODAL CLUB
  ======================================================= */

  const saveModalClub = () => {
    if (!modalClub) {
      return;
    }

    /* -----------------------------------------------------
       VALIDATION
    ----------------------------------------------------- */

    if (!modalClub.name.trim()) {
      setError("Please enter Club Name.");

      return;
    }

    if (!modalClub.coordinator.name.trim()) {
      setError("Please enter Coordinator Name.");

      return;
    }

    const cleanClub = {
      ...modalClub,

      name: modalClub.name.trim(),

      description: modalClub.description.trim(),

      coordinator: {
        ...modalClub.coordinator,

        name: modalClub.coordinator.name.trim(),

        mobile: modalClub.coordinator.mobile.trim(),

        description: modalClub.coordinator.description.trim(),
      },
    };

    /* -----------------------------------------------------
       EDIT
    ----------------------------------------------------- */

    if (modalMode === "edit") {
      setClubs((previous) =>
        previous.map((club) =>
          String(club._id) === String(modalClub._id) ? cleanClub : club,
        ),
      );
    }

    /* -----------------------------------------------------
       ADD
    ----------------------------------------------------- */

    if (modalMode === "add") {
      setClubs((previous) => [
        ...previous,

        {
          ...cleanClub,

          _id: null,
        },
      ]);
    }

    setShowModal(false);

    setModalClub(null);

    setError("");

    setSuccess(
      modalMode === "edit"
        ? "Club details updated. Click Save Changes to store them."
        : "Club added. Click Save Changes to store it.",
    );
  };

  /* =======================================================
     DELETE CLUB
     
     THIS IS NOW A REAL DELETE API CALL.
  ======================================================= */

  const handleDelete = async (club) => {
    if (!club?._id) {
      /*
       * New unsaved club.
       * It only exists in React state.
       */

      const confirmed = window.confirm(
        `Remove "${club?.name || "this club"}" from the list?`,
      );

      if (!confirmed) {
        return;
      }

      setClubs((previous) => previous.filter((item) => item !== club));

      setSuccess("Unsaved club removed.");

      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${club.name}"?\n\nThe club and its uploaded images will be permanently removed.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(club._id);

      setError("");

      setSuccess("");

      const response = await deleteStudentClub(club._id);

      /* ---------------------------------------------------
         USE SERVER RESPONSE
      --------------------------------------------------- */

      const updatedData = response?.data;

      if (updatedData && Array.isArray(updatedData.clubs)) {
        setClubs(updatedData.clubs.map(normalizeClub));

        if (updatedData.hero) {
          setHero({
            title: updatedData.hero.title || DEFAULT_HERO.title,

            subtitle: updatedData.hero.subtitle || DEFAULT_HERO.subtitle,

            breadcrumb: updatedData.hero.breadcrumb || DEFAULT_HERO.breadcrumb,
          });
        }
      } else {
        /*
         * Fallback if server response
         * does not contain clubs.
         */

        setClubs((previous) =>
          previous.filter((item) => String(item._id) !== String(club._id)),
        );
      }

      setSuccess("Student Club deleted successfully.");
    } catch (err) {
      console.error("Delete Student Club Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to delete Student Club.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* =======================================================
     SAVE ALL CHANGES
  ======================================================= */

  const handleSave = async () => {
    try {
      setSaving(true);

      setError("");

      setSuccess("");

      /* ---------------------------------------------------
         VALIDATE CLUBS
      --------------------------------------------------- */

      for (let index = 0; index < clubs.length; index++) {
        const club = clubs[index];

        if (!club.name.trim()) {
          setError(`Please enter Club Name for row ${index + 1}.`);

          setSaving(false);

          return;
        }

        if (!club.coordinator.name.trim()) {
          setError(`Please enter Coordinator Name for "${club.name}".`);

          setSaving(false);

          return;
        }
      }

      /* ---------------------------------------------------
         CREATE FORM DATA
      --------------------------------------------------- */

      const formData = new FormData();

      /* ---------------------------------------------------
         JSON DATA
         
         IMPORTANT:
         Remove temporary File/preview fields.
      --------------------------------------------------- */

      const cleanClubs = clubs.map((club) => ({
        _id: club._id || undefined,

        name: club.name || "",

        description: club.description || "",

        image: club.image || {},

        coordinator: {
          name: club.coordinator?.name || "",

          mobile: club.coordinator?.mobile || "",

          description: club.coordinator?.description || "",

          image: club.coordinator?.image || {},
        },

        _removeClubImage: club._removeClubImage === true,

        _removeCoordinatorImage: club._removeCoordinatorImage === true,
      }));

      const jsonData = {
        hero,

        clubs: cleanClubs,
      };

      formData.append("data", JSON.stringify(jsonData));

      /* =================================================
         ADD IMAGE FILES
      ================================================= */

      clubs.forEach((club, index) => {
        /* ---------------------------------------------
             CLUB IMAGE
          --------------------------------------------- */

        const clubFile = club._clubNewImage;

        if (clubFile && typeof clubFile === "object" && clubFile.name) {
          const fieldName = club._id
            ? `clubImage_${club._id}`
            : `clubImage_new_${index}`;

          // console.log("ADDING CLUB IMAGE TO FORMDATA:", {
          //   fieldName,

          //   name: clubFile.name,

          //   type: clubFile.type,

          //   size: clubFile.size,
          // });

          formData.append(
            fieldName,

            clubFile,

            clubFile.name,
          );
        }

        /* ---------------------------------------------
             COORDINATOR IMAGE
          --------------------------------------------- */

        const coordinatorFile = club._coordinatorNewImage;

        if (
          coordinatorFile &&
          typeof coordinatorFile === "object" &&
          coordinatorFile.name
        ) {
          const fieldName = club._id
            ? `coordinatorImage_${club._id}`
            : `coordinatorImage_new_${index}`;

          // console.log("ADDING COORDINATOR IMAGE TO FORMDATA:", {
          //   fieldName,

          //   name: coordinatorFile.name,

          //   type: coordinatorFile.type,

          //   size: coordinatorFile.size,
          // });

          formData.append(
            fieldName,

            coordinatorFile,

            coordinatorFile.name,
          );
        }
      });

      /* =================================================
         DEBUG FORMDATA
      ================================================= */

      // console.log("========================================");

      // console.log("STUDENT CLUB FORMDATA");

      for (const [key, value] of formData.entries()) {
        if (typeof value === "object") {
          // console.log(key, {
          //   name: value?.name,
          //   type: value?.type,
          //   size: value?.size,
          // });
        } else {
          // console.log(key, value);
        }
      }

      // console.log("========================================");

      /* =================================================
         API
      ================================================= */

      const response = await updateStudentClubsAdmin(formData);

      /* =================================================
         UPDATE STATE FROM SERVER
      ================================================= */

      const savedData = response?.data;

      if (savedData) {
        setHero({
          title: savedData?.hero?.title || DEFAULT_HERO.title,

          subtitle: savedData?.hero?.subtitle || DEFAULT_HERO.subtitle,

          breadcrumb: savedData?.hero?.breadcrumb || DEFAULT_HERO.breadcrumb,
        });

        setClubs(
          Array.isArray(savedData?.clubs)
            ? savedData.clubs.map(normalizeClub)
            : [],
        );
      }

      setSuccess("Student Clubs saved successfully.");
    } catch (err) {
      console.error("Save Student Clubs Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to save Student Clubs.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     RESET
  ======================================================= */

  const handleReset = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset Student Clubs?\n\nAll clubs and uploaded images will be removed.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);

      setError("");

      setSuccess("");

      const response = await resetStudentClubsDefaults();

      const data = response?.data;

      setHero({
        title: data?.hero?.title || DEFAULT_HERO.title,

        subtitle: data?.hero?.subtitle || DEFAULT_HERO.subtitle,

        breadcrumb: data?.hero?.breadcrumb || DEFAULT_HERO.breadcrumb,
      });

      setClubs(Array.isArray(data?.clubs) ? data.clubs.map(normalizeClub) : []);

      setSuccess("Student Clubs reset successfully.");
    } catch (err) {
      console.error("Reset Student Clubs Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to reset Student Clubs.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="student-clubs-loading">
        <div className="student-clubs-spinner" />

        <h3>Loading Student Clubs</h3>

        <p>Please wait...</p>
      </div>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="student-clubs-management">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="student-clubs-page-header">
        <div>
          <div className="student-clubs-eyebrow">LIFE @ IMSEC</div>

          <h1>Student Clubs</h1>

          <p>Manage student clubs, coordinators and images.</p>
        </div>

        <div className="student-clubs-header-actions">
          <button
            type="button"
            className="student-clubs-btn student-clubs-btn-secondary"
            onClick={handleReset}
            disabled={saving}
          >
            Reset
          </button>

          <button
            type="button"
            className="student-clubs-btn student-clubs-btn-primary"
            onClick={handleAdd}
            disabled={saving}
          >
            <FaPlus />
            Add Club
          </button>
        </div>
      </div>

      {/* =================================================
          ALERTS
      ================================================= */}

      {error && (
        <div className="student-clubs-alert student-clubs-alert-error">
          <span>{error}</span>

          <button type="button" onClick={() => setError("")}>
            <FaTimes />
          </button>
        </div>
      )}

      {success && (
        <div className="student-clubs-alert student-clubs-alert-success">
          <span>{success}</span>

          <button type="button" onClick={() => setSuccess("")}>
            <FaTimes />
          </button>
        </div>
      )}

      {/* =================================================
          HERO SETTINGS
      ================================================= */}

      <div className="student-clubs-card">
        <div className="student-clubs-card-header">
          <div>
            <span>PAGE SETTINGS</span>

            <h2>Student Clubs Hero</h2>
          </div>
        </div>

        <div className="student-clubs-form-grid">
          <div className="student-clubs-form-group">
            <label>Title</label>

            <input
              type="text"
              value={hero.title}
              onChange={(e) => handleHeroChange("title", e.target.value)}
            />
          </div>

          <div className="student-clubs-form-group">
            <label>Subtitle</label>

            <input
              type="text"
              value={hero.subtitle}
              onChange={(e) => handleHeroChange("subtitle", e.target.value)}
            />
          </div>

          <div className="student-clubs-form-group student-clubs-form-full">
            <label>Breadcrumb</label>

            <input
              type="text"
              value={hero.breadcrumb}
              onChange={(e) => handleHeroChange("breadcrumb", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* =================================================
          CLUB TABLE
      ================================================= */}

      <div className="student-clubs-card">
        <div className="student-clubs-card-header">
          <div>
            <span>CLUB DIRECTORY</span>

            <h2>Student Clubs</h2>
          </div>

          <div className="student-clubs-count">
            <FaUsers />
            {clubs.length} Clubs
          </div>
        </div>

        {clubs.length === 0 ? (
          <div className="student-clubs-empty">
            <FaUsers />

            <h3>No Student Clubs</h3>

            <p>Add the first student club using the button above.</p>

            <button
              type="button"
              className="student-clubs-btn student-clubs-btn-primary"
              onClick={handleAdd}
            >
              <FaPlus />
              Add Club
            </button>
          </div>
        ) : (
          <div className="student-clubs-table-wrapper">
            <table className="student-clubs-table">
              <thead>
                <tr>
                  <th>S.N.</th>

                  <th>Club Name</th>

                  <th>Coordinator Name</th>

                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {clubs.map((club, index) => (
                  <tr key={club._id || `new-${index}`}>
                    <td>
                      <span className="student-clubs-number">{index + 1}</span>
                    </td>

                    <td>
                      <div className="student-clubs-name-cell">
                        {club?.image?.url ? (
                          <img
                            src={club.image.url}
                            alt={club.name}
                            className="student-clubs-table-thumb"
                          />
                        ) : (
                          <div className="student-clubs-table-placeholder">
                            <FaUsers />
                          </div>
                        )}

                        <strong>{club.name || "Untitled Club"}</strong>
                      </div>
                    </td>

                    <td>
                      <div className="student-clubs-coordinator-cell">
                        {club?.coordinator?.image?.url ? (
                          <img
                            src={club.coordinator.image.url}
                            alt={club.coordinator.name}
                            className="student-clubs-coordinator-thumb"
                          />
                        ) : (
                          <div className="student-clubs-coordinator-placeholder">
                            <FaUserTie />
                          </div>
                        )}

                        <span>{club?.coordinator?.name || "-"}</span>
                      </div>
                    </td>

                    <td>
                      <div className="student-clubs-actions">
                        <button
                          type="button"
                          className="student-clubs-action-btn student-clubs-view-btn"
                          title="View"
                          onClick={() => handleView(club)}
                          disabled={deletingId === club._id}
                        >
                          <FaEye />
                        </button>

                        <button
                          type="button"
                          className="student-clubs-action-btn student-clubs-edit-btn"
                          title="Edit"
                          onClick={() => handleEdit(club)}
                          disabled={deletingId === club._id}
                        >
                          <FaEdit />
                        </button>

                        <button
                          type="button"
                          className="student-clubs-action-btn student-clubs-delete-btn"
                          title="Delete"
                          onClick={() => handleDelete(club)}
                          disabled={deletingId === club._id}
                        >
                          {deletingId === club._id ? (
                            <span className="student-clubs-small-spinner" />
                          ) : (
                            <FaTrash />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =================================================
          SAVE BAR
      ================================================= */}

      <div className="student-clubs-save-bar">
        <div>
          <strong>Save your changes</strong>

          <span>
            New and edited clubs are stored when you click Save Changes.
          </span>
        </div>

        <button
          type="button"
          className="student-clubs-btn student-clubs-btn-primary student-clubs-save-btn"
          onClick={handleSave}
          disabled={saving || deletingId !== null}
        >
          {saving ? (
            <>
              <span className="student-clubs-small-spinner" />
              Saving...
            </>
          ) : (
            <>
              <FaSave />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* =================================================
          MODAL
      ================================================= */}

      {showModal && modalClub && (
        <div
          className="student-clubs-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="student-clubs-modal">
            {/* -----------------------------------------
                  MODAL HEADER
              ------------------------------------------ */}

            <div className="student-clubs-modal-header">
              <div>
                <span>
                  {modalMode === "add"
                    ? "NEW CLUB"
                    : modalMode === "edit"
                      ? "EDIT CLUB"
                      : "CLUB DETAILS"}
                </span>

                <h2>
                  {modalMode === "add"
                    ? "Add Student Club"
                    : modalMode === "edit"
                      ? "Edit Student Club"
                      : modalClub.name}
                </h2>
              </div>

              <button
                type="button"
                className="student-clubs-modal-close"
                onClick={closeModal}
                disabled={saving}
              >
                <FaTimes />
              </button>
            </div>

            {/* -----------------------------------------
                  MODAL BODY
              ------------------------------------------ */}

            <div className="student-clubs-modal-body">
              {/* =======================================
                    CLUB DETAILS
                ======================================== */}

              <div className="student-clubs-modal-section">
                <div className="student-clubs-modal-section-title">
                  <FaUsers />

                  <div>
                    <span>CLUB INFORMATION</span>

                    <h3>Club Details</h3>
                  </div>
                </div>

                <div className="student-clubs-form-group">
                  <label>Club Name</label>

                  <input
                    type="text"
                    value={modalClub.name}
                    onChange={(e) =>
                      handleModalClubChange("name", e.target.value)
                    }
                    disabled={modalMode === "view"}
                  />
                </div>

                <div className="student-clubs-form-group">
                  <label>Club Description</label>

                  <textarea
                    rows="5"
                    value={modalClub.description}
                    onChange={(e) =>
                      handleModalClubChange("description", e.target.value)
                    }
                    disabled={modalMode === "view"}
                  />
                </div>

                {/* CLUB IMAGE */}

                <div className="student-clubs-image-field">
                  <div className="student-clubs-image-field-heading">
                    <label>Club Image</label>

                    {modalClub?.image?.url && !modalClub?._clubNewImage && (
                      <span>Current Image</span>
                    )}
                  </div>

                  {modalMode === "view" ? (
                    modalClub?.image?.url ? (
                      <div className="student-clubs-modal-image-preview">
                        <img src={modalClub.image.url} alt={modalClub.name} />
                      </div>
                    ) : (
                      <div className="student-clubs-no-image">
                        No club image uploaded.
                      </div>
                    )
                  ) : (
                    <>
                      <ImageUploader
                        preview={
                          modalClub._clubPreview || modalClub?.image?.url || ""
                        }
                        setPreview={handleClubPreview}
                        setImage={handleClubImage}
                      />

                      {(modalClub._clubPreview || modalClub?.image?.url) && (
                        <button
                          type="button"
                          className="student-clubs-remove-image"
                          onClick={handleRemoveClubImage}
                        >
                          <FaTrash />
                          Remove Club Image
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* =======================================
                    COORDINATOR
                ======================================== */}

              <div className="student-clubs-modal-section">
                <div className="student-clubs-modal-section-title">
                  <FaUserTie />

                  <div>
                    <span>COORDINATOR</span>

                    <h3>Coordinator Details</h3>
                  </div>
                </div>

                <div className="student-clubs-form-grid">
                  <div className="student-clubs-form-group">
                    <label>Coordinator Name</label>

                    <input
                      type="text"
                      value={modalClub.coordinator.name}
                      onChange={(e) =>
                        handleCoordinatorChange("name", e.target.value)
                      }
                      disabled={modalMode === "view"}
                    />
                  </div>

                  <div className="student-clubs-form-group">
                    <label>Mobile Number</label>

                    <input
                      type="text"
                      value={modalClub.coordinator.mobile}
                      onChange={(e) =>
                        handleCoordinatorChange("mobile", e.target.value)
                      }
                      disabled={modalMode === "view"}
                    />
                  </div>
                </div>

                <div className="student-clubs-form-group">
                  <label>Coordinator Description</label>

                  <textarea
                    rows="5"
                    value={modalClub.coordinator.description}
                    onChange={(e) =>
                      handleCoordinatorChange("description", e.target.value)
                    }
                    disabled={modalMode === "view"}
                  />
                </div>

                {/* COORDINATOR IMAGE */}

                <div className="student-clubs-image-field">
                  <div className="student-clubs-image-field-heading">
                    <label>Coordinator Image</label>
                  </div>

                  {modalMode === "view" ? (
                    modalClub?.coordinator?.image?.url ? (
                      <div className="student-clubs-modal-image-preview">
                        <img
                          src={modalClub.coordinator.image.url}
                          alt={modalClub.coordinator.name}
                        />
                      </div>
                    ) : (
                      <div className="student-clubs-no-image">
                        No coordinator image uploaded.
                      </div>
                    )
                  ) : (
                    <>
                      <ImageUploader
                        preview={
                          modalClub._coordinatorPreview ||
                          modalClub?.coordinator?.image?.url ||
                          ""
                        }
                        setPreview={handleCoordinatorPreview}
                        setImage={handleCoordinatorImage}
                      />

                      {(modalClub._coordinatorPreview ||
                        modalClub?.coordinator?.image?.url) && (
                        <button
                          type="button"
                          className="student-clubs-remove-image"
                          onClick={handleRemoveCoordinatorImage}
                        >
                          <FaTrash />
                          Remove Coordinator Image
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* -----------------------------------------
                  MODAL FOOTER
              ------------------------------------------ */}

            <div className="student-clubs-modal-footer">
              <button
                type="button"
                className="student-clubs-btn student-clubs-btn-secondary"
                onClick={closeModal}
                disabled={saving}
              >
                {modalMode === "view" ? "Close" : "Cancel"}
              </button>

              {modalMode !== "view" && (
                <button
                  type="button"
                  className="student-clubs-btn student-clubs-btn-primary"
                  onClick={saveModalClub}
                  disabled={saving}
                >
                  <FaSave />

                  {modalMode === "edit" ? "Update Club" : "Add Club"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentClubsManagement;
