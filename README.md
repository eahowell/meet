![CliqueUPLogo](public/LightLogo.png)

# Welcome to CliqueUP!

The app where you can find events near you!

A serverless, progressive web application (PWA) built with React that fetches and displays upcoming events using the Google Calendar API. This project follows Test-Driven Development (TDD) practices.

## Table of Contents

- [Welcome to CliqueUP!](#welcome-to-cliqueup)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
    - [Architectural Diagram](#architectural-diagram)
    - [User Stories](#user-stories)
      - [Feature 1: Filter Events by City](#feature-1-filter-events-by-city)
      - [Feature 2: Show/Hide Event Details](#feature-2-showhide-event-details)
      - [Feature 3: Specify Number of Events](#feature-3-specify-number-of-events)
      - [Feature 4: Use the App When Offline](#feature-4-use-the-app-when-offline)
      - [Feature 5: Add an App Shortcut to the Home Screen](#feature-5-add-an-app-shortcut-to-the-home-screen)
      - [Feature 6: Display Charts Visualizing Event Details](#feature-6-display-charts-visualizing-event-details)
  - [Technologies Used](#technologies-used)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Running the Application](#running-the-application)
  - [Running Tests](#running-tests)
  - [Deployment](#deployment)
  - [Contributing](#contributing)
  - [License](#license)

## Features

- View upcoming events from Google Calendar by city
- Offline functionality
- Responsive design
- Display Charts Visualizing Event Details

### Architectural Diagram

![ArchitecturalDiagram](public/ArchitecturalDiagram.png)

### User Stories

#### Feature 1: Filter Events by City

As a user, I want to filter events by city so that I can find events happening in my local area or a specific location I'm interested in.

```gherkin
Feature: Filter Events by City

Scenario: When user hasn’t searched for a city, show upcoming events from all cities
  Given user hasn’t searched for any city
  When the user opens the app
  Then the user should see the list of upcoming events

Scenario: User should see a list of suggestions when they search for a city
  Given the main page is open
  When user starts typing in the city textbox
  Then the user should see a list of cities (suggestions) that match what they’ve typed

Scenario: User can select a city from the suggested list
  Given the user was typing “Berlin” in the city textbox AND the list of suggested cities is showing
  When the user selects a city (e.g., “Berlin, Germany”) from the list
  Then their city should be changed to that city (i.e., “Berlin, Germany”) AND the user should receive a list of upcoming events in that city

Scenario: User filters for a city with no events
  Given the user is on the event listing page
  When the user selects "Small Town" from the city filter options
  And there are no events scheduled in Small Town
  Then the app should display a message "No events found in Small Town"
```

#### Feature 2: Show/Hide Event Details

As a user, I want to be able to show or hide event details so that I can quickly scan through events and focus on the ones I'm most interested in.

```gherkin
Feature: Show/Hide Event Details

Scenario: An event element is collapsed by default
    Given the user is viewing the list of events
    Then all event elements should be in a collapsed state

  Scenario: User can expand an event to see details
    Given the user is viewing the list of events
    When the user clicks on a collapsed event element
    Then the event element should expand
    And the event details should be visible

  Scenario: User can collapse an event to hide details
    Given the user is viewing an expanded event element
    When the user clicks on the expanded event element
    Then the event element should collapse
    And the event details should be hidden

Scenario: User toggles event details
  Given the user is viewing an event in the list
  When the user clicks on the show/hide details button for an event
  Then the app should toggle the visibility of additional details for that event

Scenario: User expands multiple event details
  Given the user is viewing the event list
  When the user clicks to show details for multiple events
  Then the app should display expanded details for all selected events simultaneously

Scenario: User collapses all expanded event details
  Given multiple events have their details expanded
  When the user clicks a "Collapse All" button
  Then the app should hide the details for all events
```

#### Feature 3: Specify Number of Events

As a user, I want to specify the number of events displayed so that I can control the amount of information I see at once.

```gherkin
Feature: Specify Number of Events

Scenario: When user hasn't specified a number, 32 events are shown by default
    Given the user hasn't specified a number of events to display
    When the user loads the event list
    Then 32 events should be displayed

  Scenario: User can change the number of events displayed
    Given the user is viewing the event list
    When the user specifies a different number of events to display
    Then the specified number of events should be shown
    And the event list should update accordingly

Scenario: User changes the number of events displayed
  Given the user is on the event listing page
  When the user selects "25" from the "Number of Events" dropdown
  Then the app should update to display 25 events

Scenario: User requests more events than available
  Given there are 15 total events
  When the user selects "50" from the "Number of Events" dropdown
  Then the app should display all 15 available events
  And show a message "Displaying all 15 available events"

Scenario: User changes number of events while filtered
  Given the user has filtered events for "Chicago"
  And there are 10 events in Chicago
  When the user changes the "Number of Events" to 5
  Then the app should display only 5 events from Chicago
```

#### Feature 4: Use the App When Offline

As a user, I want to use the app when offline so that I can access event information even without an internet connection.

```gherkin
Feature: Use the App When Offline

Scenario: User accesses the app without internet connection
  Given the user has previously loaded the app with an internet connection
  When the user opens the app without an internet connection
  Then the app should display the last cached version of events and their details

Scenario: User tries to refresh data while offline
  Given the user is using the app offline
  When the user attempts to refresh the event data
  Then the app should display a message "Unable to update. Please check your internet connection"

Scenario: App comes back online
  Given the user has been using the app offline
  When the internet connection is restored
  And the user refreshes the app
  Then the app should update with the latest event data
  And display a message "Event data updated successfully"
```

#### Feature 5: Add an App Shortcut to the Home Screen

As a user, I want to add an app shortcut to my home screen so that I can quickly access the app without navigating through my device's app menu.

```gherkin
Feature: Add an App Shortcut to the Home Screen

Scenario: User adds app shortcut to home screen
  Given the user has the app open in their mobile browser
  When the user selects the "Add to Home Screen" option from the browser menu
  Then the browser should create a shortcut to the app on the user's home screen

Scenario: User attempts to add shortcut on unsupported browser
  Given the user is using a browser that doesn't support adding shortcuts
  When the user tries to add the app to the home screen
  Then the app should display a message explaining the feature is not supported
  And provide alternative instructions for bookmarking the app

Scenario: User launches app from home screen shortcut
  Given the user has added the app shortcut to their home screen
  When the user taps the app shortcut
  Then the app should launch directly, bypassing the browser interface
```

#### Feature 6: Display Charts Visualizing Event Details

As a user, I want to see charts visualizing event details so that I can easily understand trends and patterns in the event data.

```gherkin
Feature: Display Charts Visualizing Event Details

Scenario: User views charts of event data
  Given the user is on the event statistics page
  When the page loads
  Then the app should display charts visualizing various aspects of event data

Scenario: User interacts with a chart
  Given the user is viewing the event statistics page
  When the user clicks on a specific data point in a chart
  Then the app should display detailed information about that data point

Scenario: User filters chart data
  Given the user is viewing a chart of events by category
  When the user selects specific categories to include or exclude
  Then the chart should update to reflect only the selected categories

Scenario: User views charts with no data
  Given there are no events in the system
  When the user navigates to the event statistics page
  Then the app should display a message "No data available for visualization"
  And provide an option to add sample data for demonstration purposes

```

## Technologies Used

- React
- Progressive Web App (PWA) technologies
- Google Calendar API
- Jest and React Testing Library for TDD
- AWS

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Google Cloud Platform account with Calendar API enabled

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/eahowell/meet.git
   cd meet
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Google Calendar API credentials:
   ```
   REACT_APP_GOOGLE_API_KEY=your_api_key
   REACT_APP_GOOGLE_CLIENT_ID=your_client_id
   ```

## Running the Application

To start the development server:

```
npm start
```

Visit `http://localhost:3000` in your browser to view the application.

## Running Tests

This project uses Jest and React Testing Library for unit and integration tests. To run the tests:

```
npm test
```

To run tests in watch mode:

```
npm run test:watch
```

## Deployment

[Include instructions for deploying to your chosen serverless platform]

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
