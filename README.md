# SimpleCalendarJs

A lightweight, zero-dependency JavaScript calendar component with internationalization support and framework wrappers for React, Vue, and Angular.

![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)
![License](https://img.shields.io/badge/license-See%20LICENSE-green.svg)

## Features

- **Zero Dependencies** - Pure vanilla JavaScript, no external libraries
- **Three View Modes** - Month, week, and day views with smooth transitions
- **Full Internationalization** - Built on Intl.DateTimeFormat API for native locale support
- **Framework Wrappers** - Official React, Vue 3, and Angular components included
- **Module System Support** - Works as UMD (CommonJS, AMD, ES modules, or browser global)
- **Dark Mode Ready** - Automatic dark theme detection and support
- **Async Event Loading** - Fetch events dynamically with `async/await` support
- **Responsive Design** - Adapts to any screen size
- **Customizable Styling** - CSS custom properties for easy theming
- **Accessible** - Semantic HTML with proper ARIA attributes
- **Small Bundle Size** - ~22KB minified JS, ~14KB minified CSS

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

Download the files from the [dist/](dist/) folder and include them in your project.

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

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `defaultView` | string | `'month'` | Initial view: `'month'`, `'week'`, or `'day'` |
| `defaultDate` | Date | `new Date()` | Initial date to display |
| `weekStartsOn` | number | `0` | First day of week: `0` (Sunday) or `1` (Monday) |
| `locale` | string | `'default'` | Locale code for Intl API (e.g., `'en-US'`, `'fr-FR'`, `'ja-JP'`) |
| `use24Hour` | boolean | `false` | Use 24-hour time format |
| `showTimeInItems` | boolean | `true` | Show time in event items |
| `showGridLines` | boolean | `true` | Show calendar grid lines |
| `showToolbar` | boolean | `true` | Show the toolbar |
| `showTodayButton` | boolean | `true` | Show "Today" button |
| `showNavigation` | boolean | `true` | Show prev/next navigation arrows |
| `showTitle` | boolean | `true` | Show month/year title |
| `showYearPicker` | boolean | `true` | Enable year picker dropdown (month view) |
| `showViewSwitcher` | boolean | `true` | Show view switcher buttons |
| `enabledViews` | string[] | `['month', 'week', 'day']` | Available view modes |
| `primaryColor` | string | `'#4f46e5'` | Primary theme color (hex) |
| `fetchEvents` | function | `null` | Async function to fetch events: `async (start, end) => Event[]` |
| `onEventClick` | function | `null` | Callback when event is clicked: `(event, mouseEvent) => void` |
| `onSlotClick` | function | `null` | Callback when time slot is clicked: `(date, mouseEvent) => void` |
| `onViewChange` | function | `null` | Callback when view changes: `(view) => void` |
| `onNavigate` | function | `null` | Callback when date range changes: `(startDate, endDate) => void` |

## Event Object Format

Events returned by `fetchEvents` should follow this structure:

```typescript
interface CalendarEvent {
  id: string | number;           // Unique identifier
  title: string;                 // Event title
  start: Date;                   // Start date/time
  end?: Date;                    // End date/time (optional, defaults to start)
  allDay?: boolean;              // All-day event flag (optional)
  color?: string;                // Custom color (hex, optional)
  [key: string]: any;            // Any additional custom properties
}
```

### Example Events

```javascript
const events = [
  {
    id: 1,
    title: 'Team Meeting',
    start: new Date('2024-03-15T10:00:00'),
    end: new Date('2024-03-15T11:00:00'),
    color: '#3b82f6'
  },
  {
    id: 2,
    title: 'Conference',
    start: new Date('2024-03-20T00:00:00'),
    end: new Date('2024-03-22T23:59:59'),
    allDay: true,
    color: '#10b981'
  }
];
```

## API Methods

```javascript
// Switch view
calendar.setView('week');

// Navigate forward/backward
calendar.navigate(1);   // Next period
calendar.navigate(-1);  // Previous period

// Jump to specific date
calendar.goToDate(new Date('2024-12-25'));

// Jump to today
calendar.goToToday();

// Cleanup (important for SPAs)
calendar.destroy();
```

## Internationalization

SimpleCalendarJs uses the native Intl.DateTimeFormat API for full locale support. Simply pass a valid locale code:

```javascript
// French
const calendar = new SimpleCalendarJs('#calendar', {
  locale: 'fr-FR',
  weekStartsOn: 1  // Monday
});

// Japanese
const calendar = new SimpleCalendarJs('#calendar', {
  locale: 'ja-JP'
});

// Arabic (RTL support automatic)
const calendar = new SimpleCalendarJs('#calendar', {
  locale: 'ar-SA'
});
```

Supported locales include: `en-US`, `en-GB`, `fr-FR`, `de-DE`, `es-ES`, `it-IT`, `pt-PT`, `pt-BR`, `ja-JP`, `zh-CN`, `ko-KR`, `ar-SA`, `ru-RU`, `tr-TR`, and [many more](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#locales).

## Dark Mode

Dark mode is automatically detected from the user's system preferences. You can also manually toggle it:

```javascript
// Set data-theme attribute on <html> or <body>
document.documentElement.setAttribute('data-theme', 'dark');

// Or add a CSS class
document.documentElement.classList.add('dark');
```

For framework wrappers, use the `darkMode` prop:

```jsx
// React
<SimpleCalendarJsReact darkMode={isDark} />

// Vue
<SimpleCalendarJsVue :darkMode="isDark" />

// Angular
<simple-calendar-js [darkMode]="isDark"></simple-calendar-js>
```

## Styling & Theming

Customize the calendar appearance using CSS custom properties:

```css
.uc-calendar {
  /* Primary color */
  --cal-primary: #4f46e5;
  --cal-primary-dark: #4338ca;
  --cal-primary-light: #eef2ff;

  /* Background colors */
  --cal-bg: #ffffff;
  --cal-bg-secondary: #f9fafb;

  /* Text colors */
  --cal-text: #111827;
  --cal-text-subtle: #6b7280;

  /* Borders */
  --cal-border: #e5e7eb;

  /* Today indicator */
  --cal-today-bg: #eef2ff;
  --cal-today-text: var(--cal-primary);

  /* Events */
  --cal-event-bg: var(--cal-primary);
  --cal-event-text: #ffffff;

  /* Sizing */
  --cal-font-size: 13px;
  --cal-hour-height: 60px;
}
```

All styles are scoped under `.uc-calendar` to prevent conflicts with your existing CSS.

## Framework Wrapper APIs

### React

```jsx
import { useRef } from 'react';
import SimpleCalendarJsReact from 'simple-calendar-js/frameworks/simple-calendar-js-react.jsx';

function MyComponent() {
  const calendarRef = useRef();

  const handleSomeAction = () => {
    // Access imperative methods
    calendarRef.current.goToToday();
    calendarRef.current.setView('week');
    calendarRef.current.navigate(1);
    calendarRef.current.goToDate(new Date('2024-12-25'));
  };

  return (
    <SimpleCalendarJsReact
      ref={calendarRef}
      defaultView="month"
      fetchEvents={fetchEvents}
      onEventClick={(event) => console.log(event)}
      onSlotClick={(date) => console.log('Clicked:', date)}
      onViewChange={(view) => console.log('View:', view)}
      onNavigate={(start, end) => console.log('Range:', start, end)}
    />
  );
}
```

### Vue 3

```vue
<template>
  <SimpleCalendarJsVue
    ref="calendar"
    :defaultView="'month'"
    :fetchEvents="fetchEvents"
    @eventClick="handleEventClick"
    @slotClick="handleSlotClick"
    @viewChange="handleViewChange"
    @navigate="handleNavigate"
  />
</template>

<script>
export default {
  methods: {
    someAction() {
      // Access imperative methods
      this.$refs.calendar.goToToday();
      this.$refs.calendar.setView('week');
      this.$refs.calendar.navigate(1);
      this.$refs.calendar.goToDate(new Date('2024-12-25'));
    }
  }
}
</script>
```

### Angular

```typescript
import { Component, ViewChild } from '@angular/core';
import { SimpleCalendarJsComponent } from 'simple-calendar-js/frameworks/simple-calendar-js-angular.component';

@Component({
  selector: 'app-root',
  template: `
    <simple-calendar-js
      #calendar
      [defaultView]="'month'"
      [fetchEvents]="fetchEvents"
      (eventClick)="handleEventClick($event)"
      (slotClick)="handleSlotClick($event)"
      (viewChange)="handleViewChange($event)"
      (navigate)="handleNavigate($event)"
    ></simple-calendar-js>
  `
})
export class AppComponent {
  @ViewChild('calendar') calendar!: SimpleCalendarJsComponent;

  someAction() {
    // Access imperative methods
    this.calendar.goToToday();
    this.calendar.setView('week');
    this.calendar.navigate(1);
    this.calendar.goToDate(new Date('2024-12-25'));
  }
}
```

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## License

This project is available for personal, educational, and non-commercial use.

**Commercial use requires a separate license.** See [LICENSE](LICENSE) file for full terms.

For commercial licensing inquiries: simplecalendarjs@gmail.com

## Links

- **Documentation**: [docs.html](docs.html)
- **Demo**: [index.html](index.html)
- **Repository**: [github.com/pclslopes/SimpleCalendarJs](https://github.com/pclslopes/SimpleCalendarJs)
- **NPM**: [npmjs.com/package/simple-calendar-js](https://www.npmjs.com/package/simple-calendar-js)
- **Website**: [simplecalendarjs.com](https://www.simplecalendarjs.com)
