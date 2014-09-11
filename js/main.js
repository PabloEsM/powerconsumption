/*
            var data = [{hour: 0, day: 1, week: 1, month: 1, power: 30},
                {hour: 1, day: 1, week: 1, month: 1, power: 40},
                {hour: 2, day: 1, week: 1, month: 1, power: 50},
                {hour: 0, day: 2, week: 1, month: 1, power: 30},
                {hour: 1, day: 2, week: 1, month: 1, power: 35},
                {hour: 2, day: 2, week: 1, month: 1, power: 60},
                {hour: 0, day: 4, week: 1, month: 1, power: 20},
                {hour: 5, day: 4, week: 1, month: 1, power: 30},
                {hour: 8, day: 7, week: 1, month: 1, power: 30},
                {hour: 12, day: 14, week: 1, month: 1, power: 30},
                {hour: 20, day: 21, week: 1, month: 1, power: 30},
                {hour: 10, day: 4, week: 1, month: 1, power: 42},
                {hour: 22, day: 90, week: 1, month: 1, power: 32},
                {hour: 22, day: 180, week: 1, month: 1, power: 44},
                {hour: 22, day: 270, week: 1, month: 1, power: 56},
                {hour: 3, day: 270, week: 1, month: 1, power: 26},
                {hour: 15, day: 360, week: 1, month: 1, power: 39},
                ];
*/
            var svg = d3.select("body").append("svg"),
                margin = {top: 50, bottom: 50, left: 50, right: 50},
                height = 500,
                width = 600,
                duration = 2500;

            var temp = d3.behavior.zoom();
    
            svg.attr("height", height)
                .attr("width", width)
                .call( 
                    temp
                        .scaleExtent([1, 3])
                        .on("zoom", zoom)
                );

            var xScale = d3.scale.linear()
                .domain([0, 23])
                .range([0 + margin.top, width - margin.bottom]);

            var yScale = d3.scale.linear()
                .domain([0, 364])
                .range([0 + margin.left, height - margin.right]);

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

                var powerJsonSimple = powerJson.filter(function(element) { return element.month === 7; }); 

                d3.select("svg").append("g")
                    .selectAll("circle")
                    .data(powerJsonSimple)
                  .enter()
                    .append("circle")
                    .style("fill", "steelblue")
                    .attr("r", function(d) { return d.power / 30 ; })
                    .attr("cx", function(d) {return xScale(d.hour); })
                    .attr("cy", function(d) {return yScale(d.day); });

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
                d3.select("svg").selectAll("circle")
                  .transition().duration(duration)
                    .attr("cx", function(d) {return xScale(d.hour); })
                    .attr("cy", function(d) {return yScale(d.day); });
            }

            function viewDaysWeek() {
                // Monday to Sunday
                var r = 200;

                /*
                d1_Origin = mapToCircle(r, 7, 1);
                d2_Origin = mapToCircle(r, 7, 2);

                d1 = d3.selectAll("circle")
                  .filter(function(d) {return (d.day % 7 === 0) || (d.day === 1); });
                daysWeekUpdate(d1, d1_Origin);

                d2 = d3.selectAll("circle")
                  .filter(function(d) {return (d.day % 7 === 0) || (d.day === 1); });
                daysWeekUpdate(d1, d1_Origin);
                */

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
                d3.select("g")
                    .attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            }

            
