import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";

import * as d3 from "d3";
import "./Question.css";
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
  const [textAreaValue, setTextAreaValue] = useState("");
  const [searchResult, setSearchResult] = useState({});

  const [aiSql, setAiSql] = useState("");
  const [questionList, setQuestionList] = useState([]);

  const svgRef = useRef();
  const history=useHistory()

  const onClick = (e) => {
    console.log("click ", e);
    history.push(e.key)
  };

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

    setQuestionList([{ question: value,  }, ...questionList]);
    async function addQuestion(question) {
      // const materials=await fetch('http://localhost:8090/api/material-delivery/find-material-by-materialid',{
      const process = await fetch("http://localhost:8090/api/process/add-question", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          question
        }),
      });

      return process.json();
    }

    addQuestion(value).then((data) => {
      console.log(data);
    })
  };

  useEffect(() => {
    async function getQuestionList() {
      // const materials=await fetch('http://localhost:8090/api/material-delivery/find-material-by-materialid',{
      const process = await fetch(
        "http://localhost:8090/api/process/all-question",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            
          }),
        }
      );

      return process.json();
    }

    getQuestionList().then((data) => {
      console.log(data);

      let addedQuestion=data.question.map(item=>({
        question:item.question,
        router:item.router
      }))

      setQuestionList([...addedQuestion,...questionList]);
    });
  }, []);





  return (
    <>
      <h1>BMGPT - Process Database</h1>
      <div id="search-container">
        <div id="search-control">
          <Space direction="vertical">
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
            <Search
              placeholder="input search text"
              allowClear
              enterButton="Search"
              size="large"
              onSearch={onSearch}
            />
            
          </Space>
          
        </div>

        <div id="search-result">
          <List
            className="question-list"
            itemLayout="horizontal"
            dataSource={questionList}
            renderItem={(item, index) => {
              console.log(item)
              return (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
                    />
                  }
                  title={<a href={`http://localhost:3000/#${item.router}`}>{item.question}</a>}
                  description={'--'}
                />
              </List.Item>
            )}}
          />
          <div>        
       
    </div>
        </div>
        
      </div>
    </>
  );
};

export default Chat;
