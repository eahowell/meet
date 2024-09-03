/* eslint-disable testing-library/no-debugging-utils */
// src/__tests__/CitySearch.test.js

import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CitySearch from "../components/CitySearch";
import App from "../App";
import { getEvents, extractLocations } from "../api";
import "@testing-library/jest-dom";
import mockData from "../mock-data";

jest.mock("../api");
jest.setTimeout(15000);

describe("<CitySearch /> component", () => {
  beforeEach(() => {
    getEvents.mockClear();
  });
  test("renders text input", () => {
    render(<CitySearch />);
    const cityTextBox = screen.getByRole("textbox");
    expect(cityTextBox).toBeInTheDocument();
    expect(cityTextBox).toHaveClass("city");
  });

  test("suggestions list is hidden by default", () => {
    render(<CitySearch />);
    const suggestionList = screen.queryByRole("list");
    expect(suggestionList).not.toBeInTheDocument();
  });

  test("renders a list of suggestions when city textbox gains focus", async () => {
    render(<CitySearch />);
    const user = userEvent.setup();
    const cityTextBox = screen.getByRole("textbox");
    await user.click(cityTextBox);
    const suggestionList = screen.getByRole("list");
    expect(suggestionList).toBeInTheDocument();
    expect(suggestionList).toHaveClass("suggestions");
  });

  test("updates list of suggestions correctly when user types in city textbox", async () => {
    const user = userEvent.setup();
    const allEvents = await getEvents();
    const allLocations = extractLocations(allEvents);

    render(<CitySearch allLocations={allLocations} />);

    // user types "Berlin" in city textbox
    const cityTextBox = screen.getByRole("textbox");
    await user.type(cityTextBox, "Berlin");

    // filter allLocations to locations matching "Berlin"
    const suggestions = allLocations
      ? allLocations.filter((location) => {
          return (
            location.toUpperCase().indexOf(cityTextBox.value.toUpperCase()) > -1
          );
        })
      : [];

    // get all <li> elements inside the suggestion list
    const suggestionListItems = screen.getAllByRole("listitem");
    expect(suggestionListItems).toHaveLength(suggestions.length + 1);

    suggestions.forEach((suggestion, index) => {
      expect(suggestionListItems[index]).toHaveTextContent(suggestion);
    });
  });

  test("user can type a city and then clear it by clicking the X", async () => {
    const user = userEvent.setup();
    const mockSetCurrentCity = jest.fn();
    const mockAllLocations = ["New York", "Los Angeles", "Chicago"];
    render(
      <CitySearch
        allLocations={mockAllLocations}
        setCurrentCity={mockSetCurrentCity}
      />
    );

    const searchInput = screen.getByTestId("city-search-input");

    // Type "Berlin" into the search input
    await user.type(searchInput, "Berlin, Germany");

    // Click the "X" element
    const clearSelectionElement = screen.getByTestId("clear-selection");
    await user.click(clearSelectionElement);

    // Check if setCurrentCity was called with "all"
    expect(mockSetCurrentCity).toHaveBeenCalledWith("all");
  });

  test("user can type a city and click see all cities to get full list", async () => {
    const user = userEvent.setup();
    const mockSetCurrentCity = jest.fn();
    const mockAllLocations = ["New York", "Los Angeles", "Chicago"];
    render(
      <CitySearch
        allLocations={mockAllLocations}
        setCurrentCity={mockSetCurrentCity}
      />
    );

    const searchInput = screen.getByTestId("city-search-input");

    // Type "Berlin" into the search input
    await user.type(searchInput, "Berlin, Germany");

    // Find and click the "See all cities" element
    const seeAllCitiesElement = screen.getByTestId("see-all-cities");
    await user.click(seeAllCitiesElement);

    // Check if setCurrentCity was called with "all"
    expect(mockSetCurrentCity).toHaveBeenCalledWith("all");
  });
});

describe("CitySearch integration", () => {
  beforeEach(() => {
    getEvents.mockClear();
  });
  test("renders suggestions list when the search input is focused", async () => {
    const user = userEvent.setup();
    getEvents.mockResolvedValue(mockData);
    const locations = [...new Set(mockData.map((event) => event.location))];

    render(<App />);

    const searchInput = await screen.findByRole("textbox", { name: /city search/i });
    await user.click(searchInput);

    await waitFor(() => {
      const suggestionList = screen.getByTestId("suggestions-list");
      const suggestionItems = within(suggestionList).getAllByRole("listitem");
      expect(suggestionItems).toHaveLength(locations.length + 1); // +1 for "See all cities"
    }, { timeout: 10000 });
  });

  test('displays "No events found" message when user selects a city with no events', async () => {
    const user = userEvent.setup();

    getEvents.mockResolvedValue(mockData);
    extractLocations.mockReturnValue(["New York, USA", "London, UK", "Small Town"]);

    render(<App />);
    const citySearchInput = await screen.findByRole("textbox", {
      name: /city search/i,
    });
    await user.click(citySearchInput);
    await user.type(citySearchInput, "Small Town");

    const smallTownSuggestion = await screen.findByText("Small Town");
    await user.click(smallTownSuggestion);

    const noEventsMessage = await screen.findByText(
      /No events found in Small Town/i
    );
    expect(noEventsMessage).toBeInTheDocument();
  });
});
