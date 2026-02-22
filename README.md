# SimpleCalendarJs

A lightweight, zero-dependency JavaScript calendar component with internationalization support and framework wrappers for React, Vue, and Angular.

![Version](https://img.shields.io/badge/version-3.0.3-blue.svg)
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
| `weekdayFormat` | string | `'short'` | Weekday name format: `'narrow'` (1-2 letters), `'short'` (abbreviated), or `'long'` (full name) |
| `use24Hour` | boolean | `false` | Use 24-hour time format |
| `showTimeInItems` | boolean | `true` | Show time in event items |
| `showGridLines` | boolean | `true` | Show calendar grid lines |
| `showBorder` | boolean | `true` | Show calendar outer border |
| `maxEventsPerCell` | number | `3` | Maximum events per cell in month view before showing "+N more". Set to `0` for unlimited (show all events) |
| `showToolbar` | boolean | `true` | Show the toolbar |
| `showTodayButton` | boolean | `true` | Show "Today" button |
| `showNavigation` | boolean | `true` | Show prev/next navigation arrows |
| `showTitle` | boolean | `true` | Show month/year title |
| `showYearPicker` | boolean | `true` | Enable year picker dropdown (month view) |
| `showViewSwitcher` | boolean | `true` | Show view switcher buttons |
| `showTooltips` | boolean | `true` | Show tooltips on hover for events |
| `enabledViews` | string[] | `['month', 'week', 'day']` | Available view modes |
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
  description?: string;          // Event description (also used for tooltip if tooltip not provided)
  tooltip?: string;              // Custom tooltip text shown on hover (overrides description)
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
    color: '#3b82f6',
    tooltip: 'Weekly team sync\nDiscuss Q1 roadmap and sprint planning'
  },
  {
    id: 2,
    title: 'Conference',
    start: new Date('2024-03-20T00:00:00'),
    end: new Date('2024-03-22T23:59:59'),
    allDay: true,
    color: '#10b981',
    description: 'Tech Conference 2024\nDowntown Convention Center'
  }
];
```

## Tooltips

SimpleCalendarJs includes built-in tooltip support for displaying additional event information on hover.

### How Tooltips Work

Tooltips appear when you hover over an event for 400ms. They display content based on the following priority:

1. **`tooltip` property** (highest priority) - Custom tooltip text
2. **`description` property** - Falls back if no tooltip is provided
3. **`title` property** - Falls back if neither tooltip nor description is provided

### Basic Usage

```javascript
const events = [
  {
    id: 1,
    title: 'Team Meeting',
    start: new Date('2024-03-15T10:00:00'),
    end: new Date('2024-03-15T11:00:00'),
    tooltip: 'Weekly team sync\nDiscuss Q1 roadmap'  // Custom tooltip
  },
  {
    id: 2,
    title: 'Client Call',
    start: new Date('2024-03-15T14:00:00'),
    end: new Date('2024-03-15T15:00:00'),
    description: 'Requirements gathering\nPrepare demo'  // Used as tooltip
  },
  {
    id: 3,
    title: 'Code Review',
    start: new Date('2024-03-15T16:00:00'),
    end: new Date('2024-03-15T17:00:00')
    // No tooltip/description - will show title
  }
];
```

### Multiline Tooltips

Use `\n` (newline character) in your tooltip or description text to create multiple lines:

```javascript
{
  id: 1,
  title: 'Project Kickoff',
  start: new Date('2024-03-20T09:00:00'),
  end: new Date('2024-03-20T10:30:00'),
  tooltip: 'Project Kickoff Meeting\n\nAgenda:\n- Introductions\n- Timeline review\n- Q&A session\n\nLocation: Conference Room A'
}
```

### Tooltip Features

- **Smart Positioning**: Tooltips automatically adjust their position to stay visible:
  - Events near the **top** of the viewport: tooltip shows below
  - Events near the **right edge**: tooltip aligns to the right
  - Events near the **left edge**: tooltip aligns to the left

- **Visual Design**:
  - Dark background with rounded corners
  - Small arrow pointing to the event
  - Smooth fade-in animation (400ms delay)
  - Supports both light and dark themes

- **Responsive**: Tooltips overflow outside calendar boundaries to ensure full visibility

### Disabling Tooltips

You can disable tooltips globally using the `showTooltips` option:

```javascript
const calendar = new SimpleCalendarJs('#calendar', {
  showTooltips: false,  // Disable all tooltips
  fetchEvents: async (start, end) => { ... }
});
```

### Styling Tooltips

Tooltips use CSS custom properties and can be customized:

```css
:root {
  --cal-tooltip-bg: #1f2937;           /* Background color */
  --cal-tooltip-text: #f9fafb;         /* Text color */
  --cal-tooltip-border: #374151;       /* Border color */
  --cal-tooltip-max-width: 250px;      /* Maximum width */
  --cal-tooltip-padding: 8px 12px;     /* Inner padding */
  --cal-tooltip-radius: 6px;           /* Border radius */
  --cal-tooltip-font-size: 12px;       /* Font size */
  --cal-tooltip-offset: 8px;           /* Distance from event */
}
```

### Limitations

- Tooltips display **plain text only** (no HTML rendering)
- Special characters are automatically escaped for security
- Maximum width is 250px by default (can be customized via CSS variables)

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

### Weekday Name Format

Control how day names are displayed using the `weekdayFormat` option:

```javascript
const calendar = new SimpleCalendarJs('#calendar', {
  locale: 'pt-PT',
  weekdayFormat: 'long'  // Full day names
});
```

**Available formats:**
- `'narrow'` - 1-2 letter abbreviation (S, M, T, W, T, F, S)
- `'short'` - Short abbreviation (Sun, Mon, Tue... or Dom, Seg, Ter...)
- `'long'` - Full day name (Sunday, Monday... or Domingo, Segunda-feira...)

**Examples:**

```javascript
// English with narrow format
new SimpleCalendarJs('#calendar', {
  locale: 'en-US',
  weekdayFormat: 'narrow'  // S M T W T F S
});

