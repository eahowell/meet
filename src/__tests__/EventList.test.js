// src/__tests__/EventList.test.js

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EventList from "../components/EventList";

describe("<EventList /> component", () => {
  // Opted to not use the beforeEach for rendering the EventList due to "Forbidden usage of render within testing framework beforeEach" error

  const mockEvents = [
    {
      id: 1,
      summary: "Event 1",
      description: "Description 1",
      location: "Test Location",
      start: {
        dateTime: "2023-06-15T19:00:00+02:00",
        timeZone: "Europe/Berlin",
      },
      htmlLink:
        "https://www.google.com/calendar/event?eid=NGVhaHM5Z2hraHJ2a2xkNzJob2d1OXBoM2VfMjAyMDA1MTlUMTQwMDAwWiBmdWxsc3RhY2t3ZWJkZXZAY2FyZWVyZm91bmRyeS5jb20",
      organizer: {
        email: "fullstackwebdev@careerfoundry.com",
        self: true,
      },
    },
    {
      id: 2,
      summary: "Event 2",
      description: "Description 2",
      location: "Test Location",
      start: {
        dateTime: "2023-06-15T19:00:00+02:00",
        timeZone: "Europe/Berlin",
      },
      htmlLink:
        "https://www.google.com/calendar/event?eid=NGVhaHM5Z2hraHJ2a2xkNzJob2d1OXBoM2VfMjAyMDA1MTlUMTQwMDAwWiBmdWxsc3RhY2t3ZWJkZXZAY2FyZWVyZm91bmRyeS5jb20",
      organizer: {
        email: "fullstackwebdev@careerfoundry.com",
        self: true,
      },
    },
    {
      id: 3,
      summary: "Event 3",
      description: "Description 3",
      location: "Test Location",
      start: {
        dateTime: "2023-06-15T19:00:00+02:00",
        timeZone: "Europe/Berlin",
      },
      htmlLink:
        "https://www.google.com/calendar/event?eid=NGVhaHM5Z2hraHJ2a2xkNzJob2d1OXBoM2VfMjAyMDA1MTlUMTQwMDAwWiBmdWxsc3RhY2t3ZWJkZXZAY2FyZWVyZm91bmRyeS5jb20",
      organizer: {
        email: "fullstackwebdev@careerfoundry.com",
        self: true,
      },
    },
  ];

  test('has an element with "list" role', () => {
    render(<EventList />);
    const list = screen.getByRole("list");
    expect(list).toBeInTheDocument();
  });

  test("renders correct number of events", () => {
    render(<EventList events={mockEvents} />);
    const eventElements = screen.getAllByRole("listitem");
    expect(eventElements).toHaveLength(mockEvents.length);
  });
  test("renders all events", () => {
    render(<EventList events={mockEvents} />);
    mockEvents.forEach((event) => {
      expect(screen.getByText(event.summary)).toBeInTheDocument();
    });
  });

  test('collapses all expanded event details when "Collapse All" is clicked', () => {
    render(<EventList events={mockEvents} />);

    // Expand all events
    const showDetailsButtons = screen.getAllByText("Show Details");
    showDetailsButtons.forEach((button) => fireEvent.click(button));

    // Verify all events are expanded
    mockEvents.forEach((event) => {
      expect(screen.getByText(event.description)).toBeInTheDocument();
    });

    // Click "Collapse All" button
    const collapseAllButton = screen.getByText("Collapse All");
    fireEvent.click(collapseAllButton);

    // Verify all events are collapsed
    mockEvents.forEach((event) => {
      expect(screen.queryByText(event.description)).not.toBeInTheDocument();
    });
  });
});
