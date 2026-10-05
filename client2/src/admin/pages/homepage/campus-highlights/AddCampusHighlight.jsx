import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import CampusHighlightForm from "../../../components/CampusHighlightForm";

import { createCampusHighlight } from "../../../services/campusHighlightService";

const AddCampusHighlight = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [image, setImage] = useState(null);

  const [formData, setFormData] = useState({
    eventType: "",
    title: "",
    date: "",
    description: "",

    facebook: "",
    instagram: "",
    linkedin: "",
    readMore: "",

    order: 1,
    isActive: true,

    imagePreview: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      data.append("image", image);
      data.append("eventType", formData.eventType);
      data.append("title", formData.title);
      data.append("date", formData.date);
      data.append("description", formData.description);

      data.append("facebook", formData.facebook);
      data.append("instagram", formData.instagram);
      data.append("linkedin", formData.linkedin);

      data.append("readMore", formData.readMore);

      data.append("order", formData.order);
      data.append("isActive", formData.isActive);

      await createCampusHighlight(data);

      alert("Campus Highlight Added Successfully.");

      navigate("/imsec-control-center/homepage/campus-highlights");
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">Add Campus Highlight</h2>

      <CampusHighlightForm
        formData={formData}
        setFormData={setFormData}
        image={image}
        setImage={setImage}
        preview=""
        handleSubmit={handleSubmit}
        loading={loading}
      />
    </Container>
  );
};

export default AddCampusHighlight;