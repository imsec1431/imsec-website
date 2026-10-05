import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row, Spinner, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  FaAward,
  FaCheckCircle,
  FaEdit,
  FaPlus,
  FaTrash,
  FaTimesCircle,
} from "react-icons/fa";

import {
  getAdminApprovals,
  createApproval,
  updateApproval,
  publishApproval,
  unpublishApproval,
  deleteApproval,
} from "../../../services/approvalAdminService";
// } from "../../services/approvalAdminService";

import "./Approval.css";

const Approval = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isPublished: false,
    displayOrder: 0,
  });

  const fetchApprovals = async () => {
    try {
      setLoading(true);

      const response = await getAdminApprovals();

      setApprovals(response.data || []);
    } catch (error) {
      console.error("Failed to fetch approvals:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch approvals.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setEditingId(null);

    setFormData({
      title: "",
      description: "",
      isPublished: false,
      displayOrder: 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter the approval title.");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please enter the approval description.");
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        await updateApproval(editingId, {
          ...formData,
          displayOrder: Number(formData.displayOrder),
        });

        toast.success("Approval updated successfully.");
      } else {
        await createApproval({
          ...formData,
          displayOrder: Number(formData.displayOrder),
        });

        toast.success("Approval created successfully.");
      }

      resetForm();
      await fetchApprovals();
    } catch (error) {
      console.error("Save approval error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to save approval.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (approval) => {
    setEditingId(approval._id);

    setFormData({
      title: approval.title || "",
      description: approval.description || "",
      isPublished: approval.isPublished || false,
      displayOrder: approval.displayOrder ?? 0,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handlePublishToggle = async (approval) => {
    try {
      setActionLoading(approval._id);

      if (approval.isPublished) {
        await unpublishApproval(approval._id);
        toast.success("Approval unpublished successfully.");
      } else {
        await publishApproval(approval._id);
        toast.success("Approval published successfully.");
      }

      await fetchApprovals();
    } catch (error) {
      console.error("Publish toggle error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update approval status.",
      );
    } finally {
      setActionLoading("");
    }
  };

  const handleDelete = async (approval) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${approval.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(approval._id);

      await deleteApproval(approval._id);

      toast.success("Approval deleted successfully.");

      if (editingId === approval._id) {
        resetForm();
      }

      await fetchApprovals();
    } catch (error) {
      console.error("Delete approval error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete approval.",
      );
    } finally {
      setActionLoading("");
    }
  };

  return (
    <div className="approval-admin-page">
      {/* Header */}
      <div className="approval-admin-header">
        <div>
          <div className="approval-header-label">
            <FaAward />
            ACCREDITATION & RECOGNITION
          </div>

          <h1>Approvals</h1>

          <p>
            Manage institutional approvals, accreditations and recognitions
            displayed on the IMSEC website.
          </p>
        </div>

        <div className="approval-header-stat">
          <span>{approvals.length}</span>
          <small>Total Records</small>
        </div>
      </div>

      <Row className="g-4">
        {/* Form */}
        <Col lg={5}>
          <Card className="approval-form-card">
            <Card.Body>
              <div className="approval-section-title">
                <div className="approval-section-icon">
                  <FaPlus />
                </div>

                <div>
                  <h3>{editingId ? "Edit Approval" : "Add Approval"}</h3>

                  <p>
                    {editingId
                      ? "Update the recognition details."
                      : "Add a new institutional recognition."}
                  </p>
                </div>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="approval-field">
                  <Form.Label>Title</Form.Label>

                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. NAAC A+ Rated"
                    maxLength={250}
                    disabled={saving}
                  />

                  <div className="approval-field-hint">
                    The main approval or recognition title.
                  </div>
                </Form.Group>

                <Form.Group className="approval-field">
                  <Form.Label>Description</Form.Label>

                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="e.g. Institutional Excellence Recognition"
                    maxLength={1000}
                    disabled={saving}
                  />

                  <div className="approval-field-hint">
                    A short description shown below the title.
                  </div>
                </Form.Group>

                <Form.Group className="approval-field">
                  <Form.Label>Display Order</Form.Label>

                  <Form.Control
                    type="number"
                    name="displayOrder"
                    value={formData.displayOrder}
                    onChange={handleChange}
                    min="0"
                    disabled={saving}
                  />

                  <div className="approval-field-hint">
                    Lower number = higher priority.
                  </div>
                </Form.Group>

                <div className="approval-publish-box">
                  <Form.Check
                    type="switch"
                    id="approval-published"
                    name="isPublished"
                    label="Publish on website"
                    checked={formData.isPublished}
                    onChange={handleChange}
                    disabled={saving}
                  />

                  <span>
                    Published approvals will be visible on the public website.
                  </span>
                </div>

                <div className="approval-form-actions">
                  <Button
                    type="submit"
                    className="approval-save-btn"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Spinner animation="border" size="sm" />
                        Saving...
                      </>
                    ) : (
                      <>
                        {editingId ? <FaEdit /> : <FaPlus />}

                        {editingId ? "Update Approval" : "Add Approval"}
                      </>
                    )}
                  </Button>

                  {editingId && (
                    <Button
                      type="button"
                      className="approval-cancel-btn"
                      onClick={resetForm}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* List */}
        <Col lg={7}>
          <Card className="approval-list-card">
            <Card.Body>
              <div className="approval-list-header">
                <div>
                  <h3>Recognition Records</h3>
                  <p>Manage all approvals and recognitions.</p>
                </div>

                <div className="approval-count">{approvals.length}</div>
              </div>

              {loading ? (
                <div className="approval-loading">
                  <Spinner animation="border" />
                  <p>Loading approvals...</p>
                </div>
              ) : approvals.length === 0 ? (
                <div className="approval-empty">
                  <FaAward />

                  <h4>No approvals found</h4>

                  <p>Add your first institutional approval or recognition.</p>
                </div>
              ) : (
                <div className="approval-table-wrapper">
                  <Table responsive className="approval-table">
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Recognition</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {approvals.map((approval) => (
                        <tr key={approval._id}>
                          <td>
                            <div className="approval-order">
                              {approval.displayOrder}
                            </div>
                          </td>

                          <td>
                            <div className="approval-record">
                              <strong>{approval.title}</strong>

                              <span>{approval.description}</span>
                            </div>
                          </td>

                          <td>
                            {approval.isPublished ? (
                              <span className="approval-status published">
                                <FaCheckCircle />
                                Published
                              </span>
                            ) : (
                              <span className="approval-status unpublished">
                                <FaTimesCircle />
                                Draft
                              </span>
                            )}
                          </td>

                          <td>
                            <div className="approval-actions">
                              <Button
                                className="approval-action edit"
                                title="Edit"
                                onClick={() => handleEdit(approval)}
                                disabled={actionLoading === approval._id}
                              >
                                <FaEdit />
                              </Button>

                              <Button
                                className={`approval-action ${
                                  approval.isPublished ? "unpublish" : "publish"
                                }`}
                                title={
                                  approval.isPublished ? "Unpublish" : "Publish"
                                }
                                onClick={() => handlePublishToggle(approval)}
                                disabled={actionLoading === approval._id}
                              >
                                {actionLoading === approval._id ? (
                                  <Spinner animation="border" size="sm" />
                                ) : approval.isPublished ? (
                                  <FaTimesCircle />
                                ) : (
                                  <FaCheckCircle />
                                )}
                              </Button>

                              <Button
                                className="approval-action delete"
                                title="Delete"
                                onClick={() => handleDelete(approval)}
                                disabled={actionLoading === approval._id}
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Approval;
