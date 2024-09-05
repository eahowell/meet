// src/App.js

import React, { useState, useEffect, useCallback } from "react";
import CitySearch from "./components/CitySearch";
import EventList from "./components/EventList";
import NumberOfEvents from "./components/NumberOfEvents";
import { getEvents, extractLocations } from "./api";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App = () => {
  const [events, setEvents] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [currentCity, setCurrentCity] = useState("all");
  const [currentNOE, setCurrentNOE] = useState(32);

  const fetchData = useCallback(async () => {
    const allEvents = await getEvents();
    if (allEvents) {
      const filteredEvents =
        currentCity === "all"
          ? allEvents
          : allEvents.filter((event) => event.location === currentCity);
      setEvents(filteredEvents.slice(0, currentNOE));
      setAllLocations(extractLocations(allEvents));
    } else {
      setEvents([]);
      setAllLocations([]);
    }
  }, [currentCity, currentNOE]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="App">
      <CitySearch allLocations={allLocations} setCurrentCity={setCurrentCity} />
      <br />
      <NumberOfEvents setCurrentNOE={setCurrentNOE} />
      <br />

      {events.length === 0 ? <p>No events found in {currentCity}</p> : null}
      <EventList events={events} />
    </div>
  );
};

export default App;
