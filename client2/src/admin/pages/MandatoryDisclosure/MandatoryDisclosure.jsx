import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
  Badge,
} from "react-bootstrap";

import {
  getMandatoryDisclosureAdmin,
  createMandatoryDisclosure,
  updateMandatoryDisclosure,
  publishMandatoryDisclosure,
  unpublishMandatoryDisclosure,
  deleteMandatoryDisclosure,
} from "../../services/mandatoryDisclosureAdminService";

import "./MandatoryDisclosure.css";

const DEFAULT_FORM = {
  title: "",
  pdfLink: "",
  isPublished: true,
  displayOrder: 0,
};

const MandatoryDisclosure = () => {
  const [disclosures, setDisclosures] = useState([]);
  const [formData, setFormData] = useState(DEFAULT_FORM);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchDisclosures = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMandatoryDisclosureAdmin();

      setDisclosures(response?.data || []);
    } catch (err) {
      console.error("Error fetching Mandatory Disclosure:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load Mandatory Disclosure.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisclosures();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData(DEFAULT_FORM);
    setEditingId(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        title: formData.title.trim(),
        pdfLink: formData.pdfLink.trim(),
        isPublished: formData.isPublished,
        displayOrder: Number(formData.displayOrder) || 0,
      };

      if (!payload.title) {
        setError("Title is required.");
        return;
      }

      if (!payload.pdfLink) {
        setError("PDF link is required.");
        return;
      }

      if (editingId) {
        await updateMandatoryDisclosure(editingId, payload);

        setMessage("Mandatory Disclosure updated successfully.");
      } else {
        await createMandatoryDisclosure(payload);

        setMessage("Mandatory Disclosure created successfully.");
      }

      resetForm();
      await fetchDisclosures();
    } catch (err) {
      console.error("Error saving Mandatory Disclosure:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save Mandatory Disclosure.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);

    setFormData({
      title: item.title || "",
      pdfLink: item.pdfLink || "",
      isPublished: Boolean(item.isPublished),
      displayOrder: item.displayOrder ?? 0,
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handlePublishToggle = async (item) => {
    try {
      setError("");
      setMessage("");

      if (item.isPublished) {
        await unpublishMandatoryDisclosure(item._id);

        setMessage("Mandatory Disclosure unpublished successfully.");
      } else {
        await publishMandatoryDisclosure(item._id);

        setMessage("Mandatory Disclosure published successfully.");
      }

      await fetchDisclosures();
    } catch (err) {
      console.error("Error changing Mandatory Disclosure status:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to change publish status.",
      );
    }
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await deleteMandatoryDisclosure(item._id);

      setMessage("Mandatory Disclosure deleted successfully.");

      if (editingId === item._id) {
        resetForm();
      }

      await fetchDisclosures();
    } catch (err) {
      console.error("Error deleting Mandatory Disclosure:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete Mandatory Disclosure.",
      );
    }
  };

  return (
    <div className="mandatory-disclosure-admin">
      <Container fluid className="py-4">
        {/* HEADER */}
        <div className="mandatory-disclosure-header mb-4">
          <div>
            <h2 className="fw-bold mb-1">Mandatory Disclosure</h2>

            <p className="text-muted mb-0">
              Manage the Mandatory Disclosure PDF displayed on the website.
            </p>
          </div>
        </div>

        {/* SUCCESS */}
        {message && (
          <Alert variant="success" dismissible onClose={() => setMessage("")}>
            {message}
          </Alert>
        )}

        {/* ERROR */}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* FORM */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h4 className="fw-bold mb-1">
                  {editingId ? "Edit Disclosure" : "Add Disclosure"}
                </h4>

                <p className="text-muted small mb-0">
                  Enter the title and PDF document link.
                </p>
              </div>

              {editingId && (
                <Button variant="outline-secondary" onClick={resetForm}>
                  Cancel Edit
                </Button>
              )}
            </div>

            <Form onSubmit={handleSubmit}>
              {/* TITLE */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Title</Form.Label>

                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Mandatory Disclosure"
                  required
                />
              </Form.Group>

              {/* PDF LINK */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">PDF Link</Form.Label>

                <Form.Control
                  type="url"
                  name="pdfLink"
                  value={formData.pdfLink}
                  onChange={handleChange}
                  placeholder="https://example.com/mandatory-disclosure.pdf"
                  required
                />

                <Form.Text className="text-muted">
                  Enter the complete PDF URL.
                </Form.Text>
              </Form.Group>

              {/* DISPLAY ORDER */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Display Order</Form.Label>

                <Form.Control
                  type="number"
                  name="displayOrder"
                  value={formData.displayOrder}
                  onChange={handleChange}
                  min="0"
                />
              </Form.Group>

              {/* PUBLISH */}
              <Form.Group className="mb-4">
                <Form.Check
                  type="switch"
                  id="mandatory-disclosure-published"
                  name="isPublished"
                  label="Publish on website"
                  checked={formData.isPublished}
                  onChange={handleChange}
                />
              </Form.Group>

              {/* ACTIONS */}
              <div className="d-flex gap-2">
                <Button
                  type="submit"
                  variant="dark"
                  disabled={saving}
                  className="px-4"
                >
                  {saving ? (
                    <>
                      <Spinner size="sm" animation="border" className="me-2" />
                      Saving...
                    </>
                  ) : editingId ? (
                    "Update Disclosure"
                  ) : (
                    "Add Disclosure"
                  )}
                </Button>

                {editingId && (
                  <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={resetForm}
                  >
                    Reset
                  </Button>
                )}
              </div>
            </Form>
          </Card.Body>
        </Card>

        {/* EXISTING DISCLOSURES */}
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-4">
            <div className="mb-4">
              <h4 className="fw-bold mb-1">Disclosure Documents</h4>

              <p className="text-muted small mb-0">
                Manage published and unpublished documents.
              </p>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" />

                <div className="mt-2 text-muted">
                  Loading Mandatory Disclosure...
                </div>
              </div>
            ) : disclosures.length === 0 ? (
              <div className="text-center py-5 text-muted">
                No Mandatory Disclosure documents found.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle mandatory-disclosure-table">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Title</th>
                      <th>PDF</th>
                      <th>Status</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {disclosures.map((item) => (
                      <tr key={item._id}>
                        <td>{item.displayOrder}</td>

                        <td>
                          <div className="fw-semibold">{item.title}</div>
                        </td>

                        <td>
                          <a
                            href={item.pdfLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-primary"
                          >
                            View PDF
                          </a>
                        </td>

                        <td>
                          <Badge
                            bg={item.isPublished ? "success" : "secondary"}
                          >
                            {item.isPublished ? "Published" : "Unpublished"}
                          </Badge>
                        </td>

                        <td>
                          <div className="d-flex justify-content-end gap-2">
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => handleEdit(item)}
                            >
                              Edit
                            </Button>

                            <Button
                              size="sm"
                              variant={
                                item.isPublished
                                  ? "outline-warning"
                                  : "outline-success"
                              }
                              onClick={() => handlePublishToggle(item)}
                            >
                              {item.isPublished ? "Unpublish" : "Publish"}
                            </Button>

                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => handleDelete(item)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default MandatoryDisclosure;
