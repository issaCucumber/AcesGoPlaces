import * as d3 from "d3";

class NetworkGraph {
    search(nodeId) {
        this.names
            .style("stroke-width", function(d) {
                if(d.id == nodeId) {
                    return "1";
                } else {
                    return "0.1";
                }
            })
            .style("stroke", function(d) {
                if(d.id == nodeId) {
                    return "green";
                } else {
                    return "#000";
                }
            })
    }

    setCallback(callback) {
        this.showConnection = callback;
    }

    _showConnection() {
        var films = [];
        this.dataset.links.forEach((link) => {
            var valid = true;
            this.selected.forEach((id) => {
                if(id != link.source.id && id != link.target.id) {
                    valid = false;
                    return;
                }
            });

            if(valid) {
                films = films.concat(link.films);
            }
        });

        this.showConnection(films);
    }
    
    drawChart(dataset) {
        var width = 1200;
        var height = 700;

        this.dataset = dataset;
        this.nodes = null;
        this.links = null;
        this.names = null;

        this.selected = new Set();
        this.multiselect = false;

        var that = this;

        //add zoom capabilities 
        var zoom = d3.zoom()
            .on('zoom', function(event) {
                svg.selectAll("circle")
                .attr('transform', event.transform);
                svg.selectAll("line")
                .attr('transform', event.transform);
                svg.selectAll("text")
                .attr('transform', event.transform);
        });

        var _drag = (simulation) => {
  
            function dragstarted(event) {
              if (!event.active) simulation.alphaTarget(0.3).restart();
              event.subject.fx = event.subject.x;
              event.subject.fy = event.subject.y;
            }
            
            function dragged(event) {
              event.subject.fx = event.x;
              event.subject.fy = event.y;
            }
            
            function dragended(event) {
              if (!event.active) simulation.alphaTarget(0);
              event.subject.fx = null;
              event.subject.fy = null;
            }
            
            return d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);
        };

        var _update = (peopleId) => {
            if(this.multiselect) {
                this.selected.add(parseInt(peopleId));

                this.names
                .style("stroke-width", function(d) {
                    if(that.selected.has(d.id)) {
                        return "1";
                    } else {
                        return "0.1";
                    }
                })
                .style("stroke", function(d) {
                    if(that.selected.has(d.id)) {
                        return "DeepPink";
                    } else {
                        return "#000";
                    }
                });

                if(this.selected.size == 2){
                    this._showConnection();
                }
                return;
            }

            this.selected = new Set();
            this.selected.add(parseInt(peopleId));
            dataset.links.forEach((link) => {
                if(link.source.id == peopleId) {
                    this.selected.add(link.target.id);
                    return;
                }

                if(link.target.id == peopleId) {
                    this.selected.add(link.source.id);
                    return;
                }
            });

            this.names
                .style("stroke-width", function(d) {
                    if(that.selected.has(d.id)) {
                        return "1";
                    } else {
                        return "0.1";
                    }
                })
                .style("stroke", function(d) {
                    if(that.selected.has(d.id)) {
                        return "blue";
                    } else {
                        return "#000";
                    }
                });

        }

        d3.select("body")
            .on("keydown", function(e) {
                if(e.keyCode == 91 || e.keyCode == 93) {
                    that.multiselect = true;
                    that.selected = new Set();
                }
            })
            .on("keyup", function(e) {
                that.multiselect = false;
                that.selected = new Set();
            });

        d3.select("#graph").select("svg").remove();

        var svg = d3.select("#graph").append("svg")
            .attr("width", width)
            .attr("height", height);

        var g = svg.append("g")
            .attr("class", "everything");

        var simulation = d3.forceSimulation(dataset.nodes)
            .force('charge', d3.forceManyBody().strength((d) => {
                return -500 * d.weight;
            }))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('link', d3.forceLink().links(dataset.links)
            .strength((link) => {
                return 1 / link.weight;
            })
            .id((link) => {
                return link.id;
            }));

        simulation.on("tick", () => {
            that.links
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);
        
            that.nodes
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });

            that.names
                .attr("x", function(d) { return d.x; })
                .attr("y", function(d) { return d.y; });
        });

        this.links = g.append("g")
                    .attr("class", "links")
                    .attr("stroke", "#999")
                    .selectAll("line")
                    .data(dataset.links)
                    .join("line")
                    .attr("stroke-width", d => Math.sqrt(d.weight));

        this.nodes = g.append("g")
                    .attr("class", "nodes") 
                    .attr("stroke", "#fff")
                    .selectAll("circle")
                    .data(dataset.nodes)
                    .enter()
                    .append("circle")
                    .attr("r", function(d) {
                        return 10;
                    })
                    .style("fill", function(d) {
                        if(d.group == "actor") {
                            return "#00FF7F";
                        } else if (d.group == "director") {
                            return "#8B008B";
                        } else {
                            return "#4682B4";
                        }
                    })
                    .style("stroke", function(d) {
                        if(d.top) {
                            return "red";
                        } else {
                            return "#fff";
                        }
                    })
                    .style("stroke-width", function(d) {
                        if(d.top) {
                            return "8";
                        } else {
                            return "1";
                        }
                    })
                    .call(_drag(simulation));

        this.names = g.append("g")
                    .attr("class", "names") 
                    .selectAll("text")
                    .data(dataset.nodes)
                    .enter()
                    .append("text")
                    .attr("id", function(d) {
                        return d.id;
                    }) 
                    .text(function(d) {
                        return d.name;
                    })
                    .on("mousedown", function(e) {
                        _update(e.target.id)
                    });;

        svg.call(zoom); 
    }
}

export default NetworkGraph;