import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import PlacementForm from "../../../../components/PlacementForm";
import { createPlacement } from "../../../../services/placementService";

const AddPlacement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);

      await createPlacement(formData);

      alert("Placement added successfully!");

      navigate("/imsec-control-center/homepage/placements");
    } catch (error) {
      console.error(error);
      alert("Failed to add placement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">Add Placement</h2>

      <PlacementForm
        onSubmit={handleSubmit}
        loading={loading}
      />
    </Container>
  );
};

export default AddPlacement;