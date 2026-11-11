# SimpleCalendarJs

Lightweight JS calendar (~14KB gzipped JS, ~19KB with CSS). Zero dependencies. Works in React, Vue, Angular, or vanilla JS. Month, week, day, and list views. Built-in date & range picker. No FullCalendar bloat.

[![npm version](https://img.shields.io/npm/v/simple-calendar-js)](https://www.npmjs.com/package/simple-calendar-js)
[![npm downloads](https://img.shields.io/npm/dw/simple-calendar-js)](https://www.npmjs.com/package/simple-calendar-js)
[![license](https://img.shields.io/badge/license-free%20non--commercial%20%7C%20paid%20commercial-blue)](https://github.com/pclslopes/SimpleCalendarJs/blob/main/LICENSE)

[Live Demo →](https://simplecalendarjs.com/sandbox) · [Documentation →](https://simplecalendarjs.com/docs) · [Pricing →](https://simplecalendarjs.com/#pricing)

> **License:** Free for personal, educational, and open source projects. **Commercial use** (paid products, client websites, SaaS, internal company tools) **requires a license** — one-time or annual, per project → [simplecalendarjs.com/#pricing](https://simplecalendarjs.com/#pricing)

## Features

- **Zero Dependencies** - Pure vanilla JavaScript, no external libraries
- **Four View Modes** - Month, week, day, and list views
- **Picker Modes** - Built-in date picker and date range picker modes
- **Full Internationalization** - Built on the `Intl.DateTimeFormat` API for native locale support
- **Framework Wrappers** - React, Vue 3, and Angular wrappers included
- **Module System Support** - UMD build (CommonJS, AMD, bundlers, or browser global)
- **Dark Theme** - Built-in dark theme, toggled with one CSS class
- **Async Event Loading** - Fetch events per visible date range with `async/await`
- **Drag & Drop** - Move and resize events with mouse or touch
- **Responsive Design** - Adapts to any screen size
- **Customizable Styling** - CSS custom properties for easy theming
- **Accessible** - Semantic HTML with ARIA attributes
- **Small Bundle Size** - ~55KB minified JS + ~23KB CSS (~19KB total gzipped)

## Why SimpleCalendarJS?

| | SimpleCalendarJS | FullCalendar | React Big Calendar |
|---|---|---|---|
| Gzipped JS | ~14KB | ~40KB | ~52KB |
| Dependencies | 0 | Preact + Temporal polyfill | 16 |
| Framework | Any | Any (adapters) | React only |
| Views | Month, Week, Day, List | Month, Week, Day, List | Month, Week, Day, Agenda |
| Date & Range Picker | Built-in | No | No |
| Price | Free personal / Commercial license | MIT core / Premium | Free (MIT) |

<sub>JavaScript only, gzipped, per bundlephobia (November 2026): fullcalendar 7.1, react-big-calendar 1.20.</sub>

## Screenshots

### Four View Modes

<table>
  <tr>
    <td width="50%">
      <img src="https://simplecalendarjs.com/Screenshots/Screenshot01-MonthView.png" alt="Month View" />
      <p align="center"><strong>Month View</strong></p>
    </td>
    <td width="50%">
      <img src="https://simplecalendarjs.com/Screenshots/Screenshot02-WeekView.png" alt="Week View" />
      <p align="center"><strong>Week View</strong></p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="https://simplecalendarjs.com/Screenshots/Screenshot03-DayView.png" alt="Day View" />
      <p align="center"><strong>Day View</strong></p>
    </td>
    <td width="50%">
      <img src="https://simplecalendarjs.com/Screenshots/Screenshot04-ListView.png" alt="List View" />
      <p align="center"><strong>List View</strong></p>
    </td>
  </tr>
</table>

### Drag & Drop / Resize Events

<table>
  <tr>
    <td width="50%">
      <img src="https://simplecalendarjs.com/Screenshots/Screenshot05-Resize.png" alt="Drag and Drop" />
      <p align="center"><strong>Drag & Drop Events</strong></p>
    </td>
    <td width="50%">
      <img src="https://simplecalendarjs.com/Screenshots/Screenshot06-Resize.png" alt="Resize Events" />
      <p align="center"><strong>Resize Events</strong></p>
    </td>
  </tr>
</table>

### Date Picker & Range Picker

<table>
  <tr>
    <td width="50%">
      <img src="https://simplecalendarjs.com/Screenshots/Screenshot07-DatePicker.png" alt="Date Picker Mode" />
      <p align="center"><strong>Date Picker Mode</strong></p>
    </td>
    <td width="50%">
      <img src="https://simplecalendarjs.com/Screenshots/Screenshot08-RangePicker.png" alt="Range Picker Mode" />
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

Download [simple-calendar-js.min.js](https://unpkg.com/simple-calendar-js/dist/simple-calendar-js.min.js) and [simple-calendar-js.min.css](https://unpkg.com/simple-calendar-js/dist/simple-calendar-js.min.css) and include them in your page.

## Quick Start

### Vanilla JavaScript

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://unpkg.com/simple-calendar-js/dist/simple-calendar-js.min.css">
</head>
<body>
  <div id="calendar" style="height: 600px"></div>

  <script src="https://unpkg.com/simple-calendar-js/dist/simple-calendar-js.min.js"></script>
  <script>
    const calendar = new SimpleCalendarJs('#calendar', {
      defaultView: 'month',
      locale: 'en-US',
      // Called with the visible date range; return an array of events
      fetchEvents: async (start, end) => {
        const res = await fetch(`/api/events?start=${start.toISOString()}&end=${end.toISOString()}`);
        return await res.json(); // [{ id, title, start, end }, ...]
      },
      onEventClick: (event, mouseEvent) => {
        console.log('Event clicked:', event);
      }
    });
  </script>
</body>
</html>
```

With a bundler (Vite, webpack, etc.):

```js
import SimpleCalendarJs from 'simple-calendar-js';
import 'simple-calendar-js/dist/simple-calendar-js.min.css';

const calendar = new SimpleCalendarJs('#calendar', { /* options */ });
```

### Static events (no API)

Events are always provided through `fetchEvents`. For a fixed list, return it directly:

```js
const events = [
  { id: 1, title: 'Team Standup', start: new Date(2026, 10, 12, 9, 0), end: new Date(2026, 10, 12, 9, 30), color: '#4f46e5' },
  { id: 2, title: 'Conference', start: new Date(2026, 10, 16), end: new Date(2026, 10, 18), allDay: true }
];

const calendar = new SimpleCalendarJs('#calendar', {
  fetchEvents: async () => events
});
```

### Adding, updating, or removing events

Change your data, then call `refresh()` to clear the cache and re-run `fetchEvents`:

```js
events.push({ id: 3, title: 'Client Call', start: new Date(2026, 10, 14, 14, 0), end: new Date(2026, 10, 14, 15, 0) });
calendar.refresh();
```

## Event Object Format

```js
{
  id: 1,                      // Unique identifier (required for drag & drop)
  title: 'Meeting',           // Required: event title
  start: new Date(),          // Required: Date object or date string
  end: new Date(),            // Required: Date object or date string
  allDay: false,              // Optional: all-day event
  color: '#4f46e5',           // Optional: background color (hex)
  textColor: '#ffffff',       // Optional: text color
  borderColor: '#3730a3',     // Optional: border color
  description: 'Details',     // Optional: description (also used for the tooltip)
  tooltip: 'Custom tooltip'   // Optional: tooltip text (overrides description)
}
```

`start` and `end` must be present and valid. Events with a missing or invalid date (for example, using `startDate` instead of `start`) are not displayed.

## Framework Usage

The wrappers look for the `SimpleCalendarJs` class as a global. Bundlers don't create that global automatically, so import the core class once and expose it, as shown in each example below.

### React

```jsx
import SimpleCalendarJs from 'simple-calendar-js';
import SimpleCalendarJsReact from 'simple-calendar-js/frameworks/simple-calendar-js-react.jsx';
import 'simple-calendar-js/dist/simple-calendar-js.min.css';

globalThis.SimpleCalendarJs = SimpleCalendarJs; // required by the wrapper

const fetchEvents = async (start, end) => {
  const res = await fetch(`/api/events?start=${start.toISOString()}&end=${end.toISOString()}`);
  return await res.json();
};

export default function MyCalendar() {
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

**Next.js:** add `'use client';` at the top of the file, and add `transpilePackages: ['simple-calendar-js']` to `next.config.js` (the wrapper ships as a `.jsx` file).

Methods are available through a ref: `ref.current.setView('week')`, `navigate(1)`, `goToDate(date)`, `goToToday()`, `refresh()`, `getInstance()`.

### Vue 3

```vue
<script setup>
import SimpleCalendarJs from 'simple-calendar-js';
import SimpleCalendarJsVue from 'simple-calendar-js/frameworks/simple-calendar-js-vue.js';
import 'simple-calendar-js/dist/simple-calendar-js.min.css';

globalThis.SimpleCalendarJs = SimpleCalendarJs; // required by the wrapper

const fetchEvents = async (start, end) => {
  const res = await fetch(`/api/events?start=${start.toISOString()}&end=${end.toISOString()}`);
  return await res.json();
};

const handleEventClick = (event) => console.log('Event clicked:', event);
</script>

<template>
  <SimpleCalendarJsVue
    defaultView="month"
    locale="en-US"
    :fetchEvents="fetchEvents"
    @eventClick="handleEventClick"
    :style="{ height: '600px' }"
  />
</template>
```

Emitted events: `eventClick`, `slotClick`, `viewChange`, `navigate`. Methods are exposed through a template ref (same as React).

### Angular

Angular CLI doesn't compile TypeScript from `node_modules`, so use the core class directly in a component:

```typescript
import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import SimpleCalendarJs from 'simple-calendar-js';

@Component({
  selector: 'app-calendar',
  standalone: true,
  template: `<div #calendar style="height: 600px"></div>`
})
export class CalendarComponent implements AfterViewInit, OnDestroy {
  @ViewChild('calendar', { static: true }) el!: ElementRef<HTMLDivElement>;
  private calendar: any;

  ngAfterViewInit() {
    this.calendar = new SimpleCalendarJs(this.el.nativeElement, {
      defaultView: 'month',
      locale: 'en-US',
      fetchEvents: async (start: Date, end: Date) => {
        const res = await fetch(`/api/events?start=${start.toISOString()}&end=${end.toISOString()}`);
        return await res.json();
      },
      onEventClick: (event: any) => console.log('Event clicked:', event)
    });
  }

  ngOnDestroy() {
    this.calendar?.destroy();
  }
}
```

The package has no TypeScript types yet, so add a declaration file (e.g. `src/simple-calendar-js.d.ts`):

```typescript
declare module 'simple-calendar-js';
```

Add the stylesheet to the `styles` array in `angular.json`:

```json
"styles": ["node_modules/simple-calendar-js/dist/simple-calendar-js.min.css", "src/styles.css"]
```

### Wrapper limitations

The React and Vue wrappers pass through display options (`defaultView`, `defaultDate`, `weekStartsOn`, `locale`, `use24Hour`, `enabledViews`, the `show*` options, etc.), `fetchEvents`, the click/view/navigate callbacks, and `darkMode`. For **date-picker / range-picker modes** and **drag & drop**, create the calendar with the core class directly, as in the Angular example.

## Configuration Options

The most commonly used options:

```javascript
const calendar = new SimpleCalendarJs('#calendar', {
  // Views
  defaultView: 'month',                   // 'month', 'week', 'day', 'list'
  enabledViews: ['month', 'week', 'day'], // Add 'list' to show the list view button
  defaultDate: null,                      // Initial date (defaults to today)

  // Mode
  mode: 'calendar',                       // 'calendar', 'date-picker', 'range-picker'

  // Internationalization
  locale: 'en-US',                        // Any valid locale (e.g., 'es-ES', 'fr-FR', 'ja-JP')
  weekStartsOn: 0,                        // 0 = Sunday, 1 = Monday
  use24Hour: false,

  // Events
  fetchEvents: async (start, end) => [],  // Return events for the visible range

  // Interactions
  enableDragDrop: false,                  // Move events by dragging
  enableResize: false,                    // Resize events by dragging their end

  // Callbacks
  onEventClick: (event, mouseEvent) => {},
  onSlotClick: (date, mouseEvent) => {},  // Click on an empty day/time slot
  onEventDrop: (event, oldStart, oldEnd, newStart, newEnd) => {}, // After drag or resize
  onViewChange: (view) => {},
  onNavigate: (rangeStart, rangeEnd) => {},
  onDateSelect: (date) => {},             // date-picker mode
  onRangeSelect: (start, end) => {},      // range-picker mode

  // Display
  showToolbar: true,
  showTooltips: true,
  monthTimedEventStyle: 'list',           // 'list' or 'block'
  allowHtmlInEvents: true,                // Allow (sanitized) HTML in event titles
  listDaysForward: 30                     // Days shown in list view
});
```

See the [full documentation](https://simplecalendarjs.com/docs) for every option.

## API Methods

```javascript
// Navigation
calendar.navigate(1);              // Next month/week/day (-1 for previous)
calendar.goToToday();
calendar.goToDate(new Date(2026, 11, 25));

// Views
calendar.setView('week');          // 'month', 'week', 'day', 'list'

// Events
calendar.refresh();                // Clear the cache and re-run fetchEvents

// Picker modes
calendar.setSelectedDate(date);    // date-picker
calendar.getSelectedDate();
calendar.setSelectedRange(start, end); // range-picker
calendar.getSelectedRange();
calendar.clearSelection();

// Cleanup
calendar.destroy();
```

## Date & Range Picker

```javascript
const picker = new SimpleCalendarJs('#picker', {
  mode: 'range-picker',            // or 'date-picker'
  onRangeSelect: (start, end) => console.log(start, end)
});
```

## Dark Theme

Add the `uc-dark` class to the calendar container (or any parent element):

```javascript
document.querySelector('#calendar').classList.add('uc-dark');
```

To follow the system setting:

```javascript
const media = window.matchMedia('(prefers-color-scheme: dark)');
const apply = () => document.querySelector('#calendar').classList.toggle('uc-dark', media.matches);
apply();
media.addEventListener('change', apply);
```

The React, Vue, and Angular wrappers accept a `darkMode` boolean prop instead.

## Full Documentation

Complete documentation, including every option, timezone handling, tooltips, theming with CSS variables, and internationalization:

**[simplecalendarjs.com/docs](https://simplecalendarjs.com/docs)**

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

Commercial license holders get priority email support at simplecalendarjs@gmail.com.

## Contributing

Development is maintained by a single author to ensure quality and licensing integrity — but contributions are very welcome via issues and feedback.

You can help by:
- Reporting bugs via GitHub Issues
- Suggesting features
- Helping other users in discussions
- Sharing your implementation examples

See [CONTRIBUTING.md](https://github.com/pclslopes/SimpleCalendarJs/blob/main/CONTRIBUTING.md) for more details.

## License

Free for personal, educational, and open source use.

**Commercial use requires a license** — one license per commercial project. See the [LICENSE](https://github.com/pclslopes/SimpleCalendarJs/blob/main/LICENSE) file for full terms.

Buy a license at [simplecalendarjs.com/#pricing](https://simplecalendarjs.com/#pricing) or email simplecalendarjs@gmail.com.
