/**
 * SimpleCalendarJs v2.0.1
 * A clean, modern, and feature-rich JavaScript calendar component with zero dependencies
 * 
 * @author Pedro Lopes <simplecalendarjs@gmail.com>
 * @homepage https://www.simplecalendarjs.com
 * @license SEE LICENSE IN LICENSE
 * @repository https://github.com/pclslopes/SimpleCalendarJs
 */

class SimpleCalendarJs {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        this.options = {
            view: 'month',
            date: new Date(),
            events: [],
            fulldayMode: false,
            startHour: 6,
            endHour: 22,
            timeSlotMinutes: 30,
            dayClick: null,
            eventClick: null,
            changeState: null,
            gridBorders: 'both', // 'both', 'vertical', 'horizontal', 'none'
            eventBorders: false, // true/false - whether events should have borders
            eventBorderColor: '#6c757d', // default dark gray color for event borders
            defaultEventColor: '#4c6f94', // default blue color for events
            showMonthButton: true, // true/false - show month view button
            showWeekButton: true, // true/false - show week view button
            showDayButton: true, // true/false - show day view button
            showNavigation: true, // true/false - show navigation buttons (prev/next)
            ...options
        };
        
        this.currentDate = new Date(this.options.date);
        this.view = this.options.view;
        this.events = this.options.events;
        this.eventsCallback = typeof this.options.events === 'function' ? this.options.events : null;
        this.fulldayMode = this.options.fulldayMode;
        this.fetchedRanges = []; // Array of {startDate, endDate, events} objects
        this.allCachedEvents = []; // All events from all fetched ranges
        
