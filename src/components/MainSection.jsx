import React,  { useState, useRef, useEffect } from 'react';
import Sketch from "react-p5";
import doLinesIntersect from "./functions/doLinesIntersect.js";
import './css/SectionMain.css'

const degreesToRadians = (deg) => deg * Math.PI / 180;




const getRobotRotationAngle = (robotElement) => {
  const { transform } = getComputedStyle(robotElement);
  const [a, b] = transform.match(/-?\d+\.?\d*/g).map(parseFloat);
  return Math.atan2(b,a) * (180 / Math.PI);
};


const SENSOR_MEASURES = [
  { angle: 0, distance: 100 },
  { angle: 120, distance: 120 },
  { angle: 240, distance: 140 },
];

export default function MainSection(props) {
  const robotRef = useRef(null);

  //Robot position
  const [robotLeft, setRobotLeft] = useState(0);
  const [robotBottom, setRobotBottom] = useState(0);
  const [robotTransform, setRobotTransform] = useState(120);

  //Measueres distance sensor
  const [sensorDistances, setSensorDistances] = useState(SENSOR_MEASURES.map((sensor) => sensor.distance));

  // State that will be used to compare past values with current values measured by sensors.
  const [sensorPositions, setSensorPositions] = useState([
    { x: 0, y: 0 }, 
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ]);

  //
  
  //Mapping activation
  const [activeSensors, setActiveSensors] = useState([false, false, false]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const robotElement = robotRef.current;
      const { left, bottom} = getComputedStyle(robotElement);
      const robotRotationAngle = getRobotRotationAngle(robotElement);
      setRobotTransform(robotRotationAngle);
      setRobotLeft(parseInt(left));
      setRobotBottom(-parseInt(bottom));
    }, 1);
    return () => clearInterval(interval);
  }, []);

  

let sectionWidth, sectionHeight;


const setup = (p5, canvasParentRef) => {
  const section = document.getElementById("main");
  sectionWidth = section.offsetWidth;
  sectionHeight = section.offsetHeight;
  p5.createCanvas(sectionWidth, sectionHeight).parent(canvasParentRef);
  
  
  

  
};

function drawSensorLine(sensor, p5, measure, deg, robotDeg = 0, drawActive) {
  const section = document.getElementById("main");
  const positionSensorX = robotLeft + robot.offsetWidth / 2
  const positionSensorY = robotBottom + section.offsetHeight - robot.offsetWidth / 2;
  const mDeg = degreesToRadians(deg);
  const rDeg = degreesToRadians(robotDeg);
  const x = positionSensorX + measure * Math.cos(mDeg + rDeg) ;
  const y = positionSensorY - measure * Math.sin(mDeg + rDeg) ;

  setSensorDistances


  // Calcular la distancia entre la posición actual y anterior del sensor
  const prevPosition = sensorPositions[parseInt(sensor.slice(-1)) - 1];
  const distance = Math.sqrt((prevPosition.x - x) ** 2 + (prevPosition.y - y) ** 2);
  const intersection = doLinesIntersect(positionSensorX, positionSensorY, x, y, 0, 0, 300, 300)

  // Dibujar la línea solo si la distancia es menor al umbral establecido y la línea del sensor se intersecta con la pared
  if (distance < 30 && intersection ) {
    p5.stroke(255);
    p5.line(intersection[0], intersection[1],intersection[0], intersection[1]);
    // p5.line(pr,positionSensorY,x, y);
  }

  // // Actualizar la posición anterior del sensor
  // setSensorPositions(prevPositions => [
  //   ...prevPositions.slice(0, parseInt(sensor.slice(-1)) - 1),
  //   {x, y},
  //   ...prevPositions.slice(parseInt(sensor.slice(-1)))
  // ]);

  
}



const draw = (p5) => {
  p5.stroke(255);
  drawSensorLine("sensor1",p5,sensorDistances[0], 90, -robotTransform, activeSensors[0]);
  drawSensorLine("sensor2",p5,sensorDistances[1], 210, -robotTransform, activeSensors[1]);
  drawSensorLine("sensor3",p5,sensorDistances[2], 330, -robotTransform, activeSensors[2]);
};



  return (
    <section id="main" className="item item3">
      <Sketch setup={setup} draw={draw} />
      <div id="robot" ref={robotRef}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={`sensor r${i}`}>
            <hr
              style={{height : '200px'}}
              id={`distanceSensor${i}`}
              className={`mensure distanceSensor${i}`}
            />
          </div>
        ))}
        <div className="wheel right"></div>
        <div className="wheel left"></div>
      </div>
    </section>
  );
}
