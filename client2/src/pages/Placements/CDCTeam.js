import React, { useEffect, useState, useMemo } from "react";
import "./CDCTeam.css";

import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Breadcrumb,
  Modal,
  Spinner,
} from "react-bootstrap";

import {
  FaEnvelope,
  FaPhoneAlt,
  FaLinkedin,
  FaArrowRight,
  FaUsers,
  FaInfoCircle,
  FaUser,
  FaGraduationCap,
  FaBriefcase,
} from "react-icons/fa";

import { fetchCDCTeam } from "../../services/cdcTeamService";

/* =====================================================
   ROLE PRIORITY ORDER & LABELS
===================================================== */

const ROLE_PRIORITY = {
  "Sr. Head - CDC": 1,
  "Head - CDC": 2,
  "Sr. Manager": 3,
  Manager: 4,
  "placement-officer": 5,
  other: 6,
};

const getRoleLabel = (role) => {
  switch (role) {
    case "Sr. Head - CDC":
      return "Sr. Head - CDC";
    case "Head - CDC":
      return "Head - CDC";
    case "Sr. Manager":
      return "Sr. Manager";
    case "Manager":
      return "Manager";
    case "placement-officer":
      return "Placement Officer";
    case "other":
      return "Other";
    default:
      return "Team Member";
  }
};

/* =====================================================
   TEAM CARD
===================================================== */

const TeamCard = ({ member, onViewProfile }) => {
  return (
    <Card className="team-card">
      <div className="team-image">
        {member.image ? (
          <img src={member.image} alt={member.imageAlt || member.name} />
        ) : (
          <div className="team-no-image">
            <FaUsers />
          </div>
        )}
      </div>

      <Card.Body>
        <h4>{member.name}</h4>

        <div className="team-designation">
          <FaUser />
          <span>{member.designation || getRoleLabel(member.role)}</span>
        </div>

        {member.email && (
          <div className="team-email">
            <FaEnvelope />
            <span>{member.email}</span>
          </div>
        )}

        {member.phone && (
          <div className="team-phone">
            <FaPhoneAlt />
            <span>{member.phone}</span>
          </div>
        )}

        <div className="team-buttons">
          {member.linkedin && (
            <Button
              className="linkedin-btn"
              href={member.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label={`LinkedIn profile of ${member.name}`}
            >
              <FaLinkedin />
            </Button>
          )}

          <Button className="profile-btn" onClick={() => onViewProfile(member)}>
            View Profile
            <FaArrowRight className="ms-2" />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

/* =====================================================
   MAIN COMPONENT
===================================================== */

function CDCTeam() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadTeam = async () => {
      try {
        setLoading(true);
        setError("");
        const result = await fetchCDCTeam();
        setMembers(result?.data || []);
      } catch (err) {
        console.error("CDC Team Public Error:", err);
        setError(err?.message || "Unable to load CDC Team.");
      } finally {
        setLoading(false);
      }
    };

    loadTeam();
  }, []);

  /* ===================================================
     SORT MEMBERS BY ROLE PRIORITY
  =================================================== */
  const sortedMembers = useMemo(() => {
    return [...members].sort((a, b) => {
      const priorityA = ROLE_PRIORITY[a.role] || 999;
      const priorityB = ROLE_PRIORITY[b.role] || 999;

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      // If same role, optionally sort alphabetically by name
      return (a.name || "").localeCompare(b.name || "");
    });
  }, [members]);

  const handleViewProfile = (member) => {
    setSelectedMember(member);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMember(null);
  };

  if (loading) {
    return (
      <main className="cdc-team-page">
        <section className="cdc-team-status">
          <Spinner animation="border" variant="primary" />
          <h3>Loading CDC Team...</h3>
          <p>Please wait while we load the team information.</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="cdc-team-page">
        <section className="cdc-team-status">
          <FaInfoCircle />
          <h3>Unable to load CDC Team</h3>
          <p>{error}</p>
        </section>
      </main>
    );
  }

  if (!sortedMembers.length) {
    return (
      <main className="cdc-team-page">
        <section className="cdc-team-status">
          <FaUsers />
          <h3>CDC Team Information</h3>
          <p>Team information is currently unavailable.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="cdc-team-page">
      {/* HERO */}
      <section className="cdc-hero">
        <Container>
          <Breadcrumb className="cdc-breadcrumb" />
          <div className="hero-content">
            <span></span>
            <h1>Corporate Development Cell</h1>
            <p style={{ color: "white" }}>
              Empowering Students through Training, Corporate Collaboration,
              Internships, Skill Development and Campus Placements.
            </p>
          </div>
        </Container>
      </section>

      {/* PRIORITY-ORDERED HORIZONTAL ROW */}
      <section className="team-section" aria-labelledby="cdc-team-heading">
        <Container>
          <div className="section-title">
            <span>Corporate Development Cell</span>
            <h2 id="cdc-team-heading">CDC Members</h2>
          </div>

          <div className="team-horizontal-wrapper">
            <Row className="team-horizontal-row">
              {sortedMembers.map((member) => (
                <Col className="team-column" key={member._id || member.id}>
                  <TeamCard member={member} onViewProfile={handleViewProfile} />
                </Col>
              ))}
            </Row>
          </div>
        </Container>
      </section>

      {/* PROFILE MODAL */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        size="lg"
        centered
        scrollable
      >
        {selectedMember && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedMember.name}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Row className="g-4">
                <Col md={4} className="text-center">
                  {selectedMember.image ? (
                    <img
                      src={selectedMember.image}
                      alt={selectedMember.imageAlt || selectedMember.name}
                      className="cdc-profile-modal-image"
                    />
                  ) : (
                    <div className="cdc-profile-modal-no-image">
                      <FaUsers />
                    </div>
                  )}
                </Col>

                <Col md={8}>
                  <span className="cdc-modal-role">
                    {getRoleLabel(selectedMember.role)}
                  </span>
                  <h3>{selectedMember.name}</h3>
                  <h5>{selectedMember.designation}</h5>

                  {selectedMember.qualification && (
                    <p>
                      <FaGraduationCap />
                      <strong>Qualification:</strong>{" "}
                      {selectedMember.qualification}
                    </p>
                  )}

                  {selectedMember.experience && (
                    <p>
                      <FaBriefcase />
                      <strong>Experience:</strong> {selectedMember.experience}
                    </p>
                  )}

                  {selectedMember.email && (
                    <p>
                      <FaEnvelope />
                      <strong>Email:</strong> {selectedMember.email}
                    </p>
                  )}

                  {selectedMember.phone && (
                    <p>
                      <FaPhoneAlt />
                      <strong>Phone:</strong> {selectedMember.phone}
                    </p>
                  )}
                </Col>
              </Row>

              {selectedMember.message && (
                <div className="cdc-modal-section">
                  <h5>Message</h5>
                  <p>{selectedMember.message}</p>
                </div>
              )}

              {selectedMember.description && (
                <div className="cdc-modal-section">
                  <h5>About</h5>
                  <p>{selectedMember.description}</p>
                </div>
              )}
            </Modal.Body>

            <Modal.Footer>
              {selectedMember.linkedin && (
                <Button
                  variant="outline-primary"
                  href={selectedMember.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaLinkedin /> LinkedIn
                </Button>
              )}
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </main>
  );
}

export default CDCTeam;
