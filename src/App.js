// src/App.js

import React, { useState, useEffect } from "react";
import CitySearch from "./components/CitySearch";
import EventList from "./components/EventList";
import NumberOfEvents from "./components/NumberOfEvents";
import { getEvents, extractLocations } from "./api";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

const App = () => {
  const [events, setEvents] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [currentCity, setCurrentCity] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const allEvents = await getEvents();
    setEvents(allEvents);
    setAllLocations(extractLocations(allEvents));
  };

  const filteredEvents =
    currentCity === "all"
      ? events
      : events.filter((event) => event.location === currentCity);
  return (
    <div className="App">
      <CitySearch allLocations={allLocations} setCurrentCity={setCurrentCity} />
      <br />
      <NumberOfEvents />
      <br />
      {filteredEvents.length === 0 ? (
        <ul id="event-list" data-testid="event-list" aria-label="event list">
          <p>No events found in {currentCity}</p>
        </ul>
      ) : (
        <EventList events={filteredEvents} />
      )}
    </div>
  );
};

export default App;
