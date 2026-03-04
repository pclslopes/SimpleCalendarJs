# Changelog

All notable changes to SimpleCalendarJs will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

No unreleased changes yet.

## [3.0.11] - 2026-03-03

### Added
- **Auto-contrast text color** - New `autoContrastText` option automatically calculates optimal text color based on event background color using WCAG luminance formula
  - Ensures readable text on both light and dark event backgrounds
  - Per-event override via `textColor` property
  - Default: `false` (backward compatible)
- **Contrast level control** - New `contrastLevel` option for `autoContrastText` feature with three levels:
  - `'high'` (default) - Pure black or white text for maximum readability
  - `'medium'` - Darker/lighter shade of background color for integrated look
  - `'low'` - Subtle variation maintaining color family
  - Uses HSL color space for smooth color transitions
- **HTML rendering in event titles** - New `allowHtmlInEvents` option enables safe HTML formatting in event titles
  - Supports basic tags: `<b>`, `<i>`, `<strong>`, `<em>`, `<span>`, `<br>`
  - Perfect for Font Awesome icons: `<i class="fas fa-video"></i> Video Call`
  - Automatic sanitization prevents XSS attacks (strips scripts, event handlers, dangerous attributes)
  - Only `class` attribute allowed (sanitized to alphanumeric + `-_`)
  - Per-event override via `allowHtml` property
  - Default: `false` (backward compatible)
- **Month day number alignment** - New `monthDayNumberAlign` option controls horizontal positioning of day numbers in month view cells
  - Three alignment options: `'left'` (default), `'center'`, `'right'`
  - Allows customization of calendar appearance to match design preferences
  - Applied only to month view, does not affect week or day views
- **Event borders** - New `showEventBorder` option displays borders around all-day and block-style events
  - Border color automatically darkens from event background using HSL color space with adaptive darkening
  - Light colors (70%+ lightness) darken by 50%, medium colors by 35%, dark colors by 25%
  - Ensures visible borders even on very light event backgrounds
  - Per-event override via `borderColor` property for custom border colors
  - Applied to multi-day events, block-style timed events in month view, and all events in week/day views
  - List-style timed events in month view remain borderless (dot indicator only)
  - Default: `false` (backward compatible)

### Changed
- **Variable row heights in month view** - Month view rows now have individual heights based on their event content
  - Rows with many events automatically expand to fit all events
  - Rows with few or no events use minimal height (80px minimum)
  - Eliminates wasted vertical space on empty rows
  - Each row calculates its own optimal height independently
  - Replaces previous uniform height behavior where all rows matched the tallest row

## [3.0.9] - 2026-02-25

### Fixed
- Year picker dropdown not opening due to `overflow: hidden` on toolbar center
- Changed toolbar center to `overflow: visible` to allow year picker display

## [3.0.8] - 2026-02-25

### Changed
- Updated framework wrappers (React, Vue, Angular) to v3.0.8
- Removed `maxEventsPerCell` prop from all framework wrappers (deprecated in v3.0.7)

## [3.0.7] - 2026-02-25

### Breaking Changes
- **Removed `maxEventsPerCell` option** - Calendar now always automatically calculates optimal event display based on available space
  - Month view cells intelligently adapt to container height
  - Events are automatically limited based on cell height with "+N more" indicator
  - Cells flex naturally when container is resized
  - Simplified API - no manual configuration needed

### Added
- **Mobile-responsive view switcher** - View buttons transform into compact dropdown menu at screen widths ≤640px
  - Single icon button (⊞) replaces four view buttons to save toolbar space
  - Dropdown includes all view options (Month, Week, Day, List) plus Today button
  - Today button in dropdown shows active state when calendar displays today's date
  - Automatic breakpoint at 640px width
- **List view toolbar controls** - Navigation and Today buttons now visible in list view but appear disabled (grayed out)
  - Maintains visual consistency across all views
  - Clear indication that navigation doesn't apply to list view
  - Applies to both desktop toolbar and mobile dropdown

### Changed
- **Toolbar layout system** - Replaced flexbox with CSS Grid for more stable button positioning
  - Three equal columns (left buttons, center title, right buttons)
  - Buttons no longer switch positions or overflow at narrow widths
  - Date title abbreviates with ellipsis instead of wrapping to new line
  - Removed all responsive media queries that caused layout shifts
- **Uniform row heights in month view** - All week rows maintain consistent height in natural sizing mode
  - Pre-calculates maximum event slots across entire month
  - Empty rows no longer appear shorter than rows with events
  - Improved visual consistency and polish
- **Overflow management** - Strategic use of `overflow-x: clip` prevents horizontal scrollbars while maintaining tooltip visibility
  - Tooltips can still escape calendar boundaries (via parent `overflow-x: visible`)
  - No unwanted scrollbars in month, week, or day views
