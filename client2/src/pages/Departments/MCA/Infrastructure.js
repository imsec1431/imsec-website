import React, { useEffect, useState } from "react";
import "../CSS/Infrastructure.css";

import {
  FaDesktop,
  FaWifi,
  FaBook,
  FaMicrochip,
  FaChalkboardTeacher,
  FaServer,
} from "react-icons/fa";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api`;

const DEPARTMENT_SLUG = "master-of-computer-application";

const facilityIcons = {
  desktop: <FaDesktop />,
  wifi: <FaWifi />,
  book: <FaBook />,
  microchip: <FaMicrochip />,
  chalkboard: <FaChalkboardTeacher />,
  server: <FaServer />,
};

const Infrastructure = () => {
  /* =========================================================
     STATE
  ========================================================= */

  const [department, setDepartment] = useState(null);

  const [infrastructure, setInfrastructure] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* =========================================================
     LOAD DEPARTMENT + INFRASTRUCTURE
  ========================================================= */

  useEffect(() => {
    const loadInfrastructure = async () => {
      try {
        setLoading(true);
        setError("");

        /* =====================================================
           GET DEPARTMENT BY SLUG
        ===================================================== */

        const departmentResponse = await fetch(
          `${API_URL}/departments/slug/${encodeURIComponent(DEPARTMENT_SLUG)}`,
        );

        const departmentResult = await departmentResponse.json();

        if (!departmentResponse.ok) {
          throw new Error(
            departmentResult.message || "Failed to fetch department",
          );
        }

        const departmentData = departmentResult.data;

        if (!departmentData?._id) {
          throw new Error("Department information not found");
        }

        setDepartment(departmentData);

        /* =====================================================
           GET DEPARTMENT INFRASTRUCTURE
        ===================================================== */

        const infrastructureResponse = await fetch(
          `${API_URL}/department-infrastructure/${departmentData._id}`,
        );

        const infrastructureResult = await infrastructureResponse.json();

        if (!infrastructureResponse.ok) {
          throw new Error(
            infrastructureResult.message || "Failed to fetch infrastructure",
          );
        }

        /*
          Backend returns:

          {
            success: true,
            exists: true,
            data: infrastructure
          }

          If infrastructure has not been
          created yet, exists will be false.
        */

        if (
          infrastructureResult.exists === false ||
          !infrastructureResult.data
        ) {
          setInfrastructure(null);
          return;
        }

        setInfrastructure(infrastructureResult.data);
      } catch (err) {
        console.error("Load Public Infrastructure Error:", err);

        setError(err.message || "Failed to load infrastructure");
      } finally {
        setLoading(false);
      }
    };

    loadInfrastructure();
  }, []);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="infrastructureLoading">
        <div className="infrastructureSpinner" />

        <h3>Loading Infrastructure...</h3>

        <p>Please wait while department infrastructure is loaded.</p>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <div className="infrastructureError">
        <h3>Unable to Load Infrastructure</h3>

        <p>{error}</p>
      </div>
    );
  }

  /* =========================================================
     NO INFRASTRUCTURE
  ========================================================= */

  if (!infrastructure) {
    return (
      <div className="infrastructureEmpty">
        <div className="container">
          <h1>Infrastructure</h1>

          <p>Infrastructure information is currently being updated.</p>
        </div>
      </div>
    );
  }

  /* =========================================================
     DATA
  ========================================================= */

  const highlights = Array.isArray(infrastructure.highlights)
    ? [...infrastructure.highlights].sort(
        (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0),
      )
    : [];

  const facilities = Array.isArray(infrastructure.facilities)
    ? [...infrastructure.facilities].sort(
        (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0),
      )
    : [];

  const gallery = Array.isArray(infrastructure.gallery)
    ? [...infrastructure.gallery].sort(
        (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0),
      )
    : [];

  return (
    <div className="infrastructurePage">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="infraHero">
        <div className="container">
          <h1>{infrastructure.title || "Infrastructure"}</h1>

          <p style={{ color: "white" }}>
            Providing excellent facilities for learning, innovation, research
            and professional development.
          </p>
        </div>
      </section>

      {/* =====================================================
          ABOUT INFRASTRUCTURE
      ===================================================== */}

      <section className="container py-5">
        <div className="row align-items-center">
          {/* MAIN IMAGE */}

          <div className="col-lg-6">
            {infrastructure.mainImage ? (
              <img
                src={infrastructure.mainImage}
                alt={infrastructure.title || "Department Infrastructure"}
                className="img-fluid rounded shadow"
              />
            ) : (
              <div className="infraMainPlaceholder">
                <FaDesktop />
              </div>
            )}
          </div>

          {/* DESCRIPTION */}

          <div className="col-lg-6 mt-4 mt-lg-0">
            <h2>{infrastructure.title || "Department Infrastructure"}</h2>

            {infrastructure.description1 && (
              <p>{infrastructure.description1}</p>
            )}

            {infrastructure.description2 && (
              <p>{infrastructure.description2}</p>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          HIGHLIGHTS
      ===================================================== */}

      {highlights.length > 0 && (
        <section className="infraSection">
          <div className="container">
            <div className="sectionTitle">
              <h2>Infrastructure Highlights</h2>
            </div>

            <div className="row">
              {highlights.map((item, index) => (
                <div className="col-lg-4 col-md-6 mb-4" key={item._id || index}>
                  <div className="infraCard">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title || "Infrastructure"}
                      />
                    ) : (
                      <div className="infraCardPlaceholder">
                        <FaDesktop />
                      </div>
                    )}

                    <div className="p-4">
                      <h4>{item.title}</h4>

                      {item.description && <p>{item.description}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          FACILITIES
      ===================================================== */}

      {facilities.length > 0 && (
        <section className="facilitySection">
          <div className="container">
            <div className="sectionTitle">
              <h2>Facilities</h2>
            </div>

            <div className="row">
              {facilities.map((item, index) => (
                <div className="col-lg-3 col-md-6 mb-4" key={item._id || index}>
                  <div className="facilityCard">
                    <div className="facilityIcon">
                      {facilityIcons[item.icon] || <FaDesktop />}
                    </div>

                    <h5>{item.title}</h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          GALLERY
      ===================================================== */}

      {gallery.length > 0 && (
        <section className="container py-5">
          <div className="sectionTitle">
            <h2>Infrastructure Gallery</h2>
          </div>

          <div className="row">
            {gallery.map((item, index) => (
              <div className="col-lg-4 col-md-6 mb-4" key={item._id || index}>
                <div className="galleryCard">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={"Infrastructure Gallery " + (index + 1)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Infrastructure;
