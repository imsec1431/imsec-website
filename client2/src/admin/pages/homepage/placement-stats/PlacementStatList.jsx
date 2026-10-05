import React, { useEffect, useState } from "react";
import { Badge, Button, Container, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

import {
  getPlacementStats,
  
} from "../../../../services/placementStatService";

const labels = {
  "highest-package": "Highest Package Offered",
  "average-ctc": "Average CTC (CSE/IT)",
  recruiters: "Corporate Recruiter Visits",
  placements: "Total Selective Placements",
};

const PlacementStatList = () => {
  const [stats, setStats] = useState([]);

  const fetchStats = async () => {
    try {
      const res = await getPlacementStats();
      setStats(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

 

  return (
    <Container fluid className="py-4">

      <div className="mb-3"></div>

      <Table bordered hover responsive>

        <thead>
          <tr>
            <th>#</th>
            <th>Statistic</th>
            <th>Figure</th>
            <th>Order</th>
            <th>Status</th>
            <td width="100">Action</td>
          </tr>
        </thead>

        <tbody>

          {stats.map((item, index) => (
            <tr key={item._id}>

              <td>{index + 1}</td>

              <td>{labels[item.type]}</td>

              <td>{item.figure}</td>

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
    to={`/imsec-control-center/homepage/placement-stats/edit/${item._id}`}
    className="btn btn-warning btn-sm"
  >
    Edit
  </Link>
</td>

            </tr>
          ))}

        </tbody>

      </Table>

    </Container>
  );
};

export default PlacementStatList;