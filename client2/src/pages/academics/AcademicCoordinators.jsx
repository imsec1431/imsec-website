import React, { useEffect, useState } from "react";
import { getPublishedAcademicCoordinators } from "../../services/academicCoordinatorPublicService";

import "./AcademicCoordinators.css";

const AcademicCoordinators = () => {
  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoordinators = async () => {
      try {
        const response = await getPublishedAcademicCoordinators();

        setCoordinators(response.data.data || []);
      } catch (error) {
        console.error("Fetch Academic Coordinators Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoordinators();
  }, []);

  if (loading) {
    return (
      <div className="academic-coordinators-loading">
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <div className="academic-coordinators-page">
      <div className="academic-coordinators-container">
        {/* PAGE HEADER */}
        <div className="academic-coordinators-header">
          <h1>Academic Coordinators</h1>

          <p>
            Meet our academic coordinators and learn about their
            responsibilities.
          </p>
        </div>

        {/* COORDINATORS */}
        {coordinators.length === 0 ? (
          <div className="academic-coordinators-empty">
            <p>No Academic Coordinators available at the moment.</p>
          </div>
        ) : (
          <div className="academic-coordinators-grid">
            {coordinators.map((coordinator) => (
              <div className="academic-coordinator-card" key={coordinator._id}>
                <div className="academic-coordinator-photo">
                  <img src={coordinator.photo} alt={coordinator.name} />
                </div>

                <div className="academic-coordinator-content">
                  <h2>{coordinator.name}</h2>

                  <h4>Responsibilities</h4>

                  <p>{coordinator.responsibilities}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AcademicCoordinators;
