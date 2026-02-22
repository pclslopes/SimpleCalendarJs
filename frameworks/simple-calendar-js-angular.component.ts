/**
 * SimpleCalendarJs v3.0.3 — Angular Wrapper
 * A clean, modern, and feature-rich JavaScript calendar component with zero dependencies
 *
 * @author Pedro Lopes <simplecalendarjs@gmail.com>
 * @homepage https://www.simplecalendarjs.com
 * @license SEE LICENSE IN LICENSE
 * @repository https://github.com/pclslopes/SimpleCalendarJs
 *
 * Usage (Standalone Component):
 *   import { SimpleCalendarJsComponent } from './simple-calendar-js-angular.component';
 *
 *   @Component({
 *     selector: 'app-root',
 *     standalone: true,
 *     imports: [SimpleCalendarJsComponent],
 *     template: `
 *       <simple-calendar-js
 *         [defaultView]="view"
 *         [weekStartsOn]="1"
 *         [darkMode]="isDark"
 *         [fetchEvents]="fetchEvents"
 *         (eventClick)="onEventClick($event)"
 *         (slotClick)="onSlotClick($event)"
 *         (viewChange)="onViewChange($event)"
 *         (navigate)="onNavigate($event)"
 *         [customClass]="'my-calendar'"
 *         [customStyle]="{ height: '600px' }"
 *       ></simple-calendar-js>
 *     `
 *   })
 *
 * Usage (NgModule):
 *   import { SimpleCalendarJsComponent } from './simple-calendar-js-angular.component';
 *
 *   @NgModule({
 *     declarations: [SimpleCalendarJsComponent],
 *     exports: [SimpleCalendarJsComponent]
 *   })
 *
 * All options accepted by `new SimpleCalendarJs()` are valid @Input properties.
 * Callbacks use Angular @Output events.
 * The darkMode input toggles dark theme without re-creating the calendar.
 *
 * Accessing methods via ViewChild:
 *   @ViewChild(SimpleCalendarJsComponent) calendar!: SimpleCalendarJsComponent;
 *
 *   ngAfterViewInit() {
 *     this.calendar.setView('week');
 *     this.calendar.navigate(1);
 *     this.calendar.goToDate(new Date());
 *     this.calendar.goToToday();
 *   }
 *
 * Example with theme switching:
 *   @Component({
 *     selector: 'app-calendar-demo',
 *     standalone: true,
 *     imports: [SimpleCalendarJsComponent],
 *     template: `
 *       <button (click)="isDark = !isDark">Toggle Theme</button>
 *       <simple-calendar-js
 *         [defaultView]="view"
 *         [darkMode]="isDark"
 *         [fetchEvents]="fetchEvents"
 *         (eventClick)="handleEventClick($event)"
 *       ></simple-calendar-js>
 *     `
 *   })
 *   export class CalendarDemoComponent {
 *     isDark = false;
 *     view = 'month';
 *
 *     fetchEvents = async (start: Date, end: Date) => {
 *       // Fetch events...
 *       return events;
 *     };
 *
 *     handleEventClick(event: any) {
 *       console.log('Event clicked:', event);
 *     }
 *   }
 */

import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';

// Declare global SimpleCalendarJs
declare global {
  interface Window {
    SimpleCalendarJs: any;
  }
  const SimpleCalendarJs: any;
}

// Props that require re-creating the calendar when changed
const INIT_PROPS = [
  'defaultView',
  'defaultDate',
  'weekStartsOn',
  'locale',
  'use24Hour',
  'showTimeInItems',
  'showGridLines',
  'showToolbar',
  'showTodayButton',
  'showNavigation',
  'showTitle',
  'showYearPicker',
  'showViewSwitcher',
  'enabledViews',
];

