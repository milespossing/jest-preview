import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';

import { Stack } from 'office-ui-fabric-react';
import { breakpoints } from './theme.style';

import './App.css';
import LeftNav from './components/LeftNav/LeftNav';
import TestResult from './pages/TestResult/TestResult';

function App() {
  return (
    <div className="App">
      <Stack horizontal>
        <LeftNav />
      
        <TestResult />
      </Stack>
    </div>
  );
}

export default App;
