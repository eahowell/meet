// src/components/Event.js

import { useState, useEffect } from "react";

const Event = ({ event, forceCollapse }) => {
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
    <li className="event listitem">
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
            <strong>Organizer:</strong> {event.organizor}
          </p>
          <a href={event.htmlLink}>See details on Google Calendar</a>
        </div>
      )}
      <button onClick={toggleDetails}>
        {showDetails ? "Hide Details" : "Show Details"}
      </button>
    </li>
  );
};

export default Event;
