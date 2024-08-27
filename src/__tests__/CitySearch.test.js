/* eslint-disable testing-library/no-debugging-utils */
// src/__tests__/CitySearch.test.js

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CitySearch from "../components/CitySearch";
import App from "../App";
import { getEvents, extractLocations } from "../api";

jest.mock("../api");

describe("<CitySearch /> component", () => {
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

  test('displays "No events found" message when user selects a city with no events', async () => {
    const user = userEvent.setup();

    // Mock data
    const mockEvents = [
      { id: 1, location: "New York" },
      { id: 2, location: "London" },
      // No events in "Small Town"
    ];

    // Mock API functions
    getEvents.mockResolvedValue(mockEvents);
    extractLocations.mockReturnValue(["New York", "London", "Small Town"]);

    // Render the App component
    render(<App />);
    // Log the rendered output
    // console.log("Rendered App:");
    // screen.debug();
    // Find and click the city search input
    const citySearchInput = screen.getByRole("textbox", {
      name: /city search/i,
    });
    await user.click(citySearchInput);
    await user.type(citySearchInput, "Small Town");

    // Find and click the "Small Town" suggestion
    const smallTownSuggestion = await screen.findByText("Small Town");
    await user.click(smallTownSuggestion);

    // Log the rendered output after selection
    // console.log("Rendered App after city selection:");
    // screen.debug();

    // Check that the EventList is empty
    const eventList = screen.getByTestId("event-list");
    const eventItems = within(eventList).queryAllByRole("listitem");
    expect(eventItems).toHaveLength(0);

    // Check for a message indicating no events found
    // Note: You'll need to add this message to your App or EventList component
    const noEventsMessage = screen.getByText(/No events found in Small Town/i);
    expect(noEventsMessage).toBeInTheDocument();
  });
});
