// src/__tests__/NumberOfEvents.test.js

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import NumberOfEvents from "../components/NumberOfEvents";

describe("<NumberOfEvents /> component", () => {
  test("renders number input with default value", () => {
    render(<NumberOfEvents />);
    const numberInput = screen.getByLabelText("Number of Events");
    expect(numberInput).toBeInTheDocument();
    expect(numberInput).toHaveValue(32);
  });

  test("updates value when user types a valid number", async () => {
    render(<NumberOfEvents />);

    const numberInput = screen.getByLabelText("Number of Events");
    const user = userEvent.setup();
    // await user.click(numberInput);
    await user.clear(numberInput);
    await user.type(numberInput, "{backspace}{backspace}15");
    expect(numberInput).toHaveValue(15);
  });

  test("sets value to 1 when user types 0", async () => {
    render(<NumberOfEvents />);
    const numberInput = screen.getByLabelText("Number of Events");
    const user = userEvent.setup();
    await user.click(numberInput);
    await user.clear(numberInput);
    await user.type(numberInput, "{backspace}{backspace}0");
    expect(numberInput).toHaveValue(1);
  });

  test("sets value to 1 when user types a negative number", async () => {
    render(<NumberOfEvents />);
    const numberInput = screen.getByLabelText("Number of Events");
    const user = userEvent.setup();
    await user.click(numberInput);
    await user.clear(numberInput);

    await user.type(numberInput, "{backspace}{backspace}-5");
    expect(numberInput).toHaveValue(1);
  });

  test("resets to default value 32 when user types non-numeric input", async () => {
    render(<NumberOfEvents />);
    const numberInput = screen.getByLabelText("Number of Events");
    const user = userEvent.setup();
    await user.click(numberInput);
    await user.type(numberInput, "{backspace}{backspace}abc");
    expect(numberInput).toHaveValue(32);
  });

  test("rounds decimal input to the nearest integer", async () => {
    render(<NumberOfEvents />);
    const numberInput = screen.getByLabelText("Number of Events");
    const user = userEvent.setup();
    await user.click(numberInput);
    await user.type(numberInput, "{backspace}{backspace}15.7");
    expect(numberInput).toHaveValue(16);

    await user.click(numberInput);
    await user.type(numberInput, "{backspace}{backspace}15.2");
    expect(numberInput).toHaveValue(15);
  });
});
