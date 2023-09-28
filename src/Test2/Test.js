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
    const g = svg.append("g");
    //.attr('transform', `translate(${width/2}, ${height/2})`);
    let root;

    const render = function (data) {
      // Setting the domain on an ordinal scale is optional
      // if the unknown value is implicit (the default).
      // In this case, the domain will be inferred implicitly
      // from usage by assigning each unique value passed to
      // the scale a new value from the range.
      const color = d3.scaleOrdinal(d3.schemeCategory10);
      //.domain( data.descendants().filter( d => d.depth !== 1 ).map( d => d.data.name ) );
      const fill = (d) => {
        if (!d.depth) return "#666666";
        while (d.depth > 1) d = d.parent;
        return color(d.data.name);
      };

      g.selectAll(".datarect")
        .data(root.descendants())
        .join("rect")
        .attr("class", "datarect")
        .attr("x", (d) => d.y0)
        .attr("y", (d) => d.x0)
        .attr("height", (d) => d.x1 - d.x0)
        .attr("width", (d) => d.y1 - d.y0)
        .attr("fill", fill);

      g.selectAll(".datatext")
        .data(root.descendants().filter((d) => d.x1 - d.x0 > 50))
        .join("text")
        .attr("class", "datatext")
        .attr("text-anchor", "middle")
        .attr("x", (d) => (d.y0 + d.y1) / 2)
        .attr("y", (d) => (d.x0 + d.x1) / 2)
        .attr("dy", "0.35em")
        .attr("font-size", "1em")
        .text((d) => d.data.name);
    };

    d3.json("http://127.0.0.1:5501/games.json").then((data) => {
      root = d3.partition().size([height, width])(
        d3
          .hierarchy(data)
          .sum((d) => d.popularity)
          .sort((a, b) => b.popularity - a.popularity)
      );
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
