/**
 * SimpleCalendarJs v3.0.16 — Angular Wrapper
 * A clean, modern, and feature-rich JavaScript calendar component with zero dependencies
 *
 * @author Pedro Lopes <simplecalendarjs@gmail.com>
 * @homepage https://www.simplecalendarjs.com
 * @license SEE LICENSE IN LICENSE
 * @repository https://github.com/pclslopes/SimpleCalendarJs
 *
 * Setup:
 *   1. npm install simple-calendar-js
 *   2. Copy this file into your project (Angular CLI doesn't compile TypeScript
 *      from node_modules), e.g. src/app/simple-calendar-js-angular.component.ts
 *   3. The package has no TypeScript types yet: add `declare module 'simple-calendar-js';`
 *      to a .d.ts file (e.g. src/simple-calendar-js.d.ts)
 *   4. Add "node_modules/simple-calendar-js/dist/simple-calendar-js.min.css" to
 *      "styles" in angular.json
 *
 * Usage (standalone):
 *   @Component({
 *     selector: 'app-root',
 *     standalone: true,
 *     imports: [SimpleCalendarJsComponent],
 *     template: `
 *       <simple-calendar-js
 *         [defaultView]="'month'"
 *         [weekStartsOn]="1"
 *         [darkMode]="isDark"
 *         [fetchEvents]="fetchEvents"
 *         (eventClick)="onEventClick($event)"
 *         (slotClick)="onSlotClick($event)"
 *         (navigated)="onNavigated($event)"
 *         [customStyle]="{ height: '600px' }"
 *       ></simple-calendar-js>
 *     `
 *   })
 *
 * Every SimpleCalendarJs option is an @Input; callbacks are @Outputs:
 *   (eventClick) event · (slotClick) Date · (viewChange) view · (navigated) { start, end }
 *   (dateSelect) Date · (rangeSelect) { start, end } · (eventDrop) { event, oldStart, oldEnd, newStart, newEnd }
 * fetchEvents is an @Input (it must return the events).
 *
 * Methods via ViewChild:
 *   @ViewChild(SimpleCalendarJsComponent) calendar!: SimpleCalendarJsComponent;
 *   this.calendar.setView('week'); this.calendar.navigate(1); this.calendar.goToToday();
 *   this.calendar.goToDate(date); this.calendar.refresh(); this.calendar.getSelectedDate(); …
 */

import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { NgStyle } from '@angular/common';
import SimpleCalendarJs from 'simple-calendar-js';

// Inputs passed to the calendar as options; changing one re-creates the calendar.
const OPTION_INPUTS = [
  'mode',
  'defaultView',
  'defaultDate',
  'weekStartsOn',
  'locale',
  'weekdayFormat',
  'use24Hour',
  'showTimeInItems',
  'showGridLines',
  'monthTimedEventStyle',
  'monthDayNumberAlign',
  'showToolbar',
  'showTodayButton',
  'showNavigation',
  'showTitle',
  'showYearPicker',
  'showViewSwitcher',
  'showTooltips',
  'tooltipBgColor',
  'tooltipTextColor',
  'tooltipMaxWidth',
  'tooltipDelay',
  'tooltipAllowHtml',
  'showBorder',
  'listDaysForward',
  'enabledViews',
  'enableDragDrop',
  'enableResize',
  'autoContrastText',
  'contrastLevel',
  'allowHtmlInEvents',
  'showEventBorder',
] as const;

@Component({
  selector: 'simple-calendar-js',
  standalone: true,
  imports: [NgStyle],
  template: `
    <div
      #calendarContainer
      [class]="customClass"
      [ngStyle]="customStyle || { height: '100%', minHeight: '500px' }"
    ></div>
  `,
})
export class SimpleCalendarJsComponent implements OnChanges, AfterViewInit, OnDestroy {
  @ViewChild('calendarContainer', { static: true }) containerEl!: ElementRef<HTMLDivElement>;

