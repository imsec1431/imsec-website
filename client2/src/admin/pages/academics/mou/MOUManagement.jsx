import { useEffect, useState, useRef } from "react";
import {
  getMOUs,
  addMOU,
  updateMOU,
  deleteMOU,
} from "../../../../services/mouService";

const MOUManagement = () => {
  const [mous, setMous] = useState([]);
  const [organization, setOrganization] = useState("");
  const [image, setImage] = useState(null);
  const [director, setDirector] = useState("");
  const [representative, setRepresentative] = useState("");
  const [signedDate, setSignedDate] = useState("");
  const [venue, setVenue] = useState("");
  const [website, setWebsite] = useState("");
  const [pdfLink, setPdfLink] = useState("");
  const [displayOrder, setDisplayOrder] = useState(1);
  const [active, setActive] = useState(true);
  const [editId, setEditId] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const fetchMOUs = async () => {
    try {
      const res = await getMOUs();
      if (res.data?.data) {
        setMous(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching MOUs:", error);
    }
  };

  useEffect(() => {
    fetchMOUs();
  }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setOrganization("");
    setImage(null);
    setDirector("");
    setRepresentative("");
    setSignedDate("");
    setVenue("");
    setWebsite("");
    setPdfLink("");
    setDisplayOrder(1);
    setActive(true);
    setEditId(null);
    setPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!organization.trim()) return alert("Organization Name is required");
    if (!editId && !image) return alert("Please select Signing Ceremony Photo");
    if (!director.trim()) return alert("Director Name is required");
    if (!representative.trim()) return alert("Representative Name is required");
    if (!signedDate) return alert("Signed Date is required");
    if (!venue.trim()) return alert("Venue is required");

    const formData = new FormData();
    formData.append("organization", organization);
    if (image) formData.append("image", image);
    formData.append("director", director);
    formData.append("representative", representative);
    formData.append("signedDate", signedDate);
    formData.append("venue", venue);
    formData.append("website", website);
    formData.append("pdfLink", pdfLink);
    formData.append("displayOrder", displayOrder);
    formData.append("active", active);

    try {
      setLoading(true);
      if (editId) {
        await updateMOU(editId, formData);
        alert("MOU Updated Successfully");
      } else {
        await addMOU(formData);
        alert("MOU Added Successfully");
      }
      fetchMOUs();
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setOrganization(item.organization || "");
    setDirector(item.director || "");
    setRepresentative(item.representative || "");
    setSignedDate(item.signedDate ? item.signedDate.substring(0, 10) : "");
    setVenue(item.venue || "");
    setWebsite(item.website || "");
    setPdfLink(item.pdfLink || "");
    setDisplayOrder(item.displayOrder || 1);
    setActive(item.active ?? true);
    setPreview(item.signingPhoto || "");
    setImage(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this MOU?")) return;

    try {
      await deleteMOU(id);
      fetchMOUs();
      alert("MOU Deleted Successfully");
    } catch (error) {
      console.error("Error deleting MOU:", error);
      alert("Unable to delete MOU");
    }
  };

  return (
    <div className="container-fluid py-3">
      {/* Form Card */}
      <div className="card shadow mb-4">
        <div className="card-header">
          <h4 className="m-0">{editId ? "Edit MOU" : "Add New MOU"}</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Organization Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Signing Ceremony Photo</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleImage}
                />
              </div>

              {preview && (
                <div className="col-md-12 mb-3">
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      width: "220px",
                      borderRadius: "10px",
                      border: "1px solid #ddd",
                    }}
                  />
                </div>
              )}

              <div className="col-md-6 mb-3">
                <label className="form-label">Director Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={director}
                  onChange={(e) => setDirector(e.target.value)}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Representative Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={representative}
                  onChange={(e) => setRepresentative(e.target.value)}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Signed Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={signedDate}
                  onChange={(e) => setSignedDate(e.target.value)}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Venue</label>
                <input
                  type="text"
                  className="form-control"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Website</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="https://example.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Google Drive PDF Link</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="https://drive.google.com/..."
                  value={pdfLink}
                  onChange={(e) => setPdfLink(e.target.value)}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Display Order</label>
                <input
                  type="number"
                  className="form-control"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                />
              </div>

              <div className="col-md-6 d-flex align-items-center mb-3">
                <div className="form-check mt-3">
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

              <div className="col-12 mt-3">
                <button
                  type="submit"
                  className="btn btn-primary me-2"
                  disabled={loading}
                >
                  {loading
                    ? "Saving..."
                    : editId
                    ? "Update MOU"
                    : "Add MOU"}
                </button>
                {editId && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={resetForm}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* List Table Card */}
      <div className="card shadow">
        <div className="card-header">
          <h4 className="m-0">MOU List</h4>
        </div>

        <div className="card-body table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Photo</th>
                <th>Organization</th>
                <th>Director</th>
                <th>Representative</th>
                <th>Signed Date</th>
                <th>Venue</th>
                <th>Order</th>
                <th>Status</th>
                <th width="170">Action</th>
              </tr>
            </thead>

            <tbody>
              {mous.length > 0 ? (
                mous.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={item.signingPhoto}
                        alt={item.organization}
                        style={{
                          width: "90px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    </td>
                    <td>{item.organization}</td>
                    <td>{item.director}</td>
                    <td>{item.representative}</td>
                    <td>
                      {item.signedDate
                        ? new Date(item.signedDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td>{item.venue}</td>
                    <td>{item.displayOrder}</td>
                    <td>
                      {item.active ? (
                        <span className="badge bg-success">Active</span>
                      ) : (
                        <span className="badge bg-secondary">Inactive</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center py-4">
                    No MOUs Found
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

export default MOUManagement;