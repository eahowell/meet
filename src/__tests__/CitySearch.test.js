// src/__tests__/CitySearch.test.js

import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CitySearch from "../components/CitySearch";
import App from "../App";
import { getEvents, extractLocations } from "../api";
import "@testing-library/jest-dom";
import mockData from "../mock-data";

jest.mock("../api", () => ({
  getEvents: jest.fn(),
  extractLocations: jest.requireActual("../api").extractLocations,
}));

describe("<CitySearch /> component", () => {
  let allLocations;

  beforeEach(() => {
    allLocations = extractLocations(mockData);
    getEvents.mockResolvedValue(mockData);
  });

  const mockSetCurrentCity = jest.fn();

  test("renders text input", () => {
    render(
      <CitySearch
        allLocations={allLocations}
        setCurrentCity={mockSetCurrentCity}
      />
    );
    const cityTextBox = screen.getByRole("textbox");
    expect(cityTextBox).toBeInTheDocument();
    expect(cityTextBox).toHaveClass("city");
  });

  test("suggestions list is hidden by default", () => {
    render(
      <CitySearch
        allLocations={allLocations}
        setCurrentCity={mockSetCurrentCity}
      />
    );
    const suggestionList = screen.queryByTestId("suggestions-list");
    expect(suggestionList).not.toBeInTheDocument();
  });

  test("renders a list of suggestions when city textbox gains focus", async () => {
    render(
      <CitySearch
        allLocations={allLocations}
        setCurrentCity={mockSetCurrentCity}
      />
    );
    const cityTextBox = screen.getByRole("textbox");
    await userEvent.click(cityTextBox);
    const suggestionList = await screen.findByTestId("suggestions-list");
    expect(suggestionList).toBeInTheDocument();
  });

  test("updates list of suggestions correctly when user types in city textbox", async () => {
    render(
      <CitySearch
        allLocations={allLocations}
        setCurrentCity={mockSetCurrentCity}
      />
    );
    const cityTextBox = screen.getByRole("textbox");
    await userEvent.type(cityTextBox, "Berlin");

    // Wait for suggestions to appear
    await waitFor(() => {
      const suggestionList = screen.getByTestId("suggestions-list");
      expect(suggestionList).toBeInTheDocument();
    });

    const suggestionList = screen.getByTestId("suggestions-list");
    const suggestionItems = within(suggestionList).getAllByRole("listitem");

    const filteredLocations = allLocations.filter((location) =>
      location.toUpperCase().includes("BERLIN")
    );

    expect(suggestionItems.length).toBe(filteredLocations.length + 1); // +1 for "See all cities"
    filteredLocations.forEach((location, index) => {
      expect(suggestionItems[index]).toHaveTextContent(location);
    });
  });

  test("user can select a city from the list of suggestions", async () => {
    render(
      <CitySearch
        allLocations={allLocations}
        setCurrentCity={mockSetCurrentCity}
      />
    );
    const cityTextBox = screen.getByRole("textbox");
    await userEvent.type(cityTextBox, "Berlin");

    // Wait for suggestions to appear
    await waitFor(() => {
      const suggestionList = screen.getByTestId("suggestions-list");
      expect(suggestionList).toBeInTheDocument();
    });

    const suggestionList = screen.getByTestId("suggestions-list");
    const suggestionItems = within(suggestionList).getAllByRole("listitem");

    const berlinSuggestion = suggestionItems.find((item) =>
      item.textContent.includes("Berlin")
    );
    expect(berlinSuggestion).toBeTruthy();

    await userEvent.click(berlinSuggestion);

    expect(mockSetCurrentCity).toHaveBeenCalledWith("Berlin, Germany");
    expect(cityTextBox).toHaveValue("Berlin, Germany");
    expect(screen.queryByTestId("suggestions-list")).not.toBeInTheDocument();
  });
});

describe("<CitySearch /> integration", () => {
  beforeEach(() => {
    getEvents.mockResolvedValue(mockData);
  });

  test("renders suggestions list when the App component is rendered", async () => {
    render(<App />);

    const cityTextBox = screen.getByRole("textbox", { name: /city search/i });
    await userEvent.click(cityTextBox);

    // Wait for suggestions to appear
    await waitFor(() => {
      const suggestionList = screen.getByTestId("suggestions-list");
      expect(suggestionList).toBeInTheDocument();
    });

    const suggestionList = screen.getByTestId("suggestions-list");
    const suggestionItems = within(suggestionList).getAllByRole("listitem");

    expect(suggestionItems.length).toBeGreaterThan(0);
  });

  test("updates filtered events when a city is selected", async () => {
    render(<App />);

    const cityTextBox = screen.getByRole("textbox", { name: /city search/i });
    await userEvent.type(cityTextBox, "Berlin");

    // Wait for suggestions to appear
    await waitFor(() => {
      const suggestionList = screen.getByTestId("suggestions-list");
      expect(suggestionList).toBeInTheDocument();
    });

    const suggestionList = screen.getByTestId("suggestions-list");
    const suggestionItems = within(suggestionList).getAllByRole("listitem");

    const berlinSuggestion = suggestionItems.find((item) =>
      item.textContent.includes("Berlin")
    );
    expect(berlinSuggestion).toBeTruthy();

    await userEvent.click(berlinSuggestion);

    const eventList = await screen.findByTestId("event-list");
    const eventItems = within(eventList).getAllByRole("listitem");

    const berlinEvents = mockData.filter((event) =>
      event.location.includes("Berlin")
    );
    expect(eventItems).toHaveLength(berlinEvents.length);
  });
});

//   // test('displays "No events found" message when user selects a city with no events', async () => {
//   //   const user = userEvent.setup();

//   //   getEvents.mockResolvedValue(mockData);
//   //   extractLocations.mockReturnValue([
//   //     "New York, USA",
//   //     "London, UK",
//   //     "Small Town",
//   //   ]);

//   //   render(<App />);
//   //   const cityTextBox = screen.getByTestId("city-search-input");
//   //   await user.click(cityTextBox);
//   //   await user.type(cityTextBox, "Small Town");

//   //   const smallTownSuggestion = await screen.findByText("Small Town");
//   //   await user.click(smallTownSuggestion);

//   //   const noEventsMessage = await screen.findByText(
//   //     /No events found in Small Town/i
//   //   );
//   //   expect(noEventsMessage).toBeInTheDocument();
//   // });
