import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import PlacementForm from "../../../../components/PlacementForm";

import {
  getPlacementById,
  updatePlacement,
} from "../../../../services/placementService";

const EditPlacement = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [placement, setPlacement] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchPlacement = async () => {
    try {
      const res = await getPlacementById(id);
      setPlacement(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPlacement();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);

      await updatePlacement(id, formData);

      alert("Placement updated successfully!");

      navigate("/imsec-control-center/homepage/placements");
    } catch (error) {
      console.error(error);
      alert("Failed to update placement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="py-4">

      <h2 className="mb-4">Edit Placement</h2>

      <PlacementForm
        initialData={placement}
        onSubmit={handleSubmit}
        loading={loading}
      />

    </Container>
  );
};

export default EditPlacement;