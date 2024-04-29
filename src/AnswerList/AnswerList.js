import React, { useState, useEffect, useRef } from "react";
import Answers from "../Answers/Answers";


const AnswerList = ({question}) => {
  

  return (
    <div>
      <pre>{question.question}</pre>
      <ol>
        {JSON.parse(question.answer).map((item, index) => {
          return <li>
            <Answers answers={item} />
          </li>

        }
          
        )}
      </ol>
    </div>
  );
};

export default AnswerList;