- **Compact toolbar styling** - Reduced button padding and gaps to maximize space efficiency
  - All buttons: 4px vertical × 6px horizontal padding (was 5px × 10px)
  - Toolbar gap: 4px (was 8px)
  - Font sizes: title 14px, buttons 12px
- Calendar now always uses `height: 100%` to fill parent container
- Month view cells flex to fit available space instead of using fixed min-height
- All views consistently respect container dimensions
- Removed `--cal-cell-min-height` CSS custom property (no longer needed)

### Fixed
- Toolbar buttons no longer disappear or overflow off-screen at narrow widths
- Date title no longer jumps to new line when calendar is resized
- Horizontal scrollbars no longer appear in month/week/day views
- Tooltips display correctly on all edges without being clipped

## [3.0.6] - 2026-02-24

### Added
- Drag and drop support for moving events between dates and times (`enableDragDrop` option)
- Event resize functionality to change event duration (`enableResize` option)
- Month view timed event display style option (`monthTimedEventStyle`: `'list'` or `'block'`)
- `onEventDrop` callback for handling both move and resize operations
- Touch support for drag and drop on mobile/tablet devices
- Visual feedback during drag operations with 15-minute snap-to-grid in week/day views
- Cross-boundary conversion (timed ↔ all-day events when dragging between sections)
- Auto-calculate feature for `maxEventsPerCell`: set to `-1` to automatically calculate how many events fit based on cell height

### Changed
- **`maxEventsPerCell` default changed from `3` to `-1`** (auto-calculate mode)
  - `-1` = Auto-calculate based on cell height (responsive, adapts to calendar size)
  - `0` = Show all events, cells expand infinitely
  - `1+` = Show exactly that number, rest in "+N more"
- Week, day, and list views now have a max-height of 650px and scroll content while keeping headers and toolbar fixed in place
- Month view maintains its natural expanding height based on number of weeks and events per cell
- All scrollable views use consistent custom scrollbar styling
- Calendar adapts to container height: if you set a custom height on the container div, week/day/list views will respect it
- Week/day view all-day events now always display titles on continuation segments (matches day view behavior)

### Fixed
- List view sticky date headers now have opaque background to prevent events showing through when scrolling
- Calendar no longer rebuilds entire shell during event fetching, preventing layout shift and page content jumping

## [3.0.5] - 2026-02-23

No core calendar changes in this version.

## [3.0.4] - 2026-02-23

### Added
- List view mode for chronological event display
- Intelligent event caching system to minimize network requests
- Localized "All-day" text display using Intl API

### Fixed
- Border-radius consistency across all event types
- CSS styling improvements for event rendering

## [3.0.3] - 2026-02-22

### Added
- `maxEventsPerCell` option to limit events displayed per cell in month view (with "+N more" indicator)
- Set to `0` for unlimited events display

### Fixed
- Date navigation edge cases when switching between views

## [3.0.2] - 2026-02-20

### Added
- `showBorder` option to control calendar outer border visibility
- `weekdayFormat` option with three formats: `'narrow'` (1-2 letters), `'short'` (abbreviated), `'long'` (full name)

### Changed
- Improved theming system with better CSS custom property organization

## [3.0.1] - 2026-02-19

### Added
- Event tooltips with smart positioning system
- Tooltip configuration with `showTooltips` option
- Multi-line tooltip support using `\n` newline characters
- Customizable tooltip styling via CSS custom properties

### Changed
- Optimized overflow behavior for better event visibility

## [3.0.0] - 2026-02-19

### Breaking Changes
**Version 3.0.0 represents a major rewrite with significant breaking changes from version 2.x**

This version is not backward compatible with 2.x. Please review all changes before upgrading.

### Added
- **Framework Wrappers**: Official React, Vue 3, and Angular component wrappers
- **Four View Modes**: Month, week, day, and list views with smooth transitions
- **Full Internationalization**: Built on `Intl.DateTimeFormat` API for native locale support
- **Dark Mode Support**: Automatic dark theme detection and manual toggle support
- **Month and Year Dropdowns**: Interactive dropdowns for quick date navigation
- **Year Picker**: Quick year selection in month view
- **Color System**: Comprehensive theming with CSS custom properties
- **Global Export**: Proper UMD module support (CommonJS, AMD, ES modules, browser global)
- **Accessibility**: Semantic HTML with proper ARIA attributes

### Changed
- **Standardized file naming**: Renamed and reorganized source files for consistency
- **Improved alignment**: Better container and element alignment across all views
- **Font inheritance**: Calendar now inherits font from parent container
- **Updated license and headers**: Clarified licensing for commercial vs non-commercial use
- **Complete UI overhaul**: Redesigned interface with modern styling

### Fixed
- Hour and half-hour grid lines now properly visible in day/week views
- GitHub Actions workflow configuration

---

## Version 2.x and Earlier

Changes prior to version 3.0.0 are not documented in this changelog as version 3.0.0 represents a complete rewrite of the library.

For reference, version 2.0.1 was the last release in the 2.x series.
