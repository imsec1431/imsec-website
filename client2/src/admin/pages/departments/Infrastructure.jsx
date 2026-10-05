import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AccessDenied from "../auth/AccessDenied";
import Modal from "react-bootstrap/Modal";

import {
  FaArrowLeft,
  FaPlus,
  FaEdit,
  FaTrash,
  FaImage,
  FaDesktop,
  FaWifi,
  FaBook,
  FaMicrochip,
  FaChalkboardTeacher,
  FaServer,
  FaTimes,
} from "react-icons/fa";

import "./Infrastructure.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api`;

const facilityIcons = {
  desktop: <FaDesktop />,
  wifi: <FaWifi />,
  book: <FaBook />,
  microchip: <FaMicrochip />,
  chalkboard: <FaChalkboardTeacher />,
  server: <FaServer />,
};

const emptyHighlight = {
  title: "",
  description: "",
  displayOrder: 1,
  image: null,
};

const emptyFacility = {
  title: "",
  icon: "desktop",
  displayOrder: 1,
};

const Infrastructure = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { admin } = useAuth();

  const isSubAdmin = admin?.role === "Sub Admin";

  const departmentPermission = isSubAdmin
    ? admin?.permissions?.departments?.find(
        (item) =>
          String(item?.slug || "").toLowerCase() ===
            String(slug || "").toLowerCase() ||
          String(item?.departmentId || "") ===
            String(admin?.departmentId || ""),
      )
    : null;

  const infrastructurePermission = departmentPermission?.modules?.find(
    (item) => item?.key === "infrastructure",
  );

  const canManageInfrastructure =
    !isSubAdmin ||
    Boolean(
      departmentPermission?.enabled &&
      (infrastructurePermission?.enabled ||
        infrastructurePermission?.subModules?.some((item) => item?.enabled)),
    );

  const authHeaders = () => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("adminToken") ||
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("adminToken");

    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  /* =====================================================
     DEPARTMENT
  =====================================================
  */

  const [department, setDepartment] = useState(null);

  /* =====================================================
     INFRASTRUCTURE DATA
  ===================================================== */

  const [infrastructure, setInfrastructure] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* =====================================================
     MAIN FORM
  ===================================================== */

  const [title, setTitle] = useState("Department Infrastructure");

  const [description1, setDescription1] = useState("");

  const [description2, setDescription2] = useState("");

  const [mainImage, setMainImage] = useState(null);

  const [mainImagePreview, setMainImagePreview] = useState("");

  /* =====================================================
     HIGHLIGHTS
  ===================================================== */

  const [highlights, setHighlights] = useState([]);

  const [showHighlightModal, setShowHighlightModal] = useState(false);

  const [editingHighlightIndex, setEditingHighlightIndex] = useState(null);

  const [highlightForm, setHighlightForm] = useState(emptyHighlight);

  const [highlightPreview, setHighlightPreview] = useState("");

  /* =====================================================
     FACILITIES
  ===================================================== */

  const [facilities, setFacilities] = useState([]);

  const [showFacilityModal, setShowFacilityModal] = useState(false);

  const [editingFacilityIndex, setEditingFacilityIndex] = useState(null);

  const [facilityForm, setFacilityForm] = useState(emptyFacility);

  /* =====================================================
     GALLERY
  ===================================================== */

  const [galleryFile, setGalleryFile] = useState(null);

  const [galleryPreview, setGalleryPreview] = useState("");

  /* =====================================================
     MESSAGE MODAL
  ===================================================== */

  const [messageModal, setMessageModal] = useState({
    show: false,
    type: "success",
    title: "",
    message: "",
  });

  /* =====================================================
     DELETE MODAL
  ===================================================== */

  const [deleteModal, setDeleteModal] = useState({
    show: false,
    type: "",
    index: null,
    item: null,
  });

  /* =====================================================
     SHOW MESSAGE
  ===================================================== */

  const showMessage = (type, titleText, messageText) => {
    setMessageModal({
      show: true,
      type,
      title: titleText,
      message: messageText,
    });
  };

  /* =====================================================
     LOAD DEPARTMENT
  ===================================================== */

  const loadDepartment = async () => {
    try {
      const response = await fetch(`${API_URL}/departments`, {
        headers: authHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch departments");
      }

      const departments = Array.isArray(result.data) ? result.data : [];

      const currentDepartment = departments.find((item) => item.slug === slug);

      if (!currentDepartment) {
        throw new Error("Department not found");
      }

      setDepartment(currentDepartment);

      return currentDepartment;
    } catch (error) {
      console.error("Load Department Error:", error);

      throw error;
    }
  };

  /* =====================================================
     LOAD INFRASTRUCTURE
  ===================================================== */

  const loadInfrastructure = async (departmentId) => {
    try {
      const response = await fetch(
        `${API_URL}/department-infrastructure/${departmentId}`,
        {
          headers: authHeaders(),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch infrastructure");
      }

      if (result.exists && result.data) {
        const data = result.data;

        setInfrastructure(data);

        setTitle(data.title || "Department Infrastructure");

        setDescription1(data.description1 || "");

        setDescription2(data.description2 || "");

        setMainImagePreview(data.mainImage || "");

        setHighlights(Array.isArray(data.highlights) ? data.highlights : []);

        setFacilities(Array.isArray(data.facilities) ? data.facilities : []);
      } else {
        setInfrastructure(null);

        setTitle("Department Infrastructure");

        setDescription1("");
        setDescription2("");
        setMainImage(null);
        setMainImagePreview("");
        setHighlights([]);
        setFacilities([]);
      }
    } catch (error) {
      console.error("Load Infrastructure Error:", error);

      throw error;
    }
  };

  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const departmentData = await loadDepartment();

        await loadInfrastructure(departmentData._id);
      } catch (error) {
        showMessage(
          "error",
          "Unable to Load",
          error.message || "Failed to load infrastructure.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadData();
    }
  }, [slug]);

  /* =====================================================
     MAIN IMAGE
  ===================================================== */

  const handleMainImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      showMessage(
        "error",
        "Invalid Image",
        "Please select a valid image file.",
      );

      return;
    }

    setMainImage(file);

    setMainImagePreview(URL.createObjectURL(file));
  };

  /* =====================================================
     SAVE INFRASTRUCTURE
  ===================================================== */

  const handleSaveInfrastructure = async (event) => {
    event.preventDefault();

    if (!canManageInfrastructure) {
      showMessage(
        "error",
        "Access Denied",
        "You do not have permission to manage department infrastructure.",
      );
      return;
    }

    if (!department?._id) {
      showMessage(
        "error",
        "Department Missing",
        "Department information is not available.",
      );

      return;
    }

    if (!title.trim()) {
      showMessage(
        "error",
        "Validation Error",
        "Infrastructure title is required.",
      );

      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("departmentId", department._id);

      formData.append("title", title.trim());

      formData.append("description1", description1);

      formData.append("description2", description2);

      /* =====================================================
         HIGHLIGHT DATA
         IMPORTANT:
         Do not put File objects inside JSON.
         A File becomes {} when JSON.stringify() is used,
         which causes Mongoose:
         "Cast to string failed for value {}"
      ===================================================== */

      const highlightData = highlights.map((item, index) => ({
        _id: item._id || "",
        title: item.title || "",
        description: item.description || "",

        // Existing Cloudinary URL only.
        // New File objects are uploaded separately below.
        image:
          typeof item.image === "string"
            ? item.image
            : item.existingImage || "",

        publicId: item.publicId || "",

        displayOrder: Number(item.displayOrder) || index + 1,
      }));

      formData.append("highlights", JSON.stringify(highlightData));

      /* =====================================================
         HIGHLIGHT IMAGE FILES
         Send actual image files separately.
      ===================================================== */

      highlights.forEach((item) => {
        if (item.image && typeof item.image !== "string") {
          formData.append("highlightImages", item.image);
        }
      });

      formData.append(
        "facilities",
        JSON.stringify(
          facilities.map((item) => ({
            _id: item._id,
            title: item.title,
            icon: item.icon,
            displayOrder: Number(item.displayOrder) || 1,
          })),
        ),
      );

      if (mainImage) {
        formData.append("mainImage", mainImage);
      }

      const url = infrastructure
        ? `${API_URL}/department-infrastructure/${department._id}`
        : `${API_URL}/department-infrastructure`;

      const response = await fetch(url, {
        method: infrastructure ? "PUT" : "POST",
        headers: authHeaders(),
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save infrastructure");
      }

      setInfrastructure(result.data);

      setMainImage(null);

      setMainImagePreview(result.data.mainImage || "");

      setHighlights(result.data.highlights || []);

      setFacilities(result.data.facilities || []);

      showMessage(
        "success",
        infrastructure ? "Infrastructure Updated" : "Infrastructure Created",
        infrastructure
          ? "Department infrastructure has been updated successfully."
          : "Department infrastructure has been created successfully.",
      );
    } catch (error) {
      console.error("Save Infrastructure Error:", error);

      showMessage(
        "error",
        "Save Failed",
        error.message || "Failed to save infrastructure.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     HIGHLIGHT FORM
  ===================================================== */

  const openAddHighlight = () => {
    if (!canManageInfrastructure) return;
    setEditingHighlightIndex(null);

    setHighlightForm({
      ...emptyHighlight,
      displayOrder: highlights.length + 1,
    });

    setHighlightPreview("");

    setShowHighlightModal(true);
  };

  const openEditHighlight = (item, index) => {
    if (!canManageInfrastructure) return;
    setEditingHighlightIndex(index);

    setHighlightForm({
      title: item.title || "",
      description: item.description || "",
      displayOrder: item.displayOrder || index + 1,
      image: null,
    });

    setHighlightPreview(item.image || "");

    setShowHighlightModal(true);
  };

  const handleHighlightChange = (event) => {
    const { name, value } = event.target;

    setHighlightForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleHighlightImage = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      showMessage(
        "error",
        "Invalid Image",
        "Please select a valid image file.",
      );

      return;
    }

    setHighlightForm((prev) => ({
      ...prev,
      image: file,
    }));

    setHighlightPreview(URL.createObjectURL(file));
  };

  const saveHighlight = () => {
    if (!canManageInfrastructure) return;

    if (!highlightForm.title.trim()) {
      showMessage("error", "Validation Error", "Highlight title is required.");

      return;
    }

    if (!highlightForm.description.trim()) {
      showMessage(
        "error",
        "Validation Error",
        "Highlight description is required.",
      );

      return;
    }

    if (editingHighlightIndex === null && !highlightForm.image) {
      showMessage(
        "error",
        "Image Required",
        "Please select a highlight image.",
      );

      return;
    }

    const newHighlight = {
      title: highlightForm.title.trim(),

      description: highlightForm.description.trim(),

      displayOrder: Number(highlightForm.displayOrder) || 1,

      // New image is kept as a File temporarily.
      // It is uploaded separately during Save/Update.
      image: highlightForm.image || null,

      preview: highlightPreview,

      /* Existing Cloudinary values */
      ...(editingHighlightIndex !== null && highlights[editingHighlightIndex]
        ? {
            _id: highlights[editingHighlightIndex]._id,

            publicId: highlights[editingHighlightIndex].publicId || "",

            existingImage: highlights[editingHighlightIndex].image || "",
          }
        : {}),
    };

    if (editingHighlightIndex === null) {
      setHighlights((prev) => [...prev, newHighlight]);
    } else {
      setHighlights((prev) =>
        prev.map((item, index) =>
          index === editingHighlightIndex
            ? {
                ...item,
                ...newHighlight,
              }
            : item,
        ),
      );
    }

    setShowHighlightModal(false);

    setHighlightForm(emptyHighlight);

    setHighlightPreview("");
  };

  /* =====================================================
     DELETE HIGHLIGHT
  ===================================================== */

  const confirmDeleteHighlight = (index) => {
    if (!canManageInfrastructure) return;

    setDeleteModal({
      show: true,
      type: "highlight",
      index,
      item: highlights[index],
    });
  };

  /* =====================================================
     FACILITY
  ===================================================== */

  const openAddFacility = () => {
    if (!canManageInfrastructure) return;
    setEditingFacilityIndex(null);

    setFacilityForm({
      ...emptyFacility,
      displayOrder: facilities.length + 1,
    });

    setShowFacilityModal(true);
  };

  const openEditFacility = (item, index) => {
    if (!canManageInfrastructure) return;
    setEditingFacilityIndex(index);

    setFacilityForm({
      title: item.title || "",
      icon: item.icon || "desktop",
      displayOrder: item.displayOrder || index + 1,
    });

    setShowFacilityModal(true);
  };

  const handleFacilityChange = (event) => {
    const { name, value } = event.target;

    setFacilityForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveFacility = () => {
    if (!canManageInfrastructure) return;

    if (!facilityForm.title.trim()) {
      showMessage("error", "Validation Error", "Facility name is required.");

      return;
    }

    const newFacility = {
      title: facilityForm.title.trim(),

      icon: facilityForm.icon,

      displayOrder: Number(facilityForm.displayOrder) || 1,

      ...(editingFacilityIndex !== null && facilities[editingFacilityIndex]
        ? {
            _id: facilities[editingFacilityIndex]._id,
          }
        : {}),
    };

    if (editingFacilityIndex === null) {
      setFacilities((prev) => [...prev, newFacility]);
    } else {
      setFacilities((prev) =>
        prev.map((item, index) =>
          index === editingFacilityIndex ? newFacility : item,
        ),
      );
    }

    setShowFacilityModal(false);

    setFacilityForm(emptyFacility);
  };

  /* =====================================================
     DELETE FACILITY
  ===================================================== */

  const confirmDeleteFacility = (index) => {
    if (!canManageInfrastructure) return;

    setDeleteModal({
      show: true,
      type: "facility",
      index,
      item: facilities[index],
    });
  };

  /* =====================================================
     DELETE GALLERY
  ===================================================== */

  const confirmDeleteGallery = (item) => {
    if (!canManageInfrastructure) return;

    setDeleteModal({
      show: true,
      type: "gallery",
      index: null,
      item,
    });
  };

  /* =====================================================
     CONFIRM DELETE
  ===================================================== */

  const handleConfirmDelete = async () => {
    if (!canManageInfrastructure) {
      setDeleteModal({
        show: false,
        type: "",
        index: null,
        item: null,
      });
      return;
    }

    const { type, index, item } = deleteModal;

    if (type === "highlight") {
      setHighlights((prev) => prev.filter((_, i) => i !== index));

      setDeleteModal({
        show: false,
        type: "",
        index: null,
        item: null,
      });

      return;
    }

    if (type === "facility") {
      setFacilities((prev) => prev.filter((_, i) => i !== index));

      setDeleteModal({
        show: false,
        type: "",
        index: null,
        item: null,
      });

      return;
    }

    /* ===============================================
         GALLERY DELETE
      =============================================== */

    if (type === "gallery" && item?._id && department?._id) {
      try {
        setSaving(true);

        const response = await fetch(
          `${API_URL}/department-infrastructure/${department._id}/gallery/${item._id}`,
          {
            method: "DELETE",
            headers: authHeaders(),
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to delete gallery image");
        }

        setInfrastructure(result.data);

        setHighlights(result.data.highlights || []);

        setFacilities(result.data.facilities || []);

        setDeleteModal({
          show: false,
          type: "",
          index: null,
          item: null,
        });

        showMessage(
          "success",
          "Gallery Image Deleted",
          "Gallery image has been removed successfully.",
        );
      } catch (error) {
        showMessage(
          "error",
          "Delete Failed",
          error.message || "Failed to delete gallery image.",
        );
      } finally {
        setSaving(false);
      }
    }
  };

  /* =====================================================
     GALLERY FILE SELECT
  ===================================================== */

  const handleGalleryFile = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      showMessage(
        "error",
        "Invalid Image",
        "Please select a valid image file.",
      );

      return;
    }

    setGalleryFile(file);

    setGalleryPreview(URL.createObjectURL(file));
  };

  /* =====================================================
     UPLOAD GALLERY
  ===================================================== */

  const uploadGallery = async () => {
    if (!canManageInfrastructure) {
      showMessage(
        "error",
        "Access Denied",
        "You do not have permission to manage department infrastructure.",
      );
      return;
    }

    if (!galleryFile) {
      showMessage("error", "Image Required", "Please select a gallery image.");

      return;
    }

    if (!department?._id) {
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("image", galleryFile);

      const response = await fetch(
        `${API_URL}/department-infrastructure/${department._id}/gallery`,
        {
          method: "POST",
          headers: authHeaders(),
          body: formData,
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to upload gallery image");
      }

      setInfrastructure(result.data);

      setGalleryFile(null);
      setGalleryPreview("");

      showMessage(
        "success",
        "Gallery Image Added",
        "Gallery image has been uploaded successfully.",
      );
    } catch (error) {
      console.error("Upload Gallery Error:", error);

      showMessage(
        "error",
        "Upload Failed",
        error.message || "Failed to upload gallery image.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     ACCESS CONTROL
  ===================================================== */

  if (!canManageInfrastructure) {
    return <AccessDenied />;
  }

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="infrastructure-loading">
        <div className="infrastructure-spinner" />
        <p>Loading infrastructure...</p>
      </div>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="infrastructure-admin-page">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="infrastructure-admin-header">
        <button
          type="button"
          className="infrastructure-back-btn"
          onClick={() => navigate(`/imsec-control-center/departments/${slug}`)}
        >
          <FaArrowLeft />
          Back to Department
        </button>

        <div className="infrastructure-header-content">
          <div>
            <span>DEPARTMENT MANAGEMENT</span>

            <h1>{department?.name} — Infrastructure</h1>

            <p>
              Manage department infrastructure, facilities, laboratories and
              gallery.
            </p>
          </div>
        </div>
      </div>

      {/* =================================================
          MAIN INFRASTRUCTURE
      ================================================= */}

      <form onSubmit={handleSaveInfrastructure}>
        <section className="infrastructure-admin-card">
          <div className="infrastructure-card-header">
            <div>
              <span>MAIN INFORMATION</span>

              <h2>Department Infrastructure</h2>
            </div>

            <button
              type="submit"
              className="infrastructure-save-btn"
              disabled={saving || !canManageInfrastructure}
            >
              {saving
                ? "Saving..."
                : infrastructure
                  ? "Update Infrastructure"
                  : "Create Infrastructure"}
            </button>
          </div>

          <div className="infrastructure-main-grid">
            {/* IMAGE */}

            <div className="infrastructure-main-image-section">
              <label>Main Infrastructure Image</label>

              <label className="infrastructure-image-upload">
                {mainImagePreview ? (
                  <img src={mainImagePreview} alt="Infrastructure" />
                ) : (
                  <div>
                    <FaImage />

                    <strong>Upload Main Image</strong>

                    <small>JPG, PNG or WEBP</small>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageChange}
                  disabled={!canManageInfrastructure}
                />
              </label>
            </div>

            {/* TEXT */}

            <div className="infrastructure-main-fields">
              <div className="infrastructure-form-group">
                <label>Title *</label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Department Infrastructure"
                />
              </div>

              <div className="infrastructure-form-group">
                <label>Description 1</label>

                <textarea
                  rows="5"
                  value={description1}
                  onChange={(e) => setDescription1(e.target.value)}
                  placeholder="Enter infrastructure description..."
                />
              </div>

              <div className="infrastructure-form-group">
                <label>Description 2</label>

                <textarea
                  rows="5"
                  value={description2}
                  onChange={(e) => setDescription2(e.target.value)}
                  placeholder="Enter additional infrastructure description..."
                />
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            HIGHLIGHTS
        ================================================= */}

        <section className="infrastructure-admin-card">
          <div className="infrastructure-card-header">
            <div>
              <span>INFRASTRUCTURE HIGHLIGHTS</span>

              <h2>Manage Highlights</h2>

              <p>Smart classrooms, laboratories, library, etc.</p>
            </div>

            <button
              type="button"
              className="infrastructure-outline-btn"
              onClick={openAddHighlight}
              disabled={!canManageInfrastructure}
            >
              <FaPlus />
              Add Highlight
            </button>
          </div>

          {highlights.length === 0 ? (
            <div className="infrastructure-empty">
              <FaImage />

              <h3>No Highlights Added</h3>

              <p>Add your first infrastructure highlight.</p>
            </div>
          ) : (
            <div className="infrastructure-highlights-grid">
              {highlights
                .slice()
                .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                .map((item, index) => (
                  <div
                    className="infrastructure-highlight-card"
                    key={item._id || index}
                  >
                    <div className="infrastructure-highlight-image">
                      {item.image || item.preview ? (
                        <img
                          src={item.preview || item.image}
                          alt={item.title}
                        />
                      ) : (
                        <FaImage />
                      )}

                      <span>#{item.displayOrder}</span>
                    </div>

                    <div className="infrastructure-highlight-body">
                      <h3>{item.title}</h3>

                      <p>{item.description}</p>

                      <div className="infrastructure-item-actions">
                        <button
                          type="button"
                          onClick={() =>
                            openEditHighlight(item, highlights.indexOf(item))
                          }
                          disabled={!canManageInfrastructure}
                        >
                          <FaEdit />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            confirmDeleteHighlight(highlights.indexOf(item))
                          }
                          disabled={!canManageInfrastructure}
                        >
                          <FaTrash />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>

        {/* =================================================
            FACILITIES
        ================================================= */}

        <section className="infrastructure-admin-card">
          <div className="infrastructure-card-header">
            <div>
              <span>FACILITIES</span>

              <h2>Department Facilities</h2>
            </div>

            <button
              type="button"
              className="infrastructure-outline-btn"
              onClick={openAddFacility}
              disabled={!canManageInfrastructure}
            >
              <FaPlus />
              Add Facility
            </button>
          </div>

          {facilities.length === 0 ? (
            <div className="infrastructure-empty">
              <FaDesktop />

              <h3>No Facilities Added</h3>

              <p>Add department facilities.</p>
            </div>
          ) : (
            <div className="infrastructure-facilities-grid">
              {facilities
                .slice()
                .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                .map((item, index) => (
                  <div
                    className="infrastructure-facility-card"
                    key={item._id || index}
                  >
                    <div className="infrastructure-facility-icon">
                      {facilityIcons[item.icon] || <FaDesktop />}
                    </div>

                    <div>
                      <h3>{item.title}</h3>

                      <small>Order #{item.displayOrder}</small>
                    </div>

                    <div className="infrastructure-facility-actions">
                      <button
                        type="button"
                        onClick={() =>
                          openEditFacility(item, facilities.indexOf(item))
                        }
                      >
                        <FaEdit />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          confirmDeleteFacility(facilities.indexOf(item))
                        }
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>

        {/* =================================================
            GALLERY
        ================================================= */}

        <section className="infrastructure-admin-card">
          <div className="infrastructure-card-header">
            <div>
              <span>INFRASTRUCTURE GALLERY</span>

              <h2>Gallery Images</h2>

              <p>Upload images from Cloudinary.</p>
            </div>
          </div>

          <div className="infrastructure-gallery-upload">
            <label className="gallery-upload-box">
              {galleryPreview ? (
                <img src={galleryPreview} alt="Gallery preview" />
              ) : (
                <div>
                  <FaImage />

                  <strong>Choose Gallery Image</strong>

                  <small>JPG, PNG or WEBP</small>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleGalleryFile}
              />
            </label>

            <button
              type="button"
              className="infrastructure-gallery-upload-btn"
              onClick={uploadGallery}
              disabled={saving || !galleryFile}
            >
              <FaPlus />

              {saving ? "Uploading..." : "Upload Gallery Image"}
            </button>
          </div>

          {infrastructure?.gallery?.length > 0 ? (
            <div className="infrastructure-gallery-grid">
              {infrastructure.gallery
                .slice()
                .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                .map((item) => (
                  <div className="infrastructure-gallery-item" key={item._id}>
                    <img src={item.image} alt="Infrastructure gallery" />

                    <span>#{item.displayOrder}</span>

                    <button
                      type="button"
                      onClick={() => confirmDeleteGallery(item)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
            </div>
          ) : (
            <div className="infrastructure-empty gallery-empty">
              <FaImage />

              <h3>No Gallery Images</h3>

              <p>Upload infrastructure gallery images.</p>
            </div>
          )}
        </section>
      </form>

      {/* =================================================
          HIGHLIGHT MODAL
      ================================================= */}

      <Modal
        show={showHighlightModal}
        onHide={() => setShowHighlightModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingHighlightIndex === null
              ? "Add Infrastructure Highlight"
              : "Edit Infrastructure Highlight"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="infrastructure-modal-form">
            <div className="infrastructure-form-group">
              <label>Highlight Title *</label>

              <input
                type="text"
                name="title"
                value={highlightForm.title}
                onChange={handleHighlightChange}
                placeholder="Smart Classrooms"
              />
            </div>

            <div className="infrastructure-form-group">
              <label>Description *</label>

              <textarea
                rows="4"
                name="description"
                value={highlightForm.description}
                onChange={handleHighlightChange}
                placeholder="Enter highlight description..."
              />
            </div>

            <div className="infrastructure-form-group">
              <label>Display Order</label>

              <input
                type="number"
                min="1"
                name="displayOrder"
                value={highlightForm.displayOrder}
                onChange={handleHighlightChange}
              />
            </div>

            <div className="infrastructure-form-group">
              <label>Highlight Image *</label>

              <label className="modal-image-upload">
                {highlightPreview ? (
                  <img src={highlightPreview} alt="Highlight preview" />
                ) : (
                  <div>
                    <FaImage />

                    <span>Choose Image</span>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHighlightImage}
                />
              </label>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button
            type="button"
            className="modal-cancel-btn"
            onClick={() => setShowHighlightModal(false)}
          >
            Cancel
          </button>

          <button
            type="button"
            className="modal-save-btn"
            onClick={saveHighlight}
          >
            {editingHighlightIndex === null
              ? "Add Highlight"
              : "Update Highlight"}
          </button>
        </Modal.Footer>
      </Modal>

      {/* =================================================
          FACILITY MODAL
      ================================================= */}

      <Modal
        show={showFacilityModal}
        onHide={() => setShowFacilityModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingFacilityIndex === null ? "Add Facility" : "Edit Facility"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="infrastructure-modal-form">
            <div className="infrastructure-form-group">
              <label>Facility Name *</label>

              <input
                type="text"
                name="title"
                value={facilityForm.title}
                onChange={handleFacilityChange}
                placeholder="High-Speed Wi-Fi"
              />
            </div>

            <div className="infrastructure-form-group">
              <label>Facility Icon</label>

              <select
                name="icon"
                value={facilityForm.icon}
                onChange={handleFacilityChange}
              >
                <option value="desktop">Computer</option>

                <option value="wifi">Wi-Fi</option>

                <option value="book">Book</option>

                <option value="microchip">Microchip</option>

                <option value="chalkboard">Teaching</option>

                <option value="server">Server</option>
              </select>
            </div>

            <div className="infrastructure-form-group">
              <label>Display Order</label>

              <input
                type="number"
                min="1"
                name="displayOrder"
                value={facilityForm.displayOrder}
                onChange={handleFacilityChange}
              />
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button
            type="button"
            className="modal-cancel-btn"
            onClick={() => setShowFacilityModal(false)}
          >
            Cancel
          </button>

          <button
            type="button"
            className="modal-save-btn"
            onClick={saveFacility}
          >
            {editingFacilityIndex === null ? "Add Facility" : "Update Facility"}
          </button>
        </Modal.Footer>
      </Modal>

      {/* =================================================
          DELETE MODAL
      ================================================= */}

      <Modal
        show={deleteModal.show}
        onHide={() =>
          setDeleteModal({
            show: false,
            type: "",
            index: null,
            item: null,
          })
        }
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="delete-modal-content">
            <div className="delete-modal-icon">
              <FaTrash />
            </div>

            <h4>
              Delete{" "}
              {deleteModal.type === "gallery"
                ? "Gallery Image"
                : deleteModal.type === "facility"
                  ? "Facility"
                  : "Highlight"}
              ?
            </h4>

            <p>
              Are you sure you want to delete{" "}
              <strong>{deleteModal.item?.title || "this item"}</strong>?
            </p>

            {deleteModal.type === "gallery" && (
              <small>The image will also be removed from Cloudinary.</small>
            )}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button
            type="button"
            className="modal-cancel-btn"
            onClick={() =>
              setDeleteModal({
                show: false,
                type: "",
                index: null,
                item: null,
              })
            }
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="button"
            className="modal-delete-btn"
            onClick={handleConfirmDelete}
            disabled={saving}
          >
            {saving ? "Deleting..." : "Delete"}
          </button>
        </Modal.Footer>
      </Modal>

      {/* =================================================
          SUCCESS / ERROR MODAL
      ================================================= */}

      <Modal
        show={messageModal.show}
        onHide={() =>
          setMessageModal({
            show: false,
            type: "success",
            title: "",
            message: "",
          })
        }
        centered
      >
        <Modal.Body>
          <div className={`infrastructure-message-modal ${messageModal.type}`}>
            <div className="message-icon">
              {messageModal.type === "success" ? "✓" : "!"}
            </div>

            <h4>{messageModal.title}</h4>

            <p>{messageModal.message}</p>

            <button
              type="button"
              className="modal-save-btn"
              onClick={() =>
                setMessageModal({
                  show: false,
                  type: "success",
                  title: "",
                  message: "",
                })
              }
            >
              OK
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Infrastructure;
