// src/App.js

import React, { useState, useEffect, useCallback, lazy, Suspense } from "react";

import { getEvents, extractLocations } from "./api";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Navbar, Container } from "react-bootstrap";
import BrandImage from "./img/LightLogo.webp";
import Spinner from "./components/Spinner";
import { InfoAlert, ErrorAlert } from "./components/Alert";
import { ThemeProvider } from "./contexts/ThemeContext";

const EventList = lazy(() => import("./components/EventList"));
const CitySearch = lazy(() => import("./components/CitySearch"));
const NumberOfEvents = lazy(() => import("./components/NumberOfEvents"));

const App = () => {
  const [events, setEvents] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [currentCity, setCurrentCity] = useState("all");
  const [currentNOE, setCurrentNOE] = useState(32);
  const [isLoading, setIsLoading] = useState(true);
  const [infoAlert, setInfoAlert] = useState("");

  const [errorAlert, setErrorAlert] = useState("");

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
    <ThemeProvider>
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
            <div className="alerts-container">
              {infoAlert.length ? <InfoAlert text={infoAlert} /> : null}
              {errorAlert.length ? <ErrorAlert text={errorAlert} /> : null}
            </div>
            <Suspense fallback={<Spinner />}>
              <CitySearch
                allLocations={allLocations}
                setCurrentCity={setCurrentCity}
                setInfoAlert={setInfoAlert}
              />
              <br />

              <NumberOfEvents
                setCurrentNOE={setCurrentNOE}
                setErrorAlert={setErrorAlert}
              />
              <br />
              <EventList events={events} />
            </Suspense>
            {!isLoading && events.length === 0 && (
              <p className="noEventsText">
                No events found. Try refreshing the data and ensure you've
                connected your gmail account.
              </p>
            )}
          </Container>
        </Navbar>
      </div>
    </ThemeProvider>
  );
};

export default App;
