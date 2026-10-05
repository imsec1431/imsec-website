import React, { useEffect, useState } from "react";
import { FaDumbbell, FaSave, FaUndo, FaImage } from "react-icons/fa";

import gymAdminService from "../../services/gymAdminService";
import "./gym.css";

const DEFAULT_DATA = {
  title: "Gym",
  heading: "Gym & Fitness Centre",
  description:
    "The institute provides a well-equipped gym and fitness facility to encourage students and staff to maintain a healthy and active lifestyle.",
  facilityDescription:
    "The gym provides a suitable environment for regular exercise, fitness activities and physical well-being. Students can make use of the available fitness equipment and facilities during the designated timings.",
  timings: "Monday to Saturday: 7:00 AM to 8:00 PM",
  location: "Institute Campus",
  contactPerson: "Gym & Fitness Centre Coordinator",
  contactEmail: "gym@imsec.ac.in",
  contactPhone: "+91-120-4081999",
  photo1:
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=85",
  photo2:
    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=85",
  published: true,
};

const Gym = () => {
  const [formData, setFormData] = useState(DEFAULT_DATA);

  const [photo1, setPhoto1] = useState(null);
  const [photo2, setPhoto2] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* =========================================================
     LOAD DATA
     ========================================================= */

  useEffect(() => {
    loadGym();
  }, []);

  const loadGym = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await gymAdminService.getGymAdmin();

      const data = response?.data?.data || response?.data || response;

      if (data) {
        setFormData({
          ...DEFAULT_DATA,
          ...data,
        });
      }
    } catch (err) {
      console.error(err);
      setError(err?.message || "Unable to load gym information.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     INPUT HANDLER
     ========================================================= */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* =========================================================
     IMAGE HANDLERS
     ========================================================= */

  const handlePhoto1Change = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setPhoto1(file);
    }
  };

  const handlePhoto2Change = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setPhoto2(file);
    }
  };

  /* =========================================================
     SAVE
     ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const data = new FormData();

      data.append(
        "data",
        JSON.stringify({
          title: formData.title,
          heading: formData.heading,
          description: formData.description,
          facilityDescription: formData.facilityDescription,
          timings: formData.timings,
          location: formData.location,
          contactPerson: formData.contactPerson,
          contactEmail: formData.contactEmail,
          contactPhone: formData.contactPhone,
          photo1: formData.photo1,
          photo2: formData.photo2,
          published: formData.published,
        }),
      );

      if (photo1) {
        data.append("photo1", photo1);
      }

      if (photo2) {
        data.append("photo2", photo2);
      }

      const response = await gymAdminService.updateGym(data);

      const updatedData = response?.data?.data || response?.data || response;

      if (updatedData) {
        setFormData({
          ...DEFAULT_DATA,
          ...updatedData,
        });
      }

      setPhoto1(null);
      setPhoto2(null);

      setMessage("Gym information updated successfully.");
    } catch (err) {
      console.error(err);

      setError(err?.message || "Unable to update gym information.");
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     RESET
     ========================================================= */

  const handleReset = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset all gym information to default data?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setResetting(true);
      setMessage("");
      setError("");

      const response = await gymAdminService.resetGym();

      const data = response?.data?.data || response?.data || response;

      if (data) {
        setFormData({
          ...DEFAULT_DATA,
          ...data,
        });
      } else {
        setFormData(DEFAULT_DATA);
      }

      setPhoto1(null);
      setPhoto2(null);

      setMessage("Gym information reset to default data.");
    } catch (err) {
      console.error(err);

      setError(err?.message || "Unable to reset gym information.");
    } finally {
      setResetting(false);
    }
  };

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return <div className="gym-admin-loading">Loading Gym Management...</div>;
  }

  /* =========================================================
     UI
     ========================================================= */

  return (
    <div className="gym-admin-page">
      {/* Header */}
      <div className="gym-admin-header">
        <div>
          <div className="gym-admin-title-wrap">
            <div className="gym-admin-title-icon">
              <FaDumbbell />
            </div>

            <div>
              <h1>Gym</h1>

              <p>Manage Gym & Fitness Centre information and photographs.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}

      {message && <div className="gym-admin-success">{message}</div>}

      {error && <div className="gym-admin-error">{error}</div>}

      {/* Form */}

      <form className="gym-admin-form" onSubmit={handleSubmit}>
        {/* Basic Information */}

        <div className="gym-admin-card">
          <div className="gym-admin-card-header">
            <div>
              <h2>Basic Information</h2>
              <p>Update the main Gym page content.</p>
            </div>
          </div>

          <div className="gym-admin-grid">
            <div className="gym-admin-field">
              <label>Title</label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Gym"
              />
            </div>

            <div className="gym-admin-field">
              <label>Heading</label>

              <input
                type="text"
                name="heading"
                value={formData.heading}
                onChange={handleChange}
                placeholder="Gym & Fitness Centre"
              />
            </div>
          </div>

          <div className="gym-admin-field">
            <label>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Enter gym description"
            />
          </div>

          <div className="gym-admin-field">
            <label>Facility Description</label>

            <textarea
              name="facilityDescription"
              value={formData.facilityDescription}
              onChange={handleChange}
              rows="5"
              placeholder="Enter facility information"
            />
          </div>
        </div>

        {/* Facility Details */}

        <div className="gym-admin-card">
          <div className="gym-admin-card-header">
            <div>
              <h2>Facility Details</h2>
              <p>Provide gym timings and location information.</p>
            </div>
          </div>

          <div className="gym-admin-grid">
            <div className="gym-admin-field">
              <label>Timings</label>

              <input
                type="text"
                name="timings"
                value={formData.timings}
                onChange={handleChange}
                placeholder="Monday to Saturday: 7:00 AM to 8:00 PM"
              />
            </div>

            <div className="gym-admin-field">
              <label>Location</label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Institute Campus"
              />
            </div>
          </div>
        </div>

        {/* Contact */}

        <div className="gym-admin-card">
          <div className="gym-admin-card-header">
            <div>
              <h2>Contact Information</h2>
              <p>Contact details for the Gym facility.</p>
            </div>
          </div>

          <div className="gym-admin-grid">
            <div className="gym-admin-field">
              <label>Contact Person</label>

              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                placeholder="Gym & Fitness Centre Coordinator"
              />
            </div>

            <div className="gym-admin-field">
              <label>Contact Email</label>

              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="gym@imsec.ac.in"
              />
            </div>

            <div className="gym-admin-field">
              <label>Contact Phone</label>

              <input
                type="text"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="+91-120-4081999"
              />
            </div>
          </div>
        </div>

        {/* Photos */}

        <div className="gym-admin-card">
          <div className="gym-admin-card-header">
            <div>
              <h2>Gym Photographs</h2>
              <p>Upload two photographs of the Gym and Fitness Centre.</p>
            </div>
          </div>

          <div className="gym-photo-admin-grid">
            {/* Photo 1 */}

            <div className="gym-photo-admin-box">
              <div className="gym-photo-admin-title">
                <FaImage />
                <span>Photo 1</span>
              </div>

              <div className="gym-photo-preview">
                <img
                  src={photo1 ? URL.createObjectURL(photo1) : formData.photo1}
                  alt="Gym 1"
                />
              </div>

              <label className="gym-upload-button">
                Choose Photo 1
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhoto1Change}
                />
              </label>

              {photo1 && <div className="gym-selected-file">{photo1.name}</div>}
            </div>

            {/* Photo 2 */}

            <div className="gym-photo-admin-box">
              <div className="gym-photo-admin-title">
                <FaImage />
                <span>Photo 2</span>
              </div>

              <div className="gym-photo-preview">
                <img
                  src={photo2 ? URL.createObjectURL(photo2) : formData.photo2}
                  alt="Gym 2"
                />
              </div>

              <label className="gym-upload-button">
                Choose Photo 2
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhoto2Change}
                />
              </label>

              {photo2 && <div className="gym-selected-file">{photo2.name}</div>}
            </div>
          </div>
        </div>

        {/* Publish */}

        <div className="gym-admin-card gym-publish-card">
          <div>
            <h2>Publish Gym Page</h2>

            <p>
              Enable this option to display the Gym page on the public website.
            </p>
          </div>

          <label className="gym-switch">
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
            />

            <span className="gym-slider"></span>
          </label>
        </div>

        {/* Actions */}

        <div className="gym-admin-actions">
          <button
            type="button"
            className="gym-reset-button"
            onClick={handleReset}
            disabled={resetting || saving}
          >
            <FaUndo />

            {resetting ? "Resetting..." : "Reset Defaults"}
          </button>

          <button
            type="submit"
            className="gym-save-button"
            disabled={saving || resetting}
          >
            <FaSave />

            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Gym;
