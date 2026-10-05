import React from "react";
import { Modal, Button, Table } from "react-bootstrap";

const ViewComplaint = ({ show, handleClose, complaint }) => {
  if (!complaint) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>

      <Modal.Header closeButton>
        <Modal.Title>Student Complaint Details</Modal.Title>
      </Modal.Header>

      <Modal.Body>

        <Table bordered>

          <tbody>

            <tr>
              <th width="30%">Complaint ID</th>
              <td>{complaint.complaintId}</td>
            </tr>

            <tr>
              <th>Student Name</th>
              <td>{complaint.studentName}</td>
            </tr>

            <tr>
              <th>Enrollment Number</th>
              <td>{complaint.enrollmentNo}</td>
            </tr>

            <tr>
              <th>Email</th>
              <td>{complaint.email}</td>
            </tr>

            <tr>
              <th>Mobile</th>
              <td>{complaint.mobile}</td>
            </tr>

            <tr>
              <th>Department</th>
              <td>{complaint.department}</td>
            </tr>

            <tr>
              <th>Category</th>
              <td>{complaint.category}</td>
            </tr>

            <tr>
              <th>Title</th>
              <td>{complaint.title}</td>
            </tr>

            <tr>
              <th>Description</th>
              <td>{complaint.description}</td>
            </tr>

            <tr>
              <th>Status</th>
              <td>{complaint.status}</td>
            </tr>

            <tr>
              <th>Remarks</th>
              <td>{complaint.remarks || "-"}</td>
            </tr>

            <tr>
              <th>Attachment</th>
              <td>
                {complaint.attachment ? (
                  <a
                    href={complaint.attachment}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Attachment
                  </a>
                ) : (
                  "No Attachment"
                )}
              </td>
            </tr>

          </tbody>

        </Table>

      </Modal.Body>

      <Modal.Footer>

        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>

      </Modal.Footer>

    </Modal>
  );
};

export default ViewComplaint;