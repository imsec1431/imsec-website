import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaPlus, FaTrash, FaUsers } from "react-icons/fa";

import {
  getDepartmentAlumni,
  deleteDepartmentAlumni,
} from "../../services/departmentAlumniService";

import "./department-alumni.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api`;

const DepartmentAlumni = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [department, setDepartment] = useState(null);
  const [alumni, setAlumni] = useState([]);

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      // Get department from slug
      const departmentResponse = await fetch(
        `${API_URL}/departments/slug/${encodeURIComponent(slug)}`,
      );

      const departmentResult = await departmentResponse.json();

      if (!departmentResponse.ok) {
        throw new Error(
          departmentResult?.message || "Failed to load department",
        );
      }

      const departmentData =
        departmentResult?.data ||
        departmentResult?.department ||
        departmentResult;

      if (!departmentData?._id) {
        throw new Error("Department not found");
      }

      setDepartment(departmentData);

      // Get alumni for this department only
      const alumniData = await getDepartmentAlumni(departmentData._id);

      setAlumni(
        Array.isArray(alumniData)
          ? alumniData
          : alumniData?.data || alumniData?.alumni || [],
      );
    } catch (err) {
      console.error("Department Alumni Error:", err);
      setError(err.message || "Failed to load alumni");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      loadData();
    }
  }, [slug]);

  const handleAdd = () => {
    navigate(
      `/imsec-control-center/departments/${encodeURIComponent(
        slug,
      )}/alumni-section/add`,
    );
  };

  const handleEdit = (id) => {
    navigate(
      `/imsec-control-center/departments/${encodeURIComponent(
        slug,
      )}/alumni-section/edit/${id}`,
    );
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this alumni record?",
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      await deleteDepartmentAlumni(id);

      setAlumni((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Delete Alumni Error:", err);

      alert(err.message || "Failed to delete alumni");
    } finally {
      setDeleting(false);
    }
  };

  const handleBack = () => {
    navigate(`/imsec-control-center/departments/${encodeURIComponent(slug)}`);
  };

  if (loading) {
    return (
      <div className="department-alumni-page">
        <div className="department-alumni-loading">
          <div className="department-alumni-loader"></div>
          <p>Loading alumni...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="department-alumni-page">
      {/* Header */}
      <div className="department-alumni-header">
        <div className="department-alumni-title-section">
          <button
            type="button"
            className="department-alumni-back-btn"
            onClick={handleBack}
          >
            <FaArrowLeft />
            Back
          </button>

          <div className="department-alumni-title">
            <div className="department-alumni-icon">
              <FaUsers />
            </div>

            <div>
              <h1>Alumni Section</h1>

              <p>
                {department?.name || department?.departmentName || "Department"}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="department-alumni-add-btn"
          onClick={handleAdd}
        >
          <FaPlus />
          Add Alumni
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="department-alumni-error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Content */}
      <div className="department-alumni-content">
        <div className="department-alumni-card">
          <div className="department-alumni-card-header">
            <div>
              <h2>Department Alumni</h2>
              <p>
                Manage alumni records for{" "}
                <strong>
                  {department?.name ||
                    department?.departmentName ||
                    "this department"}
                </strong>
              </p>
            </div>

            <div className="department-alumni-count">
              {alumni.length} Alumni
            </div>
          </div>

          {alumni.length === 0 ? (
            <div className="department-alumni-empty">
              <FaUsers />

              <h3>No Alumni Found</h3>

              <p>No alumni records have been added for this department yet.</p>

              <button
                type="button"
                className="department-alumni-add-btn"
                onClick={handleAdd}
              >
                <FaPlus />
                Add First Alumni
              </button>
            </div>
          ) : (
            <div className="department-alumni-table-wrapper">
              <table className="department-alumni-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Course</th>
                    <th>Company</th>
                    <th>Order</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {alumni.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>

                      <td>
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="department-alumni-image"
                          />
                        ) : (
                          <div className="department-alumni-no-image">
                            <FaUsers />
                          </div>
                        )}
                      </td>

                      <td>
                        <strong>{item.name}</strong>
                      </td>

                      <td>{item.course || "—"}</td>

                      <td>{item.company || "—"}</td>

                      <td>{item.order ?? 0}</td>

                      <td>
                        <span
                          className={
                            item.isActive
                              ? "department-alumni-status active"
                              : "department-alumni-status inactive"
                          }
                        >
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td>
                        <div className="department-alumni-actions">
                          <button
                            type="button"
                            className="department-alumni-edit-btn"
                            onClick={() => handleEdit(item._id)}
                            title="Edit Alumni"
                          >
                            <FaEdit />
                          </button>

                          <button
                            type="button"
                            className="department-alumni-delete-btn"
                            onClick={() => handleDelete(item._id)}
                            disabled={deleting}
                            title="Delete Alumni"
                          >
                            <FaTrash />
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
      </div>
    </div>
  );
};

export default DepartmentAlumni;
