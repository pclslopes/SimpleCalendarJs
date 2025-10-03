# SimpleCalendarJs

A clean, modern, and feature-rich JavaScript calendar component with responsive design and intuitive navigation.

## Features

- **Multiple Views**: Month, Week, and Day views
- **Responsive Design**: Mobile-friendly with hamburger menu for small screens
- **Event Management**: Add, edit, and display events
- **Modern Navigation**: Clean arrow buttons and dropdown navigation
- **Dark Mode Support**: Light and dark theme options
- **Zero Dependencies**: Pure JavaScript with no external dependencies
- **Customizable**: Flexible styling and configuration options
- **Touch-Friendly**: Optimized for mobile devices
- **Framework Agnostic**: Works with vanilla JS, React, Vue, Angular, and more

## Installation

### NPM Installation (Recommended)

```bash
npm install simple-calendar-js
```

Then include in your project:

```html
<!-- Include SimpleCalendarJs from node_modules -->
<link rel="stylesheet" href="node_modules/simple-calendar-js/css/SimpleCalendarJs.css">
<script src="node_modules/simple-calendar-js/js/SimpleCalendarJs.js"></script>
```

### CDN Installation (Alternative)

```html
<!-- Include SimpleCalendarJs -->
<link rel="stylesheet" href="css/SimpleCalendarJs.css">
<script src="js/SimpleCalendarJs.js"></script>
```

## Quick Start

### 1. Create Calendar Container

```html
<div id="calendar"></div>
```

### 2. Initialize Calendar

```javascript
// Method 1: Using ES6 class (recommended)
const calendar = new SimpleCalendar('#calendar', {
    mode: 'month',
    date: new Date(),
    data: [
        {
            start: '2024-11-15',
            end: '2024-11-17',
            title: 'Conference',
            backgroundColor: '#007bff'
        }
    ],
    events: function(params, callback) {
        // Fetch your events dynamically
        callback([
            {
                start: new Date(),
                title: 'Sample Event',
                backgroundColor: '#007bff'
            }
        ]);
    },
    dayClick: function(dateObject) {
        console.log('Day clicked:', dateObject);
        // dateObject is a Date object representing the clicked date
        // In day view, it includes time information (e.g., 14:30 for 2:30 PM slot)
    },
    eventClick: function(eventInfo) {
        console.log('Event clicked:', eventInfo);
        // eventInfo contains:
        // - day: Date object of the clicked calendar day
        // - data: Complete event object with all properties
    },
    stateChange: function(state) {
        console.log('Calendar state changed:', state);
        // Sync external controls with calendar state
    }
});

// Method 2: Directly instantiating with element
const calendarElement = document.querySelector('#calendar');
const calendar = new SimpleCalendar(calendarElement, {
    mode: 'month',
    date: new Date(),
    // ... same options as above
});
```

### 3. Auto-initialization with data attributes

