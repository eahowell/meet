// src/__tests__/NumberOfEvents.test.js

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import NumberOfEvents from "../components/NumberOfEvents";

describe("<NumberOfEvents /> component", () => {
  test("contains an element with the role of the textbox", () => {
    render(<NumberOfEvents />);
    const numberInput = screen.getByRole("spinbutton", {
      name: "Number of Events",
    });
    expect(numberInput).toBeInTheDocument();
  });

  test("renders number input with default value of 32", () => {
    render(<NumberOfEvents />);
    const numberInput = screen.getByLabelText("Number of Events");
    expect(numberInput).toBeInTheDocument();
    expect(numberInput).toHaveValue(32);
  });

  test("updates value when user types a valid number", async () => {
    render(<NumberOfEvents />);
    const numberInput = screen.getByLabelText("Number of Events");
    const user = userEvent.setup();
    await user.clear(numberInput);
    await user.type(numberInput, "15");
    expect(numberInput).toHaveValue(15);
  });

  test("rounds decimal input to the nearest integer", async () => {
    render(<NumberOfEvents />);
    const numberInput = screen.getByLabelText("Number of Events");
    const user = userEvent.setup();
    await user.clear(numberInput);
    await user.type(numberInput, "15.7");
    expect(numberInput).toHaveValue(16);

    await user.click(numberInput);
    await user.type(numberInput, "{backspace}{backspace}15.2");
    expect(numberInput).toHaveValue(15);
  });
});
