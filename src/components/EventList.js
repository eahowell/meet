// src/components/EventList.js
import { useState } from "react";
import Event from "./Event";

const EventList = ({ events }) => {
    const [allCollapsed, setAllCollapsed] = useState(false);

  const handleCollapseAll = () => {
    setAllCollapsed(true);
  };
//   console.log("Rendering EventList with events:", events);
  return (
    <div>
    <button onClick={handleCollapseAll}>Collapse All</button>
    <ul id="event-list" data-testid="event-list" aria-label="event list">
      {events && events.length > 0
        ? events.map((event) => <Event key={event.id} event={event} forceCollapse={allCollapsed}/>)
        : null}
    </ul>
    </div>
  );
};

export default EventList;
