import { legendFor, PLANETS, SCALES } from "./planets.js";

const PANELS = ["data", "controls"];

// Wires the controls and planet list to the scene. Everything is expressed as
// classes and attributes on existing elements; the CSS does the rest.
export function createApp(doc = document, { reducedMotion = false } = {}) {
  const body = doc.body;
  const universe = doc.getElementById("universe");
  const solarSystem = doc.getElementById("solar-system");
  const controls = doc.getElementById("controls");
  const planetList = doc.querySelector("#data ul");

  const legends = new Map();
  const planetButtons = new Map();
  let scale = controls.elements.scale.value;

  for (const planet of PLANETS) {
    const host =
      planet.id === "sun"
        ? doc.getElementById("sun")
        : doc.querySelector(`#${planet.id} > .pos > .planet`);
    legends.set(planet.id, host.appendChild(createLegend(doc, planet)));

    const button = doc.createElement("button");
    button.type = "button";
    button.dataset.planet = planet.id;
    button.textContent = planet.name;
    planetButtons.set(planet.id, button);
    planetList.appendChild(doc.createElement("li")).appendChild(button);
  }

  function setScale(next) {
    if (!(next in SCALES)) throw new RangeError(`Unknown scale: ${next}`);
    scale = next;
    universe.className = SCALES[next].className;
    for (const planet of PLANETS) {
      const { value, label } = legendFor(planet, next);
      const legend = legends.get(planet.id);
      legend.querySelector(".value").textContent = value;
      legend.querySelector(".label").textContent = label;
    }
    for (const radio of controls.elements.scale) radio.checked = radio.value === next;
  }

  function setFocus(id) {
    if (!legends.has(id)) throw new RangeError(`Unknown planet: ${id}`);
    solarSystem.dataset.focus = id;
    for (const [planetId, button] of planetButtons) {
      button.setAttribute("aria-pressed", String(planetId === id));
    }
  }

  function setView(threeD) {
    body.classList.toggle("view-3D", threeD);
    body.classList.toggle("view-2D", !threeD);
    controls.elements.view.checked = threeD;
  }

  function setZoom(close) {
    body.classList.toggle("zoom-close", close);
    body.classList.toggle("zoom-large", !close);
    controls.elements.zoom.checked = close;
  }

  function setMotion(moving) {
    body.classList.toggle("paused", !moving);
    controls.elements.motion.checked = moving;
  }

  function setPanel(name, open) {
    body.classList.toggle(`${name}-open`, open);
    body.classList.toggle(`${name}-close`, !open);
    doc.getElementById(`toggle-${name}`).setAttribute("aria-expanded", String(open));
  }

  controls.addEventListener("change", ({ target }) => {
    switch (target.name) {
      case "view":
        return setView(target.checked);
      case "zoom":
        return setZoom(target.checked);
      case "motion":
        return setMotion(target.checked);
      case "scale":
        return setScale(target.value);
    }
  });
  controls.addEventListener("submit", (event) => event.preventDefault());

  planetList.addEventListener("click", ({ target }) => {
    const button = target.closest("button[data-planet]");
    if (button) setFocus(button.dataset.planet);
  });

  for (const name of PANELS) {
    doc.getElementById(`toggle-${name}`).addEventListener("click", () => {
      setPanel(name, !body.classList.contains(`${name}-open`));
    });
  }

  doc.addEventListener("keydown", (event) => {
    if (event.key === "Escape") for (const name of PANELS) setPanel(name, false);
  });

  setScale(scale);
  setFocus(solarSystem.dataset.focus);
  if (reducedMotion) setMotion(false);

  return {
    get scale() {
      return scale;
    },
    setScale,
    setFocus,
    setView,
    setZoom,
    setMotion,
    setPanel,
  };
}

function createLegend(doc, planet) {
  const legend = doc.createElement("dl");
  legend.className = "infos";
  const term = legend.appendChild(doc.createElement("dt"));
  term.textContent = planet.name;
  const detail = legend.appendChild(doc.createElement("dd"));
  for (const className of ["value", "label"]) {
    detail.appendChild(doc.createElement("span")).className = className;
  }
  return legend;
}
