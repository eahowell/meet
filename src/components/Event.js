// src/components/Event.js

import { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { Button } from "react-bootstrap";

const Event = ({ event, forceCollapse, index }) => {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (forceCollapse) {
      setShowDetails(false);
    }
  }, [forceCollapse]);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <ListGroup.Item
      as="li"
      role="listitem"
      className="event listitem eventListItem"
      aria-label="event listitem"
      data-testid={`event-${index}`}
    >
      <h3>{event.summary}</h3>
      <p>
        <strong>Location:</strong> {event.location}
      </p>
      <p>
        <strong>Start Time:</strong>{" "}
        {new Date(event.start.dateTime).toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZoneName: "short",
        })}
      </p>
      {showDetails && (
        <div className="event-details">
          <h4>About the Event</h4>
          <p>
            <strong>Description:</strong> {event.description}
          </p>
          <p>
            <strong>Organizer:</strong> {event.organizer.email}
          </p>
          <a href={event.htmlLink}>See details on Google Calendar</a>
        </div>
      )}
      <Button variant="primary" onClick={toggleDetails}>
        {showDetails ? "Hide Details" : "Show Details"}
      </Button>
      <br />
    </ListGroup.Item>
  );
};

export default Event;
