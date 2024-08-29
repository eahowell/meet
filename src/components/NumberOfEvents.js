// src/components/NumberOfEvents.js
import { useState } from "react";

const NumberOfEvents = () => {
  const [numberOfEvents, setNumberOfEvents] = useState(32);

  const handleInputChanged = (event) => {
    const value = event.target.value;
    let newValue;

    if (value === "" || isNaN(value)) {
      newValue = 32;
    } else {
      const numberValue = Number(value);
      if (numberValue <= 0) {
        newValue = 1;
      } else {
        newValue = Math.round(numberValue);
      }
    }

    setNumberOfEvents(newValue);
  };

  return (
    <div id="number-of-events" data-testid="number-of-events">
        <label htmlFor="number-of-events" >
        Number of Events:
      <input
        type="number"
        className="number-of-events"
        aria-label="Number of Events"
        value={numberOfEvents}
        onChange={handleInputChanged}
        placeholder="Enter number of events"
        min="1"
      />
        </label>
    </div>
  );
};

export default NumberOfEvents;
