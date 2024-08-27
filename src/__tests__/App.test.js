
// src/__tests__/App.test.js

import { render, screen } from "@testing-library/react";
import App from "../App";

describe("<App /> component", () => {
  test("renders list of events", () => {
    render(<App />);
    const eventList = screen.getByTestId("event-list");
    expect(eventList).toBeInTheDocument();
  });
});