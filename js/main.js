var svg = d3.select("#vis").append("svg"),
    margin = {top: 50, bottom: 50, left: 50, right: 50},
    height = 550,
    width = 850,
    duration = 2500,
    view = 'matrix',
    indx = 0;

var rDaysYear = 200,
    rMonthsYearOuter = 200,
    rMonthsYearInner = 30,
    rDaysWeekOuter = 170,
    rDaysWeekInner = 44,
    rDaysMonthOuter = 200,
    rDaysMonthInner = 10;

var disHor_daysYear = (width/2) - rDaysYear,
    disVer_daysYear = (height/2) - rDaysYear,
    disHor_monthsYear = (width/2) - rMonthsYearOuter - rMonthsYearInner,
    disVer_monthsYear = (height/2) - rMonthsYearOuter - rMonthsYearInner,
    disHor_daysWeek = (width/2) - rDaysWeekOuter - rDaysWeekInner,
    disVer_daysWeek = (height/2) - rDaysWeekOuter - rDaysWeekInner,
    disHor_daysMonth = (width/2) - rDaysMonthOuter - rDaysMonthInner,
    disVer_daysMonth = (height/2) - rDaysMonthOuter - rDaysMonthInner;

var powerJsonSimple = [],
    powerDay = [],
    powerWeekHour = [],
    powerMonthHour = [],
    powerData = [];

var zoomBehav = d3.behavior.zoom();

svg.attr("height", height)
    .attr("width", width)
    .call( 
        zoomBehav
            .scaleExtent([1, 10])
            .on("zoom", zoom)
    );

//var maxPowerDay = Math.max.apply(Math,powerDay.map(function(o){return o.power;}));
var maxPowerDay = 5394,
    minPowerDay = 1931,
    maxPowerWeekHour = 7896,
    minPowerWeekHour = 3411,
    maxPowerMonthHour = 2321,
    minPowerMonthHour = 477;


var colorsBlue2Pink = ['#17c7de', '#4aa5be', '#7588a2', '#a66782', '#c25470', '#dd415f', '#ef3552'];

var colorDay = d3.scale.linear()
    .domain(linspace(minPowerDay, maxPowerDay, colorsBlue2Pink.length))
    .range(colorsBlue2Pink);

var colorWeekHour = d3.scale.linear()
    .domain([minPowerWeekHour, 5000, maxPowerWeekHour])
    .range(['#ffeda0', '#feb24c', '#f03b20']);

var colorMonthHour = d3.scale.linear()
    .domain([minPowerMonthHour, 1200, maxPowerMonthHour])
    .range(['#ffeda0', '#feb24c', '#f03b20']);

function color(power) {
    if (indx === 0) {
        col = colorDay(power);
    }
    else if (indx === 1){
        col = colorWeekHour(power);
    }
    else {
        col = colorMonthHour(power);
    }
    return col;
}

function linspace(xi, xf, n) {
    var l = xf - xi;
    var increment = l / (n-1);
    var vect = [];
    vect.push(xi);
    for (var i = 0; i < n - 1; i++) {
        vect.push(vect[i] + increment);           
    }; 

    return vect;    
}

var sizeDay = d3.scale.linear()
    .domain([minPowerDay, maxPowerDay])
    .range([5, 15]);

var sizeWeekHour = d3.scale.linear()
    .domain([minPowerWeekHour, maxPowerWeekHour])
    .range([5, 15]);

var sizeMonthHour = d3.scale.linear()
    .domain([minPowerMonthHour, maxPowerMonthHour])
    .range([5, 15]);


function size(power) {
    if (indx === 0) {
        r = sizeDay(power);
    }
    else if (indx === 1) {
        r = sizeWeekHour(power);
    }
    else {
        r = sizeMonthHour(power);
    }
    return r;
}

var xMatrixScale = d3.scale.linear()
    .domain([1, 7])
    .range([0 + margin.left, width - margin.right]);

var yMatrixScale = d3.scale.linear()
    .domain([0, 364])
    .range([0 + margin.top, height - margin.bottom]);

