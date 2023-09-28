import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const TestChart = () => {
  //refs
  const svgRef = useRef();

  //draws chart
  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const margin = { top: 50, right: 150, bottom: 50, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
    let root;
    let color;

    const fill = (d) => {
      if (d.depth === 0) return color(d.data.name);
      while (d.depth > 1) d = d.parent;
      return color(d.data.name);
    };

    const render = function (data) {
      color = d3
        .scaleOrdinal()
        .domain(
          root
            .descendants()
            .filter((d) => d.depth <= 1)
            .map((d) => d.data.name)
        )
        .range(d3.schemeCategory10);

      g.selectAll("path")
        .data(root.links())
        .join("path")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1.5)
        .attr(
          "d",
          d3
            .linkHorizontal()
            .x((d) => d.y)
            .y((d) => d.x)
        );

      // alternatively, we can use the following code to do a single data-join;
      // then, use .append() to add circles and texts;
      /*const node = g.append("g")
        .selectAll("g")
        .data(root.descendants())
        .join("g")
        .attr("transform", d => `translate(${d.y},${d.x})`);*/

      g.selectAll("circle")
        .data(root.descendants())
        .join("circle")
        // optionally, we can use stroke-linejoin to beautify the path connection;
        //.attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
        .attr("fill", fill)
        .attr("cx", (d) => d.y)
        .attr("cy", (d) => d.x)
        .attr("r", 6);

      g.selectAll("text")
        .data(root.descendants())
        .join("text")
        .attr("text-anchor", (d) => (d.children ? "end" : "start"))
        // note that if d is a child, d.children is undefined which is actually false!
        .attr("x", (d) => (d.children ? -6 : 6) + d.y)
        .attr("y", (d) => d.x + 5)
        .text((d) => d.data.name);
    };

    d3.json("http://127.0.0.1:5501/games.json").then((data) => {
      root = d3.hierarchy(data);
      // alternatively, we can set size of each node;
      // root = d3.tree().nodeSize([30, width / (root.height + 1)])(root);
      root = d3.tree().size([innerHeight, innerWidth])(root);
      render(root);
    });
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
