/**
 * SimpleCalendarJs - Pure JavaScript Calendar Component
 * No jQuery dependency - uses native DOM APIs
 * 
 * @author Pedro Lopes
 * @license Free for Personal and Non-Commercial Use
 *          Commercial license required for commercial use
 *          See https://www.simplecalendarjs.com for licensing details
 */

// Template for calendar rendering
const template = `{{ 
    var date = date || new Date(),
        month = date.getMonth(),
        year = date.getFullYear(),
        first = new Date(year, month, 1),
        last = new Date(year, month + 1, 0),
        startingDay = first.getDay(),
        thedate = new Date(year, month, 1 - startingDay),
        dayclass = lastmonthcss,
        today = new Date(),
        i, j;
    if (mode === 'week') {
      thedate = new Date(date);
      thedate.setDate(date.getDate() - date.getDay());
      first = new Date(thedate);
      last = new Date(thedate);
      last.setDate(last.getDate()+6);
    } else if (mode === 'day') {
      thedate = new Date(date);
      first = new Date(thedate);
      last = new Date(thedate);
      last.setDate(thedate.getDate() + 1);
    }

    }}
    <table class="calendar-table">
      <thead>
        <tr>
          <td colspan="7" style="text-align: center">
            <table style="white-space: nowrap; width: 100%">
              <tr>
                <td style="text-align: left;">
                  {{ if (showNavigation) { }}
                  <span class="cal-nav-group">
                    <button class="js-cal-prev cal-nav-button">←</button>
                    <button class="js-cal-next cal-nav-button">→</button>
                  </span>
                  {{ } }}
                  {{ if (showTodayButton) { }}
                  <button class="js-cal-option cal-nav-button button btn-today {{: first.toDateInt() <= today.toDateInt() && today.toDateInt() <= last.toDateInt() ? 'cal-nav-primary':'' }}" data-date="{{: today.toISOString()}}" data-mode="month">{{: todayname }}</button>
                  {{ } }}
                </td>
                <td {{ if (!showModeButtons) { }}style="text-align: right; padding-right: 0;"{{ } }}>
                  {{ if (showMonthYear) { }}
                  <span class="cal-nav-group">
                    {{ if (mode !== 'day') { }}
                      {{ if (mode === 'month') { }}
                        <div class="month-dropdown-container">
                          <span class="js-cal-month-dropdown cal-nav-button button cal-nav-primary">{{: months[month] }} ▼</span>
                          <div class="month-dropdown-menu">
                            {{ for (var i = 0; i < 12; i++) { }}
                              <div class="month-dropdown-item {{: i === month ? 'active' : '' }}" data-date="{{: new Date(year, i, 1).toISOString() }}" data-mode="month">{{: months[i] }}</div>
                            {{ } }}
                          </div>
                        </div>
                        <div class="year-dropdown-container">
                          <span class="js-cal-year-dropdown cal-nav-button cal-nav-primary">{{: year }} ▼</span>
                          <div class="year-dropdown-menu">
                            <div class="year-nav-buttons">
                              <button class="year-nav-prev cal-nav-button">←</button>
                              <button class="year-nav-next cal-nav-button">→</button>
                            </div>
                          </div>
                        </div>
                      {{ } }}
                      {{ if (mode ==='week') { }}
                        <span class="cal-nav-button cal-nav-primary">{{: shortMonths[first.getMonth()] }} {{: first.getDate() }} - {{: shortMonths[last.getMonth()] }} {{: last.getDate() }}</span>
                      {{ } }}
                    {{ } else { }}
                      <span class="cal-nav-button cal-nav-primary">{{: date.toDateString() }}</span>
                    {{ } }}
                  </span>
                  {{ } }}
                </td>
                <td style="text-align: right">
                  {{ if (showModeButtons) { }}
                  <!-- Desktop view switcher -->
                  <span class="cal-nav-group desktop-view-switcher">
                    <button class="js-cal-option cal-nav-button button {{: mode==='month'? 'active cal-nav-primary':'' }}" data-mode="month">{{: monthText }}</button>
                    <button class="js-cal-option cal-nav-button button {{: mode==='week'? 'active cal-nav-primary':'' }}" data-mode="week">{{: weekText }}</button>
                    <button class="js-cal-option cal-nav-button button {{: mode==='day'? 'active cal-nav-primary':'' }}" data-mode="day">{{: dayText }}</button>
                  </span>
                  
                  <!-- Mobile hamburger menu -->
                  <div class="mobile-view-switcher">
                    <div class="view-dropdown-container">
                      <span class="js-cal-view-dropdown cal-nav-button cal-nav-primary">{{: mode === 'month' ? monthText : mode === 'week' ? weekText : dayText }} ≡</span>
                      <div class="view-dropdown-menu">
                        <div class="view-dropdown-item js-cal-option {{: mode==='month'? 'active':'' }}" data-mode="month">{{: monthText }}</div>
                        <div class="view-dropdown-item js-cal-option {{: mode==='week'? 'active':'' }}" data-mode="week">{{: weekText }}</div>
                        <div class="view-dropdown-item js-cal-option {{: mode==='day'? 'active':'' }}" data-mode="day">{{: dayText }}</div>
                      </div>
                    </div>
                  </div>
                  {{ } }}
                </td>
              </tr>
            </table>

          </td>
        </tr>
      </thead>
      {{ if (mode ==='year') { }}
        <tbody>
          <tr>
            <td colspan="7" style="text-align: center; padding: 40px;">
              <p>Use the month dropdown in the header to select a month, then switch to Month view.</p>
            </td>
          </tr>
        </tbody>
      {{ } }}
      {{ if (mode ==='month' || mode ==='week') { }}
      <thead>
        <tr class="c-weeks">
          {{ for (i = 0; i < 7; i++) { }}
            <th class="c-name">
              {{ if (useShortDays) { }}
                {{: shortDays[i] }}
              {{ } else { }}
                <span class="day-long">{{: days[i] }}</span>
                <span class="day-short">{{: shortDays[i] }}</span>
              {{ } }}
            </th>
          {{ } }}
        </tr>
      </thead>
      <tbody>
        {{ for (j = 0; j < 6 && (j < 1 || mode === 'month'); j++) { }}
        <tr>
          {{ for (i = 0; i < 7; i++) { }}
          {{ console.log(date.toDateCssClass());}}
          {{ if (thedate > last) { dayclass = nextmonthcss; } else if (thedate >= first) { dayclass = thismonthcss; } }}
          <td class="calendar-day {{: dayclass }} {{: thedate.toDateCssClass() }} {{: today.toDateCssClass() === thedate.toDateCssClass() ? 'currentdate today-date':'' }} {{: daycss[i] }} js-cal-option add-day" data-date="{{: thedate.toISOString() }}">
            <div class="date">{{: thedate.getDate() }}</div>
            {{ thedate.setDate(thedate.getDate() + 1);}}

          </td>
          {{ } }}
        </tr>
        {{ } }}
      </tbody>
      {{ } }}
      {{ if (mode ==='day') { }}
      <tbody>
        <tr>
          <td colspan="7">
            <table class="calendar-events-table"  >
              <thead>
                <tr>
                  <th> </th>
                  <th style="text-align: center; width: 100%">{{: days[date.getDay()] }}</th>
                </tr>
              </thead>
              <tbody>
                {{ if(showDayAsAllDayEvents) {}}
                    <tr>
                      <th class="timetitle" >Events</th>
                      <td class="js-cal-option time-all-day add-day {{: date.toDateCssClass() }}" data-date="{{: date.toISOString() }}"> </td>
                    </tr>
                {{ } }}
                {{ if(!showDayAsAllDayEvents) {}}
                    <tr>
                        <th class="timetitle" >All Day</th>
                        <td class="js-cal-option add-day {{: date.toDateCssClass() }}" data-date="{{: date.toISOString() }}"> </td>
                    </tr>
                    <tr>
                      <th class="timetitle" >Before 6 AM</th>
                      <td class="js-cal-option time-0-0" data-date="{{: date.toISOString() }}"> </td>
                    </tr>
                    {{for (i = 6; i < 22; i++) { }}
                        <tr>
                          <th class="timetitle" >{{: i <= 12 ? i : i - 12 }} {{: i < 12 ? "AM" : "PM"}}</th>
                          <td class="js-cal-option add-day time-{{: i}}-0" data-date="{{: date.toISOString() }}"> </td>
                        </tr>
                        <tr>
                          <th class="timetitle" >{{: i <= 12 ? i : i - 12 }}:30 {{: i < 12 ? "AM" : "PM"}}</th>
                          <td class="js-cal-option add-day time-{{: i}}-30" data-date="{{: date.toISOString() }}"> </td>
                        </tr>
                    {{ } }}
                    <tr>
                      <th class="timetitle" >After 10 PM</th>
                      <td class="js-cal-option add-day time-22-0" data-date="{{: date.toISOString() }}"> </td>
                    </tr>
                {{ } }}
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
      {{ } }}
    </table>`;

