// // src/components/CitySearch.js
// import { useState } from "react";
// import {Form, InputGroup, Navbar, Container} from 'react-bootstrap';
// import BrandImage from "../img/LightLogo.png";

// import ListGroup from "react-bootstrap/ListGroup";

// const CitySearch = ({ allLocations, setCurrentCity }) => {
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [query, setQuery] = useState("");
//   const [suggestions, setSuggestions] = useState([]);

//   const handleInputChanged = (event) => {
//     const value = event.target.value;
//     const filteredLocations = allLocations
//       ? allLocations.filter((location) => {
//           return location.toUpperCase().indexOf(value.toUpperCase()) > -1;
//         })
//       : [];

//     setQuery(value);
//     setSuggestions(filteredLocations);
//   };

//   const handleItemClicked = (event) => {
//     const value = event.target.textContent;
//     setQuery(value);
//     setShowSuggestions(false);
//     setCurrentCity(value);
//   };

//   const handleAllCitiesClicked = (event) => {
//     setQuery("");
//     setShowSuggestions(false);
//     setCurrentCity("all");
//   };
//   return (
//     <Navbar className="bg-body-tertiary justify-content-between">
//       <Container fluid>
//     <Navbar.Brand href="#">
//     <img
//         id="HeaderLogoImage"
//         src={BrandImage}
//         width="350"
//         height="50"
//         alt="Logo for CliqueUP"
//         className="page-header__item img-fluid mx-auto d-block"
//       />
//           </Navbar.Brand>
//     <Form
//       id="city-search"
//       data-testid="city-search"
//       role="region"
//       aria-label="City Search"
      
//     >
//       <InputGroup>
//       <Form.Label htmlFor="city" size = "lg"> City Search:  </Form.Label>
//       <Form.Control
//         type="text"
//         size="lg"
//         className="city mb-2"
//         aria-label="City search"
//         value={query}
//         onChange={handleInputChanged}
//         placeholder="Search for a city"
//         onFocus={() => setShowSuggestions(true)}
//       />
//       {showSuggestions ? (
//         <ul className="suggestions">
//           {suggestions.map((suggestion) => {
//             return (
//               <ListGroup.Item as="li" className="citiesListItem" onClick={handleItemClicked} key={suggestion}>
//                 {suggestion}
//               </ListGroup.Item>
//             );
//           })}
//           <li as="li"  className="citiesListItem" key="See all cities" onClick={handleAllCitiesClicked}>
//             <b>See all cities</b>
//           </li>
//         </ul>
//       ) : null}
//       </InputGroup>
//     </Form>
//     </Container>
// </Navbar>
//   );
// };

// export default CitySearch;
import React, { useState } from 'react';
import { Form, InputGroup, Navbar, Container, ListGroup, CloseButton } from 'react-bootstrap';
import BrandImage from "../img/LightLogo.png";

const CitySearch = ({ allLocations, setCurrentCity }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChanged = (event) => {
    const value = event.target.value;
    const filteredLocations = allLocations
      ? allLocations.filter((location) => {
          return location.toUpperCase().indexOf(value.toUpperCase()) > -1;
        })
      : [];

    setQuery(value);
    setSuggestions(filteredLocations);
  };

  const handleItemClicked = (event) => {
    const value = event.target.textContent;
    setQuery(value);
    setShowSuggestions(false);
    setCurrentCity(value);
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
          style={{maxWidth: '500px'}}
        >
          <InputGroup className="w-100">
            <Form.Label htmlFor="city" size="lg" className="w-100 text-center mb-2">City Search: </Form.Label>
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
              />
              {query && (
                <CloseButton
                  className="position-absolute top-50 end-0 translate-middle-y pe-3"
                  onClick={handleAllCitiesClicked}
                  aria-label="Clear selection"
                />
              )}
            </div>
            {showSuggestions && (
              <ul className="suggestions w-100">
                {suggestions.map((suggestion) => (
                  <ListGroup.Item 
                    as="li" 
                    className="citiesListItem" 
                    onClick={handleItemClicked} 
                    key={suggestion}
                  >
                    {suggestion}
                  </ListGroup.Item>
                ))}
                <li 
                  className="citiesListItem" 
                  onClick={handleAllCitiesClicked}
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