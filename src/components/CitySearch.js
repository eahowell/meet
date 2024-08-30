// src/components/CitySearch.js

import React, { useState } from "react";
import {
  Form,
  InputGroup,
  Navbar,
  Container,
  ListGroup,
  CloseButton,
} from "react-bootstrap";
import BrandImage from "../img/LightLogo.png";

const CitySearch = ({ allLocations, setCurrentCity }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChanged = (event) => {
    const value = event.target.value;
    setQuery(value);
    const filteredLocations = allLocations
      ? allLocations.filter((location) => {
          return location.toUpperCase().indexOf(value.toUpperCase()) > -1;
        })
      : [];
    setSuggestions(filteredLocations);
    setShowSuggestions(true);
  };

  const handleItemClicked = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    setCurrentCity(suggestion);
  };

  const handleAllCitiesClicked = () => {
    setQuery("");
    setShowSuggestions(false);
    setCurrentCity("all");
  };

  return (
    <Navbar className="bg-body-tertiary">
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
        <Form
          id="city-search"
          data-testid="city-search"
          role="region"
          aria-label="City Search"
          className="d-flex flex-column align-items-center justify-content-center w-100"
          style={{ maxWidth: "500px" }}
        >
          <InputGroup className="w-100">
            <Form.Label
              htmlFor="city"
              size="lg"
              className="w-100 text-center mb-2"
            >
              City Search:{" "}
            </Form.Label>
            <div className="position-relative w-100">
              <Form.Control
                id="city"
                type="text"
                size="lg"
                className="city mb-2 pe-5"
                aria-label="City search"
                value={query}
                onChange={handleInputChanged}
                placeholder="Search for a city"
                onFocus={() => setShowSuggestions(true)}
                data-testid="city-search-input"
              />

              <CloseButton
                className="position-absolute top-50 end-0 translate-middle-y pe-3"
                onClick={handleAllCitiesClicked}
                aria-label="Clear selection"
                data-testid="clear-selection"
              />
            </div>
            {showSuggestions && (
              <ul className="suggestions w-100" data-testid="suggestions-list">
                {suggestions.map((suggestion, index) => (
                  <ListGroup.Item
                    as="li"
                    className="citiesListItem"
                    onClick={() => handleItemClicked(suggestion)}
                    key={suggestion}
                    data-testid={`suggestion-${index}`}
                  >
                    {suggestion}
                  </ListGroup.Item>
                ))}
                <li
                  className="citiesListItem"
                  onClick={handleAllCitiesClicked}
                  data-testid="see-all-cities"
                >
                  <b>See all cities</b>
                </li>
              </ul>
            )}
          </InputGroup>
        </Form>
      </Container>
    </Navbar>
  );
};

export default CitySearch;
