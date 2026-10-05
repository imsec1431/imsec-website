import React, { useEffect, useState } from "react";
import {
  getAcademicCoordinators,
  createAcademicCoordinator,
  updateAcademicCoordinator,
  deleteAcademicCoordinator,
} from "../../../services/academicCoordinatorService";

import "./AcademicCoordinatorManagement.css";

const AcademicCoordinatorManagement = () => {
  const [coordinators, setCoordinators] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    responsibilities: "",
    order: 0,
    isPublished: true,
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ==============================
     Fetch Coordinators
  ============================== */
  const fetchCoordinators = async () => {
    try {
      setLoading(true);

      const response = await getAcademicCoordinators();

      setCoordinators(response.data.data || []);
    } catch (error) {
      console.error("Fetch Academic Coordinators Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to fetch Academic Coordinators",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoordinators();
  }, []);

  /* ==============================
     Input Change
  ============================== */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* ==============================
     Image Change
  ============================== */
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ==============================
     Submit
  ============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter coordinator name.");
      return;
    }

    if (!formData.responsibilities.trim()) {
      alert("Please enter responsibilities.");
      return;
    }

    if (!editingId && !image) {
      alert("Please select coordinator photo.");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", formData.name);
      data.append("responsibilities", formData.responsibilities);
      data.append("order", formData.order);
      data.append("isPublished", formData.isPublished);

      if (image) {
        data.append("image", image);
      }

      if (editingId) {
        await updateAcademicCoordinator(editingId, data);

        alert("Academic Coordinator updated successfully.");
      } else {
        await createAcademicCoordinator(data);

        alert("Academic Coordinator added successfully.");
      }

      resetForm();
      fetchCoordinators();
    } catch (error) {
      console.error("Save Academic Coordinator Error:", error);

      alert(
        error.response?.data?.message || "Failed to save Academic Coordinator",
      );
    } finally {
      setLoading(false);
    }
  };

  /* ==============================
     Edit
  ============================== */
  const handleEdit = (coordinator) => {
    setEditingId(coordinator._id);

    setFormData({
      name: coordinator.name || "",
      responsibilities: coordinator.responsibilities || "",
      order: coordinator.order || 0,
      isPublished: coordinator.isPublished !== false,
    });

    setImage(null);
    setPreview(coordinator.photo || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ==============================
     Delete
  ============================== */
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Academic Coordinator?",
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);

      await deleteAcademicCoordinator(id);

      alert("Academic Coordinator deleted successfully.");

      fetchCoordinators();
    } catch (error) {
      console.error("Delete Academic Coordinator Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete Academic Coordinator",
      );
    } finally {
      setLoading(false);
    }
  };

  /* ==============================
     Reset Form
  ============================== */
  const resetForm = () => {
    setEditingId(null);

    setFormData({
      name: "",
      responsibilities: "",
      order: 0,
      isPublished: true,
    });

    setImage(null);
    setPreview("");

    const fileInput = document.getElementById("academicCoordinatorImage");

    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <div className="academic-coordinator-management">
      <div className="academic-coordinator-header">
        <h2>Academic Coordinator</h2>

        <p>Manage Academic Coordinators, their photos and responsibilities.</p>
      </div>

      {/* ==============================
          FORM
      ============================== */}

      <div className="academic-coordinator-form-card">
        <h3>
          {editingId ? "Edit Academic Coordinator" : "Add Academic Coordinator"}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Coordinator Name <span>*</span>
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter coordinator name"
            />
          </div>

          <div className="form-group">
            <label>
              Responsibilities <span>*</span>
            </label>

            <textarea
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              placeholder="Enter responsibilities"
              rows="5"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Display Order</label>

              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className="form-group publish-group">
              <label>Publish</label>

              <label className="switch">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                />

                <span className="slider"></span>
              </label>

              <span className="publish-text">
                {formData.isPublished ? "Published" : "Unpublished"}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label>Coordinator Photo {!editingId && <span>*</span>}</label>

            <input
              id="academicCoordinatorImage"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageChange}
            />

            <small>JPG, JPEG, PNG or WEBP. Maximum 8 MB.</small>
          </div>

          {preview && (
            <div className="image-preview">
              <p>Photo Preview</p>

              <img src={preview} alt="Coordinator Preview" />
            </div>
          )}

          <div className="form-buttons">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading
                ? "Saving..."
                : editingId
                  ? "Update Coordinator"
                  : "Add Coordinator"}
            </button>

            {editingId && (
              <button
                type="button"
                className="btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ==============================
          LIST
      ============================== */}

      <div className="academic-coordinator-list-card">
        <div className="list-header">
          <h3>Academic Coordinators</h3>

          <span>Total: {coordinators.length}</span>
        </div>

        {loading && coordinators.length === 0 ? (
          <div className="loading-text">Loading...</div>
        ) : coordinators.length === 0 ? (
          <div className="empty-text">No Academic Coordinators added yet.</div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Responsibilities</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {coordinators.map((coordinator) => (
                  <tr key={coordinator._id}>
                    <td>
                      <img
                        className="coordinator-table-image"
                        src={coordinator.photo}
                        alt={coordinator.name}
                      />
                    </td>

                    <td>
                      <strong>{coordinator.name}</strong>
                    </td>

                    <td className="responsibility-cell">
                      {coordinator.responsibilities}
                    </td>

                    <td>{coordinator.order}</td>

                    <td>
                      <span
                        className={
                          coordinator.isPublished
                            ? "status-published"
                            : "status-unpublished"
                        }
                      >
                        {coordinator.isPublished ? "Published" : "Unpublished"}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(coordinator)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(coordinator._id)}
                        >
                          Delete
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
  );
};

export default AcademicCoordinatorManagement;
