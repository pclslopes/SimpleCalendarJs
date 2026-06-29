# Changelog

All notable changes to SimpleCalendarJs will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

No unreleased changes yet.

## [3.0.14] - 2026-06-29

### Fixed
- Month navigation overflow bug where navigating from end-of-month dates (e.g. May 31st) would skip a month forward or appear to do nothing when going backward

## [3.0.13] - 2026-03-08

### Changed
- Simplified README from 1688 to 337 lines for better readability
- Moved detailed documentation to website (simplecalendarjs.com/docs)
- Fixed all relative links in README to use full GitHub URLs for npm compatibility
- Updated repository configuration for public release
- Added comprehensive contributing guidelines and issue templates

## [3.0.12] - 2026-03-06

### Added
- **Picker modes** - New `mode` configuration option enables date selection functionality
  - `'calendar'` (default) - Standard calendar view with events
  - `'date-picker'` - Single date selection mode for choosing individual dates
  - `'range-picker'` - Date range selection mode for choosing start and end dates
- **Date selection callbacks** - New callback functions for picker modes:
  - `onDateSelect(date)` - Triggered when a date is selected in date-picker mode
  - `onRangeSelect(startDate, endDate)` - Triggered when a complete range is selected in range-picker mode
- **Selection state management** - New public API methods for programmatic date selection:
  - `getSelectedDate()` - Returns the currently selected date (date-picker mode)
  - `setSelectedDate(date)` - Programmatically set the selected date
  - `getSelectedRange()` - Returns the currently selected range as `{start, end}` (range-picker mode)
  - `setSelectedRange(startDate, endDate)` - Programmatically set the selected range
  - `clearSelection()` - Clear all selections (works in both picker modes)
- **Visual selection styling** - New CSS classes for selected date states:
  - `.uc-selected` - Single date selection highlight (date-picker mode)
  - `.uc-in-range` - Dates within a selected range (range-picker mode)
  - `.uc-range-start` - Start date of range selection
  - `.uc-range-end` - End date of range selection

### Changed
- **Picker mode behavior** - Picker modes automatically disable event-related features:
  - No events are fetched or displayed (`fetchEvents` is skipped)
  - View switcher is hidden (only month view available)
  - Day numbers are always centered (both horizontally and vertically)
  - Today's date is not highlighted to avoid confusion with selection
  - Month day number alignment option is ignored (always centered in picker modes)
- **Range selection interaction** - In range-picker mode:
  - First click selects the start date
  - Second click selects the end date
  - Dates are automatically ordered (start always before end)
  - Third click starts a new range selection
  - Complete range highlights all dates between start and end

### Fixed
- Day number positioning in picker modes now consistently centered regardless of `monthDayNumberAlign` setting

## [3.0.11] - 2026-03-04

### Added
- **Rich HTML tooltip system** - Reimagined tooltip system with HTML support, fixed positioning, and enhanced customization
  - **HTML formatting support** - Tooltips now support rich HTML content with secure sanitization:
    - Allowed tags: `<b>`, `<i>`, `<strong>`, `<em>`, `<span>`, `<br>`, `<a>`
    - Links (`<a>` tags) with URL validation (blocks `javascript:`, `data:`, `vbscript:` protocols)
    - Inline color styles via `<span style="color: ...">` (sanitized to prevent CSS injection)
    - Automatic `target="_blank"` and `rel="noopener noreferrer"` on all links for security
    - Per-event HTML override via `tooltipAllowHtml` property
    - Global control via new `tooltipAllowHtml` option (default: `true`)
  - **Fixed positioning** - Tooltips use `position: fixed` and attach to `document.body`:
    - Never clipped by calendar container's `overflow: hidden`
    - Intelligent edge detection prevents overflow outside viewport
    - Tooltips reposition above/below and left/right based on available space
    - Arrow dynamically points to hovered element center
  - **Customizable styling** - New configuration options for tooltip appearance:
    - `tooltipBgColor` - Global background color (default: `null` uses CSS variable)
    - `tooltipTextColor` - Global text color (default: `null` uses CSS variable)
    - `tooltipMaxWidth` - Maximum width in pixels (default: `250`)
    - `tooltipDelay` - Show delay in milliseconds (default: `400`)
  - **Multiline support** - Natural multiline rendering with `<br>` tags or line breaks
  - **DOM-based architecture** - Replaced CSS pseudo-elements (`::before`/`::after`) with real DOM elements:
    - Singleton pattern (one tooltip element per calendar instance)
    - Efficient memory management with automatic cleanup in `destroy()`
    - Better performance with reusable tooltip element

### Changed
- **Tooltip implementation** - Migrated from CSS pseudo-element system to DOM-based tooltips
  - Old `::before` and `::after` tooltip styles commented out (deprecated but preserved for reference)
  - Tooltips now render as separate DOM elements for HTML support
  - Backward compatible: text-only tooltips work unchanged when `tooltipAllowHtml` is `false`
- **Default HTML enabled** - HTML rendering now enabled by default for both events and tooltips
  - `allowHtmlInEvents` default changed from `false` to `true`
  - `tooltipAllowHtml` default changed from `false` to `true`
  - Event titles and tooltips now support HTML formatting by default (bold, italic, links, colors, etc.)
  - All HTML is sanitized for security (comprehensive XSS protection)
  - To disable HTML, explicitly set `allowHtmlInEvents: false` and/or `tooltipAllowHtml: false`

### Security
- **Enhanced HTML sanitization** - Added comprehensive security measures for HTML tooltips:
  - DOM-based parsing (browser handles HTML edge cases safely)
  - Tag allowlist (only safe formatting tags permitted)
  - URL protocol validation (blocks dangerous schemes)
  - CSS sanitization (only `color` properties allowed, blocks `expression`, `url()`, `import`)
  - Automatic event handler stripping (prevents inline JavaScript)
  - Recursive node cleaning (prevents nesting attacks)

## [3.0.10] - 2026-03-03

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
