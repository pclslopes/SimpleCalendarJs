# Changelog

All notable changes to SimpleCalendarJs will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

No unreleased changes yet.

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
