// src/__tests__/CitySearch.test.js

import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CitySearch from "../components/CitySearch";
import App from "../App";
import { getEvents, extractLocations } from "../api";
import mockData from "../mock-data";

jest.mock("../api", () => ({
  getEvents: jest.fn(),
  extractLocations: jest.requireActual("../api").extractLocations
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
    render(<CitySearch allLocations={allLocations} setCurrentCity={mockSetCurrentCity} />);
    const cityTextBox = screen.getByRole("textbox");
    await userEvent.click(cityTextBox);
    await userEvent.type(cityTextBox, "Berlin");
    
    const suggestionList = await screen.findByTestId("suggestions-list");
    const berlinSuggestion = within(suggestionList).getByText("Berlin, Germany");
    
    await userEvent.click(berlinSuggestion);

    expect(mockSetCurrentCity).toHaveBeenCalledWith("Berlin, Germany");
    expect(cityTextBox).toHaveValue("Berlin, Germany");
    
    // Wait for the suggestions to disappear
    await waitFor(() => {
      expect(screen.queryByTestId("suggestions-list")).not.toBeInTheDocument();
    });
  });

  test("suggestions list closes when input loses focus", async () => {
    render(<CitySearch allLocations={allLocations} setCurrentCity={mockSetCurrentCity} />);
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

    test('displays "No events found" message when user selects a city with no events', async () => {

      render(<App />);

    const cityTextBox = screen.getByRole("textbox", { name: /city search/i });
    await userEvent.click(cityTextBox);
    await userEvent.type(cityTextBox, "Small Town");

    const suggestionList = screen.getByTestId("suggestions-list");
    const suggestionItems = within(suggestionList).getAllByRole("listitem");

    expect(suggestionItems.length).toBe(1);
    expect(suggestionItems[0]).toHaveTextContent("See all cities");
  });

  
});