// Portuguese (Portugal) with long format
new SimpleCalendarJs('#calendar', {
  locale: 'pt-PT',
  weekdayFormat: 'long'  // Domingo Segunda-feira Terça-feira...
});

// Portuguese (Brazil) with short format (default)
new SimpleCalendarJs('#calendar', {
  locale: 'pt-BR',
  weekdayFormat: 'short'  // Dom Seg Ter Qua...
});
```

**Note:** Different locales may format the same option differently. For example, `'short'` in `pt-PT` might display "Sábado" while `pt-BR` displays "Sáb." - this is controlled by the browser's Intl API based on locale conventions. Use `weekdayFormat` to control the length/style consistently.

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

Customize the calendar appearance using CSS custom properties.

### Override Light Mode Colors

Target the `.uc-calendar` class to customize light mode:

```css
.uc-calendar {
  /* Primary color */
  --cal-primary: #10b981;           /* Green theme */
  --cal-primary-dark: #059669;
  --cal-primary-light: #d1fae5;

  /* Today indicator */
  --cal-today-bg: #d1fae5;
  --cal-today-text: #059669;
}
```

### Override Dark Mode Colors

Target `.uc-calendar.uc-dark` to customize dark mode:

```css
.uc-calendar.uc-dark {
  /* Dark mode colors */
  --cal-bg: #1f2937;
  --cal-bg-secondary: #111827;
  --cal-text: #f9fafb;
  --cal-border: #374151;

  /* Dark mode today/selected indicators */
  --cal-today-bg: #065f46;          /* Custom dark green */
  --cal-selected-bg: #047857;
}
```

### Customize Both Light and Dark Modes

Example with a complete brand color scheme:

```css
/* Light mode - Yellow theme */
.uc-calendar {
  --cal-primary: #eab308;           /* yellow-500 */
  --cal-primary-dark: #ca8a04;      /* yellow-600 */
  --cal-primary-light: #fef9c3;     /* yellow-100 */
  --cal-today-bg: #fef9c3;
  --cal-today-text: #854d0e;
}

/* Dark mode - Yellow theme */
.uc-calendar.uc-dark {
  --cal-primary: #eab308;
  --cal-primary-dark: #facc15;
  --cal-primary-light: #713f12;
  --cal-today-bg: #713f12;          /* yellow-900 */
  --cal-selected-bg: #854d0e;       /* yellow-800 */
}
```

### Available CSS Variables

**Colors:**
- `--cal-primary`, `--cal-primary-dark`, `--cal-primary-light` - Primary theme colors
- `--cal-bg`, `--cal-bg-secondary` - Background colors
- `--cal-text`, `--cal-text-subtle`, `--cal-text-muted` - Text colors
- `--cal-border`, `--cal-border-strong` - Border colors
- `--cal-today-bg`, `--cal-today-text` - Today indicator
- `--cal-selected-bg` - Selected date background
- `--cal-hover`, `--cal-hover-strong` - Hover states

**Sizing:**
- `--cal-font-size` - Base font size (default: 13px)
- `--cal-hour-height` - Hour row height in week/day views (default: 60px)
- `--cal-event-height` - Event bar height (default: 22px)

**Tooltips:**
- `--cal-tooltip-bg`, `--cal-tooltip-text`, `--cal-tooltip-border` - Tooltip colors
- `--cal-tooltip-max-width`, `--cal-tooltip-padding`, `--cal-tooltip-radius` - Tooltip sizing
- `--cal-tooltip-font-size`, `--cal-tooltip-offset` - Tooltip typography

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
