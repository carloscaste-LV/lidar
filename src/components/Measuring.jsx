import React, { useState } from 'react';
import Sketch from "react-p5";
import './css/SectionMain.css'


import React from 'react';
import Sketch from "react-p5";

function SensorLine(props) {
  const { id, className, robotWidth, robotHeight, sectionHeight, active } = props;

  const draw = (p5) => {
    p5.stroke(255);
    if (active === false) {
      p5.line( 
        robotWidth + p5.width / 2,
        robotHeight + sectionHeight - p5.select(`#${id}`).height - p5.height / 2,
        robotWidth + p5.width / 2,
        robotHeight + sectionHeight - p5.select(`#${id}`).height - p5.height / 2
      );
    }
  };
  
  return <Sketch setup={() => {}} draw={draw} />;
}

export default SensorLine;



