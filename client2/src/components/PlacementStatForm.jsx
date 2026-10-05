import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

const PlacementStatForm = ({
  initialData = {},
  onSubmit,
  loading,
}) => {
  const [type, setType] = useState("");
  const [figure, setFigure] = useState("");
  const [order, setOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (initialData._id) {
      setType(initialData.type || "");
      setFigure(initialData.figure || "");
      setOrder(initialData.order || 1);
      setIsActive(initialData.isActive);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      type,
      figure,
      order,
      isActive,
    });
  };

  return (
    <Form onSubmit={handleSubmit}>

      <Row>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Statistic</Form.Label>

            <Form.Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="">Select Statistic</option>

              <option value="highest-package">
                Highest Package Offered
              </option>

              <option value="average-ctc">
                Average CTC (CSE/IT)
              </option>

              <option value="recruiters">
                Corporate Recruiter Visits
              </option>

              <option value="placements">
                Total Selective Placements
              </option>

            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Figure</Form.Label>

            <Form.Control
              type="text"
              value={figure}
              onChange={(e) => setFigure(e.target.value)}
              placeholder="₹50.0 LPA"
              required
            />
          </Form.Group>
        </Col>

      </Row>

      <Row>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Order</Form.Label>

            <Form.Control
              type="number"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            />
          </Form.Group>
        </Col>

        <Col md={6} className="d-flex align-items-center">

          <Form.Check
            type="checkbox"
            label="Active"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />

        </Col>

      </Row>

      <Button
        type="submit"
        variant="primary"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save"}
      </Button>

    </Form>
  );
};

export default PlacementStatForm;