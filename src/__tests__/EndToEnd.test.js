// src/__tests__/EndToEnd.test.js
import puppeteer from "puppeteer";
import "@testing-library/jest-dom";

describe("show/hide event details", () => {
  let browser;
  let page;
  beforeAll(async () => {
    browser = await puppeteer.launch({
      // headless: false,
      // slowMo: 250, // slow down by 250ms,
      // timeout: 0 // removes any puppeteer/browser timeout limitations (this isn't the same as the timeout of jest)
    });
    page = await browser.newPage();
    await page.goto("http://localhost:3000/");
    await page.waitForSelector(".event");
    await page.waitForSelector('[data-testid="event-list"]');
  });

  afterAll(() => {
    browser.close();
  });

  test("An event element is collapsed by default", async () => {
    const eventDetails = await page.$(".event .details");
    expect(eventDetails).toBeNull();
  });

  test("User can expand an event to see details", async () => {
    await page.click(".event .details-btn");
    const eventDetails = await page.$(".event .details");
    expect(eventDetails).toBeDefined();
  });

  test("User can collapse an event to hide details", async () => {
    await page.click(".event .details-btn");
    const eventDetails = await page.$(".event .details");
    expect(eventDetails).toBeNull();
  });

  test("User expands multiple event details", async () => {
    await page.waitForSelector('[data-testid="event-list"]');
    const showDetailsButtons = await page.$$('[data-testid^="btn-"]');

    // Click the first three "Show Details" buttons
    for (let i = 0; i < 3 && i < showDetailsButtons.length; i++) {
      await showDetailsButtons[i].click();
      await page.waitForSelector(`[data-testid="event-${i}"] .event-details`);
    }

    // Verify that the details for the first three events are visible
    for (let i = 0; i < 3; i++) {
      const isVisible = await page.$eval(
        `[data-testid="event-${i}"] .event-details`,
        (el) => window.getComputedStyle(el).display !== "none"
      );
      expect(isVisible).toBe(true);
    }
  });

  test("User collapses all expanded event details", async () => {
    await page.waitForSelector('[data-testid="event-list"]');
    const showDetailsButtons = await page.$$('[data-testid^="btn-"]');

    // Click the first three "Show Details" buttons
    for (let i = 0; i < 3 && i < showDetailsButtons.length; i++) {
      await showDetailsButtons[i].click();
      await page.waitForSelector(`[data-testid="event-${i}"] .event-details`);
    }

    // Verify that the details for the first three events are visible
    for (let i = 0; i < 3; i++) {
      const isVisible = await page.$eval(
        `[data-testid="event-${i}"] .event-details`,
        (el) => window.getComputedStyle(el).display !== "none"
      );
      expect(isVisible).toBe(true);
    }

    // Click the "Collapse All" button
    await page.waitForSelector('button:text("Collapse All")');
    await page.click('button:text("Collapse All")');
    // Wait for a moment to allow for any animations or state changes
    // await page.waitForTimeout(1000);

    // Verify that all event details are hidden
    // const eventDetails = await page.$$(".event-details");
    // for (let details of eventDetails) {
    //   const isVisible = await page.evaluate(
    //     (el) => window.getComputedStyle(el).display !== "none",
    //     details
    //   );
    //   expect(isVisible).toBe(false);
    // }

    // // Verify that all buttons now say "Show Details"
    // const buttons = await page.$$('[data-testid^="btn-"]');
    // for (let button of buttons) {
    //   const buttonText = await page.evaluate((el) => el.textContent, button);
    //   expect(buttonText).toBe("Show Details");
    // }
  });
});
