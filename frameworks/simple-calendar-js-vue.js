/**
 * SimpleCalendarJs v3.0.16 — Vue 3 Wrapper
 * A clean, modern, and feature-rich JavaScript calendar component with zero dependencies
 *
 * @author Pedro Lopes <simplecalendarjs@gmail.com>
 * @homepage https://www.simplecalendarjs.com
 * @license SEE LICENSE IN LICENSE
 * @repository https://github.com/pclslopes/SimpleCalendarJs
 *
 * Exposed methods (via ref):
 *   const calRef = ref();
 *   calRef.value.setView('week');
 *   calRef.value.navigate(1);
 *   calRef.value.goToDate(new Date());
 *   calRef.value.goToToday();
 *   calRef.value.refresh();
 *   calRef.value.getSelectedDate(); // also setSelectedDate, getSelectedRange, setSelectedRange, clearSelection
 *   calRef.value.getInstance(); // Get raw instance
 *
 * Every SimpleCalendarJs option is a prop (changing one re-creates the calendar),
 * plus :fetchEvents and :darkMode. Events: @eventClick, @slotClick, @viewChange,
 * @navigate (start, end), @dateSelect, @rangeSelect (start, end),
 * @eventDrop (event, oldStart, oldEnd, newStart, newEnd).
 *
 * Example with theme switching:
 *   <script setup>
 *   import { ref } from 'vue';
 *   import SimpleCalendarJsVue from './simple-calendar-js-vue.js';
 *
 *   const isDark = ref(false);
 *   const view = ref('month');
 *
 *   const fetchEvents = async (start, end) => {
 *     // Fetch events...
 *     return events;
 *   };
 *   </script>
 *
 *   <template>
 *     <button @click="isDark = !isDark">Toggle Theme</button>
 *     <SimpleCalendarJsVue
 *       :defaultView="view"
 *       :darkMode="isDark"
 *       :fetchEvents="fetchEvents"
 *     />
 *   </template>
 */

import { ref, onMounted, onUnmounted, watch, defineComponent, h } from 'vue';
import SimpleCalendarJsCore from '../dist/simple-calendar-js.min.js';

// Props that require re-mounting when changed
const INIT_PROPS = [
  'mode',
  'defaultView',
  'defaultDate',
  'weekStartsOn',
  'locale',
  'weekdayFormat',
  'use24Hour',
  'showTimeInItems',
  'showGridLines',
  'showToolbar',
  'showTodayButton',
  'showNavigation',
  'showTitle',
  'showYearPicker',
  'showViewSwitcher',
  'showTooltips',
  'showBorder',
  'listDaysForward',
  'enabledViews',
  'monthTimedEventStyle',
  'monthDayNumberAlign',
  'tooltipBgColor',
  'tooltipTextColor',
  'tooltipMaxWidth',
  'tooltipDelay',
  'tooltipAllowHtml',
  'enableDragDrop',
  'enableResize',
  'autoContrastText',
  'contrastLevel',
  'allowHtmlInEvents',
  'showEventBorder',
];