// Utility functions for DOM manipulation
const Dom = {
    // Select single element
    select: (selector, context = document) => {
        if (!context) {
            console.error('Dom.select: context is null or undefined', { selector, context });
            return null;
        }
        return context.querySelector(selector);
    },
    
    // Select multiple elements
    selectAll: (selector, context = document) => {
        if (!context) {
            console.error('Dom.selectAll: context is null or undefined', { selector, context });
            return [];
        }
        return Array.from(context.querySelectorAll(selector));
    },
    
    // Create element
    create: (tag, attributes = {}, content = '') => {
        const element = document.createElement(tag);
        Object.keys(attributes).forEach(key => {
            if (key === 'class') {
                element.className = attributes[key];
            } else if (key === 'data') {
                Object.keys(attributes[key]).forEach(dataKey => {
                    element.dataset[dataKey] = attributes[key][dataKey];
                });
            } else {
                element.setAttribute(key, attributes[key]);
            }
        });
        if (content) {
            element.innerHTML = content;
        }
        return element;
    },
    
    // Add event listener with delegation support
    on: (element, event, selector, handler) => {
        if (typeof selector === 'function') {
            // Direct event binding
            handler = selector;
            element.addEventListener(event, handler);
        } else {
            // Event delegation
            element.addEventListener(event, (e) => {
                if (e.target.matches(selector) || e.target.closest(selector)) {
                    const target = e.target.matches(selector) ? e.target : e.target.closest(selector);
                    handler.call(target, e);
                }
            });
        }
    },
    
    // Remove event listeners
    off: (element, event, handler) => {
        element.removeEventListener(event, handler);
    },
    
    // Show/hide elements
    show: (element) => {
        element.style.display = 'block';
    },
    
    hide: (element) => {
        element.style.display = 'none';
    },
    
    // Check if element is visible
    isVisible: (element) => {
        return element.style.display !== 'none' && 
               window.getComputedStyle(element).display !== 'none';
    },
    
    // Extend objects (like jQuery.extend)
    extend: (...objects) => {
        return Object.assign({}, ...objects);
    }
};

