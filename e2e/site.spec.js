import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";

const geometry = JSON.parse(readFileSync(join(import.meta.dirname, "geometry.json"), "utf8"));
const SCALES = { "scale-stretched": "speed", "scale-d": "distance", "scale-s": "size" };
const SELECTORS = ["#solar-system", "#sun", ".orbit", ".planet", ".moon", ".ring"];

const consoleErrors = new WeakMap();

test.beforeEach(({ page }) => {
  const errors = [];
  consoleErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => message.type() === "error" && errors.push(message.text()));
});

test.afterEach(({ page }) => {
  expect(consoleErrors.get(page)).toEqual([]);
});

test.describe("with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("every scale keeps the original build's sizes, orbits and speeds", async ({ page }) => {
    // geometry.json was measured in a 1400x900 window, which leaves an 813px-tall viewport.
    await page.setViewportSize({ width: 1400, height: 813 });
    await page.goto("/");
    await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important }" });

    for (const [className, scale] of Object.entries(SCALES)) {
      await page.getByRole("radio", { name: new RegExp(scale, "i") }).check({ force: true });
      await expect(page.locator("#universe")).toHaveClass(className);

      const actual = await page.evaluate((selectors) => {
        const px = (value) => Number.parseFloat(value);
        const result = {};
        for (const selector of selectors) {
          document.querySelectorAll(selector).forEach((element, index) => {
            const style = getComputedStyle(element);
            result[`${selector}[${index}]`] = [
              px(style.width),
              px(style.height),
              px(style.marginLeft),
              px(style.marginTop),
              px(style.animationDuration),
            ];
          });
        }
        return result;
      }, SELECTORS);

      expect(Object.keys(actual)).toEqual(Object.keys(geometry[className]));
      for (const [element, expected] of Object.entries(geometry[className])) {
        expected.forEach((value, i) => {
          expect.soft(actual[element][i], `${className} ${element} [${i}]`).toBeCloseTo(value, 1);
        });
      }
    }
  });

  test("skips the intro and starts with motion off", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("body")).toHaveClass(/view-3D/);
    await expect(page.locator("body")).toHaveClass(/paused/);
    await expect(page.locator("body")).not.toHaveClass(/hide-UI/);
    await expect(page.getByRole("checkbox", { name: "Motion" })).not.toBeChecked();
  });
});

test("intro tilts into 3D and reveals the controls", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body")).toHaveClass(/intro-tilt/);
  await expect(page.locator("body")).not.toHaveClass(/hide-UI/, { timeout: 5000 });
  await expect(page.locator("body")).not.toHaveClass(/intro-tilt/, { timeout: 5000 });
  await expect(page.locator("body")).toHaveClass(/view-3D/);
  await expect(page.getByRole("checkbox", { name: "3D view" })).toBeChecked();
  await expect(page.locator("#controls")).toHaveCSS("opacity", "1");
});

test("controls change the scene", async ({ page }) => {
  await page.goto("/");
  const solarSystem = page.locator("#solar-system");
  await expect(solarSystem).not.toHaveCSS("transform", "none");

  await page.getByText("3D view").click();
  await expect(solarSystem).toHaveCSS("transform", "none");

  await page.getByRole("button", { name: "Saturn" }).click();
  await expect(page.getByRole("button", { name: "Saturn" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.locator("#saturn .infos")).toHaveCSS("opacity", "1");
  await expect(page.locator("#earth > .pos > .planet > .infos")).toHaveCSS("opacity", "0");

  await page.getByText("Distance").click();
  await expect(page.locator("#saturn .infos .value")).toHaveText("1,426,666,422 km");

  await page.getByText("Motion").click();
  await expect(page.locator("#saturn.orbit")).toHaveCSS("animation-play-state", "paused");
});

test("controls work from the keyboard", async ({ page }) => {
  await page.goto("/");
  const closeUp = page.getByRole("checkbox", { name: "Close-up" });
  await closeUp.focus();
  await page.keyboard.press("Space");
  await expect(closeUp).toBeChecked();
  await expect(page.locator("body")).toHaveClass(/zoom-close/);
});

test.describe("on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("panels open from the navbar and close with Escape", async ({ page }) => {
    await page.goto("/");
    const planets = page.getByRole("navigation", { name: "Planets" });
    const controls = page.getByRole("form", { name: "View controls" });
    await expect(planets).toBeHidden();
    await expect(controls).toBeHidden();

    await page.getByRole("button", { name: "Planets" }).click();
    await expect(planets).toBeVisible();
    await expect(planets).toBeInViewport({ ratio: 1 });

    await page.getByRole("button", { name: "Controls" }).click();
    await expect(controls).toBeVisible();
    await expect(controls).toBeInViewport({ ratio: 1 });

    await page.keyboard.press("Escape");
    await expect(planets).toBeHidden();
    await expect(controls).toBeHidden();
  });

  test("the page never scrolls sideways", async ({ page }) => {
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  });
});

test("shooting stars cross the sky and clean up after themselves", async ({ page }) => {
  await page.clock.install();
  await page.goto("/");
  const streaks = page.locator("#sky > :is(.meteor, .comet)");

  await page.clock.runFor(10_000);
  await expect(streaks).toHaveCount(1);
  await expect(streaks.first()).toBeVisible();

  // Comets last up to 11s; the next spawn is at least 3s away, so wait for a gap.
  await expect(async () => {
    await page.clock.runFor(1_000);
    expect(await page.locator("#sky > *").count()).toBeLessThanOrEqual(1);
  }).toPass();
});
