import React, { useEffect, useState } from "react";
import { Container, Table, Button, Badge, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

import {
  getAlumni,
  deleteAlumni,
} from "../../../../services/alumniService";

const AlumniList = () => {
  const [alumni, setAlumni] = useState([]);

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      const res = await getAlumni();
      setAlumni(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Alumni?"
    );

    if (!confirmDelete) return;

    try {
      await deleteAlumni(id);
      fetchAlumni();
    } catch (err) {
      console.error(err);
      alert("Unable to delete Alumni.");
    }
  };

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Alumni</h2>

        <Link to="/imsec-control-center/homepage/alumni/add">
          <Button variant="primary">
            + Add Alumni
          </Button>
        </Link>
      </div>

      <Table bordered hover responsive className="align-middle">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Photo</th>
            <th>Name</th>
            <th>Course</th>
            <th>Company</th>
            <th>Order</th>
            <th>Status</th>
            <th width="180">Actions</th>
          </tr>
        </thead>

        <tbody>
          {alumni.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center">
                No Alumni Found
              </td>
            </tr>
          ) : (
            alumni.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>

                <td>
                  <Image
                    src={item.image}
                    width={70}
                    height={70}
                    roundedCircle
                    style={{ objectFit: "cover" }}
                  />
                </td>

                <td>{item.name}</td>

                <td>{item.course}</td>

                <td>{item.company}</td>

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
                    to={`/imsec-control-center/homepage/alumni/edit/${item._id}`}
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

export default AlumniList;