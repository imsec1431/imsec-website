import React, { useEffect, useState } from "react";
import { Button, Badge, Container, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

import {
  getAchievements,
  deleteAchievement,
} from "../../../../services/achievementService";

const AchievementList = () => {
  const [achievements, setAchievements] = useState([]);

  const fetchAchievements = async () => {
    try {
      const res = await getAchievements();
      setAchievements(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this achievement?")) return;

    try {
      await deleteAchievement(id);

      alert("Deleted Successfully");

      fetchAchievements();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Achievements</h2>

        <Link
          to="/imsec-control-center/homepage/achievements/add"
          className="btn btn-primary"
        >
          Add Achievement
        </Link>
      </div>

      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Image</th>
            <th>Title</th>
            <th>Order</th>
            <th>Status</th>
            <th width="180">Action</th>
          </tr>
        </thead>

        <tbody>
          {achievements.map((item, index) => (
            <tr key={item._id}>
              <td>{index + 1}</td>

              <td>
                <img
                  src={item.image}
                  alt={item.title}
                  width="70"
                  height="70"
                  style={{
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </td>

              <td>{item.title}</td>

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
                  className="btn btn-warning btn-sm me-2"
                  to={`/imsec-control-center/homepage/achievements/edit/${item._id}`}
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

export default AchievementList;