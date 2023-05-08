import doLinesIntersect from "./doLinesIntersect.js";


const degreesToRadians = (deg) => deg * Math.PI / 180;

const lines = [
  {x1:0,y1:0,x2:300,y2:300},
  {x1:0,y1:0,x2:350,y2:350},
  {x1:100,y1:300,x2:350,y2:550},
];



export default function drawSensorLine(sensor, p5, measure, deg, robotDeg = 0, drawActive) {
    const section = document.getElementById("main");
    const positionSensorX = robotLeft + robot.offsetWidth / 2
    const positionSensorY = robotBottom + section.offsetHeight - robot.offsetWidth / 2;
    const mDeg = degreesToRadians(deg);
    const rDeg = degreesToRadians(robotDeg);
    const x = positionSensorX + measure * Math.cos(mDeg + rDeg) ;
    const y = positionSensorY - measure * Math.sin(mDeg + rDeg) ;
  
    
  
  
    // Calcular la distancia entre la posición actual y anterior del sensor
    const prevPosition = sensorPositions[parseInt(sensor.slice(-1)) - 1];
    const distance = Math.sqrt((prevPosition.x - x) ** 2 + (prevPosition.y - y) ** 2);
    
    
    // Calcular punto de interseccion entre medicion del sensor y pared simulada
    //const intersection = doLinesIntersect(positionSensorX, positionSensorY, x, y, 0, 0, 300, 300)
    let intersection = null;
    for (let i = 0; i < lines.length; i++) {
      const currentIntersection = doLinesIntersect(
        positionSensorX,
        positionSensorY,
        x,
        y,
        lines[i].x1,
        lines[i].y1,
        lines[i].x2,
        lines[i].y2
      );
      if (currentIntersection) {
        intersection = currentIntersection;
        break;
      }
    }
    if (distance < 60 && intersection) {
      p5.stroke(255);
      p5.line(intersection[0], intersection[1], intersection[0], intersection[1]);
    }
    // Actualizar la posición anterior del sensor
    setSensorPositions(prevPositions => [
      ...prevPositions.slice(0, parseInt(sensor.slice(-1)) - 1),
      {x, y},
      ...prevPositions.slice(parseInt(sensor.slice(-1)))
    ]);
  
  
    if (sensor === "sensor1") {
      setHrHeight(prevState => [
        intersection ? {hrY: positionSensorY - intersection[1]} : {hrY: 140}, // primer objeto actualizado
        prevState[1], // segundo objeto sin cambios
        prevState[2], // tercer objeto sin cambios
      ]);
    } if (sensor === "sensor2") {
    setHrHeight(prevState => [
        prevState[0], 
        intersection ? {hrY: Math.sqrt((intersection[0]-positionSensorX)**2+(intersection[1]-positionSensorY)**2)} : {hrY: 140},
        prevState[2],
      ]);
    } if (sensor === "sensor3") {
      setHrHeight(prevState => [
        prevState[0],
        prevState[1],
        intersection ? {hrY:  Math.sqrt((intersection[0]-positionSensorX)**2+(intersection[1]-positionSensorY)**2)} : {hrY: 140},
      ]);
    }
  }