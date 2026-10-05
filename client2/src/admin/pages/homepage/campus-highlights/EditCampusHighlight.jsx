import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import CampusHighlightForm from "../../../components/CampusHighlightForm";

import {
  getCampusHighlight,
  updateCampusHighlight,
} from "../../../services/campusHighlightService";

const EditCampusHighlight = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

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

  useEffect(() => {
    fetchCampusHighlight();
  }, []);

  const fetchCampusHighlight = async () => {
    try {
      const res = await getCampusHighlight(id);

      const item = res.data.data;

      setPreview(item.image);

      setFormData({
        eventType: item.eventType || "",
        title: item.title || "",
        date: item.date ? item.date.substring(0, 10) : "",
        description: item.description || "",

        facebook: item.facebook || "",
        instagram: item.instagram || "",
        linkedin: item.linkedin || "",
        readMore: item.readMore || "",

        order: item.order || 1,
        isActive: item.isActive,

        imagePreview: "",
      });
    } catch (err) {
      console.error(err);
      alert("Unable to load Campus Highlight.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      if (image) {
        data.append("image", image);
      }

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

      await updateCampusHighlight(id, data);

      alert("Campus Highlight Updated Successfully.");

      navigate("/admin/homepage/campus-highlights");
    } catch (err) {
      console.error(err);
      alert("Unable to update Campus Highlight.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">Edit Campus Highlight</h2>

      <CampusHighlightForm
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

export default EditCampusHighlight;