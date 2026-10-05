import React, { useEffect, useState } from "react";
import { Badge, Button, Container, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

import {
  getPlacements,
  deletePlacement,
} from "../../../../services/placementService";

const PlacementList = () => {
  const [placements, setPlacements] = useState([]);

  const fetchPlacements = async () => {
    try {
      const res = await getPlacements();
      setPlacements(Array.isArray(res?.data) ? res.data : []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPlacements();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this placement?")) return;

    try {
      await deletePlacement(id);
      alert("Deleted Successfully");
      fetchPlacements();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-end mb-4">
        <Link
          to="/imsec-control-center/homepage/placements/add"
          className="btn btn-primary"
        >
          Add Placement Student
        </Link>
      </div>

      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Photo</th>
            <th>Name</th>
            <th>Course & Branch</th>
            <th>Batch</th>
            <th>Company</th>
            <th>Package</th>
            <th>Status</th>
            <th width="180">Action</th>
          </tr>
        </thead>

        <tbody>
          {placements.map((item, index) => (
            <tr key={item._id}>
              <td>{index + 1}</td>

              <td>
                <img
                  src={item.image}
                  alt={item.studentName}
                  width="70"
                  height="70"
                  style={{
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
              </td>

              <td>{item.studentName}</td>

              <td>{item.course}</td>

              <td>{item.batch}</td>

              <td>{item.company}</td>

              <td>{item.package}</td>

              <td>
                {item.isActive ? (
                  <Badge bg="success">Active</Badge>
                ) : (
                  <Badge bg="secondary">Inactive</Badge>
                )}
              </td>

              <td>
                <Link
                  to={`/imsec-control-center/homepage/placements/edit/${item._id}`}
                  className="btn btn-warning btn-sm me-2"
                >
                  Edit
                </Link>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default PlacementList;
