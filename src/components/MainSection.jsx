import React,  { useState, useRef, useEffect } from 'react';
import Sketch from "react-p5";
import doLinesIntersect from "./functions/doLinesIntersect.js";
import './css/SectionMain.css'
import {generateRandomPolygon,lines,centers} from './functions/generateRandomPolygon.js';
import {buttonNumPressed} from './Control.jsx'
import DatabaseComponent from './Prueba.jsx'
import {beginNewDataCount} from './Prueba.jsx'




const degreesToRadians = (deg) => deg * Math.PI / 180;
const getRobotRotationAngle = (robotElement) => {
  const { transform } = getComputedStyle(robotElement);
  const [a, b] = transform.match(/-?\d+\.?\d*/g).map(parseFloat);
  return Math.atan2(b,a) * (180 / Math.PI); // angulo de robot
};


const SENSOR_MEASURES = [
  { angle: 0, distance: 140 },
  { angle: 120, distance: 140 },
  { angle: 240, distance: 140 },
];

export function MainSection(props) {
  const robotRef = useRef(null);

  //Robot position
  const [robotLeft, setRobotLeft] = useState(0);
  const [robotBottom, setRobotBottom] = useState(0);
  const [robotTransform, setRobotTransform] = useState(120);

  //Measueres distance sensor
  const [sensorDistances, setSensorDistances] = useState(SENSOR_MEASURES.map((sensor) => sensor.distance));
  const [hrHeight, setHrHeight] = useState([{hrY:140},{hrY:140},{hrY:140}])
  // State that will be used to compare past values with current values measured by sensors.
  const [sensorPositions, setSensorPositions] = useState([
    { x: 0, y: 0 }, 
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ]);

  const [goal, setGoal] = useState();  
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
//______________________________//
let sectionWidth, sectionHeight;


let isThereSq = true;
const handleClick = (event) => {


  if(isThereSq){

  const section = document.getElementById("main");
  const rect = section.getBoundingClientRect();
  const x = event.pageX - rect.left; // Posición X del mouse relativa a la sección "main"
  const y = event.pageY - rect.top; // Posición Y del mouse relativa a la sección "main"
  setGoal({x:x,y:y});
  isThereSq = false; //Aseguramos que solo haya una meta a la que el robot debe llegr 
  //console.log(x, y);
  const squareElement = document.createElement("div");
  squareElement.style.position = "absolute";
  squareElement.style.width = "50px";
  squareElement.style.height = "50px";
  squareElement.style.backgroundColor = "red";
  squareElement.style.left = `${x}px`;
  squareElement.style.top = `${y}px`;
  section.appendChild(squareElement);
  event.stopPropagation(); // Detener la propagación del evento
  
  centers.push({x:x+25,y:y+25});
  for (let i = 0; i <30; i++) {
    //Crea obstaculos para el robot dentro del rango de la seccion main
    generateRandomPolygon(sectionWidth,sectionHeight)
    }
  }
}

useEffect(() => {
  // Agregar el nuevo manejador de eventos "click"
  document.addEventListener("click", handleClick);

  return () => {
    // Eliminar el manejador de eventos "click" al desmontar el componente
    document.removeEventListener("click", handleClick);
  };
}, []);

/////////////////////////////////////////


////////////////////////////////

const setup = (p5, canvasParentRef) => {
  const section = document.getElementById("main");
  sectionWidth = section.offsetWidth;
  sectionHeight = section.offsetHeight;
  p5.createCanvas(sectionWidth, sectionHeight).parent(canvasParentRef);
};
function drawSensorLine(sensor, p5, measure, deg, robotDeg = 0, drawActive) {
  const section = document.getElementById("main");
  const positionSensorX = robotLeft + robot.offsetWidth / 2
  const positionSensorY = robotBottom + section.offsetHeight - robot.offsetHeight / 2;
  const mDeg = degreesToRadians(deg); //Angulo de sensor
  const rDeg = degreesToRadians(robotDeg); //Angulo de robot
  const x = positionSensorX + measure * Math.cos(mDeg + rDeg) ;
  const y = positionSensorY - measure * Math.sin(mDeg + rDeg) ;

  function isPointInLineSegment(px, py, line) {
    // Get segment coordinates
    const x1 = line.x1, y1 = line.y1, x2 = line.x2, y2 = line.y2;
    
    // Calculate distances
    const dx = x2 - x1;
    const dy = y2 - y1;
    
    // Calculate dot product
    const dotProduct = (px - x1) * dx + (py - y1) * dy;
    
    // Calculate squared length of the line segment
    const squaredLength = dx * dx + dy * dy;
    
    // Check if the point is on the line segment
    return dotProduct > 0 && dotProduct < squaredLength;
  }

 // Find intersections with lines sorted by distance to sensor
 const linesWithDistances = lines.map(line => {
  const dx = line.x2 - line.x1;
  const dy = line.y2 - line.y1;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return { line, distance };
});
linesWithDistances.sort((a, b) =>  
  sensor==="sensor1"? a.distance + b.distance: 
  sensor==="sensor2"? -a.distance - b.distance:
  a.distance - b.distance);

let intersection = null;
for (let i = 0; i < linesWithDistances.length; i++) {
  const { line } = linesWithDistances[i];
  const currentIntersection = doLinesIntersect(
    positionSensorX,
    positionSensorY,
    x,
    y,
    line.x1,
    line.y1,
    line.x2,
    line.y2
  );
  if (currentIntersection && isPointInLineSegment(currentIntersection[0], currentIntersection[1], line)) {
    intersection = currentIntersection;
    break;
  }
}
  if (intersection) {
    p5.stroke(255);
    p5.line(intersection[0], intersection[1], intersection[0], intersection[1]);
  }
  // Actualizar la posición anterior del sensor
  setSensorPositions(prevPositions => [
    ...prevPositions.slice(0, parseInt(sensor.slice(-1)) - 1),
    {x, y},
    ...prevPositions.slice(parseInt(sensor.slice(-1)))
  ]);

  // Update HR height based on intersection
  if (sensor === "sensor1") {
    setHrHeight(prevState => [
      intersection ? {hrY: positionSensorY - intersection[1]} : {hrY: 140},
      prevState[1],
      prevState[2],
    ]);
  } if (sensor === "sensor2") {
    setHrHeight(prevState => [
      prevState[0],
      intersection ? {hrY: Math.sqrt((intersection[0]-positionSensorX)**2+(intersection[1]-positionSensorY)**2)} : {hrY: 140},
      prevState[2],
    ]);
    //console.log(intersection);
  } if (sensor === "sensor3") {
    setHrHeight(prevState => [
      prevState[0],
      prevState[1],
      intersection ? {hrY:  Math.sqrt((intersection[0]-positionSensorX)**2+(intersection[1]-positionSensorY)**2)} : {hrY: 140},
    ]);
  }
}




const draw = (p5) => {
  p5.stroke(255);
  drawSensorLine("sensor1",p5,sensorDistances[0], 90, -robotTransform, activeSensors[0]);
  drawSensorLine("sensor2",p5,sensorDistances[1], 210, -robotTransform, activeSensors[1]);
  drawSensorLine("sensor3",p5,sensorDistances[2], 330, -robotTransform, activeSensors[2]);
};
const section = document.getElementById("main");

const dataBatch = ()=>{
  if(goal && section && buttonNumPressed)
  {
    //console.log(buttonNumPressed);
    return [goal.x, goal.y, robotLeft, robotBottom + section.offsetHeight, robotTransform, hrHeight[0].hrY, hrHeight[1].hrY, hrHeight[2].hrY];
  }else{
    return false;
  }
}
  
  return (
    <section id="main" className="item item3">
      <DatabaseComponent dataBatch={dataBatch}/>
      <Sketch setup={setup} draw={draw} />
      <div id="robot" ref={robotRef}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={`sensor r${i}`}>
            <hr
              style={{height : `${hrHeight[i-1].hrY -5}px`}}
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

