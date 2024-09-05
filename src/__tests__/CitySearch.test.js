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
  let mockAllLocations;
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockAllLocations = ["Berlin, Germany", "London, UK", "New York, NY, USA", "Tokyo, Japan", "Mumbai, Maharashtra, India", "Nairobi, Kenya", "Santiago, Santiago Metropolitan Region, Chile"];
    extractLocations.mockReturnValue(mockAllLocations);
    getEvents.mockResolvedValue(mockData);
    console.log("Before each - mockAllLocations:", mockAllLocations);
  });

  const mockSetCurrentCity = jest.fn();

  test("renders text input", () => {
    render(<CitySearch allLocations={mockAllLocations} setCurrentCity={mockSetCurrentCity} />);
    const cityTextBox = screen.getByRole("textbox");
    expect(cityTextBox).toBeInTheDocument();
    expect(cityTextBox).toHaveClass("city");
  });

  test("suggestions list is hidden by default", () => {
    render(<CitySearch allLocations={mockAllLocations} setCurrentCity={mockSetCurrentCity} />);
    const suggestionList = screen.queryByTestId("suggestions-list");
    expect(suggestionList).not.toBeInTheDocument();
  });

  test("renders a list of suggestions when city textbox gains focus", async () => {
    render(<CitySearch allLocations={mockAllLocations} setCurrentCity={mockSetCurrentCity} />);
    const cityTextBox = screen.getByRole("textbox");
    await userEvent.click(cityTextBox);
    const suggestionList = await screen.findByTestId("suggestions-list");
    expect(suggestionList).toBeInTheDocument();
  });

  test("updates list of suggestions correctly when user types in city textbox", async () => {
    console.log("Test start - mockAllLocations:", mockAllLocations);
    render(<CitySearch allLocations={mockAllLocations} setCurrentCity={mockSetCurrentCity} />);
    const cityTextBox = screen.getByRole("textbox");
    await userEvent.type(cityTextBox, "Berlin");

    // Wait for suggestions to appear
    await waitFor(() => {
      const suggestionList = screen.getByTestId("suggestions-list");
      expect(suggestionList).toBeInTheDocument();
    });

    const suggestionList = screen.getByTestId("suggestions-list");
    const suggestionItems = within(suggestionList).getAllByRole("listitem");

    console.log("Test - mockAllLocations:", mockAllLocations);
    console.log("Test - suggestionItems:", suggestionItems.map(item => item.textContent));

    const filteredLocations = mockAllLocations.filter((location) =>
      location.toUpperCase().includes("BERLIN")
    );

    expect(suggestionItems.length).toBe(filteredLocations.length + 1); // +1 for "See all cities"
    filteredLocations.forEach((location, index) => {
      expect(suggestionItems[index]).toHaveTextContent(location);
    });
  });

  test("user can select a city from the list of suggestions", async () => {
    render(<CitySearch allLocations={mockAllLocations} setCurrentCity={mockSetCurrentCity} />);
    const cityTextBox = screen.getByRole("textbox");
    await userEvent.type(cityTextBox, "Berlin");
    
    // Wait for suggestions to appear
    await waitFor(() => {
      const suggestionList = screen.getByTestId("suggestions-list");
      expect(suggestionList).toBeInTheDocument();
    });

    const suggestionList = screen.getByTestId("suggestions-list");
    const suggestionItems = within(suggestionList).getAllByRole("listitem");
    
    console.log("Test - Suggestion items:", suggestionItems.map(item => item.textContent));

    const berlinSuggestion = suggestionItems.find(item => item.textContent.includes("Berlin"));
    expect(berlinSuggestion).toBeTruthy();
    
    await userEvent.click(berlinSuggestion);

    expect(mockSetCurrentCity).toHaveBeenCalledWith("Berlin, Germany");
    expect(cityTextBox).toHaveValue("Berlin, Germany");
    expect(screen.queryByTestId("suggestions-list")).not.toBeInTheDocument();
  });
});

describe("<CitySearch /> integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const mockAllLocations = ["Berlin, Germany", "London, UK", "New York, NY, USA", "Tokyo, Japan", "Mumbai, Maharashtra, India", "Nairobi, Kenya", "Santiago, Santiago Metropolitan Region, Chile"];
    extractLocations.mockReturnValue(mockAllLocations);
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
    
    console.log("Integration test - Suggestion items:", suggestionItems.map(item => item.textContent));
    
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
    
    console.log("Integration test - Suggestion items after typing:", suggestionItems.map(item => item.textContent));

    const berlinSuggestion = suggestionItems.find(item => item.textContent.includes("Berlin"));
    expect(berlinSuggestion).toBeTruthy();
    
    await userEvent.click(berlinSuggestion);

    const eventList = await screen.findByTestId("event-list");
    const eventItems = within(eventList).getAllByRole("listitem");
    
    const berlinEvents = mockData.filter((event) => event.location.includes("Berlin"));
    expect(eventItems).toHaveLength(berlinEvents.length);
  });
});

// describe("<CitySearch /> integration", () => {
//   beforeEach(() => {
//     getEvents.mockClear();
//   });
//   test("renders suggestions list when the search input is focused", async () => {    
//     const user = userEvent.setup();
//     render(<App />);
//     getEvents.mockResolvedValue(mockData);
//     const allEvents = await getEvents();
//     const allLocations = extractLocations(allEvents);
//     console.log("allLocations: ", allLocations);
//     const cityTextBox = screen.getByTestId("city-search-input");
//     await user.click(cityTextBox);
//     const suggestionList = screen.getByTestId("suggestions-list");
//     const suggestionItems = within(suggestionList).getAllByLabelText("listitem");
    
//     console.log("suggestionItems: ", suggestionItems);
//       expect(suggestionItems.length).toBeGreaterThan(allLocations.length);
//   });

//   test("updates filtered events when a city is selected", async () => {
//     const user = userEvent.setup();
//     getEvents.mockResolvedValue(mockData);
//     extractLocations.mockReturnValue(mockData);

//     render(<App />);

//     const cityTextBox = screen.getByTestId("city-search-input");
//     await user.click(cityTextBox);
//     await user.type(cityTextBox, "Berlin");

//     // Wait for and select the Berlin suggestion from the list
//     await waitFor(() => {
//       const suggestionList = screen.getByTestId("suggestions-list");
//       const berlinSuggestion =
//         within(suggestionList).queryByText("Berlin, Germany");
//       if (berlinSuggestion) {
//         user.click(berlinSuggestion);
//       } else {
//         throw new Error("Berlin suggestion not found");
//       }
//     });

//     // Wait for events to be filtered
//     await waitFor(() => {
//       const eventList = screen.getByTestId("event-list");
//       const eventItems = within(eventList).getAllByRole("listitem");
//       expect(eventItems.length).toBeGreaterThan(0);
//       const berlinEvents = eventItems.filter((item) =>
//         within(item).queryByText(/Berlin, Germany/i)
//       );
//       // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
//       expect(berlinEvents.length).toBe(eventItems.length);
//     });
//   });

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
// });
