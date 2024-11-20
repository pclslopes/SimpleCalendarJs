

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
    <table class="calendar-table table table-condensed table-tight">
      <thead>
        <tr>
          <td colspan="7" style="text-align: center">
            <table style="white-space: nowrap; width: 100%">
              <tr>
                <td style="text-align: left;">
                  <span class="btn-group">
                    <button class="js-cal-prev btn btn-outline-primary"><i class="fa-solid fa-chevron-left"></i></button>
                    <button class="js-cal-next btn btn-outline-primary"><i class="fa-solid fa-chevron-right"></i></button>
                  </span>
                  <button class="js-cal-option btn button btn-today text-left {{: first.toDateInt() <= today.toDateInt() && today.toDateInt() <= last.toDateInt() ? 'btn-primary':'btn-outline-primary' }}" data-date="{{: today.toISOString()}}" data-mode="month">{{: todayname }}</button>
                </td>
                <td>
                  <span class="btn-group btn-group">
                    {{ if (mode !== 'day') { }}
                      {{ if (mode === 'month') { }}<span class="js-cal-option btn button btn-primary" data-mode="year">{{: months[month] }}</span>{{ } }}
                      {{ if (mode ==='week') { }}
                        <span class="btn btn-primary">{{: shortMonths[first.getMonth()] }} {{: first.getDate() }} - {{: shortMonths[last.getMonth()] }} {{: last.getDate() }}</span>
                      {{ } }}
                      <span class="js-cal-years btn btn-primary">{{: year}}</span>
                    {{ } else { }}
                      <span class="btn btn-primary">{{: date.toDateString() }}</span>
                    {{ } }}
                  </span>
                </td>
                <td style="text-align: right">
                  <span class="btn-group">
                    <button class="js-cal-option btn button {{: mode==='year'? ' btn-primary':'btn-outline-primary' }}" data-mode="year">Year</button>
                    <button class="js-cal-option btn button {{: mode==='month'? ' btn-primary':'btn-outline-primary' }}" data-mode="month">Month</button>
                    <button class="js-cal-option btn button {{: mode==='week'? ' btn-primary':'btn-outline-primary' }}" data-mode="week">Week</button>
                    <button class="js-cal-option btn button {{: mode==='day'? ' btn-primary':'btn-outline-primary' }}" data-mode="day">Day</button>
                  </span>
                </td>
              </tr>
            </table>

          </td>
        </tr>
      </thead>
      {{ if (mode ==='year') {
        month = 0;
      }}
      <tbody>
        {{ for (j = 0; j < 3; j++) { }}
        <tr>
          {{ for (i = 0; i < 4; i++) { }}
          <td class="calendar-month month-{{:month}} js-cal-option button" data-date="{{: new Date(year, month, 1).toISOString() }}" data-mode="month">
            <span style="cursor: pointer;">
                {{: months[month] }}
                {{ month++;}}
            </span>
          </td>
          {{ } }}
        </tr>
        {{ } }}
      </tbody>
      {{ } }}
      {{ if (mode ==='month' || mode ==='week') { }}
      <thead>
        <tr class="c-weeks">
          {{ for (i = 0; i < 7; i++) { }}
            <th class="c-name">
              {{: days[i] }}
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
          <td class="calendar-day {{: dayclass }} {{: thedate.toDateCssClass() }} {{: today.toDateCssClass() === thedate.toDateCssClass() ? 'currentdate':'' }} {{: daycss[i] }} js-cal-option add-day" data-date="{{: thedate.toISOString() }}">
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
            <table class="table table-striped table-condensed table-tight-vert" >
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
            
            $el.on('click', '.js-cal-prev', function () {
                console.log('>> click | .js-cal-prev');
                // Previous button was pressed
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

                // Get new data through the callback
                options.events({ defaultDate: new Date(dateCopy), start: new Date(startDate), end: new Date(endDate) }, eventCallback);

            }).on('click', '.js-cal-next', function () {
              console.log('>> click | .js-cal-next');
                // Next button was pressed
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

                // Get new data through the callback
                options.events({ defaultDate: new Date(dateCopy), start: new Date(startDate), end: new Date(endDate) }, eventCallback);

            }).on('click', '.js-cal-option', function () {
              console.log('>> click | .js-cal-option');
                // A calendar option button was pressed: today, day, month, year, week
                var dateParam = { monthDate: options.date };
                var $t = $(this), o = $t.data();
                if (o.date) { o.date = new Date(o.date); }
                $.extend(options, o);
                dateParam.dateClick = o.date;
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
            }).on('click', '.event', function () {
              console.log('>> click | .event');
                if (!$(this).hasClass('js-cal-option')) {
                    var eventObj = { event: $(this).data('json'), monthDate: options.date };
                    options.eventClick(eventObj);       
                }
                return false;
            })
                    ; /*.on('click', '.js-cal-years', function () {
                                    alert('here');
                                    var $t = $(this),
                                        haspop = $t.data('popover'),
                                        s = '',
                                        y = options.date.getFullYear() - 2,
                                        l = y + 5;
                                    if (haspop) { return true; }
                                    for (; y < l; y++) {
                                        s += '<button type="button" class="btn btn-default btn-lg btn-block js-cal-option" data-date="' + (new Date(y, 1, 1)).toISOString() + '" data-mode="year">' + y + '</button>';
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
                    empty = $('<div/>', { 'class': 'clear event', html: ' ' }),
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
                        existing = day.find('.event').length;
                        numbevents = Math.max(numbevents, existing);
                        for (i = 0; i < numbevents - existing; i++) {
                            day.append(empty.clone());
                        }
                        // Set css style
                        $event.css(getEventBaseCssStyle(event, dateclass === new Date(event.start).toDateCssClass(), dateclass === new Date(event.end).toDateCssClass()));
                        day.append($event);
                        /*day.append(
                            $event.
                                toggleClass('begin', dateclass === new Date(event.start).toDateCssClass()).
                                toggleClass('end', dateclass === new Date(event.end).toDateCssClass())
                        );*/
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
            }

            draw();

            function eventCallback(newData) {
                //console.log('newData: ' + JSON.stringify(newData));
                options.data = newData;
                draw();

            }

            function setOptions(newOptions){
              options = newOptions;
              draw();
            }

            function getEventBaseCssStyle(event, isBegin, isEnd) {
                var baseColor = (' ' + event.backgroundColor).slice(1);
                var colorRgb = hexToRgb(baseColor);
                
                if (colorRgb) {
                    var newColor = { r: Math.abs(colorRgb.r - 32), g: Math.abs(colorRgb.g - 15), b: Math.abs(colorRgb.b - 7) };
                    var borderColor = { r: Math.abs(newColor.r - 100), g: Math.abs(newColor.g - 100), b: Math.abs(newColor.b - 100) };

                    //console.log('color: ' + baseColor + ' [ ' + JSON.stringify(colorRgb) + ' back: ' + rgbToHex(colorRgb) + ' ] | newColor: ' + JSON.stringify(newColor) + ' | borderColor: ' + JSON.stringify(borderColor));

                    var finalCss = {
                        'border-top': '1px solid ' + rgbToHex(borderColor),
                        'border-bottom': '1px solid ' + rgbToHex(borderColor),
                        'background-image': 'linear-gradient(to bottom, ' + rgbToHex(newColor) + ' 0px, ' + event.backgroundColor + ' 100%)',
                        'background-repeat': 'repeat-x',
                        'color': rgbToHex(borderColor),
                        'border-width': '1px',
                        // Begin Event Css
                        'border-left': isBegin ? '1px solid ' + rgbToHex(borderColor) : '',
                        'border-top-left-radius': isBegin ? '4px' : '',
                        'border-bottom-left-radius': isBegin ? '4px' : '',
                        // End Event Css
                        'border-right': isEnd ? '1px solid ' + rgbToHex(borderColor) : '',
                        'border-top-right-radius': isEnd ? '4px' : '',
                        'border-bottom-right-radius': isEnd ? '4px' : ''
                    };
                    
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

        }; 
        
        (function (defaults, $, window, document) {
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
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            date: (new Date()),
            daycss: ["c-sunday", "", "", "", "", "", "c-saturday"],
            todayname: "Today",
            thismonthcss: "current",
            lastmonthcss: "outside",
            nextmonthcss: "outside",
            mode: "month",
            data: []
        }, jQuery, window, document);

    })(jQuery);
});
