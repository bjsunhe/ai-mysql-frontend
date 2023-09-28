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
      

      setQuestionList([{ question: 'How many dispensing projects have we done?', answer: data.count }]);
      setAiSql(`
    ${data.countSql}
    `);
    });



    async function findProcess(processName) {
      // const materials=await fetch('http://localhost:8090/api/material-delivery/find-material-by-materialid',{
      const process = await fetch("http://localhost:8090/api/ai/ai-sql", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          question: 'value',
        }),
      });

      return process.json();
    }

    // findProcess("dispensing").then((data) => {

    //   setAiSql(`
    // ${data.sql}
    // `);

    //   // setQuestionList([{ question: value, answer: data.sql }, ...questionList]);
    // });
  }, []);





  return (
    <>
      <h1>Process Database</h1>
      <div id="search-container">
        <div id="search-control">
          <Space direction="vertical">
            
            
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
       
    </div>
        </div>
        
      </div>
    </>
  );
};

export default Chat;
