# Simple Calendar JS

A pure JavaScript calendar component with no dependencies. Features responsive design, multiple view modes, and customizable styling.

## Features

- **Pure JavaScript** - No jQuery or other dependencies
- **Three View Modes** - Month, Week, and Day views
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Time-based Views** - Week and day views with customizable time slots
- **Fullday Mode** - Toggle between time-based and fullday event display
- **Multi-day Events** - Seamless event display across multiple days
- **Smart Event Fetching** - Callback-based event loading with intelligent caching
- **Event Callbacks** - Day click, event click, and state change handlers
- **Grid Border Control** - Customizable grid borders (both, vertical, horizontal, none)
- **CSS Prefix** - All classes prefixed with 'sc-' to avoid conflicts
- **Template Strings** - Clean HTML generation using template literals
- **Event Support** - Add, remove, and display events
- **Keyboard Navigation** - Arrow keys, T (today), M/W/D (views)

## Quick Start

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="css/simple-calendar-js.css">
</head>
<body>
    <div id="calendar"></div>
    
    <script src="js/simple-calendar-js.js"></script>
    <script>
        const calendar = new SimpleCalendarJs('#calendar', {
            view: 'month',
            date: new Date(),
            fulldayMode: false,
            events: []
        });
    </script>
</body>
</html>
```

## Configuration Options

```javascript
const calendar = new SimpleCalendarJs('#calendar', {
    // View Configuration
    view: 'month',                    // 'month', 'week', or 'day'
    date: new Date(),                 // Initial date to display
    fulldayMode: false,               // Show fullday events only
    
    // Time Configuration (for week/day views)
    startHour: 6,                     // Start time for week/day view (0-23)
    endHour: 22,                      // End time for week/day view (0-23)
    timeSlotMinutes: 30,              // Time slot intervals (currently supports 30)
    
    // Visual Configuration
    gridBorders: 'both',              // 'both', 'vertical', 'horizontal', 'none'
    eventBorders: false,              // true/false - whether events should have borders
    eventBorderColor: '#6c757d',      // Color for event borders (when eventBorders: true)
    defaultEventColor: '#4c6f94',     // Default color for events without custom colors
    
    // UI Element Visibility
    showMonthButton: true,            // true/false - show month view button
    showWeekButton: true,             // true/false - show week view button
    showDayButton: true,              // true/false - show day view button
    showNavigation: true,             // true/false - show navigation buttons (prev/next)
    
    // Data Configuration
    events: [],                       // Array of event objects OR callback function
    
    // Event Handlers
    dayClick: null,                   // Function called when day is clicked
    eventClick: null,                 // Function called when event is clicked
    changeState: null                 // Function called when calendar state changes
});
```

## Event Format

```javascript
// Single-day event with basic properties
const singleEvent = {
    id: 1,
    title: 'Meeting',
    date: new Date('2023-12-25'),
    time: '10:00 AM'           // Optional: for time-based views
};

// Multi-day event with basic properties
const multiDayEvent = {
    id: 2,
    title: 'Conference',
    startDate: new Date('2023-12-25'),
    endDate: new Date('2023-12-27'),
    time: '9:00 AM'            // Optional: shown on start day
};

// Event with custom colors and styling
const coloredEvent = {
    id: 3,
    title: 'Important Meeting',
    date: new Date('2023-12-25'),
    time: '2:00 PM',
    color: '#e74c3c',          // Custom color (hex format)
    colorIsGradient: true      // Apply gradient effect to color
};

// Event with solid custom color
const solidColorEvent = {
    id: 4,
    title: 'Team Lunch',
    date: new Date('2023-12-26'),
    color: '#2ecc71',          // Custom green color
    colorIsGradient: false     // Use solid color (default behavior)
};