  // Options (same names and defaults as the SimpleCalendarJs constructor)
  @Input() mode: 'calendar' | 'date-picker' | 'range-picker' = 'calendar';
  @Input() defaultView: 'month' | 'week' | 'day' | 'list' = 'month';
  @Input() defaultDate?: Date;
  @Input() weekStartsOn = 0;
  @Input() locale = 'default';
  @Input() weekdayFormat: 'narrow' | 'short' | 'long' = 'short';
  @Input() use24Hour = false;
  @Input() showTimeInItems = true;
  @Input() showGridLines = true;
  @Input() monthTimedEventStyle: 'list' | 'block' = 'list';
  @Input() monthDayNumberAlign: 'left' | 'center' | 'right' = 'left';
  @Input() showToolbar = true;
  @Input() showTodayButton = true;
  @Input() showNavigation = true;
  @Input() showTitle = true;
  @Input() showYearPicker = true;
  @Input() showViewSwitcher = true;
  @Input() showTooltips = true;
  @Input() tooltipBgColor: string | null = null;
  @Input() tooltipTextColor: string | null = null;
  @Input() tooltipMaxWidth = 250;
  @Input() tooltipDelay = 400;
  @Input() tooltipAllowHtml = true;
  @Input() showBorder = true;
  @Input() listDaysForward = 30;
  @Input() enabledViews: string[] = ['month', 'week', 'day'];
  @Input() enableDragDrop = false;
  @Input() enableResize = false;
  @Input() autoContrastText = false;
  @Input() contrastLevel: 'high' | 'medium' | 'low' = 'high';
  @Input() allowHtmlInEvents = true;
  @Input() showEventBorder = false;

  // Events come from this function (updated without re-creating the calendar)
  @Input() fetchEvents?: (start: Date, end: Date) => Promise<any[]>;

  // Theme and wrapper styling
  @Input() darkMode = false;
  @Input() customClass = '';
  @Input() customStyle?: { [key: string]: string };

  @Output() eventClick = new EventEmitter<any>();
  @Output() slotClick = new EventEmitter<Date>();
  @Output() viewChange = new EventEmitter<string>();
  @Output() navigated = new EventEmitter<{ start: Date; end: Date }>();
  @Output() dateSelect = new EventEmitter<Date>();
  @Output() rangeSelect = new EventEmitter<{ start: Date; end: Date }>();
  @Output() eventDrop = new EventEmitter<{ event: any; oldStart: Date; oldEnd: Date; newStart: Date; newEnd: Date }>();

  private calendar: any = null;
  private isViewInitialized = false;

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

    if (OPTION_INPUTS.some((name) => changes[name] && !changes[name].firstChange)) {
      this.createCalendar();
      return;
    }
    if (changes['darkMode']) this.applyTheme();
    if (changes['fetchEvents'] && this.calendar) {
      this.calendar._opts.fetchEvents = this.fetchEvents;
      this.calendar.refresh();
    }
  }

  private createCalendar() {
    this.calendar?.destroy();

    const options: any = {};
    for (const name of OPTION_INPUTS) {
      if (this[name] !== undefined) options[name] = this[name];
    }
    if (this.fetchEvents) options.fetchEvents = this.fetchEvents;
    options.onEventClick = (event: any) => this.eventClick.emit(event);
    options.onSlotClick = (date: Date) => this.slotClick.emit(date);
    options.onViewChange = (view: string) => this.viewChange.emit(view);
    options.onNavigate = (start: Date, end: Date) => this.navigated.emit({ start, end });
    options.onDateSelect = (date: Date) => this.dateSelect.emit(date);
    options.onRangeSelect = (start: Date, end: Date) => this.rangeSelect.emit({ start, end });
    options.onEventDrop = (event: any, oldStart: Date, oldEnd: Date, newStart: Date, newEnd: Date) =>
      this.eventDrop.emit({ event, oldStart, oldEnd, newStart, newEnd });

    this.calendar = new SimpleCalendarJs(this.containerEl.nativeElement, options);
    this.applyTheme();
  }

  private applyTheme() {
    this.containerEl.nativeElement.classList.toggle('uc-dark', this.darkMode);
  }

  // Methods (same as the SimpleCalendarJs instance)
  public setView(view: 'month' | 'week' | 'day' | 'list'): void {
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

  public refresh(): void {
    this.calendar?.refresh();
  }

  public getSelectedDate(): Date | null {
    return this.calendar?.getSelectedDate() ?? null;
  }

  public setSelectedDate(date: Date | null): void {
    this.calendar?.setSelectedDate(date);
  }

  public getSelectedRange(): { start: Date | null; end: Date | null } {
    return this.calendar?.getSelectedRange() ?? { start: null, end: null };
  }

  public setSelectedRange(start: Date | null, end: Date | null = null): void {
    this.calendar?.setSelectedRange(start, end);
  }

  public clearSelection(): void {
    this.calendar?.clearSelection();
  }

  public getInstance(): any {
    return this.calendar;
  }
}
