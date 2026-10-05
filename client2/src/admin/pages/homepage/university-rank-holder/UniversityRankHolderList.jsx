import React, { useEffect, useState } from "react";
import { Container, Table, Button, Badge, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

import {
  getUniversityRankHolders,
  deleteUniversityRankHolder,
} from "../../../services/universityRankHolderService";

const UniversityRankHolderList = () => {
  const [rankHolders, setRankHolders] = useState([]);

  useEffect(() => {
    fetchRankHolders();
  }, []);

  const fetchRankHolders = async () => {
    try {
      const res = await getUniversityRankHolders();
      setRankHolders(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Rank Holder?"
    );

    if (!confirmDelete) return;

    try {
      await deleteUniversityRankHolder(id);
      fetchRankHolders();
    } catch (err) {
      console.error(err);
      alert("Unable to delete Rank Holder.");
    }
  };

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>University Rank Holders</h2>

        <Link to="/imsec-control-center/homepage/university-rank-holder/add">
          <Button variant="primary">
            + Add Rank Holder
          </Button>
        </Link>
      </div>

      <Table bordered hover responsive className="align-middle">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Photo</th>
            <th>Student Name</th>
            <th>Rank</th>
            <th>Course</th>
            <th>Batch</th>
            <th>CGPA</th>
            <th>Order</th>
            <th>Status</th>
            <th width="180">Actions</th>
          </tr>
        </thead>

        <tbody>
          {rankHolders.length === 0 ? (
            <tr>
              <td colSpan="10" className="text-center">
                No Rank Holders Found
              </td>
            </tr>
          ) : (
            rankHolders.map((item, index) => (
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

                <td>{item.studentName}</td>

                <td>
                  <Badge bg="warning" text="dark">
                    #{item.rank}
                  </Badge>
                </td>

                <td>{item.course}</td>

                <td>{item.batch}</td>

                <td>{item.cgpa}</td>

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
                    to={`/imsec-control-center/homepage/university-rank-holder/edit/${item._id}`}
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

export default UniversityRankHolderList;