// Event with gradient using default color
const defaultGradientEvent = {
    id: 5,
    title: 'Training Session',
    date: new Date('2023-12-27'),
    colorIsGradient: true      // Use default color with gradient
};
```

### Event Color Properties

| Property | Type | Description |
|----------|------|-------------|
| `color` | string | Hex color code (e.g., '#e74c3c'). If not provided, uses `defaultEventColor` |
| `colorIsGradient` | boolean | When `true`, creates a subtle gradient effect. When `false` or omitted, uses solid color |

### Color Logic
1. **`event.color` + `colorIsGradient: true`** → Custom color with gradient effect
2. **`event.color` + `colorIsGradient: false`** → Custom solid color
3. **`colorIsGradient: true` (no color)** → Default color with gradient effect
4. **No color properties** → Default solid color

Text color (black or white) is automatically calculated for optimal contrast using WCAG guidelines.

## Event Callbacks

```javascript
const calendar = new SimpleCalendarJs('#calendar', {
    // Dynamic event loading
    events: function(dateRange) {
        // Called with {startDate, endDate} for visible range
        // Return array of events for this range
        return fetchEventsFromAPI(dateRange.startDate, dateRange.endDate);
    },
    
    // Day click handler
    dayClick: function(clickInfo, originalEvent) {
        // clickInfo: {date, time} - time only for time-based views
        console.log('Clicked on:', clickInfo.date, clickInfo.time);
    },
    
    // Event click handler
    eventClick: function(event, clickInfo, originalEvent) {
        // event: the clicked event object
        // clickInfo: {date, time} - date/time where event was clicked
        console.log('Clicked event:', event.title, 'at', clickInfo.time);
    },
    
    // State change handler
    changeState: function(state) {
        // state: {view, date, fulldayMode, startHour, endHour, timeSlotMinutes}
        console.log('Calendar state changed:', state);
    }
});
```

## API Methods

```javascript
// Navigation
calendar.navigate('next');                    // Navigate to next period
calendar.navigate('prev');                    // Navigate to previous period
calendar.goToDate(new Date());                // Go to specific date
calendar.goToToday();                         // Go to today

// View switching
calendar.setView('month');                    // 'month', 'week', 'day'
calendar.setFulldayMode(true);                // Toggle fullday mode

// Event management
calendar.addEvent(event);                     // Add single event
calendar.removeEvent(eventId);                // Remove event by ID
calendar.setEvents(eventsArray);              // Replace all events
calendar.setEvents(callbackFunction);         // Set dynamic event loading

// Visual customization
calendar.setGridBorders('none');              // 'both', 'vertical', 'horizontal', 'none'
calendar.setEventBorders(true);               // Enable/disable event borders
calendar.setEventBorderColor('#ff0000');      // Set event border color
calendar.setDefaultEventColor('#3498db');     // Set default event color

// UI element visibility
calendar.setShowMonthButton(true);            // Show/hide month view button
calendar.setShowWeekButton(true);             // Show/hide week view button
calendar.setShowDayButton(true);              // Show/hide day view button
calendar.setShowNavigation(true);             // Show/hide navigation buttons
calendar.setViewButtonsVisibility(           // Set multiple button visibility at once
    true,  // month button
    true,  // week button
    false  // day button
);
```

## CSS Classes

All CSS classes are prefixed with `sc-` to prevent conflicts:

### Main Structure
- `.sc-calendar` - Main container
- `.sc-header` - Calendar header
- `.sc-content` - Content area
- `.sc-view-container` - View-specific container

### Views
- `.sc-month-view` - Month view container
- `.sc-week-view` - Week view container  
- `.sc-day-view` - Day view container
- `.sc-fullday` - Fullday mode modifier

### Grid & Days
- `.sc-days-grid` - Grid container for days
- `.sc-day` - Individual day cell
- `.sc-day-number` - Day number text
- `.sc-today` - Today's date styling
- `.sc-other-month` - Days from other months

### Events
- `.sc-event-month`, `.sc-event-week`, `.sc-event-day`, `.sc-event-time` - Event containers
- `.sc-event-text` - Event text content
- `.sc-event-single` - Single-day event
- `.sc-event-start` - Multi-day event start
- `.sc-event-middle` - Multi-day event middle
- `.sc-event-end` - Multi-day event end
- `.sc-event-placeholder` - Transparent placeholder for multi-day alignment

### Event Count (Month View - Non-Fullday)
- `.sc-day-count-mode` - Day cell in count mode
- `.sc-day-content` - Container for day number and event count
- `.sc-event-count` - Event count badge with rounded corners

### Headers & Navigation
- `.sc-nav` - Navigation buttons container
- `.sc-title` - Month/date title
- `.sc-view-switcher` - View mode buttons
- `.sc-btn` - Button styling

### Border Modifiers
- `.sc-borders-both` - Show all grid borders
- `.sc-borders-vertical` - Vertical grid borders only
- `.sc-borders-horizontal` - Horizontal grid borders only  
- `.sc-borders-none` - No grid borders
- `.sc-event-borders` - Enable event borders
- `.sc-event-no-borders` - Disable event borders (default)

## CSS Custom Properties (Variables)

The calendar uses CSS custom properties for easy theming:

```css
.sc-calendar {
    --sc-event-color: #4c6f94;           /* Default event background color */
    --sc-event-border-color: #6c757d;    /* Event border color */
}
```

You can customize these by overriding them in your CSS:

```css
/* Custom theme example */
.sc-calendar {
    --sc-event-color: #e74c3c;
    --sc-event-border-color: #c0392b;
}

