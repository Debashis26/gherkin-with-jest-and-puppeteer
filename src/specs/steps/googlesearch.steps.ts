import { loadFeature, defineFeature } from "jest-cucumber";
import { Browser, Page, launch } from "puppeteer";

const feature = loadFeature("src/specs/features/googlesearch.feature");

let browser: Browser;
let page: Page;
const GOOGLE_URL = "https://www.google.com";
defineFeature(feature, (test) => {
  beforeAll(async () => {
    browser = await launch({
      headless: false,
      args: ["--start-maximized"],
      slowMo: 30,
    });
    page = await browser.newPage();
  });
  afterAll(async () => {
    await browser.close();
  });

  test("Perform a search on Google", ({ given, when, then }) => {
    given("I am on the Google search page", async () => {
      await page.setViewport({ width: 1360, height: 1080 });
      await page.goto(GOOGLE_URL);
      const pageTitle = await page.title();
      expect(pageTitle).toBe("Google");
    });

    when('I search for "debashis badajena"', async () => {
      const searchSelector = 'textarea[title="Search"]';
      await page.waitForSelector(searchSelector);
      await page.click(searchSelector, { clickCount: 1 });
      await page.type(searchSelector, "debashis badajena");
      // await page.type(searchSelector, "");
      await page.keyboard.press("Enter");
    });

    then("I should see search results", async () => {
      await page.waitForSelector("h3");
      const searchResults = await page.$$("h3");
      // expect(searchResults.length).toBeGreaterThan(0);
      expect(searchResults.length).toBeLessThan(0);
    });
  },20000);
});
