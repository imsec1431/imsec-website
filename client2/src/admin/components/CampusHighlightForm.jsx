import React from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";

const CampusHighlightForm = ({
  formData,
  setFormData,
  image,
  setImage,
  preview,
  handleSubmit,
  loading,
  isEdit = false,
}) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);

      const reader = new FileReader();

      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          imagePreview: reader.result,
        }));
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="shadow border-0">
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            {/* Image */}
            <Col md={12} className="mb-4 text-center">
              {(formData.imagePreview || preview) && (
                <img
                  src={formData.imagePreview || preview}
                  alt="Preview"
                  style={{
                    width: "220px",
                    height: "140px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    border: "1px solid #ddd",
                    marginBottom: "15px",
                  }}
                />
              )}

              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Col>

            {/* Event Type */}
            <Col md={6} className="mb-3">
              <Form.Label>Event Type</Form.Label>

              <Form.Select
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                required
              >
                <option value="">Select Type</option>
                <option value="News">News</option>
                <option value="Event">Event</option>
                <option value="Achievement">Achievement</option>
              </Form.Select>
            </Col>

            {/* Display Order */}
            <Col md={6} className="mb-3">
              <Form.Label>Display Order</Form.Label>

              <Form.Control
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
              />
            </Col>

            {/* Title */}
            <Col md={12} className="mb-3">
              <Form.Label>Title</Form.Label>

              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Col>

            {/* Date */}
            <Col md={6} className="mb-3">
              <Form.Label>Date</Form.Label>

              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </Col>

            {/* Active */}
            <Col md={6} className="mb-3 d-flex align-items-center">
              <Form.Check
                type="checkbox"
                label="Active"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
            </Col>

            {/* Description */}
            <Col md={12} className="mb-3">
              <Form.Label>Description</Form.Label>

              <Form.Control
                as="textarea"
                rows={5}
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Col>

            {/* Read More */}
            <Col md={12} className="mb-3">
              <Form.Label>Read More Link</Form.Label>

              <Form.Control
                type="url"
                name="readMore"
                value={formData.readMore}
                onChange={handleChange}
              />
            </Col>

            {/* Facebook */}
            <Col md={4} className="mb-3">
              <Form.Label>Facebook Link</Form.Label>

              <Form.Control
                type="url"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
              />
            </Col>

            {/* Instagram */}
            <Col md={4} className="mb-3">
              <Form.Label>Instagram Link</Form.Label>

              <Form.Control
                type="url"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
              />
            </Col>

            {/* LinkedIn */}
            <Col md={4} className="mb-3">
              <Form.Label>LinkedIn Link</Form.Label>

              <Form.Control
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
              />
            </Col>

            <Col md={12}>
              <Button
                type="submit"
                disabled={loading}
                className="w-100"
                variant="primary"
              >
                {loading
                  ? "Saving..."
                  : isEdit
                  ? "Update Campus Highlight"
                  : "Add Campus Highlight"}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CampusHighlightForm;