var xCoor = d3.scale.linear()
    .domain([-1, 1])
    .range([0, 2]);

var yCoor = d3.scale.linear()
    .domain([1,-1])
    .range([0, 2]);

var mapToCircle = function (rad, nPoints, point) {
    var angle = (Math.PI/2) - (((2 * Math.PI) / nPoints) * point);
    var xPos = xCoor(Math.cos(angle)) * rad;
    var yPos = yCoor(Math.sin(angle)) * rad; 
    return [+xPos.toFixed(3), +yPos.toFixed(3)];
};


d3.json("data/powerConsumpData.json", function(powerJson) {

    //var powerJsonSimple = powerJson.filter(function(element) { return element.month === 7; }); 
    //powerJsonSimple = powerJson;//.slice(0,1200); 

    powerDay.push(clone(powerJson[0])); // The first pattern is added two times!?!?!!!
    for (var i = 0; i <= powerJson.length - 1; i++) {
        for (var j = 0; j <= powerDay.length - 1; j++) {
            if (powerDay[j].day === powerJson[i].day) {
                powerDay[j].power += powerJson[i].power;
                break;
            }
            else if (j === (powerDay.length - 1)){
                powerDay.push(clone(powerJson[i]));
                break;
            }
        };     
    };

    powerWeekHour.push(clone(powerJson[0]));
    for (var i = 0; i <= powerJson.length - 1; i++) {
        for (var j = 0; j <= powerWeekHour.length - 1; j++) {
            if (powerWeekHour[j].dayInWeek === powerJson[i].dayInWeek &
                powerWeekHour[j].hour === powerJson[i].hour) {
                powerWeekHour[j].power += powerJson[i].power;
                break;
            }
            else if (j === (powerWeekHour.length - 1)){
                powerWeekHour.push(clone(powerJson[i]));
                break;
            }
        };     
    }

    powerMonthHour.push(clone(powerJson[0]));
    for (var i = 0; i <= powerJson.length - 1; i++) {
        for (var j = 0; j <= powerMonthHour.length - 1; j++) {
            if (powerMonthHour[j].dayInMonth === powerJson[i].dayInMonth &
                powerMonthHour[j].hour === powerJson[i].hour) {
                powerMonthHour[j].power += powerJson[i].power;
                break;
            }
            else if (j === (powerMonthHour.length - 1)){
                powerMonthHour.push(clone(powerJson[i]));
                break;
            }
        };     
    }

    powerData.push([clone(powerDay[0]), clone(powerWeekHour[0]), clone(powerMonthHour[0])]);
    var j = 0;
    var k = 0;
    for (var i = 0; i <= powerMonthHour.length -1; i++) {
        powerData.push([clone(powerDay[j]), clone(powerWeekHour[k]), clone(powerMonthHour[i])]);
        j === powerDay.length - 1 ? j = 0 : j++; // REPASAR EL -1
        k === powerWeekHour.length - 1 ? k = 0 : k++;
    }

    d3.select("svg")
        .selectAll("circle")
        .data(powerData, function(d, i) { return i; })
      .enter()
        .append("circle")
        .style("fill", function(d) { return color(d[0].power); })
        .attr("r", function(d) { return size(d[0].power); })
        .attr("cx", function(d) { 
            return xPos(d[indx]);
        })
        .attr("cy", function(d) { return yPos(d[indx]); });

});



function renderData() {
    d3.select("svg").selectAll("circle")
      .transition().duration(duration)
        .attr("cx", function(d) { return xPos(d[indx]); })
        .attr("cy", function(d) { return yPos(d[indx]); })
        .attr("r", function(d) { return size(d[indx].power); })
        .style("fill", function(d) { return color(d[indx].power); });
    
    zoomBehav.scale(1);
    zoomBehav.translate([0, 0]);
}

function viewMatrix() {
    view = "matrix";
    indx = 0;
    renderData();
}

function viewDaysYear() {
    view = "daysYear";
    indx = 0;
    renderData();
}

function viewMonthsYear() {
    view = "monthsYear";
    indx = 0;
    renderData();
}

