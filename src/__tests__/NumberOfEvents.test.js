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

import { asyncRender } from '../testUtils';

jest.mock("../api");
const setCurrentNOE = jest.fn();

describe("<NumberOfEvents /> component", () => {
  test("contains an element with the role of the textbox", () => {
    render(<NumberOfEvents setCurrentNOE={setCurrentNOE} />);
    const numberInput = screen.getByRole("textbox");
    expect(numberInput).toBeInTheDocument();
  });

  test("renders number input with default value of 32", () => {
    render(<NumberOfEvents setCurrentNOE={setCurrentNOE} />);
    const numberInput = screen.getByLabelText("Number of Events");
    expect(numberInput).toBeInTheDocument();
    expect(numberInput).toHaveValue("32");
  });

  test("updates value when user types a valid number", async () => {
    render(<NumberOfEvents setCurrentNOE={setCurrentNOE} />);
    const numberInput = screen.getByLabelText("Number of Events");
    const user = userEvent.setup();
    await user.clear(numberInput);
    await user.type(numberInput, "15");
    expect(numberInput).toHaveValue("15");
  });

  test("handleClear resets input value to 32", async () => {
    const setCurrentNOE = jest.fn();
    render(<NumberOfEvents setCurrentNOE={setCurrentNOE} />);

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
    render(<NumberOfEvents setCurrentNOE={setCurrentNOE} />);

    const resetButton = screen.getByRole("img", {
      name: /reset number of events/i,
    });

    await userEvent.click(resetButton);

    expect(setCurrentNOE).toHaveBeenCalledWith(32);
  });

  // test("rounds decimal input to the nearest integer", async () => {
  //   render(<NumberOfEvents />);
  //   const numberInput = screen.getByLabelText("Number of Events");
  //   const user = userEvent.setup();
  //   await user.clear(numberInput);
  //   await user.type(numberInput, "15.7");
  //   expect(numberInput).toHaveValue("16");

  //   await user.click(numberInput);
  //   await user.type(numberInput, "{backspace}{backspace}15.2");
  //   expect(numberInput).toHaveValue("15");
  // });
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
