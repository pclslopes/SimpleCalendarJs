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
- **Internationalization** - Full localization support for weekdays, months, and UI labels
- **Month/Year Dropdowns** - Quick navigation with clickable month and year selectors
- **Color Customization** - Comprehensive theming system with light/dark mode support
- **Enhanced Theme Detection** - Automatic theme detection for Next.js, Tailwind CSS, and other frameworks
- **Theme Integration** - Built-in dark theme with automatic color adaptation
- **Enhanced Navigation** - Transparent navigation buttons with theme-aware hover effects
- **Always-Visible Time Lines** - Hour and half-hour lines remain visible regardless of grid settings
- **Header Visibility Control** - Show/hide month, year, navigation, and view buttons independently
- **Smart Container Optimization** - Automatic layout optimization for small calendar containers
- **Improved Text Overflow** - Enhanced ellipsis behavior for event text in constrained spaces
- **Clean Interaction Design** - Removed distracting hover effects for professional appearance
- **CSS Prefix** - All classes prefixed with 'sc-' to avoid conflicts
- **Template Strings** - Clean HTML generation using template literals
- **Event Support** - Add, remove, and display events
- **Keyboard Navigation** - Arrow keys, T (today), M/W/D (views)
- **Memory Management** - Proper cleanup with destroy() method for SPAs

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
    showTitle: true,                  // true/false - show entire title container (month/year)
    showMonth: true,                  // true/false - show month in title (when showTitle is true)
    showYear: true,                   // true/false - show year in title (when showTitle is true)
    
    // Localization Options
    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    showWeekdayChars: null,           // null = full weekday names, number = show first N characters
    labels: {                         // UI labels for buttons and text
        month: 'Month',
        week: 'Week', 
        day: 'Day',
        events: 'events',             // Badge text (plural)
        event: 'event',               // Badge text (singular)
        before: 'Before',             // Time slot label for early times
        after: 'After'                // Time slot label for late times
    },
    
    // Color Customization
    colors: {
        // Light theme colors (defaults)
        background: '#ffffff',
        backgroundSecondary: '#f8f9fa',
        backgroundTertiary: '#ecf0f1',
        text: '#212529',
        textSecondary: '#6c757d',
        textMuted: '#adb5bd',
        border: '#e9ecef',
        borderLight: '#dee2e6',
        accent: '#4c6f94',
        accentHover: '#0056b3',
        todayBg: '#e3f2fd',
        todayText: '#dc3545',
        hoverBg: '#f8f9fa',
        // Dark theme colors (auto-applied when data-theme="dark")
        dark: {
            background: '#2d2d2d',
            backgroundSecondary: '#3a3a3a',
            backgroundTertiary: '#4a4a4a',
            text: '#ffffff',
            textSecondary: '#cccccc',
            textMuted: '#888888',
            border: '#444444',
            borderLight: '#555555',
            accent: '#4a90e2',
            accentHover: '#357abd',
            todayBg: '#1a2f4a',
            todayText: '#ff6b6b',
            hoverBg: '#2d2d2d'
        }
    },
    
    // Data Configuration
    events: [],                       // Array of event objects OR callback function
    
    // Event Handlers
    dayClick: null,                   // Function called when day is clicked
    eventClick: null,                 // Function called when event is clicked
    changeState: null                 // Function called when calendar state changes
});
```

## Localization

SimpleCalendarJs supports full internationalization with customizable text and date formats:

```javascript
const calendar = new SimpleCalendarJs('#calendar', {
    // Portuguese example
    weekdays: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    showWeekdayChars: 3,              // Show only first 3 characters: "Dom", "Seg", etc.
    labels: {
        month: 'Mês',
        week: 'Semana', 
        day: 'Dia',
        events: 'eventos',
        event: 'evento',
        before: 'Antes das',
        after: 'Depois das'
    }
});

