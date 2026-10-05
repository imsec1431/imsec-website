import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaArrowLeft,
  FaBookOpen,
  FaSave,
  FaPlus,
  FaTrash,
  FaUserTie,
  FaUpload,
  FaSpinner,
} from "react-icons/fa";

import "./department-overview.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api`;

/* =========================================================
   AUTH HEADERS
========================================================= */
const getAuthHeaders = (includeContentType = false) => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("adminToken") ||
    sessionStorage.getItem("token") ||
    sessionStorage.getItem("adminToken") ||
    null;

  const headers = token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};

  if (includeContentType) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

/* =========================================================
   EMPTY OVERVIEW
========================================================= */
const emptyOverview = {
  bannerTitle: "",
  overviewImage: "",
  overviewImagePublicId: "",
  aboutDepartment: "",
  vision: "",
  mission: [],
  headOfDepartment: "",
  departmentHighlights: [],
  whyChooseDepartment: [],
  placementStatistics: [],
  departmentGallery: [],
  joinDepartmentTitle: "",
  joinDepartmentDescription: "",
  joinDepartmentUrl: "",
  status: "Active",
};

/* =========================================================
   COMPONENT
========================================================= */
const DepartmentOverview = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { admin, isSubAdmin } = useAuth();

  /* =======================================================
     SUB ADMIN PERMISSION
  ======================================================= */
  const departmentPermission = isSubAdmin
    ? admin?.permissions?.departments?.find(
        (item) =>
          String(item?.slug || "").toLowerCase() ===
            String(slug || "").toLowerCase() ||
          String(item?.departmentId || "") === String(slug || ""),
      )
    : null;

  const overviewPermission = departmentPermission?.modules?.find(
    (module) => module?.key === "overview",
  );

  const canManageOverview = !isSubAdmin
    ? true
    : Boolean(
        departmentPermission?.enabled &&
        (overviewPermission?.enabled ||
          overviewPermission?.subModules?.some(
            (subModule) =>
              subModule?.key === "department-overview" && subModule?.enabled,
          )),
      );

  /* =======================================================
     STATES
  ======================================================= */
  const [department, setDepartment] = useState(null);
  const [faculty, setFaculty] = useState([]);
  const [overview, setOverview] = useState(emptyOverview);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [overviewImageUploading, setOverviewImageUploading] = useState(false);
  const [deletingGalleryIndex, setDeletingGalleryIndex] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* =========================================================
     LOAD DEPARTMENT + FACULTY + OVERVIEW
  ========================================================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");
        setMessage("");

        if (!slug) {
          throw new Error("Department slug is missing");
        }

        const departmentResponse = await fetch(
          `${API_URL}/departments/slug/${encodeURIComponent(slug)}`,
          {
            headers: getAuthHeaders(),
          },
        );

        const departmentResult = await departmentResponse.json();

        if (!departmentResponse.ok) {
          throw new Error(
            departmentResult.message || "Failed to fetch department",
          );
        }

        const departmentData = departmentResult.data;
        setDepartment(departmentData);

        // GET FACULTY
        try {
          const facultyResponse = await fetch(
            `${API_URL}/department-faculty/department/${departmentData._id}`,
            {
              headers: getAuthHeaders(),
            },
          );

          const facultyResult = await facultyResponse.json();

          if (facultyResponse.ok) {
            setFaculty(
              Array.isArray(facultyResult?.data) ? facultyResult.data : [],
            );
          } else {
            console.warn("Faculty could not be loaded:", facultyResult.message);
            setFaculty([]);
          }
        } catch (facultyError) {
          console.error("Load Faculty Error:", facultyError);
          setFaculty([]);
        }

        // GET OVERVIEW
        const overviewResponse = await fetch(
          `${API_URL}/department-overview/${departmentData._id}`,
          {
            headers: getAuthHeaders(),
          },
        );

        const overviewResult = await overviewResponse.json();

        if (
          overviewResponse.status === 404 ||
          overviewResult?.exists === false
        ) {
          setOverview({
            ...emptyOverview,
          });
          return;
        }

        if (!overviewResponse.ok) {
          throw new Error(overviewResult.message || "Failed to fetch overview");
        }

        if (overviewResult.data) {
          const data = overviewResult.data;

          setOverview({
            ...emptyOverview,
            ...data,
            overviewImage: data.overviewImage || "",
            overviewImagePublicId: data.overviewImagePublicId || "",
            mission: Array.isArray(data.mission) ? data.mission : [],
            departmentHighlights: Array.isArray(data.departmentHighlights)
              ? data.departmentHighlights
              : [],
            whyChooseDepartment: Array.isArray(data.whyChooseDepartment)
              ? data.whyChooseDepartment
              : [],
            placementStatistics: Array.isArray(data.placementStatistics)
              ? data.placementStatistics
              : [],
            departmentGallery: Array.isArray(data.departmentGallery)
              ? data.departmentGallery
                  .map((image, index) => {
                    if (typeof image === "string") {
                      return {
                        imageUrl: image,
                        publicId: "",
                        title: "",
                        priority: index + 1,
                      };
                    }
                    return {
                      ...image,
                      imageUrl: image?.imageUrl || image?.url || "",
                      publicId: image?.publicId || "",
                      title: image?.title || "",
                      priority: Number(image?.priority) || index + 1,
                    };
                  })
                  .filter((image) => image.imageUrl)
              : [],
            headOfDepartment:
              data.headOfDepartment?._id || data.headOfDepartment || "",
            status: data.status || "Active",
          });
        }
      } catch (err) {
        console.error("Load Department Overview Error:", err);
        setError(err.message || "Failed to load department overview");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);

  /* =========================================================
     SIMPLE INPUT CHANGE
  ========================================================= */
  const handleChange = (e) => {
    if (!canManageOverview) return;
    const { name, value } = e.target;
    setOverview((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================================
     ARRAY FIELD CHANGE
  ========================================================= */
  const handleArrayChange = (field, index, value) => {
    if (!canManageOverview) return;
    setOverview((prev) => {
      const updated = [...(prev[field] || [])];
      updated[index] = value;
      return {
        ...prev,
        [field]: updated,
      };
    });
  };

  /* =========================================================
     ADD ARRAY ITEM
  ========================================================= */
  const addArrayItem = (field) => {
    if (!canManageOverview) return;
    setOverview((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), ""],
    }));
  };

  /* =========================================================
     REMOVE ARRAY ITEM
  ========================================================= */
  const removeArrayItem = (field, index) => {
    if (!canManageOverview) return;
    setOverview((prev) => {
      const updated = [...(prev[field] || [])];
      updated.splice(index, 1);
      return {
        ...prev,
        [field]: updated,
      };
    });
  };

  /* =========================================================
     PLACEMENT STATISTICS CHANGE
  ========================================================= */
  const handlePlacementChange = (index, field, value) => {
    if (!canManageOverview) return;
    setOverview((prev) => {
      const updated = [...(prev.placementStatistics || [])];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return {
        ...prev,
        placementStatistics: updated,
      };
    });
  };

  /* =========================================================
     ADD PLACEMENT STATISTIC
  ========================================================= */
  const addPlacementStatistic = () => {
    if (!canManageOverview) return;
    setOverview((prev) => ({
      ...prev,
      placementStatistics: [
        ...(prev.placementStatistics || []),
        { label: "", value: "" },
      ],
    }));
  };

  /* =========================================================
     REMOVE PLACEMENT STATISTIC
  ========================================================= */
  const removePlacementStatistic = (index) => {
    if (!canManageOverview) return;
    setOverview((prev) => {
      const updated = [...(prev.placementStatistics || [])];
      updated.splice(index, 1);
      return {
        ...prev,
        placementStatistics: updated,
      };
    });
  };

  /* =========================================================
     UPLOAD MAIN OVERVIEW IMAGE
  ========================================================= */
  const handleOverviewImageUpload = async (event) => {
    if (!canManageOverview) {
      setError("You do not have permission to manage the department overview.");
      return;
    }

    const file = event.target.files?.[0];
    if (!file) return;

    if (!department?._id) {
      setError("Department information is missing.");
      return;
    }

    try {
      setOverviewImageUploading(true);
      setError("");
      setMessage("");

      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        throw new Error("Please upload JPG, PNG or WEBP image.");
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Overview image must be less than 5 MB.");
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${API_URL}/department-overview/${department._id}/overview-image`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: formData,
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to upload overview image.");
      }

      setOverview((prev) => ({
        ...prev,
        overviewImage: result.data?.overviewImage || "",
        overviewImagePublicId: result.data?.overviewImagePublicId || "",
      }));

      setMessage("Overview image uploaded successfully.");
    } catch (uploadError) {
      console.error("Overview Image Upload Error:", uploadError);
      setError(uploadError.message || "Failed to upload overview image.");
    } finally {
      setOverviewImageUploading(false);
      event.target.value = "";
    }
  };

  /* =========================================================
     DELETE MAIN OVERVIEW IMAGE
  ========================================================= */
  const handleOverviewImageDelete = async () => {
    if (!canManageOverview) {
      setError("You do not have permission to manage the department overview.");
      return;
    }

    if (!department?._id || !overview.overviewImage) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete the overview image?",
    );
    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/department-overview/${department._id}/overview-image`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete overview image.");
      }

      setOverview((prev) => ({
        ...prev,
        overviewImage: "",
        overviewImagePublicId: "",
      }));

      setMessage("Overview image deleted successfully.");
    } catch (deleteError) {
      console.error("Delete Overview Image Error:", deleteError);
      setError(deleteError.message || "Failed to delete overview image.");
    }
  };

  /* =========================================================
     UPLOAD GALLERY IMAGES
  ========================================================= */
  const handleGalleryUpload = async (event) => {
    if (!canManageOverview) {
      setError("You do not have permission to manage the department overview.");
      return;
    }

    const files = Array.from(event.target.files || []);
    if (!files.length || !department?._id) return;

    try {
      setGalleryUploading(true);
      setError("");
      setMessage("");

      const uploadedImages = [];

      for (const file of files) {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
          throw new Error(`${file.name} is not a JPG, PNG or WEBP image.`);
        }

        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} is larger than 5 MB.`);
        }

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(
          `${API_URL}/department-overview/${department._id}/gallery/image`,
          {
            method: "POST",
            headers: getAuthHeaders(),
            body: formData,
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || `Failed to upload ${file.name}`);
        }

        uploadedImages.push({
          imageUrl: result.data?.imageUrl || result.data?.url || "",
          publicId: result.data?.publicId || "",
          title: "",
          priority: uploadedImages.length + 1,
        });
      }

      setOverview((prev) => ({
        ...prev,
        departmentGallery: [
          ...(prev.departmentGallery || []),
          ...uploadedImages,
        ],
      }));

      setMessage(
        `${uploadedImages.length} gallery image${
          uploadedImages.length > 1 ? "s" : ""
        } uploaded successfully.`,
      );
    } catch (uploadError) {
      console.error("Gallery Upload Error:", uploadError);
      setError(uploadError.message || "Failed to upload gallery image.");
    } finally {
      setGalleryUploading(false);
      event.target.value = "";
    }
  };

  /* =========================================================
     DELETE GALLERY IMAGE
  ========================================================= */
  const handleGalleryDelete = async (image, index) => {
    if (!canManageOverview) {
      setError("You do not have permission to manage the department overview.");
      return;
    }

    try {
      setDeletingGalleryIndex(index);
      setError("");
      setMessage("");

      const publicId = typeof image === "string" ? null : image?.publicId;

      if (publicId) {
        const response = await fetch(
          `${API_URL}/department-overview/${department._id}/gallery/image`,
          {
            method: "DELETE",
            headers: getAuthHeaders(true),
            body: JSON.stringify({ publicId }),
          },
        );

        const contentType = response.headers.get("content-type") || "";
        let result = {};

        if (contentType.includes("application/json")) {
          result = await response.json();
        } else {
          const responseText = await response.text();
          throw new Error(
            `Server returned ${response.status}. Expected JSON response.`,
          );
        }

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to delete image from Cloudinary.",
          );
        }
      }

      setOverview((prev) => ({
        ...prev,
        departmentGallery: (prev.departmentGallery || []).filter(
          (_, imageIndex) => imageIndex !== index,
        ),
      }));

      setMessage("Gallery image removed successfully.");
    } catch (deleteError) {
      console.error("Gallery Delete Error:", deleteError);
      setError(deleteError.message || "Failed to delete gallery image.");
    } finally {
      setDeletingGalleryIndex(null);
    }
  };

  /* =========================================================
     SAVE OVERVIEW
  ========================================================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canManageOverview) {
      setError("You do not have permission to save the department overview.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      setError("");

      if (!department?._id) {
        throw new Error("Department information is missing");
      }

      const cleanedMission = (overview.mission || [])
        .map((item) => (typeof item === "string" ? item.trim() : ""))
        .filter(Boolean);

      const cleanedHighlights = (overview.departmentHighlights || [])
        .map((item) => (typeof item === "string" ? item.trim() : ""))
        .filter(Boolean);

      const cleanedWhyChoose = (overview.whyChooseDepartment || [])
        .map((item) => (typeof item === "string" ? item.trim() : ""))
        .filter(Boolean);

      const cleanedPlacement = (overview.placementStatistics || [])
        .filter((item) => item && (item.label?.trim() || item.value?.trim()))
        .map((item) => ({
          label: item.label?.trim() || "",
          value: item.value?.trim() || "",
        }));

      const cleanedGallery = Array.isArray(overview.departmentGallery)
        ? overview.departmentGallery
            .map((image, index) => {
              if (typeof image === "string") {
                return {
                  imageUrl: image,
                  publicId: "",
                  title: "",
                  priority: index + 1,
                };
              }
              return {
                imageUrl: image?.imageUrl || image?.url || "",
                publicId: image?.publicId || "",
                title: image?.title || "",
                priority: Number(image?.priority) || index + 1,
              };
            })
            .filter((image) => image.imageUrl)
        : [];

      const payload = {
        ...overview,
        departmentId: department._id,
        bannerTitle: overview.bannerTitle?.trim() || "",
        overviewImage: overview.overviewImage?.trim() || "",
        overviewImagePublicId: overview.overviewImagePublicId?.trim() || "",
        aboutDepartment: overview.aboutDepartment?.trim() || "",
        vision: overview.vision?.trim() || "",
        mission: cleanedMission,
        headOfDepartment: overview.headOfDepartment || null,
        departmentHighlights: cleanedHighlights,
        whyChooseDepartment: cleanedWhyChoose,
        placementStatistics: cleanedPlacement,
        departmentGallery: cleanedGallery,
        joinDepartmentTitle: overview.joinDepartmentTitle?.trim() || "",
        joinDepartmentDescription:
          overview.joinDepartmentDescription?.trim() || "",
        joinDepartmentUrl: overview.joinDepartmentUrl?.trim() || "",
        status: overview.status || "Active",
      };

      const existingOverview = await fetch(
        `${API_URL}/department-overview/${department._id}`,
        {
          headers: getAuthHeaders(),
        },
      );

      const existingResult = await existingOverview.json();
      const overviewExists =
        existingResult?.exists === true || Boolean(existingResult?.data);

      const method = overviewExists ? "PUT" : "POST";
      const url = overviewExists
        ? `${API_URL}/department-overview/${department._id}`
        : `${API_URL}/department-overview`;

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save overview");
      }

      if (result.data) {
        const data = result.data;
        setOverview({
          ...emptyOverview,
          ...data,
          overviewImage: data.overviewImage || "",
          overviewImagePublicId: data.overviewImagePublicId || "",
          mission: Array.isArray(data.mission) ? data.mission : [],
          departmentHighlights: Array.isArray(data.departmentHighlights)
            ? data.departmentHighlights
            : [],
          whyChooseDepartment: Array.isArray(data.whyChooseDepartment)
            ? data.whyChooseDepartment
            : [],
          placementStatistics: Array.isArray(data.placementStatistics)
            ? data.placementStatistics
            : [],
          departmentGallery: Array.isArray(data.departmentGallery)
            ? data.departmentGallery
            : [],
          headOfDepartment:
            data.headOfDepartment?._id || data.headOfDepartment || "",
          status: data.status || "Active",
        });
      }

      setMessage(result.message || "Overview saved successfully");
    } catch (err) {
      console.error("Save Department Overview Error:", err);
      setError(err.message || "Failed to save overview");
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     LOADING STATE
  ========================================================= */
  if (loading) {
    return (
      <div className="department-overview-page">
        <div className="department-overview-loading">
          <FaBookOpen />
          <h3>Loading Department Overview...</h3>
          <p>Please wait.</p>
        </div>
      </div>
    );
  }

  /* =========================================================
     ACCESS DENIED STATE
  ========================================================= */
  if (isSubAdmin && !canManageOverview) {
    return (
      <div className="department-overview-page">
        <div
          className="department-overview-error"
          style={{ textAlign: "center", padding: "50px 25px" }}
        >
          <FaBookOpen style={{ fontSize: "42px", marginBottom: "15px" }} />
          <h3>Access Denied</h3>
          <p>
            You do not have permission to manage the Department Overview for
            this department.
          </p>
          <p style={{ fontSize: "13px", opacity: 0.75, marginTop: "8px" }}>
            Please contact the administrator if you need access.
          </p>
          <button
            type="button"
            onClick={() =>
              navigate(`/imsec-control-center/departments/${slug}`)
            }
            style={{ marginTop: "20px" }}
          >
            <FaArrowLeft /> Back to Department
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR STATE
  ========================================================= */
  if (error && !department) {
    return (
      <div className="department-overview-page">
        <div className="department-overview-error">
          <FaBookOpen />
          <h3>Unable to Load Department</h3>
          <p>{error}</p>
          <button
            type="button"
            onClick={() => navigate("/imsec-control-center/departments")}
          >
            <FaArrowLeft /> Back to Departments
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================
     RENDER MAIN FORM
  ========================================================= */
  return (
    <div className="department-overview-page">
      <div className="department-overview-header">
        <button
          type="button"
          className="department-overview-back"
          onClick={() => navigate(`/imsec-control-center/departments/${slug}`)}
        >
          <FaArrowLeft /> Back to Department
        </button>
        <div className="department-overview-title">
          <div className="department-overview-icon">
            <FaBookOpen />
          </div>
          <div>
            <span>DEPARTMENT MANAGEMENT</span>
            <h1>{department?.name || "Department"} — Overview</h1>
            <p>Manage complete overview content of this department.</p>
          </div>
        </div>
      </div>

      {isSubAdmin && (
        <div
          style={{
            marginBottom: "20px",
            padding: "12px 16px",
            borderRadius: "8px",
            background: "#f5f5f5",
            fontSize: "13px",
          }}
        >
          Department Overview management permission is enabled for your account.
        </div>
      )}

      <form className="department-overview-form" onSubmit={handleSubmit}>
        {/* BANNER */}
        <div className="department-overview-card">
          <div className="department-overview-card-header">
            <span>BANNER</span>
            <h2>Department Banner</h2>
          </div>
          <div className="form-group">
            <label>Banner Title</label>
            <input
              type="text"
              name="bannerTitle"
              value={overview.bannerTitle}
              disabled={!canManageOverview}
              onChange={handleChange}
              placeholder="Enter banner title"
            />
          </div>
        </div>

        {/* OVERVIEW IMAGE */}
        <div className="department-overview-card">
          <div className="department-overview-card-header">
            <span>OVERVIEW IMAGE</span>
            <h2>Main Department Image</h2>
          </div>
          <div className="form-group">
            <p className="form-help-text">
              Upload one main image for the public department overview page.
            </p>
            <div className="gallery-upload-box">
              <input
                id="department-overview-image-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleOverviewImageUpload}
                disabled={overviewImageUploading || !canManageOverview}
                style={{ display: "none" }}
              />
              <label
                htmlFor="department-overview-image-upload"
                className="gallery-upload-btn"
              >
                {overviewImageUploading ? (
                  <>
                    <FaSpinner className="gallery-spinner" /> Uploading...
                  </>
                ) : (
                  <>
                    <FaUpload />{" "}
                    {overview.overviewImage
                      ? "Change Overview Image"
                      : "Upload Overview Image"}
                  </>
                )}
              </label>
              <p className="gallery-upload-help">
                JPG, PNG or WEBP • Maximum 5 MB
              </p>
            </div>

            {overview.overviewImage ? (
              <div className="overview-image-admin-preview">
                <img src={overview.overviewImage} alt="Department overview" />
                <div className="overview-image-admin-actions">
                  <div>
                    <strong>Main Overview Image</strong>
                    <small>Stored on Cloudinary</small>
                  </div>
                  <button
                    type="button"
                    className="overview-image-delete-btn"
                    onClick={handleOverviewImageDelete}
                    disabled={!canManageOverview}
                  >
                    <FaTrash /> Remove Image
                  </button>
                </div>
              </div>
            ) : (
              <div className="gallery-empty">
                <FaBookOpen />
                <strong>No Overview Image</strong>
                <p>
                  Upload the main image that will appear on the public overview
                  page.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ABOUT */}
        <div className="department-overview-card">
          <div className="department-overview-card-header">
            <span>ABOUT</span>
            <h2>About Department</h2>
          </div>
          <div className="form-group">
            <label>About Department</label>
            <textarea
              name="aboutDepartment"
              value={overview.aboutDepartment}
              onChange={handleChange}
              disabled={!canManageOverview}
              rows="7"
              placeholder="Enter department introduction"
            />
          </div>
        </div>

        {/* VISION */}
        <div className="department-overview-card">
          <div className="department-overview-card-header">
            <span>VISION</span>
            <h2>Department Vision</h2>
          </div>
          <div className="form-group">
            <label>Vision</label>
            <textarea
              name="vision"
              value={overview.vision}
              onChange={handleChange}
              disabled={!canManageOverview}
              rows="5"
              placeholder="Enter department vision"
            />
          </div>
        </div>

        {/* MISSION */}
        <div className="department-overview-card">
          <div className="department-overview-card-header">
            <span>MISSION</span>
            <h2>Department Mission</h2>
          </div>
          <div className="form-group">
            <label>Mission</label>
            <p className="form-help-text">
              Enter each mission point separately.
            </p>
            {overview.mission.map((item, index) => (
              <div className="dynamic-row" key={index}>
                <span className="dynamic-number">{index + 1}</span>
                <input
                  type="text"
                  value={item}
                  disabled={!canManageOverview}
                  onChange={(e) =>
                    handleArrayChange("mission", index, e.target.value)
                  }
                  placeholder={`Mission point ${index + 1}`}
                />
                <button
                  type="button"
                  className="dynamic-remove-btn"
                  disabled={!canManageOverview}
                  onClick={() => removeArrayItem("mission", index)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="dynamic-add-btn"
              disabled={!canManageOverview}
              onClick={() => addArrayItem("mission")}
            >
              <FaPlus /> Add Mission Point
            </button>
          </div>
        </div>

        {/* HEAD OF DEPARTMENT */}
        <div className="department-overview-card">
          <div className="department-overview-card-header">
            <span>LEADERSHIP</span>
            <h2>Head of Department</h2>
          </div>
          <div className="form-group">
            <label>Select Head of Department</label>
            <select
              name="headOfDepartment"
              value={overview.headOfDepartment}
              disabled={!canManageOverview}
              onChange={handleChange}
            >
              <option value="">Select Head of Department</option>
              {faculty
                .filter(
                  (member) =>
                    member.status === "Active" && member.isHOD === true,
                )
                .map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name} — {member.designation}
                  </option>
                ))}
            </select>
            <p className="form-help-text">
              Only active faculty members marked as HOD are displayed.
            </p>
          </div>

          {faculty.filter(
            (member) => member.status === "Active" && member.isHOD === true,
          ).length === 0 && (
            <div className="overview-warning">
              <FaUserTie />
              <div>
                <strong>No Active HOD Found</strong>
                <p>
                  Please mark a faculty member as HOD in Faculty Management.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* DEPARTMENT HIGHLIGHTS */}
        <div className="department-overview-card">
          <div className="department-overview-card-header">
            <span>HIGHLIGHTS</span>
            <h2>Department Highlights</h2>
          </div>
          <div className="form-group">
            <p className="form-help-text">
              Add important features, strengths or achievements.
            </p>
            {overview.departmentHighlights.map((item, index) => (
              <div className="dynamic-row" key={index}>
                <span className="dynamic-number">{index + 1}</span>
                <input
                  type="text"
                  value={item}
                  disabled={!canManageOverview}
                  onChange={(e) =>
                    handleArrayChange(
                      "departmentHighlights",
                      index,
                      e.target.value,
                    )
                  }
                  placeholder="Department highlight"
                />
                <button
                  type="button"
                  className="dynamic-remove-btn"
                  disabled={!canManageOverview}
                  onClick={() => removeArrayItem("departmentHighlights", index)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="dynamic-add-btn"
              disabled={!canManageOverview}
              onClick={() => addArrayItem("departmentHighlights")}
            >
              <FaPlus /> Add Highlight
            </button>
          </div>
        </div>

        {/* WHY CHOOSE */}
        <div className="department-overview-card">
          <div className="department-overview-card-header">
            <span>KEY BENEFITS</span>
            <h2>Why Choose This Department</h2>
          </div>
          <div className="form-group">
            <p className="form-help-text">
              Add reasons why students should choose this department.
            </p>
            {overview.whyChooseDepartment.map((item, index) => (
              <div className="dynamic-row" key={index}>
                <span className="dynamic-number">{index + 1}</span>
                <input
                  type="text"
                  value={item}
                  disabled={!canManageOverview}
                  onChange={(e) =>
                    handleArrayChange(
                      "whyChooseDepartment",
                      index,
                      e.target.value,
                    )
                  }
                  placeholder="Reason / benefit"
                />
                <button
                  type="button"
                  className="dynamic-remove-btn"
                  disabled={!canManageOverview}
                  onClick={() => removeArrayItem("whyChooseDepartment", index)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="dynamic-add-btn"
              disabled={!canManageOverview}
              onClick={() => addArrayItem("whyChooseDepartment")}
            >
              <FaPlus /> Add Reason
            </button>
          </div>
        </div>

        {/* PLACEMENT STATISTICS */}
        <div className="department-overview-card">
          <div className="department-overview-card-header">
            <span>PLACEMENT</span>
            <h2>Placement Statistics</h2>
          </div>
          <div className="form-group">
            <p className="form-help-text">Example: Highest Package — ₹12 LPA</p>
            <div className="placement-statistics">
              {overview.placementStatistics.map((item, index) => (
                <div className="placement-row" key={index}>
                  <input
                    type="text"
                    value={item.label || ""}
                    disabled={!canManageOverview}
                    onChange={(e) =>
                      handlePlacementChange(index, "label", e.target.value)
                    }
                    placeholder="Label"
                  />
                  <input
                    type="text"
                    value={item.value || ""}
                    disabled={!canManageOverview}
                    onChange={(e) =>
                      handlePlacementChange(index, "value", e.target.value)
                    }
                    placeholder="Value"
                  />
                  <button
                    type="button"
                    className="dynamic-remove-btn"
                    disabled={!canManageOverview}
                    onClick={() => removePlacementStatistic(index)}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="dynamic-add-btn"
              disabled={!canManageOverview}
              onClick={addPlacementStatistic}
            >
              <FaPlus /> Add Placement Statistic
            </button>
          </div>
        </div>

        {/* DEPARTMENT GALLERY */}
        <div className="department-overview-card">
          <div className="department-overview-card-header">
            <span>GALLERY</span>
            <h2>Department Gallery</h2>
          </div>
          <div className="form-group">
            <p className="form-help-text">
              Upload department photographs. Images are stored in Cloudinary.
            </p>
            <div className="gallery-upload-box">
              <input
                id="department-gallery-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleGalleryUpload}
                disabled={galleryUploading || !canManageOverview}
                style={{ display: "none" }}
              />
              <label
                htmlFor="department-gallery-upload"
                className="gallery-upload-btn"
              >
                {galleryUploading ? (
                  <>
                    <FaSpinner className="gallery-spinner" /> Uploading...
                  </>
                ) : (
                  <>
                    <FaUpload /> Upload Gallery Photos
                  </>
                )}
              </label>
              <p className="gallery-upload-help">
                JPG, PNG or WEBP • Maximum 5 MB per image
              </p>
            </div>

            {overview.departmentGallery?.length > 0 ? (
              <div className="gallery-preview-list">
                {overview.departmentGallery.map((image, index) => {
                  const imageUrl =
                    typeof image === "string"
                      ? image
                      : image?.imageUrl || image?.url || "";

                  return (
                    <div
                      className="gallery-preview-item"
                      key={image?.publicId || `${imageUrl}-${index}`}
                    >
                      <img
                        src={imageUrl}
                        alt={`Department gallery ${index + 1}`}
                      />
                      <div className="gallery-preview-overlay">
                        <span>Photo {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleGalleryDelete(image, index)}
                          disabled={
                            !canManageOverview || deletingGalleryIndex === index
                          }
                          title={
                            deletingGalleryIndex === index
                              ? "Deleting image..."
                              : "Delete image"
                          }
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="gallery-empty">
                <FaBookOpen />
                <strong>No Gallery Photos</strong>
                <p>Upload photos to create the department gallery.</p>
              </div>
            )}
          </div>
        </div>

        {/* JOIN DEPARTMENT */}
        <div className="department-overview-card">
          <div className="department-overview-card-header">
            <span>JOIN</span>
            <h2>Join Department</h2>
          </div>
          <div className="form-group">
            <label>Join Department Title</label>
            <input
              type="text"
              name="joinDepartmentTitle"
              value={overview.joinDepartmentTitle}
              disabled={!canManageOverview}
              onChange={handleChange}
              placeholder="Enter title"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="joinDepartmentDescription"
              value={overview.joinDepartmentDescription}
              disabled={!canManageOverview}
              onChange={handleChange}
              rows="4"
              placeholder="Enter description"
            />
          </div>
          <div className="form-group">
            <label>URL</label>
            <input
              type="text"
              name="joinDepartmentUrl"
              value={overview.joinDepartmentUrl}
              disabled={!canManageOverview}
              onChange={handleChange}
              placeholder="Enter URL"
            />
          </div>
        </div>

        {/* STATUS */}
        <div className="department-overview-card">
          <div className="department-overview-card-header">
            <span>STATUS</span>
            <h2>Publication Status</h2>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={overview.status}
              disabled={!canManageOverview}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* MESSAGES */}
        {message && (
          <div className="department-overview-success">{message}</div>
        )}
        {error && <div className="department-overview-error">{error}</div>}

        {/* ACTIONS */}
        <div className="department-overview-actions">
          <button
            type="button"
            className="overview-cancel-btn"
            onClick={() =>
              navigate(`/imsec-control-center/departments/${slug}`)
            }
          >
            Cancel
          </button>
          <button
            type="submit"
            className="overview-save-btn"
            disabled={saving || !canManageOverview}
          >
            <FaSave /> {saving ? "Saving..." : "Save Overview"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DepartmentOverview;
