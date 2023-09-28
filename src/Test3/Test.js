import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const TestChart = () => {
  //refs
  const svgRef = useRef();

  //draws chart
  useEffect(() => {
    const svg = d3.select(svgRef.current);

    
    var width = svg.attr('width'), height = svg.attr('height');
    // var nodes = [{x:0, y:0}, {x:100,y:200}, {x:200,y:200}, {x:300,y:300}, {x:400,y:400}];
    let nodes = [{},{},{},{},{}]
    let links = [
        {"source": 0, "target": 3, weight: 1}, 
        {"source": 3, "target": 0, weight: 1},
        {"source": 1, "target": 2, weight: 0.5}
    ];
    let colorScale = d3.scaleDiverging(d3.interpolatePuOr)
    .domain([0, nodes.length-1])

    function ticked() {
        let l = svg.selectAll('line').data(links);
        l.enter().append('line')
        .attr('stroke', 'black')
        .attr('stroke-width', d => d.weight*5)
        .merge(l)
        .attr('x1', function(d) { return d.source.x; })
        .attr('y1', function(d) { return d.source.y; })
        .attr('x2', function(d) { return d.target.x; })
        .attr('y2', function(d) { return d.target.y; });

        var u = d3.select('svg')
            .selectAll('circle')
            .data(nodes);

        u.enter()
            .append('circle')
            .attr('r', 10)
        .merge(u)
            .attr('cx', function(d) {
                return d.x
            })
            .attr('cy', function(d) {
                return d.y
            })
            .attr('fill', d => colorScale(d.index))

        u.exit().remove();
    }

    function strength(link) {
        return link.weight * 0.01;
    }

    function distance(link) {
        return 200 * (1 / link.weight);
    }

    var simulation = d3.forceSimulation(nodes)
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force("link", d3.forceLink(links).strength(strength).distance(distance))
    .alphaTarget(0.1)
    .on('tick', ticked);

  }, []);

  return (
    <svg
      width="1600"
      height="900"
      id="mainsvg"
      className="svgs"
      ref={svgRef}
    ></svg>
  );
};

export default TestChart;
