import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import AlumniForm from "../../../../components/AlumniForm";

import { createAlumni } from "../../../../services/alumniService";

const AddAlumni = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [preview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    course: "",
    company: "",
    order: 1,
    isActive: true,
    imagePreview: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", formData.name);
      data.append("course", formData.course);
      data.append("company", formData.company);
      data.append("order", formData.order);
      data.append("isActive", formData.isActive);

      if (image) {
        data.append("image", image);
      }

      await createAlumni(data);

      alert("Alumni added successfully.");

      navigate("/imsec-control-center/homepage/alumni");
    } catch (err) {
      console.error(err);
      alert("Unable to add alumni.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">Add Alumni</h2>

      <AlumniForm
        formData={formData}
        setFormData={setFormData}
        image={image}
        setImage={setImage}
        preview={preview}
        handleSubmit={handleSubmit}
        loading={loading}
        isEdit={false}
      />
    </Container>
  );
};

export default AddAlumni;