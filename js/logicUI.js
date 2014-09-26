$( document ).ready(function() {
    
    //Tooltip code moved to d3.json() in main.js for explorer compatibility

    $("button").click(function(){
        $("button").removeClass("active-button");
        $(this).addClass("active-button");
    });
}); 

function tipInfo(d) {
    var powerRound = Math.round(d[0].power * 100) / 100;
    var week = {'1': 'Monday', '2': 'Tuesday', '3':'Wednesday', '4':'Thursday', '5':'Friday', '6':'Satuday', '7':'Sunday'};
    var month = {'1': 'January', '2': 'February', '3': 'March', '4': 'April', '5': 'May', '6': 'June', '7': 'July',
    '8': 'August', '9': 'September', '10': 'October', '11': 'November', '12': 'December'};
    if (view === 'matrix') {
        return 'Power: <b>' + powerRound + '</b> kW/h <br>' + month[d[indx].month] + '<br>' + week[d[indx].dayInWeek];
    }
}

function updateExplanation() {
    $("#textExplanation").replaceWith(function() {         
        if (view === 'matrix') {
            return '<p id="textExplanation">The original data is organized in a matrix where each column corresponds' +
            ' with a day of the week and each row is a different week. In the visualization, each datum is represented'+
            ' with a circle which size and color is proportional to the energy used that day. <br> Move the mouse over the circles to view detailed information, or zoom and pan to explore the data. </p>';
        }
        else if (view === 'daysYear') {
            return '<p id="textExplanation">Days of the year sorted chronologically forming a circumference. Starting from the top, the days advance clockwise direction. <br>Some data are missed due to holidays periods or other reasons.</p>';
        }
        else if (view === 'monthsYear') {
            return '<p id="textExplanation">Each circumference represents the days of the month. August clearly shows indexes of consumption lower than the remaining months.</p>';
        }
        else if (view === 'daysWeek') {
            return '<p id="textExplanation">Fourth text</p>';
        }
        else if (view === 'daysMonth') {
            return '<p id="textExplanation">The final one.</p>';
        }
    }); 
}

