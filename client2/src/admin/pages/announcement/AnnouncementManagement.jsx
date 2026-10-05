import { useEffect, useState } from "react";

import {
  getAnnouncements,
  addAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../../../services/announcementService";

const AnnouncementManagement = () => {
  const [announcements, setAnnouncements] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const [active, setActive] = useState(true);

  const [editId, setEditId] = useState(null);

  const [loading, setLoading] = useState(false);

  // ==========================
  // Fetch
  // ==========================

  const fetchAnnouncements = async () => {
    try {
      const res = await getAnnouncements();

      if (res.data?.data) {
        setAnnouncements(res.data.data);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // ==========================
  // Submit
  // ==========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter announcement title");
      return;
    }

    if (!date) {
      alert("Please select announcement date");
      return;
    }

    const data = {
      title,
      description,
      date,
      active,
    };

    try {
      setLoading(true);

      if (editId) {
        await updateAnnouncement(editId, data);

        alert("Announcement Updated Successfully");
      } else {
        await addAnnouncement(data);

        alert("Announcement Added Successfully");
      }

      resetForm();

      fetchAnnouncements();
    } catch (error) {
      // console.log(error);

      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Reset
  // ==========================

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDate("");

    setActive(true);

    setEditId(null);
  };

  // ==========================
  // Edit
  // ==========================

  const handleEdit = (announcement) => {
    setEditId(announcement._id);

    setTitle(announcement.title);

    setDescription(announcement.description);

    setDate(announcement.date.split("T")[0]);

    setActive(announcement.active);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================
  // Delete
  // ==========================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this announcement?");

    if (!confirmDelete) return;

    try {
      await deleteAnnouncement(id);

      fetchAnnouncements();

      alert("Announcement Deleted Successfully");
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <div className="container-fluid">
      <div className="card shadow">
        <div className="card-header">
          <h4>Announcement Management</h4>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Announcement Title</label>

              <input
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label>Description</label>

              <textarea
                rows="4"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label>Date</label>

              <input
                type="date"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="form-check mb-4">
              <input
                type="checkbox"
                className="form-check-input"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />

              <label className="form-check-label">Active</label>
            </div>

            <button className="btn btn-primary" disabled={loading}>
              {loading
                ? "Saving..."
                : editId
                  ? "Update Announcement"
                  : "Add Announcement"}
            </button>
          </form>
        </div>
      </div>
      <div className="card shadow mt-4">
        <div className="card-header">
          <h4>Announcement List</h4>
        </div>

        <div className="card-body table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th width="60">#</th>
                <th>Title</th>
                <th>Description</th>
                <th>Date</th>
                <th>Status</th>
                <th width="180">Action</th>
              </tr>
            </thead>

            <tbody>
              {announcements.length > 0 ? (
                announcements.map((announcement, index) => (
                  <tr key={announcement._id}>
                    <td>{index + 1}</td>

                    <td>{announcement.title}</td>

                    <td>{announcement.description || "-"}</td>

                    <td>{new Date(announcement.date).toLocaleDateString()}</td>

                    <td>
                      <span
                        className={`badge ${
                          announcement.active ? "bg-success" : "bg-secondary"
                        }`}
                      >
                        {announcement.active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEdit(announcement)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(announcement._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No Announcements Found
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

export default AnnouncementManagement;
