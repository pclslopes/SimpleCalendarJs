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

## Quick Start

### 1. Include the Files

```html
<!-- Include jQuery -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<!-- Include SimpleCalendarJs -->
<link rel="stylesheet" href="css/SimpleCalendarJs.css">
<script src="js/SimpleCalendarJs.js"></script>
```

### 2. Create Calendar Container

```html
<div id="calendar"></div>
```

### 3. Initialize Calendar

```javascript
$('#calendar').calendar({
    mode: 'month',
    date: new Date(),
    events: function(params, callback) {
        // Fetch your events here
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
    }
});
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `mode` | string | `'month'` | Initial view mode ('month', 'week', 'day') |
| `date` | Date | `new Date()` | Initial date to display |
| `events` | function | `null` | Function to fetch events |
| `dayClick` | function | `null` | Callback for day clicks |
| `eventClick` | function | `null` | Callback for event clicks |
| `showBackground` | boolean | `false` | Show background colors |
| `showTimeInEvent` | boolean | `true` | Display time in events |

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