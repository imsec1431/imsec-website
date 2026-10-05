import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaLinkedinIn } from "react-icons/fa6";

import "./executivecouncil.css";
import { getMembers } from "../../services/executiveCouncilService";

const ExecutiveCouncil = () => {
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
      <section className="executive-hero">
        <Container>
          <div className="hero-content">
            <h1>Executive Council</h1>

            <p style={{ color: "white" }}>
              Home
              <span>/</span>
              About
              <span>/</span>
              Executive Council
            </p>
          </div>
        </Container>
      </section>

      {/* ================= Introduction ================= */}
      <section className="executive-intro py-5">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={12}>
              <h6 className="section-tag" style={{ color: "black" }}>
                LEADERSHIP TEAM
              </h6>

              <h2 className="section-title">
                Executive
                <span> Council</span>
              </h2>

              <p>
                The Executive Council of IMS Engineering College comprises
                experienced academicians and administrators committed to
                academic excellence, innovation, institutional growth and
                student success.
              </p>

              <p>
                Their collective vision and leadership guide the institution
                towards continuous improvement, quality education and global
                recognition.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= Members ================= */}
      <section className="executive-members py-5">
        <Container fluid="lg">
          <div className="text-center mb-5">
            <h2 className="section-title">
              Meet Our
              <span> Executive Council</span>
            </h2>
          </div>

          <Row className="g-4">
            {members.map((member) => (
              /* lg={3} creates 4 cards per row on desktop (12 / 3 = 4) */
              <Col lg={3} md={6} sm={12} key={member._id}>
                <div className="member-card h-100">
                  <div className="member-image-wrapper">
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="member-image"
                    />
                  </div>

                  <div className="member-body">
                    <h4>{member.name}</h4>

                    <span>{member.designation}</span>

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

      {/* ================= Leadership Quote ================= */}
      <section className="leadership-quote">
        <Container>
          <div className="quote-box">
            <span className="quote-icon">"</span>

            <h2 style={{ color: "white" }}>
              Strong leadership inspires innovation, builds character and
              creates opportunities for every student to achieve excellence.
            </h2>

            <h5>Executive Council</h5>
          </div>
        </Container>
      </section>
    </>
  );
};

export default ExecutiveCouncil;