@Component({
  selector: 'simple-calendar-js',
  standalone: true,
  template: `
    <div
      #calendarContainer
      [class]="customClass"
      [ngStyle]="customStyle || { height: '100%', minHeight: '500px' }"
    ></div>
  `,
  styles: [],
})
export class SimpleCalendarJsComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @ViewChild('calendarContainer', { static: true }) containerEl!: ElementRef;

  // Init-only inputs
  @Input() defaultView: 'month' | 'week' | 'day' = 'month';
  @Input() defaultDate?: Date;
  @Input() weekStartsOn: 0 | 1 = 0;
  @Input() locale: string = 'default';
  @Input() use24Hour: boolean = false;
  @Input() showTimeInItems: boolean = true;
  @Input() showGridLines: boolean = true;
  @Input() showToolbar: boolean = true;
  @Input() showTodayButton: boolean = true;
  @Input() showNavigation: boolean = true;
  @Input() showTitle: boolean = true;
  @Input() showYearPicker: boolean = true;
  @Input() showViewSwitcher: boolean = true;
  @Input() enabledViews: string[] = ['month', 'week', 'day'];

  // Callback inputs
  @Input() fetchEvents?: (start: Date, end: Date) => Promise<any[]>;

  // Theme input
  @Input() darkMode: boolean = false;

  // Style inputs
  @Input() customClass: string = '';
  @Input() customStyle?: { [key: string]: string };

  // Output events
  @Output() eventClick = new EventEmitter<any>();
  @Output() slotClick = new EventEmitter<Date>();
  @Output() viewChange = new EventEmitter<string>();
  @Output() navigate = new EventEmitter<{ start: Date; end: Date }>();

  private calendar: any = null;
  private isViewInitialized = false;

  ngOnInit() {
    // Calendar will be created in ngAfterViewInit
  }

  ngAfterViewInit() {
    this.isViewInitialized = true;
    this.createCalendar();
  }

  ngOnDestroy() {
    this.calendar?.destroy();
    this.calendar = null;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.isViewInitialized) return;

    // Check if any init prop changed (requires re-creation)
    const initPropChanged = INIT_PROPS.some((prop) => changes[prop] && !changes[prop].firstChange);

    if (initPropChanged) {
      this.createCalendar();
      return;
    }

    // Handle dark mode change without re-creation
    if (changes['darkMode'] && !changes['darkMode'].firstChange) {
      if (this.calendar) {
        this.calendar._root.classList.toggle('uc-dark', this.darkMode);
      }
    }

    // Handle fetchEvents change without re-creation
    if (changes['fetchEvents'] && !changes['fetchEvents'].firstChange) {
      if (this.calendar && this.fetchEvents) {
        this.calendar._opts.fetchEvents = this.fetchEvents;
      }
    }
  }

  private resolveClass(): any {
    if (typeof SimpleCalendarJs !== 'undefined') return SimpleCalendarJs;
    if (typeof window !== 'undefined' && window.SimpleCalendarJs) return window.SimpleCalendarJs;
    return null;
  }

  private createCalendar() {
    const Cal = this.resolveClass();
    if (!Cal) {
      console.error(
        'SimpleCalendarJsComponent: SimpleCalendarJs class not found. ' +
          'Make sure simple-calendar-js.js is imported or loaded as a script.'
      );
      return;
    }

    // Destroy previous instance
    if (this.calendar) {
      this.calendar.destroy();
      this.calendar = null;
    }

    // Build options
    const options: any = {
      defaultView: this.defaultView,
      defaultDate: this.defaultDate,
      weekStartsOn: this.weekStartsOn,
      locale: this.locale,
      use24Hour: this.use24Hour,
      showTimeInItems: this.showTimeInItems,
      showGridLines: this.showGridLines,
      showToolbar: this.showToolbar,
      showTodayButton: this.showTodayButton,
      showNavigation: this.showNavigation,
      showTitle: this.showTitle,
      showYearPicker: this.showYearPicker,
      showViewSwitcher: this.showViewSwitcher,
      enabledViews: this.enabledViews,
    };

    // Add callbacks
    if (this.fetchEvents) {
      options.fetchEvents = this.fetchEvents;
    }
    options.onEventClick = (event: any) => this.eventClick.emit(event);
    options.onSlotClick = (date: Date) => this.slotClick.emit(date);
    options.onViewChange = (view: string) => this.viewChange.emit(view);
    options.onNavigate = (start: Date, end: Date) => this.navigate.emit({ start, end });

    this.calendar = new Cal(this.containerEl.nativeElement, options);

    // Apply dark mode if needed
    if (this.darkMode) {
      this.calendar._root.classList.add('uc-dark');
    }
  }

  // Public methods
  public setView(view: 'month' | 'week' | 'day'): void {
    this.calendar?.setView(view);
  }

  public navigate(direction: number): void {
    this.calendar?.navigate(direction);
  }

  public goToDate(date: Date): void {
    this.calendar?.goToDate(date);
  }

  public goToToday(): void {
    this.calendar?.goToToday();
  }

  public getInstance(): any {
    return this.calendar;
  }
}
