import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import UniversityRankHolderForm from "../../../components/UniversityRankHolderForm";

import {
  createUniversityRankHolder,
} from "../../../services/universityRankHolderService";

const AddUniversityRankHolder = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [preview] = useState("");

  const [formData, setFormData] = useState({
    studentName: "",
    rank: "",
    course: "",
    batch: "",
    cgpa: "",

    order: 1,
    isActive: true,

    imagePreview: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select a student image.");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("image", image);

      data.append("studentName", formData.studentName);
      data.append("rank", formData.rank);
      data.append("course", formData.course);
      data.append("batch", formData.batch);
      data.append("cgpa", formData.cgpa);

      data.append("order", formData.order);
      data.append("isActive", formData.isActive);

      await createUniversityRankHolder(data);

      alert("University Rank Holder Added Successfully.");

      navigate("/imsec-control-center/homepage/university-rank-holder");
    } catch (err) {
      console.error(err);
      alert("Unable to add University Rank Holder.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">Add University Rank Holder</h2>

      <UniversityRankHolderForm
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

export default AddUniversityRankHolder;