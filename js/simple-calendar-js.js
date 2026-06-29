/**
 * SimpleCalendarJs v3.0.14
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

  /**
   * Sanitize URL to allow only safe protocols.
   * Allows: http://, https://, mailto:, tel:
   * Blocks: javascript:, data:, vbscript:, and other dangerous protocols
   */
  function sanitizeUrl(url) {
    if (!url) return '#';

    const urlStr = url.trim().toLowerCase();
    const safeProtocols = ['http://', 'https://', 'mailto:', 'tel:'];
    const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:', 'about:'];

    // Check for dangerous protocols
    if (dangerousProtocols.some(p => urlStr.includes(p))) return '#';

    // Must start with a safe protocol or be relative (starts with / or #)
    if (!safeProtocols.some(p => urlStr.startsWith(p)) && !urlStr.startsWith('/') && !urlStr.startsWith('#')) {
      return '#';
    }

    return url;
  }

  /**
   * Sanitize style attribute to allow only safe CSS properties.
   * Allows: color, background-color
   * Blocks: CSS expressions, url(), import, and other dangerous constructs
   */
  function sanitizeStyle(styleStr) {
    if (!styleStr) return '';

    const allowedProps = ['color', 'background-color'];
    const rules = styleStr.split(';').filter(rule => {
      if (!rule.trim()) return false;

      const colonIndex = rule.indexOf(':');
      if (colonIndex === -1) return false;

      const prop = rule.substring(0, colonIndex).trim().toLowerCase();
      const val = rule.substring(colonIndex + 1).trim();

      // Check if property is allowed
      if (!allowedProps.includes(prop)) return false;

      // Block CSS injection attempts
      if (/expression|url\(|import|@/i.test(val)) return false;

      return true;
    });

    return rules.join(';');
  }

  /**
   * Sanitize HTML to allow only safe tags and attributes.
   * Allows: <b>, <i>, <strong>, <em>, <span>, <br>, <a> with safe attributes.
   * Strips: <script>, event handlers (onclick, onerror, etc.), and dangerous attributes.
   */
  function sanitizeHtml(html) {
    if (!html) return '';

    // Create a temporary div to parse HTML
    const temp = document.createElement('div');
    temp.innerHTML = html;

    // Allowed tags
    const allowedTags = ['B', 'I', 'STRONG', 'EM', 'SPAN', 'BR', 'A'];

    // Recursively clean nodes
    function cleanNode(node) {
      // Remove dangerous tags completely
      if (node.nodeType === 1) { // Element node
        if (!allowedTags.includes(node.nodeName)) {
          // Replace with text content only
          const textNode = document.createTextNode(node.textContent || '');
          node.parentNode?.replaceChild(textNode, node);
          return;
        }

        // Determine allowed attributes based on tag
        const allowedAttrs = ['class'];
        if (node.nodeName === 'A') {
          allowedAttrs.push('href');
        }
        if (node.nodeName === 'SPAN') {
          allowedAttrs.push('style');
        }

        // Remove all attributes except allowed ones
        const attrs = Array.from(node.attributes);
        attrs.forEach(attr => {
          if (!allowedAttrs.includes(attr.name)) {
            node.removeAttribute(attr.name);
          }
        });

        // Sanitize class attribute - only allow alphanumeric, dash, underscore, space
        if (node.hasAttribute('class')) {
          const className = node.getAttribute('class') || '';
          const sanitizedClass = className.replace(/[^a-zA-Z0-9\s\-_]/g, '');
          if (sanitizedClass) {
            node.setAttribute('class', sanitizedClass);
          } else {
            node.removeAttribute('class');
          }
        }

        // Sanitize href attribute for <a> tags
        if (node.nodeName === 'A' && node.hasAttribute('href')) {
          const href = node.getAttribute('href') || '';
          const sanitizedHref = sanitizeUrl(href);
          node.setAttribute('href', sanitizedHref);
        }

        // Sanitize style attribute for <span> tags
        if (node.nodeName === 'SPAN' && node.hasAttribute('style')) {
          const style = node.getAttribute('style') || '';
          const sanitizedStyle = sanitizeStyle(style);
          if (sanitizedStyle) {
            node.setAttribute('style', sanitizedStyle);
          } else {
            node.removeAttribute('style');
          }
        }
      }

      // Process children
      Array.from(node.childNodes).forEach(child => cleanNode(child));
    }

    cleanNode(temp);
    return temp.innerHTML;
  }

  /**
   * Helper to get event title HTML - either escaped or sanitized based on settings.
   */
  function getEventTitleHtml(title, allowHtmlGlobal, allowHtmlEvent) {
    if (!title) return '';

    // Check if HTML is allowed (global setting or per-event override)
    const shouldAllowHtml = allowHtmlEvent !== undefined ? allowHtmlEvent : allowHtmlGlobal;

    return shouldAllowHtml ? sanitizeHtml(title) : esc(title);
  }

  /* ============================================================
     COLOR UTILITIES
     ============================================================ */

  /**
   * Convert hex color to RGB values
   */
  function hexToRgb(hex) {
    hex = hex.replace('#', '');
    return {
      r: parseInt(hex.substr(0, 2), 16),
      g: parseInt(hex.substr(2, 2), 16),
      b: parseInt(hex.substr(4, 2), 16)
    };
  }

  /**
   * Convert RGB to HSL
   */
  function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  /**
   * Convert HSL to RGB
   */
  function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }

  /**
   * Convert RGB to hex
   */
  function rgbToHex(r, g, b) {
    const toHex = (n) => {
      const hex = Math.max(0, Math.min(255, n)).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return '#' + toHex(r) + toHex(g) + toHex(b);
  }

  /**
   * Calculate the best contrasting text color based on background color and contrast level.
   *
   * @param {string} hexColor - Background color in hex format
   * @param {string} level - Contrast level: 'high' (black/white), 'medium' (darker/lighter shade), 'low' (subtle variation)
   * @returns {string} Hex color for text
   */
  function getContrastColor(hexColor, level = 'high') {
    // If it's a CSS variable or not a hex color, return default
    if (!hexColor || hexColor.startsWith('var(') || !hexColor.match(/^#?[0-9A-Fa-f]{6}$/)) {
      return 'var(--cal-event-text)';
    }

    // Remove # if present
    hexColor = hexColor.replace('#', '');
    hexColor = '#' + hexColor;

    // Convert to RGB
    const rgb = hexToRgb(hexColor);

    // Calculate relative luminance (WCAG formula)
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    const isLight = luminance > 0.5;

    // High contrast: pure black or white
    if (level === 'high') {
      return isLight ? '#000000' : '#ffffff';
    }

    // Medium/Low contrast: adjust the background color
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    if (level === 'medium') {
      // Medium contrast: significant lightness shift
      if (isLight) {
        // Darken by 40-50%
        hsl.l = Math.max(10, hsl.l - 50);
      } else {
        // Lighten by 40-50%
        hsl.l = Math.min(90, hsl.l + 50);
      }
      // Slightly increase saturation for better visibility
      hsl.s = Math.min(100, hsl.s + 10);
    } else if (level === 'low') {
      // Low contrast: subtle lightness shift
      if (isLight) {
        // Darken by 25-30%
        hsl.l = Math.max(15, hsl.l - 30);
      } else {
        // Lighten by 25-30%
        hsl.l = Math.min(85, hsl.l + 30);
      }
      // Keep saturation similar
      hsl.s = Math.min(100, hsl.s + 5);
    }

    const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
  }

  /**
   * Darken a color by reducing its lightness in HSL space.
   * Used for auto-generating border colors from event background colors.
   * Adapts darkening amount based on original lightness for better visibility.
   *
   * @param {string} hexColor - Color in hex format
   * @param {number} amount - Base amount to darken (0-100), default 25 (ignored, auto-calculated)
   * @returns {string} Darkened hex color
   */
  function darkenColor(hexColor, amount = 25) {
    // If it's a CSS variable or not a hex color, return a default dark border
    if (!hexColor || hexColor.startsWith('var(') || !hexColor.match(/^#?[0-9A-Fa-f]{6}$/)) {
      return '#4a5568';
    }

    // Remove # if present
    hexColor = hexColor.replace('#', '');
    hexColor = '#' + hexColor;

    // Convert to RGB
    const rgb = hexToRgb(hexColor);

    // Convert to HSL
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    // Adaptive darkening based on lightness
    // Light colors need more darkening to create visible borders
    let darkenAmount;
    if (hsl.l > 70) {
      // Very light colors: darken significantly (45-50%)
      darkenAmount = 50;
    } else if (hsl.l > 50) {
      // Medium-light colors: darken moderately (35%)
      darkenAmount = 35;
    } else {
      // Darker colors: darken less (25%)
      darkenAmount = 25;
    }

    // Darken by reducing lightness
    hsl.l = Math.max(0, hsl.l - darkenAmount);

    // Slightly increase saturation for richer color
    hsl.s = Math.min(100, hsl.s + 10);

    // Convert back to hex
    const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
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
     * @param {string}   [options.mode='calendar']       'calendar'|'date-picker'|'range-picker'
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
     * @param {function} [options.onDateSelect]          (date) => void (for date-picker mode)
     * @param {function} [options.onRangeSelect]         (startDate, endDate) => void (for range-picker mode)
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
          mode: 'calendar', // 'calendar' | 'date-picker' | 'range-picker'
          defaultView: 'month',
          defaultDate: null,
          weekStartsOn: 0,
          locale: 'default',
          weekdayFormat: 'short',
          use24Hour: false,
          showTimeInItems: true,
          showGridLines: true,
          monthTimedEventStyle: 'list',
          monthDayNumberAlign: 'left',
          showToolbar: true,
          showTodayButton: true,
          showNavigation: true,
          showTitle: true,
          showYearPicker: true,
          showViewSwitcher: true,
          showTooltips: true,
          tooltipBgColor: null,
          tooltipTextColor: null,
          tooltipMaxWidth: 250,
          tooltipDelay: 400,
          tooltipAllowHtml: true,
          showBorder: true,
          listDaysForward: 30,
          enabledViews: ['month', 'week', 'day'],
          enableDragDrop: false,
          enableResize: false,
          autoContrastText: false,
          contrastLevel: 'high',
          allowHtmlInEvents: true,
          showEventBorder: false,
          fetchEvents: null,
          onEventClick: null,
          onSlotClick: null,
          onDateSelect: null,
          onRangeSelect: null,
          onViewChange: null,
          onNavigate: null,
          onEventDrop: null,
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
      this._selectedDate = null; // For date-picker mode
      this._selectedRange = { start: null, end: null }; // For range-picker mode
      this._yearOutsideHandler = null;
      this._dragState = null; // Drag and drop state
      this._clickSuppressed = false; // Suppress click after drag
      this._tooltipElement = null; // Tooltip DOM element
      this._tooltipTimeout = null; // Tooltip show delay timeout
      this._currentTooltipTarget = null; // Current element being hovered

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

      // Tooltip handlers
      this._onMouseOver = this._handleTooltipHover.bind(this);
      this._onMouseOut = this._handleTooltipMouseOut.bind(this);
      this._root.addEventListener('mouseover', this._onMouseOver);
      this._root.addEventListener('mouseout', this._onMouseOut);

      // Drag, drop, and resize listeners
      if (this._opts.enableDragDrop || this._opts.enableResize) {
        this._onMouseDown = this._handleDragStart.bind(this);
        this._onMouseMoveGlobal = this._handleDragMove.bind(this);
        this._onMouseUp = this._handleDragEnd.bind(this);
        this._onTouchStart = this._handleDragStart.bind(this);
        this._onTouchMove = this._handleDragMove.bind(this);
        this._onTouchEnd = this._handleDragEnd.bind(this);
        this._onKeyDown = this._handleDragKeyDown.bind(this);

        this._root.addEventListener('mousedown', this._onMouseDown);
        document.addEventListener('mousemove', this._onMouseMoveGlobal);
        document.addEventListener('mouseup', this._onMouseUp);
        this._root.addEventListener('touchstart', this._onTouchStart, { passive: true });
        document.addEventListener('touchmove', this._onTouchMove, { passive: false });
        document.addEventListener('touchend', this._onTouchEnd);
        document.addEventListener('keydown', this._onKeyDown);

        if (this._opts.enableDragDrop) {
          this._root.setAttribute('data-drag-enabled', 'true');
        }
        if (this._opts.enableResize) {
          this._root.setAttribute('data-resize-enabled', 'true');
        }
      }

      // Build the shell once during initialization
      this._root.innerHTML = this._buildShell();

      // Watch for resize and re-render to recalculate event layout
      this._resizeObserver = new ResizeObserver(() => {
        // Debounce to avoid excessive re-renders
        if (this._resizeTimeout) clearTimeout(this._resizeTimeout);
        this._resizeTimeout = setTimeout(() => {
          this._renderView();
        }, 100);
      });
      this._resizeObserver.observe(this._root);

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
        d.setDate(1);
        d.setMonth(d.getMonth() + delta);
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

    /**
     * Get the selected date (date-picker mode).
     * @returns {Date|null} The selected date or null if none selected
     */
    getSelectedDate() {
      return this._selectedDate;
    }

    /**
     * Set the selected date (date-picker mode).
     * @param {Date|null} date - The date to select, or null to clear selection
     */
    setSelectedDate(date) {
      if (this._opts.mode !== 'date-picker') {
        console.warn('setSelectedDate() only works in date-picker mode');
        return;
      }
      this._selectedDate = date ? startOfDay(date) : null;
      this._renderView();
    }

    /**
     * Get the selected range (range-picker mode).
     * @returns {{start: Date|null, end: Date|null}} The selected range
     */
    getSelectedRange() {
      return { ...this._selectedRange };
    }

    /**
     * Set the selected range (range-picker mode).
     * @param {Date|null} startDate - The start date, or null to clear
     * @param {Date|null} endDate - The end date, or null for incomplete range
     */
    setSelectedRange(startDate, endDate = null) {
      if (this._opts.mode !== 'range-picker') {
        console.warn('setSelectedRange() only works in range-picker mode');
        return;
      }
      this._selectedRange = {
        start: startDate ? startOfDay(startDate) : null,
        end: endDate ? startOfDay(endDate) : null
      };
      this._renderView();
    }

    /**
     * Clear all selections (works in both picker modes).
     */
    clearSelection() {
      this._selectedDate = null;
      this._selectedRange = { start: null, end: null };
      this._renderView();
    }

    /** Tear down — removes DOM and clears the interval. */
    destroy() {
      if (this._nowInterval) clearInterval(this._nowInterval);
      if (this._resizeTimeout) clearTimeout(this._resizeTimeout);
      if (this._resizeObserver) this._resizeObserver.disconnect();
      if (this._yearOutsideHandler) document.removeEventListener('click', this._yearOutsideHandler);
      this._root.removeEventListener('click', this._onClick);
      this._root.removeEventListener('mouseover', this._onMouseOver);
      this._root.removeEventListener('mouseout', this._onMouseOut);

      // Clean up tooltip
      if (this._tooltipElement) {
        this._tooltipElement.remove();
        this._tooltipElement = null;
      }
      if (this._tooltipTimeout) {
        clearTimeout(this._tooltipTimeout);
        this._tooltipTimeout = null;
      }

      // Remove drag, drop, and resize listeners
      if (this._opts.enableDragDrop || this._opts.enableResize) {
        this._root.removeEventListener('mousedown', this._onMouseDown);
        document.removeEventListener('mousemove', this._onMouseMoveGlobal);
        document.removeEventListener('mouseup', this._onMouseUp);
        this._root.removeEventListener('touchstart', this._onTouchStart);
        document.removeEventListener('touchmove', this._onTouchMove);
        document.removeEventListener('touchend', this._onTouchEnd);
        document.removeEventListener('keydown', this._onKeyDown);
      }

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
      // Update toolbar only (don't rebuild entire shell)
      this._updateToolbar();

      // Skip event fetching in picker modes
      const isPickerMode = this._opts.mode === 'date-picker' || this._opts.mode === 'range-picker';
      if (!this._opts.fetchEvents || isPickerMode) {
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

      // Check if parent container has explicit height constraint (for all views)
      const parentEl = this._root.parentElement;
      const hasExplicitHeight = parentEl && parentEl.style.height && parentEl.style.height !== 'auto' && parentEl.style.height !== '';

      if (hasExplicitHeight) {
        this._root.setAttribute('data-height-constrained', 'true');
      } else {
        this._root.removeAttribute('data-height-constrained');
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

    _updateToolbar() {
      const toolbar = this._root.querySelector('.uc-toolbar');
      if (toolbar) {
        const temp = document.createElement('div');
        temp.innerHTML = this._buildToolbar();
        const newToolbar = temp.firstElementChild;
        if (newToolbar) {
          toolbar.replaceWith(newToolbar);
        }
      }
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

      // Left section (navigation + today)
      let leftSection = '';
      if (this._opts.showNavigation || this._opts.showTodayButton) {
        const isListView = this._view === 'list';
        const disabledAttr = isListView ? ' disabled' : '';

        const navPrev = this._opts.showNavigation
          ? `<button class="uc-btn uc-nav-btn" data-action="prev" aria-label="Previous"${disabledAttr}>&#8249;</button>`
          : '';

        // Check if we're viewing today
        const today = new Date();
        const isViewingToday = isSameDay(this._date, today);
        const todayActiveClass = isViewingToday ? ' uc-active' : '';

        const todayBtn = this._opts.showTodayButton
          ? `<button class="uc-btn uc-today-btn${todayActiveClass}" data-action="today"${disabledAttr}>${esc(todayLabel)}</button>`
          : '';
        const navNext = this._opts.showNavigation
          ? `<button class="uc-btn uc-nav-btn" data-action="next" aria-label="Next"${disabledAttr}>&#8250;</button>`
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

      // Right section (view switcher) - hide in picker modes
      let rightSection = '';
      const isPickerMode = this._opts.mode === 'date-picker' || this._opts.mode === 'range-picker';
      if (this._opts.showViewSwitcher && !isPickerMode) {
        const enabledViews = this._opts.enabledViews;
        const viewButtons = [];
        const dropdownOptions = [];

        if (enabledViews.includes('month')) {
          viewButtons.push(`<button class="uc-btn uc-view-btn${this._view === 'month' ? ' uc-active' : ''}" data-view="month">${esc(monthLabel)}</button>`);
          dropdownOptions.push(`<button class="uc-dropdown-item${this._view === 'month' ? ' uc-active' : ''}" data-view="month">${esc(monthLabel)}</button>`);
        }
        if (enabledViews.includes('week')) {
          viewButtons.push(`<button class="uc-btn uc-view-btn${this._view === 'week' ? ' uc-active' : ''}" data-view="week">${esc(weekLabel)}</button>`);
          dropdownOptions.push(`<button class="uc-dropdown-item${this._view === 'week' ? ' uc-active' : ''}" data-view="week">${esc(weekLabel)}</button>`);
        }
        if (enabledViews.includes('day')) {
          viewButtons.push(`<button class="uc-btn uc-view-btn${this._view === 'day' ? ' uc-active' : ''}" data-view="day">${esc(dayLabel)}</button>`);
          dropdownOptions.push(`<button class="uc-dropdown-item${this._view === 'day' ? ' uc-active' : ''}" data-view="day">${esc(dayLabel)}</button>`);
        }
        if (enabledViews.includes('list')) {
          viewButtons.push(`<button class="uc-btn uc-view-btn${this._view === 'list' ? ' uc-active' : ''}" data-view="list">${esc(listLabel)}</button>`);
          dropdownOptions.push(`<button class="uc-dropdown-item${this._view === 'list' ? ' uc-active' : ''}" data-view="list">${esc(listLabel)}</button>`);
        }

        if (viewButtons.length > 0) {
          // Add Today button to dropdown with separator
          const todayLabel = getTranslation(locale, 'today');
          const isToday = isSameDay(this._date, new Date());
          const todayActiveClass = isToday ? ' uc-active' : '';
          const isListView = this._view === 'list';
          const disabledAttr = isListView ? ' disabled' : '';
          dropdownOptions.push(`<div class="uc-dropdown-separator"></div>`);
          dropdownOptions.push(`<button class="uc-dropdown-item${todayActiveClass}" data-action="today"${disabledAttr}>${esc(todayLabel)}</button>`);

          rightSection = `
            <div class="uc-toolbar-section uc-toolbar-right">
              <div class="uc-view-switcher">
                ${viewButtons.join('')}
              </div>
              <div class="uc-view-dropdown">
                <button class="uc-btn uc-view-dropdown-btn" aria-label="View options">
                  <span class="uc-view-icon">⊞</span>
                </button>
                <div class="uc-dropdown-menu">
                  ${dropdownOptions.join('')}
                </div>
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

      // Auto-calculate MAX based on container height constraint
      let maxEvents;

      // Check if parent container has explicit height constraint (inline style only)
      const parentEl = this._root.parentElement;
      const hasExplicitHeight = parentEl && parentEl.style.height && parentEl.style.height !== 'auto' && parentEl.style.height !== '';

      if (hasExplicitHeight) {
        // Container is height-constrained: calculate based on parent's available space
        const parentHeight = parentEl.clientHeight;
        const toolbar = this._root.querySelector('.uc-toolbar');
        const monthHeader = this._root.querySelector('.uc-month-header');

        const toolbarHeight = toolbar ? toolbar.offsetHeight : 50;
        const headerHeight = monthHeader ? monthHeader.offsetHeight : 36;
        const borderHeight = 2; // 1px top + 1px bottom

        // Available height for month body
        const bodyHeight = parentHeight - toolbarHeight - headerHeight - borderHeight;
        const numWeeks = weeks.length;
        const cellHeight = Math.floor(bodyHeight / numWeeks);

        // Formula: (cellHeight - headerHeight - moreLink) / eventHeightWithGap
        // cellHeight - 30 (header) - 28 (+N more space) / 24 (event + gap)
        const MAX = Math.floor((cellHeight - 30 - 28) / 24);
        // Allow 0 so all events can be hidden when space is very limited
        maxEvents = Math.max(0, MAX);
      } else {
        // Container is naturally sized: show all events
        maxEvents = Infinity;
      }

      // Calculate cell height for constrained mode
      const cellHeight = hasExplicitHeight
        ? Math.floor((parentEl.clientHeight - (this._root.querySelector('.uc-toolbar')?.offsetHeight || 50) - (this._root.querySelector('.uc-month-header')?.offsetHeight || 36) - 2) / weeks.length)
        : null;

      const body = weeks.map((wk) => this._buildWeekRow(wk, normEvents, maxEvents, cellHeight)).join('');

      return `
        <div class="uc-month-view">
          <div class="uc-month-header">${header}</div>
          <div class="uc-month-body">${body}</div>
        </div>
      `;
    }

    _buildWeekRow(weekDates, allEvents, MAX, cellHeight = null) {
      const curMonth = this._date.getMonth();

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
      const isPickerMode = this._opts.mode === 'date-picker' || this._opts.mode === 'range-picker';
      // In picker modes, always center-align day numbers; otherwise use the configured alignment
      const alignClass = isPickerMode ? ' uc-day-align-center-picker' :
                         (this._opts.monthDayNumberAlign === 'center' ? ' uc-day-align-center' :
                         this._opts.monthDayNumberAlign === 'right' ? ' uc-day-align-right' : '');
      const cellsHtml = weekDates
        .map((date, col) => {
          // Don't highlight today in picker modes to avoid confusion with selection
          const today = (!isPickerMode && isToday(date)) ? ' uc-today' : '';
          const other = date.getMonth() !== curMonth ? ' uc-other-month' : '';

          // Add selected class for picker modes
          let selected = '';
          if (this._opts.mode === 'date-picker' && this._selectedDate) {
            selected = isSameDay(date, this._selectedDate) ? ' uc-selected' : '';
          } else if (this._opts.mode === 'range-picker' && this._selectedRange.start) {
            if (this._selectedRange.end) {
              // Complete range - highlight all dates in range
              const inRange = date >= this._selectedRange.start && date <= this._selectedRange.end;
              const isRangeStart = isSameDay(date, this._selectedRange.start);
              const isRangeEnd = isSameDay(date, this._selectedRange.end);
              selected = inRange ? ' uc-in-range' : '';
              if (isRangeStart) selected += ' uc-range-start';
              if (isRangeEnd) selected += ' uc-range-end';
            } else {
              // Only start date selected
              selected = isSameDay(date, this._selectedRange.start) ? ' uc-range-start' : '';
            }
          }

          return `
            <div class="uc-day-cell${today}${other}${selected}${alignClass}" data-date="${date.toISOString()}" data-action="day-click">
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
        const textColor = event.textColor || (this._opts.autoContrastText ? getContrastColor(color, this._opts.contrastLevel) : 'var(--cal-event-text)');
        const borderColor = event.borderColor || (this._opts.showEventBorder ? darkenColor(color, 25) : 'transparent');
        const borderStyle = this._opts.showEventBorder ? `border:1px solid ${esc(borderColor)};` : '';
        const rl = isStart ? 'var(--cal-event-border-radius)' : '0';
        const rr = isEnd ? 'var(--cal-event-border-radius)' : '0';
        const contL = !isStart ? ' uc-continues-left' : '';
        const contR = !isEnd ? ' uc-continues-right' : '';

        const tooltipAttr = this._opts.showTooltips
          ? `data-tooltip="${esc(event.tooltip || event.description || event.title)}"`
          : '';
        const resizeHandle = this._opts.enableResize && isEnd
          ? `<div class="uc-resize-handle-right" data-action="resize-handle"></div>`
          : '';
        barsHtml += `
          <div class="uc-event-bar${contL}${contR}"
               style="left:calc(${left}% + 2px);width:calc(${width}% - 4px);top:${topCss};background:${esc(color)};color:${esc(textColor)};${borderStyle}border-radius:${rl} ${rr} ${rr} ${rl};"
               data-event-id="${esc(event.id)}" data-action="event-click"
               ${tooltipAttr}>
            ${isStart ? `<span class="uc-event-title">${getEventTitleHtml(event.title, this._opts.allowHtmlInEvents, event.allowHtml)}</span>` : '&nbsp;'}
            ${resizeHandle}
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
            const textColor = ev.textColor || (this._opts.autoContrastText ? getContrastColor(color, this._opts.contrastLevel) : 'var(--cal-event-text)');
            const timeStr = fmtTime(ev.start, this._opts.locale, this._opts.use24Hour);
            const tooltipAttr = this._opts.showTooltips
              ? `data-tooltip="${esc(ev.tooltip || ev.description || ev.title)}"`
              : '';

            // Render based on monthTimedEventStyle option
            if (this._opts.monthTimedEventStyle === 'list') {
              // List style: dot, time, title
              const timeHtml = this._opts.showTimeInItems
                ? `<span class="uc-event-time">${esc(timeStr)}</span>`
                : '';
              barsHtml += `
              <div class="uc-event-bar uc-event-bar--list"
                   style="left:calc(${left}% + 2px);width:calc(${cw}% - 4px);top:${topCss};"
                   data-event-id="${esc(ev.id)}" data-action="event-click"
                   ${tooltipAttr}>
                <span class="uc-event-dot" style="background:${esc(color)};"></span>
                ${timeHtml}
                <span class="uc-event-title">${getEventTitleHtml(ev.title, this._opts.allowHtmlInEvents, ev.allowHtml)}</span>
              </div>`;
            } else {
              // Block style: traditional colored background
              const borderColor = ev.borderColor || (this._opts.showEventBorder ? darkenColor(color, 25) : 'transparent');
              const borderStyle = this._opts.showEventBorder ? `border:1px solid ${esc(borderColor)};` : '';
              const timeHtml = this._opts.showTimeInItems
                ? `<span class="uc-event-time">${esc(timeStr)}</span>`
                : '';
              barsHtml += `
              <div class="uc-event-bar"
                   style="left:calc(${left}% + 2px);width:calc(${cw}% - 4px);top:${topCss};background:${esc(color)};color:${esc(textColor)};${borderStyle}"
                   data-event-id="${esc(ev.id)}" data-action="event-click"
                   ${tooltipAttr}>
                ${timeHtml}
                <span class="uc-event-title">${getEventTitleHtml(ev.title, this._opts.allowHtmlInEvents, ev.allowHtml)}</span>
              </div>`;
            }
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
              const textColor = ev.textColor || (this._opts.autoContrastText ? getContrastColor(color, this._opts.contrastLevel) : 'var(--cal-event-text)');
              const timeStr = fmtTime(ev.start, this._opts.locale, this._opts.use24Hour);
              const tooltipAttr = this._opts.showTooltips
                ? `data-tooltip="${esc(ev.tooltip || ev.description || ev.title)}"`
                : '';

              // Render based on monthTimedEventStyle option
              if (this._opts.monthTimedEventStyle === 'list') {
                // List style: dot, time, title
                const timeHtml = this._opts.showTimeInItems
                  ? `<span class="uc-event-time">${esc(timeStr)}</span>`
                  : '';
                barsHtml += `
              <div class="uc-event-bar uc-event-bar--list"
                   style="left:calc(${left}% + 2px);width:calc(${cw}% - 4px);top:${topCss};"
                   data-event-id="${esc(ev.id)}" data-action="event-click"
                   ${tooltipAttr}>
                <span class="uc-event-dot" style="background:${esc(color)};"></span>
                ${timeHtml}
                <span class="uc-event-title">${getEventTitleHtml(ev.title, this._opts.allowHtmlInEvents, ev.allowHtml)}</span>
              </div>`;
              } else {
                // Block style: traditional colored background
                const borderColor = ev.borderColor || (this._opts.showEventBorder ? darkenColor(color, 25) : 'transparent');
                const borderStyle = this._opts.showEventBorder ? `border:1px solid ${esc(borderColor)};` : '';
                const timeHtml = this._opts.showTimeInItems
                  ? `<span class="uc-event-time">${esc(timeStr)}</span>`
                  : '';
                barsHtml += `
              <div class="uc-event-bar"
                   style="left:calc(${left}% + 2px);width:calc(${cw}% - 4px);top:${topCss};background:${esc(color)};color:${esc(textColor)};${borderStyle}"
                   data-event-id="${esc(ev.id)}" data-action="event-click"
                   ${tooltipAttr}>
                ${timeHtml}
                <span class="uc-event-title">${getEventTitleHtml(ev.title, this._opts.allowHtmlInEvents, ev.allowHtml)}</span>
              </div>`;
              }
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

      // Calculate row height
      let rowStyle = '';
      if (cellHeight !== null) {
        // Height-constrained mode: enforce exact height
        rowStyle = ` style="height: ${cellHeight}px;"`;
      } else if (MAX === Infinity) {
        // Unlimited mode: calculate individual row height based on this row's events
        const rowHeight = maxSlotUsed >= 0
          ? `calc(var(--cal-header-day-height) + ${maxSlotUsed + 1} * (var(--cal-event-height) + var(--cal-event-gap)) + 8px)`
          : '80px';
        rowStyle = ` style="min-height: ${rowHeight};"`;
      }
      // Natural sizing mode (limited mode with no explicit height): let flex handle it with CSS min-height

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
        const textColor = event.textColor || (this._opts.autoContrastText ? getContrastColor(color, this._opts.contrastLevel) : 'var(--cal-event-text)');
        const borderColor = event.borderColor || (this._opts.showEventBorder ? darkenColor(color, 25) : 'transparent');
        const borderStyle = this._opts.showEventBorder ? `border:1px solid ${esc(borderColor)};` : '';
        const rl = isStart ? 'var(--cal-event-border-radius)' : '0';
        const rr = isEnd ? 'var(--cal-event-border-radius)' : '0';
        const contL = !isStart ? ' uc-continues-left' : '';
        const contR = !isEnd ? ' uc-continues-right' : '';
        const tooltipAttr = this._opts.showTooltips
          ? `data-tooltip="${esc(event.tooltip || event.description || event.title)}"`
          : '';
        const resizeHandle = this._opts.enableResize && isEnd
          ? `<div class="uc-resize-handle-right" data-action="resize-handle"></div>`
          : '';

        allDayBarsHtml += `
          <div class="uc-event-bar${contL}${contR}"
               style="left:calc(${left}% + 2px);width:calc(${width}% - 4px);top:${topCss};background:${esc(color)};color:${esc(textColor)};${borderStyle}border-radius:${rl} ${rr} ${rr} ${rl};"
               data-event-id="${esc(event.id)}" data-action="event-click"
               ${tooltipAttr}>
            <span class="uc-event-title">${getEventTitleHtml(event.title, this._opts.allowHtmlInEvents, event.allowHtml)}</span>
            ${resizeHandle}
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
              const textColor = event.textColor || (this._opts.autoContrastText ? getContrastColor(color, this._opts.contrastLevel) : 'var(--cal-event-text)');
              const borderColor = event.borderColor || (this._opts.showEventBorder ? darkenColor(color, 25) : 'transparent');
              const borderStyle = this._opts.showEventBorder ? `border:1px solid ${esc(borderColor)};` : '';
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

              const resizeHandle = this._opts.enableResize
                ? `<div class="uc-resize-handle" data-action="resize-handle"></div>`
                : '';

              // Week/day views always use block style
              return `
                <div class="uc-timed-event${shortClass}"
                     style="top:${topCss};height:${heightCss};left:${leftCss};width:${widthCss};background:${esc(color)};color:${esc(textColor)};${borderStyle}"
                     data-event-id="${esc(event.id)}" data-action="event-click"
                     ${tooltipAttr}>
                  ${timeHtml}
                  <span class="uc-event-title">${getEventTitleHtml(event.title, this._opts.allowHtmlInEvents, event.allowHtml)}</span>
                  ${resizeHandle}
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
                <div class="uc-list-event-title">${getEventTitleHtml(event.title, this._opts.allowHtmlInEvents, event.allowHtml)}</div>
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
      // Suppress click if just finished dragging
      if (this._clickSuppressed) {
        this._clickSuppressed = false;
        return;
      }

      // View dropdown toggle
      const dropdownBtn = evt.target.closest('.uc-view-dropdown-btn');
      if (dropdownBtn) {
        evt.stopPropagation();
        const dropdown = dropdownBtn.parentElement;
        const isOpen = dropdown.classList.contains('uc-open');

        // Close all dropdowns first
        this._root.querySelectorAll('.uc-view-dropdown.uc-open').forEach(d => d.classList.remove('uc-open'));

        if (!isOpen) {
          dropdown.classList.add('uc-open');
          // Close when clicking outside
          this._dropdownOutsideHandler = (e) => {
            if (!e.target.closest('.uc-view-dropdown')) {
              dropdown.classList.remove('uc-open');
              document.removeEventListener('click', this._dropdownOutsideHandler);
            }
          };
          setTimeout(() => document.addEventListener('click', this._dropdownOutsideHandler), 0);
        }
        return;
      }

      // View switcher buttons carry data-view (no data-action) — handle first
      const viewBtn = evt.target.closest('[data-view]');
      if (viewBtn) {
        this.setView(viewBtn.dataset.view);
        // Close dropdown if open
        this._root.querySelectorAll('.uc-view-dropdown.uc-open').forEach(d => d.classList.remove('uc-open'));
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
          // Close dropdown if open
          this._root.querySelectorAll('.uc-view-dropdown.uc-open').forEach(d => d.classList.remove('uc-open'));
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

          // Handle picker modes
          if (this._opts.mode === 'date-picker') {
            this._handleDateSelection(date);
          } else if (this._opts.mode === 'range-picker') {
            this._handleRangeSelection(date);
          } else {
            // Calendar mode - use normal onSlotClick behavior
            if (this._opts.onSlotClick) this._opts.onSlotClick(date, evt);
          }
          break;
        }

        case 'day-number': {
          evt.stopPropagation();
          const date = new Date(actionEl.dataset.date);

          // Handle picker modes
          if (this._opts.mode === 'date-picker') {
            this._handleDateSelection(date);
          } else if (this._opts.mode === 'range-picker') {
            this._handleRangeSelection(date);
          } else {
            // Calendar mode - switch to day view
            if (!this._opts.enabledViews.includes('day')) break;
            this._date = startOfDay(date);
            this._view = 'day';
            if (this._opts.onViewChange) this._opts.onViewChange('day');
            this._fetchAndRender();
          }
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

    /**
     * Handle date selection in date-picker mode.
     */
    _handleDateSelection(date) {
      const normalizedDate = startOfDay(date);
      this._selectedDate = normalizedDate;
      this._renderView(); // Re-render to show selection
      if (this._opts.onDateSelect) {
        this._opts.onDateSelect(normalizedDate);
      }
    }

    /**
     * Handle date selection in range-picker mode.
     */
    _handleRangeSelection(date) {
      const normalizedDate = startOfDay(date);

      // If no start date, or both start and end are set, start a new range
      if (!this._selectedRange.start || (this._selectedRange.start && this._selectedRange.end)) {
        this._selectedRange = { start: normalizedDate, end: null };
      } else {
        // We have a start but no end - set the end
        // Ensure start is before end
        if (normalizedDate < this._selectedRange.start) {
          this._selectedRange = { start: normalizedDate, end: this._selectedRange.start };
        } else {
          this._selectedRange.end = normalizedDate;
        }

        // Call the callback with the complete range
        if (this._opts.onRangeSelect) {
          this._opts.onRangeSelect(this._selectedRange.start, this._selectedRange.end);
        }
      }

      this._renderView(); // Re-render to show selection
    }

    /**
     * Handle tooltip hover - show tooltip with HTML support.
     */
    _handleTooltipHover(evt) {
      const target = evt.target.closest('[data-tooltip]');
      if (!target) return;

      const content = target.dataset.tooltip;
      if (!content || !content.trim()) return;

      // Determine if HTML is allowed
      // Check for per-event override via data-tooltip-html attribute
      const allowHtmlAttr = target.dataset.tooltipHtml;
      const allowHtml = allowHtmlAttr === 'true' ? true : this._opts.tooltipAllowHtml;

      this._showTooltip(target, content, allowHtml);
    }

    /**
     * Handle mouse out - hide tooltip when leaving the element.
     */
    _handleTooltipMouseOut(evt) {
      const target = evt.target.closest('[data-tooltip]');
      if (!target) return;

      // Only hide if moving out of the tooltip target
      if (!evt.relatedTarget || !target.contains(evt.relatedTarget)) {
        this._hideTooltip();
      }
    }

    /**
     * Create the tooltip DOM element (singleton pattern).
     * Appends to document.body for fixed positioning.
     */
    _createTooltipElement() {
      if (this._tooltipElement) return this._tooltipElement;

      const container = document.createElement('div');
      container.className = 'uc-tooltip-container';
      container.innerHTML = '<div class="uc-tooltip-content"></div><div class="uc-tooltip-arrow"></div>';

      // Apply custom colors if configured
      if (this._opts.tooltipBgColor) {
        container.style.setProperty('--tooltip-bg', this._opts.tooltipBgColor);
      }
      if (this._opts.tooltipTextColor) {
        container.style.setProperty('--tooltip-text', this._opts.tooltipTextColor);
      }
      if (this._opts.tooltipMaxWidth) {
        container.style.setProperty('--tooltip-max-width', this._opts.tooltipMaxWidth + 'px');
      }

      document.body.appendChild(container);
      this._tooltipElement = container;
      return container;
    }

    /**
     * Show tooltip with HTML support and delay.
     */
    _showTooltip(target, content, allowHtml) {
      if (!this._opts.showTooltips || !content) return;

      // Clear existing timeout
      if (this._tooltipTimeout) {
        clearTimeout(this._tooltipTimeout);
      }

      // Set delay before showing
      this._tooltipTimeout = setTimeout(() => {
        // Create tooltip element if it doesn't exist
        if (!this._tooltipElement) {
          this._createTooltipElement();
        }

        // Sanitize and set content
        const contentEl = this._tooltipElement.querySelector('.uc-tooltip-content');
        if (allowHtml) {
          contentEl.innerHTML = sanitizeHtml(content);

          // Add target="_blank" and rel="noopener noreferrer" to all links for security
          contentEl.querySelectorAll('a').forEach(link => {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
          });
        } else {
          contentEl.textContent = content;
        }

        // Position and show
        this._positionTooltipFixed(target);
        this._tooltipElement.style.opacity = '1';
        this._tooltipElement.style.visibility = 'visible';

        this._currentTooltipTarget = target;
      }, this._opts.tooltipDelay);
    }

    /**
     * Hide tooltip and clear timeout.
     */
    _hideTooltip() {
      if (this._tooltipTimeout) {
        clearTimeout(this._tooltipTimeout);
        this._tooltipTimeout = null;
      }

      if (this._tooltipElement) {
        this._tooltipElement.style.opacity = '0';
        this._tooltipElement.style.visibility = 'hidden';
      }

      this._currentTooltipTarget = null;
    }

    /**
     * Position tooltip using fixed positioning relative to viewport.
     * Handles edge detection to prevent overflow.
     */
    _positionTooltipFixed(target) {
      if (!this._tooltipElement) return;

      const rect = target.getBoundingClientRect();
      const tooltipRect = this._tooltipElement.getBoundingClientRect();
      const offset = 8; // --cal-tooltip-offset
      const padding = 10;

      // Default: show above, centered
      let top = rect.top - tooltipRect.height - offset;
      let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);

      // Horizontal overflow detection
      if (left + tooltipRect.width > window.innerWidth - padding) {
        left = window.innerWidth - tooltipRect.width - padding;
      }
      if (left < padding) {
        left = padding;
      }

      // Vertical overflow detection
      if (top < padding) {
        // Show below instead
        top = rect.bottom + offset;
        this._tooltipElement.classList.add('uc-tooltip-position-bottom');
      } else {
        this._tooltipElement.classList.remove('uc-tooltip-position-bottom');
      }

      // Apply positioning
      this._tooltipElement.style.top = top + 'px';
      this._tooltipElement.style.left = left + 'px';

      // Position arrow to point at element center
      const arrowLeft = rect.left + (rect.width / 2) - left;
      const arrow = this._tooltipElement.querySelector('.uc-tooltip-arrow');
      if (arrow) {
        arrow.style.left = arrowLeft + 'px';
      }
    }

    /* ---- Drag and Drop ---- */

    _handleDragStart(evt) {
      // List view doesn't support drag
      if (this._view === 'list') return;

      // Check if clicking on resize handle
      const resizeHandle = evt.target.closest('[data-action="resize-handle"]');
      const isResize = !!resizeHandle;
      const isRightResize = resizeHandle && resizeHandle.classList.contains('uc-resize-handle-right');
      const isBottomResize = resizeHandle && resizeHandle.classList.contains('uc-resize-handle');

      // Only process events on draggable elements
      const eventEl = evt.target.closest('[data-event-id][data-action="event-click"]');
      if (!eventEl) return;

      // Don't interfere with year picker or toolbar clicks
      if (evt.target.closest('.uc-year-picker, [data-action="year-pick"], .uc-toolbar')) return;

      // Get event data
      const eventId = eventEl.dataset.eventId;
      const event = this._events.find((e) => String(e.id) === String(eventId));
      if (!event) return;

      // Check the actual event data (month view uses uc-event-bar for all events)
      const isAllDay = event.allDay || false;

      // Check if the operation is allowed
      if (isResize && !this._opts.enableResize) {
        return; // Resize not enabled
      }
      if (!isResize && !this._opts.enableDragDrop) {
        return; // Drag and drop not enabled
      }

      // Validate resize mode
      if (isBottomResize && (isAllDay || (this._view !== 'week' && this._view !== 'day'))) {
        return; // Bottom resize only for timed events in week/day
      }
      if (isRightResize && !isAllDay) {
        return; // Right resize only for all-day events
      }

      // Get position
      const pos = this._getEventPosition(evt);

      // Calculate offset from element's top-left corner
      const rect = eventEl.getBoundingClientRect();
      const offsetX = pos.x - rect.left;
      const offsetY = pos.y - rect.top;

      // Initialize drag state (POTENTIAL_DRAG or POTENTIAL_RESIZE)
      this._dragState = {
        mode: isResize ? 'resize' : 'move',
        resizeDirection: isRightResize ? 'horizontal' : (isBottomResize ? 'vertical' : null),
        eventId: eventId,
        originalEvent: { ...event, start: new Date(event.start), end: new Date(event.end) },
        dragElement: null,
        startX: pos.x,
        startY: pos.y,
        currentX: pos.x,
        currentY: pos.y,
        offsetX: offsetX,
        offsetY: offsetY,
        originalView: this._view,
        isAllDay: isAllDay,
        hasMoved: false,
        startTime: Date.now(),
        originalElement: eventEl, // Store reference for horizontal resize
      };
    }

    _handleDragMove(evt) {
      if (!this._dragState) return;

      const pos = this._getEventPosition(evt);
      this._dragState.currentX = pos.x;
      this._dragState.currentY = pos.y;

      // Calculate movement distance
      const dx = pos.x - this._dragState.startX;
      const dy = pos.y - this._dragState.startY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Check transition to DRAGGING state
      const THRESHOLD = 5;
      const DELAY = 150;

      if (!this._dragState.hasMoved) {
        const timeSinceStart = Date.now() - this._dragState.startTime;

        if (distance > THRESHOLD || timeSinceStart > DELAY) {
          this._dragState.hasMoved = true;
          this._createDragElement();
          this._root.classList.add('uc-dragging');
        } else {
          return; // Still in POTENTIAL_DRAG
        }
      }

      // Prevent scroll on touch
      if (evt.type.startsWith('touch')) {
        evt.preventDefault();
      }

      // Update drag element based on mode
      if (this._dragState.dragElement) {
        if (this._dragState.mode === 'resize' && this._dragState.resizeDirection === 'vertical') {
          this._updateResizePreview(pos.x, pos.y);
        } else if (this._dragState.mode === 'resize' && this._dragState.resizeDirection === 'horizontal') {
          this._updateHorizontalResizePreview(pos.x);
        } else {
          // Move mode: update position with snap-to-grid
          const snappedPos = this._getSnappedPosition(pos.x, pos.y);
          if (snappedPos) {
            this._dragState.dragElement.style.left = snappedPos.x + 'px';
            this._dragState.dragElement.style.top = snappedPos.y + 'px';
          } else {
            // No snap position available, follow cursor
            this._dragState.dragElement.style.left = pos.x - this._dragState.offsetX + 'px';
            this._dragState.dragElement.style.top = pos.y - this._dragState.offsetY + 'px';
          }
        }
      }
    }

    _getSnappedPosition(x, y) {
      // Only snap in week/day views
      if (this._view !== 'week' && this._view !== 'day') {
        return null;
      }

      // Try to get drop position
      const dropPos = this._calculateDropPosition(x, y);
      if (!dropPos) return null;

      const dragEl = this._dragState.dragElement;
      if (!dragEl) return null;

      // Snap to timed grid
      if (!dropPos.isAllDay) {
        const timeColumns = this._root.querySelector('.uc-time-columns');
        if (!timeColumns) return null;

        const colElements = timeColumns.querySelectorAll('.uc-time-col');
        let targetCol = null;

        // Find which column we're over
        for (const col of colElements) {
          const rect = col.getBoundingClientRect();
          if (x >= rect.left && x < rect.right) {
            targetCol = col;
            break;
          }
        }

        if (!targetCol) return null;

        const colRect = targetCol.getBoundingClientRect();

        // Calculate Y position based on the snapped time
        const hours = dropPos.date.getHours();
        const minutes = dropPos.date.getMinutes();
        const totalMinutes = hours * 60 + minutes;

        const hourHeight = parseFloat(getComputedStyle(this._root).getPropertyValue('--cal-hour-height')) || 60;
        const yOffset = (totalMinutes / 60) * hourHeight;

        // Update time display in drag element
        const timeSpan = dragEl.querySelector('.uc-event-time');
        if (timeSpan) {
          const timeStr = fmtTime(dropPos.date, this._opts.locale, this._opts.use24Hour);
          timeSpan.textContent = timeStr;
        }

        return {
          x: colRect.left + 4, // 4px padding
          y: colRect.top + yOffset,
        };
      }

      // Snap to all-day section
      if (dropPos.isAllDay) {
        const allDaySection = this._root.querySelector('.uc-all-day-events');
        if (!allDaySection) return null;

        const sectionRect = allDaySection.getBoundingClientRect();
        const weekDays = this._view === 'day' ? [this._date] : getWeekDates(this._date, this._opts.weekStartsOn);
        const dayWidth = sectionRect.width / weekDays.length;

        const relX = x - sectionRect.left;
        const dayIndex = Math.floor(relX / dayWidth);

        if (dayIndex < 0 || dayIndex >= weekDays.length) return null;

        return {
          x: sectionRect.left + dayIndex * dayWidth + 4,
          y: sectionRect.top + 4,
        };
      }

      return null;
    }

    _updateResizePreview(x, y) {
      const dragEl = this._dragState.dragElement;
      const originalEvent = this._dragState.originalEvent;

      // Find the time column we're over
      const timeColumns = this._root.querySelector('.uc-time-columns');
      if (!timeColumns) return;

      const colElements = timeColumns.querySelectorAll('.uc-time-col');
      let targetCol = null;

      for (const col of colElements) {
        const rect = col.getBoundingClientRect();
        if (x >= rect.left && x < rect.right) {
          targetCol = col;
          break;
        }
      }

      if (!targetCol) return;

      const colRect = targetCol.getBoundingClientRect();
      const relY = Math.max(0, y - colRect.top);

      const hourHeight = parseFloat(getComputedStyle(this._root).getPropertyValue('--cal-hour-height')) || 60;

      // Calculate snapped time
      const totalMinutes = Math.floor((relY / hourHeight) * 60);
      const hours = Math.floor(totalMinutes / 60) % 24;
      const minutes = Math.round((totalMinutes % 60) / 15) * 15;

      // Calculate new end time
      const newEnd = new Date(originalEvent.start);
      newEnd.setHours(hours, minutes, 0, 0);

      // Ensure end is after start (minimum 15 minutes)
      if (newEnd <= originalEvent.start) {
        newEnd.setTime(originalEvent.start.getTime() + 15 * 60 * 1000);
      }

      // Calculate new height
      const durationMs = newEnd - originalEvent.start;
      const durationMinutes = durationMs / (60 * 1000);
      const newHeight = (durationMinutes / 60) * hourHeight;

      // Update drag element height
      dragEl.style.height = newHeight + 'px';

      // Update time display to show end time
      const timeSpan = dragEl.querySelector('.uc-event-time');
      if (timeSpan) {
        const startStr = fmtTime(originalEvent.start, this._opts.locale, this._opts.use24Hour);
        const endStr = fmtTime(newEnd, this._opts.locale, this._opts.use24Hour);
        timeSpan.textContent = `${startStr} - ${endStr}`;
      }

      // Store the new end time in drag state for later use
      this._dragState.newEndTime = newEnd;
    }

    _updateHorizontalResizePreview(x) {
      const dragEl = this._dragState.dragElement;
      const originalEvent = this._dragState.originalEvent;
      const originalEl = this._dragState.originalElement;

      if (!originalEl) return;

      const rect = originalEl.getBoundingClientRect();
      const relX = x - rect.left;

      // Calculate which day column we're over based on view
      let newEndDate;

      if (this._view === 'month') {
        // Month view: calculate based on day cell width
        const monthBody = this._root.querySelector('.uc-month-body');
        if (!monthBody) return;

        const monthRect = monthBody.getBoundingClientRect();
        const cellWidth = monthRect.width / 7;
        const absoluteX = x - monthRect.left;
        const dayCol = Math.floor(absoluteX / cellWidth);

        const dates = getMonthGridDates(
          this._date.getFullYear(),
          this._date.getMonth(),
          this._opts.weekStartsOn
        );

        // Find which row the event is in
        const eventY = rect.top - monthRect.top;
        const rowHeight = monthRect.height / Math.ceil(dates.length / 7);
        const row = Math.floor(eventY / rowHeight);

        const dateIndex = row * 7 + dayCol;
        if (dateIndex >= 0 && dateIndex < dates.length) {
          newEndDate = endOfDay(dates[dateIndex]);
        }
      } else {
        // Week/Day view: calculate based on day column
        const weekDays = this._view === 'day' ? [this._date] : getWeekDates(this._date, this._opts.weekStartsOn);
        const allDaySection = this._root.querySelector('.uc-all-day-events');
        if (!allDaySection) return;

        const sectionRect = allDaySection.getBoundingClientRect();
        const dayWidth = sectionRect.width / weekDays.length;
        const absoluteX = x - sectionRect.left;
        const dayIndex = Math.floor(absoluteX / dayWidth);

        if (dayIndex >= 0 && dayIndex < weekDays.length) {
          newEndDate = endOfDay(weekDays[dayIndex]);
        }
      }

      if (!newEndDate) return;

      // Ensure end is not before start
      if (newEndDate < originalEvent.start) {
        newEndDate = endOfDay(originalEvent.start);
      }

      // Calculate new width
      const newWidth = relX + 20; // Add some buffer

      // Update drag element width
      dragEl.style.width = Math.max(newWidth, 60) + 'px';

      // Store the new end date in drag state
      this._dragState.newEndDate = newEndDate;
    }

    _handleDragEnd(evt) {
      if (!this._dragState) return;

      const wasDragging = this._dragState.hasMoved;

      if (!wasDragging) {
        // Was a click, not a drag
        this._dragState = null;
        return;
      }

      // Prevent click event
      evt.preventDefault();
      evt.stopPropagation();
      this._clickSuppressed = true;
      setTimeout(() => {
        this._clickSuppressed = false;
      }, 10);

      // Handle resize vs move
      if (this._dragState.mode === 'resize' && this._dragState.resizeDirection === 'vertical') {
        // Vertical resize mode: update end time only
        if (this._dragState.newEndTime) {
          this._performResize(this._dragState.newEndTime);
        }
      } else if (this._dragState.mode === 'resize' && this._dragState.resizeDirection === 'horizontal') {
        // Horizontal resize mode: update end date only
        if (this._dragState.newEndDate) {
          this._performHorizontalResize(this._dragState.newEndDate);
        }
      } else {
        // Move mode: calculate drop position
        const pos = this._getEventPosition(evt);
        const dropPosition = this._calculateDropPosition(pos.x, pos.y);

        if (dropPosition) {
          this._performDrop(dropPosition);
        }
      }

      // Cleanup
      this._cleanupDrag();
    }

    _handleDragKeyDown(evt) {
      if (!this._dragState || !this._dragState.hasMoved) return;

      if (evt.key === 'Escape') {
        this._cleanupDrag();
      }
    }

    _getEventPosition(evt) {
      if (evt.type.startsWith('touch')) {
        const touch = evt.touches[0] || evt.changedTouches[0];
        return { x: touch.clientX, y: touch.clientY };
      }
      return { x: evt.clientX, y: evt.clientY };
    }

    _createDragElement() {
      const originalEl = this._root.querySelector(`[data-event-id="${this._dragState.eventId}"]`);
      if (!originalEl) return;

      const dragEl = originalEl.cloneNode(true);
      dragEl.classList.add('uc-dragging-element');

      const rect = originalEl.getBoundingClientRect();

      dragEl.style.position = 'fixed';
      dragEl.style.pointerEvents = 'none';
      dragEl.style.zIndex = '10000';
      dragEl.style.opacity = '0.8';
      dragEl.style.width = originalEl.offsetWidth + 'px';

      if (this._dragState.mode === 'resize') {
        // For resize, position at original location (we'll change height)
        dragEl.style.left = rect.left + 'px';
        dragEl.style.top = rect.top + 'px';
        dragEl.style.height = originalEl.offsetHeight + 'px';
      } else {
        // For move, position with offset
        dragEl.style.left = this._dragState.currentX - this._dragState.offsetX + 'px';
        dragEl.style.top = this._dragState.currentY - this._dragState.offsetY + 'px';
      }

      document.body.appendChild(dragEl);
      this._dragState.dragElement = dragEl;
    }

    _cleanupDrag() {
      if (this._dragState && this._dragState.dragElement) {
        this._dragState.dragElement.remove();
      }
      this._root.classList.remove('uc-dragging');
      this._dragState = null;
    }

    _calculateDropPosition(x, y) {
      // Try all-day section first (week/day views)
      if (this._view === 'week' || this._view === 'day') {
        const allDayPos = this._calculateAllDayDropPosition(x, y);
        if (allDayPos) return allDayPos;

        const timedPos = this._calculateTimedDropPosition(x, y);
        if (timedPos) return timedPos;
      }

      // Try month view
      if (this._view === 'month') {
        return this._calculateMonthDropPosition(x, y);
      }

      return null;
    }

    _calculateMonthDropPosition(x, y) {
      // Find month grid
      const monthBody = this._root.querySelector('.uc-month-body');
      if (!monthBody) return null;

      const rect = monthBody.getBoundingClientRect();
      const relX = x - rect.left;
      const relY = y - rect.top;

      // Calculate grid position
      const colWidth = rect.width / 7;
      const rowCount = monthBody.querySelectorAll('.uc-week-row').length;
      const rowHeight = rect.height / rowCount;

      const col = Math.floor(relX / colWidth);
      const row = Math.floor(relY / rowHeight);

      // Map to date
      const dates = getMonthGridDates(
        this._date.getFullYear(),
        this._date.getMonth(),
        this._opts.weekStartsOn
      );
      const dateIndex = row * 7 + col;

      if (col < 0 || col >= 7 || dateIndex < 0 || dateIndex >= dates.length) {
        return null;
      }

      return {
        date: dates[dateIndex],
        isMonthView: true, // Indicates month view drop (preserve original type)
      };
    }

    _calculateTimedDropPosition(x, y) {
      const timeColumns = this._root.querySelector('.uc-time-columns');
      if (!timeColumns) return null;

      const colElements = timeColumns.querySelectorAll('.uc-time-col');
      let targetCol = null;

      for (const col of colElements) {
        const rect = col.getBoundingClientRect();
        if (x >= rect.left && x < rect.right) {
          targetCol = col;
          break;
        }
      }

      if (!targetCol) return null;

      const colRect = targetCol.getBoundingClientRect();
      const relY = Math.max(0, y - colRect.top);

      const hourHeight =
        parseFloat(getComputedStyle(this._root).getPropertyValue('--cal-hour-height')) || 60;

      const totalMinutes = Math.floor((relY / hourHeight) * 60);
      const hours = Math.floor(totalMinutes / 60) % 24;
      const minutes = Math.round((totalMinutes % 60) / 15) * 15;

      const dateStr = targetCol.dataset.date;
      if (!dateStr) return null;

      const date = new Date(dateStr);
      date.setHours(hours, minutes, 0, 0);

      return {
        date: date,
        isAllDay: false,
      };
    }

    _calculateAllDayDropPosition(x, y) {
      const allDaySection = this._root.querySelector('.uc-all-day-events');
      if (!allDaySection) return null;

      const sectionRect = allDaySection.getBoundingClientRect();
      if (y < sectionRect.top || y > sectionRect.bottom) return null;

      const weekDays =
        this._view === 'day' ? [this._date] : getWeekDates(this._date, this._opts.weekStartsOn);
      const dayWidth = sectionRect.width / weekDays.length;

      const relX = x - sectionRect.left;
      const dayIndex = Math.floor(relX / dayWidth);

      if (dayIndex < 0 || dayIndex >= weekDays.length) return null;

      return {
        date: startOfDay(weekDays[dayIndex]),
        isAllDay: true,
      };
    }

    _performDrop(dropPosition) {
      const originalEvent = this._dragState.originalEvent;
      const oldStart = new Date(originalEvent.start);
      const oldEnd = new Date(originalEvent.end);

      let newStart, newEnd, finalAllDay;

      // Check if original event was all-day or timed
      const wasAllDay = originalEvent.allDay || this._dragState.isAllDay;

      if (dropPosition.isMonthView) {
        // Dropping in month view - preserve original type
        if (wasAllDay) {
          // Keep as all-day
          const durationDays = dayDiff(oldStart, oldEnd);
          newStart = startOfDay(dropPosition.date);
          newEnd = endOfDay(addDays(dropPosition.date, Math.max(0, durationDays)));
          finalAllDay = true;
        } else {
          // Keep as timed - preserve time
          const durationMs = oldEnd - oldStart;
          newStart = new Date(dropPosition.date);
          newStart.setHours(oldStart.getHours(), oldStart.getMinutes(), oldStart.getSeconds(), oldStart.getMilliseconds());
          newEnd = new Date(newStart.getTime() + durationMs);
          finalAllDay = false;
        }
      } else if (dropPosition.isAllDay) {
        // Dropping in week/day all-day section - convert to all-day
        const durationDays = Math.max(0, Math.ceil((oldEnd - oldStart) / 86400000));
        newStart = startOfDay(dropPosition.date);
        newEnd = endOfDay(addDays(dropPosition.date, durationDays));
        finalAllDay = true;
      } else {
        // Dropping in week/day time grid - use specific time
        newStart = dropPosition.date;

        // If converting from all-day to timed, use 1 hour default duration
        if (wasAllDay) {
          newEnd = new Date(newStart.getTime() + 60 * 60 * 1000); // 1 hour
        } else {
          // Preserve duration for timed events
          const durationMs = oldEnd - oldStart;
          newEnd = new Date(newStart.getTime() + durationMs);
        }
        finalAllDay = false;
      }

      // Update event in arrays
      const eventIndex = this._events.findIndex((e) => String(e.id) === String(this._dragState.eventId));
      if (eventIndex >= 0) {
        this._events[eventIndex].start = newStart;
        this._events[eventIndex].end = newEnd;
        this._events[eventIndex].allDay = finalAllDay;
      }

      // Update cached events
      const cachedIndex = this._cachedEvents.findIndex(
        (e) => String(e.id) === String(this._dragState.eventId)
      );
      if (cachedIndex >= 0) {
        this._cachedEvents[cachedIndex].start = newStart;
        this._cachedEvents[cachedIndex].end = newEnd;
        this._cachedEvents[cachedIndex].allDay = finalAllDay;
      }

      // Fire callback
      if (this._opts.onEventDrop) {
        this._opts.onEventDrop(
          eventIndex >= 0 ? this._events[eventIndex] : null,
          oldStart,
          oldEnd,
          newStart,
          newEnd
        );
      }

      // Re-render
      this._renderView();
    }

    _performResize(newEnd) {
      const originalEvent = this._dragState.originalEvent;
      const oldStart = new Date(originalEvent.start);
      const oldEnd = new Date(originalEvent.end);

      // Keep start time the same, only update end time
      const newStart = oldStart;

      // Update event in arrays
      const eventIndex = this._events.findIndex((e) => String(e.id) === String(this._dragState.eventId));
      if (eventIndex >= 0) {
        this._events[eventIndex].end = newEnd;
      }

      // Update cached events
      const cachedIndex = this._cachedEvents.findIndex(
        (e) => String(e.id) === String(this._dragState.eventId)
      );
      if (cachedIndex >= 0) {
        this._cachedEvents[cachedIndex].end = newEnd;
      }

      // Update source data in demo
      if (this._opts.onEventDrop) {
        this._opts.onEventDrop(
          eventIndex >= 0 ? this._events[eventIndex] : null,
          oldStart,
          oldEnd,
          newStart,
          newEnd
        );
      }

      // Re-render
      this._renderView();
    }

    _performHorizontalResize(newEnd) {
      const originalEvent = this._dragState.originalEvent;
      const oldStart = new Date(originalEvent.start);
      const oldEnd = new Date(originalEvent.end);

      // Keep start date the same, only update end date
      const newStart = oldStart;

      // Update event in arrays
      const eventIndex = this._events.findIndex((e) => String(e.id) === String(this._dragState.eventId));
      if (eventIndex >= 0) {
        this._events[eventIndex].end = newEnd;
      }

      // Update cached events
      const cachedIndex = this._cachedEvents.findIndex(
        (e) => String(e.id) === String(this._dragState.eventId)
      );
      if (cachedIndex >= 0) {
        this._cachedEvents[cachedIndex].end = newEnd;
      }

      // Fire callback
      if (this._opts.onEventDrop) {
        this._opts.onEventDrop(
          eventIndex >= 0 ? this._events[eventIndex] : null,
          oldStart,
          oldEnd,
          newStart,
          newEnd
        );
      }

      // Re-render
      this._renderView();
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
