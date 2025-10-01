

var template = `{{ 
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
                  <span class="cal-nav-group">
                    <button class="js-cal-prev cal-nav-button">←</button>
                    <button class="js-cal-next cal-nav-button">→</button>
                  </span>
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
                  <th> </th>
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

$(document).ready(function () {

    jQuery.fn.outerHTML = function () {
        return jQuery('<div />').append(this.eq(0).clone()).html();
    };

        var $currentPopover = null;
        $(document).on('shown.bs.popover', function (ev) {
            var $target = $(ev.target);
            if ($currentPopover && ($currentPopover.get(0) != $target.get(0))) {
                $currentPopover.popover('toggle');
            }
            $currentPopover = $target;
        }).on('hidden.bs.popover', function (ev) {
            var $target = $(ev.target);
            if ($currentPopover && ($currentPopover.get(0) == $target.get(0))) {
                $currentPopover = null;
            }
        });



        //quicktmpl is a simple template language I threw together a while ago; it is not remotely secure to xss and probably has plenty of bugs that I haven't considered, but it basically works
        //the design is a function I read in a blog post by John Resig (http://ejohn.org/blog/javascript-micro-templating/) and it is intended to be loosely translateable to a more comprehensive template language like mustache easily
        $.extend({
            quicktmpl: function (template) { return new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('" + template.replace(/[\r\t\n]/g, " ").split("{{").join("\t").replace(/((^|\}\})[^\t]*)'/g, "$1\r").replace(/\t:(.*?)\}\}/g, "',$1,'").split("\t").join("');").split("}}").join("p.push('").split("\r").join("\\'") + "');}return p.join('');") }
        });

        $.extend(Date.prototype, {
            //provides a string that is _year_month_day, intended to be widely usable as a css class
            toDateCssClass: function () {
                return '_' + this.getFullYear() + '_' + (this.getMonth() + 1) + '_' + this.getDate();
            },
            //this generates a number useful for comparing two dates;
            toDateInt: function () {
                return ((this.getFullYear() * 12) + this.getMonth()) * 32 + this.getDate();
            },
            toTimeString: function () {
                var hours = this.getHours(),
                    minutes = this.getMinutes(),
                    hour = (hours > 12) ? (hours - 12) : hours,
                    ampm = (hours >= 12) ? ' pm' : ' am';
                if (hours === 0 && minutes === 0) { return ''; }
                if (minutes > 0) {
                    return hour + ':' + minutes + ampm;
                }
                return hour + ampm;
            }
        });


        (function ($) {

            //t here is a function which gets passed an options object and returns a string of html. I am using quicktmpl to create it based on the template located over in the html block
            //var t = $.quicktmpl($('#tmpl').get(0).innerHTML);
            var t = $.quicktmpl(template);

            function calendar($el, options) {

                console.log('Options: ' + JSON.stringify(options));
                var dateCopy = new Date('' + options.date);
                var defaultDate = new Date(options.date);
                var startDate = defaultDate.setMonth(defaultDate.getMonth() - 1);
                var endDate = defaultDate.setMonth(defaultDate.getMonth() + 3);
                console.log('Current Date: ' + new Date(options.date));
                console.log('Date Range Init: ' + new Date(startDate) + ' > ' + new Date(endDate));
                options.events({ defaultDate: new Date(dateCopy), start: new Date(startDate), end: new Date(endDate) }, eventCallback);

                console.log('data: ' + JSON.stringify(options.data));
                //actions aren't currently in the template, but could be added easily...
                $el.on('click', '.js-cal-prev', function () {
                    // Close year dropdown when clicking main navigation buttons
                    $('.year-dropdown-menu').hide();
                    options.keepYearDropdownOpen = false;
                    
                    switch (options.mode) {
                        case 'year': options.date.setFullYear(options.date.getFullYear() - 1); break;
                        case 'month': options.date.setMonth(options.date.getMonth() - 1); break;
                        case 'week': options.date.setDate(options.date.getDate() - 7); break;
                        case 'day': options.date.setDate(options.date.getDate() - 1); break;
                    }
                    var dateCopy = new Date('' + options.date);
                    var defaultDate = new Date(options.date);
                    var startDate = defaultDate.setMonth(defaultDate.getMonth() - 1.5);
                    var endDate = defaultDate.setMonth(defaultDate.getMonth() + 3);
                    console.log('Current Date: ' + new Date(options.date));
                    console.log('Date Range: ' + new Date(startDate) + ' > ' + new Date(endDate));
                    options.events({ defaultDate: new Date(dateCopy), start: new Date(startDate), end: new Date(endDate) }, eventCallback);
                    //options.events({ start: options.date, end: new Date(endDate) }, eventCallback);
                    //draw();
                }).on('click', '.js-cal-next', function () {
                    // Close year dropdown when clicking main navigation buttons
                    $('.year-dropdown-menu').hide();
                    options.keepYearDropdownOpen = false;
                    
                    switch (options.mode) {
                        case 'year': options.date.setFullYear(options.date.getFullYear() + 1); break;
                        case 'month': options.date.setMonth(options.date.getMonth() + 1); break;
                        case 'week': options.date.setDate(options.date.getDate() + 7); break;
                        case 'day': options.date.setDate(options.date.getDate() + 1); break;
                    }
                    var dateCopy = new Date('' + options.date);
                    var defaultDate = new Date(options.date);
                    var startDate = defaultDate.setMonth(defaultDate.getMonth() - 1.5);
                    var endDate = defaultDate.setMonth(defaultDate.getMonth() + 3);
                    console.log('Current Date: ' + new Date(options.date));
                    console.log('Date Range: ' + new Date(startDate) + ' > ' + new Date(endDate));
                    // trigger callback event
                    options.events({ defaultDate: new Date(dateCopy), start: new Date(startDate), end: new Date(endDate) }, eventCallback);
                }).on('click', '.js-cal-option', function () {
                    // Skip view dropdown items - they have their own handler
                    if ($(this).hasClass('view-dropdown-item')) {
                        return;
                    }
                    
                    // Close year dropdown when clicking other calendar buttons
                    $('.year-dropdown-menu').hide();
                    $('.view-dropdown-menu').hide();
                    options.keepYearDropdownOpen = false;
                    
                    var dateParam = { monthDate: options.date };
                    var $t = $(this), o = $t.data();
                    if (o.date) { o.date = new Date(o.date); }
                    $.extend(options, o);
                    
                    // Trigger stateChange callback when options change
                    if (options.stateChange && typeof options.stateChange === 'function') {
                        options.stateChange({
                            mode: options.mode,
                            date: options.date,
                            showBackground: options.showBackground,
                            showTimeInEvent: options.showTimeInEvent,
                            useShortDays: options.useShortDays,
                            showDayAsAllDayEvents: options.showDayAsAllDayEvents,
                            eventBorder: options.eventBorder,
                            showTodayButton: options.showTodayButton,
                            showMonthYear: options.showMonthYear,
                            showModeButtons: options.showModeButtons,
                            todayname: options.todayname,
                            monthText: options.monthText,
                            weekText: options.weekText,
                            dayText: options.dayText,
                            days: options.days,
                            shortDays: options.shortDays,
                            months: options.months,
                            shortMonths: options.shortMonths
                        });
                    }
                    
                    // Ensure dateClick is always set for calendar days
                    if (o.date) {
                        dateParam.dateClick = o.date;
                    } else if ($(this).hasClass('calendar-day') || $(this).closest('.calendar-day').length) {
                        // If clicking on a calendar day without date data, find it from the closest calendar-day
                        var $calendarDay = $(this).hasClass('calendar-day') ? $(this) : $(this).closest('.calendar-day');
                        var dayData = $calendarDay.data();
                        if (dayData.date) {
                            dateParam.dateClick = new Date(dayData.date);
                        }
                    }
                    
                    // Day click outside of events
                    if (!$(this).hasClass('button')) {
                        options.dayClick(dateParam);
                    } else {
                        // in case of month select on year view / Today button
                        if ($(this).hasClass('calendar-month') || $(this).hasClass('btn-today')) {
                            var dateCopy = new Date('' + options.date);
                            var defaultDate = new Date(options.date);
                            var startDate = defaultDate.setMonth(defaultDate.getMonth() - 1.5);
                            var endDate = defaultDate.setMonth(defaultDate.getMonth() + 3);
                            console.log('Current Date: ' + new Date(options.date));
                            console.log('Date Range: ' + new Date(startDate) + ' > ' + new Date(endDate));
                            // trigger callback event
                            options.events({ defaultDate: new Date(dateCopy), start: new Date(startDate), end: new Date(endDate) }, eventCallback);
                        } else {
                            draw();
                        }
                    }
                }).on('click', '.view-dropdown-item', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Get the mode from data attribute
                    var $t = $(this), o = $t.data();
                    if (o.mode) {
                        $.extend(options, o);
                        draw();
                    }
                    
                    $('.view-dropdown-menu').hide();
                    return false;
                }).on('click', '.event', function () {
                    if (!$(this).hasClass('js-cal-option')) {
                        var eventObj = { event: $(this).data('json'), monthDate: options.date };
                        options.eventClick(eventObj);       
                    }
                    return false;
                }).on('click', '.js-cal-month-dropdown', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    // Close other dropdowns when opening month dropdown
                    $('.year-dropdown-menu').hide();
                    $('.view-dropdown-menu').hide();
                    options.keepYearDropdownOpen = false;
                    
                    // Use show/hide instead of toggle to be more explicit
                    var $monthMenu = $('.month-dropdown-menu');
                    if ($monthMenu.is(':visible')) {
                        $monthMenu.hide();
                    } else {
                        $monthMenu.show();
                    }
                    return false;
                }).on('click', '.month-dropdown-item', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Get the selected date from data attribute
                    var $t = $(this), o = $t.data();
                    if (o.date) { 
                        options.date = new Date(o.date);
                        var dateCopy = new Date('' + options.date);
                        var defaultDate = new Date(options.date);
                        var startDate = defaultDate.setMonth(defaultDate.getMonth() - 1.5);
                        var endDate = defaultDate.setMonth(defaultDate.getMonth() + 3);
                        console.log('Month Selected - Current Date: ' + new Date(options.date));
                        console.log('Date Range: ' + new Date(startDate) + ' > ' + new Date(endDate));
                        // trigger callback event to load new month data
                        options.events({ defaultDate: new Date(dateCopy), start: new Date(startDate), end: new Date(endDate) }, eventCallback);
                    }
                    
                    $('.month-dropdown-menu').hide();
                    return false;
                }).on('click', '.js-cal-year-dropdown', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    // Close other dropdowns when opening year dropdown
                    $('.month-dropdown-menu').hide();
                    $('.view-dropdown-menu').hide();
                    
                    // Use show/hide instead of toggle to be more explicit
                    var $yearMenu = $('.year-dropdown-menu');
                    if ($yearMenu.is(':visible')) {
                        $yearMenu.hide();
                    } else {
                        $yearMenu.show();
                    }
                    return false;
                }).on('click', '.year-nav-next', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Move to next year
                    options.date.setFullYear(options.date.getFullYear() + 1);
                    var dateCopy = new Date('' + options.date);
                    var defaultDate = new Date(options.date);
                    var startDate = defaultDate.setMonth(defaultDate.getMonth() - 1.5);
                    var endDate = defaultDate.setMonth(defaultDate.getMonth() + 3);
                    console.log('Year Next - Current Date: ' + new Date(options.date));
                    console.log('Date Range: ' + new Date(startDate) + ' > ' + new Date(endDate));
                    
                    // Set flag to keep dropdown open after redraw
                    options.keepYearDropdownOpen = true;
                    options.events({ defaultDate: new Date(dateCopy), start: new Date(startDate), end: new Date(endDate) }, eventCallback);
                    
                    return false;
                }).on('click', '.year-nav-prev', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Move to previous year
                    options.date.setFullYear(options.date.getFullYear() - 1);
                    var dateCopy = new Date('' + options.date);
                    var defaultDate = new Date(options.date);
                    var startDate = defaultDate.setMonth(defaultDate.getMonth() - 1.5);
                    var endDate = defaultDate.setMonth(defaultDate.getMonth() + 3);
                    console.log('Year Previous - Current Date: ' + new Date(options.date));
                    console.log('Date Range: ' + new Date(startDate) + ' > ' + new Date(endDate));
                    
                    // Set flag to keep dropdown open after redraw
                    options.keepYearDropdownOpen = true;
                    options.events({ defaultDate: new Date(dateCopy), start: new Date(startDate), end: new Date(endDate) }, eventCallback);
                    
                    return false;
                }).on('click', '.js-cal-view-dropdown', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    // Close other dropdowns when opening view dropdown
                    $('.month-dropdown-menu').hide();
                    $('.year-dropdown-menu').hide();
                    options.keepYearDropdownOpen = false;
                    $('.view-dropdown-menu').toggle();
                    return false;
                })
                
                // Close dropdown when clicking outside (with namespace for proper cleanup)
                $(document).off('click.calendar-dropdowns').on('click.calendar-dropdowns', function(e) {
                    if (!$(e.target).closest('.month-dropdown-container').length) {
                        $('.month-dropdown-menu').hide();
                    }
                    if (!$(e.target).closest('.year-dropdown-container').length) {
                        $('.year-dropdown-menu').hide();
                        // Clear the flag when dropdown is manually closed
                        options.keepYearDropdownOpen = false;
                    }
                    if (!$(e.target).closest('.view-dropdown-container').length) {
                        $('.view-dropdown-menu').hide();
                    }
                });
                        ; /*.on('click', '.js-cal-years', function () {
                                        alert('here');
                                        var $t = $(this),
                                            haspop = $t.data('popover'),
                                            s = '',
                                            y = options.date.getFullYear() - 2,
                                            l = y + 5;
                                        if (haspop) { return true; }
                                        for (; y < l; y++) {
                                            s += '<button type="button" class="cal-nav-button js-cal-option" style="display: block; width: 100%; margin: 2px 0; padding: 8px;" data-date="' + (new Date(y, 1, 1)).toISOString() + '" data-mode="year">' + y + '</button>';
                                        }
                                        $t.popover({ content: s, html: true, placement: 'auto top' }).popover('toggle');
                                        return false;
                                    });*/ /*.on('click', '.event', function () {
                                        var $t = $(this),
                                            index = +($t.attr('data-index')),
                                            haspop = $t.data('popover'),
                                            data, time;

                                        if (haspop || isNaN(index)) { return true; }
                                        data = options.data[index];
                                        time = data.start.toTimeString();
                                        if (time && data.end) { time = time + ' - ' + data.end.toTimeString(); }
                                        $t.data('popover', true);
                                        $t.popover({ content: '<p><strong>' + time + '</strong></p>' + data.text, html: true, placement: 'auto left' }).popover('toggle');
                                        return false;
                                    });*/
                function dayAddEvent(index, event) {
                    if (!!event.allDay) {
                        monthAddEvent(index, event);
                        return;
                    }

                    //console.log('Day Event: ' + index + ' --- ' + JSON.stringify(event));

                    var titleArray = event.title.split('&nbsp;');
                    var cleanTitle = titleArray && titleArray.length > 1 ? titleArray[1] : event.title;
                    var $event = $('<div/>', { 'class': 'event', text: event.title, title: cleanTitle, 'data-index': index, 'data-json': JSON.stringify(event) });
                    $event.html(event.title);
                    var start = new Date(event.start),
                        end = new Date(event.end) || start,
                        time = new Date(event.start).toTimeString(),
                        hour = start.getHours(),
                        timeclass = '.time-22-0',
                        startint = start.toDateInt(),
                        dateint = options.date.toDateInt(),
                        endint = end.toDateInt();

                    if (startint > dateint || endint < dateint) { return; }

                    if (!!time && options.showTimeInEvent) {
                        $event.html('<strong>' + time + '</strong> ' + $event.html());
                    }
                    //$event.toggleClass('begin', startint === dateint);
                    //$event.toggleClass('end', endint === dateint);
                    $event.css(getEventBaseCssStyle(event, startint === dateint, endint === dateint));
                    
                    // Apply border class if eventBorder is enabled
                    if (options.eventBorder) {
                        $event.addClass('event-with-border');
                    }

                    console.log('Hour: ' + hour);

                    if (options.showDayAsAllDayEvents) {
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
                    $(timeclass).append($event);
                }

                function monthAddEvent(index, event) {
                    var titleArray = event.title.split('&nbsp;');
                    var cleanTitle = titleArray && titleArray.length > 1 ? titleArray[1] : event.title;
                    var $event = $('<div/>', { 'class': 'event', text: event.title, title: cleanTitle, 'data-index': index, 'data-json': JSON.stringify(event) });
                    $event.html(event.title);
                    var e = new Date(event.start),
                        dateclass = e.toDateCssClass(),
                        day = $('.' + e.toDateCssClass()),
                        empty = $('<div/>', { 'class': 'clear event js-cal-option', html: ' ' }),
                        numbevents = 0,
                        time = new Date(event.start).toTimeString(),
                        endday = event.end && $('.' + new Date(event.end).toDateCssClass()).length > 0,
                        checkanyway = new Date(e.getFullYear(), e.getMonth(), e.getDate() + 40),
                        existing,
                        i;

                    
                    //$event.toggleClass('all-day', !!event.allDay);
                    //console.log('Event index: ' + index + ' obj1: ' + $event.outerHTML() + ' event: ' + JSON.stringify(event));
                    if (!!time && options.showTimeInEvent) {
                        $event.html('<strong>' + time + '</strong> ' + $event.html());
                    }
                    if (!event.end) {
                        //$event.addClass('begin end');
                        $('.' + new Date(event.start).toDateCssClass()).append($event);
                        return;
                    }

                    while (e <= new Date(event.end) && (day.length || endday || options.date < checkanyway)) {
                        if (day.length) {
                            if (e && e.getDay() == 0) { // reset on Sundays or else the cleat items would pile up on subsequent weeks if there is enough multi-day items
                                numbevents = 0;
                            }
                            existing = day.find('.event').length;
                            numbevents = Math.max(numbevents, existing);
                            for (i = 0; i < numbevents - existing; i++) {
                                var emptyClone = empty.clone();
                                // Apply placeholder border class to maintain alignment when eventBorder is enabled
                                if (options.eventBorder) {
                                    emptyClone.addClass('placeholder-with-border');
                                }
                                day.append(emptyClone);
                            }
                            // Set css style
                            $event.css(getEventBaseCssStyle(event, dateclass === new Date(event.start).toDateCssClass(), dateclass === new Date(event.end).toDateCssClass()));
                            
                            // Apply border class if eventBorder is enabled
                            if (options.eventBorder) {
                                $event.addClass('event-with-border');
                            }
                            day.append($event);
                            day.append(
                                $event.
                                    toggleClass('begin', dateclass === new Date(event.start).toDateCssClass()).
                                    toggleClass('end', dateclass === new Date(event.end).toDateCssClass())
                            );
                            $event = $event.clone();
                            $event.html(' ');
                        }
                        e.setDate(e.getDate() + 1);
                        dateclass = e.toDateCssClass();
                        //console.log('Date Class: ' + dateclass);
                        day = $('.' + dateclass);
                    }
                }
                function yearAddEvents(events, year) {
                    var counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    $.each(events, function (i, v) {
                        if (new Date(v.start).getFullYear() === year) {
                            //counts[new Date(v.start).getMonth()]++;
                        }
                    });
                    $.each(counts, function (i, v) {
                        if (v !== 0) {
                            $('.month-' + i).append('<span class="badge">' + v + '</span>');
                        }
                    });
                }

                function draw() {
                    $el.html(t(options));
                    
                    // Add background class if showBackground option is true
                    if (options.showBackground) {
                        $el.addClass('calendar-with-background');
                        
                        // Apply custom background colors if provided
                        if (options.headerBackgroundColor) {
                            $el.find('.calendar-table thead td, .calendar-table thead .c-name').css('background-color', options.headerBackgroundColor);
                        }
                        
                        if (options.bodyBackgroundColor) {
                            $el.find('.calendar-day').css('background-color', options.bodyBackgroundColor);
                            $el.find('.calendar-table').css('background-color', options.bodyBackgroundColor);
                        }
                    } else {
                        $el.removeClass('calendar-with-background');
                        // Remove any custom background colors
                        $el.find('.calendar-table thead td, .calendar-table thead .c-name, .calendar-day, .calendar-table').css('background-color', '');
                    }
                    
                    //potential optimization (untested), this object could be keyed into a dictionary on the dateclass string; the object would need to be reset and the first entry would have to be made here
                    $('.' + (new Date()).toDateCssClass()).addClass('today');
                    if (options.data && options.data.length) {
                        if (options.mode === 'year') {
                            yearAddEvents(options.data, options.date.getFullYear());
                        } else if (options.mode === 'month' || options.mode === 'week') {
                            $.each(options.data, monthAddEvent);
                        } else {
                            $.each(options.data, dayAddEvent);
                        }
                    }
                    
                    // Trigger stateChange callback after calendar is drawn
                    if (options.stateChange && typeof options.stateChange === 'function') {
                        options.stateChange({
                            mode: options.mode,
                            date: options.date,
                            showBackground: options.showBackground,
                            showTimeInEvent: options.showTimeInEvent,
                            useShortDays: options.useShortDays,
                            showDayAsAllDayEvents: options.showDayAsAllDayEvents,
                            eventBorder: options.eventBorder,
                            showTodayButton: options.showTodayButton,
                            showMonthYear: options.showMonthYear,
                            showModeButtons: options.showModeButtons,
                            todayname: options.todayname,
                            monthText: options.monthText,
                            weekText: options.weekText,
                            dayText: options.dayText,
                            days: options.days,
                            shortDays: options.shortDays,
                            months: options.months,
                            shortMonths: options.shortMonths
                        });
                    }
                }

                draw();

                function eventCallback(newData) {
                    //console.log('newData: ' + JSON.stringify(newData));
                    options.data = newData;
                    draw();
                    
                    // Reopen year dropdown if flag is set
                    if (options.keepYearDropdownOpen) {
                        $('.year-dropdown-menu').show();
                        options.keepYearDropdownOpen = false; // Reset the flag
                    }
                }

                function getEventBaseCssStyle(event, isBegin, isEnd) {
                    var baseColor = (' ' + event.backgroundColor).slice(1);
                    var colorRgb = hexToRgb(baseColor);
                    
                    if (colorRgb) {
                        var newColor = { r: Math.abs(colorRgb.r - 32), g: Math.abs(colorRgb.g - 15), b: Math.abs(colorRgb.b - 7) };
                        var borderColor = { r: Math.abs(newColor.r - 100), g: Math.abs(newColor.g - 100), b: Math.abs(newColor.b - 100) };

                        //console.log('color: ' + baseColor + ' [ ' + JSON.stringify(colorRgb) + ' back: ' + rgbToHex(colorRgb) + ' ] | newColor: ' + JSON.stringify(newColor) + ' | borderColor: ' + JSON.stringify(borderColor));

                        var finalCss = {
                            'background-image': 'linear-gradient(to bottom, ' + rgbToHex(newColor) + ' 0px, ' + event.backgroundColor + ' 100%)',
                            'background-repeat': 'repeat-x',
                            'color': rgbToHex(borderColor)
                        };
                        
                        // Handle rounded corners for all events (with or without borders)
                        if (isBegin && isEnd) {
                            // Single day event - full rounded corners
                            finalCss['border-radius'] = '4px';
                        } else if (isBegin) {
                            // First day of multi-day event - left rounded corners only
                            finalCss['border-top-left-radius'] = '4px';
                            finalCss['border-bottom-left-radius'] = '4px';
                            finalCss['border-top-right-radius'] = '0';
                            finalCss['border-bottom-right-radius'] = '0';
                        } else if (isEnd) {
                            // Last day of multi-day event - right rounded corners only
                            finalCss['border-top-left-radius'] = '0';
                            finalCss['border-bottom-left-radius'] = '0';
                            finalCss['border-top-right-radius'] = '4px';
                            finalCss['border-bottom-right-radius'] = '4px';
                        } else {
                            // Middle days of multi-day event - no rounded corners
                            finalCss['border-radius'] = '0';
                        }
                        
                        
                        return finalCss;
                    }
                    return {};
                }

                function hexToRgb(hex) {
                    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                    return result ? {
                        r: parseInt(result[1], 16),
                        g: parseInt(result[2], 16),
                        b: parseInt(result[3], 16)
                    } : null;
                }

                function rgbToHex(color) {
                    return '#' + (1 << 24 | color.r << 16 | color.g << 8 | color.b).toString(16).slice(1);
                }

            }

            

            ; (function (defaults, $, window, document) {
                $.extend({
                    calendar: function (options) {
                        return $.extend(defaults, options);
                    }
                }).fn.extend({
                    calendar: function (options) {
                        options = $.extend({}, defaults, options);
                        return $(this).each(function () {
                            var $this = $(this);
                            calendar($this, options);
                        });
                    }
                });
            })({
                days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                date: (new Date()),
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
                data: []
            }, jQuery, window, document);

        })(jQuery);
    });
