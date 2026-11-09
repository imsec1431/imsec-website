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
          <div className="hero-content text-center">
            <h1 className="text-center" style={{ textAlign: "center" }}>
              Governing Body
            </h1>

            <p
              className="text-center"
              style={{
                color: "white",
                margin: "0 auto",
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Home
              <span style={{ color: "#fdb913", margin: "0 8px" }}>/</span>
              About
              <span style={{ color: "#fdb913", margin: "0 8px" }}>/</span>
              Governing Body
            </p>
          </div>
        </Container>
      </section>

      {/* ================= Introduction ================= */}
      <section className="governing-intro">
        <Container>
          <Row className="align-items-center g-4">
            <Col lg={12}>
              <div className="text-center mb-4">
                <h2 className="section-title text-center">
                  Governing Body
                  <span> </span>
                </h2>
              </div>

              <p>
                The Governing Body provides strategic direction, policy
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
      <section className="governing-members">
        <Container fluid="lg">
          <div className="text-center mb-4">
            <h2 className="section-title">
              Governing Council Members
              <span> </span>
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
      <section className="governing-responsibilities">
        <Container fluid="lg">
          <div className="text-center mb-4">
            <h2 className="section-title">
              Roles & Responsibilities<span> </span>
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

            <h5>Governing Body</h5>
          </div>
        </Container>
      </section>
    </>
  );
};

export default GoverningCouncil;
