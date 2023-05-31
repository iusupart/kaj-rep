import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Auth from './screens/AuthPage';
import Calendar from './screens/Calendar';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Auth />} />
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
    </Router>
  );
}

export default App;