```html
<!-- HTML -->
<div id="calendar" data-calendar='{"mode":"month"}'></div>
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `mode` | string | `'month'` | Initial view mode ('month', 'week', 'day') |
| `date` | Date | `new Date()` | Initial date to display |
| `data` | array | `[]` | Array of event objects to display |
| `events` | function | `null` | Function to fetch events dynamically |
| `dayClick` | function | `null` | Callback for day clicks |
| `eventClick` | function | `null` | Callback for event clicks |
| `stateChange` | function | `null` | Callback when calendar state changes |
| `showBackground` | boolean | `false` | Show background colors |
| `headerBackgroundColor` | string | `null` | Custom header background color |
| `bodyBackgroundColor` | string | `null` | Custom body background color |
| `showTimeInEvent` | boolean | `true` | Display time in events |
| `useShortDays` | boolean | `false` | Use short day names (Mon, Tue) |
| `showDayAsAllDayEvents` | boolean | `false` | Show day events as all-day |
| `eventBorder` | boolean | `false` | Add 1px border to calendar events |
| `showTodayButton` | boolean | `true` | Show/hide Today button |
| `showMonthYear` | boolean | `true` | Show/hide month/year navigation |
| `showModeButtons` | boolean | `true` | Show/hide Month/Week/Day buttons |
| `showNavigation` | boolean | `true` | Show/hide left/right arrow navigation |
| `theme` | string | `'auto'` | Theme mode: 'auto', 'light', or 'dark' |
| `todayname` | string | `'Today'` | Text for the Today button |
| `monthText` | string | `'Month'` | Text for the Month button |
| `weekText` | string | `'Week'` | Text for the Week button |
| `dayText` | string | `'Day'` | Text for the Day button |
| `days` | array | `['Sunday', 'Monday', ...]` | Full day names |
| `shortDays` | array | `['Sun', 'Mon', ...]` | Short day names |
| `months` | array | `['January', 'February', ...]` | Full month names |
| `shortMonths` | array | `['Jan', 'Feb', ...]` | Short month names |

## Event Object Format

```javascript
{
    start: new Date('2024-01-15T10:00:00'),
    end: new Date('2024-01-15T11:00:00'),
    title: 'Meeting',
    backgroundColor: '#007bff',
    allDay: false
}
```

## UI Customization

### Visibility Controls

SimpleCalendarJs allows you to customize which UI elements are visible:

```javascript
const calendar = new SimpleCalendar('#calendar', {
    showTodayButton: false,    // Hide the "Today" button
    showMonthYear: false,      // Hide month/year dropdowns
    showModeButtons: false,    // Hide Month/Week/Day buttons
    showNavigation: false,     // Hide left/right arrow navigation
    theme: 'dark',             // Force dark theme
    eventBorder: true          // Add borders to events
});
```

**Visibility Options:**
- **showTodayButton**: Controls the "Today" button in the header
- **showMonthYear**: Controls month dropdown, year dropdown, and date display
- **showModeButtons**: Controls Month/Week/Day view switcher (both desktop and mobile)
- **showNavigation**: Controls left/right arrow navigation buttons

**Theme Options:**
- **theme**: Set to 'auto' (default), 'light', or 'dark'
  - `'auto'`: Detects theme from document, Tailwind classes, or system preference
  - `'light'`: Forces light theme
  - `'dark'`: Forces dark theme

**Smart Layout:**
- When mode buttons are hidden, month/year navigation automatically aligns to the right
- When mode buttons are visible, month/year stays centered for balanced layout

### Event Styling

Control event appearance with borders and backgrounds:

```javascript
const calendar = new SimpleCalendar('#calendar', {
    eventBorder: true,         // Add 1px borders to events
    showBackground: true,      // Enable background colors
    headerBackgroundColor: '#e3f2fd',
    bodyBackgroundColor: '#fafafa'
});
```

**Border Features:**
- **Single events**: Full border with rounded corners
- **Multi-day events**: Seamless flow with borders only on outer edges
- **Automatic alignment**: Clear event placeholders maintain proper spacing

### Localization & Customization

SimpleCalendarJs provides comprehensive localization support for multiple languages. You can customize all text elements including button labels, day names, and month names.

#### Built-in Language Support

Choose from pre-configured languages:

```javascript
// English (default)
const calendar = new SimpleCalendar('#calendar', {
    todayname: 'Today',
    monthText: 'Month',
    weekText: 'Week', 
    dayText: 'Day',
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 
             'July', 'August', 'September', 'October', 'November', 'December'],
    shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
});

// German
const calendar = new SimpleCalendar('#calendar', {
    todayname: 'Heute',
    monthText: 'Monat',
    weekText: 'Woche',
    dayText: 'Tag',
    days: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    shortDays: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 
             'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    shortMonths: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
});

// Spanish
const calendar = new SimpleCalendar('#calendar', {
    todayname: 'Hoy',
    monthText: 'Mes',
    weekText: 'Semana',
    dayText: 'Día',
    days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    shortDays: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
             'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    shortMonths: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
                  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
});

// French
const calendar = new SimpleCalendar('#calendar', {
    todayname: 'Aujourd\'hui',
    monthText: 'Mois',
    weekText: 'Semaine',
    dayText: 'Jour',
    days: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    shortDays: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
    months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
             'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    shortMonths: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
                  'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
});
```

#### Custom Language Configuration

Create your own language configuration:

```javascript
const calendar = new SimpleCalendar('#calendar', {
    todayname: 'Vandaag',        // Dutch: Today
    monthText: 'Maand',          // Dutch: Month
    weekText: 'Week',            // Dutch: Week  
    dayText: 'Dag',              // Dutch: Day
    days: ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'],
    shortDays: ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'],
    months: ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
             'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'],
    shortMonths: ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec']
});
```

### Data Sources

Use either static data or dynamic event loading:

```javascript
// Static events
const calendar = new SimpleCalendar('#calendar', {
    data: [
        { start: '2024-11-15', title: 'Meeting', backgroundColor: '#007bff' },
        { start: '2024-11-20', end: '2024-11-22', title: 'Conference' }
    ]
});

// Dynamic events
const calendar = new SimpleCalendar('#calendar', {
    events: function(params, callback) {
        // params contains: defaultDate, start, end
        fetch('/api/events?' + new URLSearchParams({
            start: params.start.toISOString(),
            end: params.end.toISOString()
        }))
        .then(response => response.json())
        .then(callback);
    }
});
```

## API Methods

The SimpleCalendar class provides several methods for programmatic control:

```javascript
const calendar = new SimpleCalendar('#calendar', options);

// Update calendar options
calendar.updateOptions({
    mode: 'week',
    eventBorder: true
});

// Get current options
const currentOptions = calendar.getOptions();

