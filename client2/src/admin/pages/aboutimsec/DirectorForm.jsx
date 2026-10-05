import { useEffect, useState } from "react";
import {
  getDirector,
  saveDirector,
} from "../../../services/directorService";

const DirectorForm = () => {
  const [directorName, setDirectorName] = useState("");
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [linkedin, setLinkedin] = useState("");

  // Fetch Director Data
  const fetchDirector = async () => {
    try {
      const res = await getDirector();

     if (res.data?.data) {
  setDirectorName(res.data.data.directorName || "");
  setLinkedin(res.data.data.linkedin || "");
  setMessage(res.data.data.message || "");
  setPreview(res.data.data.imageUrl || "");
}
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDirector();
  }, []);

  // Update preview image locally when a new photo is selected
  useEffect(() => {
    if (!photo) return;

    const objectUrl = URL.createObjectURL(photo);
    setPreview(objectUrl);

    // Clean up memory
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

const handleSubmit = async (e) => {
  e.preventDefault();

  // Validation
  if (!directorName.trim()) {
    alert("Please enter Director Name");
    return;
  }

  if (!message.trim()) {
    alert("Please enter Director Message");
    return;
  }

  const formData = new FormData();
  formData.append("directorName", directorName);
  formData.append("linkedin", linkedin);
  formData.append("message", message);

  if (photo) {
    formData.append("photo", photo);
  }

  try {
    setLoading(true);
    await saveDirector(formData);

    alert("Director Message Saved Successfully");

    fetchDirector();
    setPhoto(null);
  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="container-fluid">
      <div className="card shadow">
        <div className="card-header">
          <h4>Director's Message</h4>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Director Name</label>
              <input
                className="form-control"
                value={directorName}
                onChange={(e) => setDirectorName(e.target.value)}
              />
            </div>
            <div className="mb-3">
  <label className="form-label">LinkedIn Profile</label>

  <input
    type="url"
    className="form-control"
    placeholder="https://www.linkedin.com/in/username"
    value={linkedin}
    onChange={(e) => setLinkedin(e.target.value)}
  />
</div>

            <div className="mb-3">
              <label className="form-label">Director Photo</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={(e) => setPhoto(e.target.files[0] || null)}
              />
            </div>

            {preview && (
              <div className="mb-3">
                <img
                  src={preview}
                  alt="Director Preview"
                  width="180"
                  className="img-thumbnail"
                />
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">Message</label>
              <textarea
                rows="8"
                className="form-control"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <button
              className="btn btn-primary"
              disabled={loading}
              type="submit"
            >
              {loading ? "Saving..." : "Save Director Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DirectorForm;