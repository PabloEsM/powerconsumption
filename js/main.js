var svg = d3.select("body").append("svg"),
    margin = {top: 50, bottom: 50, left: 50, right: 50},
    height = 500,
    width = 600,
    duration = 2500,
    view = 'matrix';

var powerJsonSimple = [];
var powerDay = [];
var powerWeekHour = [];
var powerMonthHour = [];


var zoomBehav = d3.behavior.zoom();

svg.attr("height", height)
    .attr("width", width)
    .call( 
        zoomBehav
            .scaleExtent([1, 10])
            .on("zoom", zoom)
    );


var xMatrixScale = d3.scale.linear()
    .domain([1, 7])
    .range([0, width]);

var yMatrixScale = d3.scale.linear()
    .domain([0, 364])
    .range([0, height]);

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


    d3.select("svg")
        .selectAll("circle")
        .data(powerDay, function(d) { return d.power; })
      .enter()
        .append("circle")
        .style("fill", "steelblue")
        .attr("r", function(d) { return d.power / 600 ; })
        .attr("cx", function(d) { return xPos(d); })
        .attr("cy", function(d) { return yPos(d); });

});





function viewMatrix() {
    if (view === "daysWeek") {
        view = "daysWeekCenter";
        toCenterPoints(createPowerDay,'matrix');
    }

    view = "matrix";
    d3.select("svg").selectAll("circle")
      .transition().duration(duration)
        .attr("cx", function(d) { return xPos(d); })
        .attr("cy", function(d) { return yPos(d); });
    
    zoomBehav.scale(1);
    zoomBehav.translate([0, 0]);

}


function viewDaysWeek() {
    if (view === "matrix") {
        view = "daysWeekCenter";
        toCenterPoints(createPowerWeekHour, 'arg');
    }

    setTimeout(function() {view = "daysWeek"}, 0);
    setTimeout(moveNewData,0);
}



function moveNewData() {
    d3.select("svg").selectAll("circle")
      .transition().duration(duration)
        .attr("cx", function(d) { return xPos(d); })
        .attr("cy", function(d) { return yPos(d); });
    
    zoomBehav.scale(1);
    zoomBehav.translate([0, 0]);
}




function createDaysWeek() {
    var selection = d3.select("svg").selectAll("circle")
        .data(powerWeekHour, function(d) { return d.power; });

    selection.enter()
        .append("circle")
        .style("fill", "steelblue")
        .attr("r", function(d) { return d.power / 600; })
        .attr("cx", function(d) {
            var origin = mapToCircle(200, 7, d.dayInWeek);
            return origin[0] + 24;
        })
        .attr("cy", function(d) {
            var origin = mapToCircle(200, 7, d.dayInWeek);
            return origin[1] + 24;
        });
    
    d3.select("svg").selectAll("circle")
      .transition().duration(duration/6)
        .attr("cx", function(d) { return xPos(d); })
        .attr("cy", function(d) { return yPos(d); }); 
}

function xPos(d) {
    if (view === "matrix") {
        return xMatrixScale(d.dayInWeek);
    }
    
    else if (view === "daysYear") {
        var pos = mapToCircle(200, 365, (30 * (d.month - 1) + d.dayInMonth) );
        return pos[0];
    }
    
    else if (view === "monthsYear") {
        var origin = mapToCircle(200, 12, d.month);
        var posRel = mapToCircle(30, 30, d.dayInMonth);
        return origin[0] + posRel[0];
    }

    else if (view === "daysWeek") {
        var origin = mapToCircle(200, 7, d.dayInWeek);
        var posRel = mapToCircle(24, 24, d.hour);
        return origin[0] + posRel[0];
    }

    else if (view === "daysMonth") {
        var origin = mapToCircle(200, 30, d.dayInMonth);
        var posRel = mapToCircle(10, 24, d.hour);
        return origin[0] + posRel[0];
    }

    else if (view === "daysWeekCenter") {
        var origin = mapToCircle(200, 7, d.dayInWeek);
        return origin[0] + 24;
    }

    else if (view === "daysMonthCenter") {
        var origin = mapToCircle(200, 30, d.dayInMonth);
        return origin[0] + 24;
    }
    // add the other view cases
}

