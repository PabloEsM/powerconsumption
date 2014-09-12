var svg = d3.select("body").append("svg"),
    margin = {top: 50, bottom: 50, left: 50, right: 50},
    height = 500,
    width = 600,
    duration = 2500,
    view = 'matrix';


var zoomBehav = d3.behavior.zoom();

svg.attr("height", height)
    .attr("width", width)
    .call( 
        zoomBehav
            .scaleExtent([1, 10])
            .on("zoom", zoom)
    );


var xMatrixScale = d3.scale.linear()
    .domain([0, 23])
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
    angle = (Math.PI/2) - (((2 * Math.PI) / nPoints) * point);
    xPos = xCoor(Math.cos(angle)) * rad;
    yPos = yCoor(Math.sin(angle)) * rad; 
    return [+xPos.toFixed(3), +yPos.toFixed(3)];
};

d3.json("data/powerConsumpData.json", function(powerJson) {

    //var powerJsonSimple = powerJson.filter(function(element) { return element.month === 7; }); 
     var powerJsonSimple = powerJson.slice(1200,1505); 

    d3.select("svg")
        .selectAll("circle")
        .data(powerJsonSimple)
      .enter()
        .append("circle")
        .style("fill", "steelblue")
        .attr("r", function(d) { return d.power / 30 ; })
        .attr("cx", function(d) { return xPos(d); })
        .attr("cy", function(d) { return yPos(d); });

});

function viewDaysYear() {
    d3.select("svg").selectAll("circle")
      .transition().duration(duration)
        .attr("cx", function(d) {
            pos = mapToCircle(300, 365, (30 * (d.month - 1) + d.dayInMonth) );
            return pos[0];
        })
        .attr("cy", function(d) {
            pos = mapToCircle(300, 365, (30 * (d.month - 1) + d.dayInMonth));
            return pos[1];
        });
}

function viewMatrix() {
    view = "matrix";
    d3.select("svg").selectAll("circle")
      .transition().duration(duration)
        .attr("cx", function(d) { return xPos(d); })
        .attr("cy", function(d) { return yPos(d); });
}

function xPos(d) {
    if (view === "matrix") {
        return xMatrixScale(d.hour);
    }
    // add the other view cases
};

function yPos(d) {
    if (view === "matrix") {
        return yMatrixScale(d.day);
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
    d3.select("svg").selectAll("circle")
        .attr("cx", function(d) {
            return d3.event.translate[0] + d3.event.scale * xPos(d); 
        })
        .attr("cy", function(d) {
            return d3.event.translate[1] + d3.event.scale * yPos(d); 
        });
        
}


            
