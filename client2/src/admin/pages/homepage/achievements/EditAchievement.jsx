import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import AchievementForm from "../../../../components/AchievementForm";

import {
  getAchievementById,
  updateAchievement,
} from "../../../../services/achievementService";

const EditAchievement = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [achievement, setAchievement] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchAchievement = async () => {
    try {
      const res = await getAchievementById(id);
      setAchievement(res.data.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load achievement.");
    }
  };

  useEffect(() => {
    fetchAchievement();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);

      await updateAchievement(id, formData);

      alert("Achievement updated successfully!");

      navigate("/imsec-control-center/homepage/achievements");
    } catch (error) {
      console.error(error);
      alert("Failed to update achievement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">Edit Achievement</h2>

      <AchievementForm
        initialData={achievement}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </Container>
  );
};

export default EditAchievement;