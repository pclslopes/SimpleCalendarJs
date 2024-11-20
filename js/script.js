var currentDate = new Date();

 
$(document).ready(function () {
    $('#calendar').calendar({
        date: new Date(), // todays date
        showTimeInEvent: true,
        showYears: true,
        showDayAsAllDayEvents: false,
        events: requestData,
        eventClick: function (infoObj) {
            alert('An even was clicked! Event data: ' + JSON.stringify(infoObj));
            //displaySpinner();
            //var url = '@Html.Raw(Url.Action("Upsert", "CalendarItem", new { id = "_id", date = "_date", monthDate = "_monthDate" }))';
            //var id = infoObj.event.Id;
            //var urlWithParams = url.replace('_id', id).replace('_date', moment(infoObj.date).format('YYYY-MM-DD')).replace('_monthDate', moment(infoObj.monthDate).format('YYYY-MM-DD'));
            //window.location.href = urlWithParams;
        },

        dayClick: function (dateObj) {
            alert('A day was clicked! Date Obj: ' + JSON.stringify(dateObj));
            /*if (dateObj.monthDate) {
                //displaySpinner();
                var url = '@Html.Raw(Url.Action("Upsert", "CalendarItem", new { date = "_valueToReplace", monthDate = "_monthDateToReplace" }))';
                var urlWithValue = url.replace('_valueToReplace', moment(dateObj.dateClick).format('YYYY-MM-DD'));
                urlWithValue = urlWithValue.replace('_monthDateToReplace', moment(dateObj.monthDate).format('YYYY-MM-DD'));
                window.location.href = urlWithValue;
            }*/
        },
        data: []
    });
});

