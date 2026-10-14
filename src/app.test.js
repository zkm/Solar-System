import { readFileSync } from "node:fs";
import { join } from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import { createApp } from "./app.js";
import { PLANETS } from "./planets.js";

const html = readFileSync(join(import.meta.dirname, "../index.html"), "utf8");
const bodyHtml = html.match(/<body[^>]*>([\s\S]*)<\/body>/)[1];
const bodyClass = html.match(/<body class="([^"]*)"/)[1];

let app;
const $ = (selector) => document.querySelector(selector);
const body = () => document.body.classList;

function change(name, value) {
  const field = $(
    `#controls [name="${name}"]${typeof value === "string" ? `[value="${value}"]` : ""}`,
  );
  if (typeof value === "boolean") field.checked = value;
  else field.checked = true;
  field.dispatchEvent(new Event("change", { bubbles: true }));
}

beforeEach(() => {
  document.body.className = bodyClass;
  document.body.innerHTML = bodyHtml;
  app = createApp(document);
});

describe("createApp", () => {
  it("adds a legend and a list entry for every body", () => {
    expect(document.querySelectorAll(".infos")).toHaveLength(PLANETS.length);
    expect([...document.querySelectorAll("#data button")].map((b) => b.textContent)).toEqual(
      PLANETS.map((planet) => planet.name),
    );
    expect($("#saturn .planet .infos dt").textContent).toBe("Saturn");
    expect($("#sun .infos dt").textContent).toBe("Sun");
  });

  it("starts on Earth at the speed scale", () => {
    expect($("#solar-system").dataset.focus).toBe("earth");
    expect($('[data-planet="earth"]').getAttribute("aria-pressed")).toBe("true");
    expect($("#universe").className).toBe("scale-stretched");
    expect($("#earth .infos .value").textContent).toBe("107,218 km/h");
  });

  it("switches scale and updates every legend", () => {
    change("scale", "distance");
    expect(app.scale).toBe("distance");
    expect($("#universe").className).toBe("scale-d");
    expect($("#mars .infos .value").textContent).toBe("227,943,824 km");
    expect($("#sun .infos .label").textContent).toBe("From Earth");

    change("scale", "size");
    expect($("#universe").className).toBe("scale-s");
    expect($("#jupiter .infos .label").textContent).toBe("Equatorial Circumference");
  });

  it("focuses the planet that was clicked", () => {
    $('[data-planet="jupiter"]').click();
    expect($("#solar-system").dataset.focus).toBe("jupiter");
    expect($('[data-planet="jupiter"]').getAttribute("aria-pressed")).toBe("true");
    expect($('[data-planet="earth"]').getAttribute("aria-pressed")).toBe("false");
  });

  it("toggles 3D view, close-up zoom and motion", () => {
    change("view", false);
    expect(body().contains("view-2D")).toBe(true);
    expect(body().contains("view-3D")).toBe(false);

    change("zoom", true);
    expect(body().contains("zoom-close")).toBe(true);
    expect(body().contains("zoom-large")).toBe(false);

    change("motion", false);
    expect(body().contains("paused")).toBe(true);
  });

  it("opens panels from the navbar and closes them with Escape", () => {
    $("#toggle-data").click();
    expect(body().contains("data-open")).toBe(true);
    expect($("#toggle-data").getAttribute("aria-expanded")).toBe("true");

    $("#toggle-data").click();
    expect(body().contains("data-close")).toBe(true);

    $("#toggle-controls").click();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(body().contains("controls-close")).toBe(true);
    expect($("#toggle-controls").getAttribute("aria-expanded")).toBe("false");
  });

  it("starts paused when the visitor prefers reduced motion", () => {
    document.body.className = bodyClass;
    document.body.innerHTML = bodyHtml;
    createApp(document, { reducedMotion: true });
    expect(body().contains("paused")).toBe(true);
    expect($('[name="motion"]').checked).toBe(false);
  });
});
