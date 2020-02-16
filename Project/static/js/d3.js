$(function () {
    $.get({
        url: url,
        success: function (response) {
            var $response = JSON.parse(response);
            var slider = $("#slider");
            var sliderValue = slider.val();
            var circleSelected = false;

            d3.selection.prototype.moveToFront = function() {  
                return this.each(function(){
                  this.parentNode.appendChild(this);
                });
              };

            d3.selection.prototype.moveToBack = function() {  
                  return this.each(function() { 
                      var firstChild = this.parentNode.firstChild; 
                      if (firstChild) { 
                          this.parentNode.insertBefore(this, firstChild); 
                      } 
                  });
            };

            var color = d3.scaleOrdinal()
            .range(d3.schemeCategory20);

            var margin = {top: 60, right: 90, bottom: 60, left:60};
            var width = 1300;
            var height = 400;

            var xMax = d3.max($response, function(d) { 
                if(d && d.data && d.data["sugar_per_person_g_per_day"]){
                    var dataArray = new Array;
                    for(var o in d.data["sugar_per_person_g_per_day"]) {
                        dataArray.push(parseFloat(d.data["sugar_per_person_g_per_day"][o]));
                    }
                    return d3.max(dataArray); 
                } else {
                    return parseFloat(0);
                } 
            });

            var xMin = d3.min($response, function(d) { 
                if(d && d.data && d.data["sugar_per_person_g_per_day"]){
                    var dataArray = new Array;
                    for(var o in d.data["sugar_per_person_g_per_day"]) {
                        dataArray.push(parseFloat(d.data["sugar_per_person_g_per_day"][o]));
                    }
                    return d3.min(dataArray); 
                } else {
                    return parseFloat(0);
                } 
            });

            var yMax = d3.max($response, function(d) { 
                if(d && d.data && d.data["life_expectancy_years"]){
                    var dataArray = new Array;
                    for(var o in d.data["life_expectancy_years"]) {
                        dataArray.push(parseFloat(d.data["life_expectancy_years"][o]));
                    }
                    return d3.max(dataArray); 
                } else {
                    return parseFloat(0);
                } 
            });

            /*var rMax = d3.max($response, function(d) { 
                if(d && d.data && d.data["food_supply_kilocalories_per_person_and_day"]){
                    var dataArray = new Array;
                    for(var o in d.data["food_supply_kilocalories_per_person_and_day"]) {
                        dataArray.push(parseFloat(d.data["food_supply_kilocalories_per_person_and_day"][o]));
                    }
                    return d3.max(dataArray); 
                } else {
                    return parseFloat(0);
                } 
            });*/

            console.log(xMax);
            console.log(yMax);
            //console.log(rMax);

            var xScale = d3.scaleLinear()
            .range([0, width])
            .domain([xMin, 200]);

            var yScale = d3.scaleLinear()
            .range([height, 0])
            .domain([0, yMax]);

            /*var rScale = d3.scaleSqrt()
            .range([0, r])
            .domain([0, rMax]);*/
        
            var xAxis = d3.axisBottom().scale(xScale).ticks(40);
            var yAxis = d3.axisLeft().scale(yScale).ticks(20);

            var svg = d3.select("svg").append("svg")
            .attr("height", height + margin.top + margin.bottom)
            .attr("width", width + margin.left + margin.right)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            //setting up axis labels
            svg.append("g")
			.attr("transform", "translate(0," + height + ")")
            .attr("class", "x axis")
            .call(xAxis);
            
            svg.append("text")
            .attr("class", "label")
            .attr('x', width)
			.attr('y', height + 35)
            .attr("text-anchor", "end")
            .text("Sugar Consumption (g)");
            
		    svg.append("g")
			.attr("transform", "translate(0,0)")
			.attr("class", "y axis")
            .call(yAxis);
            
            svg.append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr('x', 0)
			.attr('y', -35)
            .attr("text-anchor", "end")
            .text("Life Expectency");

            svg.append("text")
            .text("Circle Size: Food Supply (Kc)")
            .attr("x", width - 200)
            .attr("y", -40);

            //adding the circles
            var g = svg.selectAll("g")
            .data($response)
            .enter()
            .append("g")
            .attr("transform", function(d) {
                if(d && d.data && d.data["life_expectancy_years"] && d.data["sugar_per_person_g_per_day"]) {                        
                    var x = d.data["sugar_per_person_g_per_day"]["1965"] ? xScale(d.data["sugar_per_person_g_per_day"]["1965"]) : 0;
                    var y = d.data["life_expectancy_years"]["1965"] ? yScale(d.data["life_expectancy_years"]["1965"]) : 0;
                    return "translate(" +  x + "," + y + ")"
                } else {
                    console.log("ERROR!!");
                }
            })
            .on("mouseover", function(){
                if(!circleSelected){
                    d3.select(this)
                    .moveToFront()
                    .append("text")
                    .text(function(d){return d.name})
                    .attr("x", 0)
                    .attr("y", 40);
                }
            })
            .on("mouseout", function(){
                if(!circleSelected){
                    d3.select(this)
                    .select("text")
                    .remove();
                }
            });

            var circles = g.append("circle")
            .attr("r", function(d){
                if(d && d.data && d.data["food_supply_kilocalories_per_person_and_day"]){
                    var r = d.data["food_supply_kilocalories_per_person_and_day"]["1965"] ? d.data["food_supply_kilocalories_per_person_and_day"]["1965"]/100 : 0;
                    return r
                } else {
                    console.log("ERROR!!");
                }
            })
            .style("fill", function (d, i) { return color(i); })
            .on("mouseover", function(){
                if(!circleSelected){
                    circles.attr("opacity", 0.2);
                    d3.select(this)
                    .attr("opacity", 1)
                    .moveToFront();
                }
            })
            .on("mouseout", function(){
                if(circleSelected){
                    
                } else {
                    circles.attr("opacity", 1);
                }
            })
            .on("click", function(){
                if(!circleSelected){
                    circleSelected = true;
                    d3.select(this)
                    .attr("opacity", 1);
                } else {
                    circleSelected = false;
                }
            });

            //on slider change function
            slider.on("input", function(){
                sliderValue = slider.val();
                g.transition()
                .duration(100)
                .attr("transform", function(d) {
                    if(d && d.data && d.data["life_expectancy_years"] && d.data["sugar_per_person_g_per_day"]) {                        
                        var x = d.data["sugar_per_person_g_per_day"][sliderValue] ? xScale(d.data["sugar_per_person_g_per_day"][sliderValue]) : 0;
                        var y = d.data["life_expectancy_years"][sliderValue] ? yScale(d.data["life_expectancy_years"][sliderValue]) : 0;
                        return "translate(" +  x + "," + y + ")"
                    } else {
                        console.log("ERROR!!");
                    }
                });

                circles.transition()
                .duration(100)
                .attr("r", function(d){
                    if(d && d.data && d.data["food_supply_kilocalories_per_person_and_day"]){
                        var r = d.data["food_supply_kilocalories_per_person_and_day"][sliderValue] ? d.data["food_supply_kilocalories_per_person_and_day"][sliderValue]/100 : 0;
                        return r
                    } else {
                        console.log("ERROR!!");
                    }
                });
            });
        }
    });
});
