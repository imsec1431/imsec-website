import React from "react";
import {
  Card,
  Row,
  Col,
  Form,
  Button,
} from "react-bootstrap";

const AlumniForm = ({
  formData,
  setFormData,
  image,
  setImage,
  preview,
  handleSubmit,
  loading,
  isEdit,
}) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        imagePreview: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Label>Alumni Name</Form.Label>

              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label>Course</Form.Label>

              <Form.Control
                type="text"
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
              />
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label>Company</Form.Label>

              <Form.Control
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
              />
            </Col>

            <Col md={3} className="mb-3">
              <Form.Label>Display Order</Form.Label>

              <Form.Control
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
              />
            </Col>

            <Col md={3} className="mb-3 d-flex align-items-center">
              <Form.Check
                type="checkbox"
                label="Active"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
            </Col>

            <Col md={12} className="mb-3">
              <Form.Label>Alumni Photo</Form.Label>

              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImage}
                required={!isEdit}
              />
            </Col>

            {(formData.imagePreview || preview) && (
              <Col md={12} className="mb-4 text-center">
                <img
                  src={formData.imagePreview || preview}
                  alt="Preview"
                  style={{
                    width: "180px",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "50%",
                    border: "3px solid #ddd",
                  }}
                />
              </Col>
            )}
          </Row>

          <Button type="submit" disabled={loading}>
            {loading
              ? "Saving..."
              : isEdit
              ? "Update Alumni"
              : "Add Alumni"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AlumniForm;