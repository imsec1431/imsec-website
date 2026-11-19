import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Table,
  Spinner,
  Alert,
} from "react-bootstrap";

import {
  FaUsers,
  FaBalanceScale,
  FaClipboardCheck,
  FaPhone,
} from "react-icons/fa";

import { getCommitteeMembers } from "../../services/internalGrievanceCommitteeService";

import "./InternalGrievanceCommittee.css";

/* ==========================================
   RESPONSIBILITIES
========================================== */

const responsibilities = [
  {
    icon: <FaBalanceScale />,
    title: "Fair Grievance Redressal",
    description:
      "Ensure that grievances are handled fairly, transparently and impartially.",
  },
  {
    icon: <FaClipboardCheck />,
    title: "Complaint Review",
    description:
      "Review grievances received from students and employees and coordinate appropriate action.",
  },
  {
    icon: <FaUsers />,
    title: "Confidentiality",
    description:
      "Maintain confidentiality and protect the privacy of individuals involved in grievance proceedings.",
  },
  {
    icon: <FaClipboardCheck />,
    title: "Committee Proceedings",
    description:
      "Conduct meetings, review complaints and recommend appropriate measures to the concerned authority.",
  },
];

/* ==========================================
   COMPONENT
========================================== */

const InternalGrievanceCommittee = () => {
  const [committeeMembers, setCommitteeMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ==========================================
     FETCH COMMITTEE MEMBERS
  ========================================== */

  const fetchCommitteeMembers = async () => {
    try {
      setLoading(true);

      const res = await getCommitteeMembers();
      const allMembers = res.data.data || [];

      // Show only ACTIVE members
      const activeMembers = allMembers.filter(
        (member) => member.status === "Active",
      );

      // Priority wise
      activeMembers.sort(
        (a, b) => Number(a.priority) - Number(b.priority),
      );

      setCommitteeMembers(activeMembers);
      setError("");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load Internal Grievance Committee.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================
     LOAD DATA
  ========================================== */

  useEffect(() => {
    fetchCommitteeMembers();
  }, []);

  return (
    <div className="igc-page">
      {/* =========================================
          HERO
      ========================================= */}

      <section className="igc-hero">
        <div className="igc-hero-container">
          <div className="igc-hero-content">
            <span className="igc-hero-tag">INSTITUTIONAL COMMITTEE</span>

            <h1>Internal Grievance Committee</h1>

            <p>
              Ensuring a fair, transparent and timely grievance redressal
              mechanism at IMSEC.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================
          ABOUT COMMITTEE
      ========================================= */}

      <section className="igc-about">
        <div className="igc-container">
          <div className="igc-section-heading">
            <span>GRIEVANCE REDRESSAL</span>

            <h2>Internal Grievance Committee</h2>

            <p>
              The Internal Grievance Committee provides an institutional
              mechanism for addressing grievances and ensuring a supportive and
              respectful environment.
            </p>
          </div>

          <Row className="align-items-center g-4">
            <Col lg={7}>
              <div className="igc-about-content">
                <h3>About the Committee</h3>

                <p>
                  The Internal Grievance Committee is responsible for receiving,
                  reviewing and addressing grievances raised within the
                  institution.
                </p>

                <p>
                  The committee works to ensure that grievances are considered
                  objectively and that appropriate action is recommended to the
                  concerned authority.
                </p>

                <p>
                  All complaints are handled with due confidentiality and
                  sensitivity to ensure an impartial and supportive atmosphere.
                </p>
              </div>
            </Col>

            <Col lg={5}>
              <div className="igc-highlight">
                <div className="igc-highlight-icon">
                  <FaUsers />
                </div>

                <h4>Fair &amp; Transparent Process</h4>

                <p>
                  Every grievance is considered through a structured, objective,
                  and timely redressal process.
                </p>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* =========================================
          COMMITTEE MEMBERS
      ========================================= */}

      <section className="igc-members">
        <div className="igc-container">
          <div className="igc-section-heading">
            <span>MEMBERSHIP</span>

            <h2>Committee Members</h2>

            <p>
              Members responsible for grievance redressal and committee
              proceedings.
            </p>
          </div>

          {/* ERROR */}

          {error && (
            <Alert variant="danger" className="text-center">
              {error}
            </Alert>
          )}

          {/* LOADING */}

          {loading ? (
            <div className="igc-loading-state">
              <Spinner animation="border" />
              <p className="mt-3">Loading Committee Members...</p>
            </div>
          ) : (
            <>
              {committeeMembers.length === 0 ? (
                <div className="igc-empty-state">
                  <p>No active committee members available at the moment.</p>
                </div>
              ) : (
                <div className="table-responsive igc-table-wrap">
                  <Table bordered hover className="igc-member-table">
                    <thead>
                      <tr>
                        <th style={{ width: "80px" }}>S.N.</th>
                        <th>Name</th>
                        <th>Designation</th>
                        <th style={{ width: "220px" }}>Role</th>
                      </tr>
                    </thead>

                    <tbody>
                      {committeeMembers.map((member, index) => (
                        <tr key={member._id}>
                          <td>{index + 1}</td>

                          <td>
                            <strong>{member.name}</strong>
                          </td>

                          <td>{member.designation}</td>

                          <td>
                            <span className="igc-role">{member.role}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* =========================================
          RESPONSIBILITIES
      ========================================= */}

      <section className="igc-responsibilities">
        <div className="igc-container">
          <div className="igc-section-heading">
            <span>WHAT WE DO</span>

            <h2>Committee Responsibilities</h2>
          </div>

          <Row className="g-4">
            {responsibilities.map((item, index) => (
              <Col lg={3} md={6} key={index}>
                <div className="igc-card">
                  <div className="igc-card-icon">{item.icon}</div>

                  <h5>{item.title}</h5>

                  <p>{item.description}</p>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* =========================================
          CONTACT
      ========================================= */}

      <section className="igc-contact">
        <div className="igc-container">
          <div className="igc-contact-box">
            <Row className="align-items-center g-3">
              <Col lg={8}>
                <h2>Need to Raise a Grievance?</h2>

                <p>
                  Students and employees can submit their grievance through the
                  appropriate grievance portal for swift resolution.
                </p>
              </Col>

              <Col lg={4}>
                <div className="igc-contact-info">
                  <p>
                    <FaPhone />
                    Contact the concerned authority
                  </p>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InternalGrievanceCommittee;
