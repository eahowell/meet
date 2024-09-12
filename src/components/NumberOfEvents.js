// src/components/NumberOfEvents.js
import { useState, useEffect } from "react";
import { Form, InputGroup, Col, Row, OverlayTrigger, Tooltip } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
const NumberOfEvents = ({ setCurrentNOE }) => {
  const [inputValue, setInputValue] = useState("32");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust this breakpoint as needed
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

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

  const resetTooltip = (props) => (
    <Tooltip id="reset-tooltip" {...props}>
      Reset to default value (32)
    </Tooltip>
  );

  return (
    <Row className=" align-items-center justify-content-center w-100">
      <Col xs="auto">
        <InputGroup
          id="number-of-events"
          data-testid="number-of-events"
          className="co align-items-center"
        >
          <Form.Label htmlFor="number-of-events" className="labelNOE">
            Number of Events:
          </Form.Label>
          <Form.Control
            id="number-of-events"
            type="text"
            className="number-of-events mb-2"
            aria-label="Number of Events"
            data-testid="number-of-events-input"
            value={inputValue}
            onChange={handleInputChanged}
            onClick={(e) => e.target.select()}
            onFocus={(e) => e.target.select()}
            placeholder="Enter number of events"
            min="1"
          />
          <OverlayTrigger
            placement="bottom"
            delay={{ show: 50, hide: 400 }}
            overlay={resetTooltip}
            show={isMobile ? true : undefined}
          >
            <i
              className="bi bi-arrow-clockwise buttonReset"
              onClick={handleClear}
              role="img"
            aria-label="Reset number of events"
            alt-text="Reset number of events"
              style={{ fontSize: "2rem", color: "cornflowerblue", cursor: "pointer" }}
            />
          </OverlayTrigger>
        </InputGroup>
      </Col>
    </Row>
  );
};

export default NumberOfEvents;
