import React from "react";
import { Modal, Button } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";

const DeleteModal = ({
  show,
  handleClose,
  handleDelete,
  loading,
  title = "Delete Record",
  message = "Are you sure you want to delete this record? This action cannot be undone.",
}) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-danger">
          <FaTrashAlt className="me-2" />
          {title}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>

        <Button
          variant="danger"
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;