# SimpleCalendarJs

## Overview
A robust, feature-rich JavaScript calendar application with modern web technologies.

## Features
- Full month view rendering
- Event management
- Date selection
- Responsive design
- Customizable themes (bootstrap)

## Installation
```bash
npm install js-interactive-calendar
```

## Usage
```javascript
import Calendar from 'js-interactive-calendar';

const calendar = new Calendar('#calendar-container', {
  initialView: 'month',
  events: [...]
});
```

## Configuration Options
- `initialView`: Default calendar view
- `firstDayOfWeek`: Customize week start
- `theme`: Custom color schemes
- `events`: Pre-populate calendar events

## Technologies
- Vanilla JavaScript
- JQuery
- Moment
- Bootstrap
- Responsive Design
- Modular Architecture

## License
MIT License

## Author
Pedro Lopes.