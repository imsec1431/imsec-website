import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import PlacementStatForm from "../../../../components/PlacementStatForm";

import {
  getPlacementStatById,
  updatePlacementStat,
} from "../../../../services/placementStatService";

const EditPlacementStat = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [stat, setStat] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStat();
  }, []);

  const fetchStat = async () => {
    try {
      const res = await getPlacementStatById(id);
      setStat(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (data) => {
    try {
      setLoading(true);

      await updatePlacementStat(id, data);

      alert("Placement Statistic updated successfully!");

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

      <h2 className="mb-4">Edit Placement Statistic</h2>

      <PlacementStatForm
        initialData={stat}
        onSubmit={handleSubmit}
        loading={loading}
      />

    </Container>
  );
};

export default EditPlacementStat;