function viewDaysWeek() {
    view = "daysWeek";
    indx = 1;
    renderData();
}

function viewDaysMonth() {
    view = "daysMonth";
    indx = 2;
    renderData();
}




function xPos(d) {
    if (view === "matrix") {
        return xMatrixScale(d.dayInWeek);
    }
    
    else if (view === "daysYear") {
        var pos = mapToCircle(rDaysYear, 365, (30 * (d.month - 1) + d.dayInMonth) );
        return pos[0] + disHor_daysYear;
    }
    
    else if (view === "monthsYear") {
        var origin = mapToCircle(rMonthsYearOuter, 12, d.month);
        var posRel = mapToCircle(rMonthsYearInner, 30, d.dayInMonth);
        return origin[0] + posRel[0] + disHor_monthsYear;
    }

    else if (view === "daysWeek") {
        var origin = mapToCircle(rDaysWeekOuter, 7, d.dayInWeek);
        var posRel = mapToCircle(rDaysWeekInner, 24, d.hour);
        return origin[0] + posRel[0] + disHor_daysWeek;
    }

    else if (view === "daysMonth") {
        var origin = mapToCircle(rDaysMonthOuter, 30, d.dayInMonth);
        var posRel = mapToCircle(rDaysMonthInner, 24, d.hour);
        return origin[0] + posRel[0] + disHor_daysMonth;
    }
    // add the other view cases
}

function yPos(d) {
    if (view === "matrix") {
        return yMatrixScale((30 * (d.month - 1) + d.dayInMonth));
    }
    
    else if (view === "daysYear") {
        var pos = mapToCircle(rDaysYear, 365, (30 * (d.month - 1) + d.dayInMonth) );
        return pos[1] + disVer_daysYear;
    }

    else if (view === "monthsYear") {
        var origin = mapToCircle(rMonthsYearOuter, 12, d.month);
        var posRel = mapToCircle(rMonthsYearInner, 30, d.dayInMonth);
        return origin[1] + posRel[1] + disVer_monthsYear;
    }

    else if (view === "daysWeek") {
        var origin = mapToCircle(rDaysWeekOuter, 7, d.dayInWeek);
        var posRel = mapToCircle(rDaysWeekInner, 24, d.hour);
        return origin[1] + posRel[1] + disVer_daysWeek;
    }

    else if (view === "daysMonth") {
        var origin = mapToCircle(rDaysMonthOuter, 30, d.dayInMonth);
        var posRel = mapToCircle(rDaysMonthInner, 24, d.hour);
        return origin[1] + posRel[1] + disVer_daysMonth;
    }  
    // add the other view cases
}

function zoom() {

    var selection = d3.select("svg")
        .selectAll("circle");
    //    .data(powerDay, function(d) { return d.power; });
    
    selection
        .attr("cx", function(d) { return d3.event.translate[0] + d3.event.scale * xPos(d[indx]); })
        .attr("cy", function(d) { return d3.event.translate[1] + d3.event.scale * yPos(d[indx]); });

    /*selection.enter()
        .append("circle")
        .style("fill", "red")
        .attr("r", function(d) { return d.power / 600 ; })
        .attr("cx", function(d) { return d3.event.translate[0] + d3.event.scale * xPos(d); })
        .attr("cy", function(d) { return d3.event.translate[1] + d3.event.scale * yPos(d); });
    */
    
    /*d3.selectAll("circle")
      .filter(function(d) {
            var cx = d3.event.translate[0] + d3.event.scale * xPos(d);
            return cx > 1400; 
        })
        .remove();
    */
   /* d3.selectAll("circle")
      .filter(function(d) {
        if (zoomBehav.scale() < 5) {
            return (d.dayInWeek ===  1) || (d.dayInWeek ===  3) || (d.dayInWeek ===  5);
        }
      })
      .remove(); */ 
}


function endall(transition, callback) {
    var n = 0;
    transition
        .each(function() { ++n; })
        .each("end", function() { if (!--n) callback.apply(this, arguments); });
}

function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}
