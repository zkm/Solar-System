import "./styles/main.css";
import { createApp } from "./app.js";

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

const app = createApp(document, { reducedMotion });
if (!reducedMotion) playIntro(document.body);

// Start flat with the UI hidden, then tilt into 3D and fade the UI in.
function playIntro(body) {
  body.classList.add("intro", "hide-UI");
  app.setView(false);
  body.getBoundingClientRect(); // commit the flat layout before transitioning

  requestAnimationFrame(() => {
    body.classList.replace("intro", "intro-tilt");
    app.setView(true);
    setTimeout(() => body.classList.remove("hide-UI"), 2000);
    setTimeout(() => body.classList.remove("intro-tilt"), 4000);
  });
}
