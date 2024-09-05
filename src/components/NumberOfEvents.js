// src/components/NumberOfEvents.js
import { useState } from "react";

const NumberOfEvents = ({ setCurrentNOE }) => {
  const [inputValue, setInputValue] = useState("32");

  const handleInputChanged = (event) => {
    const value = event.target.value;
    // const numberValue = Math.abs(Math.round(Number(value)));
    setInputValue(value);
    setCurrentNOE(Number(value)); // Update the NOE in the parent component
  };

  return (
    <div id="number-of-events" data-testid="number-of-events">
      <label htmlFor="number-of-events">
        Number of Events:
        <input
          type="text"
          className="number-of-events"
          aria-label="Number of Events"
          value={inputValue}
          onChange={handleInputChanged}
          onClick={(e) => e.target.select()}
          onFocus={(e) => e.target.select()}
          placeholder="Enter number of events"
          min="1"
        />
      </label>
    </div>
  );
};

export default NumberOfEvents;
