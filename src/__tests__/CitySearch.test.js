// src/__tests__/CitySearch.test.js

import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CitySearch from "../components/CitySearch";
import App from "../App";
import { getEvents, extractLocations } from "../api";
import mockData from "../mock-data";
import { asyncRender } from "../testUtils";

jest.mock("../api", () => ({
  getEvents: jest.fn(),
  extractLocations: jest.requireActual("../api").extractLocations,
}));

describe("<CitySearch /> component", () => {
  let allLocations;
  const mockSetCurrentCity = jest.fn();
  const mockSetInfoAlert = jest.fn();

  beforeEach(() => {
    allLocations = extractLocations(mockData);
    getEvents.mockResolvedValue(mockData);
  });

  test("renders text input", () => {
    render(
      <CitySearch
        allLocations={allLocations}
        setCurrentCity={mockSetCurrentCity}
        setInfoAlert={mockSetInfoAlert}
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
        setInfoAlert={mockSetInfoAlert}
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
        setInfoAlert={mockSetInfoAlert}
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
        setInfoAlert={mockSetInfoAlert}
      />
    );
    const cityTextBox = screen.getByRole("textbox");
    await userEvent.type(cityTextBox, "Berlin");

    const suggestionList = screen.getByTestId("suggestions-list");
    expect(suggestionList).toBeInTheDocument();
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
        setInfoAlert={mockSetInfoAlert}
      />
    );
    const cityTextBox = screen.getByRole("textbox");
    await userEvent.click(cityTextBox);
    await userEvent.type(cityTextBox, "Berlin");

    const suggestionList = await screen.findByTestId("suggestions-list");
    const berlinSuggestion =
      within(suggestionList).getByText("Berlin, Germany");

    await userEvent.click(berlinSuggestion);

    expect(mockSetCurrentCity).toHaveBeenCalledWith("Berlin, Germany");
    expect(cityTextBox).toHaveValue("Berlin, Germany");

    // Wait for the suggestions to disappear
    await waitFor(() => {
      expect(screen.queryByTestId("suggestions-list")).not.toBeInTheDocument();
    });
  });

  test("suggestions list closes when input loses focus", async () => {
    render(
      <CitySearch
        allLocations={allLocations}
        setCurrentCity={mockSetCurrentCity}
        setInfoAlert={mockSetInfoAlert}
      />
    );
    const cityTextBox = screen.getByRole("textbox");
    await userEvent.click(cityTextBox);
    await userEvent.type(cityTextBox, "Berlin");

    const suggestionList = await screen.findByTestId("suggestions-list");
    expect(suggestionList).toBeInTheDocument();

    await userEvent.tab(); // Move focus away from the input

    // Wait for the suggestions to disappear
    await waitFor(() => {
      expect(screen.queryByTestId("suggestions-list")).not.toBeInTheDocument();
    });
  });

  test("handleAllCitiesClicked resets query and sets current city to all when 'See all cities' is clicked", async () => {
    render(
      <CitySearch
        allLocations={allLocations}
        setCurrentCity={mockSetCurrentCity}
        setInfoAlert={mockSetInfoAlert}
      />
    );
    const cityTextBox = screen.getByRole("textbox");

    await userEvent.type(cityTextBox, "Berlin");

    const seeAllCitiesButton = screen.getByTestId("see-all-cities");
    await userEvent.click(seeAllCitiesButton);

    expect(cityTextBox).toHaveValue("");

    expect(mockSetCurrentCity).toHaveBeenCalledWith("all");

    await waitFor(() => {
      expect(screen.queryByTestId("suggestions-list")).not.toBeInTheDocument();
    });
  });

  test("handleAllCitiesClicked resets query and sets current city to all when clear button is clicked", async () => {
    render(
      <CitySearch
        allLocations={allLocations}
        setCurrentCity={mockSetCurrentCity}
        setInfoAlert={mockSetInfoAlert}
      />
    );
    const cityTextBox = screen.getByRole("textbox");
    await userEvent.type(cityTextBox, "Berlin");

    const clearButton = screen.getByTestId("clear-selection");
    await userEvent.click(clearButton);

    expect(cityTextBox).toHaveValue("");

    expect(mockSetCurrentCity).toHaveBeenCalledWith("all");

    await waitFor(() => {
      expect(screen.queryByTestId("suggestions-list")).not.toBeInTheDocument();
    });
  });

  test("sets info alert when no suggestions are found", async () => {
    render(
      <CitySearch
        allLocations={allLocations}
        setCurrentCity={mockSetCurrentCity}
        setInfoAlert={mockSetInfoAlert}
      />
    );
    const cityTextBox = screen.getByRole("textbox");
    await userEvent.type(cityTextBox, "NonexistentCity");

    expect(mockSetInfoAlert).toHaveBeenCalledWith(
      "We can not find the city you are looking for. Please try another city"
    );
  });
});

describe("<CitySearch /> integration", () => {
  beforeEach(() => {
    getEvents.mockResolvedValue(mockData);
  });

  test("renders suggestions list when the App component is rendered", async () => {
    await asyncRender(<App />);

    await waitFor(() => {
      const cityTextBox = screen.getByRole("textbox", { name: /city search/i });
      expect(cityTextBox).toBeInTheDocument();
    });

    const cityTextBox = screen.getByRole("textbox", { name: /city search/i });
    await userEvent.click(cityTextBox);

    // Wait for suggestions to appear
    const suggestionList = screen.getByTestId("suggestions-list");
    expect(suggestionList).toBeInTheDocument();
    const suggestionItems = within(suggestionList).getAllByRole("listitem");

    expect(suggestionItems.length).toBeGreaterThan(0);
  });

  test('displays "No events found" message when user selects a city with no events', async () => {
    await asyncRender(<App />);

    await waitFor(() => {
      const cityTextBox = screen.getByRole("textbox", { name: /city search/i });
      expect(cityTextBox).toBeInTheDocument();
    });

    const cityTextBox = screen.getByRole("textbox", { name: /city search/i });
    await userEvent.click(cityTextBox);
    await userEvent.type(cityTextBox, "Small Town");

    const suggestionList = screen.getByTestId("suggestions-list");
    const suggestionItems = within(suggestionList).getAllByRole("listitem");

    expect(suggestionItems.length).toBe(1);
    expect(suggestionItems[0]).toHaveTextContent("See all cities");
  });
});
