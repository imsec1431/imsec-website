import React, { useEffect, useState } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import ImageUploader from "./common/ImageUploader";
import { toast } from "react-toastify";
import {
  addSlide,
  getSlide,
  updateSlide,
} from "../services/heroSliderService";

const HeroSliderForm = ({ edit = false }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    order: 1,
    isActive: true,
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (edit && id) {
      fetchSlide();
    }
  }, [edit, id]);

  const fetchSlide = async () => {
    try {
      const res = await getSlide(id);
      const slide = res.data.data;

      setFormData({
        title: slide.title,
        order: slide.order,
        isActive: slide.isActive,
      });

      setPreview(slide.image);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // const handleImage = (e) => {
  //   const file = e.target.files[0];

  //   if (file) {
  //     setImage(file);
  //     setPreview(URL.createObjectURL(file));
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.title.trim()) {
    toast.error("Title is required");
    return;
  }

  if (!edit && !image) {
    toast.error("Please upload an image");
    return;
  }

  const data = new FormData();

  data.append("title", formData.title);
  data.append("order", formData.order);
  data.append("isActive", formData.isActive);

  if (image) {
    data.append("image", image);
  }

  try {
    setLoading(true);

    if (edit) {
      await updateSlide(id, data);
      toast.success("Hero Slide Updated Successfully");
    } else {
      await addSlide(data);
      toast.success("Hero Slide Added Successfully");
    }

    navigate("/imsec-control-center/homepage/hero-slider");
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong!");
  } finally {
    setLoading(false);
  }
};
  return (
    <Card className="shadow-sm">
      <Card.Header>
        <h4>{edit ? "Edit Hero Slide" : "Add Hero Slide"}</h4>
      </Card.Header>

      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row>

            <Col md={12} className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label>Display Order</Form.Label>
              <Form.Control
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
              />
            </Col>

            <Col md={6} className="mb-3">
              <Form.Check
                type="checkbox"
                label="Active"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
            </Col>

            <Col md={12} className="mb-3">
              <Form.Label>Upload Image</Form.Label>
              <ImageUploader
                preview={preview}
                setPreview={setPreview}
                setImage={setImage}
              />
            </Col>

            {preview && (
              <Col md={12} className="mb-3">
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    width: "300px",
                    borderRadius: "10px",
                  }}
                />
              </Col>
            )}

           <div className="d-flex gap-2">

  <Button
    variant="primary"
    type="submit"
    disabled={loading}
  >
    {loading ? (
      <>
        <Spinner
          animation="border"
          size="sm"
          className="me-2"
        />
        Saving...
      </>
    ) : edit ? (
      "Update Slide"
    ) : (
      "Save Slide"
    )}
  </Button>

  <Button
    variant="secondary"
    onClick={() => navigate(-1)}
  >
    Cancel
  </Button>

</div>

          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default HeroSliderForm;