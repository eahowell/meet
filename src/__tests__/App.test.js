// src/__tests__/App.test.js

import { render, screen, waitFor } from "@testing-library/react";
import App from "../App";
import { getEvents } from "../api";
import mockData from "../mock-data";

jest.mock("../api");

describe("<App /> component", () => {
  beforeEach(() => {
    getEvents.mockClear();
  });

  test("renders CitySearch", async () => {
    getEvents.mockResolvedValue([]);
    render(<App />);
    await waitFor(() => {
      const citySearch = screen.getByTestId("city-search");
      expect(citySearch).toBeInTheDocument();
    });
  });

  test("renders NumberOfEvents", async () => {
    getEvents.mockResolvedValue([]);
    render(<App />);
    await waitFor(() => {
      const numberOfEvents = screen.getByTestId("number-of-events");
      expect(numberOfEvents).toBeInTheDocument();
    });
  });

  test("renders EventList", async () => {
    getEvents.mockResolvedValue([]);
    render(<App />);
    await waitFor(() => {
      const eventList = screen.getByTestId("event-list");
      expect(eventList).toBeInTheDocument();
    });
  });

  test("renders list of events when events are available", async () => {
    getEvents.mockResolvedValue(mockData);
    render(<App />);
    await waitFor(() => {
      const eventListItems = screen.getAllByRole("listitem");
      expect(eventListItems).toHaveLength(Math.min(32, mockData.length));
    });
  });
});
