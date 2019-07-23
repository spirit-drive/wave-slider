import React from 'react';
import Slider from './Slider';
import './App.css';

const App = () => (
  <div className="App">
    <Slider>
      <div className="slide" style={{ backgroundColor: 'red' }} />
      <div className="slide" style={{ backgroundColor: 'yellow' }} />
      <div className="slide" style={{ backgroundColor: 'blue' }} />
    </Slider>
  </div>
);

export default App;
