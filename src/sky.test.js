import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { startSky } from "./sky.js";

let sky;
let stars;

// A repeating sequence stands in for Math.random so spawns are predictable.
const sequence = (...values) => {
  let i = 0;
  return () => values[i++ % values.length];
};

beforeEach(() => {
  vi.useFakeTimers();
  document.body.innerHTML = '<div id="sky"></div>';
  sky = document.getElementById("sky");
});

afterEach(() => {
  stars?.stop();
  vi.useRealTimers();
});

describe("startSky", () => {
  it("sends a shooting star within ten seconds", () => {
    stars = startSky(sky, { random: sequence(0.5) });
    expect(sky.children).toHaveLength(0);
    vi.advanceTimersByTime(10_000);
    expect(sky.querySelectorAll(".meteor")).toHaveLength(1);
  });

  it("sometimes sends a comet instead", () => {
    stars = startSky(sky, { random: sequence(0) });
    expect(stars.spawn().className).toBe("comet");
  });

  it("aims every streak downward", () => {
    for (const value of [0, 0.25, 0.5, 0.75, 0.99]) {
      stars = startSky(sky, { random: sequence(value) });
      const angle = Number.parseFloat(stars.spawn().style.getPropertyValue("--angle"));
      expect(angle).toBeGreaterThan(0);
      expect(angle).toBeLessThan(180);
      stars.stop();
    }
  });

  it("removes a streak once its animation ends", () => {
    stars = startSky(sky);
    const streak = stars.spawn();
    streak.dispatchEvent(new Event("animationend"));
    expect(sky.contains(streak)).toBe(false);
  });

  it("holds off while motion is paused, and resumes after", () => {
    let active = false;
    stars = startSky(sky, { isActive: () => active, random: sequence(0.5) });
    vi.advanceTimersByTime(60_000);
    expect(sky.children).toHaveLength(0);

    active = true;
    vi.advanceTimersByTime(10_000);
    expect(sky.children.length).toBeGreaterThan(0);
  });

  it("stops scheduling when stopped", () => {
    stars = startSky(sky, { random: sequence(0.5) });
    stars.stop();
    vi.advanceTimersByTime(60_000);
    expect(sky.children).toHaveLength(0);
  });
});
