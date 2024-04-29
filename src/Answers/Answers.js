import React, { useState, useEffect, useRef } from "react";



const Answers = ({answers}) => {


  return (
    <div>
      <ul>
        {Object.entries(answers).map(([key, value], index) => (
          <li key={index}>
            <strong>{key}</strong>: {value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Answers;
