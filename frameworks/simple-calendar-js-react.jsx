/**
 * SimpleCalendarJs v3.0.15 — React Wrapper
 * A clean, modern, and feature-rich JavaScript calendar component with zero dependencies
 *
 * @author Pedro Lopes <simplecalendarjs@gmail.com>
 * @homepage https://www.simplecalendarjs.com
 * @license SEE LICENSE IN LICENSE
 * @repository https://github.com/pclslopes/SimpleCalendarJs
 *
 * Imperative handle (via ref):
 *   const ref = useRef();
 *   // ref.current exposes: { setView, navigate, goToDate, goToToday, refresh }
 *
 * Example with theme switching:
 *   function MyApp() {
 *     const [isDark, setIsDark] = useState(false);
 *     return (
 *       <>
 *         <button onClick={() => setIsDark(!isDark)}>Toggle Theme</button>
 *         <SimpleCalendarJsReact
 *           darkMode={isDark}
 *           defaultView="month"
 *           fetchEvents={fetchEvents}
 *         />
 *       </>
 *     );
 *   }
 */

import { useEffect, useRef, useImperativeHandle, forwardRef, memo } from 'react';

// Callback prop names — these are updated on the instance without re-mounting
const CALLBACK_PROPS = ['fetchEvents', 'onEventClick', 'onSlotClick', 'onViewChange', 'onNavigate'];

// Init-only props — changes require a full re-mount
const INIT_PROPS = [
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
];

const SimpleCalendarJsReact = forwardRef(function SimpleCalendarJsReact(props, ref) {
  const {
    // Layout props
    style,
    className,
    // Theme prop
    darkMode = false,
    // All other props forwarded to SimpleCalendarJs
    ...calProps
  } = props;

  const containerRef = useRef(null);
  const instanceRef = useRef(null);

  // Track init-only props so we can detect if a full re-mount is needed
  const prevInitProps = useRef({});

  // Expose imperative API
  useImperativeHandle(
    ref,
    () => ({
      setView: (v) => instanceRef.current?.setView(v),
      navigate: (d) => instanceRef.current?.navigate(d),
      goToDate: (d) => instanceRef.current?.goToDate(d),
      goToToday: () => instanceRef.current?.goToToday(),
      refresh: () => instanceRef.current?.refresh(),
      getInstance: () => instanceRef.current,
    }),
    []
  );

  // Mount / re-mount when init-only props change
  useEffect(() => {
    const Cal = resolveClass();
    if (!Cal) {
      console.error(
        'SimpleCalendarJsReact: SimpleCalendarJs class not found. ' +
          'Make sure simple-calendar-js.js is imported or loaded as a script.'
      );
      return;
    }

    // Destroy previous instance if any
    if (instanceRef.current) {
      instanceRef.current.destroy();
      instanceRef.current = null;
    }

    // Build options object from props
    const options = {};
    for (const key of [...INIT_PROPS, ...CALLBACK_PROPS]) {
      if (calProps[key] !== undefined) options[key] = calProps[key];
    }

    instanceRef.current = new Cal(containerRef.current, options);
    prevInitProps.current = pickKeys(calProps, INIT_PROPS);

    return () => {
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, INIT_PROPS.map((k) => calProps[k]));

  // Update callbacks live without re-mounting
  useEffect(() => {
    const inst = instanceRef.current;
    if (!inst) return;
    for (const key of CALLBACK_PROPS) {
      if (calProps[key] !== undefined) {
        inst._opts[key] = calProps[key];
      }
    }
  });

  // Update dark mode live without re-mounting
  useEffect(() => {
    const inst = instanceRef.current;
    if (!inst) return;
    inst._root.classList.toggle('uc-dark', darkMode);
  }, [darkMode]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ height: '100%', minHeight: 500, ...style }}
    />
  );
});

SimpleCalendarJsReact.displayName = 'SimpleCalendarJs';

export default memo(SimpleCalendarJsReact);

/* ---- helpers ---- */

function resolveClass() {
  // Works whether SimpleCalendarJs was imported as an ES module
  // or loaded as a UMD script (window.SimpleCalendarJs).
  if (typeof SimpleCalendarJs !== 'undefined') return SimpleCalendarJs; // eslint-disable-line no-undef
  if (typeof window !== 'undefined' && window.SimpleCalendarJs) return window.SimpleCalendarJs;
  return null;
}

function pickKeys(obj, keys) {
  const out = {};
  for (const k of keys) if (k in obj) out[k] = obj[k];
  return out;
}
