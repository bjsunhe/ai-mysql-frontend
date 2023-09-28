import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import "./Chat.css";

import { Input, Space, Button } from "antd";
import { Avatar, List } from "antd";
import { Form, InputNumber } from "antd";
import { Menu } from "antd";

import { useHistory } from "react-router-dom";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
const { Search } = Input;
const { TextArea } = Input;

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 8,
  },
};


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

  const onFinish = (values) => {
    console.log(values.sql.toString());
    async function processCount(sql) {
      // const materials=await fetch('http://localhost:8090/api/material-delivery/find-material-by-materialid',{
      const process = await fetch(
        "http://47.245.83.150:8090/api/ai/run-mysql",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            sql,
          }),
        }
      );

      return process.json();
    }

    processCount(values.sql.toString()).then((data) => {
      console.log(data);
      

      setQuestionList([
        { question: "Result from Process Database", answer: JSON.stringify(data.result) },
        
      ]);
    });
    
  };

  useEffect(() => {
    
  }, []);

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
    getItem("Navigation", "sub1", null, [
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
  
  const history=useHistory()
  const onClick = (e) => {
    console.log("click ", e);
    history.push(e.key)
  };

  return (
    <>
    <Menu
            onClick={onClick}
            style={{
              width: 256,
              position:'absolute',
              top:50,
              left:50,
              zIndex:10001
            }}
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            mode="inline"
            items={items}
          />
      <h1>Process Database - Run SQL</h1>
      
      <div id="search-container">
        <div id="search-control">
        
          <Space direction="vertical">
            <Form
              {...layout}
              name="nest-messages"
              onFinish={onFinish}
              style={{
                width: 900,
                height:600,
                
              }}
            >
              <Form.Item  label="SQL"  name="sql">
                <Input.TextArea rows={20}/>
              </Form.Item>
              <Form.Item
                wrapperCol={{
                  ...layout.wrapperCol,
                  offset: 8,
                }}
              >
                <Button type="primary" htmlType="submit">
                  Run SQL
                </Button>
              </Form.Item>
            </Form>
          </Space>
          
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
            <svg ref={svgRef}></svg>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
