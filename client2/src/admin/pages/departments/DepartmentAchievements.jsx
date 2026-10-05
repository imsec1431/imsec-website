import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import {
  FaArrowLeft,
  FaSave,
  FaPlus,
  FaTrash,
  FaTrophy,
  FaMedal,
  FaBriefcase,
  FaBuilding,
  FaUserTie,
  FaEdit,
  FaTimes,
} from "react-icons/fa";

import "./department-achievements.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

/* =========================================================
   AUTH HELPERS
   All protected department-management APIs require JWT.
========================================================= */

const getAuthHeaders = (includeContentType = false) => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("adminToken") ||
    sessionStorage.getItem("token") ||
    sessionStorage.getItem("adminToken") ||
    null;

  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  if (includeContentType) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

const parseApiResponse = async (response) => {
  let result = {};

  try {
    result = await response.json();
  } catch {
    result = {};
  }

  if (!response.ok) {
    throw new Error(
      result?.message ||
        result?.error ||
        `Request failed with status ${response.status}`,
    );
  }

  return result;
};

const getDepartmentAchievementItems = async (departmentId) => {
  const response = await fetch(
    `${API_URL}/api/department-achievement-items/department/${departmentId}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );

  return parseApiResponse(response);
};

const createDepartmentAchievementItem = async (payload) => {
  const response = await fetch(`${API_URL}/api/department-achievement-items`, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify(payload),
  });

  return parseApiResponse(response);
};

const updateDepartmentAchievementItem = async (id, payload) => {
  const response = await fetch(
    `${API_URL}/department-achievement-items/${id}`,
    {
      method: "PUT",
      headers: getAuthHeaders(true),
      body: JSON.stringify(payload),
    },
  );

  return parseApiResponse(response);
};

const deleteDepartmentAchievementItem = async (id) => {
  const response = await fetch(
    `${API_URL}/department-achievement-items/${id}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );

  return parseApiResponse(response);
};

const getFacultyAchievementItems = async (departmentId) => {
  const response = await fetch(
    `${API_URL}/api/faculty-achievement-items/department/${departmentId}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );

  return parseApiResponse(response);
};

const createFacultyAchievementItem = async (payload) => {
  const response = await fetch(`${API_URL}/api/faculty-achievement-items`, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify(payload),
  });

  return parseApiResponse(response);
};

const updateFacultyAchievementItem = async (id, payload) => {
  const response = await fetch(
    `${API_URL}/api/faculty-achievement-items/${id}`,
    {
      method: "PUT",
      headers: getAuthHeaders(true),
      body: JSON.stringify(payload),
    },
  );

  return parseApiResponse(response);
};

const deleteFacultyAchievementItem = async (id) => {
  const response = await fetch(
    `${API_URL}/api/faculty-achievement-items/${id}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );

  return parseApiResponse(response);
};

/* =========================================================
   EMPTY DATA
========================================================= */

const emptyAchievements = {
  collegeBranchToppers: [],
  globalAchievements: [],
  internships: [],
};

const emptyDepartmentAchievement = {
  title: "",
  description: "",
  order: 1,
  isActive: true,
};

const emptyFacultyAchievement = {
  facultyId: "",
  title: "",
  description: "",
  order: 1,
  isActive: true,
};

/* =========================================================
   DEPARTMENT ACHIEVEMENTS
========================================================= */

