# Hexmap Generator

## Overview
Hexmap Generator is a React and TypeScript application that allows users to create and manipulate hexagonal grids. Users can input the number of rows and columns, enter text for individual hexes, paint and clear hexes, and draw freely in draw-mode. The application supports multiple modes, including a basic mode and an Age of Wonders mode, which allows users to drag and place various placeholders like trees, rocks, water, and character icons on the hexes.

## Features
- **Hex Grid Generation**: Users can specify the number of rows and columns to create a customizable hex grid.
- **Text Input**: Enter text for individual hex cells.
- **Painting and Clearing**: Paint hexes with colors and clear them as needed.
- **Draw Mode**: Freely draw on the hex grid.
- **Multiple Modes**: Switch between Basic mode and Age of Wonders mode for different functionalities.
- **Placeholder Management**: Drag and drop various placeholders onto the hex grid in Age of Wonders mode.

## Installation
To get started with the Hexmap Generator, clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd hexmap-generator
npm install
```

## Usage
To run the application, use the following command:

```bash
npm start
```

This will start the development server and open the application in your default web browser.

## Project Structure
The project is organized as follows:

```
hexmap-generator
├── src
│   ├── index.tsx
│   ├── App.tsx
│   ├── components
│   │   ├── HexGrid
│   │   ├── Toolbars
│   │   ├── Controls
│   │   ├── Placeholders
│   │   └── DrawCanvas
│   ├── hooks
│   ├── context
│   ├── modes
│   ├── types
│   ├── utils
│   ├── constants
│   ├── styles
│   └── App.module.css
├── public
│   └── index.html
├── package.json
├── tsconfig.json
└── README.md
```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.