// Template engine (simplified version of quicktmpl)
const Template = {
    compile: (template) => {
        return new Function("obj", 
            "var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('" + 
            template
                .replace(/[\r\t\n]/g, " ")
                .split("{{").join("\t")
                .replace(/((^|\}\})[^\t]*)'/g, "$1\r")
                .replace(/\t:(.*?)\}\}/g, "',$1,'")
                .split("\t").join("');")
                .split("}}").join("p.push('")
                .split("\r").join("\\'") + 
            "');}return p.join('');"
        );
    }
};

// Date prototype extensions
Date.prototype.toDateCssClass = function() {
    return '_' + this.getFullYear() + '_' + (this.getMonth() + 1) + '_' + this.getDate();
};

Date.prototype.toDateInt = function() {
    return ((this.getFullYear() * 12) + this.getMonth()) * 32 + this.getDate();
};

Date.prototype.toTimeString = function() {
    const hours = this.getHours();
    const minutes = this.getMinutes();
    const hour = (hours > 12) ? (hours - 12) : hours;
    const ampm = (hours >= 12) ? ' pm' : ' am';
    if (hours === 0 && minutes === 0) { return ''; }
    if (minutes > 0) {
        return hour + ':' + minutes + ampm;
    }
    return hour + ampm;
};

// Main SimpleCalendar class
class SimpleCalendar {
    constructor(selector, options = {}) {
        this.element = typeof selector === 'string' ? Dom.select(selector) : selector;
        if (!this.element) {
            throw new Error('Calendar element not found');
        }
        
        // Default options
        this.defaults = {
            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            date: new Date(),
            daycss: ["c-sunday", "", "", "", "", "", "c-saturday"],
            todayname: "Today",
            monthText: "Month",
            weekText: "Week", 
            dayText: "Day",
            thismonthcss: "current",
            lastmonthcss: "outside",
            nextmonthcss: "outside",
            mode: "month",
            useShortDays: false,
            showTimeInEvent: true,
            showBackground: false,
            showDayAsAllDayEvents: false,
            eventBorder: false,
            showTodayButton: true,
            showMonthYear: true,
            showModeButtons: true,
            showNavigation: true,
            theme: 'auto', // 'auto', 'light', 'dark'
            data: [],
            events: null,
            dayClick: null,
            eventClick: null,
            stateChange: null
        };
        
        this.options = Dom.extend(this.defaults, options);
        this.template = Template.compile(template);
        this.eventHandlers = [];
        this.documentHandlers = [];
        
        this.init();
    }
    
    applyTheme() {
        if (!this.element) return;
        
        // If theme is set to 'light' or 'dark', force that theme
        if (this.options.theme === 'light') {
            this.element.removeAttribute('data-bs-theme');
        } else if (this.options.theme === 'dark') {
            this.element.setAttribute('data-bs-theme', 'dark');
        }
        // If theme is 'auto', don't interfere with existing theme detection
        // The original CSS will work with the document's theme automatically
    }
    
    init() {
        console.log('Options: ' + JSON.stringify(this.options));
        const dateCopy = new Date('' + this.options.date);
        const defaultDate = new Date(this.options.date);
        const startDate = defaultDate.setMonth(defaultDate.getMonth() - 1);
        const endDate = defaultDate.setMonth(defaultDate.getMonth() + 3);
        console.log('Current Date: ' + new Date(this.options.date));
        console.log('Date Range Init: ' + new Date(startDate) + ' > ' + new Date(endDate));
        
        if (this.options.events) {
            this.options.events({ defaultDate: new Date(dateCopy), start: new Date(startDate), end: new Date(endDate) }, this.eventCallback.bind(this));
        }
        
        this.setupEventHandlers();
        this.draw();
    }
    
