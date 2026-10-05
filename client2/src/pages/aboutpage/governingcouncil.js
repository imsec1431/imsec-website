import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaUsers, FaLinkedinIn, FaBuilding } from "react-icons/fa6";

import "./governingcouncil.css";
import { getMembers } from "../../services/governingCouncilService";

/* =====================================================
        Static Data
    Later Comes From Admin Panel
===================================================== */

const GoverningCouncil = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      const res = await getMembers();

      if (res.data?.data) {
        setMembers(res.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <>
      {/* ================= Hero ================= */}
      <section className="governing-hero">
        <Container>
          <div className="hero-content">
            <h1>Governing Council</h1>

            <p style={{ color: "white" }}>
              Home
              <span>/</span>
              About
              <span>/</span>
              Governing Council
            </p>
          </div>
        </Container>
      </section>

      {/* ================= Introduction ================= */}
      <section className="governing-intro py-5">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={12}>
              <h6 className="section-tag" style={{ color: "black" }}>
                GOVERNANCE
              </h6>

              <h2 className="section-title">
                Governing
                <span> Council</span>
              </h2>

              <p>
                The Governing Council provides strategic direction, policy
                guidance and administrative oversight for IMS Engineering
                College.
              </p>

              <p>
                It consists of distinguished academicians, industry experts,
                university nominees, management representatives and faculty
                members committed to institutional excellence.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= Governing Members ================= */}
      <section className="governing-members py-5">
        <Container fluid="lg">
          <div className="text-center mb-5">
            <h2 className="section-title">
              Governing
              <span> Council Members</span>
            </h2>
          </div>

          <Row className="g-4">
            {members.map((member) => (
              /* lg={3} creates 4 items per row on laptops (12 / 3 = 4) */
              <Col lg={3} md={6} sm={12} key={member._id}>
                <div className="governing-card h-100">
                  <div className="governing-image-box">
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="governing-photo"
                    />
                  </div>

                  <div className="governing-body">
                    <h4>{member.name}</h4>

                    <span className="designation">{member.designation}</span>

                    <div className="nominee">
                      <FaBuilding />
                      <strong>Nominated By:</strong>
                    </div>

                    <p className="nominee-text">{member.nominatedBy}</p>

                    <div className="member-social">
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaLinkedinIn />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ================= Roles & Responsibilities ================= */}
      <section className="governing-responsibilities py-5">
        <Container fluid="lg">
          <div className="text-center mb-5">
            <h2 className="section-title">
              Roles &<span> Responsibilities</span>
            </h2>
          </div>

          <Row className="g-4">
            {[
              "Strategic Planning",
              "Academic Excellence",
              "Institutional Governance",
              "Financial Oversight",
              "Quality Assurance",
              "Policy Formulation",
            ].map((item, index) => (
              /* lg={3} creates 4 items per row on laptops */
              <Col lg={3} md={6} sm={12} key={index}>
                <div className="responsibility-card h-100">
                  <FaUsers className="responsibility-icon" />

                  <h4>{item}</h4>

                  <p>
                    Ensuring continuous growth, quality education and effective
                    governance of the institution.
                  </p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ================= Quote ================= */}
      <section className="governing-quote">
        <Container>
          <div className="quote-box">
            <span className="quote-icon">"</span>

            <h2 style={{ color: "white" }}>
              Strong governance creates a strong institution. Our commitment is
              to academic excellence, innovation and ethical leadership.
            </h2>

            <h5>Governing Council</h5>
          </div>
        </Container>
      </section>
    </>
  );
};

export default GoverningCouncil;
