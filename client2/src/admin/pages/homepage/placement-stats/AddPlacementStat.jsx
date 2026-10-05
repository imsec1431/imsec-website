import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import PlacementStatForm from "../../../../components/PlacementStatForm";
import { createPlacementStat } from "../../../../services/placementStatService";

const AddPlacementStat = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    try {
      setLoading(true);

      await createPlacementStat(data);

      alert("Placement Statistic added successfully!");

      navigate("/imsec-control-center/homepage/placement-stats");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">Add Placement Statistic</h2>

      <PlacementStatForm
        onSubmit={handleSubmit}
        loading={loading}
      />
    </Container>
  );
};

export default AddPlacementStat;