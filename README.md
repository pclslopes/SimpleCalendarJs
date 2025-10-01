# SimpleCalendarJs

A clean, modern, and feature-rich JavaScript calendar component with responsive design and intuitive navigation.

## Features

- **Multiple Views**: Month, Week, and Day views
- **Responsive Design**: Mobile-friendly with hamburger menu for small screens
- **Event Management**: Add, edit, and display events
- **Modern Navigation**: Clean arrow buttons and dropdown navigation
- **Dark Mode Support**: Light and dark theme options
- **No Dependencies**: Pure JavaScript with jQuery
- **Customizable**: Flexible styling and configuration options
- **Touch-Friendly**: Optimized for mobile devices

## Installation

### NPM Installation (Recommended)

```bash
npm install simple-calendar-js
```

Then include in your project:

```html
<!-- Include jQuery (peer dependency) -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<!-- Include SimpleCalendarJs from node_modules -->
<link rel="stylesheet" href="node_modules/simple-calendar-js/css/SimpleCalendarJs.css">
<script src="node_modules/simple-calendar-js/js/SimpleCalendarJs.js"></script>
```

### CDN Installation (Alternative)

```html
<!-- Include jQuery -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

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
$('#calendar').calendar({
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
    dayClick: function(params) {
        console.log('Day clicked:', params.dateClick);
    },
    eventClick: function(params) {
        console.log('Event clicked:', params.event);
    },
    stateChange: function(state) {
        console.log('Calendar state changed:', state);
        // Sync external controls with calendar state
    }
});
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
| `todayname` | string | `'Today'` | Text for the Today button |
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
$('#calendar').calendar({
    showTodayButton: false,    // Hide the "Today" button
    showMonthYear: false,      // Hide month/year dropdowns
    showModeButtons: false,    // Hide Month/Week/Day buttons
    eventBorder: true          // Add borders to events
});
```

**Visibility Options:**
- **showTodayButton**: Controls the "Today" button in the header
- **showMonthYear**: Controls month dropdown, year dropdown, and date display
- **showModeButtons**: Controls Month/Week/Day view switcher (both desktop and mobile)

**Smart Layout:**
- When mode buttons are hidden, month/year navigation automatically aligns to the right
- When mode buttons are visible, month/year stays centered for balanced layout

### Event Styling

Control event appearance with borders and backgrounds:

```javascript
$('#calendar').calendar({
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

Customize text and language settings:

```javascript
$('#calendar').calendar({
    todayname: 'Heute',    // Custom Today button text
    days: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    shortDays: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 
             'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    shortMonths: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
});
```

### Data Sources

Use either static data or dynamic event loading:

```javascript
// Static events
$('#calendar').calendar({
    data: [
        { start: '2024-11-15', title: 'Meeting', backgroundColor: '#007bff' },
        { start: '2024-11-20', end: '2024-11-22', title: 'Conference' }
    ]
});

// Dynamic events
$('#calendar').calendar({
    events: function(params, callback) {
        // params contains: defaultDate, start, end
        $.ajax({
            url: '/api/events',
            data: { start: params.start, end: params.end },
            success: callback
        });
    }
});
```

## State Management

### stateChange Callback

The `stateChange` callback is triggered whenever the calendar's internal state changes, such as when users click view buttons (Month/Week/Day) or when options are programmatically updated. This enables two-way data binding between the calendar and external controls.

```javascript
$('#calendar').calendar({
    stateChange: function(state) {
        // Update your UI controls to match calendar state
        $('#modeSelector').val(state.mode);
        $('#backgroundToggle').prop('checked', state.showBackground);
        $('#timeToggle').prop('checked', state.showTimeInEvent);
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

- 📧 Email: hello@simplecalendarjs.com
- 🌐 Website: [https://www.simplecalendarjs.com](https://www.simplecalendarjs.com)
- 📖 Documentation: Available on the website

## Author

Pedro Lopes