// src/App.js

import React, { useState, useEffect, useCallback, lazy, Suspense } from "react";

import { getEvents, extractLocations } from "./api";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Navbar, Container } from "react-bootstrap";
import BrandImage from "./img/LightLogo.png";
import Spinner from './components/Spinner';

const EventList = lazy(() => import('./components/EventList'));
const CitySearch = lazy(() => import('./components/CitySearch'));
const NumberOfEvents = lazy(() => import('./components/NumberOfEvents'));

const App = () => {
  const [events, setEvents] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [currentCity, setCurrentCity] = useState("all");
  const [currentNOE, setCurrentNOE] = useState(32);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
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
    setIsLoading(false);
  }, [currentCity, currentNOE]);

  useEffect(() => {
    fetchData();
  }, [fetchData, currentNOE]);

  return (
    <div className="App">
      
      {isLoading && <Spinner />}
      <Navbar>
        <Container fluid className="d-flex flex-column align-items-center">
          <Navbar.Brand href="#" className="mb-3">
            <img
              id="HeaderLogoImage"
              src={BrandImage}
              width="350"
              height="50"
              alt="Logo for CliqueUP"
              className="page-header__item img-fluid"
            />
          </Navbar.Brand>
          <Suspense fallback={<Spinner />}>
            <CitySearch allLocations={allLocations} setCurrentCity={setCurrentCity} />
            <br />
            <NumberOfEvents setCurrentNOE={setCurrentNOE} />
            <br />
            <EventList events={events} />
          </Suspense>
          {!isLoading && events.length === 0 && (
            <p className="noEventsText">No events found. Try refreshing the data and ensure you've connected your gmail account.</p>
          )}
        </Container>
      </Navbar>
    </div>
  );
};

export default App;
