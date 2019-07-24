import React from 'react';
import Slider from './Slider';
import './App.css';

const App = () => (
  <div className="App">
    <Slider>
      <div className="slide" style={{ backgroundColor: '#ccc' }}>
        1
      </div>
      <div className="slide" style={{ backgroundColor: '#ccc' }}>
        2
      </div>
      <div className="slide" style={{ backgroundColor: '#ccc' }}>
        3
      </div>
    </Slider>
  </div>
);

export default App;
