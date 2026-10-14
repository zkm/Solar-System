# Solar-System

An interactive solar system built with CSS 3D transforms. Originally written in 2013, rebuilt in 2026 with Vite, native CSS and vanilla JavaScript modules.

[![Live site](https://img.shields.io/badge/Live%20site-Open-2ea44f.svg)](https://zkm.github.io/Solar-System/) ·
[![Deploy to GitHub Pages](https://github.com/zkm/Solar-System/actions/workflows/deploy.yml/badge.svg?branch=master)](https://github.com/zkm/Solar-System/actions/workflows/deploy.yml) ·
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## Features

- 3D and 2D views, with an intro that tilts the system into 3D
- Three scales: **speed** (true orbital periods), **size** (true planet sizes) and **distance** (true orbit distances)
- Close-up mode that lines the planets up side by side
- Planet legends showing orbital velocity, circumference or distance
- Shooting stars every few seconds, and the occasional slow comet
- Pause/play motion; starts paused when the visitor prefers reduced motion
- Keyboard and screen reader friendly controls; responsive down to phone widths
- No framework: vanilla JavaScript modules and native CSS (nesting, custom properties, `calc()`)

## Quick start

Requires Node.js 24+ (Yarn is provided through Corepack).

```sh
corepack enable
yarn install
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Development

| Script            | What it does                                     |
| ----------------- | ------------------------------------------------ |
| `yarn dev`        | Vite dev server with hot reload on port 3000     |
| `yarn build`      | Production build into `dist/`                    |
| `yarn preview`    | Serve the production build locally               |
| `yarn test`       | Run the Vitest suite once (`yarn test:watch` to watch) |
| `yarn check`      | Biome lint + format check (`yarn check:fix` to fix)    |

A Husky pre-commit hook runs Biome on staged files, and pushes to `master` run the checks and tests first.

### Project structure

- `index.html` — page markup and the scene graph (orbits, planets, rings)
- `src/main.js` — entry point: loads the styles, starts the app, plays the intro
- `src/app.js` — wires the controls and planet list to the scene
- `src/planets.js` — legend figures for each body
- `src/sky.js` — spawns shooting stars and comets at random
- `src/styles/planets.css` — the physical model: each body's radius, distance and period, from which every size, orbit and speed is calculated
- `src/styles/` — the rest of the styles (scene, views, lighting, legends, UI, responsive)
- `src/assets/textures/` — planet and background textures
- `public/` — files copied as-is (favicon)

## Deployment

Every push to `master` builds the site and deploys `dist/` to GitHub Pages through Actions.

- Workflow file: `.github/workflows/deploy.yml`
- Live URL: https://zkm.github.io/Solar-System/
- Pages settings: Settings → Pages → Source: GitHub Actions
- Manual trigger: GitHub → Actions → "Deploy to GitHub Pages" → Run workflow

The build uses relative asset paths (`base: "./"` in `vite.config.js`), so it works under `/Solar-System/`. Releases are cut by release-please, and each published release gets a zipped `dist/` attached.

## License

This project is licensed under the [MIT License](LICENSE).
