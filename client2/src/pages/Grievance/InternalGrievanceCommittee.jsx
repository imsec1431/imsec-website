import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Spinner,
  Alert,
} from "react-bootstrap";

import {
  FaUsers,
  FaBalanceScale,
  FaClipboardCheck,
  FaEnvelope,
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
        (member) => member.status === "Active"
      );

      // Priority wise
      activeMembers.sort(
        (a, b) => Number(a.priority) - Number(b.priority)
      );

      setCommitteeMembers(activeMembers);

      setError("");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load Internal Grievance Committee."
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
    <>
      {/* =========================================
          HERO
      ========================================= */}

      <section className="igc-hero">
        <Container>
          <div className="igc-hero-content">
            <h1>Internal Grievance Committee</h1>

            <p style={{color:"white"}}>
              Ensuring a fair, transparent and timely grievance
              redressal mechanism at IMSEC.
            </p>
          </div>
        </Container>
      </section>

      {/* =========================================
          ABOUT COMMITTEE
      ========================================= */}

      <section className="igc-about py-5">
        <Container>

          <div className="section-heading text-center mb-5">

            <h6>GRIEVANCE REDRESSAL</h6>

            <h2>Internal Grievance Committee</h2>

            <p>
              The Internal Grievance Committee provides an
              institutional mechanism for addressing grievances
              and ensuring a supportive and respectful
              environment.
            </p>

          </div>

          <Row className="align-items-center">

            <Col lg={6}>

              <div className="igc-about-content">

                <h3>
                  About the Committee
                </h3>

                <p>
                  The Internal Grievance Committee is responsible
                  for receiving, reviewing and addressing grievances
                  raised within the institution.
                </p>

                <p>
                  The committee works to ensure that grievances are
                  considered objectively and that appropriate action
                  is recommended to the concerned authority.
                </p>

                <p>
                  All complaints are handled with due
                  confidentiality and sensitivity.
                </p>

              </div>

            </Col>

            <Col lg={6}>

              <div className="igc-highlight">

                <div className="igc-highlight-icon">
                  <FaUsers />
                </div>

                <h4>
                  Fair & Transparent Process
                </h4>

                <p>
                  Every grievance is considered through a structured
                  and transparent redressal process.
                </p>

              </div>

            </Col>

          </Row>

        </Container>
      </section>

      {/* =========================================
          COMMITTEE MEMBERS
      ========================================= */}

      <section className="igc-members py-5">

        <Container>

          <div className="section-heading text-center mb-5">

            <h6>COMMITTEE</h6>

            <h2>Committee Members</h2>

            <p>
              Members responsible for grievance redressal
              and committee proceedings.
            </p>

          </div>

          {/* ERROR */}

          {error && (
            <Alert
              variant="danger"
              className="text-center"
            >
              {error}
            </Alert>
          )}

          {/* LOADING */}

          {loading ? (

            <div className="text-center py-5">

              <Spinner animation="border" />

              <p className="mt-3">
                Loading Committee Members...
              </p>

            </div>

          ) : (

            <>
              {committeeMembers.length === 0 ? (

                <Alert
                  variant="info"
                  className="text-center"
                >
                  No active committee members available.
                </Alert>

              ) : (

                <div className="table-responsive">

                  <Table
                    bordered
                    hover
                    className="igc-member-table"
                  >

                    <thead>

                      <tr>
                        <th>S.N.</th>
                        <th>Name</th>
                        <th>Designation</th>
                        <th>Role</th>
                      </tr>

                    </thead>

                    <tbody>

                      {committeeMembers.map(
                        (member, index) => (

                          <tr key={member._id}>

                            <td>
                              {index + 1}
                            </td>

                            <td>
                              <strong>
                                {member.name}
                              </strong>
                            </td>

                            <td>
                              {member.designation}
                            </td>

                            <td>

                              <span className="igc-role">
                                {member.role}
                              </span>

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </Table>

                </div>

              )}
            </>

          )}

        </Container>

      </section>

      {/* =========================================
          RESPONSIBILITIES
      ========================================= */}

      <section className="igc-responsibilities py-5">

        <Container>

          <div className="section-heading text-center mb-5">

            <h6>WHAT WE DO</h6>

            <h2>Committee Responsibilities</h2>

          </div>

          <Row className="g-4">

            {responsibilities.map(
              (item, index) => (

                <Col
                  lg={3}
                  md={6}
                  key={index}
                >

                  <Card className="igc-card">

                    <div className="igc-card-icon">
                      {item.icon}
                    </div>

                    <Card.Body>

                      <h5>
                        {item.title}
                      </h5>

                      <p>
                        {item.description}
                      </p>

                    </Card.Body>

                  </Card>

                </Col>

              )
            )}

          </Row>

        </Container>

      </section>

      {/* =========================================
          CONTACT
      ========================================= */}

      <section className="igc-contact py-5">

        <Container>

          <Row className="align-items-center">

            <Col lg={8}>

              <h2>
                Need to Raise a Grievance?
              </h2>

              <p>
                Students and employees can submit their grievance
                through the appropriate grievance portal.
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

        </Container>

      </section>
    </>
  );
};

export default InternalGrievanceCommittee;