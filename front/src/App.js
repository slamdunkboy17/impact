import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Results from './Results';
import 'chart.js/auto';
import 'chartjs-plugin-annotation';
import Chart from 'chart.js/auto';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default App;
