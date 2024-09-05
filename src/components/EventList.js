// src/components/EventList.js
import { useState } from "react";
import Event from "./Event";
import ListGroup from "react-bootstrap/ListGroup";
import { Button } from "react-bootstrap";

const EventList = ({ events }) => {
  const [allCollapsed, setAllCollapsed] = useState(false);

  const handleCollapseAll = () => {
    setAllCollapsed(true);
  };

  return (
    <div>
      <Button variant="primary" onClick={handleCollapseAll}>
        Collapse All
      </Button>
      <ListGroup
        as="ul"
        id="event-list"
        data-testid="event-list"
        aria-label="event list"
        className="eventList"
      >
        {events && events.length > 0
          ? events.map((event, index) => (
              <Event
                key={event.id}
                event={event}
                forceCollapse={allCollapsed}
                index={index}
              />
            ))
          : null}
      </ListGroup>
      <br />
      <br />
    </div>
  );
};

export default EventList;
