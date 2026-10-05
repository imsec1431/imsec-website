import { useEffect, useState } from "react";
import {
  getMembers,
  addMember,
  updateMember,
  deleteMember,
} from "../../../services/executiveCouncilService";

const ExecutiveCouncilForm = () => {
  const [members, setMembers] = useState([]);

  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [order, setOrder] = useState("");

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");

  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // ==========================
  // Fetch Members
  // ==========================
  const fetchMembers = async () => {
    try {
      const res = await getMembers();
      setMembers(res.data.data);
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // ==========================
  // Preview Image
  // ==========================
  useEffect(() => {
    if (!photo) return;

    const objectUrl = URL.createObjectURL(photo);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  // ==========================
  // Submit Form
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter member name");
      return;
    }

    if (!designation.trim()) {
      alert("Please enter designation");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("designation", designation);
    formData.append("linkedin", linkedin);
    formData.append("order", order);

    if (photo) {
      formData.append("photo", photo);
    }

    try {
      setLoading(true);

      if (editId) {
        await updateMember(editId, formData);
        alert("Member Updated Successfully");
      } else {
        await addMember(formData);
        alert("Member Added Successfully");
      }

      resetForm();
      fetchMembers();
    } catch (error) {
      // console.log(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Edit Member
  // ==========================
  const handleEdit = (member) => {
    setEditId(member._id);

    setName(member.name);
    setDesignation(member.designation);
    setLinkedin(member.linkedin || "");
    setOrder(member.order || "");

    setPreview(member.imageUrl);
    setPhoto(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================
  // Delete Member
  // ==========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this member?",
    );

    if (!confirmDelete) return;

    try {
      await deleteMember(id);
      alert("Member Deleted Successfully");
      fetchMembers();
    } catch (error) {
      // console.log(error);
      alert("Something went wrong");
    }
  };

  // ==========================
  // Reset Form
  // ==========================
  const resetForm = () => {
    setName("");
    setDesignation("");
    setLinkedin("");
    setOrder("");

    setPhoto(null);
    setPreview("");

    setEditId(null);
  };

  return (
    <div className="container-fluid py-4">
      {/* Form Card */}
      <div className="card shadow mb-4">
        <div className="card-header">
          <h4 className="mb-0">
            {editId
              ? "Edit Executive Council Member"
              : "Add Executive Council Member"}
          </h4>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Designation</label>
              <input
                className="form-control"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">LinkedIn URL</label>
              <input
                className="form-control"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Display Order</label>
              <input
                type="number"
                className="form-control"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Photo</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files[0])}
              />
            </div>

            {preview && (
              <div className="mb-3">
                <img
                  src={preview}
                  alt="Preview"
                  width="170"
                  className="img-thumbnail"
                />
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary me-2"
              disabled={loading}
            >
              {loading ? "Saving..." : editId ? "Update Member" : "Add Member"}
            </button>

            {editId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Members Table Card */}
      <div className="card shadow">
        <div className="card-header">
          <h4 className="mb-0">Executive Council Members</h4>
        </div>

        <div className="card-body table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Designation</th>
                <th>LinkedIn</th>
                <th>Order</th>
                <th width="170">Action</th>
              </tr>
            </thead>

            <tbody>
              {members.length > 0 ? (
                members.map((member) => (
                  <tr key={member._id}>
                    <td>
                      {member.imageUrl ? (
                        <img
                          src={member.imageUrl}
                          alt={member.name}
                          width="70"
                          className="rounded"
                        />
                      ) : (
                        <span className="text-muted">No Image</span>
                      )}
                    </td>

                    <td>{member.name}</td>
                    <td>{member.designation}</td>

                    <td>
                      {member.linkedin ? (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Profile
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td>{member.order}</td>

                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEdit(member)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(member._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No Members Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveCouncilForm;
