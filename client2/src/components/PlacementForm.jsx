import React, { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";

const PlacementForm = ({
  initialData = {},
  onSubmit,
  loading,
}) => {
  const [studentName, setStudentName] = useState(
    initialData.studentName || ""
  );

  const [course, setCourse] = useState(
    initialData.course || ""
  );

  const [batch, setBatch] = useState(
    initialData.batch || ""
  );

  const [company, setCompany] = useState(
    initialData.company || ""
  );

  const [packageValue, setPackageValue] = useState(
    initialData.package || ""
  );

  const [order, setOrder] = useState(
    initialData.order || 1
  );

  const [isActive, setIsActive] = useState(
    initialData.isActive ?? true
  );

  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("studentName", studentName);
    formData.append("course", course);
    formData.append("batch", batch);
    formData.append("company", company);
    formData.append("package", packageValue);
    formData.append("order", order);
    formData.append("isActive", isActive);

    if (image) {
      formData.append("image", image);
    }

    onSubmit(formData);
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Form onSubmit={handleSubmit}>

          <Form.Group className="mb-3">
            <Form.Label>Student Name</Form.Label>
            <Form.Control
              value={studentName}
              onChange={(e) =>
                setStudentName(e.target.value)
              }
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Course</Form.Label>
            <Form.Control
              value={course}
              onChange={(e) =>
                setCourse(e.target.value)
              }
              placeholder="MCA"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Batch</Form.Label>
            <Form.Control
              value={batch}
              onChange={(e) =>
                setBatch(e.target.value)
              }
              placeholder="Computer Applications"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Company</Form.Label>
            <Form.Control
              value={company}
              onChange={(e) =>
                setCompany(e.target.value)
              }
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Package</Form.Label>
            <Form.Control
              value={packageValue}
              onChange={(e) =>
                setPackageValue(e.target.value)
              }
              placeholder="₹12 LPA"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Student Photo</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImage(e.target.files[0])
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Display Order</Form.Label>
            <Form.Control
              type="number"
              value={order}
              onChange={(e) =>
                setOrder(e.target.value)
              }
            />
          </Form.Group>

          <Form.Check
            className="mb-3"
            type="switch"
            label="Active"
            checked={isActive}
            onChange={(e) =>
              setIsActive(e.target.checked)
            }
          />

          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Placement"}
          </Button>

        </Form>
      </Card.Body>
    </Card>
  );
};

export default PlacementForm;