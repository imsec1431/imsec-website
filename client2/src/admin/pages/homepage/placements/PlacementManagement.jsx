import { Tabs, Tab, Container } from "react-bootstrap";

import PlacementStatList from "../placement-stats/PlacementStatList";
import PlacementList from "./PlacementList";

const PlacementManagement = () => {
  return (
    <Container fluid className="py-4">

      <h2 className="mb-4">Placement Management</h2>

      <Tabs defaultActiveKey="statistics">

        <Tab
          eventKey="statistics"
          title="Placement Statistics"
        >
          <div className="mt-4">
            <PlacementStatList />
          </div>
        </Tab>

        <Tab
          eventKey="students"
          title="Placement Students"
        >
          <div className="mt-4">
            <PlacementList />
          </div>
        </Tab>

      </Tabs>

    </Container>
  );
};

export default PlacementManagement;