const DepartmentAchievements = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  /* =======================================================
     STATE
  ======================================================= */

  const [department, setDepartment] = useState(null);
  const [achievements, setAchievements] = useState(emptyAchievements);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  /* =======================================================
     NEW DEPARTMENT ACHIEVEMENTS
  ======================================================= */

  const [departmentAchievementItems, setDepartmentAchievementItems] = useState(
    [],
  );
  const [departmentAchievementForm, setDepartmentAchievementForm] = useState(
    emptyDepartmentAchievement,
  );
  const [editingDepartmentAchievement, setEditingDepartmentAchievement] =
    useState(null);
  const [departmentAchievementSaving, setDepartmentAchievementSaving] =
    useState(false);
  const [departmentAchievementDeleting, setDepartmentAchievementDeleting] =
    useState(false);

  /* =======================================================
     NEW FACULTY ACHIEVEMENTS
  ======================================================= */

  const [facultyAchievementItems, setFacultyAchievementItems] = useState([]);
  const [facultyMembers, setFacultyMembers] = useState([]);
  const [facultyAchievementForm, setFacultyAchievementForm] = useState(
    emptyFacultyAchievement,
  );
  const [editingFacultyAchievement, setEditingFacultyAchievement] =
    useState(null);
  const [facultyAchievementSaving, setFacultyAchievementSaving] =
    useState(false);
  const [facultyAchievementDeleting, setFacultyAchievementDeleting] =
    useState(false);

  /* =======================================================
     MODAL STATES
  ======================================================= */

  const [departmentAchievementModal, setDepartmentAchievementModal] =
    useState(false);
  const [facultyAchievementModal, setFacultyAchievementModal] = useState(false);

  const openDepartmentAchievementModal = (item = null) => {
    if (item) {
      setEditingDepartmentAchievement(item);
      setDepartmentAchievementForm({
        title: item.title || "",
        description: item.description || "",
        order: item.order || 1,
        isActive: item.isActive === undefined ? true : item.isActive,
      });
    } else {
      setEditingDepartmentAchievement(null);
      setDepartmentAchievementForm(emptyDepartmentAchievement);
    }
    setDepartmentAchievementModal(true);
  };

  const closeDepartmentAchievementModal = () => {
    setDepartmentAchievementModal(false);
    setEditingDepartmentAchievement(null);
    setDepartmentAchievementForm(emptyDepartmentAchievement);
  };

  const openFacultyAchievementModal = (item = null) => {
    if (item) {
      setEditingFacultyAchievement(item);
      setFacultyAchievementForm({
        facultyId:
          typeof item.facultyId === "object"
            ? item.facultyId?._id || ""
            : item.facultyId || "",
        title: item.title || "",
        description: item.description || "",
        order: item.order || 1,
        isActive: item.isActive === undefined ? true : item.isActive,
      });
    } else {
      setEditingFacultyAchievement(null);
      setFacultyAchievementForm(emptyFacultyAchievement);
    }
    setFacultyAchievementModal(true);
  };

  const closeFacultyAchievementModal = () => {
    setFacultyAchievementModal(false);
    setEditingFacultyAchievement(null);
    setFacultyAchievementForm(emptyFacultyAchievement);
  };

  /* =======================================================
     LOAD DATA
  ======================================================= */

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const departmentResponse = await fetch(
        `${API_URL}/api/departments/slug/${slug}`,
        {
          method: "GET",
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

      const achievementsResponse = await fetch(
        `${API_URL}/api/department-achievements/${departmentData._id}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );

      const achievementsResult = await achievementsResponse.json();

      if (
        achievementsResponse.status === 404 ||
        achievementsResult?.exists === false
      ) {
        setAchievements({ ...emptyAchievements });
      } else {
        if (!achievementsResponse.ok) {
          throw new Error(
            achievementsResult.message || "Failed to fetch achievements",
          );
        }

        const data = achievementsResult.data;

        if (data) {
          setAchievements({
            collegeBranchToppers: Array.isArray(data.collegeBranchToppers)
              ? data.collegeBranchToppers
              : [],
            globalAchievements: Array.isArray(data.globalAchievements)
              ? data.globalAchievements
              : [],
            internships: Array.isArray(data.internships)
              ? data.internships
              : [],
          });
        } else {
          setAchievements({ ...emptyAchievements });
        }
      }

      try {
        const response = await getDepartmentAchievementItems(
          departmentData._id,
        );

        setDepartmentAchievementItems(
          Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response)
              ? response
              : [],
        );
      } catch (itemError) {
        console.error("Load Department Achievement Items Error:", itemError);
        setDepartmentAchievementItems([]);
      }

      try {
        const facultyResponse = await fetch(
          `${API_URL}/api/department-faculty/department/${departmentData._id}`,
          {
            method: "GET",
            headers: getAuthHeaders(),
          },
        );

        const facultyResult = await facultyResponse.json();

        setFacultyMembers(
          Array.isArray(facultyResult?.data)
            ? facultyResult.data
            : Array.isArray(facultyResult)
              ? facultyResult
              : [],
        );
      } catch (facultyError) {
        console.error("Load Faculty Members Error:", facultyError);
        setFacultyMembers([]);
      }

      try {
        const response = await getFacultyAchievementItems(departmentData._id);

        setFacultyAchievementItems(
          Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response)
              ? response
              : [],
        );
      } catch (itemError) {
        console.error("Load Faculty Achievement Items Error:", itemError);
        setFacultyAchievementItems([]);
      }
    } catch (err) {
      console.error("Load Department Achievements Error:", err);
      setError(err.message || "Failed to load achievements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      loadData();
    }
  }, [slug]);

  /* =======================================================
     TOPPER
  ======================================================= */

  const addTopper = () => {
    setAchievements((prev) => ({
      ...prev,
      collegeBranchToppers: [
        ...prev.collegeBranchToppers,
        {
          studentName: "",
          rollNo: "",
          sgpa: "",
          studentBatch: "",
          semester: "",
        },
      ],
    }));
  };

  const updateTopper = (index, field, value) => {
    setAchievements((prev) => ({
      ...prev,
      collegeBranchToppers: prev.collegeBranchToppers.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    }));
  };

  const removeTopper = (index) => {
    setAchievements((prev) => ({
      ...prev,
      collegeBranchToppers: prev.collegeBranchToppers.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  };

  /* =======================================================
     GLOBAL ACHIEVEMENT
  ======================================================= */

  const addGlobalAchievement = () => {
    setAchievements((prev) => ({
      ...prev,
      globalAchievements: [
        ...prev.globalAchievements,
        {
          studentName: "",
          programName: "",
          cashPrize: "",
          studentBatch: "",
          position: "",
        },
      ],
    }));
  };

  const updateGlobalAchievement = (index, field, value) => {
    setAchievements((prev) => ({
      ...prev,
      globalAchievements: prev.globalAchievements.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    }));
  };

  const removeGlobalAchievement = (index) => {
    setAchievements((prev) => ({
      ...prev,
      globalAchievements: prev.globalAchievements.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  };

  /* =======================================================
     INTERNSHIP
  ======================================================= */

  const addInternship = () => {
    setAchievements((prev) => ({
      ...prev,
      internships: [
        ...prev.internships,
        {
          studentName: "",
          companyName: "",
          stipend: "",
          studentBatch: "",
        },
      ],
    }));
  };

  const updateInternship = (index, field, value) => {
    setAchievements((prev) => ({
      ...prev,
      internships: prev.internships.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    }));
  };

  const removeInternship = (index) => {
    setAchievements((prev) => ({
      ...prev,
      internships: prev.internships.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  };

  /* =======================================================
     DEPARTMENT ACHIEVEMENT ITEMS
  ======================================================= */

  const handleDepartmentAchievementChange = (field, value) => {
    setDepartmentAchievementForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDepartmentAchievementSubmit = async (e) => {
    e.preventDefault();

    try {
      setDepartmentAchievementSaving(true);
      setError("");
      setMessage("");

      if (!departmentAchievementForm.title.trim()) {
        throw new Error("Title is required");
      }

      if (!departmentAchievementForm.description.trim()) {
        throw new Error("Description is required");
      }

      const payload = {
        departmentId: department._id,
        title: departmentAchievementForm.title.trim(),
        description: departmentAchievementForm.description.trim(),
        order: Number(departmentAchievementForm.order) || 1,
        isActive: departmentAchievementForm.isActive,
      };

      let response;

      if (editingDepartmentAchievement) {
        response = await updateDepartmentAchievementItem(
          editingDepartmentAchievement._id,
          payload,
        );
      } else {
        response = await createDepartmentAchievementItem(payload);
      }

      const savedItem = response?.data || response;

      if (editingDepartmentAchievement) {
        setDepartmentAchievementItems((prev) =>
          prev.map((item) =>
            item._id === editingDepartmentAchievement._id ? savedItem : item,
          ),
        );
        setMessage("Department achievement updated successfully.");
      } else {
        setDepartmentAchievementItems((prev) => [...prev, savedItem]);
        setMessage("Department achievement added successfully.");
      }

      closeDepartmentAchievementModal();
    } catch (err) {
      console.error("Save Department Achievement Item Error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save department achievement",
      );
    } finally {
      setDepartmentAchievementSaving(false);
    }
  };

  const removeDepartmentAchievement = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this department achievement?",
      )
    ) {
      return;
    }

    try {
      setDepartmentAchievementDeleting(true);
      setError("");
      setMessage("");

      await deleteDepartmentAchievementItem(id);

      setDepartmentAchievementItems((prev) =>
        prev.filter((item) => item._id !== id),
      );

      setMessage("Department achievement deleted successfully.");
    } catch (err) {
      console.error("Delete Department Achievement Item Error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete department achievement",
      );
    } finally {
      setDepartmentAchievementDeleting(false);
    }
  };

  /* =======================================================
     FACULTY ACHIEVEMENT ITEMS
  ======================================================= */

  const handleFacultyAchievementChange = (field, value) => {
    setFacultyAchievementForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFacultyAchievementSubmit = async (e) => {
    e.preventDefault();

    try {
      setFacultyAchievementSaving(true);
      setError("");
      setMessage("");

      if (!facultyAchievementForm.facultyId) {
        throw new Error("Faculty member is required");
      }

      if (!facultyAchievementForm.title.trim()) {
        throw new Error("Title is required");
      }

      if (!facultyAchievementForm.description.trim()) {
        throw new Error("Description is required");
      }

      const payload = {
        departmentId: department._id,
        facultyId: facultyAchievementForm.facultyId,
        title: facultyAchievementForm.title.trim(),
        description: facultyAchievementForm.description.trim(),
        order: Number(facultyAchievementForm.order) || 1,
        isActive: facultyAchievementForm.isActive,
      };

      let response;

      if (editingFacultyAchievement) {
        response = await updateFacultyAchievementItem(
          editingFacultyAchievement._id,
          payload,
        );
      } else {
        response = await createFacultyAchievementItem(payload);
      }

      const savedItem = response?.data || response;

      if (editingFacultyAchievement) {
        setFacultyAchievementItems((prev) =>
          prev.map((item) =>
            item._id === editingFacultyAchievement._id ? savedItem : item,
          ),
        );
        setMessage("Faculty achievement updated successfully.");
      } else {
        setFacultyAchievementItems((prev) => [...prev, savedItem]);
        setMessage("Faculty achievement added successfully.");
      }

      closeFacultyAchievementModal();
    } catch (err) {
      console.error("Save Faculty Achievement Item Error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save faculty achievement",
      );
    } finally {
      setFacultyAchievementSaving(false);
    }
  };

  const removeFacultyAchievement = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this faculty achievement?",
      )
    ) {
      return;
    }

    try {
      setFacultyAchievementDeleting(true);
      setError("");
      setMessage("");

      await deleteFacultyAchievementItem(id);

      setFacultyAchievementItems((prev) =>
        prev.filter((item) => item._id !== id),
      );

      setMessage("Faculty achievement deleted successfully.");
    } catch (err) {
      console.error("Delete Faculty Achievement Item Error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete faculty achievement",
      );
    } finally {
      setFacultyAchievementDeleting(false);
    }
  };

  /* =======================================================
     SAVE EXISTING 3 MODULES
  ======================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const existingResponse = await fetch(
        `${API_URL}/api/department-achievements/${department._id}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );

      const existingResult = await existingResponse.json();
      const exists =
        existingResult?.exists === true || Boolean(existingResult?.data);

      const method = exists ? "PUT" : "POST";
      const url = exists
        ? `${API_URL}/api/department-achievements/${department._id}`
        : `${API_URL}/api/department-achievements`;

      const payload = {
        departmentId: department._id,
        collegeBranchToppers: achievements.collegeBranchToppers,
        globalAchievements: achievements.globalAchievements,
        internships: achievements.internships,
      };

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save achievements");
      }

      setAchievements({
        collegeBranchToppers: Array.isArray(result.data?.collegeBranchToppers)
          ? result.data.collegeBranchToppers
          : [],
        globalAchievements: Array.isArray(result.data?.globalAchievements)
          ? result.data.globalAchievements
          : [],
        internships: Array.isArray(result.data?.internships)
          ? result.data.internships
          : [],
      });

      setMessage("Student achievements saved successfully.");
    } catch (err) {
      console.error("Save Department Achievements Error:", err);
      setError(err.message || "Failed to save achievements");
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     LOADING / ERROR STATES
  ======================================================= */

  if (loading) {
    return (
      <div className="department-achievements-page">
        <div className="department-achievements-loading">
          Loading Department Achievements...
        </div>
      </div>
    );
  }

  if (error && !department) {
    return (
      <div className="department-achievements-page">
        <div className="department-achievements-error">
          <h3>Unable to Load Achievements</h3>
          <p>{error}</p>
          <button
            type="button"
            onClick={() => navigate("/imsec-control-center/departments")}
          >
            <FaArrowLeft />
            Back to Departments
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="department-achievements-page">
      <div className="department-achievements-header">
        <button
          type="button"
          className="department-achievements-back"
          onClick={() => navigate(`/imsec-control-center/departments/${slug}`)}
        >
          <FaArrowLeft />
          Back to Department
        </button>

        <div className="department-achievements-title">
          <div className="department-achievements-icon">
            <FaTrophy />
          </div>

          <div>
            <span>DEPARTMENT MANAGEMENT</span>
            <h1>{department?.name} — Achievements</h1>
            <p>
              Celebrating academic excellence, global achievements, internship
              success, department achievements and faculty achievements.
            </p>
          </div>
        </div>
      </div>

      {message && (
        <div className="department-achievements-success">{message}</div>
      )}

      {error && <div className="department-achievements-error">{error}</div>}

      <div className="department-achievements-tabs">
        <button
          type="button"
          className={activeTab === "all" ? "active" : ""}
          onClick={() => setActiveTab("all")}
        >
          All
        </button>
        <button
          type="button"
          className={activeTab === "toppers" ? "active" : ""}
          onClick={() => setActiveTab("toppers")}
        >
          University Toppers
        </button>
        <button
          type="button"
          className={activeTab === "global" ? "active" : ""}
          onClick={() => setActiveTab("global")}
        >
          Global Achievements
        </button>
        <button
          type="button"
          className={activeTab === "internships" ? "active" : ""}
          onClick={() => setActiveTab("internships")}
        >
          Internships
        </button>
        <button
          type="button"
          className={activeTab === "department" ? "active" : ""}
          onClick={() => setActiveTab("department")}
        >
          Department Achievements
        </button>
        <button
          type="button"
          className={activeTab === "faculty" ? "active" : ""}
          onClick={() => setActiveTab("faculty")}
        >
          Faculty Achievements
        </button>
      </div>

      <div className="department-achievements-form">
        {/* TOPPERS */}
        {(activeTab === "all" || activeTab === "toppers") && (
          <section className="department-achievement-card">
            <div className="department-achievement-card-header">
              <div>
                <span>UNIVERSITY TOPPERS</span>
                <h2>College Branch Toppers</h2>
              </div>
              <button
                type="button"
                className="achievement-add-btn"
                onClick={addTopper}
              >
                <FaPlus />
                Add Topper
              </button>
            </div>

            {achievements.collegeBranchToppers.length === 0 ? (
              <div className="achievement-empty">
                <FaTrophy />
                <h3>No Toppers Added</h3>
                <p>Add students who achieved top academic performance.</p>
              </div>
            ) : (
              <div className="achievement-table-wrapper">
                <table className="achievement-table">
                  <thead>
                    <tr>
                      <th>S.No.</th>
                      <th>Student Name</th>
                      <th>Roll No.</th>
                      <th>SGPA</th>
                      <th>Student Batch</th>
                      <th>Semester</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {achievements.collegeBranchToppers.map((topper, index) => (
                      <tr key={topper._id || index}>
                        <td>{index + 1}</td>
                        <td>
                          <input
                            type="text"
                            value={topper.studentName || ""}
                            onChange={(e) =>
                              updateTopper(index, "studentName", e.target.value)
                            }
                            placeholder="Student name"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={topper.rollNo || ""}
                            onChange={(e) =>
                              updateTopper(index, "rollNo", e.target.value)
                            }
                            placeholder="Roll No."
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={topper.sgpa || ""}
                            onChange={(e) =>
                              updateTopper(index, "sgpa", e.target.value)
                            }
                            placeholder="SGPA"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={topper.studentBatch || ""}
                            onChange={(e) =>
                              updateTopper(
                                index,
                                "studentBatch",
                                e.target.value,
                              )
                            }
                            placeholder="2023-25"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={topper.semester || ""}
                            onChange={(e) =>
                              updateTopper(index, "semester", e.target.value)
                            }
                            placeholder="III Semester"
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            className="achievement-delete-btn"
                            onClick={() => removeTopper(index)}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* GLOBAL ACHIEVEMENTS */}
        {(activeTab === "all" || activeTab === "global") && (
          <section className="department-achievement-card">
            <div className="department-achievement-card-header">
              <div>
                <span>GLOBAL ACHIEVEMENTS</span>
                <h2>Student Global Achievements</h2>
              </div>
              <button
                type="button"
                className="achievement-add-btn"
                onClick={addGlobalAchievement}
              >
                <FaPlus />
                Add Achievement
              </button>
            </div>

            {achievements.globalAchievements.length === 0 ? (
              <div className="achievement-empty">
                <FaMedal />
                <h3>No Global Achievements</h3>
                <p>Add student achievements, competitions and awards.</p>
              </div>
            ) : (
              <div className="achievement-table-wrapper">
                <table className="achievement-table">
                  <thead>
                    <tr>
                      <th>S.No.</th>
                      <th>Student Name</th>
                      <th>Program Name</th>
                      <th>Cash / Prize</th>
                      <th>Student Batch</th>
                      <th>Position</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {achievements.globalAchievements.map(
                      (achievement, index) => (
                        <tr key={achievement._id || index}>
                          <td>{index + 1}</td>
                          <td>
                            <input
                              type="text"
                              value={achievement.studentName || ""}
                              onChange={(e) =>
                                updateGlobalAchievement(
                                  index,
                                  "studentName",
                                  e.target.value,
                                )
                              }
                              placeholder="Student name"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={achievement.programName || ""}
                              onChange={(e) =>
                                updateGlobalAchievement(
                                  index,
                                  "programName",
                                  e.target.value,
                                )
                              }
                              placeholder="Program name"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={achievement.cashPrize || ""}
                              onChange={(e) =>
                                updateGlobalAchievement(
                                  index,
                                  "cashPrize",
                                  e.target.value,
                                )
                              }
                              placeholder="₹1,00,000"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={achievement.studentBatch || ""}
                              onChange={(e) =>
                                updateGlobalAchievement(
                                  index,
                                  "studentBatch",
                                  e.target.value,
                                )
                              }
                              placeholder="2023-25"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={achievement.position || ""}
                              onChange={(e) =>
                                updateGlobalAchievement(
                                  index,
                                  "position",
                                  e.target.value,
                                )
                              }
                              placeholder="Winner"
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              className="achievement-delete-btn"
                              onClick={() => removeGlobalAchievement(index)}
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* INTERNSHIPS */}
        {(activeTab === "all" || activeTab === "internships") && (
          <section className="department-achievement-card">
            <div className="department-achievement-card-header">
              <div>
                <span>INTERNSHIPS</span>
                <h2>Internship Details</h2>
              </div>
              <button
                type="button"
                className="achievement-add-btn"
                onClick={addInternship}
              >
                <FaPlus />
                Add Internship
              </button>
            </div>

            {achievements.internships.length === 0 ? (
              <div className="achievement-empty">
                <FaBriefcase />
                <h3>No Internship Details</h3>
                <p>Add student internship information.</p>
              </div>
            ) : (
              <div className="achievement-table-wrapper">
                <table className="achievement-table">
                  <thead>
                    <tr>
                      <th>S.No.</th>
                      <th>Student Name</th>
                      <th>Company Name</th>
                      <th>Stipend</th>
                      <th>Student Batch</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {achievements.internships.map((internship, index) => (
                      <tr key={internship._id || index}>
                        <td>{index + 1}</td>
                        <td>
                          <input
                            type="text"
                            value={internship.studentName || ""}
                            onChange={(e) =>
                              updateInternship(
                                index,
                                "studentName",
                                e.target.value,
                              )
                            }
                            placeholder="Student name"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={internship.companyName || ""}
                            onChange={(e) =>
                              updateInternship(
                                index,
                                "companyName",
                                e.target.value,
                              )
                            }
                            placeholder="Company name"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={internship.stipend || ""}
                            onChange={(e) =>
                              updateInternship(index, "stipend", e.target.value)
                            }
                            placeholder="₹60,000 / Month"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={internship.studentBatch || ""}
                            onChange={(e) =>
                              updateInternship(
                                index,
                                "studentBatch",
                                e.target.value,
                              )
                            }
                            placeholder="2023-25"
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            className="achievement-delete-btn"
                            onClick={() => removeInternship(index)}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* DEPARTMENT ACHIEVEMENTS */}
        {(activeTab === "all" || activeTab === "department") && (
          <section className="department-achievement-card">
            <div className="department-achievement-card-header">
              <div>
                <span>DEPARTMENT ACHIEVEMENTS</span>
                <h2>Department Achievements</h2>
                <p>
                  Add important achievements, awards and milestones of this
                  department.
                </p>
              </div>
              <button
                type="button"
                className="achievement-add-btn"
                onClick={() => openDepartmentAchievementModal()}
              >
                <FaPlus />
                Add Department Achievement
              </button>
            </div>

            {/* Modal for Add / Edit Department Achievement */}
            <Modal
              show={departmentAchievementModal}
              onHide={closeDepartmentAchievementModal}
              centered
              size="lg"
              backdrop="static"
            >
              <Modal.Header closeButton>
                <Modal.Title>
                  {editingDepartmentAchievement
                    ? "Edit Department Achievement"
                    : "Add Department Achievement"}
                </Modal.Title>
              </Modal.Header>

              <form onSubmit={handleDepartmentAchievementSubmit}>
                <Modal.Body>
                  <div className="achievement-modal-grid">
                    <div className="achievement-form-field">
                      <label>Title *</label>
                      <input
                        type="text"
                        value={departmentAchievementForm.title}
                        onChange={(e) =>
                          handleDepartmentAchievementChange(
                            "title",
                            e.target.value,
                          )
                        }
                        placeholder="Achievement title"
                        required
                      />
                    </div>

                    <div className="achievement-form-field">
                      <label>Order</label>
                      <input
                        type="number"
                        min="1"
                        value={departmentAchievementForm.order}
                        onChange={(e) =>
                          handleDepartmentAchievementChange(
                            "order",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="achievement-form-field mt-3">
                    <label>Description *</label>
                    <textarea
                      value={departmentAchievementForm.description}
                      onChange={(e) =>
                        handleDepartmentAchievementChange(
                          "description",
                          e.target.value,
                        )
                      }
                      placeholder="Describe the department achievement..."
                      rows="6"
                      required
                    />
                  </div>

                  <label className="achievement-checkbox-field mt-3">
                    <input
                      type="checkbox"
                      checked={departmentAchievementForm.isActive}
                      onChange={(e) =>
                        handleDepartmentAchievementChange(
                          "isActive",
                          e.target.checked,
                        )
                      }
                    />
                    Active
                  </label>
                </Modal.Body>

                <Modal.Footer>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={closeDepartmentAchievementModal}
                  >
                    <FaTimes className="me-1" />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={departmentAchievementSaving}
                  >
                    {departmentAchievementSaving
                      ? "Saving..."
                      : editingDepartmentAchievement
                        ? "Update Achievement"
                        : "Add Achievement"}
                  </Button>
                </Modal.Footer>
              </form>
            </Modal>

            <div className="achievement-table-wrapper">
              {departmentAchievementItems.length === 0 ? (
                <div className="achievement-empty">
                  <FaBuilding />
                  <h3>No Department Achievements</h3>
                  <p>
                    Click “Add Department Achievement” to create the first
                    record.
                  </p>
                </div>
              ) : (
                <table className="table achievement-table mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Order</th>
                      <th>Status</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departmentAchievementItems.map((item, index) => (
                      <tr key={item._id || index}>
                        <td>{index + 1}</td>
                        <td>
                          <strong className="achievement-table-title">
                            {item.title || "Untitled"}
                          </strong>
                        </td>
                        <td>
                          <div className="achievement-table-description">
                            {item.description || "—"}
                          </div>
                        </td>
                        <td>{item.order || 1}</td>
                        <td>
                          <span
                            className={
                              item.isActive
                                ? "achievement-status active"
                                : "achievement-status inactive"
                            }
                          >
                            {item.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <div className="achievement-item-actions justify-content-end">
                            <button
                              type="button"
                              className="achievement-edit-btn"
                              title="Edit"
                              onClick={() =>
                                openDepartmentAchievementModal(item)
                              }
                            >
                              <FaEdit />
                            </button>
                            <button
                              type="button"
                              className="achievement-delete-btn"
                              title="Delete"
                              disabled={departmentAchievementDeleting}
                              onClick={() =>
                                removeDepartmentAchievement(item._id)
                              }
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}

        {/* FACULTY ACHIEVEMENTS */}
        {(activeTab === "all" || activeTab === "faculty") && (
          <section className="department-achievement-card">
            <div className="department-achievement-card-header">
              <div>
                <span>FACULTY ACHIEVEMENTS</span>
                <h2>Faculty Achievements</h2>
                <p>
                  Add achievements associated with a specific faculty member.
                </p>
              </div>
              <button
                type="button"
                className="achievement-add-btn"
                onClick={() => openFacultyAchievementModal()}
                disabled={facultyMembers.length === 0}
              >
                <FaPlus />
                Add Faculty Achievement
              </button>
            </div>

            {facultyMembers.length === 0 && (
              <div className="achievement-empty">
                <FaUserTie />
                <h3>No Faculty Members Found</h3>
                <p>
                  Add faculty members to this department before adding faculty
                  achievements.
                </p>
              </div>
            )}

            {/* Modal for Add / Edit Faculty Achievement */}
            <Modal
              show={facultyAchievementModal}
              onHide={closeFacultyAchievementModal}
              centered
              size="lg"
              backdrop="static"
            >
              <Modal.Header closeButton>
                <Modal.Title>
                  {editingFacultyAchievement
                    ? "Edit Faculty Achievement"
                    : "Add Faculty Achievement"}
                </Modal.Title>
              </Modal.Header>

              <form onSubmit={handleFacultyAchievementSubmit}>
                <Modal.Body>
                  <div className="achievement-modal-grid">
                    <div className="achievement-form-field">
                      <label>Faculty Member *</label>
                      <select
                        value={facultyAchievementForm.facultyId}
                        onChange={(e) =>
                          handleFacultyAchievementChange(
                            "facultyId",
                            e.target.value,
                          )
                        }
                        required
                      >
                        <option value="">Select Faculty Member</option>
                        {facultyMembers.map((faculty) => (
                          <option key={faculty._id} value={faculty._id}>
                            {faculty.name}
                            {faculty.designation
                              ? ` — ${faculty.designation}`
                              : ""}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="achievement-form-field">
                      <label>Title *</label>
                      <input
                        type="text"
                        value={facultyAchievementForm.title}
                        onChange={(e) =>
                          handleFacultyAchievementChange(
                            "title",
                            e.target.value,
                          )
                        }
                        placeholder="Achievement title"
                        required
                      />
                    </div>
                  </div>

                  <div className="achievement-form-field mt-3">
                    <label>Description *</label>
                    <textarea
                      value={facultyAchievementForm.description}
                      onChange={(e) =>
                        handleFacultyAchievementChange(
                          "description",
                          e.target.value,
                        )
                      }
                      placeholder="Describe the faculty achievement..."
                      rows="6"
                      required
                    />
                  </div>

                  <div className="achievement-modal-grid mt-3">
                    <div className="achievement-form-field">
                      <label>Order</label>
                      <input
                        type="number"
                        min="1"
                        value={facultyAchievementForm.order}
                        onChange={(e) =>
                          handleFacultyAchievementChange(
                            "order",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <label className="achievement-checkbox-field">
                      <input
                        type="checkbox"
                        checked={facultyAchievementForm.isActive}
                        onChange={(e) =>
                          handleFacultyAchievementChange(
                            "isActive",
                            e.target.checked,
                          )
                        }
                      />
                      Active
                    </label>
                  </div>
                </Modal.Body>

                <Modal.Footer>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={closeFacultyAchievementModal}
                  >
                    <FaTimes className="me-1" />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={
                      facultyAchievementSaving || facultyMembers.length === 0
                    }
                  >
                    {facultyAchievementSaving
                      ? "Saving..."
                      : editingFacultyAchievement
                        ? "Update Faculty Achievement"
                        : "Add Faculty Achievement"}
                  </Button>
                </Modal.Footer>
              </form>
            </Modal>

            <div className="achievement-table-wrapper">
              {facultyAchievementItems.length === 0 ? (
                <div className="achievement-empty">
                  <FaUserTie />
                  <h3>No Faculty Achievements</h3>
                  <p>
                    Click “Add Faculty Achievement” to create the first record.
                  </p>
                </div>
              ) : (
                <table className="table achievement-table mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Faculty</th>
                      <th>Achievement</th>
                      <th>Description</th>
                      <th>Order</th>
                      <th>Status</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facultyAchievementItems.map((item, index) => {
                      const faculty =
                        typeof item.facultyId === "object"
                          ? item.facultyId
                          : facultyMembers.find(
                              (member) => member._id === item.facultyId,
                            );

                      return (
                        <tr key={item._id || index}>
                          <td>{index + 1}</td>
                          <td>
                            <strong className="achievement-table-title">
                              {faculty?.name || "Faculty Member"}
                            </strong>
                            {faculty?.designation && (
                              <small className="achievement-table-subtitle">
                                {faculty.designation}
                              </small>
                            )}
                          </td>
                          <td>
                            <strong className="achievement-table-title">
                              {item.title || "Untitled"}
                            </strong>
                          </td>
                          <td>
                            <div className="achievement-table-description">
                              {item.description || "—"}
                            </div>
                          </td>
                          <td>{item.order || 1}</td>
                          <td>
                            <span
                              className={
                                item.isActive
                                  ? "achievement-status active"
                                  : "achievement-status inactive"
                              }
                            >
                              {item.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td>
                            <div className="achievement-item-actions justify-content-end">
                              <button
                                type="button"
                                className="achievement-edit-btn"
                                title="Edit"
                                onClick={() =>
                                  openFacultyAchievementModal(item)
                                }
                              >
                                <FaEdit />
                              </button>
                              <button
                                type="button"
                                className="achievement-delete-btn"
                                title="Delete"
                                disabled={facultyAchievementDeleting}
                                onClick={() =>
                                  removeFacultyAchievement(item._id)
                                }
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}

        {/* SAVE EXISTING MODULES */}
        <div className="department-achievements-actions">
          <button
            type="button"
            className="achievement-cancel-btn"
            onClick={() =>
              navigate(`/imsec-control-center/departments/${slug}`)
            }
          >
            Cancel
          </button>
          <button
            type="button"
            className="achievement-save-btn"
            disabled={saving}
            onClick={handleSubmit}
          >
            <FaSave />
            {saving ? "Saving..." : "Save Existing Achievements"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentAchievements;
