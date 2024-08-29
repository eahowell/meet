// src/__tests__/App.test.js

import { render, screen } from "@testing-library/react";
import App from "../App";

describe("<App /> component", () => {
  // Opted to not use the beforeEach for rendering the app due to "Forbidden usage of render within testing framework beforeEach" error

  test("renders list of events", () => {
    render(<App />);
    const eventList = screen.getByTestId("event-list");
    expect(eventList).toBeInTheDocument();
  });

  test("renders CitySearch", () => {
    render(<App />);
    const citySearch = screen.getByTestId("city-search");
    expect(citySearch).toBeInTheDocument();
  });

  test("renders NumberOfEvents", () => {
    render(<App />);
    const numberOfEvents = screen.getByTestId("number-of-events");
    expect(numberOfEvents).toBeInTheDocument();
  });
});
