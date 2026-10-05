import React, { useEffect, useRef, useState } from "react";

import {
  FaBookOpen,
  FaPlus,
  FaUpload,
  FaImage,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaTimes,
  FaSave,
  FaSortNumericDown,
} from "react-icons/fa";

import {
  getAdminTeachingLearningProcesses,
  createTeachingLearningProcess,
  updateTeachingLearningProcess,
  deleteTeachingLearningProcess,
  toggleTeachingLearningProcessStatus,
} from "../../../services/teachingLearningProcessService";
import "./TeachingLearningProcess.css";

/* =========================================================
   COMPONENT
========================================================= */

const TeachingLearningProcess = () => {
  /* =======================================================
     STATE
  ======================================================= */

  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [previewImage, setPreviewImage] = useState(null);

  const [editingItem, setEditingItem] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);

  const [imagePreview, setImagePreview] = useState("");

  const [displayOrder, setDisplayOrder] = useState(0);

  const [isPublished, setIsPublished] = useState(true);

  const fileInputRef = useRef(null);

  /* =======================================================
     LOAD DATA
  ======================================================= */

  const loadItems = async () => {
    try {
      setLoading(true);

      setError("");

      const response = await getAdminTeachingLearningProcesses();

      setItems(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      console.error("Teaching Learning Process loading error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load teaching learning process images.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  /* =======================================================
     CLEAR FORM
  ======================================================= */

  const resetForm = () => {
    setSelectedFile(null);

    setImagePreview("");

    setDisplayOrder(0);

    setIsPublished(true);

    setEditingItem(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* =======================================================
     OPEN ADD MODAL
  ======================================================= */

  const handleAdd = () => {
    resetForm();

    setError("");

    setMessage("");

    setShowModal(true);
  };

  /* =======================================================
     OPEN EDIT MODAL
  ======================================================= */

  const handleEdit = (item) => {
    setEditingItem(item);

    setSelectedFile(null);

    setImagePreview(item.image || "");

    setDisplayOrder(item.displayOrder ?? 0);

    setIsPublished(item.isPublished !== false);

    setError("");

    setMessage("");

    setShowModal(true);
  };

  /* =======================================================
     CLOSE MODAL
  ======================================================= */

  const handleClose = () => {
    if (saving) {
      return;
    }

    setShowModal(false);

    resetForm();

    setError("");
  };

  /* =======================================================
     FILE CHANGE
  ======================================================= */

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    /* =====================================================
       VALIDATE FILE TYPE
    ===================================================== */

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");

      event.target.value = "";

      return;
    }

    /* =====================================================
       VALIDATE FILE SIZE

       10 MB maximum
    ===================================================== */

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10 MB.");

      event.target.value = "";

      return;
    }

    setError("");

    setSelectedFile(file);

    /* =====================================================
       PREVIEW
    ===================================================== */

    const reader = new FileReader();

    reader.onload = (loadEvent) => {
      setImagePreview(loadEvent.target.result);
    };

    reader.readAsDataURL(file);
  };

  /* =======================================================
     SAVE
  ======================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    setMessage("");

    /* =====================================================
       CREATE REQUIRES IMAGE
    ===================================================== */

    if (!editingItem && !selectedFile) {
      setError("Please select a teaching learning process photo.");

      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      formData.append("displayOrder", String(Number(displayOrder) || 0));

      formData.append("isPublished", String(isPublished));

      let response;

      /* ===================================================
         UPDATE
      =================================================== */

      if (editingItem) {
        response = await updateTeachingLearningProcess(
          editingItem._id,
          formData,
        );

        setMessage(
          response?.message ||
            "Teaching learning process image updated successfully.",
        );
      } else {
        /* ===================================================
         CREATE
      =================================================== */
        response = await createTeachingLearningProcess(formData);

        setMessage(
          response?.message ||
            "Teaching learning process image uploaded successfully.",
        );
      }

      await loadItems();

      setShowModal(false);

      resetForm();
    } catch (err) {
      console.error("Teaching Learning Process save error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to save teaching learning process image.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     DELETE
  ======================================================= */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this teaching learning process image?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      setMessage("");

      const response = await deleteTeachingLearningProcess(id);

      setMessage(
        response?.message ||
          "Teaching learning process image deleted successfully.",
      );

      await loadItems();
    } catch (err) {
      console.error("Teaching Learning Process delete error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to delete image.",
      );
    }
  };

  /* =======================================================
     TOGGLE STATUS
  ======================================================= */

  const handleToggleStatus = async (id) => {
    try {
      setError("");

      setMessage("");

      const response = await toggleTeachingLearningProcessStatus(id);

      setMessage(response?.message || "Status updated successfully.");

      await loadItems();
    } catch (err) {
      console.error("Teaching Learning Process status error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to update image status.",
      );
    }
  };

  /* =======================================================
     SORT
  ======================================================= */

  const sortedItems = [...items].sort(
    (a, b) => Number(a.displayOrder || 0) - Number(b.displayOrder || 0),
  );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="teachingLearningAdmin">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="teachingLearningAdminHeader">
        <div className="teachingLearningHeading">
          <div className="teachingLearningHeaderIcon">
            <FaBookOpen />
          </div>

          <div>
            <span>ACADEMIC MANAGEMENT</span>

            <h1>Teaching Learning Process</h1>

            <p>
              Manage teaching and learning process photographs displayed on the
              public website.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="teachingLearningAddButton"
          onClick={handleAdd}
        >
          <FaPlus />
          Add Photo
        </button>
      </div>

      {/* =================================================
          SUCCESS
      ================================================= */}

      {message && <div className="teachingLearningSuccess">{message}</div>}

      {/* =================================================
          ERROR
      ================================================= */}

      {error && !showModal && (
        <div className="teachingLearningError">{error}</div>
      )}

      {/* =================================================
          LOADING
      ================================================= */}

      {loading ? (
        <div className="teachingLearningLoading">
          <FaImage />

          <p>Loading teaching learning process images...</p>
        </div>
      ) : sortedItems.length === 0 ? (
        /* ===============================================
           EMPTY
        =============================================== */

        <div className="teachingLearningEmpty">
          <div className="teachingLearningEmptyIcon">
            <FaImage />
          </div>

          <h2>No Photos Added</h2>

          <p>
            Upload teaching learning process photographs to display them on the
            public website.
          </p>

          <button type="button" onClick={handleAdd}>
            <FaPlus />
            Add First Photo
          </button>
        </div>
      ) : (
        /* ===============================================
           IMAGE GRID
        =============================================== */

        <div className="teachingLearningGrid">
          {sortedItems.map((item, index) => (
            <article className="teachingLearningCard" key={item._id}>
              {/* =====================================
                    IMAGE
                ===================================== */}

              <div className="teachingLearningImage">
                <img
                  src={item.image}
                  alt={`Teaching Learning Process ${index + 1}`}
                />

                <div className="teachingLearningImageOverlay">
                  <button
                    type="button"
                    onClick={() => setPreviewImage(item.image)}
                  >
                    <FaEye />
                    View
                  </button>
                </div>

                <div className="teachingLearningOrderBadge">
                  <FaSortNumericDown />

                  {item.displayOrder ?? 0}
                </div>
              </div>

              {/* =====================================
                    CARD BODY
                ===================================== */}

              <div className="teachingLearningCardBody">
                <div className="teachingLearningCardTop">
                  <div>
                    <span>PHOTO</span>

                    <h3>Teaching Learning Process</h3>
                  </div>

                  <span
                    className={
                      item.isPublished
                        ? "teachingLearningPublished"
                        : "teachingLearningDraft"
                    }
                  >
                    {item.isPublished ? "Published" : "Draft"}
                  </span>
                </div>

                {/* ===================================
                      ACTIONS
                  =================================== */}

                <div className="teachingLearningActions">
                  <button
                    type="button"
                    className="teachingLearningViewButton"
                    onClick={() => setPreviewImage(item.image)}
                  >
                    <FaEye />
                    View
                  </button>

                  <button
                    type="button"
                    className="teachingLearningEditButton"
                    onClick={() => handleEdit(item)}
                  >
                    <FaEdit />
                    Edit
                  </button>

                  <button
                    type="button"
                    className={
                      item.isPublished
                        ? "teachingLearningDraftButton"
                        : "teachingLearningPublishButton"
                    }
                    onClick={() => handleToggleStatus(item._id)}
                  >
                    {item.isPublished ? (
                      <>
                        <FaEyeSlash />
                        Draft
                      </>
                    ) : (
                      <>
                        <FaEye />
                        Publish
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="teachingLearningDeleteButton"
                    onClick={() => handleDelete(item._id)}
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {showModal && (
        <div
          className="teachingLearningModalOverlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleClose();
            }
          }}
        >
          <div className="teachingLearningModal">
            {/* =========================================
                MODAL HEADER
            ========================================= */}

            <div className="teachingLearningModalHeader">
              <div>
                <span>{editingItem ? "UPDATE PHOTO" : "NEW PHOTO"}</span>

                <h2>
                  {editingItem
                    ? "Edit Teaching Learning Process"
                    : "Add Teaching Learning Process"}
                </h2>
              </div>

              <button
                type="button"
                className="teachingLearningCloseButton"
                onClick={handleClose}
                disabled={saving}
              >
                <FaTimes />
              </button>
            </div>

            {/* =========================================
                MODAL ERROR
            ========================================= */}

            {error && <div className="teachingLearningModalError">{error}</div>}

            {/* =========================================
                FORM
            ========================================= */}

            <form className="teachingLearningForm" onSubmit={handleSubmit}>
              {/* =======================================
                  IMAGE UPLOAD
              ======================================= */}

              <div className="teachingLearningFormGroup">
                <label>
                  Teaching Learning Process Photo
                  {!editingItem && <strong> *</strong>}
                </label>

                <div
                  className="teachingLearningUploadBox"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <div className="teachingLearningUploadPreview">
                      <img src={imagePreview} alt="Selected preview" />

                      <div className="teachingLearningChangeImage">
                        <FaUpload />

                        {selectedFile ? "Change Photo" : "Choose New Photo"}
                      </div>
                    </div>
                  ) : (
                    <div className="teachingLearningUploadPlaceholder">
                      <FaUpload />

                      <h3>Click to Upload Photo</h3>

                      <p>JPG, JPEG, PNG or WEBP</p>

                      <small>Maximum size: 10 MB</small>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="teachingLearningHiddenInput"
                />
              </div>

              {/* =======================================
                  DISPLAY ORDER
              ======================================= */}

              <div className="teachingLearningFormGroup">
                <label htmlFor="displayOrder">Display Order</label>

                <input
                  id="displayOrder"
                  type="number"
                  min="0"
                  value={displayOrder}
                  onChange={(event) => setDisplayOrder(event.target.value)}
                />

                <small>Lower numbers appear first.</small>
              </div>

              {/* =======================================
                  PUBLISHED
              ======================================= */}

              <div className="teachingLearningPublishRow">
                <div>
                  <strong>Publish on website</strong>

                  <p>Published photos will be visible on the public page.</p>
                </div>

                <button
                  type="button"
                  className={
                    isPublished
                      ? "teachingLearningSwitch active"
                      : "teachingLearningSwitch"
                  }
                  onClick={() => setIsPublished((previous) => !previous)}
                  aria-label="Toggle publish status"
                >
                  <span></span>
                </button>
              </div>

              {/* =======================================
                  ACTIONS
              ======================================= */}

              <div className="teachingLearningModalActions">
                <button
                  type="button"
                  className="teachingLearningCancelButton"
                  onClick={handleClose}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="teachingLearningSaveButton"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <FaUpload />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave />

                      {editingItem ? "Update Photo" : "Upload Photo"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================
          FULL IMAGE PREVIEW
      ================================================= */}

      {previewImage && (
        <div
          className="teachingLearningPreviewOverlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setPreviewImage(null);
            }
          }}
        >
          <div className="teachingLearningPreviewModal">
            <button
              type="button"
              className="teachingLearningPreviewClose"
              onClick={() => setPreviewImage(null)}
            >
              <FaTimes />
            </button>

            <img src={previewImage} alt="Teaching Learning Process Preview" />
          </div>
        </div>
      )}
    </div>
  );
};

export default TeachingLearningProcess;
