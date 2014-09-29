$( document ).ready(function() {
    
    //Tooltip code moved to d3.json() in main.js for explorer compatibility

    $("button").click(function(){
        $("button").removeClass("active-button");
        $(this).addClass("active-button");
    });
}); 

function tipInfo(d) {
    var powerRound = Math.round(d[0].power * 100) / 100;
    var week = {'1': 'Monday', '2': 'Tuesday', '3':'Wednesday', '4':'Thursday', '5':'Friday', '6':'Saturday', '7':'Sunday'};
    var month = {'1': 'January', '2': 'February', '3': 'March', '4': 'April', '5': 'May', '6': 'June', '7': 'July',
    '8': 'August', '9': 'September', '10': 'October', '11': 'November', '12': 'December'};
    if (view === 'matrix') {
        return 'Power: <b>' + powerRound + '</b> kW/h <br>' + month[d[indx].month] + '<br>' + week[d[indx].dayInWeek];
    }
    else if (view === 'daysYear') {
        return 'Power: <b>' + powerRound + '</b> kW/h <br>' + month[d[indx].month] + '<br>' + week[d[indx].dayInWeek];
    }
    else if (view === 'monthsYear') {
        return 'Power: <b>' + powerRound + '</b> kW/h <br>' + month[d[indx].month] + '<br>' + week[d[indx].dayInWeek];
    }
    else if (view === 'daysWeek') {
        return 'Power: <b>' + powerRound + '</b> kW/h <br>Hour: ' + d[indx].hour + '<br>' + week[d[indx].dayInWeek];
    }
    else if (view === 'daysMonth') {
        return 'Power: <b>' + powerRound + '</b> kW/h <br>Hour: ' + d[indx].hour + '<br>Day of the month: ' + d[indx].dayInMonth;
    }
}

function updateExplanation() {
    $("#textExplanation").replaceWith(function() {         
        if (view === 'matrix') {
            return '<p id="textExplanation">The original data is organized in a matrix where each column corresponds' +
            ' with a day of the week and each row with a week. In the visualization, each datum is represented'+
            ' with a circle which size and color is proportional to the energy used that day. <br> Move the mouse over the circles to view detailed information, or zoom and pan to explore the data. </p>';
        }
        else if (view === 'daysYear') {
            return '<p id="textExplanation">Days of the year sorted chronologically forming a circumference. Starting from the top, the days advance in clockwise direction. <br>Some data are missed due to holidays periods or other reasons.</p>';
        }
        else if (view === 'monthsYear') {
            return '<p id="textExplanation">Each circumference represents the days of the month. <br>During the holiday months (July and August), it is observed a decrease in the power consumption.</p>';
        }
        else if (view === 'daysWeek') {
            return '<p id="textExplanation">The days of the week are represented by seven circumferences (one per day). Each point shows the power consumption in an hour of the day.' + 
            '<br>The maximum consumption occurs during the standard working hours (from 8:00 to 19:00), especially before the lunch break.</p>';
        }
        else if (view === 'daysMonth') {
            return '<p id="textExplanation">Hourly consumption represented in the different days of the month..</p>';
        }
    }); 
}

