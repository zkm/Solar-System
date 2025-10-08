# Solar-System

A modern, interactive CSS and JavaScript solar system visualization.

[Live site](https://zkm.github.io/Solar-System/) ·
[![Deploy to GitHub Pages](https://github.com/zkm/Solar-System/actions/workflows/deploy.yml/badge.svg)](https://github.com/zkm/Solar-System/actions/workflows/deploy.yml) ·
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## Features

- 3D/2D solar system view
- Interactive controls for zoom, speed, size, and distance
- Responsive design
- Built with vanilla JavaScript and Sass

## Quick start

### Prerequisites

- Node.js and Yarn
- Python 3 (used by the local dev server)

Install dependencies

```sh
yarn install
```

Build CSS from Sass

```sh
yarn build:sass
```

Start local server

```sh
yarn start
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

Note:

- `yarn start` runs `python3 -m http.server 3000` to serve the repository root.
- You can also run it directly without Yarn:

```sh
python3 -m http.server 3000
```

## Development

- Edit Sass in `sass/`; use `yarn watch:sass` for live rebuilds, or run `yarn build:sass` on demand.
- Edit JavaScript in `js/scripts.js` (vanilla JS, no jQuery required).

### Scripts

- `yarn build:sass` — Compile `sass/styles.scss` to `css/styles.css`
- `yarn watch:sass` — Watch and rebuild Sass on change
- `yarn start` — Static server on http://localhost:3000
- `yarn lint:scss` / `yarn lint:scss:fix` — Stylelint SCSS rules
- `yarn format` / `yarn format:check` — Prettier

## Project Structure

- `index.html` — Main HTML file
- `css/` — Compiled CSS
- `sass/` — Source Sass files
- `js/` — JavaScript files

## Deployment

This repo is set up for GitHub Pages via Actions. Deploys happen automatically on every push to `master`.

- Workflow file: `.github/workflows/deploy.yml`
- Live URL: https://zkm.github.io/Solar-System/
- Pages settings: Settings → Pages → Source: GitHub Actions

Manual trigger:

- GitHub → Actions → "Deploy to GitHub Pages" → Run workflow

Notes:

- Assets are referenced with relative paths (`./css`, `./js`), so they work under `/Solar-System/`.
- The workflow builds Sass, copies `index.html`, `css/`, and `js/` into `dist/`, adds `.nojekyll`, and publishes `dist/`.
- For a custom domain, configure it in Settings → Pages.

## License

This project is licensed under the [MIT License](LICENSE).