// French example
const frenchCalendar = new SimpleCalendarJs('#calendar', {
    weekdays: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    showWeekdayChars: 2,              // Show first 2 characters: "Di", "Lu", etc.
    labels: {
        month: 'Mois',
        week: 'Semaine',
        day: 'Jour',
        events: 'événements',
        event: 'événement',
        before: 'Avant',
        after: 'Après'
    }
});
```

### Weekday Display Options
- **`showWeekdayChars: null`** - Show full weekday names (default)
- **`showWeekdayChars: 3`** - Show first 3 characters ("Sun", "Mon", etc.)
- **`showWeekdayChars: 1`** - Show single character ("S", "M", etc.)

## Month/Year Navigation

In month view, clicking on the month or year title opens dropdown menus for quick navigation:

### Features
- **Month Dropdown** - Click month title to select any month
- **Year Dropdown** - Click year title to select from a range of years
- **Keyboard Support** - Navigate with arrow keys and Enter
- **Auto-scroll** - Current month/year automatically scrolls into view
- **Compact Design** - Minimal dropdown styling that adapts to themes

### Styling
The dropdowns automatically inherit the calendar's theme and can be customized via CSS:

```css
.sc-month-dropdown, .sc-year-dropdown {
    /* Customize dropdown appearance */
    max-height: 200px;
    background: var(--sc-bg-secondary);
    border: 1px solid var(--sc-border-color);
}

.sc-month-option:hover, .sc-year-option:hover {
    background: var(--sc-hover-bg);
    color: var(--sc-accent-color);
}
```

## Color Customization

SimpleCalendarJs provides a comprehensive color system that supports partial customization and automatic theme switching:

### Basic Color Override
```javascript
const calendar = new SimpleCalendarJs('#calendar', {
    colors: {
        background: '#f0f8ff',        // Only override background
        accent: '#ff6b6b'             // Only override accent color
        // All other colors use defaults
    }
});
```

### Full Theme Customization
```javascript
const calendar = new SimpleCalendarJs('#calendar', {
    colors: {
        // Light theme colors
        background: '#ffffff',
        backgroundSecondary: '#f8f9fa',
        backgroundTertiary: '#ecf0f1',
        text: '#212529',
        textSecondary: '#6c757d',
        textMuted: '#adb5bd',
        border: '#e9ecef',
        borderLight: '#dee2e6',
        accent: '#4c6f94',
        accentHover: '#0056b3',
        todayBg: '#e3f2fd',
        todayText: '#dc3545',
        hoverBg: '#f8f9fa',
        
        // Dark theme colors (optional)
        dark: {
            background: '#1a1a1a',
            backgroundSecondary: '#2d2d2d',
            backgroundTertiary: '#3a3a3a',
            text: '#ffffff',
            textSecondary: '#cccccc',
            textMuted: '#888888',
            border: '#444444',
            borderLight: '#555555',
            accent: '#4a90e2',
            accentHover: '#357abd',
            todayBg: '#1a2f4a',
            todayText: '#ff6b6b',
            hoverBg: '#2d2d2d'
        }
    }
});
```

### Transparent Values
Any color property can be set to `'transparent'` for seamless integration:

```javascript
colors: {
    background: 'transparent',        // Calendar blends with page background
    border: 'transparent',           // Remove all borders
    hoverBg: 'transparent'           // Disable hover backgrounds
}
```

### Color Properties Reference

| Property | Description | Default (Light) | Default (Dark) |
|----------|-------------|-----------------|----------------|
| `background` | Main calendar background | `#ffffff` | `#2d2d2d` |
| `backgroundSecondary` | Secondary backgrounds | `#f8f9fa` | `#3a3a3a` |
| `backgroundTertiary` | Controls and headers | `#ecf0f1` | `#4a4a4a` |
| `text` | Primary text color | `#212529` | `#ffffff` |
| `textSecondary` | Secondary text | `#6c757d` | `#cccccc` |
| `textMuted` | Muted/disabled text | `#adb5bd` | `#888888` |
| `border` | Grid and element borders | `#e9ecef` | `#444444` |
| `borderLight` | Light accent borders | `#dee2e6` | `#555555` |
| `accent` | Active states and highlights | `#4c6f94` | `#4a90e2` |
| `accentHover` | Hover states | `#0056b3` | `#357abd` |
| `todayBg` | Today's date background | `#e3f2fd` | `#1a2f4a` |
| `todayText` | Today's date text | `#dc3545` | `#ff6b6b` |
| `hoverBg` | Hover backgrounds | `#f8f9fa` | `#2d2d2d` |

