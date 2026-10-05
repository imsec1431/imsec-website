import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import AchievementForm from "../../../../components/AchievementForm";

import { createAchievement } from "../../../../services/achievementService";

const AddAchievement = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);

      await createAchievement(formData);

      alert("Achievement added successfully!");

      navigate("/imsec-control-center/homepage/achievements");
    } catch (error) {
      console.error(error);
      alert("Failed to add achievement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">Add Achievement</h2>

      <AchievementForm
        onSubmit={handleSubmit}
        loading={loading}
      />
    </Container>
  );
};

export default AddAchievement;