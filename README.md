# SimpleCalendarJs

Lightweight JS calendar (~16KB gzipped). Zero dependencies. Works in React, Vue, Angular, or vanilla JS out of the box. Month, week, day, and list views. Built-in date & range picker. No FullCalendar bloat.

[![npm version](https://img.shields.io/npm/v/simple-calendar-js)](https://www.npmjs.com/package/simple-calendar-js)
[![license](https://img.shields.io/npm/l/simple-calendar-js)](https://github.com/pclslopes/SimpleCalendarJs/blob/main/LICENSE)

## Features

- **Zero Dependencies** - Pure vanilla JavaScript, no external libraries
- **Four View Modes** - Month, week, day, and list views with smooth transitions
- **Picker Modes** - Built-in date picker and date range picker modes for date selection
- **Full Internationalization** - Built on Intl.DateTimeFormat API for native locale support
- **Framework Wrappers** - Official React, Vue 3, and Angular components included
- **Module System Support** - Works as UMD (CommonJS, AMD, ES modules, or browser global)
- **Dark Mode Ready** - Automatic dark theme detection and support
- **Async Event Loading** - Fetch events dynamically with `async/await` support
- **Drag & Drop** - Move and resize events with mouse or touch
- **Responsive Design** - Adapts to any screen size
- **Customizable Styling** - CSS custom properties for easy theming
- **Accessible** - Semantic HTML with proper ARIA attributes
- **Small Bundle Size** - ~45KB minified JS + ~22KB CSS (~16KB total gzipped)

## Screenshots

### Four View Modes

<table>
  <tr>
    <td width="50%">
      <img src="https://www.simplecalendarjs.com/Screenshots/Screenshot01-MonthView.png" alt="Month View" />
      <p align="center"><strong>Month View</strong></p>
    </td>
    <td width="50%">
      <img src="https://www.simplecalendarjs.com/Screenshots/Screenshot02-WeekView.png" alt="Week View" />
      <p align="center"><strong>Week View</strong></p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="https://www.simplecalendarjs.com/Screenshots/Screenshot03-DayView.png" alt="Day View" />
      <p align="center"><strong>Day View</strong></p>
    </td>
    <td width="50%">
      <img src="https://www.simplecalendarjs.com/Screenshots/Screenshot04-ListView.png" alt="List View" />
      <p align="center"><strong>List View</strong></p>
    </td>
  </tr>
</table>

### Drag & Drop / Resize Events

<table>
  <tr>
    <td width="50%">
      <img src="https://www.simplecalendarjs.com/Screenshots/Screenshot05-Resize.png" alt="Drag and Drop" />
      <p align="center"><strong>Drag & Drop Events</strong></p>
    </td>
    <td width="50%">
      <img src="https://www.simplecalendarjs.com/Screenshots/Screenshot06-Resize.png" alt="Resize Events" />
      <p align="center"><strong>Resize Events</strong></p>
    </td>
  </tr>
</table>

### Date Picker & Range Picker

<table>
  <tr>
    <td width="50%">
      <img src="https://www.simplecalendarjs.com/Screenshots/Screenshot07-DatePicker.png" alt="Date Picker Mode" />
      <p align="center"><strong>Date Picker Mode</strong></p>
    </td>
    <td width="50%">
      <img src="https://www.simplecalendarjs.com/Screenshots/Screenshot08-RangePicker.png" alt="Range Picker Mode" />
      <p align="center"><strong>Range Picker Mode</strong></p>
    </td>
  </tr>
</table>

## Installation

### NPM

```bash
npm install simple-calendar-js
```

### CDN

```html
<link rel="stylesheet" href="https://unpkg.com/simple-calendar-js/dist/simple-calendar-js.min.css">
<script src="https://unpkg.com/simple-calendar-js/dist/simple-calendar-js.min.js"></script>
```

### Manual Download

Download the files from the [dist/](https://github.com/pclslopes/SimpleCalendarJs/tree/main/dist) folder and include them in your project.

> **License:** Free for personal and open source use. Commercial projects require a license → [simplecalendarjs.com/#pricing](https://www.simplecalendarjs.com/#pricing)

## Quick Start

### Vanilla JavaScript

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="simple-calendar-js.css">
</head>
<body>
  <div id="calendar"></div>

  <script src="simple-calendar-js.js"></script>
  <script>
    const calendar = new SimpleCalendarJs('#calendar', {
      defaultView: 'month',
      locale: 'en-US',
      fetchEvents: async (startDate, endDate) => {
        // Fetch events from your API
        const response = await fetch(`/api/events?start=${startDate}&end=${endDate}`);
        return await response.json();
      },
      onEventClick: (event, mouseEvent) => {
        console.log('Event clicked:', event);
      }
    });
  </script>
</body>
</html>
```

### React

```jsx
import SimpleCalendarJsReact from 'simple-calendar-js/frameworks/simple-calendar-js-react.jsx';
import 'simple-calendar-js/dist/simple-calendar-js.min.css';

function MyCalendar() {
  const fetchEvents = async (startDate, endDate) => {
    const res = await fetch(`/api/events?start=${startDate}&end=${endDate}`);
    return await res.json();
  };

  return (
    <SimpleCalendarJsReact
      defaultView="month"
      locale="en-US"
      fetchEvents={fetchEvents}
      onEventClick={(event) => console.log(event)}
      style={{ height: '600px' }}
    />
  );
}
```

### Vue 3

```vue
<template>
  <SimpleCalendarJsVue
    :defaultView="'month'"
    :locale="'en-US'"
    :fetchEvents="fetchEvents"
    @eventClick="handleEventClick"
    :style="{ height: '600px' }"
  />
</template>

<script>
import SimpleCalendarJsVue from 'simple-calendar-js/frameworks/simple-calendar-js-vue.js';
import 'simple-calendar-js/dist/simple-calendar-js.min.css';

export default {
  components: { SimpleCalendarJsVue },
  methods: {
    async fetchEvents(startDate, endDate) {
      const res = await fetch(`/api/events?start=${startDate}&end=${endDate}`);
      return await res.json();
    },
    handleEventClick(event) {
      console.log('Event clicked:', event);
    }
  }
}
</script>
```

### Angular

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-calendar',
  template: `
    <simple-calendar-js
      [defaultView]="'month'"
      [locale]="'en-US'"
      [fetchEvents]="fetchEvents"
      (eventClick)="handleEventClick($event)"
      [style.height.px]="600"
    ></simple-calendar-js>
  `
})
export class CalendarComponent {
  async fetchEvents(startDate: Date, endDate: Date) {
    const res = await fetch(`/api/events?start=${startDate}&end=${endDate}`);
    return await res.json();
  }

  handleEventClick(event: any) {
    console.log('Event clicked:', event);
  }
}
```

## Configuration Options

Here are some of the most commonly used configuration options:

```javascript
const calendar = new SimpleCalendarJs('#calendar', {
  // View Settings
  defaultView: 'month',              // 'month', 'week', 'day', 'list'

  // Picker Modes
  mode: 'calendar',                  // 'calendar', 'date-picker', 'range-picker'

  // Internationalization
  locale: 'en-US',                   // Any valid locale (e.g., 'es-ES', 'fr-FR', 'ja-JP')
  firstDayOfWeek: 0,                 // 0 = Sunday, 1 = Monday

  // Events
  fetchEvents: async (start, end) => { /* ... */ },
  events: [],                        // Static events array

  // Interactions
  enableDragDrop: false,             // Enable drag & drop
  enableResize: false,               // Enable event resizing

  // Callbacks
  onEventClick: (event, mouseEvent) => {},
  onDateClick: (date, mouseEvent) => {},
  onEventDrop: (event, newStart, newEnd) => {},
  onEventResize: (event, newStart, newEnd) => {},
  onDateSelect: (date) => {},        // For date-picker mode
  onRangeSelect: (start, end) => {}, // For range-picker mode

  // Styling
  darkMode: 'auto',                  // 'auto', 'light', 'dark'
  enableHtmlInTitles: true,          // Allow HTML in event titles

  // Advanced
  timezone: 'local',                 // 'local', 'UTC', or IANA timezone
  monthViewTimedEventStyle: 'list',  // 'list' or 'block'
});
```

## API Methods

```javascript
// Navigation
calendar.goToDate(new Date());
calendar.next();
calendar.prev();
calendar.today();

// View Management
calendar.changeView('week');
calendar.getCurrentView();

// Events
calendar.addEvent(event);
calendar.updateEvent(eventId, updates);
calendar.deleteEvent(eventId);
calendar.refetchEvents();

// Picker Mode (date-picker/range-picker)
calendar.setSelectedDate(date);
calendar.getSelectedDate();
calendar.setSelectedRange(startDate, endDate);
calendar.getSelectedRange();
calendar.clearSelection();

// Cleanup
calendar.destroy();
```

## Full Documentation

For complete documentation including:
- Detailed configuration options
- Event object format and timezone handling
- Drag & drop and resize features
- Tooltips and HTML content
- Theming and dark mode
- Internationalization examples
- Advanced usage patterns

**Visit the full documentation at: [https://www.simplecalendarjs.com/docs](https://www.simplecalendarjs.com/docs)**

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Support & Issues

Found a bug or have a feature request? Please open an issue on [GitHub Issues](https://github.com/pclslopes/SimpleCalendarJs/issues).

When reporting bugs, please include:
- Steps to reproduce
- Expected vs actual behavior
- Browser and version
- Code snippets or examples

## Contributing

This project does not accept code contributions or pull requests. All development is handled by the maintainer to ensure code quality and licensing integrity.

However, you can help by:
- Reporting bugs via GitHub Issues
- Suggesting features
- Helping other users in discussions
- Sharing your implementation examples

See [CONTRIBUTING.md](https://github.com/pclslopes/SimpleCalendarJs/blob/main/CONTRIBUTING.md) for more details.

## License

This project is available for personal, educational, and non-commercial use.

**Commercial use requires a separate license.** See [LICENSE](https://github.com/pclslopes/SimpleCalendarJs/blob/main/LICENSE) file for full terms.

For commercial licensing inquiries: simplecalendarjs@gmail.com or visit [www.simplecalendarjs.com/#pricing](https://www.simplecalendarjs.com/#pricing)
