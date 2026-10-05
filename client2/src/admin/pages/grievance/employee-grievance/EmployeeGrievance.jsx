import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";

import {
  getEmployeeGrievances,
  updateEmployeeGrievance,
  deleteEmployeeGrievance,
} from "../../../services/employeeGrievanceService";

const EmployeeGrievance = () => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedGrievance, setSelectedGrievance] = useState(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [showRemarksModal, setShowRemarksModal] = useState(false);

  const [remarks, setRemarks] = useState("");

  // ==========================================
  // GET ALL EMPLOYEE GRIEVANCES
  // ==========================================

  const fetchGrievances = async () => {
    try {
      setLoading(true);

      const res = await getEmployeeGrievances();

      setGrievances(res.data.data || []);
      setError("");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load employee grievances."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {
    fetchGrievances();
  }, []);

  // ==========================================
  // VIEW
  // ==========================================

  const handleView = (grievance) => {
    setSelectedGrievance(grievance);
    setShowViewModal(true);
  };

  // ==========================================
  // MARK SOLVED
  // ==========================================

  const handleSolve = async (id) => {
    try {
      await updateEmployeeGrievance(id, {
        status: "Solved",
      });

      fetchGrievances();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to update grievance."
      );
    }
  };

  // ==========================================
  // OPEN REMARKS
  // ==========================================

  const handleOpenRemarks = (grievance) => {
    setSelectedGrievance(grievance);
    setRemarks(grievance.remarks || "");
    setShowRemarksModal(true);
  };

  // ==========================================
  // SAVE REMARKS
  // ==========================================

  const handleSaveRemarks = async () => {
    if (!selectedGrievance) return;

    try {
      await updateEmployeeGrievance(
        selectedGrievance._id,
        {
          remarks: remarks,
        }
      );

      setShowRemarksModal(false);
      setSelectedGrievance(null);
      setRemarks("");

      fetchGrievances();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to save remarks."
      );
    }
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this grievance?"
    );

    if (!confirmDelete) return;

    try {
      await deleteEmployeeGrievance(id);

      fetchGrievances();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to delete grievance."
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />

        <p className="mt-3">
          Loading Employee Grievances...
        </p>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="container-fluid">

      <div className="page-header mb-4">
        <h3>Employee Grievance</h3>

        <p>
          Manage employee complaints, status and remarks.
        </p>
      </div>

      {error && (
        <Alert
          variant="danger"
          dismissible
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      <div className="table-responsive">

        <Table
          bordered
          hover
          className="align-middle"
        >

          <thead>
            <tr>
              <th>S.N.</th>
              <th>Complaint ID</th>
              <th>Employee Name</th>
              <th>Employee Code</th>
              <th>Department</th>
              <th>Category</th>
              <th>Title</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {grievances.length === 0 ? (

              <tr>
                <td
                  colSpan="10"
                  className="text-center py-4"
                >
                  No Employee Grievances Found
                </td>
              </tr>

            ) : (

              grievances.map((grievance, index) => (

                <tr key={grievance._id}>

                  <td>
                    {index + 1}
                  </td>

                  <td>
                    <strong>
                      {grievance.complaintId}
                    </strong>
                  </td>

                  <td>
                    {grievance.employeeName}
                  </td>

                  <td>
                    {grievance.employeeCode}
                  </td>

                  <td>
                    {grievance.department}
                  </td>

                  <td>
                    {grievance.category}
                  </td>

                  <td>
                    {grievance.title}
                  </td>

                  <td>

                    <Badge
                      bg={
                        grievance.status === "Solved"
                          ? "success"
                          : "warning"
                      }
                    >
                      {grievance.status}
                    </Badge>

                  </td>

                  <td>
                    {new Date(
                      grievance.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td>

                    <div className="d-flex gap-2">

                      <Button
                        variant="info"
                        size="sm"
                        onClick={() =>
                          handleView(grievance)
                        }
                      >
                        View
                      </Button>

                      {grievance.status !== "Solved" && (

                        <Button
                          variant="success"
                          size="sm"
                          onClick={() =>
                            handleSolve(
                              grievance._id
                            )
                          }
                        >
                          Solve
                        </Button>

                      )}

                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() =>
                          handleOpenRemarks(
                            grievance
                          )
                        }
                      >
                        Remarks
                      </Button>

                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() =>
                          handleDelete(
                            grievance._id
                          )
                        }
                      >
                        Delete
                      </Button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </Table>

      </div>

      {/* ==========================================
          VIEW MODAL
      ========================================== */}

      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        size="lg"
        centered
      >

        <Modal.Header closeButton>
          <Modal.Title>
            Employee Grievance Details
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>

          {selectedGrievance && (

            <div>

              <p>
                <strong>Complaint ID:</strong>{" "}
                {selectedGrievance.complaintId}
              </p>

              <p>
                <strong>Employee Name:</strong>{" "}
                {selectedGrievance.employeeName}
              </p>

              <p>
                <strong>Employee Code:</strong>{" "}
                {selectedGrievance.employeeCode}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {selectedGrievance.email}
              </p>

              <p>
                <strong>Mobile:</strong>{" "}
                {selectedGrievance.mobile}
              </p>

              <p>
                <strong>Department:</strong>{" "}
                {selectedGrievance.department}
              </p>

              <p>
                <strong>Category:</strong>{" "}
                {selectedGrievance.category}
              </p>

              <p>
                <strong>Title:</strong>{" "}
                {selectedGrievance.title}
              </p>

              <strong>Description:</strong>

              <div className="bg-light p-3 rounded mt-2 mb-3">
                {selectedGrievance.description}
              </div>

              <p>
                <strong>Status:</strong>{" "}

                <Badge
                  bg={
                    selectedGrievance.status === "Solved"
                      ? "success"
                      : "warning"
                  }
                >
                  {selectedGrievance.status}
                </Badge>
              </p>

              <p>
                <strong>Remarks:</strong>{" "}
                {selectedGrievance.remarks ||
                  "No remarks added."}
              </p>

              {selectedGrievance.attachment && (

                <p>
                  <strong>Attachment:</strong>{" "}

                  <a
                    href={
                      selectedGrievance.attachment
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Attachment
                  </a>
                </p>

              )}

            </div>

          )}

        </Modal.Body>

        <Modal.Footer>

          <Button
            variant="secondary"
            onClick={() =>
              setShowViewModal(false)
            }
          >
            Close
          </Button>

        </Modal.Footer>

      </Modal>

      {/* ==========================================
          REMARKS MODAL
      ========================================== */}

      <Modal
        show={showRemarksModal}
        onHide={() => setShowRemarksModal(false)}
        centered
      >

        <Modal.Header closeButton>
          <Modal.Title>
            Admin Remarks
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <Form.Group>
            <Form.Label>
              Remarks
            </Form.Label>

            <Form.Control
              as="textarea"
              rows={5}
              value={remarks}
              onChange={(e) =>
                setRemarks(e.target.value)
              }
              placeholder="Enter admin remarks..."
            />
          </Form.Group>

        </Modal.Body>

        <Modal.Footer>

          <Button
            variant="secondary"
            onClick={() =>
              setShowRemarksModal(false)
            }
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={handleSaveRemarks}
          >
            Save Remarks
          </Button>

        </Modal.Footer>

      </Modal>

    </div>
  );
};

export default EmployeeGrievance;