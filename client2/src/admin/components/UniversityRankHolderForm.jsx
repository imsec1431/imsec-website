import React from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";

const UniversityRankHolderForm = ({
  formData,
  setFormData,
  image,
  setImage,
  preview,
  handleSubmit,
  loading,
  isEdit,
}) => {
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
            {/* Image */}
            <Col md={4} className="mb-3">
              <Form.Label>Student Photo</Form.Label>

              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImage}
              />

              {(formData.imagePreview || preview) && (
                <img
                  src={formData.imagePreview || preview}
                  alt="Preview"
                  className="img-fluid rounded mt-3"
                  style={{
                    height: 220,
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
              )}
            </Col>

            <Col md={8}>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label>Student Name</Form.Label>

                  <Form.Control
                    type="text"
                    value={formData.studentName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        studentName: e.target.value,
                      })
                    }
                    required
                  />
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label>University Rank</Form.Label>

                  <Form.Control
                    type="number"
                    value={formData.rank}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rank: e.target.value,
                      })
                    }
                    required
                  />
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label>Course</Form.Label>

                  <Form.Control
                    type="text"
                    value={formData.course}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        course: e.target.value,
                      })
                    }
                    placeholder="MCA"
                    required
                  />
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label>Batch</Form.Label>

                  <Form.Control
                    type="text"
                    value={formData.batch}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        batch: e.target.value,
                      })
                    }
                    placeholder="2024-26"
                    required
                  />
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label>CGPA</Form.Label>

                  <Form.Control
                    type="text"
                    value={formData.cgpa}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cgpa: e.target.value,
                      })
                    }
                    placeholder="9.81"
                    required
                  />
                </Col>

                <Col md={3} className="mb-3">
                  <Form.Label>Display Order</Form.Label>

                  <Form.Control
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        order: e.target.value,
                      })
                    }
                  />
                </Col>

                <Col md={3} className="mb-3">
                  <Form.Label>Status</Form.Label>

                  <Form.Select
                    value={formData.isActive}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isActive: e.target.value === "true",
                      })
                    }
                  >
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </Form.Select>
                </Col>
              </Row>
            </Col>
          </Row>

          <div className="mt-4">
            <Button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : isEdit
                ? "Update Rank Holder"
                : "Add Rank Holder"}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default UniversityRankHolderForm;