    setupEventHandlers() {
        // Previous button
        Dom.on(this.element, 'click', '.js-cal-prev', (e) => {
            if (this.destroyed || !this.options) return;
            
            this.closeDropdowns();
            this.options.keepYearDropdownOpen = false;
            
            switch (this.options.mode) {
                case 'year': this.options.date.setFullYear(this.options.date.getFullYear() - 1); break;
                case 'month': this.options.date.setMonth(this.options.date.getMonth() - 1); break;
                case 'week': this.options.date.setDate(this.options.date.getDate() - 7); break;
                case 'day': this.options.date.setDate(this.options.date.getDate() - 1); break;
            }
            this.fetchEvents();
        });
        
        // Next button
        Dom.on(this.element, 'click', '.js-cal-next', (e) => {
            if (this.destroyed || !this.options) return;
            
            this.closeDropdowns();
            this.options.keepYearDropdownOpen = false;
            
            switch (this.options.mode) {
                case 'year': this.options.date.setFullYear(this.options.date.getFullYear() + 1); break;
                case 'month': this.options.date.setMonth(this.options.date.getMonth() + 1); break;
                case 'week': this.options.date.setDate(this.options.date.getDate() + 7); break;
                case 'day': this.options.date.setDate(this.options.date.getDate() + 1); break;
            }
            this.fetchEvents();
        });
        
        // Calendar option clicks (mode buttons, today button, day clicks)
        Dom.on(this.element, 'click', '.js-cal-option', (e) => {
            // Check if this instance has been destroyed
            if (this.destroyed || !this.options) {
                return;
            }
            
            // Skip view dropdown items - they have their own handler
            if (e.target.closest('.view-dropdown-item')) {
                return;
            }
            
            // Skip month/year dropdown buttons - they have their own handlers
            if (e.target.matches('.js-cal-month-dropdown') || e.target.matches('.js-cal-year-dropdown')) {
                return;
            }
            
            console.log('js-cal-option clicked:', e.target, 'dataset:', e.target.dataset);
            
            this.closeDropdowns();
            
            this.options.keepYearDropdownOpen = false;
            
            const dateParam = { monthDate: this.options.date };
            const target = e.target.closest('.js-cal-option');
            const data = target.dataset;
            
            console.log('target:', target, 'target.dataset:', data);
            
            // Handle date separately to ensure it's a proper Date object
            if (data.date) { 
                this.options.date = new Date(data.date); 
            }
            
            // Handle mode separately  
            if (data.mode) {
                this.options.mode = data.mode;
            }
            
            console.log('Updated options:', this.options.mode, 'date:', this.options.date);
            
            this.triggerStateChange();
            
            // Ensure dateClick is always set for calendar days
            if (data.date) {
                dateParam.dateClick = data.date;
            } else if (target.matches('.calendar-day') || target.closest('.calendar-day')) {
                const calendarDay = target.matches('.calendar-day') ? target : target.closest('.calendar-day');
                const dayData = calendarDay.dataset;
                if (dayData.date) {
                    dateParam.dateClick = new Date(dayData.date);
                }
            }
            
            // Handle different types of clicks
            console.log('Processing click - conditions:', {
                isCalendarDay: target.matches('.calendar-day'),
                isAddDay: target.matches('.add-day'),
                isCalendarMonth: target.matches('.calendar-month'),
                isTodayBtn: target.matches('.btn-today'),
                hasMode: !!data.mode,
                isButton: target.matches('.button'),
                mode: data.mode
            });
            
            if (target.matches('.calendar-day') || target.matches('.add-day')) {
                // Day clicks are now handled by the dedicated .calendar-day handler
                console.log('Skipping - calendar day click');
            } else if (target.matches('.calendar-month')) {
                // Month select on year view only
                console.log('Calling fetchEvents for month select');
                this.fetchEvents();
            } else if (data.mode || target.matches('.button') || target.matches('.btn-today')) {
                // Mode buttons (month/week/day) or other navigation buttons
                console.log('Calling draw for mode/button click');
                this.draw();
            } else {
                console.log('No action taken for this click');
            }
        });
        
        // View dropdown items
        Dom.on(this.element, 'click', '.view-dropdown-item', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const target = e.target;
            const data = target.dataset;
            if (data.mode) {
                Dom.extend(this.options, data);
                this.draw();
            }
            
            this.hideElement('.view-dropdown-menu');
            return false;
        });
        
