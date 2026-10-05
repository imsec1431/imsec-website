import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Badge,
  Alert,
  Spinner,
} from "react-bootstrap";

import {
  getCommitteeMembers,
  addCommitteeMember,
  updateCommitteeMember,
  deleteCommitteeMember,
} from "../../../services/internalGrievanceCommitteeService";
// import "./internal-grievance-committee.css";

const InternalGrievanceCommittee = () => {
  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingMember, setEditingMember] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    role: "",
    email: "",
    priority: 1,
    status: "Active",
  });

  // ==========================================
  // FETCH MEMBERS
  // ==========================================

  const fetchMembers = async () => {
    try {
      setLoading(true);

      const res = await getCommitteeMembers();

      setMembers(res.data.data || []);

      setError("");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load committee members."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD
  // ==========================================

  useEffect(() => {
    fetchMembers();
  }, []);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ==========================================
  // OPEN ADD
  // ==========================================

  const handleAdd = () => {
    setEditingMember(null);

    setFormData({
      name: "",
      designation: "",
      role: "",
      email: "",
      priority: 1,
      status: "Active",
    });

    setError("");
    setSuccess("");

    setShowModal(true);
  };

  // ==========================================
  // OPEN EDIT
  // ==========================================

  const handleEdit = (member) => {
    setEditingMember(member);

    setFormData({
      name: member.name || "",
      designation: member.designation || "",
      role: member.role || "",
      email: member.email || "",
      priority: member.priority || 1,
      status: member.status || "Active",
    });

    setError("");
    setSuccess("");

    setShowModal(true);
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.designation.trim() ||
      !formData.role.trim() ||
      !formData.email.trim()
    ) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      if (editingMember) {
        await updateCommitteeMember(
          editingMember._id,
          {
            ...formData,
            priority: Number(formData.priority),
          }
        );

        setSuccess(
          "Committee member updated successfully."
        );
      } else {
        await addCommitteeMember({
          ...formData,
          priority: Number(formData.priority),
        });

        setSuccess(
          "Committee member added successfully."
        );
      }

      setShowModal(false);

      await fetchMembers();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Something went wrong."
      );
    }
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this committee member?"
    );

    if (!confirmDelete) return;

    try {
      await deleteCommitteeMember(id);

      setSuccess(
        "Committee member deleted successfully."
      );

      fetchMembers();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to delete committee member."
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
          Loading Committee Members...
        </p>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="container-fluid">

      {/* HEADER */}

      <div className="page-header d-flex justify-content-between align-items-center mb-4">

        <div>
          <h3>Internal Grievance Committee</h3>

          <p>
            Manage Internal Grievance Committee Members
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleAdd}
        >
          + Add Committee Member
        </Button>

      </div>

      {/* ALERTS */}

      {error && (
        <Alert
          variant="danger"
          dismissible
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          variant="success"
          dismissible
          onClose={() => setSuccess("")}
        >
          {success}
        </Alert>
      )}

      {/* TABLE */}

      <div className="table-responsive">

        <Table
          bordered
          hover
          className="align-middle"
        >

          <thead>

            <tr>
              <th>Priority</th>
              <th>S.N.</th>
              <th>Name</th>
              <th>Designation</th>
              <th>Role</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>

          </thead>

          <tbody>

            {members.length === 0 ? (

              <tr>

                <td
                  colSpan="8"
                  className="text-center py-4"
                >
                  No Committee Members Found
                </td>

              </tr>

            ) : (

              members.map((member, index) => (

                <tr key={member._id}>

                  <td>
                    <strong>
                      {member.priority}
                    </strong>
                  </td>

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
                    {member.role}
                  </td>

                  <td>
                    {member.email}
                  </td>

                  <td>

                    <Badge
                      bg={
                        member.status === "Active"
                          ? "success"
                          : "secondary"
                      }
                    >
                      {member.status}
                    </Badge>

                  </td>

                  <td>

                    <div className="d-flex gap-2">

                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() =>
                          handleEdit(member)
                        }
                      >
                        Edit
                      </Button>

                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() =>
                          handleDelete(member._id)
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
          ADD / EDIT MODAL
      ========================================== */}

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
      >

        <Modal.Header closeButton>

          <Modal.Title>
            {editingMember
              ? "Edit Committee Member"
              : "Add Committee Member"}
          </Modal.Title>

        </Modal.Header>

        <Form onSubmit={handleSubmit}>

          <Modal.Body>

            <Form.Group className="mb-3">

              <Form.Label>
                Name
              </Form.Label>

              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter committee member name"
              />

            </Form.Group>

            <Form.Group className="mb-3">

              <Form.Label>
                Designation
              </Form.Label>

              <Form.Control
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="e.g. Assistant Professor"
              />

            </Form.Group>

            <Form.Group className="mb-3">

              <Form.Label>
                Role
              </Form.Label>

              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleChange}
              >

                <option value="">
                  Select Role
                </option>

                <option value="Chairperson">
                  Chairperson
                </option>

                <option value="Member Secretary">
                  Member Secretary
                </option>

                <option value="Member">
                  Member
                </option>

              </Form.Select>

            </Form.Group>

            <Form.Group className="mb-3">

              <Form.Label>
                Email
              </Form.Label>

              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter official email"
              />

            </Form.Group>

            <Form.Group className="mb-3">

              <Form.Label>
                Priority
              </Form.Label>

              <Form.Control
                type="number"
                name="priority"
                min="1"
                value={formData.priority}
                onChange={handleChange}
              />

              <Form.Text className="text-muted">
                Lower number means higher priority.
              </Form.Text>

            </Form.Group>

            <Form.Group className="mb-3">

              <Form.Label>
                Status
              </Form.Label>

              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>

              </Form.Select>

            </Form.Group>

          </Modal.Body>

          <Modal.Footer>

            <Button
              variant="secondary"
              onClick={() =>
                setShowModal(false)
              }
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              type="submit"
            >
              {editingMember
                ? "Update Member"
                : "Add Member"}
            </Button>

          </Modal.Footer>

        </Form>

      </Modal>

    </div>
  );
};

export default InternalGrievanceCommittee;