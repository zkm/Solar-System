import { describe, expect, it } from "vitest";
import { legendFor, PLANETS, SCALES } from "./planets.js";

const byId = (id) => PLANETS.find((planet) => planet.id === id);

describe("legendFor", () => {
  it("reports orbital velocity on the speed scale", () => {
    expect(legendFor(byId("earth"), "speed")).toEqual({
      value: "107,218 km/h",
      label: "Orbit Velocity",
    });
  });

  it("reports circumference on the size scale", () => {
    expect(legendFor(byId("sun"), "size")).toEqual({
      value: "4,370,005 km",
      label: "Equatorial Circumference",
    });
  });

  it("reports distance from the Sun, or from Earth for the Sun itself", () => {
    expect(legendFor(byId("neptune"), "distance")).toEqual({
      value: "4,498,396,441 km",
      label: "From Sun",
    });
    expect(legendFor(byId("sun"), "distance").label).toBe("From Earth");
  });

  it("has a legend for every planet on every scale", () => {
    for (const planet of PLANETS) {
      for (const scale of Object.keys(SCALES)) {
        expect(legendFor(planet, scale).value).toMatch(/^[\d,]+ km/);
      }
    }
  });

  it("rejects unknown scales", () => {
    expect(() => legendFor(byId("earth"), "time")).toThrow(RangeError);
  });
});
