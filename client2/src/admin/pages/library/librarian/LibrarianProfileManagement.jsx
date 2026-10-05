import { useEffect, useState, useRef } from "react";
import {
  getLibrarianProfile,
  saveLibrarianProfile,
} from "../../../services/librarianProfileService";

const LibrarianProfileManagement = () => {
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [qualification, setQualification] = useState("");
  const [experience, setExperience] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [about, setAbout] = useState("");
  const [active, setActive] = useState(true);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const fetchProfile = async () => {
    try {
      const res = await getLibrarianProfile();
      if (res.data?.success && res.data?.data) {
        const profile = res.data.data;
        setName(profile.name || "");
        setDesignation(profile.designation || "");
        setQualification(profile.qualification || "");
        setExperience(profile.experience || "");
        setPhone(profile.phone || "");
        setEmail(profile.email || "");
        setAbout(profile.about || "");
        setActive(Boolean(profile.active));

        if (profile.imageUrl || profile.image) {
          setPreview(profile.imageUrl || profile.image);
        }
      }
    } catch (error) {
      console.error("Fetch profile error:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      // Clean up previous blob URL if exists
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return alert("Name is required");
    if (!designation.trim()) return alert("Designation is required");
    if (!qualification.trim()) return alert("Qualification is required");

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("designation", designation.trim());
    formData.append("qualification", qualification.trim());
    formData.append("experience", experience.trim());
    formData.append("phone", phone.trim());
    formData.append("email", email.trim());
    formData.append("about", about.trim());
    formData.append("active", active);

    if (image) {
      formData.append("image", image);
    }

    try {
      setLoading(true);
      await saveLibrarianProfile(formData);
      alert("Profile Saved Successfully");

      // Reset image state & fetch latest
      setImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      await fetchProfile();
    } catch (error) {
      console.error("Save error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4">Librarian Profile</h3>

      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Photo */}
          <div className="col-md-4 mb-3">
            <label className="form-label">Photo</label>
            <input
              type="file"
              ref={fileInputRef}
              className="form-control"
              accept="image/*"
              onChange={handleImageChange}
            />

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="img-fluid rounded shadow mt-3"
                style={{
                  height: "220px",
                  width: "100%",
                  objectFit: "cover",
                }}
              />
            )}
          </div>

          <div className="col-md-8">
            <div className="row">
              {/* Name */}
              <div className="col-md-6 mb-3">
                <label className="form-label" htmlFor="nameInput">
                  Name
                </label>
                <input
                  id="nameInput"
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Designation */}
              <div className="col-md-6 mb-3">
                <label className="form-label" htmlFor="designationInput">
                  Designation
                </label>
                <input
                  id="designationInput"
                  type="text"
                  className="form-control"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                />
              </div>

              {/* Qualification */}
              <div className="col-md-6 mb-3">
                <label className="form-label" htmlFor="qualificationInput">
                  Qualification
                </label>
                <input
                  id="qualificationInput"
                  type="text"
                  className="form-control"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                />
              </div>

              {/* Experience */}
              <div className="col-md-6 mb-3">
                <label className="form-label" htmlFor="experienceInput">
                  Experience
                </label>
                <input
                  id="experienceInput"
                  type="text"
                  className="form-control"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              </div>

              {/* Phone */}
              <div className="col-md-6 mb-3">
                <label className="form-label" htmlFor="phoneInput">
                  Phone
                </label>
                <input
                  id="phoneInput"
                  type="text"
                  className="form-control"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {/* Email */}
              <div className="col-md-6 mb-3">
                <label className="form-label" htmlFor="emailInput">
                  Email
                </label>
                <input
                  id="emailInput"
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* About */}
          <div className="col-md-12 mb-3">
            <label className="form-label" htmlFor="aboutInput">
              About
            </label>
            <textarea
              id="aboutInput"
              rows="5"
              className="form-control"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />
          </div>

          {/* Active */}
          <div className="col-md-12 mb-4">
            <div className="form-check">
              <input
                id="activeCheck"
                type="checkbox"
                className="form-check-input"
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
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default LibrarianProfileManagement;