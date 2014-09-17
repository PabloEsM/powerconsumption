var svg = d3.select("body").append("svg"),
    margin = {top: 50, bottom: 50, left: 50, right: 50},
    height = 500,
    width = 600,
    duration = 2500,
    view = 'matrix';

var powerJsonSimple = [];
var powerDay = [];


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

    powerDay.push(powerJson[0]); // The first pattern is added two times!!!!!
    for (var i = 0; i <= powerJson.length - 1; i++) {
        for (var j = 0; j <= powerDay.length - 1; j++) {
            if (powerDay[j].day === powerJson[i].day) {
                powerDay[j].power = powerDay[j].power + powerJson[i].power;
                break;
            }
            else if (j === (powerDay.length - 1)){
                powerDay.push(powerJson[i]);
                break;
            }
        };
        
    };

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


function viewDaysYear() {
    view = "daysYear";
    d3.select("svg").selectAll("circle")
      .transition().duration(duration)
        .attr("cx", function(d) { return xPos(d); })
        .attr("cy", function(d) { return yPos(d); });
}

function viewMatrix() {
    view = "matrix";
    d3.select("svg").selectAll("circle")
      .transition().duration(duration)
        .attr("cx", function(d) { return xPos(d); })
        .attr("cy", function(d) { return yPos(d); });
}

function viewMonthsYear() {
    view = "monthsYear";
    d3.select("svg").selectAll("circle")
      .transition().duration(duration)
        .attr("cx", function(d) { return xPos(d); })
        .attr("cy", function(d) { return yPos(d); })
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
    // add the other view cases
};

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
    // add the other view cases
};








function viewDaysWeek() {
    // Monday to Sunday
    var r = 200;

    for (var i = 0; i < 7; i++) {
        dOrigin = mapToCircle(r, 7, i+1);
        d = d3.selectAll("circle")
          .filter(function(d) {return d.dayInWeek === i+1; });
        daysWeekUpdate(d, dOrigin);
    };




};

var daysWeekUpdate = function(selection, origin) {
    selection
      .transition().duration(duration)
        .attr("cx", function(d) {
            posRel = mapToCircle(30, 24, d.hour);
            return posRel[0] + origin[0];
        })
        .attr("cy", function(d) {
            posRel = mapToCircle(30, 24, d.hour);
            return posRel[1] + origin[1];
        });
};

function zoom() {

    var selection = d3.select("svg")
        .selectAll("circle")
      .data(powerDay, function(d) { return d.power; });

    selection
        .attr("cx", function(d) { return d3.event.translate[0] + d3.event.scale * xPos(d); })
        .attr("cy", function(d) { return d3.event.translate[1] + d3.event.scale * yPos(d); });

    selection.enter()
        .append("circle")
        .style("fill", "steelblue")
        .attr("r", function(d) { return d.power / 600 ; })
        .attr("cx", function(d) { return d3.event.translate[0] + d3.event.scale * xPos(d); })
        .attr("cy", function(d) { return d3.event.translate[1] + d3.event.scale * yPos(d); });

    d3.selectAll("circle")
      .filter(function(d) {
            var cx = d3.event.translate[0] + d3.event.scale * xPos(d);
            return cx > 400; 
        })
        .remove();

   /* d3.selectAll("circle")
      .filter(function(d) {
        if (zoomBehav.scale() < 5) {
            return (d.dayInWeek ===  1) || (d.dayInWeek ===  3) || (d.dayInWeek ===  5);
        }
      })
      .remove(); */

    

        
/*        
    d3.select("svg").selectAll("circle")
        .attr("cx", function(d) {
            return d3.event.translate[0] + d3.event.scale * xPos(d); 
        })
        .attr("cy", function(d) {
            return d3.event.translate[1] + d3.event.scale * yPos(d); 
        });
 */   
        
}




            