export default defineComponent({
  name: 'SimpleCalendarJs',

  props: {
    // Init-only props (defaults match the SimpleCalendarJs constructor)
    mode: { type: String, default: 'calendar' },
    defaultView: { type: String, default: 'month' },
    defaultDate: { type: Date, default: null },
    weekStartsOn: { type: Number, default: 0 },
    locale: { type: String, default: 'default' },
    weekdayFormat: { type: String, default: 'short' },
    use24Hour: { type: Boolean, default: false },
    showTimeInItems: { type: Boolean, default: true },
    showGridLines: { type: Boolean, default: true },
    showToolbar: { type: Boolean, default: true },
    showTodayButton: { type: Boolean, default: true },
    showNavigation: { type: Boolean, default: true },
    showTitle: { type: Boolean, default: true },
    showYearPicker: { type: Boolean, default: true },
    showViewSwitcher: { type: Boolean, default: true },
    showTooltips: { type: Boolean, default: true },
    showBorder: { type: Boolean, default: true },
    listDaysForward: { type: Number, default: 30 },
    enabledViews: { type: Array, default: () => ['month', 'week', 'day'] },
    monthTimedEventStyle: { type: String, default: 'list' },
    monthDayNumberAlign: { type: String, default: 'left' },
    tooltipBgColor: { type: String, default: null },
    tooltipTextColor: { type: String, default: null },
    tooltipMaxWidth: { type: Number, default: 250 },
    tooltipDelay: { type: Number, default: 400 },
    tooltipAllowHtml: { type: Boolean, default: true },
    enableDragDrop: { type: Boolean, default: false },
    enableResize: { type: Boolean, default: false },
    autoContrastText: { type: Boolean, default: false },
    contrastLevel: { type: String, default: 'high' },
    allowHtmlInEvents: { type: Boolean, default: true },
    showEventBorder: { type: Boolean, default: false },

    // Callback props
    fetchEvents: { type: Function, default: null },

    // Theme prop
    darkMode: { type: Boolean, default: false },

    // Custom class
    customClass: { type: String, default: '' },
  },

  emits: ['eventClick', 'slotClick', 'viewChange', 'navigate', 'dateSelect', 'rangeSelect', 'eventDrop'],

  setup(props, { emit, expose }) {
    const containerRef = ref(null);
    const instanceRef = ref(null);

    // Helper to resolve SimpleCalendarJs class
    const resolveClass = () => {
      if (typeof SimpleCalendarJs !== 'undefined') return SimpleCalendarJs;
      if (typeof window !== 'undefined' && window.SimpleCalendarJs) return window.SimpleCalendarJs;
      return SimpleCalendarJsCore || null;
    };

    // Create calendar instance
    const createCalendar = () => {
      const Cal = resolveClass();
      if (!Cal) {
        console.error(
          'SimpleCalendarJsVue: SimpleCalendarJs class not found. ' +
            'Make sure simple-calendar-js.js is imported or loaded as a script.'
        );
        return;
      }

      // Destroy previous instance
      if (instanceRef.value) {
        instanceRef.value.destroy();
        instanceRef.value = null;
      }

      // Build options
      const options = {};

      // Add init props
      for (const key of INIT_PROPS) {
        if (props[key] !== undefined) options[key] = props[key];
      }

      // Add callback props with Vue event emitters
      if (props.fetchEvents) {
        options.fetchEvents = props.fetchEvents;
      }
      options.onEventClick = (event) => emit('eventClick', event);
      options.onSlotClick = (date) => emit('slotClick', date);
      options.onViewChange = (view) => emit('viewChange', view);
      options.onNavigate = (start, end) => emit('navigate', start, end);
      options.onDateSelect = (date) => emit('dateSelect', date);
      options.onRangeSelect = (start, end) => emit('rangeSelect', start, end);
      options.onEventDrop = (event, oldStart, oldEnd, newStart, newEnd) =>
        emit('eventDrop', event, oldStart, oldEnd, newStart, newEnd);

      instanceRef.value = new Cal(containerRef.value, options);

      // Apply dark mode if needed
      if (props.darkMode) {
        instanceRef.value._root.classList.add('uc-dark');
      }
    };

    // Mount calendar
    onMounted(() => {
      createCalendar();
    });

    // Cleanup
    onUnmounted(() => {
      instanceRef.value?.destroy();
      instanceRef.value = null;
    });

    // Watch init props for changes (requires re-mount)
    for (const key of INIT_PROPS) {
      watch(
        () => props[key],
        () => {
          createCalendar();
        }
      );
    }

    // Watch dark mode (no re-mount needed)
    watch(
      () => props.darkMode,
      (isDark) => {
        if (instanceRef.value) {
          instanceRef.value._root.classList.toggle('uc-dark', isDark);
        }
      }
    );

    // Watch callback props (update without re-mount)
    watch(
      () => props.fetchEvents,
      (newFn) => {
        if (instanceRef.value && newFn) {
          instanceRef.value._opts.fetchEvents = newFn;
        }
      }
    );

    // Expose methods
    expose({
      setView: (view) => instanceRef.value?.setView(view),
      navigate: (direction) => instanceRef.value?.navigate(direction),
      goToDate: (date) => instanceRef.value?.goToDate(date),
      goToToday: () => instanceRef.value?.goToToday(),
      refresh: () => instanceRef.value?.refresh(),
      getSelectedDate: () => instanceRef.value?.getSelectedDate() ?? null,
      setSelectedDate: (date) => instanceRef.value?.setSelectedDate(date),
      getSelectedRange: () => instanceRef.value?.getSelectedRange() ?? { start: null, end: null },
      setSelectedRange: (start, end) => instanceRef.value?.setSelectedRange(start, end),
      clearSelection: () => instanceRef.value?.clearSelection(),
      getInstance: () => instanceRef.value,
    });

    // Render function
    return () =>
      h('div', {
        ref: containerRef,
        class: props.customClass,
        style: { height: '100%', minHeight: '500px' },
      });
  },
});