        this.weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        this.weekdaysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        this.months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        this.init();
    }
    
    init() {
        this.container.innerHTML = this.getCalendarTemplate();
        this.applyGridBorders();
        this.applyEventBorders();
        this.applyEventColor();
        this.applyViewButtonVisibility();
        this.applyNavigationVisibility();
        this.bindEvents();
        this.render();
    }
    
    triggerChangeState() {
        if (this.options.changeState) {
            const currentState = {
                view: this.view,
                date: new Date(this.currentDate),
                fulldayMode: this.fulldayMode,
                startHour: this.options.startHour,
                endHour: this.options.endHour,
                timeSlotMinutes: this.options.timeSlotMinutes
            };
            this.options.changeState(currentState);
        }
    }
    
    applyGridBorders() {
        const calendar = this.container.querySelector('.sc-calendar');
        if (calendar) {
            // Remove existing border classes
            calendar.classList.remove('sc-borders-both', 'sc-borders-vertical', 'sc-borders-horizontal', 'sc-borders-none');
            
            // Add appropriate border class
            calendar.classList.add(`sc-borders-${this.options.gridBorders}`);
        }
    }
    
    applyEventBorders() {
        const calendar = this.container.querySelector('.sc-calendar');
        if (calendar) {
            // Remove existing event border classes
            calendar.classList.remove('sc-event-borders', 'sc-event-no-borders');
            
            // Add appropriate event border class
            if (this.options.eventBorders) {
                calendar.classList.add('sc-event-borders');
                // Set custom border color if provided
                calendar.style.setProperty('--sc-event-border-color', this.options.eventBorderColor);
            } else {
                calendar.classList.add('sc-event-no-borders');
            }
        }
    }
    
    applyEventColor() {
        const calendar = this.container.querySelector('.sc-calendar');
        if (calendar) {
            calendar.style.setProperty('--sc-event-color', this.options.defaultEventColor);
        }
    }
    
    applyViewButtonVisibility() {
        const monthBtn = this.container.querySelector('[data-view="month"]');
        const weekBtn = this.container.querySelector('[data-view="week"]');
        const dayBtn = this.container.querySelector('[data-view="day"]');
        
        if (monthBtn) {
            monthBtn.style.display = this.options.showMonthButton ? 'flex' : 'none';
        }
        if (weekBtn) {
            weekBtn.style.display = this.options.showWeekButton ? 'flex' : 'none';
        }
        if (dayBtn) {
            dayBtn.style.display = this.options.showDayButton ? 'flex' : 'none';
        }
        
        // Hide entire view switcher if no buttons are visible
        const viewSwitcher = this.container.querySelector('.sc-view-switcher');
        if (viewSwitcher) {
            const hasVisibleButtons = this.options.showMonthButton || this.options.showWeekButton || this.options.showDayButton;
            viewSwitcher.style.display = hasVisibleButtons ? 'flex' : 'none';
        }
    }
    
    applyNavigationVisibility() {
        const navContainer = this.container.querySelector('.sc-nav');
        if (navContainer) {
            navContainer.style.visibility = this.options.showNavigation ? 'visible' : 'hidden';
        }
    }
    
    getCalendarTemplate() {
        return `
            <div class="sc-calendar">
                <div class="sc-header">
                    <div class="sc-nav">
                        <button class="sc-btn sc-prev">←</button>
                        <button class="sc-btn sc-next">→</button>
                    </div>
                    <h2 class="sc-title"></h2>
                    <div class="sc-view-switcher">
                        <button class="sc-btn sc-view-btn ${this.view === 'month' ? 'sc-active' : ''}" data-view="month">Month</button>
                        <button class="sc-btn sc-view-btn ${this.view === 'week' ? 'sc-active' : ''}" data-view="week">Week</button>
                        <button class="sc-btn sc-view-btn ${this.view === 'day' ? 'sc-active' : ''}" data-view="day">Day</button>
                    </div>
                </div>
                <div class="sc-content">
                    <div class="sc-view-container"></div>
                </div>
            </div>
        `;
    }
    
    bindEvents() {
        const prevBtn = this.container.querySelector('.sc-prev');
        const nextBtn = this.container.querySelector('.sc-next');
        const viewBtns = this.container.querySelectorAll('.sc-view-btn');
        
        prevBtn.addEventListener('click', () => this.navigate('prev'));
        nextBtn.addEventListener('click', () => this.navigate('next'));
        
        viewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.dataset.view;
                this.setView(view);
            });
        });
        
        // Add event delegation for day and event clicks
        this.container.addEventListener('click', (e) => {
            this.handleCalendarClick(e);
        });
    }
    
    calculatePreciseTime(dayElement, originalEvent) {
        const timeStr = dayElement.getAttribute('data-time');
        if (!timeStr) return null;
        
        // Get the click position within the day element
        const rect = dayElement.getBoundingClientRect();
        const clickY = originalEvent.clientY - rect.top;
        const elementHeight = rect.height;
        
        // Determine if click was in top half (first 30 min) or bottom half (second 30 min)
        const isSecondHalf = clickY > (elementHeight / 2);
        
        // Parse the base time
        const baseTime = this.parseTimeString(timeStr);
        if (!baseTime) return timeStr; // Fallback to original time string
        
        // Add 30 minutes if clicked in second half
        if (isSecondHalf) {
            baseTime.setMinutes(baseTime.getMinutes() + 30);
        }
        
        // Format back to time string
        return this.formatTime(baseTime);
    }
    
    handleCalendarClick(e) {
        // Handle event clicks
        const eventElement = e.target.closest('[data-event-id]');
        if (eventElement) {
            e.stopPropagation(); // Prevent day click from firing
            this.handleEventClick(eventElement, e);
            return;
        }
        
        // Handle day clicks
        const dayElement = e.target.closest('[data-date]');
        if (dayElement) {
            this.handleDayClick(dayElement, e);
            return;
        }
    }
    
    handleEventClick(eventElement, originalEvent) {
        if (!this.options.eventClick) return;
        
        const eventId = eventElement.getAttribute('data-event-id');
        const dayElement = eventElement.closest('[data-date]');
        const dateStr = dayElement ? dayElement.getAttribute('data-date') : null;
        
        if (eventId && dateStr) {
            const date = new Date(dateStr);
            const allEvents = this.getAllEventsForRange();
            const event = allEvents.find(e => e.id == eventId);
            
            if (event) {
                // Calculate precise time based on click position (for time-based views)
                const preciseTime = this.calculatePreciseTime(dayElement, originalEvent);
                
                const clickInfo = {
                    date: date,
                    time: preciseTime
                };
                this.options.eventClick(event, clickInfo, originalEvent);
            }
        }
    }
    
    handleDayClick(dayElement, originalEvent) {
        if (!this.options.dayClick) return;
        
        const dateStr = dayElement.getAttribute('data-date');
        
        if (dateStr) {
            const date = new Date(dateStr);
            
            // Calculate precise time based on click position (for time-based views)
            const preciseTime = this.calculatePreciseTime(dayElement, originalEvent);
            
            const clickInfo = {
                date: date,
                time: preciseTime
            };
            this.options.dayClick(clickInfo, originalEvent);
        }
    }
    
    navigate(direction) {
        const multiplier = direction === 'next' ? 1 : -1;
        
        switch (this.view) {
            case 'month':
                this.currentDate.setMonth(this.currentDate.getMonth() + multiplier);
                break;
            case 'week':
                this.currentDate.setDate(this.currentDate.getDate() + (7 * multiplier));
                break;
            case 'day':
                this.currentDate.setDate(this.currentDate.getDate() + multiplier);
                break;
        }
        
        // Note: We don't clear the smart cache when navigating
        // The smart cache will automatically fetch only missing ranges
        
        this.render();
        this.triggerChangeState();
    }
    
    setView(view) {
        this.view = view;
        
        this.container.querySelectorAll('.sc-view-btn').forEach(btn => {
            btn.classList.remove('sc-active');
        });
        this.container.querySelector(`[data-view="${view}"]`).classList.add('sc-active');
        
        // Note: We don't clear the smart cache when changing views
        // The smart cache will automatically fetch only missing ranges
        
        this.render();
        this.triggerChangeState();
    }
    
    render() {
        this.updateTitle();
        this.renderView();
    }
    
    updateTitle() {
        const title = this.container.querySelector('.sc-title');
        
        switch (this.view) {
            case 'month':
                title.textContent = `${this.months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
                break;
            case 'week':
                const weekStart = this.getWeekStart(this.currentDate);
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 6);
                title.textContent = `${this.months[weekStart.getMonth()]} ${weekStart.getDate()} - ${this.months[weekEnd.getMonth()]} ${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
                break;
            case 'day':
                title.textContent = `${this.weekdays[this.currentDate.getDay()]}, ${this.months[this.currentDate.getMonth()]} ${this.currentDate.getDate()}, ${this.currentDate.getFullYear()}`;
                break;
        }
    }
    
    renderView() {
        const container = this.container.querySelector('.sc-view-container');
        
        switch (this.view) {
            case 'month':
                container.innerHTML = this.renderMonthView();
                break;
            case 'week':
                container.innerHTML = this.renderWeekView();
                break;
            case 'day':
                container.innerHTML = this.renderDayView();
                break;
        }
    }
    
    renderMonthView() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        let html = `
            <div class="sc-month-view ${this.fulldayMode ? 'sc-fullday' : ''}">
                <div class="sc-weekdays">
                    ${this.weekdaysShort.map(day => `<div class="sc-weekday">${day}</div>`).join('')}
                </div>
                <div class="sc-days-grid">
        `;
        
        for (let week = 0; week < 6; week++) {
            for (let day = 0; day < 7; day++) {
                const currentDay = new Date(startDate);
                currentDay.setDate(startDate.getDate() + (week * 7) + day);
                
                const isCurrentMonth = currentDay.getMonth() === month;
                const isToday = this.isToday(currentDay);
                const dayEvents = this.getEventsForDate(currentDay);
                
                if (this.fulldayMode) {
                    const eventsWithPlaceholders = this.addEventPlaceholders(dayEvents, currentDay);
                    html += `
                        <div class="sc-day ${isCurrentMonth ? 'sc-current-month' : 'sc-other-month'} ${isToday ? 'sc-today' : ''}" data-date="${currentDay.toISOString()}">
                            <div class="sc-day-number">${currentDay.getDate()}</div>
                            ${eventsWithPlaceholders.map(item => {
                                if (item.isPlaceholder) {
                                    return `<div class="sc-event-month sc-event-single sc-event-placeholder">&nbsp;</div>`;
                                }
                                const position = this.getEventPosition(item.event, currentDay);
                                const positionClass = position.isSingle ? 'sc-event-single' : 
                                                    position.isStart ? 'sc-event-start' :
                                                    position.isEnd ? 'sc-event-end' : 'sc-event-middle';
                                const eventTitle = position.isSingle || position.isStart ? item.event.title : '';
                                const eventStyles = this.applyEventStyles(item.event);
                                return `<div class="sc-event-month ${positionClass}" data-event-id="${item.event.id}" ${eventStyles}><span class="sc-event-text">${eventTitle}</span></div>`;
                            }).join('')}
                        </div>
                    `;
                } else {
                    const eventCount = dayEvents.length;
                    const eventCountText = eventCount === 0 ? '' : 
                                         eventCount === 1 ? '1 event' : 
                                         `${eventCount} events`;
                    html += `
                        <div class="sc-day sc-day-count-mode ${isCurrentMonth ? 'sc-current-month' : 'sc-other-month'} ${isToday ? 'sc-today' : ''}" data-date="${currentDay.toISOString()}">
                            <div class="sc-day-content">
                                <div class="sc-day-number">${currentDay.getDate()}</div>
                                ${eventCountText ? `<div class="sc-event-count">${eventCountText}</div>` : ''}
                            </div>
                        </div>
                    `;
                }
            }
        }
        
        html += `
                </div>
            </div>
        `;
        
        return html;
    }
    
    renderWeekView() {
        const weekStart = this.getWeekStart(this.currentDate);
        const weekDays = [];
        
        for (let i = 0; i < 7; i++) {
            const day = new Date(weekStart);
            day.setDate(day.getDate() + i);
            weekDays.push(day);
        }
        
        if (this.fulldayMode) {
            return this.renderWeekFullday(weekDays);
        }
        
        const timeSlots = this.generateTimeSlots();
        
        let html = `
            <div class="sc-week-view">
                <div class="sc-time-column-header"></div>
                ${weekDays.map(day => `
                    <div class="sc-day-header ${this.isToday(day) ? 'sc-today' : ''}">
                        <div class="sc-day-name">${this.weekdaysShort[day.getDay()]}</div>
                        <div class="sc-day-number">${day.getDate()}</div>
                    </div>
                `).join('')}
                ${timeSlots.map(time => {
                    return `
                    <div class="sc-time-slot">${time}</div>
                    ${weekDays.map(day => {
                        const dayEvents = this.getEventsForTimeSlot(day, time);
                        return `
                            <div class="sc-day-column ${this.isToday(day) ? 'sc-today' : ''}" data-date="${day.toISOString()}" data-time="${time}">
                                <div class="sc-half-hour-line"></div>
                                ${dayEvents.map(event => {
                                    // In time-based week view, don't apply position classes
                                    const eventStyles = this.applyEventStyles(event);
                                    return `<div class="sc-event-time" data-event-id="${event.id}" ${eventStyles}>${event.title}</div>`;
                                }).join('')}
                            </div>
                        `;
                    }).join('')}
                `;
                }).join('')}
            </div>
        `;
        
        return html;
    }
    
    renderWeekFullday(weekDays) {
        let html = `
            <div class="sc-week-view sc-fullday">
                <div class="sc-weekdays">
                    ${weekDays.map(day => `<div class="sc-weekday">${this.weekdaysShort[day.getDay()]}</div>`).join('')}
                </div>
                <div class="sc-days-grid">
                    ${weekDays.map(day => {
                        const isToday = this.isToday(day);
                        const dayEvents = this.getEventsForDate(day);
                        const eventsWithPlaceholders = this.addEventPlaceholders(dayEvents, day);
                        
                        return `
                            <div class="sc-day ${isToday ? 'sc-today' : ''}" data-date="${day.toISOString()}">
                                <div class="sc-day-number">${day.getDate()}</div>
                                ${eventsWithPlaceholders.map(item => {
                                    if (item.isPlaceholder) {
                                        return `<div class="sc-event-week sc-event-single sc-event-placeholder">&nbsp;</div>`;
                                    }
                                    const position = this.getEventPosition(item.event, day);
                                    const positionClass = position.isSingle ? 'sc-event-single' : 
                                                        position.isStart ? 'sc-event-start' :
                                                        position.isEnd ? 'sc-event-end' : 'sc-event-middle';
                                    const eventTitle = position.isSingle || position.isStart ? item.event.title : '';
                                    const eventStyles = this.applyEventStyles(item.event);
                                    return `<div class="sc-event-week ${positionClass}" data-event-id="${item.event.id}" ${eventStyles}><span class="sc-event-text">${eventTitle}</span></div>`;
                                }).join('')}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
        
        return html;
    }
    
    renderDayView() {
        const currentDay = new Date(this.currentDate);
        
        if (this.fulldayMode) {
            const dayEvents = this.getEventsForDate(currentDay);
            return `
                <div class="sc-day-view sc-fullday">
                    <div class="sc-day-header ${this.isToday(currentDay) ? 'sc-today' : ''}">
                        <div class="sc-day-name">${this.weekdays[currentDay.getDay()]}</div>
                        <div class="sc-day-number">${currentDay.getDate()}</div>
                    </div>
                    <div class="sc-day-events" data-date="${currentDay.toISOString()}">
                        ${dayEvents.map(event => {
                            const position = this.getEventPosition(event, currentDay);
                            const positionClass = position.isSingle ? 'sc-event-single' : 
                                                position.isStart ? 'sc-event-start' :
                                                position.isEnd ? 'sc-event-end' : 'sc-event-middle';
                            // In day view, always show event title since it's the only day visible
                            const eventTitle = event.title;
                            const eventStyles = this.applyEventStyles(event);
                            return `<div class="sc-event-day ${positionClass}" data-event-id="${event.id}" ${eventStyles}><span class="sc-event-text">${eventTitle}</span></div>`;
                        }).join('')}
                    </div>
                </div>
            `;
        }
        
        const timeSlots = this.generateTimeSlots();
        
        let html = `
            <div class="sc-day-view">
                <div class="sc-time-column-header"></div>
                <div class="sc-day-header ${this.isToday(currentDay) ? 'sc-today' : ''}">
                    <div class="sc-day-name">${this.weekdays[currentDay.getDay()]}</div>
                    <div class="sc-day-number">${currentDay.getDate()}</div>
                </div>
                ${timeSlots.map(time => {
                    const dayEvents = this.getEventsForTimeSlot(currentDay, time);
                    return `
                    <div class="sc-time-slot">${time}</div>
                    <div class="sc-day-column ${this.isToday(currentDay) ? 'sc-today' : ''}" data-date="${currentDay.toISOString()}" data-time="${time}">
                        <div class="sc-half-hour-line"></div>
                        ${dayEvents.map(event => {
                            // In time-based day view, don't apply position classes
                            const eventStyles = this.applyEventStyles(event);
                            return `<div class="sc-event-time" data-event-id="${event.id}" ${eventStyles}>${event.title}</div>`;
                        }).join('')}
                    </div>
                `;
                }).join('')}
            </div>
        `;
        
        return html;
    }
    
    generateTimeSlots() {
        const slots = [];
        const start = this.options.startHour;
        const end = this.options.endHour;
        
        // Add 'before 6:00 AM' slot
        const beforeTime = new Date();
        beforeTime.setHours(start, 0, 0, 0);
        slots.push(`Before ${this.formatTime(beforeTime)}`);
        
        // Add regular hour slots
        for (let hour = start; hour <= end; hour++) {
            const time = new Date();
            time.setHours(hour, 0, 0, 0);
            slots.push(this.formatTime(time));
        }
        
        // Add 'after 10:00 PM' slot
        const afterTime = new Date();
        afterTime.setHours(end, 0, 0, 0);
        slots.push(`After ${this.formatTime(afterTime)}`);
        
        return slots;
    }
    
    formatTime(date) {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }
    
    getWeekStart(date) {
        const start = new Date(date);
        start.setDate(start.getDate() - start.getDay());
        return start;
    }
    
    getVisibleDateRange() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        switch (this.view) {
            case 'month':
                // Month view shows 6 weeks (42 days)
                const firstDay = new Date(year, month, 1);
                const startDate = new Date(firstDay);
                startDate.setDate(startDate.getDate() - firstDay.getDay());
                
                const endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + 41); // 6 weeks = 42 days
                
                return { startDate, endDate };
                
            case 'week':
                // Week view shows 7 days
                const weekStart = this.getWeekStart(this.currentDate);
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 6);
                
                return { startDate: weekStart, endDate: weekEnd };
                
            case 'day':
                // Day view shows 1 day
                const dayStart = new Date(this.currentDate);
                dayStart.setHours(0, 0, 0, 0);
                const dayEnd = new Date(dayStart);
                dayEnd.setHours(23, 59, 59, 999);
                
                return { startDate: dayStart, endDate: dayEnd };
        }
    }
    
    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }
    
    isRangeCovered(startDate, endDate) {
        // Check if the requested range is fully covered by existing fetched ranges
        for (const range of this.fetchedRanges) {
            if (range.startDate <= startDate && range.endDate >= endDate) {
                return true;
            }
        }
        return false;
    }
    
    getMissingRanges(startDate, endDate) {
        // Find what parts of the requested range are not yet fetched
        const missing = [];
        let currentStart = new Date(startDate);
        
        // Sort fetched ranges by start date
        const sortedRanges = [...this.fetchedRanges].sort((a, b) => a.startDate - b.startDate);
        
        for (const range of sortedRanges) {
            // If there's a gap before this range
            if (currentStart < range.startDate && currentStart <= endDate) {
                const gapEnd = new Date(Math.min(range.startDate.getTime() - 86400000, endDate.getTime())); // day before range starts
                if (gapEnd >= currentStart) {
                    missing.push({ startDate: new Date(currentStart), endDate: gapEnd });
                }
            }
            
            // Move current start to after this range
            if (range.endDate >= currentStart) {
                currentStart = new Date(range.endDate.getTime() + 86400000); // day after range ends
            }
        }
        
        // Check if there's a gap after all ranges
        if (currentStart <= endDate) {
            missing.push({ startDate: new Date(currentStart), endDate: new Date(endDate) });
        }
        
        return missing;
    }
    
    addFetchedRange(startDate, endDate, events) {
        // Add new fetched range and merge overlapping ranges
        const newRange = { startDate: new Date(startDate), endDate: new Date(endDate), events };
        
        // Add events to the global cache
        this.allCachedEvents = this.allCachedEvents.concat(events);
        
        // Add the range to our tracking
        this.fetchedRanges.push(newRange);
        
        // Merge overlapping ranges (optional optimization)
        this.mergeOverlappingRanges();
    }
    
    mergeOverlappingRanges() {
        // Sort ranges by start date
        this.fetchedRanges.sort((a, b) => a.startDate - b.startDate);
        
        const merged = [];
        for (const range of this.fetchedRanges) {
            if (merged.length === 0 || merged[merged.length - 1].endDate < range.startDate) {
                // No overlap, add as new range
                merged.push(range);
            } else {
                // Overlap detected, merge with the last range
                const last = merged[merged.length - 1];
                last.endDate = new Date(Math.max(last.endDate.getTime(), range.endDate.getTime()));
                last.events = last.events.concat(range.events);
            }
        }
        
        this.fetchedRanges = merged;
        
        // Rebuild allCachedEvents from merged ranges
        this.allCachedEvents = [];
        for (const range of this.fetchedRanges) {
            this.allCachedEvents = this.allCachedEvents.concat(range.events);
        }
    }
    
    getAllEventsForRange() {
        if (this.eventsCallback) {
            const dateRange = this.getVisibleDateRange();
            
            // Check if we already have all data for this range
            if (this.isRangeCovered(dateRange.startDate, dateRange.endDate)) {
                console.log('Using cached events for range:', dateRange.startDate.toDateString(), 'to', dateRange.endDate.toDateString());
                return this.allCachedEvents;
            }
            
            // Find what ranges we need to fetch
            const missingRanges = this.getMissingRanges(dateRange.startDate, dateRange.endDate);
            
            // Fetch missing ranges
            for (const missingRange of missingRanges) {
                console.log('Fetching events for missing range:', missingRange.startDate.toDateString(), 'to', missingRange.endDate.toDateString());
                const events = this.eventsCallback(missingRange);
                this.addFetchedRange(missingRange.startDate, missingRange.endDate, events);
            }
            
            return this.allCachedEvents;
        } else {
            return this.events || [];
        }
    }
    
    getEventsForDate(date) {
        const allEvents = this.getAllEventsForRange();
        
        const eventsForDate = allEvents.filter(event => {
            const startDate = new Date(event.startDate || event.date);
            const endDate = new Date(event.endDate || event.date);
            
            // Set times to start of day for comparison
            const checkDate = new Date(date);
            checkDate.setHours(0, 0, 0, 0);
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);
            
            return checkDate >= startDate && checkDate <= endDate;
        });
        
        // Sort events: multi-day events first, then single-day events
        return eventsForDate.sort((a, b) => {
            const aIsMultiDay = this.isMultiDayEvent(a);
            const bIsMultiDay = this.isMultiDayEvent(b);
            
            if (aIsMultiDay && !bIsMultiDay) return -1;
            if (!aIsMultiDay && bIsMultiDay) return 1;
            return 0;
        });
    }
    
    getEventsForTimeSlot(date, timeSlot) {
        if (this.fulldayMode) {
            return this.getEventsForDate(date);
        }
        
        const eventsForDate = this.getEventsForDate(date);
        
        return eventsForDate.filter(event => {
            if (!event.time) return false;
            
            const eventTime = this.parseTimeString(event.time);
            if (!eventTime) return false;
            
            const eventHour = eventTime.getHours();
            const startHour = this.options.startHour;
            const endHour = this.options.endHour;
            
            // Handle special time slots
            if (timeSlot.startsWith('Before')) {
                return eventHour < startHour;
            }
            
            if (timeSlot.startsWith('After')) {
                return eventHour > endHour;
            }
            
            // Handle regular time slots
            const slotTime = this.parseTimeString(timeSlot);
            if (!slotTime) return false;
            
            const slotHour = slotTime.getHours();
            return eventHour === slotHour;
        });
    }
    
    parseTimeString(timeStr) {
        try {
            const time = new Date();
            const [timePart, period] = timeStr.split(' ');
            const [hours, minutes] = timePart.split(':').map(Number);
            
            let hour24 = hours;
            if (period === 'PM' && hours !== 12) hour24 += 12;
            if (period === 'AM' && hours === 12) hour24 = 0;
            
            time.setHours(hour24, minutes || 0, 0, 0);
            return time;
        } catch (e) {
            return null;
        }
    }
    
    isMultiDayEvent(event) {
        const startDate = new Date(event.startDate || event.date);
        const endDate = new Date(event.endDate || event.date);
        
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        
        return startDate.getTime() !== endDate.getTime();
    }
    
    addEventPlaceholders(dayEvents, currentDay) {
        if (!this.fulldayMode) return dayEvents.map(event => ({ event, isPlaceholder: false }));
        
        // Get the week start to calculate week-wide multi-day event positions
        const weekStart = this.getWeekStart(currentDay);
        const weekDays = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(weekStart);
            day.setDate(day.getDate() + i);
            weekDays.push(day);
        }
        
        // Find all unique multi-day events that appear anywhere in this week
        const allWeekMultiDayEvents = new Map();
        weekDays.forEach(day => {
            const dayEvents = this.getEventsForDate(day);
            dayEvents.filter(event => this.isMultiDayEvent(event))
                    .forEach(event => {
                        if (!allWeekMultiDayEvents.has(event.id)) {
                            allWeekMultiDayEvents.set(event.id, event);
                        }
                    });
        });
        
        // Convert to array and sort by start date for consistent ordering
        const sortedWeekMultiDayEvents = Array.from(allWeekMultiDayEvents.values())
            .sort((a, b) => {
                const aStart = new Date(a.startDate || a.date);
                const bStart = new Date(b.startDate || b.date);
                return aStart - bStart;
            });
        
        const result = [];
        const currentMultiDayEvents = dayEvents.filter(event => this.isMultiDayEvent(event));
        const singleDayEvents = dayEvents.filter(event => !this.isMultiDayEvent(event));
        
        // For each multi-day event position in the week, either add the event or a placeholder
        sortedWeekMultiDayEvents.forEach(weekEvent => {
            const eventForThisDay = currentMultiDayEvents.find(e => e.id === weekEvent.id);
            if (eventForThisDay) {
                result.push({ event: eventForThisDay, isPlaceholder: false });
            } else {
                // Only add placeholder if:
                // 1. The event ended earlier in this week AND
                // 2. We're on a day after the event ended (to maintain position for remaining days)
                const eventStartDate = new Date(weekEvent.startDate || weekEvent.date);
                const eventEndDate = new Date(weekEvent.endDate || weekEvent.date);
                eventStartDate.setHours(0, 0, 0, 0);
                eventEndDate.setHours(0, 0, 0, 0);
                
                const currentDayTime = new Date(currentDay);
                currentDayTime.setHours(0, 0, 0, 0);
                
                const weekStartTime = new Date(weekStart);
                weekStartTime.setHours(0, 0, 0, 0);
                
                const weekEndTime = new Date(weekStart);
                weekEndTime.setDate(weekEndTime.getDate() + 6);
                weekEndTime.setHours(0, 0, 0, 0);
                
                // Only add placeholder if:
                // - Event started in this week or before
                // - Event ended before current day but within this week
                // - Current day is after the event ended
                const eventStartedInOrBeforeWeek = eventStartDate <= weekEndTime;
                const eventEndedInWeek = eventEndDate >= weekStartTime && eventEndDate <= weekEndTime;
                const currentDayAfterEventEnd = currentDayTime > eventEndDate;
                
                if (eventStartedInOrBeforeWeek && eventEndedInWeek && currentDayAfterEventEnd) {
                    result.push({ isPlaceholder: true, eventId: weekEvent.id });
                }
            }
        });
        
        // Add single-day events after multi-day events and placeholders
        singleDayEvents.forEach(event => {
            result.push({ event, isPlaceholder: false });
        });
        
        return result;
    }
    
    getEventPosition(event, date) {
        const startDate = new Date(event.startDate || event.date);
        const endDate = new Date(event.endDate || event.date);
        const checkDate = new Date(date);
        
        // Set to start of day
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        checkDate.setHours(0, 0, 0, 0);
        
        const isStart = checkDate.getTime() === startDate.getTime();
        const isEnd = checkDate.getTime() === endDate.getTime();
        const isMiddle = checkDate > startDate && checkDate < endDate;
        const isSingle = startDate.getTime() === endDate.getTime();
        
        return {
            isStart,
            isEnd,
            isMiddle,
            isSingle
        };
    }
    
    addEvent(event) {
        if (this.eventsCallback) {
            console.warn('Cannot add event when using callback function. Use setEvents() or update your callback function.');
            return;
        }
        this.events.push(event);
        this.render();
    }
    
    removeEvent(eventId) {
        if (this.eventsCallback) {
            console.warn('Cannot remove event when using callback function. Use setEvents() or update your callback function.');
            return;
        }
        this.events = this.events.filter(event => event.id !== eventId);
        this.render();
    }
    
    setEvents(events) {
        if (typeof events === 'function') {
            this.eventsCallback = events;
            this.events = [];
        } else {
            this.events = events || [];
            this.eventsCallback = null;
        }
        
        // Clear smart cache when events source changes
        this.fetchedRanges = [];
        this.allCachedEvents = [];
        
        this.render();
    }
    
    setFulldayMode(enabled) {
        this.fulldayMode = enabled;
        this.render();
        this.triggerChangeState();
    }
    
    goToDate(date) {
        this.currentDate = new Date(date);
        this.render();
        this.triggerChangeState();
    }
    
    goToToday() {
        this.currentDate = new Date();
        this.render();
        this.triggerChangeState();
    }
    
    setGridBorders(borderType) {
        this.options.gridBorders = borderType;
        this.applyGridBorders();
    }
    
    setEventBorders(enabled) {
        this.options.eventBorders = enabled;
        this.applyEventBorders();
        this.render();
    }
    
    setEventBorderColor(color) {
        this.options.eventBorderColor = color;
        this.applyEventBorders();
        this.render();
    }
    
    setShowMonthButton(show) {
        this.options.showMonthButton = show;
        this.applyViewButtonVisibility();
    }
    
    setShowWeekButton(show) {
        this.options.showWeekButton = show;
        this.applyViewButtonVisibility();
    }
    
    setShowDayButton(show) {
        this.options.showDayButton = show;
        this.applyViewButtonVisibility();
    }
    
    setViewButtonsVisibility(monthVisible, weekVisible, dayVisible) {
        this.options.showMonthButton = monthVisible;
        this.options.showWeekButton = weekVisible;
        this.options.showDayButton = dayVisible;
        this.applyViewButtonVisibility();
    }
    
    setShowNavigation(show) {
        this.options.showNavigation = show;
        this.applyNavigationVisibility();
    }
    
    setDefaultEventColor(color) {
        this.options.defaultEventColor = color;
        this.applyEventColor();
        this.render();
    }

    getEventBaseCssStyle(event) {
        const hasColor = event.color;
        const colorIsGradient = event.colorIsGradient === true;
        const color = hasColor ? event.color : this.options.defaultEventColor;
        
        if (!color) {
            return {};
        }

        const cleanColor = (' ' + color).slice(1);
        const colorRgb = this.hexToRgb(cleanColor);
        
        if (!colorRgb) {
            return {};
        }

        const textColor = this.getOptimalTextColor(colorRgb);
        
        if (colorIsGradient) {
            const newColor = { 
                r: Math.min(255, colorRgb.r + 40), 
                g: Math.min(255, colorRgb.g + 40), 
                b: Math.min(255, colorRgb.b + 40) 
            };
            
            return {
                'background-image': `linear-gradient(to bottom, ${this.rgbToHex(newColor)} 0px, ${color} 100%)`,
                'background-repeat': 'repeat-x',
                'color': textColor,
                'background-color': color
            };
        } else {
            return {
                'background-color': color,
                'color': textColor
            };
        }
    }

    getOptimalTextColor(bgColor) {
        const luminance = this.getLuminance(bgColor);
        return luminance > 0.5 ? '#000000' : '#ffffff';
    }

    getLuminance(color) {
        const r = this.getRelativeLuminanceComponent(color.r / 255);
        const g = this.getRelativeLuminanceComponent(color.g / 255);
        const b = this.getRelativeLuminanceComponent(color.b / 255);
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    getRelativeLuminanceComponent(c) {
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    }

    getContrastRatio(color1, color2) {
        const l1 = this.getLuminance(color1);
        const l2 = this.getLuminance(color2);
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        return (lighter + 0.05) / (darker + 0.05);
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

    applyEventStyles(event) {
        const styles = this.getEventBaseCssStyle(event);
        const styleString = Object.entries(styles)
            .map(([property, value]) => `${property}: ${value}`)
            .join('; ');
        return styleString ? `style="${styleString}"` : '';
    }
}