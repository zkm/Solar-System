// Sends a shooting star, or now and then a comet, across the sky at random
// intervals. Each one is a short-lived element animated by styles/sky.css.

const COMET_CHANCE = 0.12;

const KINDS = {
  meteor: { duration: [0.6, 1.4], travel: [0.25, 0.5], length: [80, 180] },
  comet: { duration: [7, 11], travel: [0.9, 1.2], length: [160, 260] },
};

export function startSky(sky, { isActive = () => true, random = Math.random } = {}) {
  const between = ([min, max]) => min + random() * (max - min);
  let timer;

  function spawn() {
    const kind = random() < COMET_CHANCE ? "comet" : "meteor";
    const { duration, travel, length } = KINDS[kind];
    const { clientWidth: width, clientHeight: height } = sky;

    // Head somewhere downward, either to the left or the right.
    const tilt = between([15, 50]);
    const angle = random() < 0.5 ? tilt : 180 - tilt;
    const distance = Math.hypot(width, height) * between(travel);
    const radians = (angle * Math.PI) / 180;

    const streak = sky.ownerDocument.createElement("div");
    streak.className = kind;
    streak.style.setProperty("--x", `${between([0, width])}px`);
    streak.style.setProperty("--y", `${between([0, height * 0.5])}px`);
    streak.style.setProperty("--angle", `${angle}deg`);
    streak.style.setProperty("--length", `${between(length)}px`);
    streak.style.setProperty("--dx", `${Math.cos(radians) * distance}px`);
    streak.style.setProperty("--dy", `${Math.sin(radians) * distance}px`);
    streak.style.setProperty("--duration", `${between(duration)}s`);
    streak.addEventListener("animationend", () => streak.remove(), { once: true });
    sky.appendChild(streak);
    return streak;
  }

  function schedule() {
    timer = setTimeout(
      () => {
        if (isActive() && !sky.ownerDocument.hidden) spawn();
        schedule();
      },
      between([3, 10]) * 1000,
    );
  }

  schedule();
  return { spawn, stop: () => clearTimeout(timer) };
}
