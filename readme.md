# Solar-System

A modern, interactive CSS and JavaScript solar system visualization.

## Features

- 3D/2D solar system view
- Interactive controls for zoom, speed, size, and distance
- Responsive design
- Built with vanilla JavaScript and Sass

## Getting Started

### Prerequisites

- Node.js and Yarn
- Python 3 (used by the local dev server)

### Install dependencies

```sh
yarn install
```

### Build CSS from Sass

```sh
yarn build:sass
```

### Start local server

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

- Edit Sass files in `sass/` and run `yarn build:sass` to update CSS.
- Edit JavaScript in `js/scripts.js` (vanilla JS, no jQuery required).

## Project Structure

- `index.html` — Main HTML file
- `css/` — Compiled CSS
- `sass/` — Source Sass files
- `js/` — JavaScript files

## License

This project is licensed under the [MIT License](LICENSE).
