// src/components/EventList.js
import { useState } from "react";
import Event from "./Event";
import { ListGroup, Button, Stack } from "react-bootstrap";

const EventList = ({ events }) => {
  const [forceCollapse, setForceCollapse] = useState(false);

  const handleCollapseAll = () => {
    setForceCollapse(true);
    // Reset forceCollapse after a short delay to allow events to collapse
    setTimeout(() => setForceCollapse(false), 50);
  };

  return (
    <Stack className="event-list-container" gap={3}>
      <Button
        variant="primary"
        className="toggleBtn"
        data-testid="btn-Collapse"
        onClick={handleCollapseAll}
        alt-text="Collapse all event details"
      >
        Hide All Event Details
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
                forceCollapse={forceCollapse}
                index={index}
              />
            ))
          : null}
      </ListGroup>
      <br />
      <br />
    </Stack>
  );
};

export default EventList;