### Enhanced Theme Detection
The calendar features intelligent theme detection covering popular frameworks and systems:

**Automatic Detection Priority:**
1. **data-theme attribute** - `data-theme="dark"` (original system)
2. **Class-based themes** - `.dark` or `.light` classes on `html` or `body` (Next.js, Tailwind CSS)
3. **CSS custom properties** - `--theme` variable
4. **Alternative attributes** - `theme` attribute
5. **System preference** - `prefers-color-scheme: dark`

**Framework Compatibility:**
- **Next.js** with `next-themes` - Automatically detects `.dark` class
- **Tailwind CSS** - Supports Tailwind's dark mode classes
- **Custom systems** - Flexible detection for various theme implementations
- **Real-time updates** - Theme changes are detected and applied automatically

**Example Usage:**
```javascript
// Works automatically with Next.js themes
const calendar = new SimpleCalendarJs('#calendar', {
    // No manual theme configuration needed
});

// Manual override still available
document.documentElement.setAttribute('data-theme', 'dark');
```

**Memory Management:**
The calendar includes proper cleanup with a `destroy()` method for Single Page Applications:
```javascript
calendar.destroy(); // Cleans up theme observers and event listeners
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
calendar.setShowTitle(true);                  // Show/hide entire title container
calendar.setShowMonth(true);                  // Show/hide month in title
calendar.setShowYear(true);                   // Show/hide year in title
calendar.setViewButtonsVisibility(           // Set multiple button visibility at once
    true,  // month button
    true,  // week button
    false  // day button
);

// Memory management
calendar.destroy();                           // Clean up observers and event listeners
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
- `.sc-title-month` - Clickable month title (in month view)
- `.sc-title-year` - Clickable year title (in month view)
- `.sc-view-switcher` - View mode buttons
- `.sc-btn` - Button styling

### Dropdown Navigation
- `.sc-month-dropdown` - Month selection dropdown
- `.sc-year-dropdown` - Year selection dropdown
- `.sc-month-option` - Individual month option
- `.sc-year-option` - Individual year option

### Border Modifiers
- `.sc-borders-both` - Show all grid borders
- `.sc-borders-vertical` - Vertical grid borders only
- `.sc-borders-horizontal` - Horizontal grid borders only  
- `.sc-borders-none` - No grid borders
- `.sc-event-borders` - Enable event borders
- `.sc-event-no-borders` - Disable event borders (default)

## CSS Custom Properties (Variables)

The calendar uses CSS custom properties for comprehensive theming. These are automatically managed by the color customization system, but can also be overridden directly:

### Event Colors
```css
.sc-calendar {
    --sc-event-color: #4c6f94;           /* Default event background color */
    --sc-event-border-color: #6c757d;    /* Event border color */
}
```

### Theme Colors (Auto-managed)
```css
.sc-calendar {
    /* Main backgrounds */
    --sc-bg-primary: #ffffff;
    --sc-bg-secondary: #f8f9fa;
    --sc-bg-tertiary: #ecf0f1;
    
    /* Text colors */
    --sc-text-primary: #212529;
    --sc-text-secondary: #6c757d;
    --sc-text-muted: #adb5bd;
    
    /* Borders */
    --sc-border-color: #e9ecef;
    --sc-border-light: #dee2e6;
    
    /* Interactive elements */
    --sc-accent-color: #4c6f94;
    --sc-accent-hover: #0056b3;
    --sc-today-bg: #e3f2fd;
    --sc-today-text: #dc3545;
    --sc-hover-bg: #f8f9fa;
}