/* Dark theme example */
.sc-calendar.dark-theme {
    --sc-event-color: #3498db;
    background: #2c3e50;
    color: #ecf0f1;
}
```

## Event Count Badges

In month view with `fulldayMode: false`, event counts are displayed as styled badges:

- **Regular days**: Light gray background with dark text
- **Today**: Blue background with white text  
- **Other month days**: Very light gray background with muted text
- **Responsive**: Automatically adjusts size on mobile devices
- **Rounded corners**: Modern badge appearance with `border-radius: 10px`

## Keyboard Shortcuts

- **Arrow Left/Right** - Navigate to previous/next period
- **T** - Go to today
- **M** - Switch to month view
- **W** - Switch to week view  
- **D** - Switch to day view

## Time Format

Time strings should be in 12-hour format with AM/PM:
```javascript
'9:00 AM'    // Valid
'2:30 PM'    // Valid
'09:00'      // Invalid
'14:30'      // Invalid
```

## Multi-day Events

Multi-day events are automatically detected when `startDate` and `endDate` differ:
- **Start day**: Shows event title and colored bar
- **Middle days**: Shows only colored bar (seamless connection)
- **End day**: Shows only colored bar

Events spanning across weeks will continue seamlessly in the next row.

## Smart Event Caching

When using callback-based event loading, the calendar implements intelligent caching:
- Only fetches missing date ranges
- Merges overlapping ranges automatically
- Minimizes API calls when navigating
- Clears cache when `setEvents()` is called

## Color & Accessibility

The calendar automatically ensures good color contrast for accessibility:

### WCAG Compliance
- Text color (black or white) is automatically calculated for optimal contrast
- Uses WCAG relative luminance algorithm to determine text color
- Ensures contrast ratios meet accessibility standards

### Gradient Algorithm
When `colorIsGradient: true` is used:
1. Base color is used as the bottom of the gradient
2. Top color is calculated by adding 20 to each RGB component (capped at 255)
3. Creates a subtle top-to-bottom linear gradient effect
4. Text color is calculated based on the base color luminance

### Color Processing
```javascript
// Examples of color processing
const redEvent = {
    color: '#e74c3c',           // Red base color
    colorIsGradient: true       // Creates gradient from #ff6659 to #e74c3c
};
// Text color: white (due to dark base color)

const yellowEvent = {
    color: '#f1c40f',           // Yellow base color  
    colorIsGradient: true       // Creates gradient from #fff323 to #f1c40f
};
// Text color: black (due to light base color)
```

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## File Structure

```
simple-calendar-js/
├── css/
│   └── simple-calendar-js.css    # Main stylesheet
├── js/
│   └── simple-calendar-js.js     # Main JavaScript file
├── index.html                    # Demo page
├── README.md                     # This file
└── package.json                  # Package configuration
```

## License

**Personal and Non-Commercial Use License**

This project is free for personal, educational, and non-commercial use.

**Commercial use requires a separate license.** See [LICENSE](LICENSE) file for details.

For commercial licensing: simplecalendarjs@gmail.com