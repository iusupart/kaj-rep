import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Auth from './screens/AuthPage';
import Calendar from './screens/Calendar';
import SVGCanvas from './screens/SVGCanvas';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Auth />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/svg" element={<SVGCanvas />} />
      </Routes>
    </Router>
  );
}

export default App;
