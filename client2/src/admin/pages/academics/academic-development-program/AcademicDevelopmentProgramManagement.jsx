import { useEffect, useState, useRef } from "react";

import {
  getPrograms,
  addProgram,
  updateProgram,
  deleteProgram,
} from "../../../../services/academicDevelopmentProgramService";

const AcademicDevelopmentProgramManagement = () => {
  const [programs, setPrograms] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [status, setStatus] = useState("Upcoming");

  const [registrationLink, setRegistrationLink] = useState("");
  const [detailsLink, setDetailsLink] = useState("");
  const [facebookLink, setFacebookLink] = useState("");
  const [instagramLink, setInstagramLink] = useState("");
  const [linkedinLink, setLinkedinLink] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [twitterLink, setTwitterLink] = useState("");
  const [galleryLink, setGalleryLink] = useState("");

  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  const fileInputRef = useRef(null);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImage(null);
    setDate("");
    setVenue("");
    setStatus("Upcoming");
    setRegistrationLink("");
    setDetailsLink("");
    setFacebookLink("");
    setInstagramLink("");
    setLinkedinLink("");
    setYoutubeLink("");
    setTwitterLink("");
    setGalleryLink("");
    setActive(true);
    setEditId(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const fetchPrograms = async () => {
    try {
      const res = await getPrograms();
      if (res.data?.success) {
        setPrograms(res.data.data);
      }
    } catch (error) {
      console.error("Fetch programs error:", error);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return alert("Title is required");
    if (!description.trim()) return alert("Description is required");
    if (!date) return alert("Date is required");
    if (!venue.trim()) return alert("Venue is required");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", date);
    formData.append("venue", venue);
    formData.append("status", status);
    formData.append("registrationLink", registrationLink);
    formData.append("detailsLink", detailsLink);
    formData.append("facebookLink", facebookLink);
    formData.append("instagramLink", instagramLink);
    formData.append("linkedinLink", linkedinLink);
    formData.append("youtubeLink", youtubeLink);
    formData.append("twitterLink", twitterLink);
    formData.append("galleryLink", galleryLink);
    formData.append("active", active);

    if (image) {
      formData.append("image", image);
    }

    try {
      setLoading(true);

      if (editId) {
        await updateProgram(editId, formData);
        alert("Program Updated Successfully");
      } else {
        await addProgram(formData);
        alert("Program Added Successfully");
      }

      await fetchPrograms();
      resetForm();
    } catch (error) {
      console.error("Submit error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (program) => {
    setEditId(program._id);
    setTitle(program.title || "");
    setDescription(program.description || "");
    setDate(program.date ? program.date.split("T")[0] : "");
    setVenue(program.venue || "");
    setStatus(program.status || "Upcoming");
    setRegistrationLink(program.registrationLink || "");
    setDetailsLink(program.detailsLink || "");
    setFacebookLink(program.facebookLink || "");
    setInstagramLink(program.instagramLink || "");
    setLinkedinLink(program.linkedinLink || "");
    setYoutubeLink(program.youtubeLink || "");
    setTwitterLink(program.twitterLink || "");
    setGalleryLink(program.galleryLink || "");
    setActive(Boolean(program.active));
    setImage(null);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this program?"
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);
      await deleteProgram(id);
      alert("Program Deleted Successfully");
      await fetchPrograms();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Delete Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">
        {editId
          ? "Update Academic Development Program"
          : "Add Academic Development Program"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Title */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Program Title</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Date */}
          <div className="col-md-3 mb-3">
            <label className="form-label">Program Date</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Venue */}
          <div className="col-md-3 mb-3">
            <label className="form-label">Venue</label>
            <input
              type="text"
              className="form-control"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="col-md-12 mb-3">
            <label className="form-label">Description</label>
            <textarea
              rows="5"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Image */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Program Image</label>
            <input
              type="file"
              ref={fileInputRef}
              className="form-control"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          {/* Status */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Upcoming Fields */}
          {status === "Upcoming" && (
            <>
              <div className="col-md-6 mb-3">
                <label className="form-label">Registration Link</label>
                <input
                  type="text"
                  className="form-control"
                  value={registrationLink}
                  onChange={(e) => setRegistrationLink(e.target.value)}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">View Details Link</label>
                <input
                  type="text"
                  className="form-control"
                  value={detailsLink}
                  onChange={(e) => setDetailsLink(e.target.value)}
                />
              </div>
            </>
          )}

          {/* Completed Fields */}
          {status === "Completed" && (
            <>
              <div className="col-md-6 mb-3">
                <label className="form-label">Facebook Link</label>
                <input
                  type="text"
                  className="form-control"
                  value={facebookLink}
                  onChange={(e) => setFacebookLink(e.target.value)}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Instagram Link</label>
                <input
                  type="text"
                  className="form-control"
                  value={instagramLink}
                  onChange={(e) => setInstagramLink(e.target.value)}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">LinkedIn Link</label>
                <input
                  type="text"
                  className="form-control"
                  value={linkedinLink}
                  onChange={(e) => setLinkedinLink(e.target.value)}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">YouTube Link</label>
                <input
                  type="text"
                  className="form-control"
                  value={youtubeLink}
                  onChange={(e) => setYoutubeLink(e.target.value)}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Twitter Link</label>
                <input
                  type="text"
                  className="form-control"
                  value={twitterLink}
                  onChange={(e) => setTwitterLink(e.target.value)}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Gallery Link</label>
                <input
                  type="text"
                  className="form-control"
                  value={galleryLink}
                  onChange={(e) => setGalleryLink(e.target.value)}
                />
              </div>
            </>
          )}

          {/* Active */}
          <div className="col-md-12 mb-4">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="activeCheck"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="activeCheck">
                Active
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className={`btn ${editId ? "btn-warning" : "btn-primary"}`}
          disabled={loading}
        >
          {loading
            ? "Please Wait..."
            : editId
            ? "Update Program"
            : "Add Program"}
        </button>

        {editId && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={resetForm}
            disabled={loading}
          >
            Cancel
          </button>
        )}
      </form>

      <hr className="my-5" />

      <h3 className="mb-3">Academic Development Programs</h3>

      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Title</th>
              <th>Date</th>
              <th>Venue</th>
              <th>Status</th>
              <th>Links</th>
              <th>Active</th>
              <th width="180">Action</th>
            </tr>
          </thead>

          <tbody>
            {programs.length > 0 ? (
              programs.map((program, index) => (
                <tr key={program._id || index}>
                  <td>{index + 1}</td>

                  <td>
                    {program.image && (
                      <img
                        src={program.image}
                        alt=""
                        width="80"
                        height="60"
                        style={{
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    )}
                  </td>

                  <td>{program.title}</td>

                  <td>
                    {program.date
                      ? new Date(program.date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"}
                  </td>

                  {/* Venue */}
                  <td>{program.venue}</td>

                  {/* Status */}
                  <td>
                    <span
                      className={`badge ${
                        program.status === "Upcoming"
                          ? "bg-success"
                          : "bg-secondary"
                      }`}
                    >
                      {program.status}
                    </span>
                  </td>

                  {/* Links */}
                  <td>
                    {program.status === "Upcoming" ? (
                      <>
                        {program.detailsLink && (
                          <a
                            href={program.detailsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-primary me-2"
                          >
                            Details
                          </a>
                        )}

                        {program.registrationLink && (
                          <a
                            href={program.registrationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-success"
                          >
                            Register
                          </a>
                        )}
                      </>
                    ) : (
                      <div className="d-flex flex-wrap gap-1">
                        {program.facebookLink && (
                          <a
                            href={program.facebookLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-primary py-0 px-1"
                          >
                            FB
                          </a>
                        )}

                        {program.instagramLink && (
                          <a
                            href={program.instagramLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-danger py-0 px-1"
                          >
                            IG
                          </a>
                        )}

                        {program.linkedinLink && (
                          <a
                            href={program.linkedinLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-info py-0 px-1"
                          >
                            IN
                          </a>
                        )}

                        {program.youtubeLink && (
                          <a
                            href={program.youtubeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-danger py-0 px-1"
                          >
                            YT
                          </a>
                        )}

                        {program.twitterLink && (
                          <a
                            href={program.twitterLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-dark py-0 px-1"
                          >
                            X
                          </a>
                        )}

                        {program.galleryLink && (
                          <a
                            href={program.galleryLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-secondary py-0 px-1"
                          >
                            Gallery
                          </a>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Active */}
                  <td>
                    {program.active ? (
                      <span className="badge bg-primary">Active</span>
                    ) : (
                      <span className="badge bg-danger">Inactive</span>
                    )}
                  </td>

                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(program)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(program._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-3">
                  No Programs Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AcademicDevelopmentProgramManagement;