function requestData(calendarRequestObject, callback) {
    const currentMonth = new Date().getMonth() + 1;
    callback([
        {
          "Id": 1,
          "CalendarItemTypeId": 101,
          "CalendarItemTypeName": "Meeting",
          "title": "📅 Team Standup",
          "text": "Daily standup meeting to discuss progress.",
          "Description": "Daily standup meeting to discuss progress.",
          "start": "2024-" + currentMonth + "-01",
          "end": "2024-" + currentMonth + "-06",
          "backgroundColor": "#dff0d8"
        },
        {
          "Id": 2,
          "CalendarItemTypeId": 102,
          "CalendarItemTypeName": "Deadline",
          "title": "⏰ Project Milestone Due",
          "text": "Submit the project milestone documentation.",
          "Description": "Submit the project milestone documentation.",
          "start": "2024-" + currentMonth + "-03",
          "end": "2024-" + currentMonth + "-07",
          "backgroundColor": "#dec1ff"
        },
        {
          "Id": 3,
          "CalendarItemTypeId": 103,
          "CalendarItemTypeName": "Event",
          "title": "🎉 Team Building Activity",
          "text": "Outdoor activities with the team.",
          "Description": "Outdoor activities with the team.",
          "start": "2024-" + currentMonth + "-05",
          "end": "2024-" + currentMonth + "-07",
          "backgroundColor": "#dff0d8"
        },
        {
          "Id": 4,
          "CalendarItemTypeId": 104,
          "CalendarItemTypeName": "Task",
          "title": "📋 Complete Bug Fixes",
          "text": "Resolve reported issues in the app.",
          "Description": "Resolve reported issues in the app.",
          "start": "2024-" + currentMonth + "-08",
          "end": "2024-" + currentMonth + "-08",
          "backgroundColor": "#f0cea0"
        },
        {
          "Id": 5,
          "CalendarItemTypeId": 105,
          "CalendarItemTypeName": "Meeting",
          "title": "📅 Client Presentation",
          "text": "Present the Q3 project results to the client.",
          "Description": "Present the Q3 project results to the client.",
          "start": "2024-" + currentMonth + "-08",
          "end": "2024-" + currentMonth + "-10",
          "backgroundColor": "#e74c3c"
        },
        {
          "Id": 6,
          "CalendarItemTypeId": 106,
          "CalendarItemTypeName": "Reminder",
          "title": "🔔 Send Progress Update",
          "text": "Email weekly updates to the stakeholders.",
          "Description": "Email weekly updates to the stakeholders.",
          "start": "2024-" + currentMonth + "-10",
          "end": "2024-" + currentMonth + "-12",
          "backgroundColor": "#f0cea0"
        },
        {
          "Id": 7,
          "CalendarItemTypeId": 107,
          "CalendarItemTypeName": "Task",
          "title": "📋 Review Design Proposals",
          "text": "Evaluate new designs for the project.",
          "Description": "Evaluate new designs for the project.",
          "start": "2024-" + currentMonth + "-13",
          "end": "2024-" + currentMonth + "-13",
          "backgroundColor": "#DAF7A6"
        },
        {
          "Id": 8,
          "CalendarItemTypeId": 108,
          "CalendarItemTypeName": "Event",
          "title": "🎉 Product Launch",
          "text": "Launch the new feature update.",
          "Description": "Launch the new feature update.",
          "start": "2024-" + currentMonth + "-15",
          "end": "2024-" + currentMonth + "-23",
          "backgroundColor": "#d9edf7"
        },
        {
          "Id": 9,
          "CalendarItemTypeId": 109,
          "CalendarItemTypeName": "Deadline",
          "title": "⏰ Submit Reports",
          "text": "Prepare and submit monthly reports.",
          "Description": "Prepare and submit monthly reports.",
          "start": "2024-" + currentMonth + "-17",
          "end": "2024-" + currentMonth + "-17",
          "backgroundColor": "#d9edf7"
        },
        {
          "Id": 10,
          "CalendarItemTypeId": 110,
          "CalendarItemTypeName": "Meeting",
          "title": "📅 Budget Planning",
          "text": "Discuss budget allocations for next year.",
          "Description": "Discuss budget allocations for next year.",
          "start": "2024-" + currentMonth + "-17",
          "end": "2024-" + currentMonth + "-17",
          "backgroundColor": "#d9edf7"
        },
        {
          "Id": 11,
          "CalendarItemTypeId": 111,
          "CalendarItemTypeName": "Reminder",
          "title": "🔔 Invoice Payment Due",
          "text": "Pay vendor invoices by EOD.",
          "Description": "Pay vendor invoices by EOD.",
          "start": "2024-" + currentMonth + "-18",
          "end": "2024-" + currentMonth + "-23",
          "backgroundColor": "#FFC300"
        },
        {
          "Id": 12,
          "CalendarItemTypeId": 112,
          "CalendarItemTypeName": "Task",
          "title": "📋 Backup Server Data",
          "text": "Create a backup of all servers.",
          "Description": "Create a backup of all servers.",
          "start": "2024-" + currentMonth + "-20",
          "end": "2024-" + currentMonth + "-23",
          "backgroundColor": "#dff0d8"
        },
        {
          "Id": 13,
          "CalendarItemTypeId": 113,
          "CalendarItemTypeName": "Event",
          "title": "🎉 Thanksgiving Celebration",
          "text": "Office gathering for Thanksgiving.",
          "Description": "Office gathering for Thanksgiving.",
          "start": "2024-" + currentMonth + "-24",
          "end": "2024-" + currentMonth + "-24",
          "backgroundColor": "#DAF7A6"
        },
        {
          "Id": 14,
          "CalendarItemTypeId": 114,
          "CalendarItemTypeName": "Meeting",
          "title": "📅 Annual Review",
          "text": "Discuss yearly achievements and future goals.",
          "Description": "Discuss yearly achievements and future goals.",
          "start": "2024-" + currentMonth + "-26",
          "end": "2024-" + currentMonth + "-26",
          "backgroundColor": "#dec1ff"
        },
        {
          "Id": 15,
          "CalendarItemTypeId": 115,
          "CalendarItemTypeName": "Reminder",
          "title": "🔔 Renew Licenses",
          "text": "Renew all software licenses.",
          "Description": "Renew all software licenses.",
          "start": "2024-" + currentMonth + "-28",
          "end": "2024-" + currentMonth + "-28",
          "backgroundColor": "#e74c3c"
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