// src/__tests__/CityEventsChart.test.js
import React from 'react';
import { render } from '@testing-library/react';
import CityEventsChart from '../components/CityEventsChart';
import { ThemeProvider } from '../contexts/ThemeContext';

const renderWithTheme = (component) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('<CityEventsChart />', () => {
  it('renders without crashing', () => {
    const mockEvents = [{ location: 'Berlin, Germany' }, { location: 'Berlin, Germany' }];
    const mockLocations = ['Berlin, Germany', 'London, UK'];
    renderWithTheme(<CityEventsChart events={mockEvents} allLocations={mockLocations} />);
  });

  // FIXME: Add more tests as needed
});