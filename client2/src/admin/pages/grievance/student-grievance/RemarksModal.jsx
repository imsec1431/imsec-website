import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const RemarksModal = ({
  show,
  handleClose,
  complaint,
  handleSave,
}) => {
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    if (complaint) {
      setRemarks(complaint.remarks || "");
    }
  }, [complaint]);

  const onSubmit = () => {
    handleSave(remarks);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>

      <Modal.Header closeButton>
        <Modal.Title>Add Remarks</Modal.Title>
      </Modal.Header>

      <Modal.Body>

        <Form.Group>

          <Form.Label>Remarks</Form.Label>

          <Form.Control
            as="textarea"
            rows={5}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter Remarks"
          />

        </Form.Group>

      </Modal.Body>

      <Modal.Footer>

        <Button
          variant="secondary"
          onClick={handleClose}
        >
          Cancel
        </Button>

        <Button
          variant="primary"
          onClick={onSubmit}
        >
          Save Remarks
        </Button>

      </Modal.Footer>

    </Modal>
  );
};

export default RemarksModal;