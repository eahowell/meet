// src/components/EventList.js

import Event from "./Event";

const EventList = ({ events }) => {
//   console.log("Rendering EventList with events:", events);
  return (
    <ul id="event-list" data-testid="event-list" aria-label="event list">
      {events && events.length > 0
        ? events.map((event) => <Event key={event.id} event={event} />)
        : null}
    </ul>
  );
};

export default EventList;
