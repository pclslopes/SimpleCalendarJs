var currentDate = new Date();
var calendarInstance;

document.addEventListener('DOMContentLoaded', function () {
    // Set current year in footer
    const yearElement = document.querySelector('#current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Initialize month/year controls to current date
    var today = new Date();
    const monthSelect = document.querySelector('#calendarMonth');
    const yearSelect = document.querySelector('#calendarYear');
    
    // Force to October 2025 for testing
    if (monthSelect) monthSelect.value = 9; // October (0-based)
    if (yearSelect) yearSelect.value = 2025;

    // Initialize calendar with default options
    initializeCalendar();

    // Add event listeners for property changes
    setupPropertyControls();
});

function initializeCalendar() {
    // Get current date from controls or default to current date
    const yearControl = document.querySelector('#calendarYear');
    const monthControl = document.querySelector('#calendarMonth');
    const modeControl = document.querySelector('#calendarMode');
    
    var currentYear = parseInt(yearControl?.value) || new Date().getFullYear();
    var currentMonth = parseInt(monthControl?.value) || new Date().getMonth();
    var calendarDate = new Date(currentYear, currentMonth, 1);
    
    const calendarElement = document.querySelector('#calendar');
    if (!calendarElement) {
        console.error('Calendar element not found');
        return;
    }
    
    calendarInstance = new SimpleCalendar(calendarElement, {
        date: calendarDate,
        mode: modeControl?.value || 'month',
        showTimeInEvent: document.querySelector('#showTimeInEvent')?.checked || false,
        showYears: true,
        showDayAsAllDayEvents: document.querySelector('#showDayAsAllDayEvents')?.checked || false,
        eventBorder: document.querySelector('#eventBorder')?.checked || false,
        showTodayButton: document.querySelector('#showTodayButton')?.checked !== false,
        showMonthYear: document.querySelector('#showMonthYear')?.checked !== false,
        showModeButtons: document.querySelector('#showModeButtons')?.checked !== false,
        showNavigation: document.querySelector('#showNavigation')?.checked !== false,
        theme: document.querySelector('#themeMode')?.value || 'auto',
        showBackground: document.querySelector('#showBackground')?.checked || false,
        headerBackgroundColor: document.querySelector('#headerBgColor')?.value,
        bodyBackgroundColor: document.querySelector('#bodyBgColor')?.value,
        useShortDays: document.querySelector('#useShortDays')?.checked || false,
        ...getLanguageSettings(),
        events: requestData,
        eventClick: function (infoObj) {
            alert('Event clicked: ' + JSON.stringify(infoObj));
        },
        dayClick: function (dateObj) {
            // Convert Date object to local date string to avoid timezone issues in JSON
            const localDateStr = dateObj instanceof Date ? 
                dateObj.getFullYear() + '-' + 
                String(dateObj.getMonth() + 1).padStart(2, '0') + '-' + 
                String(dateObj.getDate()).padStart(2, '0') + 
                (dateObj.getHours() > 0 || dateObj.getMinutes() > 0 ? 
                    ' ' + String(dateObj.getHours()).padStart(2, '0') + ':' + String(dateObj.getMinutes()).padStart(2, '0') : 
                    '') : 
                dateObj;
            alert('Day clicked: ' + localDateStr);
        },
        stateChange: function(state) {
            // Sync sandbox controls with calendar state
            syncSandboxControls(state);
        },
        data: []
    });
}

function refreshCalendar() {
    // Destroy current calendar instance if it exists
    if (calendarInstance && calendarInstance.destroy) {
        calendarInstance.destroy();
    }
    
    // Reinitialize with new options
    initializeCalendar();
}

function setupPropertyControls() {
    // Helper function to add event listeners
    const addEventListeners = (selectors, eventType, handler) => {
        selectors.split(',').forEach(selector => {
            const element = document.querySelector(selector.trim());
            if (element) {
                element.addEventListener(eventType, handler);
            }
        });
    };

    // Toggle switches
    addEventListeners('#showBackground, #showTimeInEvent, #useShortDays, #showDayAsAllDayEvents, #eventBorder, #showTodayButton, #showMonthYear, #showModeButtons, #showNavigation', 'change', function() {
        refreshCalendar();
    });

    // Mode selector
    const modeSelector = document.querySelector('#calendarMode');
    if (modeSelector) {
        modeSelector.addEventListener('change', function() {
            refreshCalendar();
        });
    }

    // Theme selector
    const themeSelector = document.querySelector('#themeMode');
    if (themeSelector) {
        themeSelector.addEventListener('change', function() {
            refreshCalendar();
        });
    }

    // Month and year selectors
    addEventListeners('#calendarMonth, #calendarYear', 'change', function() {
        refreshCalendar();
    });

    // Color pickers
    addEventListeners('#headerBgColor, #bodyBgColor', 'change', function() {
        refreshCalendar();
    });

    // Language preset
    const languagePreset = document.querySelector('#languagePreset');
    if (languagePreset) {
        languagePreset.addEventListener('change', function() {
            refreshCalendar();
        });
    }

    // Today button
    const todayButton = document.querySelector('#todayButton');
    if (todayButton) {
        todayButton.addEventListener('click', function() {
            var today = new Date();
            const monthControl = document.querySelector('#calendarMonth');
            const yearControl = document.querySelector('#calendarYear');
            
            if (monthControl) monthControl.value = today.getMonth();
            if (yearControl) yearControl.value = today.getFullYear();
            refreshCalendar();
        });
    }
}

function getLanguageSettings() {
    const languageControl = document.querySelector('#languagePreset');
    var language = languageControl?.value || 'en';
    
    var languages = {
        en: {
            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            todayname: "Today",
            monthText: "Month",
            weekText: "Week",
            dayText: "Day"
        },
        de: {
            days: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
            shortDays: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
            months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
            shortMonths: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
            todayname: "Heute",
            monthText: "Monat",
            weekText: "Woche",
            dayText: "Tag"
        },
        es: {
            days: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
            shortDays: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
            months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
            shortMonths: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
            todayname: "Hoy",
            monthText: "Mes",
            weekText: "Semana",
            dayText: "Día"
        },
        fr: {
            days: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
            shortDays: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
            months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
            shortMonths: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"],
            todayname: "Aujourd'hui",
            monthText: "Mois",
            weekText: "Semaine",
            dayText: "Jour"
        }
    };
    
    return languages[language] || languages.en;
}

function detectLanguageFromState(state) {
    // Simple language detection based on first month name
    if (state.months && state.months[0]) {
        var firstMonth = state.months[0].toLowerCase();
        if (firstMonth === 'januar') return 'de';
        if (firstMonth === 'enero') return 'es';
        if (firstMonth === 'janvier') return 'fr';
    }
    return 'en'; // default to English
}

function syncSandboxControls(state) {
    // Update mode selector to match calendar state
    const modeControl = document.querySelector('#calendarMode');
    if (modeControl) modeControl.value = state.mode;
    
    // Update theme selector to match calendar state
    const themeControl = document.querySelector('#themeMode');
    if (themeControl) themeControl.value = state.theme;
    
    // Update month and year to match calendar state
    if (state.date) {
        const monthControl = document.querySelector('#calendarMonth');
        const yearControl = document.querySelector('#calendarYear');
        
        if (monthControl) monthControl.value = state.date.getMonth();
        if (yearControl) yearControl.value = state.date.getFullYear();
    }
    
    // Update toggle switches to match calendar state
    const updateCheckbox = (selector, value) => {
        const element = document.querySelector(selector);
        if (element) element.checked = value;
    };
    
    updateCheckbox('#showBackground', state.showBackground || false);
    updateCheckbox('#showTimeInEvent', state.showTimeInEvent !== false); // default true
    updateCheckbox('#useShortDays', state.useShortDays || false);
    updateCheckbox('#showDayAsAllDayEvents', state.showDayAsAllDayEvents || false);
    updateCheckbox('#eventBorder', state.eventBorder || false);
    updateCheckbox('#showTodayButton', state.showTodayButton !== false); // default true
    updateCheckbox('#showMonthYear', state.showMonthYear !== false); // default true
    updateCheckbox('#showModeButtons', state.showModeButtons !== false); // default true
    updateCheckbox('#showNavigation', state.showNavigation !== false); // default true
    
    // Detect and update language preset from state
    if (state.months && state.days) {
        var currentLang = detectLanguageFromState(state);
        const languageControl = document.querySelector('#languagePreset');
        if (languageControl) languageControl.value = currentLang;
    }
}

function requestData(calendarRequestObject, callback) {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    callback([
        // Single day events
        {
          "Id": 1,
          "CalendarItemTypeId": 101,
          "CalendarItemTypeName": "Meeting",
          "title": "📅 Single Day Meeting",
          "text": "Regular single day meeting.",
          "Description": "Regular single day meeting.",
          "start": "2025-09-28",
          "end": "2025-10-01",
          "backgroundColor": "#e3f2fd"
        },
        {
          "Id": 2,
          "CalendarItemTypeId": 102,
          "CalendarItemTypeName": "Task",
          "title": "📋 Another Single Day",
          "text": "Another single day event.",
          "Description": "Another single day event.",
          "start": "2025-10-03",
          "end": "2025-10-03",
          "backgroundColor": "#f3e5f5"
        },
        
        // 2-day events
        {
          "Id": 3,
          "CalendarItemTypeId": 103,
          "CalendarItemTypeName": "Workshop",
          "title": "🎯 2-Day Workshop",
          "text": "Two day workshop event.",
          "Description": "Two day workshop event.",
          "start": "2025-10-06",
          "end": "2025-10-07",
          "backgroundColor": "#fff3e0"
        },
        
        // 3-day events
        {
          "Id": 4,
          "CalendarItemTypeId": 104,
          "CalendarItemTypeName": "Conference",
          "title": "🏢 3-Day Conference",
          "text": "Three day conference.",
          "Description": "Three day conference.",
          "start": "2025-10-09",
          "end": "2025-10-11",
          "backgroundColor": "#e8f5e8"
        },
        
        // 5-day event (weekdays)
        {
          "Id": 5,
          "CalendarItemTypeId": 105,
          "CalendarItemTypeName": "Training",
          "title": "📚 5-Day Training Program",
          "text": "Full week training program.",
          "Description": "Full week training program.",
          "start": "2025-10-13",
          "end": "2025-10-17",
          "backgroundColor": "#fce4ec"
        },
        
        // Week-long event (7 days)
        {
          "Id": 6,
          "CalendarItemTypeId": 106,
          "CalendarItemTypeName": "Project",
          "title": "🚀 Week-Long Sprint",
          "text": "Development sprint for one week.",
          "Description": "Development sprint for one week.",
          "start": "2025-10-20",
          "end": "2025-10-26",
          "backgroundColor": "#e1f5fe"
        },
        
        // Overlapping events on same days
        {
          "Id": 7,
          "CalendarItemTypeId": 107,
          "CalendarItemTypeName": "Event",
          "title": "🎉 Overlapping Event A",
          "text": "First overlapping event.",
          "Description": "First overlapping event.",
          "start": "2025-10-14",
          "end": "2025-10-16",
          "backgroundColor": "#ffebee"
        },
        {
          "Id": 8,
          "CalendarItemTypeId": 108,
          "CalendarItemTypeName": "Event",
          "title": "🎪 Overlapping Event B",
          "text": "Second overlapping event.",
          "Description": "Second overlapping event.",
          "start": "2025-10-15",
          "end": "2025-10-17",
          "backgroundColor": "#f3e5f5"
        },
        
        // Cross-week event (spans into next week)
        {
          "Id": 9,
          "CalendarItemTypeId": 109,
          "CalendarItemTypeName": "Project",
          "title": "🌉 Cross-Week Project",
          "text": "Event that spans across weeks.",
          "Description": "Event that spans across weeks.",
          "start": "2025-10-28",
          "end": "2025-11-03",
          "backgroundColor": "#e8eaf6"
        },
        
        // Month boundary event
        {
          "Id": 10,
          "CalendarItemTypeId": 110,
          "CalendarItemTypeName": "Milestone",
          "title": "📅 Month Boundary Event",
          "text": "Event crossing month boundary.",
          "Description": "Event crossing month boundary.",
          "start": "2025-10-30",
          "end": "2025-11-02",
          "backgroundColor": "#fff8e1"
        },
        
        // Events with time (should still work)
        {
          "Id": 11,
          "CalendarItemTypeId": 111,
          "CalendarItemTypeName": "Meeting",
          "title": "⏰ Timed Multi-Day",
          "text": "Multi-day event with specific times.",
          "Description": "Multi-day event with specific times.",
          "start": "2025-10-22T09:00:00",
          "end": "2025-10-24T17:00:00",
          "backgroundColor": "#e0f2f1"
        },
        
        // Very long event (2 weeks)
        {
          "Id": 12,
          "CalendarItemTypeId": 112,
          "CalendarItemTypeName": "Vacation",
          "title": "🏖️ Two Week Vacation",
          "text": "Extended vacation period.",
          "Description": "Extended vacation period.",
          "start": "2025-10-04",
          "end": "2025-10-18",
          "backgroundColor": "#fff9c4"
        },
        
        // Test event for literal date handling (should end on October 21)
        {
          "Id": 13,
          "CalendarItemTypeId": 113,
          "CalendarItemTypeName": "Test",
          "title": "🧪 Date Test Event",
          "text": "Event to test literal date handling - should end on Oct 21.",
          "Description": "Event to test literal date handling - should end on Oct 21.",
          "start": "2025-10-19",
          "end": "2025-10-21",
          "backgroundColor": "#ff6b6b"
        }
      ]);
    /*displaySpinner();
    var startDate = new Date(calendarRequestObject.start);
    var endDate = new Date(calendarRequestObject.end);
    currentDate = new Date(calendarRequestObject.defaultDate);

    var url = '@Html.Raw(@Url.Action("GetCalendarData", "Calendar", new { start = "_start", end = "_end", filters = Json.Encode(ViewBag.FilterTypes) }))';
    var urlWithParams = url.replace('_start', moment(startDate).format('YYYY-MM-DD'));
    urlWithParams = urlWithParams.replace('_end', moment(endDate).format('YYYY-MM-DD'));

    $.ajax({
        url: urlWithParams,
        type: "GET",
        dataType: "JSON",

        success: function (data) {
            hideSpinner();
            callback(data);
        }
    });*/
}

function applyFilter(filter) {
    displaySpinner();
    var link = '@Html.Raw(@Url.Action("Index", "Calendar", new { date = "_date", filters = Json.Encode(ViewBag.FilterTypes), filter = "_filter" }))';
    link = link.replace("_date", moment(currentDate).format('MM-DD-YYYY')).replace('_filter', filter);
    window.location.href = link;
}

function callOpenInstructions() {
    let formModalObject = {
        formUrl: '@Url.Action("Instructions", "Calendar")',
        title: 'Calendar Instructions'//,
        //formId: null,
        //postUrl: null,
        //redirectUrl: null,
        //modalSize: 'modal-sm'
    };

    openFormModal(formModalObject);
}