import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";

const AchievementForm = ({
  initialData = {},
  onSubmit,
  loading,
}) => {
  const [title, setTitle] = useState(initialData.title || "");
  const [image, setImage] = useState(null);
  const [order, setOrder] = useState(initialData.order || 1);
  const [isActive, setIsActive] = useState(
    initialData.isActive ?? true
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", title);
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
            <Form.Label>Achievement Title</Form.Label>

            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Achievement Image</Form.Label>

            <Form.Control
              type="file"
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
              onChange={(e) => setOrder(e.target.value)}
            />
          </Form.Group>

          <Form.Check
            className="mb-3"
            label="Active"
            checked={isActive}
            onChange={(e) =>
              setIsActive(e.target.checked)
            }
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Achievement"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AchievementForm;