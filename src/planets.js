// Display figures for each body's legend. The physical model that drives the
// animation (radii, distances, periods) lives in styles/planets.css.
// biome-ignore format: keep the table aligned
export const PLANETS = [
  { id: "sun",     name: "Sun",     velocity: 0,       circumference: 4_370_005, distance: 149_598_262 },
  { id: "mercury", name: "Mercury", velocity: 170_503, circumference: 15_329,    distance: 57_909_227 },
  { id: "venus",   name: "Venus",   velocity: 126_074, circumference: 38_024,    distance: 108_209_475 },
  { id: "earth",   name: "Earth",   velocity: 107_218, circumference: 40_030,    distance: 149_598_262 },
  { id: "mars",    name: "Mars",    velocity: 86_677,  circumference: 21_296,    distance: 227_943_824 },
  { id: "jupiter", name: "Jupiter", velocity: 47_002,  circumference: 439_263,   distance: 778_340_821 },
  { id: "saturn",  name: "Saturn",  velocity: 34_701,  circumference: 365_882,   distance: 1_426_666_422 },
  { id: "uranus",  name: "Uranus",  velocity: 24_477,  circumference: 159_354,   distance: 2_870_658_186 },
  { id: "neptune", name: "Neptune", velocity: 19_566,  circumference: 154_704,   distance: 4_498_396_441 },
];

// Each scale shows the system at a different proportion, and the legends
// report the figure that proportion is based on.
export const SCALES = {
  speed: { className: "scale-stretched" },
  size: { className: "scale-s" },
  distance: { className: "scale-d" },
};

const number = new Intl.NumberFormat("en-US");

export function legendFor(planet, scale) {
  switch (scale) {
    case "speed":
      return { value: `${number.format(planet.velocity)} km/h`, label: "Orbit Velocity" };
    case "size":
      return {
        value: `${number.format(planet.circumference)} km`,
        label: "Equatorial Circumference",
      };
    case "distance":
      return {
        value: `${number.format(planet.distance)} km`,
        // The Sun has no distance from itself, so it reports Earth's instead.
        label: planet.id === "sun" ? "From Earth" : "From Sun",
      };
    default:
      throw new RangeError(`Unknown scale: ${scale}`);
  }
}
