// src/components/EventGenresChart.js

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import EventGenresChart from "../components/EventGenresChart";
import { getEvents } from "../api";
import "@testing-library/jest-dom";
import mockData from "../mock-data";

jest.mock("../api", () => ({
  getEvents: jest.fn(),
  extractLocations: jest.requireActual("../api").extractLocations,
}));
jest.mock("recharts", () => {
  const OriginalModule = jest.requireActual("recharts");
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }) => (
      <OriginalModule.ResponsiveContainer width={800} height={800}>
        {children}
      </OriginalModule.ResponsiveContainer>
    ),
  };
});

describe("<EventGenresChart />", () => {
  beforeEach(() => {
    getEvents.mockResolvedValue(mockData);
  });

  test("renders pie chart correctly", async () => {
    render(<EventGenresChart events={mockData} />);

    await waitFor(() => {
      const pieChart = screen.getByTestId("pieChart");
      expect(pieChart).toBeInTheDocument();
    });

    // Check for data points
    const dataPoints = await screen.findAllByRole("img");
    expect(dataPoints.length).toBeGreaterThan(0);
  });

  test("displays correct genre names", async () => {
    render(<EventGenresChart events={mockData} />);

    await waitFor(() => {
      expect(screen.getByTestId("pieChart")).toBeInTheDocument();
    });

    const genres = ["React", "JavaScript", "Node", "jQuery", "Angular"];
    genres.forEach((genre) => {
      const label = screen.getByText(genre);
      expect(label).toBeInTheDocument();
      expect(label).toHaveTextContent(genre);
    });
  });

  test("handles empty data set", async () => {
    render(<EventGenresChart events={[]} />);

    const noDataMessage = await screen.findByText(
      "No data available for chart"
    );
    expect(noDataMessage).toBeInTheDocument();
  });
});
