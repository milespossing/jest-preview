import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';

import { Stack } from 'office-ui-fabric-react';
import { breakpoints } from './theme.style';

import './App.css';
import LeftNav from './components/LeftNav/LeftNav';
import TestResult from './pages/TestResult/TestResult';

function App() {
  const [masterFile, setMasterFile] = useState(null);

  useEffect(() => {
    fetchMasterJSON().then(responseJson => {
      setMasterFile(responseJson);
    });
  },[]);


  async function fetchMasterJSON() {
    const response = await fetch('/master.json');
    const responseJson = await response.json();
    return responseJson;
  }

  if (!masterFile) {
    return null;
  }

  return (
    <div className="App">
      <Stack horizontal>
        <LeftNav masterFile={masterFile} />
        <TestResult />
        
      </Stack>
    </div>
  );
}

export default App;
