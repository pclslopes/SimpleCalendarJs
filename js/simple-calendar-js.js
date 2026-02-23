/**
 * SimpleCalendarJs v3.0.4
 * A clean, modern, and feature-rich JavaScript calendar component with zero dependencies
 *
 * @author Pedro Lopes <simplecalendarjs@gmail.com>
 * @homepage https://www.simplecalendarjs.com
 * @license SEE LICENSE IN LICENSE
 */
(function (global, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    // CommonJS / Node
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory);
  } else {
    // Browser global
    global.SimpleCalendarJs = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  /* ============================================================
     DATE UTILITIES
     Only native Date — no external libraries.
     ============================================================ */

  function startOfDay(d) {
    const r = new Date(d);
    r.setHours(0, 0, 0, 0);
    return r;
  }

  function endOfDay(d) {
    const r = new Date(d);
    r.setHours(23, 59, 59, 999);
    return r;
  }

  function addDays(d, n) {
    const r = new Date(d);
    r.setDate(r.getDate() + n);
    return r;
  }

  function isSameDay(a, b) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  function isToday(d) {
    return isSameDay(d, new Date());
  }

  /** Floor difference in whole days (b - a). */
  function dayDiff(a, b) {
    return Math.floor((startOfDay(b) - startOfDay(a)) / 86400000);
  }

  function parseDate(v) {
    if (v instanceof Date) return v;
    return new Date(v);
  }

  /** Format date as YYYY-MM-DD */
  function formatDate(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Returns the 7-day week containing `date`, starting on weekStartsOn.
   * weekStartsOn: 0=Sunday, 1=Monday
   */
  function getWeekDates(date, weekStartsOn) {
    const dow = date.getDay();
    const diff = (dow - weekStartsOn + 7) % 7;
    const start = startOfDay(addDays(date, -diff));
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }

  /**
   * Returns all dates shown in the month grid (including prev/next month padding).
   */
  function getMonthGridDates(year, month, weekStartsOn) {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startPad = (first.getDay() - weekStartsOn + 7) % 7;
    const totalCells = Math.ceil((startPad + last.getDate()) / 7) * 7;
    const gridStart = addDays(first, -startPad);
    return Array.from({ length: totalCells }, (_, i) => addDays(gridStart, i));
  }

  /* ============================================================
     FORMATTING UTILITIES (Intl.DateTimeFormat)
     ============================================================ */

  function fmtTime(date, locale, use24Hour) {
    const opts = {
      hour: 'numeric',
      hour12: !use24Hour,
    };
    if (date.getMinutes() !== 0) opts.minute = '2-digit';
    return new Intl.DateTimeFormat(locale, opts).format(date);
  }

  function fmtMonthYear(date, locale) {
    return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date);
  }

  function fmtWeekRange(start, end, locale) {
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      const month = new Intl.DateTimeFormat(locale, { month: 'long' }).format(start);
      return `${month} ${start.getDate()}–${end.getDate()}, ${start.getFullYear()}`;
    }
    const fmt = (d) =>
      new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' }).format(d);
    return `${fmt(start)} – ${fmt(end)}, ${end.getFullYear()}`;
  }

  /** Week range without the year (used when year is shown as a separate clickable element). */
  function fmtWeekRangeNoYear(start, end, locale) {
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      const month = new Intl.DateTimeFormat(locale, { month: 'long' }).format(start);
      return `${month} ${start.getDate()}–${end.getDate()}`;
    }
    const fmt = (d) =>
      new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' }).format(d);
    return `${fmt(start)} – ${fmt(end)}`;
  }

  /** Returns 7 locale-aware day names starting from weekStartsOn. */
  function getDayNames(locale, weekStartsOn, format) {
    // Reference: Jan 5 2025 = Sunday
    return Array.from({ length: 7 }, (_, i) => {
      const day = (weekStartsOn + i) % 7;
      const ref = new Date(2025, 0, 5 + day); // Jan 5 2025 is Sunday
      return new Intl.DateTimeFormat(locale, { weekday: format }).format(ref);
    });
  }

  /* ============================================================
     HTML ESCAPE
     ============================================================ */

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ============================================================
     TRANSLATIONS
     ============================================================ */

  const TRANSLATIONS = {
    'en-US': { today: 'Today', month: 'Month', week: 'Week', day: 'Day', list: 'List', allDay: 'All-Day' },
    'en-GB': { today: 'Today', month: 'Month', week: 'Week', day: 'Day', list: 'List', allDay: 'All-Day' },
    'es-ES': { today: 'Hoy', month: 'Mes', week: 'Semana', day: 'Día', list: 'Lista', allDay: 'Todo el día' },
    'es-MX': { today: 'Hoy', month: 'Mes', week: 'Semana', day: 'Día', list: 'Lista', allDay: 'Todo el día' },
    'fr-FR': { today: 'Aujourd\'hui', month: 'Mois', week: 'Semaine', day: 'Jour', list: 'Liste', allDay: 'Toute la journée' },
    'fr-CA': { today: 'Aujourd\'hui', month: 'Mois', week: 'Semaine', day: 'Jour', list: 'Liste', allDay: 'Toute la journée' },
    'de-DE': { today: 'Heute', month: 'Monat', week: 'Woche', day: 'Tag', list: 'Liste', allDay: 'Ganztägig' },
    'it-IT': { today: 'Oggi', month: 'Mese', week: 'Settimana', day: 'Giorno', list: 'Elenco', allDay: 'Tutto il giorno' },
    'pt-PT': { today: 'Hoje', month: 'Mês', week: 'Semana', day: 'Dia', list: 'Lista', allDay: 'Dia todo' },
    'pt-BR': { today: 'Hoje', month: 'Mês', week: 'Semana', day: 'Dia', list: 'Lista', allDay: 'Dia todo' },
    'nl-NL': { today: 'Vandaag', month: 'Maand', week: 'Week', day: 'Dag', list: 'Lijst', allDay: 'Hele dag' },
    'pl-PL': { today: 'Dzisiaj', month: 'Miesiąc', week: 'Tydzień', day: 'Dzień', list: 'Lista', allDay: 'Cały dzień' },
    'ru-RU': { today: 'Сегодня', month: 'Месяц', week: 'Неделя', day: 'День', list: 'Список', allDay: 'Весь день' },
    'tr-TR': { today: 'Bugün', month: 'Ay', week: 'Hafta', day: 'Gün', list: 'Liste', allDay: 'Tüm gün' },
    'sv-SE': { today: 'Idag', month: 'Månad', week: 'Vecka', day: 'Dag', list: 'Lista', allDay: 'Heldag' },
    'da-DK': { today: 'I dag', month: 'Måned', week: 'Uge', day: 'Dag', list: 'Liste', allDay: 'Hele dagen' },
    'fi-FI': { today: 'Tänään', month: 'Kuukausi', week: 'Viikko', day: 'Päivä', list: 'Lista', allDay: 'Koko päivä' },
    'no-NO': { today: 'I dag', month: 'Måned', week: 'Uke', day: 'Dag', list: 'Liste', allDay: 'Hele dagen' },
    'cs-CZ': { today: 'Dnes', month: 'Měsíc', week: 'Týden', day: 'Den', list: 'Seznam', allDay: 'Celý den' },
    'hu-HU': { today: 'Ma', month: 'Hónap', week: 'Hét', day: 'Nap', list: 'Lista', allDay: 'Egész nap' },
    'ro-RO': { today: 'Astăzi', month: 'Lună', week: 'Săptămână', day: 'Zi', list: 'Listă', allDay: 'Toată ziua' },
    'el-GR': { today: 'Σήμερα', month: 'Μήνας', week: 'Εβδομάδα', day: 'Ημέρα', list: 'Λίστα', allDay: 'Ολοήμερο' },
    'ja-JP': { today: '今日', month: '月', week: '週', day: '日', list: 'リスト', allDay: '終日' },
    'ko-KR': { today: '오늘', month: '월', week: '주', day: '일', list: '목록', allDay: '종일' },
    'zh-CN': { today: '今天', month: '月', week: '周', day: '日', list: '列表', allDay: '全天' },
    'zh-TW': { today: '今天', month: '月', week: '週', day: '日', list: '列表', allDay: '全天' },
    'ar-SA': { today: 'اليوم', month: 'شهر', week: 'أسبوع', day: 'يوم', list: 'قائمة', allDay: 'طوال اليوم' },
    'he-IL': { today: 'היום', month: 'חודש', week: 'שבוע', day: 'יום', list: 'רשימה', allDay: 'כל היום' },
    'hi-IN': { today: 'आज', month: 'महीना', week: 'सप्ताह', day: 'दिन', list: 'सूची', allDay: 'पूरे दिन' },
    'th-TH': { today: 'วันนี้', month: 'เดือน', week: 'สัปดาห์', day: 'วัน', list: 'รายการ', allDay: 'ตลอดวัน' },
    'vi-VN': { today: 'Hôm nay', month: 'Tháng', week: 'Tuần', day: 'Ngày', list: 'Danh sách', allDay: 'Cả ngày' },
    'id-ID': { today: 'Hari ini', month: 'Bulan', week: 'Minggu', day: 'Hari', list: 'Daftar', allDay: 'Sepanjang hari' },
    'ms-MY': { today: 'Hari ini', month: 'Bulan', week: 'Minggu', day: 'Hari', list: 'Senarai', allDay: 'Sepanjang hari' },
    'uk-UA': { today: 'Сьогодні', month: 'Місяць', week: 'Тиждень', day: 'День', list: 'Список', allDay: 'Весь день' },
  };

  function getTranslation(locale, key) {
    const lang = locale.split('-')[0]; // Fallback to language code
    const trans = TRANSLATIONS[locale] || TRANSLATIONS[lang] || TRANSLATIONS['en-US'];
    return trans[key];
  }

  /* ============================================================
     EVENT CLASSIFICATION
     ============================================================ */

  /**
   * An event is "multi-day" if allDay flag is set OR
   * it spans at least two different calendar days.
   */
  function isMultiDay(event) {
    if (event.allDay) return true;
    return !isSameDay(event.start, event.end);
  }

  /* ============================================================
     LAYOUT ALGORITHMS
     ============================================================ */

  /**
   * Assigns slot indices to multi-day events for a single week row.
   * Slots are horizontal "lanes" — events in the same slot don't overlap.
   *
   * Returns: Array of { event, startCol, endCol, slot, isStart, isEnd }
   */
  function layoutMultiDayForWeek(events, weekDates) {
    const weekStart = startOfDay(weekDates[0]);
    const weekEnd = endOfDay(weekDates[weekDates.length - 1]);

    // Events that visually overlap this week (>= to include same-day allDay events)
    const relevant = events
      .filter((e) => e.start <= weekEnd && e.end >= weekStart)
      .map((e) => ({
        ...e,
        _visStart: new Date(Math.max(e.start.getTime(), weekStart.getTime())),
        _visEnd: new Date(Math.min(e.end.getTime(), weekEnd.getTime())),
        _isStart: startOfDay(e.start) >= weekStart,
        _isEnd: endOfDay(e.end) <= weekEnd,
      }));

    // Sort: earlier actual start first (so events started before this row keep
    // their lane above newer events), then longer visible span first as tiebreaker,
    // then original start time for same-day all-day events.
    relevant.sort((a, b) => {
      const startDiff = a.start - b.start;
      if (startDiff !== 0) return startDiff;
      const aSpan = dayDiff(a._visStart, a._visEnd);
      const bSpan = dayDiff(b._visStart, b._visEnd);
      return bSpan - aSpan || (a._origStart || a.start) - (b._origStart || b.start);
    });

    // Greedy slot assignment using column-end tracking
    const slotEnds = []; // slotEnds[i] = first free column after lane i
    const result = [];

    for (const ev of relevant) {
      const sc = weekDates.findIndex((d) => isSameDay(d, ev._visStart));
      const ec = weekDates.findIndex((d) => isSameDay(d, ev._visEnd));
      const startCol = sc === -1 ? 0 : sc;
      const endCol = ec === -1 ? weekDates.length - 1 : ec;

      let slot = slotEnds.findIndex((endColIdx) => endColIdx <= startCol);
      if (slot === -1) {
        slot = slotEnds.length;
        slotEnds.push(endCol + 1);
      } else {
        slotEnds[slot] = endCol + 1;
      }

      result.push({
        event: ev,
        startCol,
        endCol,
        slot,
        isStart: ev._isStart,
        isEnd: ev._isEnd,
      });
    }

    return result;
  }

  /**
   * Assigns columns to overlapping timed events (like Google Calendar side-by-side).
   *
   * Returns: Array of { event, col, totalCols }
   */
  function layoutTimedEvents(events) {
    if (!events.length) return [];

    const sorted = [...events].sort((a, b) => a.start - b.start || b.end - a.end);
    const cols = []; // cols[i] = last end time of column i
    const layouts = [];

    for (const ev of sorted) {
      let col = cols.findIndex((lastEnd) => lastEnd <= ev.start);
      if (col === -1) {
        col = cols.length;
        cols.push(ev.end);
      } else {
        cols[col] = ev.end;
      }
      layouts.push({ event: ev, col });
    }

    // Calculate totalCols per event based on its overlap group
    return layouts.map((item) => {
      const overlapping = layouts.filter(
        (o) => o.event.start < item.event.end && o.event.end > item.event.start
      );
      const totalCols = Math.max(...overlapping.map((o) => o.col)) + 1;
      return { ...item, totalCols };
    });
  }

  /* ============================================================
     SimpleCalendarJs CLASS
     ============================================================ */

  class SimpleCalendarJs {
    /**
     * @param {string|HTMLElement} container  CSS selector or DOM element
     * @param {object} options
     * @param {string}   [options.defaultView='month']  'month'|'week'|'day'
     * @param {Date}     [options.defaultDate=null]     Initial date to display (defaults to today)
     * @param {number}   [options.weekStartsOn=0]       0=Sun, 1=Mon
     * @param {string}   [options.locale='default']
     * @param {boolean}  [options.use24Hour=false]
     * @param {boolean}  [options.showTimeInItems=true]
     * @param {boolean}  [options.showGridLines=true]
     * @param {boolean}  [options.showToolbar=true]
     * @param {boolean}  [options.showTodayButton=true]
     * @param {boolean}  [options.showNavigation=true]
     * @param {boolean}  [options.showTitle=true]
     * @param {boolean}  [options.showYearPicker=true]
     * @param {boolean}  [options.showViewSwitcher=true]
     * @param {string[]} [options.enabledViews=['month','week','day']]
     * @param {function} [options.fetchEvents]           async (start, end) => CalendarEvent[]
     * @param {function} [options.onEventClick]          (event, mouseEvent) => void
     * @param {function} [options.onSlotClick]           (date, mouseEvent) => void
     * @param {function} [options.onViewChange]          (view) => void
     * @param {function} [options.onNavigate]            (rangeStart, rangeEnd) => void
     */
    constructor(container, options = {}) {
      if (typeof container === 'string') {
        this._el = document.querySelector(container);
        if (!this._el) throw new Error(`SimpleCalendarJs: no element for "${container}"`);
      } else {
        this._el = container;
      }

      this._opts = Object.assign(
        {
          defaultView: 'month',
          defaultDate: null,
          weekStartsOn: 0,
          locale: 'default',
          weekdayFormat: 'short',
          use24Hour: false,
          showTimeInItems: true,
          showGridLines: true,
          showToolbar: true,
          showTodayButton: true,
          showNavigation: true,
          showTitle: true,
          showYearPicker: true,
          showViewSwitcher: true,
          showTooltips: true,
          showBorder: true,
          maxEventsPerCell: 3,
          listDaysForward: 30,
          enabledViews: ['month', 'week', 'day'],
          fetchEvents: null,
          onEventClick: null,
          onSlotClick: null,
          onViewChange: null,
          onNavigate: null,
        },
        options
      );

      this._view = this._opts.defaultView;
      this._date = startOfDay(this._opts.defaultDate || new Date());
      this._events = [];
      this._cachedRange = null; // Cache the last fetched date range
      this._cachedEvents = []; // Cache the last fetched events
      this._nowInterval = null;
      this._yearPickerOpen = false;
      this._yearPickerBase = 0;
      this._yearOutsideHandler = null;

      this._root = document.createElement('div');
      this._root.className = 'uc-calendar';
      if (!this._opts.showGridLines) {
        this._root.classList.add('uc-no-grid');
      }
      if (!this._opts.showBorder) {
        this._root.classList.add('uc-no-border');
      }
      this._el.appendChild(this._root);

      // Single event delegation listener on root
      this._onClick = this._handleClick.bind(this);
      this._root.addEventListener('click', this._onClick);

      // Tooltip positioning handler
      this._onMouseMove = this._handleTooltipPosition.bind(this);
      this._root.addEventListener('mouseover', this._onMouseMove);

      this._fetchAndRender();
      this._startNowUpdater();
    }

    /* ---- Public API ---- */

    /** Switch to a different view. */
    setView(view) {
      if (view === this._view) return;
      this._view = view;
      if (this._opts.onViewChange) this._opts.onViewChange(view);
      this._fetchAndRender();
    }

    /** Navigate forward (+1) or backward (-1). */
    navigate(delta) {
      const d = new Date(this._date);
      if (this._view === 'month') {
        d.setMonth(d.getMonth() + delta);
        d.setDate(1);
      } else if (this._view === 'week') {
        d.setDate(d.getDate() + delta * 7);
      } else {
        d.setDate(d.getDate() + delta);
      }
      this._date = d;
      const range = this._getRange();
      if (this._opts.onNavigate) this._opts.onNavigate(range.start, range.end);
      this._fetchAndRender();
    }

    /** Jump to today. */
    goToToday() {
      this._date = startOfDay(new Date());
      const range = this._getRange();
      if (this._opts.onNavigate) this._opts.onNavigate(range.start, range.end);
      this._fetchAndRender();
    }

    /** Jump to an arbitrary date. */
    goToDate(date) {
      this._date = startOfDay(parseDate(date));
      this._fetchAndRender();
    }

    /**
     * Clear the event cache and re-fetch.
     * Call this when events have changed externally (added, updated, or deleted).
     */
    refresh() {
      this._cachedRange = null;
      this._cachedEvents = [];
      this._fetchAndRender();
    }

    /** Tear down — removes DOM and clears the interval. */
    destroy() {
      if (this._nowInterval) clearInterval(this._nowInterval);
      if (this._yearOutsideHandler) document.removeEventListener('click', this._yearOutsideHandler);
      this._root.removeEventListener('click', this._onClick);
      this._root.removeEventListener('mouseover', this._onMouseMove);
      this._root.remove();
    }

    /* ---- Private Core ---- */

    _getRange() {
      if (this._view === 'month') {
        const dates = getMonthGridDates(
          this._date.getFullYear(),
          this._date.getMonth(),
          this._opts.weekStartsOn
        );
        return { start: startOfDay(dates[0]), end: endOfDay(dates[dates.length - 1]) };
      }
      if (this._view === 'week') {
        const wk = getWeekDates(this._date, this._opts.weekStartsOn);
        return { start: startOfDay(wk[0]), end: endOfDay(wk[6]) };
      }
      if (this._view === 'list') {
        // List view: always show upcoming events from now
        const now = new Date();
        const endDate = new Date(now);
        endDate.setDate(endDate.getDate() + this._opts.listDaysForward);
        return { start: now, end: endDate };
      }
      return { start: startOfDay(this._date), end: endOfDay(this._date) };
    }

    /** Get the full month grid range for the current date (for fetching) */
    _getMonthGridRange() {
      const dates = getMonthGridDates(
        this._date.getFullYear(),
        this._date.getMonth(),
        this._opts.weekStartsOn
      );
      return { start: startOfDay(dates[0]), end: endOfDay(dates[dates.length - 1]) };
    }

    async _fetchAndRender() {
      // Build the shell immediately (updates toolbar title + clears view)
      this._root.innerHTML = this._buildShell();

      if (!this._opts.fetchEvents) {
        this._renderView();
        return;
      }

      const range = this._getRange();

      // Check if the required range is fully within the cached range
      const canUseCache =
        this._cachedRange &&
        this._cachedRange.start <= range.start &&
        this._cachedRange.end >= range.end;

      if (canUseCache) {
        // Use cached events - filter for the current range
        this._events = this._cachedEvents.filter(
          (e) => e.end >= range.start && e.start <= range.end
        );
        this._renderView();
        return;
      }

      // Need to fetch - show loading spinner
      const loadingEl = this._root.querySelector('.uc-loading');
      if (loadingEl) loadingEl.style.display = 'flex';

      try {
        // Always fetch the full month grid range (except for list view)
        // This ensures week/day views benefit from the full month cache
        let fetchRange;
        if (this._view === 'list') {
          // List view is special - fetch its specific range
          fetchRange = range;
        } else {
          // For month/week/day views: fetch the full month grid
          fetchRange = this._getMonthGridRange();
        }

        const raw = await this._opts.fetchEvents(fetchRange.start, fetchRange.end);
        const parsedEvents = (raw || []).map((e) => ({
          ...e,
          start: parseDate(e.start),
          end: parseDate(e.end),
        }));

        // Update cache with the fetched range
        this._cachedRange = { start: fetchRange.start, end: fetchRange.end };
        this._cachedEvents = parsedEvents;

        // Filter for current view's range
        this._events = parsedEvents.filter(
          (e) => e.end >= range.start && e.start <= range.end
        );
      } catch (err) {
        console.error('SimpleCalendarJs fetchEvents error:', err);
        this._events = [];
      }

      if (loadingEl) loadingEl.style.display = 'none';
      this._renderView();
    }

    /** Inject view HTML into the view container. */
    _renderView() {
      const vc = this._root.querySelector('.uc-view-container');
      if (!vc) return;

      // Update unlimited events class and cell min-height
      if (this._opts.maxEventsPerCell === 0) {
        this._root.classList.add('uc-unlimited-events');
        // Remove cell min-height override for unlimited mode
        this._root.style.removeProperty('--cal-cell-min-height');
      } else {
        this._root.classList.remove('uc-unlimited-events');
        // Set cell min-height based on maxEventsPerCell to match maximum row height
        // Formula: header height (30) + (max events * (event height + gap: 24)) + space for "+N more" (28)
        const cellMinHeight = 30 + this._opts.maxEventsPerCell * 24 + 28;
        this._root.style.setProperty('--cal-cell-min-height', `${cellMinHeight}px`);
      }

      if (this._view === 'month') {
        vc.innerHTML = this._buildMonthView();
      } else if (this._view === 'week') {
        const wk = getWeekDates(this._date, this._opts.weekStartsOn);
        vc.innerHTML = this._buildWeekOrDayView(wk);
        this._scrollToBusinessHours(vc);
      } else if (this._view === 'list') {
        vc.innerHTML = this._buildListView();
      } else {
        vc.innerHTML = this._buildWeekOrDayView([this._date]);
        this._scrollToBusinessHours(vc);
      }
    }

    /** Scroll the time grid to ~8 AM after render. */
    _scrollToBusinessHours(vc) {
      requestAnimationFrame(() => {
        const body = vc.querySelector('.uc-time-body');
        if (!body) return;
        const hourH = parseFloat(
          getComputedStyle(this._root).getPropertyValue('--cal-hour-height')
        ) || 60;
        body.scrollTop = 7 * hourH;
      });
    }

    /** Re-render only the toolbar in place (no event fetch, no view rebuild). */
    _renderToolbar() {
      const existing = this._root.querySelector('.uc-toolbar');
      if (!existing) return;
      const tmp = document.createElement('div');
      tmp.innerHTML = this._buildToolbar();
      this._root.replaceChild(tmp.firstElementChild, existing);
    }

    /* ---- Shell & Toolbar ---- */

    _buildShell() {
      return `
        ${this._buildToolbar()}
        <div class="uc-loading" style="display:none">
          <div class="uc-spinner"></div>
        </div>
        <div class="uc-view-container"></div>
      `;
    }

    _buildToolbar() {
      if (!this._opts.showToolbar) return '';

      const year = this._date.getFullYear();
      const todayYear = new Date().getFullYear();

      let titleMain;
      let showYear = true;

      if (this._view === 'month') {
        titleMain = new Intl.DateTimeFormat(this._opts.locale, { month: 'long' }).format(this._date);
      } else if (this._view === 'week') {
        const wk = getWeekDates(this._date, this._opts.weekStartsOn);
        titleMain = fmtWeekRangeNoYear(wk[0], wk[6], this._opts.locale);
      } else if (this._view === 'list') {
        // List view: show date range "Feb 22 - Mar 24, 2026"
        const now = new Date();
        const endDate = new Date(now);
        endDate.setDate(endDate.getDate() + this._opts.listDaysForward);
        titleMain = fmtWeekRange(now, endDate, this._opts.locale);
        showYear = false; // Year already included in range
      } else {
        titleMain = new Intl.DateTimeFormat(this._opts.locale, {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        }).format(this._date);
      }

      // Year picker popover
      let pickerHtml = '';
      if (this._opts.showYearPicker && this._yearPickerOpen) {
        const base = this._yearPickerBase;
        const itemsHtml = Array.from({ length: 12 }, (_, i) => {
          const y = base + i;
          const isSelected = y === year;
          const isToday = y === todayYear && !isSelected;
          const cls = 'uc-year-item' + (isSelected ? ' uc-active' : '') + (isToday ? ' uc-today-year' : '');
          return `<button class="${cls}" data-action="select-year" data-year="${y}">${y}</button>`;
        }).join('');

        pickerHtml = `
          <div class="uc-year-picker">
            <div class="uc-year-picker-nav">
              <button class="uc-year-nav-btn" data-action="year-prev" aria-label="Previous years">&#8249;</button>
              <span class="uc-year-range">${base} – ${base + 11}</span>
              <button class="uc-year-nav-btn" data-action="year-next" aria-label="Next years">&#8250;</button>
            </div>
            <div class="uc-year-grid">${itemsHtml}</div>
          </div>`;
      }

      const locale = this._opts.locale;
      const todayLabel = getTranslation(locale, 'today');
      const monthLabel = getTranslation(locale, 'month');
      const weekLabel = getTranslation(locale, 'week');
      const dayLabel = getTranslation(locale, 'day');
      const listLabel = getTranslation(locale, 'list');

      // Left section (navigation + today) - hide in list view
      let leftSection = '';
      if ((this._opts.showNavigation || this._opts.showTodayButton) && this._view !== 'list') {
        const navPrev = this._opts.showNavigation
          ? `<button class="uc-btn uc-nav-btn" data-action="prev" aria-label="Previous">&#8249;</button>`
          : '';

        // Check if we're viewing today
        const today = new Date();
        const isViewingToday = isSameDay(this._date, today);
        const todayActiveClass = isViewingToday ? ' uc-active' : '';

        const todayBtn = this._opts.showTodayButton
          ? `<button class="uc-btn uc-today-btn${todayActiveClass}" data-action="today">${esc(todayLabel)}</button>`
          : '';
        const navNext = this._opts.showNavigation
          ? `<button class="uc-btn uc-nav-btn" data-action="next" aria-label="Next">&#8250;</button>`
          : '';
        leftSection = `
          <div class="uc-toolbar-section uc-toolbar-left">
            ${navPrev}${todayBtn}${navNext}
          </div>`;
      }

      // Center section (title + year picker) - hide year in list view
      let centerSection = '';
      if (this._opts.showTitle) {
        const yearBtn = showYear
          ? (this._opts.showYearPicker
              ? `<button class="uc-year-btn${this._yearPickerOpen ? ' uc-open' : ''}" data-action="year-pick" aria-label="Select year">${year}</button>`
              : year)
          : '';
        centerSection = `
          <div class="uc-toolbar-section uc-toolbar-center">
            <h2 class="uc-title">
              <span class="uc-title-main">${esc(titleMain)}</span>
              ${yearBtn}
            </h2>
            ${pickerHtml}
          </div>`;
      }

      // Right section (view switcher)
      let rightSection = '';
      if (this._opts.showViewSwitcher) {
        const enabledViews = this._opts.enabledViews;
        const viewButtons = [];
        if (enabledViews.includes('month')) {
          viewButtons.push(`<button class="uc-btn uc-view-btn${this._view === 'month' ? ' uc-active' : ''}" data-view="month">${esc(monthLabel)}</button>`);
        }
        if (enabledViews.includes('week')) {
          viewButtons.push(`<button class="uc-btn uc-view-btn${this._view === 'week' ? ' uc-active' : ''}" data-view="week">${esc(weekLabel)}</button>`);
        }
        if (enabledViews.includes('day')) {
          viewButtons.push(`<button class="uc-btn uc-view-btn${this._view === 'day' ? ' uc-active' : ''}" data-view="day">${esc(dayLabel)}</button>`);
        }
        if (enabledViews.includes('list')) {
          viewButtons.push(`<button class="uc-btn uc-view-btn${this._view === 'list' ? ' uc-active' : ''}" data-view="list">${esc(listLabel)}</button>`);
        }

        if (viewButtons.length > 0) {
          rightSection = `
            <div class="uc-toolbar-section uc-toolbar-right">
              <div class="uc-view-switcher">
                ${viewButtons.join('')}
              </div>
            </div>`;
        }
      }

      return `
        <div class="uc-toolbar">
          ${leftSection}${centerSection}${rightSection}
        </div>
      `;
    }

    /* ---- Month View ---- */

    _buildMonthView() {
      const { locale, weekStartsOn } = this._opts;
      const dates = getMonthGridDates(this._date.getFullYear(), this._date.getMonth(), weekStartsOn);
      const dayNames = getDayNames(locale, weekStartsOn, this._opts.weekdayFormat);

      // Normalise multi-day event boundaries to whole-day granularity.
      // Use endOfDay so same-day allDay events (start === end) still render.
      const normEvents = this._events.map((e) => ({
        ...e,
        _origStart: e.start,
        start: isMultiDay(e) ? startOfDay(e.start) : e.start,
        end: isMultiDay(e) ? endOfDay(e.end) : e.end,
      }));

      const header = dayNames
        .map((n) => `<div class="uc-month-day-name">${esc(n)}</div>`)
        .join('');

      // Split into weeks
      const weeks = [];
      for (let i = 0; i < dates.length; i += 7) weeks.push(dates.slice(i, i + 7));

      const body = weeks.map((wk) => this._buildWeekRow(wk, normEvents)).join('');

      return `
        <div class="uc-month-view">
          <div class="uc-month-header">${header}</div>
          <div class="uc-month-body">${body}</div>
        </div>
      `;
    }

    _buildWeekRow(weekDates, allEvents) {
      const curMonth = this._date.getMonth();
      const MAX = this._opts.maxEventsPerCell === 0 ? Infinity : this._opts.maxEventsPerCell;

      // Separate multi-day from single-day events
      const multiDay = allEvents.filter(isMultiDay);
      const singleDay = allEvents.filter((e) => !isMultiDay(e));

      const layout = layoutMultiDayForWeek(multiDay, weekDates);

      // Per-column: which slots are taken by multi-day events?
      const colSlots = Array.from({ length: 7 }, () => new Set());
      for (const { startCol, endCol, slot } of layout) {
        for (let c = startCol; c <= endCol; c++) colSlots[c].add(slot);
      }

      // Single-day events per column
      const singleByCol = weekDates.map((date) =>
        singleDay.filter((e) => isSameDay(e.start, date)).sort((a, b) => a.start - b.start)
      );

      // --- Background cells ---
      const cellsHtml = weekDates
        .map((date, col) => {
          const today = isToday(date) ? ' uc-today' : '';
          const other = date.getMonth() !== curMonth ? ' uc-other-month' : '';
          return `
            <div class="uc-day-cell${today}${other}" data-date="${date.toISOString()}" data-action="day-click">
              <span class="uc-day-number" data-action="day-number" data-date="${date.toISOString()}">${date.getDate()}</span>
            </div>`;
        })
        .join('');

      // --- Event bars ---
      let barsHtml = '';

      // Multi-day bars
      for (const { event, startCol, endCol, slot, isStart, isEnd } of layout) {
        // In unlimited mode, show all events; otherwise skip events beyond MAX
        if (MAX !== Infinity && slot >= MAX) continue; // counted in "+N more"

        const cw = 100 / 7;
        const left = startCol * cw;
        const width = (endCol - startCol + 1) * cw;
        const topCss = `calc(var(--cal-header-day-height) + ${slot} * (var(--cal-event-height) + var(--cal-event-gap)) + 4px)`;

        const color = event.color || 'var(--cal-event-bg)';
        const rl = isStart ? 'var(--cal-event-border-radius)' : '0';
        const rr = isEnd ? 'var(--cal-event-border-radius)' : '0';
        const contL = !isStart ? ' uc-continues-left' : '';
        const contR = !isEnd ? ' uc-continues-right' : '';

        const tooltipAttr = this._opts.showTooltips
          ? `data-tooltip="${esc(event.tooltip || event.description || event.title)}"`
          : '';
        barsHtml += `
          <div class="uc-event-bar${contL}${contR}"
               style="left:calc(${left}% + 2px);width:calc(${width}% - 4px);top:${topCss};background:${esc(color)};border-radius:${rl} ${rr} ${rr} ${rl};"
               data-event-id="${esc(event.id)}" data-action="event-click"
               ${tooltipAttr}>
            ${isStart ? `<span class="uc-event-title">${esc(event.title)}</span>` : '&nbsp;'}
          </div>`;
      }

      // Single-day events and overflow links
      let maxSlotUsed = -1; // Track maximum slot used across all columns

      for (let col = 0; col < 7; col++) {
        const cw = 100 / 7;
        const left = col * cw;
        const date = weekDates[col];

        // Fill slots after all multi-day/all-day events so they always appear first
        const takenArr = [...colSlots[col]];
        const afterMultiDay = takenArr.length > 0 ? Math.max(...takenArr) + 1 : 0;

        const dayEvs = singleByCol[col];

        if (MAX === Infinity) {
          // Unlimited mode: show all events without any limit
          dayEvs.forEach((ev, i) => {
            const slot = afterMultiDay + i;
            maxSlotUsed = Math.max(maxSlotUsed, slot);
            const topCss = `calc(var(--cal-header-day-height) + ${slot} * (var(--cal-event-height) + var(--cal-event-gap)) + 4px)`;
            const color = ev.color || 'var(--cal-event-bg)';
            const timeStr = fmtTime(ev.start, this._opts.locale, this._opts.use24Hour);
            const timeHtml = this._opts.showTimeInItems
              ? `<span class="uc-event-time">${esc(timeStr)}</span>`
              : '';
            const tooltipAttr = this._opts.showTooltips
              ? `data-tooltip="${esc(ev.tooltip || ev.description || ev.title)}"`
              : '';
            barsHtml += `
              <div class="uc-event-bar"
                   style="left:calc(${left}% + 2px);width:calc(${cw}% - 4px);top:${topCss};background:${esc(color)};"
                   data-event-id="${esc(ev.id)}" data-action="event-click"
                   ${tooltipAttr}>
                ${timeHtml}
                <span class="uc-event-title">${esc(ev.title)}</span>
              </div>`;
          });
        } else {
          // Limited mode: respect MAX limit and show "+N more" link
          const hiddenMultiDay = [...colSlots[col]].filter((s) => s >= MAX).length;
          const freeSlots = [];
          for (let s = afterMultiDay; s < MAX; s++) {
            freeSlots.push(s);
          }

          let hidden = hiddenMultiDay;

          dayEvs.forEach((ev, i) => {
            if (i < freeSlots.length) {
              const slot = freeSlots[i];
              maxSlotUsed = Math.max(maxSlotUsed, slot);
              const topCss = `calc(var(--cal-header-day-height) + ${slot} * (var(--cal-event-height) + var(--cal-event-gap)) + 4px)`;
              const color = ev.color || 'var(--cal-event-bg)';
              const timeStr = fmtTime(ev.start, this._opts.locale, this._opts.use24Hour);
              const timeHtml = this._opts.showTimeInItems
                ? `<span class="uc-event-time">${esc(timeStr)}</span>`
                : '';
              const tooltipAttr = this._opts.showTooltips
                ? `data-tooltip="${esc(ev.tooltip || ev.description || ev.title)}"`
                : '';
              barsHtml += `
              <div class="uc-event-bar"
                   style="left:calc(${left}% + 2px);width:calc(${cw}% - 4px);top:${topCss};background:${esc(color)};"
                   data-event-id="${esc(ev.id)}" data-action="event-click"
                   ${tooltipAttr}>
                ${timeHtml}
                <span class="uc-event-title">${esc(ev.title)}</span>
              </div>`;
            } else {
              hidden++;
            }
          });

          if (hidden > 0) {
            const topCss = `calc(var(--cal-header-day-height) + ${MAX} * (var(--cal-event-height) + var(--cal-event-gap)) + 2px)`;
            barsHtml += `
            <div class="uc-more-link"
                 style="left:calc(${left}% + 2px);width:calc(${cw}% - 4px);top:${topCss};"
                 data-date="${date.toISOString()}" data-action="more-click">
              +${hidden} more
            </div>`;
          }
        }
      }

      // Track max slot from multi-day events too
      for (const { slot } of layout) {
        // In unlimited mode, track all slots; otherwise only track visible slots
        if (MAX === Infinity || slot < MAX) {
          maxSlotUsed = Math.max(maxSlotUsed, slot);
        }
      }

      // Calculate row height - only needed for unlimited mode where rows expand dynamically
      let rowStyle = '';
      if (MAX === Infinity) {
        // Unlimited mode: use actual content height or minimum base height
        if (maxSlotUsed >= 0) {
          rowStyle = ` style="min-height: calc(var(--cal-header-day-height) + ${maxSlotUsed + 1} * (var(--cal-event-height) + var(--cal-event-gap)) + 8px);"`;
        } else {
          // Empty row in unlimited mode - set a reasonable minimum
          rowStyle = ` style="min-height: 80px;"`;
        }
      }
      // Limited mode: let CSS --cal-cell-min-height control row height (no inline style needed)

      return `
        <div class="uc-week-row"${rowStyle}>
          <div class="uc-week-cells">${cellsHtml}</div>
          <div class="uc-week-events">${barsHtml}</div>
        </div>`;
    }

    /* ---- Week / Day View ---- */

    /**
     * Builds the week view (7 columns) or day view (1 column).
     * @param {Date[]} days - array of 1 or 7 Date objects
     */
    _buildWeekOrDayView(days) {
      const { locale, weekStartsOn, use24Hour } = this._opts;
      const isDay = days.length === 1;
      const colClass = isDay ? ' uc-day-header-single' : '';

      const dayNames = isDay
        ? [new Intl.DateTimeFormat(locale, { weekday: this._opts.weekdayFormat }).format(days[0])]
        : getDayNames(locale, weekStartsOn, this._opts.weekdayFormat);

      const viewStart = startOfDay(days[0]);
      const viewEnd = endOfDay(days[days.length - 1]);

      // Partition events
      const allDayEvs = this._events
        .filter((e) => isMultiDay(e) && e.start <= viewEnd && endOfDay(e.end) >= viewStart)
        .map((e) => ({ ...e, start: startOfDay(e.start), end: endOfDay(e.end) }));

      const timedEvs = this._events.filter(
        (e) => !isMultiDay(e) && e.start >= viewStart && e.start <= viewEnd
      );

      // --- Column headers ---
      const headersHtml = days
        .map((date, i) => {
          const today = isToday(date) ? ' uc-today' : '';
          const num = date.getDate();
          return `
            <div class="uc-week-day-header${today}">
              <span class="uc-week-day-name">${esc(dayNames[i])}</span>
              <span class="uc-week-day-num" data-action="day-number" data-date="${date.toISOString()}">${num}</span>
            </div>`;
        })
        .join('');

      // --- All-day event bars ---
      const allDayLayout = isDay
        ? allDayEvs.map((event, i) => ({ event, startCol: 0, endCol: 0, slot: i, isStart: true, isEnd: true }))
        : layoutMultiDayForWeek(allDayEvs, days);

      const allDayRows = allDayLayout.length
        ? Math.max(...allDayLayout.map((l) => l.slot)) + 1
        : 0;

      let allDayBarsHtml = '';
      for (const { event, startCol, endCol, slot, isStart, isEnd } of allDayLayout) {
        const cw = 100 / days.length;
        const left = startCol * cw;
        const width = (endCol - startCol + 1) * cw;
        const topCss = `calc(${slot} * (var(--cal-event-height) + 3px) + 2px)`;
        const color = event.color || 'var(--cal-event-bg)';
        const rl = isStart ? 'var(--cal-event-border-radius)' : '0';
        const rr = isEnd ? 'var(--cal-event-border-radius)' : '0';
        const contL = !isStart ? ' uc-continues-left' : '';
        const contR = !isEnd ? ' uc-continues-right' : '';
        const tooltipAttr = this._opts.showTooltips
          ? `data-tooltip="${esc(event.tooltip || event.description || event.title)}"`
          : '';

        allDayBarsHtml += `
          <div class="uc-event-bar${contL}${contR}"
               style="left:calc(${left}% + 2px);width:calc(${width}% - 4px);top:${topCss};background:${esc(color)};border-radius:${rl} ${rr} ${rr} ${rl};"
               data-event-id="${esc(event.id)}" data-action="event-click"
               ${tooltipAttr}>
            ${isStart ? `<span class="uc-event-title">${esc(event.title)}</span>` : '&nbsp;'}
          </div>`;
      }

      const allDayHeight = `calc(${Math.max(1, allDayRows)} * (var(--cal-event-height) + 3px) + 6px)`;

      // --- Time grid ---
      const now = new Date();
      const nowMins = now.getHours() * 60 + now.getMinutes();
      const colCount = days.length;

      // Hour labels (use 'en-US' locale to avoid verbose period names like "da manhã")
      const gutterHtml = Array.from({ length: 24 }, (_, h) => {
        const label = h === 0 ? '' : fmtTime(new Date(2000, 0, 1, h), 'en-US', use24Hour);
        return `<div class="uc-hour-cell"><span class="uc-hour-label">${esc(label)}</span></div>`;
      }).join('');

      // Day columns
      const colsHtml = days
        .map((date) => {
          const today = isToday(date) ? ' uc-today' : '';

          // Hour grid lines
          const gridLines = Array.from(
            { length: 24 },
            () => `<div class="uc-hour-row"><div class="uc-half-hour-line"></div></div>`
          ).join('');

          // Events for this day
          const dayEvs = timedEvs.filter((e) => isSameDay(e.start, date));
          const evLayouts = layoutTimedEvents(dayEvs);

          const eventsHtml = evLayouts
            .map(({ event, col, totalCols }) => {
              const sm = event.start.getHours() * 60 + event.start.getMinutes();
              const em = event.end.getHours() * 60 + event.end.getMinutes();
              const dur = Math.max(em - sm, 30); // minimum 30-min height
              const topCss = `calc(${sm} / 60 * var(--cal-hour-height))`;
              const heightCss = `calc(${dur} / 60 * var(--cal-hour-height))`;
              const cw = 100 / totalCols;
              const leftCss = `calc(${col * cw}% + 1px)`;
              const widthCss = `calc(${cw}% - 2px)`;
              const color = event.color || 'var(--cal-event-bg)';
              const timeStr = fmtTime(event.start, locale, use24Hour);
              const actualDur = em - sm;
              const isShort = actualDur <= 60;
              const shortClass = isShort ? ' uc-timed-event--short' : '';
              const timeHtml = this._opts.showTimeInItems
                ? `<span class="uc-event-time">${esc(timeStr)}</span>`
                : '';
              const tooltipAttr = this._opts.showTooltips
                ? `data-tooltip="${esc(event.tooltip || event.description || event.title)}"`
                : '';

              return `
                <div class="uc-timed-event${shortClass}"
                     style="top:${topCss};height:${heightCss};left:${leftCss};width:${widthCss};background:${esc(color)};"
                     data-event-id="${esc(event.id)}" data-action="event-click"
                     ${tooltipAttr}>
                  ${timeHtml}
                  <span class="uc-event-title">${esc(event.title)}</span>
                </div>`;
            })
            .join('');

          // Current time indicator (only inside today's column)
          const nowHtml = isToday(date)
            ? `<div class="uc-now-indicator" style="top:calc(${nowMins} / 60 * var(--cal-hour-height));">
                 <span class="uc-now-dot"></span>
                 <span class="uc-now-line"></span>
               </div>`
            : '';

          return `<div class="uc-time-col${today}" data-date="${date.toISOString()}" data-action="slot-col">
            ${gridLines}${eventsHtml}${nowHtml}
          </div>`;
        })
        .join('');

      const viewClass = isDay ? 'uc-day-view' : 'uc-week-view';

      return `
        <div class="${viewClass}">
          <div class="uc-week-header">
            <div class="uc-time-gutter-spacer"></div>
            <div class="uc-week-day-headers${colClass}">${headersHtml}</div>
          </div>
          <div class="uc-all-day-section">
            <div class="uc-time-gutter-spacer uc-all-day-label">${getTranslation(this._opts.locale, 'allDay')}</div>
            <div class="uc-all-day-events" style="min-height:${allDayHeight}">${allDayBarsHtml}</div>
          </div>
          <div class="uc-time-body">
            <div class="uc-time-grid-inner">
              <div class="uc-time-gutter">${gutterHtml}</div>
              <div class="uc-time-columns" style="--uc-col-count:${colCount}">${colsHtml}</div>
            </div>
          </div>
        </div>`;
    }

    /* ---- List View ---- */

    _buildListView() {
      const now = new Date();
      const todayStart = startOfDay(now);
      const endDate = new Date(todayStart);
      endDate.setDate(endDate.getDate() + this._opts.listDaysForward);

      // Filter events: end time must be >= now, and start must be <= endDate
      const upcomingEvents = this._events.filter(
        (e) => e.end >= now && e.start <= endDate
      );

      // Sort by display date (today or start date, whichever is later), then by start time
      upcomingEvents.sort((a, b) => {
        const aDisplay = a.start < todayStart ? todayStart : startOfDay(a.start);
        const bDisplay = b.start < todayStart ? todayStart : startOfDay(b.start);
        const dateDiff = aDisplay - bDisplay;
        return dateDiff !== 0 ? dateDiff : a.start - b.start;
      });

      // Group by date - multi-day events active today show under today
      const eventsByDate = new Map();
      upcomingEvents.forEach((event) => {
        // If event started before today but is still active, show it under today
        // Otherwise show it under its actual start date
        const displayDate = event.start < todayStart ? todayStart : startOfDay(event.start);
        const dateKey = formatDate(displayDate);
        if (!eventsByDate.has(dateKey)) {
          eventsByDate.set(dateKey, []);
        }
        eventsByDate.get(dateKey).push(event);
      });

      // Build HTML
      if (eventsByDate.size === 0) {
        return `
          <div class="uc-list-view">
            <div class="uc-list-empty">
              <p>No upcoming events</p>
            </div>
          </div>`;
      }

      let groupsHtml = '';
      eventsByDate.forEach((events, dateKey) => {
        const date = parseDate(dateKey);
        const dateHeader = new Intl.DateTimeFormat(this._opts.locale, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }).format(date);

        const eventsHtml = events.map((event) => {
          const isAllDay = isMultiDay(event);
          const timeStr = isAllDay
            ? 'All day'
            : fmtTime(event.start, this._opts.locale, this._opts.use24Hour);

          const color = event.color || 'var(--cal-event-bg)';
          const tooltipAttr = this._opts.showTooltips
            ? `data-tooltip="${esc(event.tooltip || event.description || '')}"`
            : '';

          return `
            <div class="uc-list-event" data-event-id="${esc(event.id)}" data-action="event-click" ${tooltipAttr}>
              <div class="uc-list-event-indicator" style="background: ${esc(color)};"></div>
              <div class="uc-list-event-time">${esc(timeStr)}</div>
              <div class="uc-list-event-content">
                <div class="uc-list-event-title">${esc(event.title)}</div>
              </div>
            </div>`;
        }).join('');

        groupsHtml += `
          <div class="uc-list-date-group">
            <div class="uc-list-date-header">${esc(dateHeader)}</div>
            <div class="uc-list-events">${eventsHtml}</div>
          </div>`;
      });

      return `<div class="uc-list-view">${groupsHtml}</div>`;
    }

    _closeYearPicker() {
      if (this._yearOutsideHandler) {
        document.removeEventListener('click', this._yearOutsideHandler);
        this._yearOutsideHandler = null;
      }
      this._yearPickerOpen = false;
      this._renderToolbar();
    }

    /* ---- Interactions ---- */

    _handleClick(evt) {
      // View switcher buttons carry data-view (no data-action) — handle first
      const viewBtn = evt.target.closest('[data-view]');
      if (viewBtn) {
        this.setView(viewBtn.dataset.view);
        return;
      }

      // Walk up from click target to find the nearest data-action element
      const actionEl = evt.target.closest('[data-action]');
      if (!actionEl) return;
      const action = actionEl.dataset.action;

      switch (action) {
        case 'prev':
          this.navigate(-1);
          break;

        case 'next':
          this.navigate(1);
          break;

        case 'today':
          this.goToToday();
          break;

        case 'year-pick': {
          evt.stopPropagation();
          if (this._yearPickerOpen) {
            this._closeYearPicker();
          } else {
            this._yearPickerOpen = true;
            // Center the grid on the current year
            this._yearPickerBase = this._date.getFullYear() - 4;
            this._renderToolbar();
            // Close when clicking outside
            this._yearOutsideHandler = (e) => {
              if (!e.target.closest('.uc-year-picker') && !e.target.closest('[data-action="year-pick"]')) {
                this._closeYearPicker();
              }
            };
            setTimeout(() => document.addEventListener('click', this._yearOutsideHandler), 0);
          }
          break;
        }

        case 'year-prev': {
          evt.stopPropagation();
          this._yearPickerBase -= 12;
          this._renderToolbar();
          break;
        }

        case 'year-next': {
          evt.stopPropagation();
          this._yearPickerBase += 12;
          this._renderToolbar();
          break;
        }

        case 'select-year': {
          evt.stopPropagation();
          const y = parseInt(actionEl.dataset.year, 10);
          this._date = new Date(this._date.getFullYear() !== y
            ? new Date(this._date).setFullYear(y)
            : this._date);
          this._closeYearPicker();
          const range = this._getRange();
          if (this._opts.onNavigate) this._opts.onNavigate(range.start, range.end);
          this._fetchAndRender();
          break;
        }

        case 'event-click': {
          evt.stopPropagation();
          const evId = actionEl.dataset.eventId;
          const ev = this._events.find((e) => String(e.id) === String(evId));
          if (ev && this._opts.onEventClick) this._opts.onEventClick(ev, evt);
          break;
        }

        case 'day-click': {
          // Ignore if click was on a day-number or event
          if (evt.target.closest('[data-action="day-number"]')) break;
          if (evt.target.closest('[data-action="event-click"]')) break;
          const date = new Date(actionEl.dataset.date);
          if (this._opts.onSlotClick) this._opts.onSlotClick(date, evt);
          break;
        }

        case 'day-number': {
          evt.stopPropagation();
          if (!this._opts.enabledViews.includes('day')) break;
          const date = new Date(actionEl.dataset.date);
          this._date = startOfDay(date);
          this._view = 'day';
          if (this._opts.onViewChange) this._opts.onViewChange('day');
          this._fetchAndRender();
          break;
        }

        case 'more-click': {
          evt.stopPropagation();
          if (!this._opts.enabledViews.includes('day')) break;
          const date = new Date(actionEl.dataset.date);
          this._date = startOfDay(date);
          this._view = 'day';
          if (this._opts.onViewChange) this._opts.onViewChange('day');
          this._fetchAndRender();
          break;
        }

        case 'slot-col': {
          // Click on empty space in the time grid
          if (evt.target.closest('[data-action="event-click"]')) break;
          if (this._opts.onSlotClick) {
            const colEl = actionEl;
            const rect = colEl.getBoundingClientRect();
            const y = evt.clientY - rect.top;
            const hourH =
              parseFloat(getComputedStyle(this._root).getPropertyValue('--cal-hour-height')) || 60;
            const totalMins = Math.max(0, Math.floor((y / hourH) * 60));
            const h = Math.floor(totalMins / 60) % 24;
            const m = Math.round((totalMins % 60) / 15) * 15; // snap to 15 min
            const date = new Date(colEl.dataset.date);
            date.setHours(h, m, 0, 0);
            this._opts.onSlotClick(date, evt);
          }
          break;
        }
      }

    }

    _handleTooltipPosition(evt) {
      const target = evt.target.closest('[data-tooltip]');
      if (!target || !target.dataset.tooltip) return;

      // Only position if tooltip has content
      const tooltipText = target.dataset.tooltip.trim();
      if (!tooltipText) return;

      // Get viewport dimensions
      const rect = target.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      // Remove positioning classes
      target.classList.remove('uc-tooltip-left', 'uc-tooltip-right', 'uc-tooltip-bottom');

      // Check if tooltip would overflow right edge (default: show on top-center)
      const tooltipWidth = 250; // max-width from CSS
      const centerOffset = (rect.width / 2) - (tooltipWidth / 2);

      if (rect.left + centerOffset + tooltipWidth > viewportWidth - 10) {
        target.classList.add('uc-tooltip-left'); // Align to right
      } else if (rect.left + centerOffset < 10) {
        target.classList.add('uc-tooltip-right'); // Align to left
      }

      // Check if tooltip would overflow top edge
      if (rect.top < 50) {
        target.classList.add('uc-tooltip-bottom'); // Show below instead
      }
    }

    _startNowUpdater() {
      // Update now-indicator position every 60 seconds
      this._nowInterval = setInterval(() => {
        const indicators = this._root.querySelectorAll('.uc-now-indicator');
        if (!indicators.length) return;
        const now = new Date();
        const mins = now.getHours() * 60 + now.getMinutes();
        const top = `calc(${mins} / 60 * var(--cal-hour-height))`;
        indicators.forEach((el) => (el.style.top = top));
      }, 60_000);
    }
  }

  /* ============================================================
     ES MODULE EXPORT
     Also available as window.SimpleCalendarJs via the IIFE wrapper.
     ============================================================ */

  return SimpleCalendarJs;
});

// For ES module consumers using a bundler:
//   import SimpleCalendarJs from './simple-calendar-js.js';
// The UMD wrapper above sets module.exports in CJS and window.SimpleCalendarJs in browsers.
