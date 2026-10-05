import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import UniversityRankHolderForm from "../../../components/UniversityRankHolderForm";

import {
  getUniversityRankHolder,
  updateUniversityRankHolder,
} from "../../../services/universityRankHolderService";

const EditUniversityRankHolder = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

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

  useEffect(() => {
    fetchRankHolder();
  }, []);

  const fetchRankHolder = async () => {
    try {
      const res = await getUniversityRankHolder(id);

      const item = res.data.data;

      setPreview(item.image);

      setFormData({
        studentName: item.studentName || "",
        rank: item.rank || "",
        course: item.course || "",
        batch: item.batch || "",
        cgpa: item.cgpa || "",

        order: item.order || 1,
        isActive: item.isActive,

        imagePreview: "",
      });
    } catch (err) {
      console.error(err);
      alert("Unable to load Rank Holder.");
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

      data.append("studentName", formData.studentName);
      data.append("rank", formData.rank);
      data.append("course", formData.course);
      data.append("batch", formData.batch);
      data.append("cgpa", formData.cgpa);

      data.append("order", formData.order);
      data.append("isActive", formData.isActive);

      await updateUniversityRankHolder(id, data);

      alert("University Rank Holder Updated Successfully.");

      navigate("/imsec-control-center/homepage/university-rank-holder");
    } catch (err) {
      console.error(err);
      alert("Unable to update Rank Holder.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">Edit University Rank Holder</h2>

      <UniversityRankHolderForm
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

export default EditUniversityRankHolder;