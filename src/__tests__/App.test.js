/* eslint-disable testing-library/no-wait-for-multiple-assertions */
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

  test("displays no events and no location suggestions when getEvents returns empty array", async () => {
    getEvents.mockResolvedValue([]);
    render(<App />);

    await waitFor(() => {
      // Check that the event list is empty
      const eventList = screen.getByTestId("event-list");
      const events = within(eventList).queryAllByRole("listitem");
      expect(events).toHaveLength(0);
    });

    // Check that the CitySearch component shows no suggestions
    const citySearchInput = screen.getByTestId("city-search-input");
    await userEvent.click(citySearchInput);
    await userEvent.type(citySearchInput, "a");

    await waitFor(() => {
      const suggestionsList = screen.queryByTestId("suggestions-list");
      expect(suggestionsList).toBeInTheDocument();
      const suggestions = within(suggestionsList).queryAllByRole("listitem");
      // There should only be one item: "See all cities"
      expect(suggestions).toHaveLength(1);
      expect(suggestions[0]).toHaveTextContent("See all cities");
    });
  });

  test("handles null return from getEvents", async () => {
    getEvents.mockResolvedValue(null);
    render(<App />);

    await waitFor(() => {
      const eventList = screen.getByTestId("event-list");
      const events = within(eventList).queryAllByRole("listitem");
      expect(events).toHaveLength(0);
    });

    const citySearchInput = screen.getByTestId("city-search-input");
    await userEvent.click(citySearchInput);

    await waitFor(() => {
      const suggestionsList = screen.queryByTestId("suggestions-list");
      expect(suggestionsList).toBeInTheDocument();
      const suggestions = within(suggestionsList).queryAllByRole("listitem");
      expect(suggestions).toHaveLength(1);
      expect(suggestions[0]).toHaveTextContent("See all cities");
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
      const allRenderedEventItems = within(eventList).getAllByRole("listitem");
      const berlinEvents = mockData.filter((event) =>
        event.location.includes("Berlin")
      );
      expect(allRenderedEventItems).toHaveLength(berlinEvents.length);
      // eslint-disable-next-line testing-library/no-wait-for-side-effects
      allRenderedEventItems.forEach((event) => {
        expect(event.textContent).toContain("Berlin, Germany");
      });
    });
  });
});
