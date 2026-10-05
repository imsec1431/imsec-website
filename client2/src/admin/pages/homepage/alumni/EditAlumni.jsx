import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import AlumniForm from "../../../../components/AlumniForm";

import {
  getAlumniById,
  updateAlumni,
} from "../../../../services/alumniService";

const EditAlumni = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    course: "",
    company: "",
    order: 1,
    isActive: true,
    imagePreview: "",
  });

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      const res = await getAlumniById(id);

      const item = res.data.data;

      setPreview(item.image);

      setFormData({
        name: item.name || "",
        course: item.course || "",
        company: item.company || "",
        order: item.order || 1,
        isActive: item.isActive,
        imagePreview: "",
      });
    } catch (err) {
      console.error(err);
      alert("Unable to load Alumni.");
    }
  };

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

      await updateAlumni(id, data);

      alert("Alumni updated successfully.");

      navigate("/imsec-control-center/homepage/alumni");
    } catch (err) {
      console.error(err);
      alert("Unable to update Alumni.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">Edit Alumni</h2>

      <AlumniForm
        formData={formData}
        setFormData={setFormData}
        image={image}
        setImage={setImage}
        preview={preview}
        handleSubmit={handleSubmit}
        loading={loading}
        isEdit={true}
      />
    </Container>
  );
};

export default EditAlumni;