import React, { useState, useEffect } from 'react';
import './css/Control.css'
import './css/colors.css'
import '../Button.css'

export default function Control(props) {
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);
  const [spin, setSpin] = useState(0);
  const [keysPressed, setKeysPressed] = useState({});

  function handleButtonClick(nPositionX, nPositionY) {
    let robot = document.getElementById('robot');
    setPositionX(nPositionX + positionX);
    setPositionY(nPositionY + positionY);

    // Limit the robot's movement to the size of the section
    const section = document.getElementById('main');
    const sectionWidth = section.offsetWidth;
    const sectionHeight = section.offsetHeight;
    const robotWidth = robot.offsetWidth;
    const robotHeight = robot.offsetHeight;

    const x = Math.min(Math.max(positionX + nPositionX, 0), sectionWidth - robotWidth);
    const y = Math.min(Math.max(positionY + nPositionY, 0), sectionHeight - robotHeight);

    setPositionX(x);
    setPositionY(y);

    robot.style.bottom = `${y}px`;
    robot.style.left = `${x}px`;
  }
  function spinButton(){
    setSpin(spin + 360)
    robot.style.transform=`rotate(${spin}deg)`;
    console.log(spin)
  }
  function handleKeyDown(event) {
    // Add the pressed key to the keysPressed state
    setKeysPressed(prevKeysPressed => ({
      ...prevKeysPressed,
      [event.key]: true
    }));
  }

  function handleKeyUp(event) {
    // Remove the released key from the keysPressed state
    setKeysPressed(prevKeysPressed => ({
      ...prevKeysPressed,
      [event.key]: false
    }));
  }

  useEffect(() => {
    // Move the robot when the arrow keys are pressed
    if (keysPressed.ArrowUp) {
      handleButtonClick(0, 10);
    }
    if (keysPressed.ArrowDown) {
      handleButtonClick(0, -10);
    }
    if (keysPressed.ArrowLeft) {
      handleButtonClick(-10, 0);
    }
    if (keysPressed.ArrowRight) {
      handleButtonClick(10, 0);
    }
  }, [keysPressed]);

  useEffect(() => {
    // Add event listeners for keydown and keyup events
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Remove the event listeners when the component is unmounted
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
    
    return (
            <section id="control" className="item item4">
                
                <div className='grid-derections'>
                    <button className="push spin" ><div className='no'><i className="fa fa-refresh" onClick={() =>spinButton()}></i></div></button>
                    <button className="push up-left" onClick={() => handleButtonClick(-10,10)}><div></div></button>
                    <button className="push up" onClick={() => handleButtonClick(0,10)}><div></div></button>
                    <button className="push up-right" onClick={() => handleButtonClick(10,10)}><div></div></button>
                    <button className="push bottom" onClick={() => handleButtonClick(0,-10)}><div></div></button>
                    <button className="push bottom-right" onClick={() => handleButtonClick(10,-10)}><div></div></button>
                    <button className="push bottom-left" onClick={() => handleButtonClick(-10,-10)}><div></div></button>
                    <button className="push left" onClick={() => handleButtonClick(-10,0)} ><div></div></button>
                    <button className="push right" onClick={() => handleButtonClick(10,0)}><div></div></button>
                </div>

                <div className="input-control">
                    <div className='input pwm'>
                        <p htmlFor="">pdw: </p>
                        <input type="text"/>
                    </div>
                    <div className='input kp'>
                        <p htmlFor="">kp: </p>
                        <input type="text"/>
                    </div>
                    <div className='input kd'>
                        <p htmlFor="">kd: </p>
                        <input type="text"/>
                    </div>
                    <div className='input ki'>
                        <p htmlFor="">ki: </p>
                        <input type="text"/>
                    </div>
                </div>


            </section>
    );
}