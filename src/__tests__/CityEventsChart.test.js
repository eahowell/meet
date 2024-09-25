// src/components/CityEventsChart.js
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import CityEventsChart from "../components/CityEventsChart";
import { ThemeProvider } from "../contexts/ThemeContext";
import { getEvents, extractLocations } from "../api";
import "@testing-library/jest-dom";
import mockData from "../mock-data";

jest.mock("../api", () => ({
  getEvents: jest.fn(),
  extractLocations: jest.requireActual("../api").extractLocations,
}));

jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts')
  return {
      ...OriginalModule,
      ResponsiveContainer: ({ children }) => (
          <OriginalModule.ResponsiveContainer width={800} height={800}>
              {children}
          </OriginalModule.ResponsiveContainer>
      ),
  }
})

const renderWithTheme = (component) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe("<CityEventsChart />", () => {
  let allLocations;

  beforeEach(() => {
    allLocations = extractLocations(mockData);
    getEvents.mockResolvedValue(mockData);
  });

  test('renders chart with correct data representation', async () => { 
    renderWithTheme(<CityEventsChart events={mockData} allLocations={allLocations} />);

    await waitFor(() => {
      expect(screen.getByTestId('scatterChart')).toBeInTheDocument();
    });


    expect(screen.getByText('London')).toBeInTheDocument()
    expect(screen.getByText('Berlin')).toBeInTheDocument()

    // Check for axes
    expect(screen.getByText('Number of Events')).toBeInTheDocument();

    // Check for data points
    const dataPoints = screen.getAllByRole('img');
    expect(dataPoints.length).toBeGreaterThan(0);
  });

  test("renders chart with empty data set", async () => {
    renderWithTheme(<CityEventsChart events={[]} allLocations={[]} />);
    

    const noDataMessage = await screen.findByText(
      "No data available for chart"
    );
    expect(noDataMessage).toBeInTheDocument();
  });
});