/* Dark theme variables (auto-applied with data-theme="dark") */
[data-theme="dark"] .sc-calendar {
    --sc-bg-primary: #2d2d2d;
    --sc-bg-secondary: #3a3a3a;
    --sc-bg-tertiary: #4a4a4a;
    --sc-text-primary: #ffffff;
    --sc-text-secondary: #cccccc;
    --sc-text-muted: #888888;
    --sc-border-color: #444444;
    --sc-border-light: #555555;
    --sc-accent-color: #4a90e2;
    --sc-accent-hover: #357abd;
    --sc-today-bg: #1a2f4a;
    --sc-today-text: #ff6b6b;
    --sc-hover-bg: #2d2d2d;
}
```

### Manual Override Example
```css
/* Custom theme using CSS variables */
.sc-calendar {
    --sc-bg-primary: #f0f8ff;
    --sc-accent-color: #ff6b6b;
    --sc-today-bg: #ffe4e1;
}

/* Dark theme integration */
[data-theme="dark"] .sc-calendar {
    --sc-bg-primary: #1e1e1e;
    --sc-accent-color: #ff8a80;
}
```

## Event Count Badges

In month view with `fulldayMode: false`, event counts are displayed as styled badges with theme-aware coloring:

- **Regular days**: Uses default event color with reduced opacity for background
- **Today**: Full default event color background with white text
- **Other month days**: Muted background with secondary text color
- **Theme adaptive**: Automatically adjusts colors for light/dark themes
- **Responsive**: Automatically adjusts size on mobile devices
- **Rounded corners**: Modern badge appearance with `border-radius: 10px`

### Badge Color Logic
- Background uses `color-mix()` function to blend event color with theme background
- Text color adapts to theme (darker in light mode, lighter in dark mode)
- Today's badge uses full event color saturation for emphasis
- Seamlessly integrates with custom color schemes

## Small Container Optimization

The calendar automatically optimizes its layout for small containers and constrained spaces:

### **Container Detection**
- **Automatic optimization** for calendars with height ≤ 500px
- **Responsive text sizing** based on container dimensions
- **Smart padding reduction** in tight spaces

### **Layout Improvements**
- **Flex/Grid overflow prevention** - Uses `min-height: 0` to allow proper content shrinking
- **Container hierarchy fixes** - Ensures all nested containers respect parent boundaries
- **Text ellipsis enhancement** - More aggressive text truncation in small spaces

### **Event Text Optimization**
- **Fullday mode fixes** - Event text properly constrained within event boundaries
- **Padding-aware sizing** - Text width accounts for container padding
- **Responsive font sizes** - Smaller fonts in compact containers
- **Enhanced ellipsis** - Earlier text truncation for better readability

### **Cross-View Consistency**
- **Month view** - Days shrink to fit container height
- **Week view** - Time slots and fullday events scale appropriately
- **Day view** - All elements respect container constraints

Example usage in small spaces:
```html
<div style="height: 400px; width: 300px;">
    <div id="small-calendar"></div>
</div>
```

## Enhanced Styling Features

### Navigation Button Styling
- **Transparent Background**: Navigation arrows have transparent backgrounds in both themes
- **Theme-Aware Hover**: Hover effects use the default event color for consistency
- **Proper Contrast**: Arrow colors automatically adjust for light/dark themes

### View Button Styling  
- **Active State**: Uses default event color when view button is active
- **Inactive State**: Transparent background with theme-appropriate text color
- **Consistent Theming**: Seamlessly adapts to color customization

### Time Lines Enhancement
- **Always Visible**: Hour and half-hour lines remain visible regardless of grid border settings
- **Proper Hierarchy**: Uses `!important` declarations to ensure visibility
- **Theme Integration**: Line colors adapt to current theme automatically

### Clean Interaction Design
- **Removed Hover Effects**: Day cells and time slots no longer show distracting hover backgrounds
- **Professional Appearance**: Cleaner, more focused user interface
- **Preserved Functionality**: All click interactions and cursor pointers remain intact
- **Better Visual Hierarchy**: User attention stays on important content like events and dates

### Today Highlighting
- **Enhanced Contrast**: Today's background is darker in dark mode for better visibility
- **Cross-View Consistency**: Today highlighting works consistently across month, week, and day views
- **Customizable Colors**: Today colors can be overridden via color customization system

### Page Integration
- **Scrollable Layout**: Calendar no longer uses fixed positioning, allowing page scrolling
- **Flexible Container**: Adapts to parent container constraints
- **Better Integration**: Easier to embed in existing page layouts

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