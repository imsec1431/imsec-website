import React, { useEffect, useState } from "react";
import { Card, Table, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import DeleteModal from "../../../components/common/DeleteModal";

import {
  getSlides,
  deleteSlide,
} from "../../../services/heroSliderService";

const HeroSliderList = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [selectedId, setSelectedId] = useState(null);
const [deleteLoading, setDeleteLoading] = useState(false);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSlides = async () => {
    try {
      const res = await getSlides();
      setSlides(res.data.data);
    } catch (error) {
      console.error("Error fetching slides:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

 const openDeleteModal = (id) => {
  setSelectedId(id);
  setShowDeleteModal(true);
};

const handleDelete = async () => {
  try {
    setDeleteLoading(true);

    await deleteSlide(selectedId);

    setShowDeleteModal(false);
    setSelectedId(null);

    fetchSlides();
  } catch (error) {
    console.error(error);
  } finally {
    setDeleteLoading(false);
  }
};
  return (
    <Card className="shadow-sm">

      <Card.Header className="d-flex justify-content-between align-items-center">

        <h4 className="mb-0">Hero Slider</h4>

        <Link to="/imsec-control-center/homepage/hero-slider/add">
          <Button>
            <FaPlus className="me-2" />
            Add New Slide
          </Button>
        </Link>

      </Card.Header>

      <Card.Body>

        {loading ? (
          <h5 className="text-center">Loading...</h5>
        ) : (
          <Table bordered hover responsive>

            <thead>

              <tr>

                <th>#</th>
                <th>Image</th>
                <th>Title</th>
                <th>Order</th>
                <th>Status</th>
                <th width="150">Action</th>

              </tr>

            </thead>

            <tbody>

              {slides.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    No Hero Slides Found
                  </td>
                </tr>
              ) : (
                slides.map((slide, index) => (
                  <tr key={slide._id}>

                    <td>{index + 1}</td>

                    <td>
                      <img
                        src={slide.image}
                        alt={slide.title}
                        style={{
                          width: "120px",
                          height: "70px",
                          objectFit: "cover",
                          borderRadius: "6px",
                        }}
                      />
                    </td>

                    <td>{slide.title}</td>

                    <td>{slide.order}</td>

                    <td>
                      {slide.isActive ? (
                        <Badge bg="success">Active</Badge>
                      ) : (
                        <Badge bg="secondary">Inactive</Badge>
                      )}
                    </td>

                    <td>

                      <Link
                        to={`/imsec-control-center/homepage/hero-slider/edit/${slide._id}`}
                      >
                        <Button
                          size="sm"
                          variant="warning"
                          className="me-2"
                        >
                          <FaEdit />
                        </Button>
                      </Link>

                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => openDeleteModal(slide._id)}
                      >
                        <FaTrash />
                      </Button>

                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </Table>
        )}

      </Card.Body>
        <DeleteModal
  show={showDeleteModal}
  handleClose={() => setShowDeleteModal(false)}
  handleDelete={handleDelete}
  loading={deleteLoading}
  title="Delete Hero Slide"
  message="Are you sure you want to delete this Hero Slide? This action cannot be undone."
/>
    </Card>
  );
};

export default HeroSliderList;