        // Event clicks
        Dom.on(this.element, 'click', '.event', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const eventData = JSON.parse(e.target.dataset.json || '{}');
            const eventObj = { event: eventData, monthDate: this.options.date };
            if (this.options.eventClick) {
                this.options.eventClick(eventObj);
            }
            return false;
        });
        
        // Direct day clicks - separate handler for calendar days
        Dom.on(this.element, 'click', '.calendar-day', (e) => {
            // Only trigger if we didn't click on an event
            if (!e.target.matches('.event') && !e.target.closest('.event')) {
                const calendarDay = e.target.matches('.calendar-day') ? e.target : e.target.closest('.calendar-day');
                const dayData = calendarDay.dataset;
                if (dayData.date && this.options.dayClick) {
                    const dateParam = { 
                        monthDate: this.options.date,
                        dateClick: new Date(dayData.date)
                    };
                    this.options.dayClick(dateParam);
                }
            }
        });
        
        // Day view time slot clicks - handle specific time slots in day view
        Dom.on(this.element, 'click', '.add-day', (e) => {
            if (this.destroyed || !this.options) return;
            
            // Only trigger if we didn't click on an event and we're in day view
            if (!e.target.matches('.event') && !e.target.closest('.event') && this.options.mode === 'day') {
                const target = e.target;
                const targetData = target.dataset;
                
                if (targetData.date && this.options.dayClick) {
                    // Extract time from CSS classes (e.g., "time-9-30" means 9:30)
                    const timeMatch = target.className.match(/time-(\d+)-(\d+)|time-all-day/);
                    let clickedDate = new Date(targetData.date);
                    
                    if (timeMatch) {
                        if (timeMatch[0] === 'time-all-day') {
                            // All-day slot - set to start of day
                            clickedDate.setHours(0, 0, 0, 0);
                        } else {
                            // Specific time slot
                            const hours = parseInt(timeMatch[1]);
                            const minutes = parseInt(timeMatch[2]);
                            clickedDate.setHours(hours, minutes, 0, 0);
                        }
                    }
                    
                    const dateParam = { 
                        monthDate: this.options.date,
                        dateClick: clickedDate
                    };
                    this.options.dayClick(dateParam);
                }
            }
        });
        
        // Month dropdown
        Dom.on(this.element, 'click', '.js-cal-month-dropdown', (e) => {
            if (this.destroyed || !this.options) return;
            
            console.log('Month dropdown clicked');
            e.preventDefault();
            e.stopPropagation();
            
            this.hideElement('.year-dropdown-menu');
            this.hideElement('.view-dropdown-menu');
            this.options.keepYearDropdownOpen = false;
            
            const monthMenu = Dom.select('.month-dropdown-menu', this.element);
            console.log('Month menu element:', monthMenu);
            if (monthMenu) {
                const isVisible = Dom.isVisible(monthMenu);
                console.log('Month menu visible:', isVisible);
                if (isVisible) {
                    console.log('Hiding month menu');
                    Dom.hide(monthMenu);
                } else {
                    console.log('Showing month menu');
                    Dom.show(monthMenu);
                }
            } else {
                console.log('Month menu not found!');
            }
            return false;
        });
        
        // Month dropdown items
        Dom.on(this.element, 'click', '.month-dropdown-item', (e) => {
            if (this.destroyed || !this.options) return;
            
            e.preventDefault();
            e.stopPropagation();
            
            const target = e.target;
            const data = target.dataset;
            if (data.date) {
                this.options.date = new Date(data.date);
                this.fetchEvents();
            }
            
            this.hideElement('.month-dropdown-menu');
            return false;
        });
        
        // Year dropdown
        Dom.on(this.element, 'click', '.js-cal-year-dropdown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            this.hideElement('.month-dropdown-menu');
            this.hideElement('.view-dropdown-menu');
            
            const yearMenu = Dom.select('.year-dropdown-menu', this.element);
            if (yearMenu) {
                if (Dom.isVisible(yearMenu)) {
                    Dom.hide(yearMenu);
                } else {
                    Dom.show(yearMenu);
                }
            }
            return false;
        });
        
        // Year navigation
        Dom.on(this.element, 'click', '.year-nav-next', (e) => {
            if (this.destroyed || !this.options) return;
            
            e.preventDefault();
            e.stopPropagation();
            
            this.options.date.setFullYear(this.options.date.getFullYear() + 1);
            this.options.keepYearDropdownOpen = true;
            this.fetchEvents();
            return false;
        });
        
        Dom.on(this.element, 'click', '.year-nav-prev', (e) => {
            if (this.destroyed || !this.options) return;
            
            e.preventDefault();
            e.stopPropagation();
            
            this.options.date.setFullYear(this.options.date.getFullYear() - 1);
            this.options.keepYearDropdownOpen = true;
            this.fetchEvents();
            return false;
        });
        
        // View dropdown toggle
        Dom.on(this.element, 'click', '.js-cal-view-dropdown', (e) => {
            if (this.destroyed || !this.options) return;
            
            e.preventDefault();
            e.stopPropagation();
            
            this.hideElement('.month-dropdown-menu');
            this.hideElement('.year-dropdown-menu');
            this.options.keepYearDropdownOpen = false;
            
            const viewMenu = Dom.select('.view-dropdown-menu', this.element);
            if (viewMenu) {
                if (Dom.isVisible(viewMenu)) {
                    Dom.hide(viewMenu);
                } else {
                    Dom.show(viewMenu);
                }
            }
            return false;
        });
        
        // Document click handler for closing dropdowns
        const documentClickHandler = (e) => {
            const target = e.target;
            
            if (!target.closest('.month-dropdown-container')) {
                this.hideElement('.month-dropdown-menu');
            }
            if (!target.closest('.year-dropdown-container')) {
                this.hideElement('.year-dropdown-menu');
                this.options.keepYearDropdownOpen = false;
            }
            if (!target.closest('.view-dropdown-container')) {
                this.hideElement('.view-dropdown-menu');
            }
        };
        
        document.addEventListener('click', documentClickHandler);
        this.documentHandlers.push({ event: 'click', handler: documentClickHandler });
    }
    
    closeDropdowns() {
        this.hideElement('.month-dropdown-menu');
        this.hideElement('.year-dropdown-menu');
        this.hideElement('.view-dropdown-menu');
    }
    
    hideElement(selector) {
        if (this.destroyed || !this.element) {
            return;
        }
        const element = Dom.select(selector, this.element);
        if (element) {
            Dom.hide(element);
        }
    }
    
    fetchEvents() {
        const dateCopy = new Date('' + this.options.date);
        const defaultDate = new Date(this.options.date);
        const startDate = defaultDate.setMonth(defaultDate.getMonth() - 1.5);
        const endDate = defaultDate.setMonth(defaultDate.getMonth() + 3);
        console.log('Current Date: ' + new Date(this.options.date));
        console.log('Date Range: ' + new Date(startDate) + ' > ' + new Date(endDate));
        
        if (this.options.events) {
            this.options.events({ defaultDate: new Date(dateCopy), start: new Date(startDate), end: new Date(endDate) }, this.eventCallback.bind(this));
        } else {
            this.draw();
        }
        
        // Apply theme after initialization
        this.applyTheme();
    }
    
    eventCallback(newData) {
        this.options.data = newData;
        this.draw();
        
        // Reopen year dropdown if flag is set
        if (this.options.keepYearDropdownOpen) {
            const yearMenu = Dom.select('.year-dropdown-menu', this.element);
            if (yearMenu) {
                Dom.show(yearMenu);
            }
            this.options.keepYearDropdownOpen = false;
        }
    }
    
    triggerStateChange() {
        if (this.options.stateChange && typeof this.options.stateChange === 'function') {
            this.options.stateChange({
                mode: this.options.mode,
                date: this.options.date,
                showBackground: this.options.showBackground,
                showTimeInEvent: this.options.showTimeInEvent,
                useShortDays: this.options.useShortDays,
                showDayAsAllDayEvents: this.options.showDayAsAllDayEvents,
                eventBorder: this.options.eventBorder,
                showTodayButton: this.options.showTodayButton,
                showMonthYear: this.options.showMonthYear,
                showModeButtons: this.options.showModeButtons,
                showNavigation: this.options.showNavigation,
                theme: this.options.theme,
                todayname: this.options.todayname,
                monthText: this.options.monthText,
                weekText: this.options.weekText,
                dayText: this.options.dayText,
                days: this.options.days,
                shortDays: this.options.shortDays,
                months: this.options.months,
                shortMonths: this.options.shortMonths
            });
        }
    }
    
    draw() {
        if (this.destroyed || !this.element) {
            console.warn('SimpleCalendar: Cannot draw, instance is destroyed or element is null');
            return;
        }
        this.element.innerHTML = this.template(this.options);
        
        // Add background class if showBackground option is true
        if (this.options.showBackground) {
            this.element.classList.add('calendar-with-background');
            
            // Apply custom background colors if provided
            if (this.options.headerBackgroundColor) {
                const headerElements = Dom.selectAll('.calendar-table thead td, .calendar-table thead .c-name', this.element);
                headerElements.forEach(el => el.style.backgroundColor = this.options.headerBackgroundColor);
            }
            
            if (this.options.bodyBackgroundColor) {
                const bodyElements = Dom.selectAll('.calendar-day, .calendar-table', this.element);
                bodyElements.forEach(el => el.style.backgroundColor = this.options.bodyBackgroundColor);
            }
        } else {
            this.element.classList.remove('calendar-with-background');
            // Remove any custom background colors
            const allElements = Dom.selectAll('.calendar-table thead td, .calendar-table thead .c-name, .calendar-day, .calendar-table', this.element);
            allElements.forEach(el => el.style.backgroundColor = '');
        }
        
        // Mark today
        const todayClass = (new Date()).toDateCssClass();
        const todayElement = Dom.select('.' + todayClass, this.element);
        if (todayElement) {
            todayElement.classList.add('today');
        }
        
        if (this.options.data && this.options.data.length) {
            if (this.options.mode === 'year') {
                this.yearAddEvents(this.options.data, this.options.date.getFullYear());
            } else if (this.options.mode === 'month' || this.options.mode === 'week') {
                // Sort events so multi-day events are rendered first (at the top)
                const sortedEvents = [...this.options.data].sort((a, b) => {
                    const aIsMultiDay = a.end && new Date(a.start).toDateString() !== new Date(a.end).toDateString();
                    const bIsMultiDay = b.end && new Date(b.start).toDateString() !== new Date(b.end).toDateString();
                    
                    // Multi-day events first, then by start date
                    if (aIsMultiDay && !bIsMultiDay) return -1;
                    if (!aIsMultiDay && bIsMultiDay) return 1;
                    
                    // If both are same type, sort by start date
                    return new Date(a.start) - new Date(b.start);
                });
                
                sortedEvents.forEach((event, index) => this.monthAddEvent(index, event));
            } else {
                this.options.data.forEach((event, index) => this.dayAddEvent(index, event));
            }
        }
        
        // Apply theme after drawing
        this.applyTheme();
        
        this.triggerStateChange();
    }
    
    dayAddEvent(index, event) {
        if (!!event.allDay) {
            this.monthAddEvent(index, event);
            return;
        }

        const titleArray = event.title.split('&nbsp;');
        const cleanTitle = titleArray && titleArray.length > 1 ? titleArray[1] : event.title;
        const eventEl = Dom.create('div', {
            class: 'event',
            title: cleanTitle,
            'data-index': index,
            'data-json': JSON.stringify(event)
        }, event.title);

        const start = new Date(event.start);
        const end = new Date(event.end) || start;
        const time = new Date(event.start).toTimeString();
        const hour = start.getHours();
        let timeclass = '.time-22-0';
        const startint = start.toDateInt();
        const dateint = this.options.date.toDateInt();
        const endint = end.toDateInt();

        if (startint > dateint || endint < dateint) { return; }

        if (!!time && this.options.showTimeInEvent) {
            eventEl.innerHTML = '<strong>' + time + '</strong> ' + eventEl.innerHTML;
        }

        const cssStyle = this.getEventBaseCssStyle(event, startint === dateint, endint === dateint);
        Object.keys(cssStyle).forEach(key => {
            eventEl.style[key] = cssStyle[key];
        });
        
        // Apply border class if eventBorder is enabled
        if (this.options.eventBorder) {
            eventEl.classList.add('event-with-border');
        }

        console.log('Hour: ' + hour);

        if (this.options.showDayAsAllDayEvents) {
            timeclass = '.time-all-day';
        } else {
            if (hour < 6) {
                timeclass = '.time-0-0';
            }
            if (hour < 22) {
                timeclass = '.time-' + hour + '-' + (start.getMinutes() < 30 ? '0' : '30');
            }
        }
        console.log('TimeClass: ' + timeclass);
        const timeSlot = Dom.select(timeclass, this.element);
        if (timeSlot) {
            timeSlot.appendChild(eventEl);
        }
    }

    monthAddEvent(index, event) {
        const titleArray = event.title.split('&nbsp;');
        const cleanTitle = titleArray && titleArray.length > 1 ? titleArray[1] : event.title;
        let eventEl = Dom.create('div', {
            class: 'event',
            title: cleanTitle,
            'data-index': index,
            'data-json': JSON.stringify(event)
        }, event.title);

        const e = new Date(event.start);
        const dateclass = e.toDateCssClass();
        let day = Dom.select('.' + e.toDateCssClass(), this.element);
        const empty = Dom.create('div', { class: 'clear event js-cal-option' }, '&nbsp;');
        let numbevents = 0;
        const time = new Date(event.start).toTimeString();
        const endday = event.end && Dom.select('.' + new Date(event.end).toDateCssClass(), this.element);
        const checkanyway = new Date(e.getFullYear(), e.getMonth(), e.getDate() + 40);

        if (!!time && this.options.showTimeInEvent) {
            eventEl.innerHTML = '<strong>' + time + '</strong> ' + eventEl.innerHTML;
        }
        
        if (!event.end) {
            const dayElement = Dom.select('.' + new Date(event.start).toDateCssClass(), this.element);
            if (dayElement) {
                dayElement.appendChild(eventEl);
            }
            return;
        }

        while (e <= new Date(event.end) && (day || endday || this.options.date < checkanyway)) {
            if (day) {
                if (e && e.getDay() == 0) { // reset on Sundays
                    numbevents = 0;
                }
                const existing = Dom.selectAll('.event', day).length;
                numbevents = Math.max(numbevents, existing);
                for (let i = 0; i < numbevents - existing; i++) {
                    const emptyClone = empty.cloneNode(true);
                    // Apply placeholder border class to maintain alignment when eventBorder is enabled
                    if (this.options.eventBorder) {
                        emptyClone.classList.add('placeholder-with-border');
                    }
                    day.appendChild(emptyClone);
                }
                
                // Set css style
                const cssStyle = this.getEventBaseCssStyle(event, dateclass === new Date(event.start).toDateCssClass(), dateclass === new Date(event.end).toDateCssClass());
                Object.keys(cssStyle).forEach(key => {
                    eventEl.style[key] = cssStyle[key];
                });
                
                // Apply border class if eventBorder is enabled
                if (this.options.eventBorder) {
                    eventEl.classList.add('event-with-border');
                }
                
                // Determine if this is the first, last, or middle day of the event
                const eventStartDate = new Date(event.start);
                const eventEndDate = new Date(event.end);
                const currentDate = new Date(e);
                
                // Normalize dates to compare just the day (ignore time)
                const startDay = new Date(eventStartDate.getFullYear(), eventStartDate.getMonth(), eventStartDate.getDate());
                const endDay = new Date(eventEndDate.getFullYear(), eventEndDate.getMonth(), eventEndDate.getDate());
                const currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
                
                const isBegin = currentDay.getTime() === startDay.getTime();
                const isEnd = currentDay.getTime() === endDay.getTime();
                
                // Remove any existing classes
                eventEl.classList.remove('begin', 'end');
                
                // Add appropriate classes
                if (isBegin) eventEl.classList.add('begin');
                if (isEnd) eventEl.classList.add('end');
                
                day.appendChild(eventEl);
                
                // Clone for next iteration and reset classes
                eventEl = eventEl.cloneNode(true);
                eventEl.innerHTML = '&nbsp;';
                eventEl.classList.remove('begin', 'end'); // Remove classes from clone
            }
            e.setDate(e.getDate() + 1);
            const newDateclass = e.toDateCssClass();
            day = Dom.select('.' + newDateclass, this.element);
        }
    }

    yearAddEvents(events, year) {
        const counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        events.forEach((v) => {
            if (new Date(v.start).getFullYear() === year) {
                // counts[new Date(v.start).getMonth()]++;
            }
        });
        counts.forEach((v, i) => {
            if (v !== 0) {
                const monthEl = Dom.select('.month-' + i, this.element);
                if (monthEl) {
                    const badge = Dom.create('span', { class: 'badge' }, v.toString());
                    monthEl.appendChild(badge);
                }
            }
        });
    }

    getEventBaseCssStyle(event, isBegin, isEnd) {
        const baseColor = (' ' + event.backgroundColor).slice(1);
        const colorRgb = this.hexToRgb(baseColor);
        
        if (colorRgb) {
            const newColor = { r: Math.abs(colorRgb.r - 32), g: Math.abs(colorRgb.g - 15), b: Math.abs(colorRgb.b - 7) };
            const borderColor = { r: Math.abs(newColor.r - 100), g: Math.abs(newColor.g - 100), b: Math.abs(newColor.b - 100) };

            const finalCss = {
                'background-image': 'linear-gradient(to bottom, ' + this.rgbToHex(newColor) + ' 0px, ' + event.backgroundColor + ' 100%)',
                'background-repeat': 'repeat-x',
                'color': this.rgbToHex(borderColor)
            };
            
            // Don't override border-radius here - let CSS handle it based on .begin/.end classes
            
            return finalCss;
        }
        return {};
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    rgbToHex(color) {
        return '#' + (1 << 24 | color.r << 16 | color.g << 8 | color.b).toString(16).slice(1);
    }
    
    // Public API methods
    updateOptions(newOptions) {
        Dom.extend(this.options, newOptions);
        this.draw();
    }
    
    getOptions() {
        return { ...this.options };
    }
    
    destroy() {
        // Remove all event handlers
        if (this.documentHandlers) {
            this.documentHandlers.forEach(({ event, handler }) => {
                document.removeEventListener(event, handler);
            });
        }
        
        
        // Clear the element
        if (this.element) {
            this.element.innerHTML = '';
        }
        
        // Remove references
        this.element = null;
        this.options = null;
        this.template = null;
        this.eventHandlers = [];
        this.documentHandlers = [];
        this.destroyed = true;
    }
}

// Global function for backward compatibility and easy usage
window.SimpleCalendar = SimpleCalendar;

// Initialize calendar function for element
if (typeof Element !== 'undefined') {
    Element.prototype.calendar = function(options = {}) {
        return new SimpleCalendar(this, options);
    };
}

// Document ready equivalent
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Auto-initialize calendars with data-calendar attribute
        Dom.selectAll('[data-calendar]').forEach(element => {
            try {
                const options = JSON.parse(element.dataset.calendar || '{}');
                new SimpleCalendar(element, options);
            } catch (e) {
                console.warn('Failed to parse calendar options:', e);
                new SimpleCalendar(element);
            }
        });
    });
} else {
    // DOM is already ready
    Dom.selectAll('[data-calendar]').forEach(element => {
        try {
            const options = JSON.parse(element.dataset.calendar || '{}');
            new SimpleCalendar(element, options);
        } catch (e) {
            console.warn('Failed to parse calendar options:', e);
            new SimpleCalendar(element);
        }
    });
}