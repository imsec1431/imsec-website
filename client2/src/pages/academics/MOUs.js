import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaExternalLinkAlt,
  FaDownload,
} from "react-icons/fa";
import { getMOUs } from "../../services/mouService";

import "./MOUs.css";

/* ===================================================
      Static Data
      Later Fetch from Admin Panel
=================================================== */

const MOUs = () => {
  const [mous, setMous] = useState([]);

  const [featuredMOU, setFeaturedMOU] = useState(null);

  const [loading, setLoading] = useState(true);

  const fetchMOUs = async () => {
    try {
      const res = await getMOUs();

      if (res.data?.data) {
        const activeMOUs = res.data.data
          .filter((item) => item.active)
          .sort((a, b) => a.displayOrder - b.displayOrder);

        setMous(activeMOUs);

        if (activeMOUs.length > 0) {
          setFeaturedMOU(activeMOUs[0]);
        }
      }
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMOUs();
  }, []);
  if (loading) {
    return (
      <div className="text-center py-5">
        <h3>Loading...</h3>
      </div>
    );
  }

  if (mous.length === 0) {
    return (
      <div className="text-center py-5">
        <h3>No MOUs Available</h3>
        <p>No Memorandum of Understanding has been added yet.</p>
      </div>
    );
  }
  return (
    <>
      {/* ================= Hero ================= */}

      <section className="mou-hero">
        <Container>
          <div className="hero-content">
            <h1>Memorandums of Understanding</h1>

            <p style={{ color: "white" }}>
              Home
              <span>/</span>
              COE
              <span>/</span>
              MOUs
            </p>
          </div>
        </Container>
      </section>

      {/* ================= All Signing Ceremonies ================= */}

      <section className="mou-list py-5">
        <Container>
          <div className="text-center mb-5">
            <h6 className="section-tag" style={{ color: "black" }}>
              ALL CEREMONIES
            </h6>

            <h2 className="section-title">
              MOU
              <span> Signing Ceremonies</span>
            </h2>
          </div>

          <Row className="g-4">
            {mous.map((item) => (
              <Col lg={4} key={item._id}>
                <div className="mou-card">
                  <img
                    src={item.signingPhoto}
                    alt={item.organization}
                    className="card-photo"
                  />

                  <div className="card-body">
                    <h4>{item.organization}</h4>

                    <p>
                      <strong>Director :</strong>

                      {item.director}
                    </p>

                    <p>
                      <strong>Representative :</strong>

                      {item.representative}
                    </p>

                    <p>
                      <FaCalendarAlt />{" "}
                      {new Date(item.signedDate).toLocaleDateString("en-GB")}
                    </p>

                    <p>
                      <FaMapMarkerAlt /> {item.venue}
                    </p>

                    <a
                      href={item.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary rounded-pill"
                    >
                      <FaExternalLinkAlt className="me-2" />
                      Visit Website
                    </a>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      {/* ================= Gallery ================= */}

      <section className="mou-gallery py-5">
        <Container>
          <div className="text-center mb-5">
            <h6 className="section-tag" style={{ color: "black" }}>
              PHOTO GALLERY
            </h6>

            <h2 className="section-title">
              MOU
              <span> Gallery</span>
            </h2>
          </div>

          <Row className="g-4">
            {mous.map((item) => (
              <Col lg={4} md={6} key={item._id}>
                <div className="gallery-card">
                  <img
                    src={item.signingPhoto}
                    alt={item.organization}
                    className="img-fluid"
                  />
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ================= Statistics ================= */}

      {/* <section className="mou-stats py-5">
        <Container>
          <Row className="g-4">
            <Col lg={3} md={6}>
              <div className="stat-card">
                <h2>125+</h2>

                <p>Industry Partners</p>
              </div>
            </Col>

            <Col lg={3} md={6}>
              <div className="stat-card">
                <h2>35+</h2>

                <p>International Collaborations</p>
              </div>
            </Col>

            <Col lg={3} md={6}>
              <div className="stat-card">
                <h2>5000+</h2>

                <p>Students Benefited</p>
              </div>
            </Col>

            <Col lg={3} md={6}>
              <div className="stat-card">
                <h2>300+</h2>

                <p>Internships Offered</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section> */}

      {/* ================= Downloads ================= */}

      <section className="download-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h6 className="section-tag" style={{ color: "black" }}>
              DOWNLOADS
            </h6>

            <h2 className="section-title">
              MOU
              <span> Documents</span>
            </h2>
          </div>

          <Row className="g-4">
            {mous.map((item) => (
              <Col lg={6} key={item._id}>
                <div className="download-card">
                  <div>
                    <h5>{item.organization}</h5>

                    <span>Official MOU Agreement</span>
                  </div>

                  <a
                    href={item.pdfLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-warning rounded-pill"
                  >
                    <FaDownload className="me-2" />
                    Download
                  </a>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ================= CTA ================= */}

      <section className="mou-cta">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h2 style={{ color: "white" }}>
                Become Our Collaboration Partner
              </h2>

              <p style={{ color: "white" }}>
                Join hands with IMS Engineering College to create opportunities
                in education, research, innovation and industry.
              </p>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default MOUs;
