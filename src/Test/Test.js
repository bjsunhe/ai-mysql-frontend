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
    const margin = { top: 20, right: 20, bottom: 60, left: 110 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const xValue = (datum) => {
      return datum.value;
    };
    const yValue = (datum) => {
      return datum.name;
    };
    let thedata = null;
    let selected = null;

    const render = function (data) {
      // Linear Scale: Data Space -> Screen Space;
      const xScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, xValue)])
        .range([0, innerWidth]);

      // Introducing y-Scale;
      const yScale = d3
        .scaleBand()
        .domain(data.map(yValue))
        .range([0, innerHeight])
        .padding(0.1);

      // The reason of using group is that nothing is rendered outside svg, so margin of svg is always blank while margin of group is rendered inside svg;
      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .attr("id", "maingroup");

      // Do the data join (Enter)
      g.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .on("mouseover", (datum) => {
          selected = datum.id;
          renderUpdate();
        })
        .on("mouseout", () => {
          selected = null;
          renderUpdate();
        })
        .attr("y", (datum) => yScale(yValue(datum)))
        .attr("width", 0)
        .attr("height", 0)
        .attr("fill", "white")
        .transition()
        .duration(3000)
        .attr("width", (datum) => {
          return xScale(xValue(datum));
        }) // use xSacle to re-scale data space (domain) and return the rescaled population;
        .attr("height", yScale.bandwidth())
        .attr("fill", "steelblue");

      // Adding axes
      let yAxisGroup = g
        .append("g")
        .call(d3.axisLeft(yScale))
        .attr("id", "yAxisGroup");

      let xAxisGroup = g
        .append("g")
        .call(d3.axisBottom(xScale))
        .attr("transform", `translate(${0}, ${innerHeight})`);
      xAxisGroup
        .append("text")
        .attr("y", 50)
        .attr("x", innerWidth / 2)
        .attr("fill", "black")
        .text("Value")
        .attr("id", "value")
        .attr("font-size", "2em");

      g.append("text")
        .text("Members in CSCG")
        .attr("y", 20)
        .attr("x", innerWidth / 2 - 100)
        .attr("font-size", "3em");
    };

    const renderUpdate = function () {
      let rects = d3.select(svgRef.current).selectAll("rect").data(thedata);
      rects.attr("fill", (datum) =>
        datum.id === selected ? "#a524e0" : "steelblue"
      );
    };

    d3.csv("http://127.0.0.1:5501/vma.csv").then(function (data) {
      thedata = data;
      data.forEach((datum) => {
        datum.value = +datum.value;
      });
      // Assigning ID to each datum;
      for (let i = 0; i < data.length; i++) {
        data[i].id = i;
      }
      console.log(data);
      console.log(
        data.map((datum) => {
          return datum.name;
        })
      );
      render(data);
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
