import { useEffect, useState } from "react";
import {
  getMembers,
  addMember,
  updateMember,
  deleteMember,
} from "../../../services/governingCouncilService";

const GoverningCouncilForm = () => {
  const [members, setMembers] = useState([]);

  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [nominatedBy, setNominatedBy] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [order, setOrder] = useState("");

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");

  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // ===========================
  // Fetch Members
  // ===========================

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

  // ===========================
  // Image Preview
  // ===========================

  useEffect(() => {
    if (!photo) return;

    const objectUrl = URL.createObjectURL(photo);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  // ===========================
  // Submit
  // ===========================

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

    if (!nominatedBy.trim()) {
      alert("Please enter Nominated By");
      return;
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("designation", designation);
    formData.append("nominatedBy", nominatedBy);
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

  // ===========================
  // Reset
  // ===========================

  const resetForm = () => {
    setName("");
    setDesignation("");
    setNominatedBy("");
    setLinkedin("");
    setOrder("");

    setPhoto(null);
    setPreview("");

    setEditId(null);
  };

  // ===========================
  // Edit
  // ===========================

  const handleEdit = (member) => {
    setEditId(member._id);

    setName(member.name);
    setDesignation(member.designation);
    setNominatedBy(member.nominatedBy);
    setLinkedin(member.linkedin || "");
    setOrder(member.order || "");

    setPreview(member.imageUrl);
    setPhoto(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ===========================
  // Delete
  // ===========================

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

  return (
    <div className="container-fluid">
      <div className="card shadow">
        <div className="card-header">
          <h4>Governing Council</h4>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Name</label>

              <input
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label>Designation</label>

              <input
                className="form-control"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label>Nominated By</label>

              <input
                className="form-control"
                value={nominatedBy}
                onChange={(e) => setNominatedBy(e.target.value)}
                placeholder="e.g. AKTU, AICTE, IMS Society"
              />
            </div>

            <div className="mb-3">
              <label>LinkedIn</label>

              <input
                className="form-control"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label>Display Order</label>

              <input
                type="number"
                className="form-control"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label>Photo</label>

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

            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Saving..." : editId ? "Update Member" : "Add Member"}
            </button>
          </form>
        </div>
      </div>
      {/* ===========================
          Members Table
      =========================== */}

      <div className="card shadow mt-4">
        <div className="card-header">
          <h4>Governing Council Members</h4>
        </div>

        <div className="card-body table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Designation</th>
                <th>Nominated By</th>
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
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        width="70"
                        height="70"
                        className="rounded"
                        style={{ objectFit: "cover" }}
                      />
                    </td>

                    <td>{member.name}</td>

                    <td>{member.designation}</td>

                    <td>{member.nominatedBy}</td>

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
                  <td colSpan="7" className="text-center">
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

export default GoverningCouncilForm;
