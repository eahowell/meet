// src/__tests__/App.test.js

import { render, screen, waitFor, within } from "@testing-library/react";
import App from "../App";
import { getEvents } from "../api";
import mockData from "../mock-data";
import userEvent from "@testing-library/user-event";

jest.mock("../api", () => ({
  getEvents: jest.fn(),
  extractLocations: jest.requireActual("../api").extractLocations,
}));

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

describe("<App /> integration", () => {
  beforeEach(() => {
    getEvents.mockResolvedValue(mockData);
  });
  test("renders a list of events matching the city selected by the user", async () => {
    render(<App />);

    const cityTextBox = screen.getByRole("textbox", { name: /city search/i });
    await userEvent.click(cityTextBox);
    await userEvent.type(cityTextBox, "Berlin");

    const suggestionList = await screen.findByTestId("suggestions-list");
    const berlinSuggestion =
      within(suggestionList).getByText("Berlin, Germany");
    await userEvent.click(berlinSuggestion);

    await waitFor(() => {
      const eventList = screen.getByTestId("event-list");
      const eventItems = within(eventList).getAllByRole("listitem");
      const berlinEvents = mockData.filter((event) =>
        event.location.includes("Berlin")
      );
      expect(eventItems).toHaveLength(berlinEvents.length);
    });
  });
});