function yPos(d) {
    if (view === "matrix") {
        return yMatrixScale(d.day);
    }
    
    else if (view === "daysYear") {
        var pos = mapToCircle(200, 365, (30 * (d.month - 1) + d.dayInMonth) );
        return pos[1];
    }

    else if (view === "monthsYear") {
        var origin = mapToCircle(200, 12, d.month);
        var posRel = mapToCircle(30, 30, d.dayInMonth);
        return origin[1] + posRel[1];
    }

    else if (view === "daysWeek") {
        var origin = mapToCircle(200, 7, d.dayInWeek);
        var posRel = mapToCircle(24, 24, d.hour);
        return origin[1] + posRel[1];
    }

    else if (view === "daysMonth") {
        var origin = mapToCircle(200, 30, d.dayInMonth);
        var posRel = mapToCircle(10, 24, d.hour);
        return origin[1] + posRel[1];
    }

    else if (view === "daysWeekCenter") {
        var origin = mapToCircle(200, 7, d.dayInWeek);
        return origin[1] + 24;
    }

    else if (view === "daysMonthCenter") {
        var origin = mapToCircle(200, 30, d.dayInMonth);
        return origin[1] + 24;
    }
        
    // add the other view cases
}

function zoom() {

    var selection = d3.select("svg")
        .selectAll("circle");
    //    .data(powerDay, function(d) { return d.power; });
    
    selection
        .attr("cx", function(d) { return d3.event.translate[0] + d3.event.scale * xPos(d); })
        .attr("cy", function(d) { return d3.event.translate[1] + d3.event.scale * yPos(d); });

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

function toCenterPoints(callback, arg) {

    var selection = d3.select("svg").selectAll("circle")
      .transition().duration(1000)
        .attr("class", "remove")
        .attr("cx", function(d) { return xPos(d); })
        .attr("cy", function(d) { return yPos(d); })
        .call(endall, function() {console.log("all done"); }); ;

    
    //setTimeout(function() {callback.apply(this, selection);},1000);
}


function regularPattern() {
    view = "daysWeekCenter";
    var selection = d3.selectAll("svg").selectAll("circle")
        .data(powerWeekHour);

    selection.select("circle")
        .attr("r", 10);

    selection.transition().duration(1500)
        .style("fill", "green")
        .attr("r", function(d) { return d.power / 400 ; })
        .attr("cx", function(d) { return xPos(d); })
        .attr("cy", function(d) { return yPos(d); })
      .transition().duration(1500)
        .call(function() {view = "daysWeek"})
        .attr("cx", function(d) { return xPos(d); })
        .attr("cy", function(d) { return yPos(d); })
        .style("fill", "blue");

    selection.enter()
        .append("circle")
        .style("fill", "red")
        .attr("r", function(d) { return d.power / 400 ; })
        .attr("cx", function(d) { return xPos(d); })
        .attr("cy", function(d) { return yPos(d); });

    selection.exit()
        .style("fill", "black")
        .transition().duration(150)
        .call(function() {view = "daysWeek";} )
        .remove();

    /*d3.select("svg").selectAll("circle")
        .style("fill", "orange")
      .transition().duration(1500)
        .attr("cx", function(d) { return xPos(d); })
        .attr("cy", function(d) { return yPos(d); });
    */

}

function printlog() {
    if (hasClass(this, "sentinel")) {
        console.log("sentinel!")
    }
};

function createPowerDay(callback) {

    d3.select("svg").selectAll("circle.remove")
        .remove();    

    d3.select("svg").selectAll("circle.new")
        .data(powerDay, function(d) { return d.power; })
      .enter()
        .append("circle")
        .attr("class", "new")
        .style("fill", "red")
        .attr("r", function(d) { return d.power / 400 ; })
        .attr("cx", function(d) { return xPos(d); })
        .attr("cy", function(d) { return yPos(d); });
}

function createPowerWeekHour(arg) {

    d3.select("svg").selectAll("circle.remove")
        .remove();    

    d3.select("svg").selectAll("circle.new")
        .data(powerWeekHour, function(d) { return d.power; })
      .enter()
        .append("circle")
        .attr("class", "new")
        .style("fill", "red")
        .attr("r", function(d) { return d.power / 600 ; })
        .attr("cx", function(d) { return xPos(d); })
        .attr("cy", function(d) { return yPos(d); });
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

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}


            
