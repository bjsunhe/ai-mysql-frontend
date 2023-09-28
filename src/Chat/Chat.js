import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import "./Chat.css";

import { Input, Space, Button } from "antd";
import { Avatar, List } from "antd";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
const { Search } = Input;
const { TextArea } = Input;

const Chat = () => {
  const [textAreaValue, setTextAreaValue] = useState("");
  const [searchResult, setSearchResult] = useState({});

  const [aiSql, setAiSql] = useState("");
  const [questionList, setQuestionList] = useState([]);

  const svgRef = useRef();

  // //draws chart
  // useEffect(() => {
  //   const svg = d3.select(svgRef.current);

  //   const width = +svg.attr("width");
  //   const height = +svg.attr("height");
  //   const margin = { top: 50, right: 150, bottom: 50, left: 60 };
  //   const innerWidth = width - margin.left - margin.right;
  //   const innerHeight = height - margin.top - margin.bottom;
  //   const g = svg
  //     .append("g")
  //     .attr("transform", `translate(${margin.left}, ${margin.top})`);
  //   let root;
  //   let color;

  //   const fill = (d) => {
  //     if (d.depth === 0) return color(d.data.name);
  //     while (d.depth > 1) d = d.parent;
  //     return color(d.data.name);
  //   };

  //   const render = function (data) {
  //     color = d3
  //       .scaleOrdinal()
  //       .domain(
  //         root
  //           .descendants()
  //           .filter((d) => d.depth <= 1)
  //           .map((d) => d.data.name)
  //       )
  //       .range(d3.schemeCategory10);

  //     g.selectAll("path")
  //       .data(root.links())
  //       .join("path")
  //       .attr("fill", "none")
  //       .attr("stroke", "black")
  //       .attr("stroke-width", 1.5)
  //       .attr(
  //         "d",
  //         d3
  //           .linkHorizontal()
  //           .x((d) => d.y)
  //           .y((d) => d.x)
  //       );

  //     // alternatively, we can use the following code to do a single data-join;
  //     // then, use .append() to add circles and texts;
  //     /*const node = g.append("g")
  //       .selectAll("g")
  //       .data(root.descendants())
  //       .join("g")
  //       .attr("transform", d => `translate(${d.y},${d.x})`);*/

  //     g.selectAll("circle")
  //       .data(root.descendants())
  //       .join("circle")
  //       // optionally, we can use stroke-linejoin to beautify the path connection;
  //       //.attr("stroke-linejoin", "round")
  //       .attr("stroke-width", 3)
  //       .attr("fill", fill)
  //       .attr("cx", (d) => d.y)
  //       .attr("cy", (d) => d.x)
  //       .attr("r", 6);

  //     g.selectAll("text")
  //       .data(root.descendants())
  //       .join("text")
  //       .attr("text-anchor", (d) => (d.children ? "end" : "start"))
  //       // note that if d is a child, d.children is undefined which is actually false!
  //       .attr("x", (d) => (d.children ? -6 : 6) + d.y)
  //       .attr("y", (d) => d.x + 5)
  //       .text((d) => d.data.name);
  //   };

  //   d3.json("http://127.0.0.1:5501/games.json").then((data) => {
  //     root = d3.hierarchy(data);
  //     // alternatively, we can set size of each node;
  //     // root = d3.tree().nodeSize([30, width / (root.height + 1)])(root);
  //     root = d3.tree().size([innerHeight, innerWidth])(root);
  //     render(root);
  //   });
  // }, []);

  const handleTextAreaChange = (e) => {
    setTextAreaValue(e.target.value);
  };
  const handleButtonClick = () => {
    console.log("要上传的内容：", textAreaValue);
  };

  const onChange = (e) => {
    console.log("Change:", e.target.value);
  };
  const onSearch = (value) => {
    console.log(value);
    async function findProcess(processName) {
      // const materials=await fetch('http://localhost:8090/api/material-delivery/find-material-by-materialid',{
      const process = await fetch("http://localhost:8090/api/ai/ai-sql", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          question: value,
        }),
      });

      return process.json();
    }

    findProcess("dispensing").then((data) => {
      console.log(value, data.sql);

      setAiSql(`
    ${data.sql}
    `);

      // setQuestionList([{ question: value, answer: data.sql }, ...questionList]);
    });
  };

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
      setSearchResult(data);
      let rawData=data.allProcessDispensing
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
  
      const svg = d3.select(svgRef.current)
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
            console.log(d)
          tooltip.transition().duration(200).style("opacity", 0.9);
          tooltip
            .html(`<p>${d.process}</p></br>
            <p>${d.productSize}</p></br>
            <p>${d.projectId}</p></br>`)
            .style("left", event.pageX + "px")
            .style("top", event.pageY - 28 + "px");
        })
        .on("mouseout", (event, d) => {
          tooltip.transition().duration(500).style("opacity", 0);
        });


      setQuestionList([{ question: '我们做过的dispensing项目有多少', answer: data.count },{ question: '现在数据库中有几种工艺', answer: data.process.toString() },{ question: '每种工艺分别有多少项目', answer: JSON.stringify(data.processGroup) },{ question: '产品体积小于800000的dispensing项目', answer: JSON.stringify(data.filterSize) },{ question: '展示所有我们做过的dispensing项目', answer: JSON.stringify(data.allProcessDispensing) }, ...questionList]);
    });
  }, []);





  return (
    <>
      <h1>Process Database Artificial General Intelligence</h1>
      <div id="search-container">
        <div id="search-control">
          <Space direction="vertical">
            <Search
              placeholder="input search text"
              allowClear
              enterButton="Search"
              size="large"
              onSearch={onSearch}
            />
            {/* <TextArea
          showCount
          maxLength={1000}
          style={{
            height: 120,
            marginBottom: 24,
          }}
          onChange={handleTextAreaChange}
          placeholder=""
        />
        <Button type="primary" block onClick={handleButtonClick}>
          Run Command
        </Button> */}
          </Space>
          <ReactMarkdown
            children={aiSql}
            components={{
              code({ node, inline, className, children, ...props }) {
                return (
                  <SyntaxHighlighter
                    children={String(children).replace(/\n$/, "")}
                    language={"javascript"}
                    {...props}
                  />
                );
              },
            }}
          />
        </div>

        <div id="search-result">
          <List
            className="question-list"
            itemLayout="horizontal"
            dataSource={questionList}
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
                    />
                  }
                  title={<a href="#">{item.question}</a>}
                  description={item.answer}
                />
              </List.Item>
            )}
          />
          <div>        
        {/* <svg
      width="1600"
      height="900"
      id="mainsvg"
      className="svgs"
      ref={svgRef}
    ></svg> */}
    <svg
      
      ref={svgRef}
    ></svg>
    </div>
        </div>
        
      </div>
    </>
  );
};

export default Chat;
