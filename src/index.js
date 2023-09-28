import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter as Router,Switch, Route, Redirect } from "react-router-dom";
import "./index.css";
import App from "./App";
import BarChart from "./Bar/Bar";
import LineChart from "./Line/Line";
import TestChart from "./Test4/Test";
import Chat from "./Chat/Chat";
import Question from './Question/Question'
import SizeChart from './SizeChart/SizeChart'
import QuestionAnswer from './QuestionAnswer/Chat'
import QuestionAnswerDispensingNum from './QuestionAnswerDispensingNum/Chat'
import QuestionAnswerAllProcess from './QuestionAnswerAllProcess/Chat'
import QuestionAnswerProjectNum from './QuestionAnswerProjectNum/Chat'
import QuestionAnswerVolumeLessThan from './QuestionAnswerVolumeLessThan/Chat'
import QuestionAnswerDispensingDetail from './QuestionAnswerDispensingDetail/Chat'
import RunSql from './RunSql/Chat'
import RunMySql from './RunMySql/Chat'
import GptSql from './GptSql/Chat'
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <div id="container">
    {/* <App /> */}
    {/* <LineChart /> */}
    {/* <TestChart /> */}
    {/* <Chat /> */}
    <Router>
        <Route path="/" exact component={RunSql} />
        <Route path="/run-mysql"  component={RunMySql} />
        <Route path="/question-list"  component={Question} />
        <Route path="/size-chart"  component={SizeChart} />
        <Route path="/question-answer"  component={QuestionAnswer} />
        <Route path="/dispensing-projects-number"  component={QuestionAnswerDispensingNum} />
        <Route path="/all-processes"  component={QuestionAnswerAllProcess} />
        <Route path="/projects-number-for-process"  component={QuestionAnswerProjectNum} />
        <Route path="/volume-less-than"  component={QuestionAnswerVolumeLessThan} />
        <Route path="/dispensing-projects"  component={QuestionAnswerDispensingDetail} />
        <Route path="/gpt-sql"  component={GptSql} />

    </Router>
  </div>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
