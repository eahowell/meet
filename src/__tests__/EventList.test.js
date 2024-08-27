// src/__tests__/EventList.test.js

import { render, screen } from '@testing-library/react';
import EventList from '../components/EventList';

describe('<EventList /> component', () => {
    // Opted to not use the beforeEach for rendering the EventList due to "Forbidden usage of render within testing framework beforeEach" error
  test('has an element with "list" role', () => {
    render(<EventList />);
    const list = screen.getByRole("list");
    expect(list).toBeInTheDocument();
  });

  test('renders correct number of events', () => {
    const events = [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 }
    ];
    render(<EventList events={events} />);
    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(4);
  });
});