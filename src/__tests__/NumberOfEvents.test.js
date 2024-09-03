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

jest.mock("../api");

describe("<NumberOfEvents /> component", () => {
  test("contains an element with the role of the textbox", () => {
    render(<NumberOfEvents />);
    const numberInput = screen.getByRole("textbox");
    expect(numberInput).toBeInTheDocument();
  });

  test("renders number input with default value of 32", () => {
    render(<NumberOfEvents />);
    const numberInput = screen.getByLabelText("Number of Events");
    expect(numberInput).toBeInTheDocument();
    expect(numberInput).toHaveValue("32");
  });

  test("updates value when user types a valid number", async () => {
    render(<NumberOfEvents />);
    const numberInput = screen.getByLabelText("Number of Events");
    const user = userEvent.setup();
    await user.clear(numberInput);
    await user.type(numberInput, "15");
    expect(numberInput).toHaveValue("15");
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
    render(<App />);
    
    const noeInput = screen.getByLabelText("Number of Events");
    await userEvent.clear(noeInput);
    await userEvent.type(noeInput, "10");
  
    await waitFor(() => {
      const eventListItems = screen.getAllByRole("listitem");
      expect(eventListItems).toHaveLength(Math.min(10, mockData.length));
    });
  });
});
