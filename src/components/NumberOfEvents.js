// src/components/NumberOfEvents.js
import { useState } from "react";
import { Form, InputGroup, Col, Row } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
const NumberOfEvents = ({ setCurrentNOE }) => {
  const [inputValue, setInputValue] = useState("32");

  const handleInputChanged = (event) => {
    const value = event.target.value;
    // const numberValue = Math.abs(Math.round(Number(value)));
    setInputValue(value);
    setCurrentNOE(Number(value)); // Update the NOE in the parent component
  };
  const handleClear = () => {
    setInputValue("32");
    setCurrentNOE(Number("32"));
  };

  return (
    <Row className=" align-items-center justify-content-center w-100">
      <Col xs="auto">
      {/* <Form> */}
        <InputGroup
          id="number-of-events"
          data-testid="number-of-events"
          className="co align-items-center"
        >
          <Form.Label htmlFor="number-of-events" className="labelNOE">
            Number of Events:
          </Form.Label>
          <Form.Control
          id = "number-of-events"
            type="text"
            className="number-of-events mb-2"
            aria-label="Number of Events"
            value={inputValue}
            onChange={handleInputChanged}
            onClick={(e) => e.target.select()}
            onFocus={(e) => e.target.select()}
            placeholder="Enter number of events"
            min="1"
          />
          
            <i className="bi bi-arrow-clockwise buttonReset" onClick={handleClear} alt="Reset number of events"  style={{ fontSize: "2rem", color: "cornflowerblue" }}></i> {/* Reset icon */}
        </InputGroup>
        {/* </Form> */}
      </Col>
    </Row>
  );
};

export default NumberOfEvents;
