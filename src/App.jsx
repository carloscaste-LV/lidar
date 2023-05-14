import { useState } from 'react'
import MenuOptions from './components/MenuOptions.jsx';
import {MainSection} from './components/MainSection.jsx';
import Control from './components/Control.jsx';
import './grid.css'
import './App.css'
import './Button.css'



function App() {
  

  return (
    <div className="App">
      <div className='grid-app'>
        <section id="header" className="item item1">1#</section>
        <MenuOptions/>
        <MainSection/>
        <Control/>
      </div>
    </div>
  )
}

export default App
