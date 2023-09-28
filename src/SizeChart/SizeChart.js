import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import "./SizeChart.css";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import { Menu } from "antd";
import { Input, Space, Button } from "antd";
import { Avatar, List } from "antd";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { useHistory } from "react-router-dom";
const { Search } = Input;
const { TextArea } = Input;

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const items = [
  getItem("Navigation", "sub1", <MailOutlined />, [
    getItem(
      "Home",
      "/",
      null,
      
    ),
    getItem(
      "Dashboard",
      "/size-chart",
      null,
      
    ),
    getItem(
      "Question List",
      "/question-list",
      null,
      
    ),
    
  ])
];

const Chat = () => {

  const svgRef = useRef();


  

  useEffect(() => {
    async function processCount(processName) {
      // const materials=await fetch('http://localhost:8090/api/material-delivery/find-material-by-materialid',{
      const process = await fetch(
        "http://localhost:8090/api/process/count-process",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            processName,
          }),
        }
      );

      return process.json();
    }

    processCount("dispensing").then((data) => {
      console.log(data);
      let rawData = data.allProcessDispensing;
      const calculateVolume = (productSize) => {
        const dimensions = productSize.split("x").map(Number);
        return dimensions[0] * dimensions[1] * dimensions[2];
      };

      const filteredData = rawData.filter(
        (d) => !d.productSize.startsWith("Φ")
      );
      const sortedData = filteredData.sort(
        (a, b) =>
          calculateVolume(b.productSize) - calculateVolume(a.productSize)
      );

      const svg = d3
        .select(svgRef.current)
        .attr("width", 600)
        .attr("height", 600);
      const xScale = d3
        .scaleBand()
        .range([0, 500])
        .domain(sortedData.map((d) => d.productSize))
        .padding(0.1);
      const yScale = d3
        .scaleLinear()
        .range([600, 0])
        .domain([0, calculateVolume(sortedData[0].productSize)]);

      // 绘制柱子
      const bars = svg
        .selectAll(".bar")
        .data(sortedData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d) => xScale(d.productSize))
        .attr("y", (d) => yScale(calculateVolume(d.productSize)))
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => 600 - yScale(calculateVolume(d.productSize)));

      // 添加 tooltip
      const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      // 鼠标悬停事件
      bars
        .on("mouseover", (event, d) => {
          console.log(d);
          tooltip.transition().duration(200).style("opacity", 0.9);
          tooltip
            .html(
              `<p>${d.process}</p></br>
            <p>${d.productSize}</p></br>
            <p>${d.projectId}</p></br>`
            )
            .style("left", event.pageX + "px")
            .style("top", event.pageY - 28 + "px");
        })
        .on("mouseout", (event, d) => {
          tooltip.transition().duration(500).style("opacity", 0);
        });

      
    });
  }, []);
  const history=useHistory()
  const onClick = (e) => {
    console.log("click ", e);
    history.push(e.key)
  };


  return (
    <>
      <h1>
        Identify all projects involving dispensing processes and sort them by
        product size.
      </h1>
      <h3>
        Hover over the bar chart to display product size and project number.
      </h3>
      <div id="search-container">
        <div id="search-control">
          <Menu
            onClick={onClick}
            style={{
              width: 256,
            }}
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            mode="inline"
            items={items}
          />
        </div>

        <div id="search-result">
          
          <div>
            
            <svg ref={svgRef}></svg>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
