import React, { useEffect, useRef, useState } from 'react';
import { DiffDOM } from 'diff-dom';
import './App.css';

function App() {
  const ref = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [speed, setSpeed] = useState(1000);
  const [diffs, setDiffs] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const response = await fetch('/diff.json');
      const diff = await response.json();
      setIsLoading(false);


      setDiffs(diff);
    }

    fetchData();

  }, []);


  function delay(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
  }

  async function start() {
    const diffDom = new DiffDOM();

    const queue = [...diffs];

    while(queue.length > 0) {
      const diff = queue.shift();
      diffDom.apply(ref.current, [diff]);
      await delay(speed);
    }
  }

  function reset() {
    ref.current.innerHTML = '';
  }


  return (
    <div className="App">
    <h1>App2</h1>

    <p>todo item should be crossed out after completing</p>

    <div>

    <p style={{display: 'inline-block'}}>Speed: 1 dom change every <input type="number" placeholder="milliseconds" value={speed || ''} onChange={event => setSpeed(Number(event.target.value))} style={{display:'inline-block', width: 60}} /> milliseconds</p>
    
    <button onClick={start} disabled={isLoading} style={{marginLeft: 10}}>Start</button>
    <button onClick={reset} disabled={isLoading} style={{marginLeft: 10}}>Reset</button>
    </div>



    <div  style={{
      width: '100%',
      height: '700px',
      border: 'solid 1px green'
    }}>

    <div ref={ref}></div>



    </div>
    </div>
  );
}

export default App;
