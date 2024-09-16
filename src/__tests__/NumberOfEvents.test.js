// src/__tests__/NumberOfEvents.test.js

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import NumberOfEvents from "../components/NumberOfEvents";
import App from "../App";
import { getEvents } from "../api";
import "@testing-library/jest-dom";
import mockData from "../mock-data";

import { asyncRender } from "../testUtils";

jest.mock("../api");
const setCurrentNOE = jest.fn();
const setErrorAlert = jest.fn();

describe("<NumberOfEvents /> component", () => {
  beforeEach(() => {
    setCurrentNOE.mockClear();
    setErrorAlert.mockClear();
  });
  test("contains an element with the role of the textbox", () => {
    render(
      <NumberOfEvents
        setCurrentNOE={setCurrentNOE}
        setErrorAlert={setErrorAlert}
      />
    );
    const numberInput = screen.getByRole("textbox");
    expect(numberInput).toBeInTheDocument();
  });

  test("renders number input with default value of 32", () => {
    render(
      <NumberOfEvents
        setCurrentNOE={setCurrentNOE}
        setErrorAlert={setErrorAlert}
      />
    );
    const numberInput = screen.getByLabelText("Number of Events");
    expect(numberInput).toBeInTheDocument();
    expect(numberInput).toHaveValue("32");
  });

  test("updates value when user types a valid number", async () => {
    render(
      <NumberOfEvents
        setCurrentNOE={setCurrentNOE}
        setErrorAlert={setErrorAlert}
      />
    );
    const numberInput = screen.getByLabelText("Number of Events");
    const user = userEvent.setup();
    await user.clear(numberInput);
    await user.type(numberInput, "15");
    expect(numberInput).toHaveValue("15");
  });

  test("handleClear resets input value to 32", async () => {
    const setCurrentNOE = jest.fn();
    render(
      <NumberOfEvents
        setCurrentNOE={setCurrentNOE}
        setErrorAlert={setErrorAlert}
      />
    );

    const numberInput = screen.getByLabelText("Number of Events");
    const resetButton = screen.getByRole("img", {
      name: /reset number of events/i,
    });

    // Change the input value
    await userEvent.clear(numberInput);
    await userEvent.type(numberInput, "10");
    expect(numberInput).toHaveValue("10");
    expect(setCurrentNOE).toHaveBeenCalledWith(10);

    // Reset the input value
    await userEvent.click(resetButton);

    expect(numberInput).toHaveValue("32");
    expect(setCurrentNOE).toHaveBeenCalledWith(32);
  });

  test("handleClear is called when reset icon is clicked", async () => {
    const setCurrentNOE = jest.fn();
    render(
      <NumberOfEvents
        setCurrentNOE={setCurrentNOE}
        setErrorAlert={setErrorAlert}
      />
    );
    const resetButton = screen.getByRole("img", {
      name: /reset number of events/i,
    });

    await userEvent.click(resetButton);

    expect(setCurrentNOE).toHaveBeenCalledWith(32);
  });

  test("shows error for non-integer input", async () => {
    render(
      <NumberOfEvents
        setCurrentNOE={setCurrentNOE}
        setErrorAlert={setErrorAlert}
      />
    );
    const numberInput = screen.getByLabelText("Number of Events");
    await userEvent.clear(numberInput);
    await userEvent.type(numberInput, "12.5");
    expect(setErrorAlert).toHaveBeenCalledWith(
      "Please enter a valid integer for the number of events."
    );
  });

  test("shows error for negative number", async () => {
    render(
      <NumberOfEvents
        setCurrentNOE={setCurrentNOE}
        setErrorAlert={setErrorAlert}
      />
    );
    const numberInput = screen.getByLabelText("Number of Events");
    await userEvent.clear(numberInput);
    await userEvent.type(numberInput, "-5");
    expect(setErrorAlert).toHaveBeenCalledWith(
      "Please enter a positive number for the number of events."
    );
  });

  test("shows error for number greater than 250", async () => {
    render(
      <NumberOfEvents
        setCurrentNOE={setCurrentNOE}
        setErrorAlert={setErrorAlert}
      />
    );
    const numberInput = screen.getByLabelText("Number of Events");
    await userEvent.clear(numberInput);
    await userEvent.type(numberInput, "300");
    expect(setErrorAlert).toHaveBeenCalledWith(
      "Maximum number of events is 250. Please enter a smaller number."
    );
  });

  test("clears error when reset to default", async () => {
    render(
      <NumberOfEvents
        setCurrentNOE={setCurrentNOE}
        setErrorAlert={setErrorAlert}
      />
    );
    const resetButton = screen.getByRole("img", {
      name: /reset number of events/i,
    });
    await userEvent.click(resetButton);
    expect(setCurrentNOE).toHaveBeenCalledWith(32);
    expect(setErrorAlert).toHaveBeenCalledWith("");
  });
});

describe("<NumberOfEvents /> integration", () => {
  test("changes the number of events displayed when NOE input changes", async () => {
    getEvents.mockResolvedValue(mockData);
    await asyncRender(<App />);

    await waitFor(() => {
      const noeInput = screen.getByLabelText("Number of Events");
      expect(noeInput).toBeInTheDocument();
    });

    const noeInput = screen.getByLabelText("Number of Events");
    await userEvent.clear(noeInput);
    await userEvent.type(noeInput, "10");

    await waitFor(() => {
      const eventListItems = screen.getAllByRole("listitem");
      expect(eventListItems).toHaveLength(Math.min(10, mockData.length));
    });
  });
});
