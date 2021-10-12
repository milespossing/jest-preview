import React, {  useState } from 'react';

import { Stack } from 'office-ui-fabric-react';
import { breakpoints } from './theme.style';

import './App.css';
import LeftNav from './components/LeftNav/LeftNav';

function App() {
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < breakpoints.lg);
  return (
    <div className="App">
       <Stack horizontal>
       <LeftNav isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
       </Stack>
    </div>
  );
}

export default App;
