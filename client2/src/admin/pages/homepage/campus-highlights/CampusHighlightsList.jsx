import React, { useEffect, useState } from "react";
import { Container, Table, Button, Badge, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  getCampusHighlights,
  deleteCampusHighlight,
} from "../../../services/campusHighlightService";

const CampusHighlightsList = () => {
  const [highlights, setHighlights] = useState([]);

  useEffect(() => {
    fetchHighlights();
  }, []);

  const fetchHighlights = async () => {
    try {
      const res = await getCampusHighlights();
      setHighlights(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Campus Highlight?"
    );

    if (!confirmDelete) return;

    try {
      await deleteCampusHighlight(id);
      fetchHighlights();
    } catch (err) {
      console.error(err);
      alert("Unable to delete.");
    }
  };

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Campus Highlights</h2>

        <Link to="/imsec-control-center/homepage/campus-highlights/add">
          <Button variant="primary">
            + Add Campus Highlight
          </Button>
        </Link>
      </div>

      <Table bordered hover responsive className="align-middle">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Image</th>
            <th>Type</th>
            <th>Title</th>
            <th>Date</th>
            <th>Order</th>
            <th>Status</th>
            <th width="180">Actions</th>
          </tr>
        </thead>

        <tbody>
          {highlights.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center">
                No Campus Highlights Found
              </td>
            </tr>
          ) : (
            highlights.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>

                <td>
                  <Image
                    src={item.image}
                    width={90}
                    height={60}
                    rounded
                    style={{ objectFit: "cover" }}
                  />
                </td>

                <td>{item.eventType}</td>

                <td>{item.title}</td>

                <td>
                  {new Date(item.date).toLocaleDateString()}
                </td>

                <td>{item.order}</td>

                <td>
                  {item.isActive ? (
                    <Badge bg="success">Active</Badge>
                  ) : (
                    <Badge bg="secondary">Inactive</Badge>
                  )}
                </td>

                <td>
                  <Link
                    to={`/imsec-control-center/homepage/campus-highlights/edit/${item._id}`}
                  >
                    <Button
                      size="sm"
                      variant="warning"
                      className="me-2"
                    >
                      Edit
                    </Button>
                  </Link>

                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default CampusHighlightsList;