// Destroy calendar instance
calendar.destroy();
```

### Available Methods

| Method | Description |
|--------|-------------|
| `updateOptions(options)` | Updates calendar options and redraws |
| `getOptions()` | Returns current calendar options |
| `destroy()` | Removes event listeners and cleans up |

## State Management

### stateChange Callback

The `stateChange` callback is triggered whenever the calendar's internal state changes, such as when users click view buttons (Month/Week/Day) or when options are programmatically updated. This enables two-way data binding between the calendar and external controls.

```javascript
const calendar = new SimpleCalendar('#calendar', {
    stateChange: function(state) {
        // Update your UI controls to match calendar state
        document.querySelector('#modeSelector').value = state.mode;
        document.querySelector('#backgroundToggle').checked = state.showBackground;
        document.querySelector('#timeToggle').checked = state.showTimeInEvent;
    }
});
```

The state object contains:
- `mode`: Current view mode ('month', 'week', 'day')
- `date`: Current date being displayed
- `showBackground`: Background display setting
- `showTimeInEvent`: Time display in events setting
- `useShortDays`: Short day names setting
- `showDayAsAllDayEvents`: All-day events display setting
- `eventBorder`: Border display on events setting
- `showTodayButton`: Today button visibility setting
- `showMonthYear`: Month/year navigation visibility setting
- `showModeButtons`: Mode buttons visibility setting

## Framework Integration

### React

```jsx
import { useEffect, useRef } from 'react';

function CalendarComponent({ options }) {
    const calendarRef = useRef();
    const calendarInstance = useRef();

    useEffect(() => {
        if (calendarRef.current) {
            calendarInstance.current = new SimpleCalendar(calendarRef.current, options);
        }
        
        return () => {
            if (calendarInstance.current) {
                calendarInstance.current.destroy();
            }
        };
    }, []);

    useEffect(() => {
        if (calendarInstance.current) {
            calendarInstance.current.updateOptions(options);
        }
    }, [options]);

    return <div ref={calendarRef} />;
}
```

### Next.js with Tailwind CSS

SimpleCalendarJs is fully compatible with Tailwind CSS. The calendar includes built-in CSS overrides to prevent conflicts with Tailwind's utility classes.

```jsx
import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';

function Calendar() {
    const { theme } = useTheme();
    const calendarRef = useRef();
    const calendarInstance = useRef();

    useEffect(() => {
        if (calendarRef.current) {
            calendarInstance.current = new SimpleCalendar(calendarRef.current, {
                theme: theme, // 'light', 'dark', or 'system'
                showBackground: false, // Set to false for transparent integration with Tailwind
                // other options...
            });
        }
        
        return () => {
            if (calendarInstance.current) {
                calendarInstance.current.destroy();
            }
        };
    }, [theme]);

    return <div ref={calendarRef} />;
}
```

**Tailwind CSS Compatibility Features:**
- **Automatic CSS specificity**: Built-in overrides prevent Tailwind utility conflicts
- **Transparent integration**: When `showBackground: false`, buttons and backgrounds are fully transparent
- **Text visibility**: Day numbers and button text use high-contrast colors that work with both light and dark themes
- **Reset prevention**: Calendar styles are protected from Tailwind's CSS reset

### Vue 3

```vue
<template>
    <div ref="calendar"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps(['options']);
const calendar = ref();
let calendarInstance;

onMounted(() => {
    calendarInstance = new SimpleCalendar(calendar.value, props.options);
});

onUnmounted(() => {
    if (calendarInstance) {
        calendarInstance.destroy();
    }
});

watch(() => props.options, (newOptions) => {
    if (calendarInstance) {
        calendarInstance.updateOptions(newOptions);
    }
}, { deep: true });
</script>
```

### Angular

```typescript
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

@Component({
    selector: 'simple-calendar',
    template: '<div #calendar></div>'
})
export class SimpleCalendarComponent implements OnInit, OnDestroy {
    @ViewChild('calendar', { static: true }) calendarRef!: ElementRef;
    @Input() options: any = {};
    
    private calendarInstance: any;

    ngOnInit() {
        this.calendarInstance = new (window as any).SimpleCalendar(
            this.calendarRef.nativeElement, 
            this.options
        );
    }

    ngOnDestroy() {
        if (this.calendarInstance) {
            this.calendarInstance.destroy();
        }
    }
}
```

## Responsive Behavior

- **Desktop (768px+)**: Full button navigation with Month | Week | Day buttons
- **Mobile (<768px)**: Compact hamburger menu for view switching
- **Touch-friendly**: Optimized touch targets and navigation

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## License

**Free for Personal and Non-Commercial Use**

This software is free to use for personal projects, educational purposes, and non-commercial applications.

**Commercial License Required**

For commercial use (websites, applications, or services that generate revenue), you must purchase a commercial license.

👉 **[Buy Commercial License](https://www.simplecalendarjs.com)**

See the [LICENSE](LICENSE) file for full terms.

## Support

- 📧 Email: simplecalendarjs@gmail.com
- 🌐 Website: [https://www.simplecalendarjs.com](https://www.simplecalendarjs.com)
- 📖 Documentation: Available on the website

## Author

Pedro Lopes