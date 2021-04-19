import * as d3 from "d3";

class BubbleChart {
    drawChart(dataset) {
        var diameter = 700;
        var color = d3.scaleOrdinal()
                    .range(["red", "green", "blue", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

        var bubble = d3.pack(dataset)
            .size([diameter, diameter])
            .padding(1.5);

        d3.select("#graph").select("svg").remove();
        var svg = d3.select("#graph")
            .append("svg")
            .attr("width", diameter)
            .attr("height", diameter)
            .attr("class", "bubble");

        var nodes = d3.hierarchy(dataset)
            .sum(function(d) { return d.Count; });

        var node = svg.selectAll(".node")
            .data(bubble(nodes).descendants())
            .enter()
            .filter(function(d){
                return  !d.children
            })
            .append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        node.append("title")
            .text(function(d) {
                return d.Name + ": " + d.Count;
            });

        node.append("circle")
            .attr("r", function(d) {
                return d.r;
            })
            .style("fill", function(d,i) {
                return color(i);
            });

        node.append("text")
            .attr("dy", "-1em")
            .style("text-anchor", "end")
            .text(function(d) {
                var parts = d.data.Name.split("|||");
                var director = "導演: ".concat(parts[0]);
                return director;
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", function(d){
                return d.r/8;
            })
            .attr("fill", "white");

        node.append("text")
            .attr("dy", "1em")
            .style("text-anchor", "start")
            .text(function(d) {
                var parts = d.data.Name.split("|||");
                var actor = "演員: ".concat(parts[1]);
                return actor;
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", function(d){
                return d.r/8;
            })
            .attr("fill", "white");

        node.append("text")
            .attr("dy", "5em")
            .style("text-anchor", "middle")
            .text(function(d) {
                return "合作次數: " + d.data.Count;
            })
            .attr("font-family",  "Gill Sans", "Gill Sans MT")
            .attr("font-size", function(d){
                return d.r/10;
            })
            .attr("fill", "white");

        d3.select("svg")
            .style("height", diameter + "px");
    }
}

export default BubbleChart;