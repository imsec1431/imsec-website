import React, { useEffect, useState } from "react";
import "./imsec-society.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/ims-society`;

const IMSSociety = () => {
  const [society, setSociety] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSociety = async () => {
      try {
        const response = await fetch(API_URL);

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load IMS Society");
        }

        setSociety(result.data);
      } catch (err) {
        console.error("IMS Society error:", err);

        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadSociety();
  }, []);

  if (loading) {
    return (
      <div className="ims-society-page">
        <div className="ims-society-status">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ims-society-page">
        <div className="ims-society-status">{error}</div>
      </div>
    );
  }

  if (!society) {
    return (
      <div className="ims-society-page">
        <div className="ims-society-status">
          IMS Society information is currently unavailable.
        </div>
      </div>
    );
  }

  return (
    <main className="ims-society-page">
      <section className="ims-society-hero">
        <div className="ims-society-hero-content">
          <h1>{society.title}</h1>
        </div>
      </section>

      <section className="ims-society-content">
        <div className="ims-society-container">
          {society.introduction && (
            <div className="ims-society-introduction">
              <p>{society.introduction}</p>
            </div>
          )}

          {society.content && (
            <section className="ims-society-section">
              <h2>About IMS Society</h2>

              <div className="ims-society-text">
                {society.content.split("\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>
          )}

          {society.vision && (
            <section className="ims-society-section">
              <h2>Vision</h2>

              <p>{society.vision}</p>
            </section>
          )}

          {society.mission && (
            <section className="ims-society-section">
              <h2>Mission</h2>

              <p>{society.mission}</p>
            </section>
          )}
        </div>
      </section>
    </main>
  );
};

export default IMSSociety;
