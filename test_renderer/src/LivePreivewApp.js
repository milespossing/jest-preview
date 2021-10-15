import React, { useEffect, useState, useRef } from 'react';
import { DiffDOM } from 'diff-dom';
import {connect} from 'socket.io-client';
import { cloneDeep, throttle, last } from 'lodash';

const diffDom = new DiffDOM();

const setDiffDomThrottled = throttle((ref, activeTest, sliderValue, setCurrentFrame) => {
  const dom = ref.current.contentDocument.body;

  dom.innerHTML = '';

  requestAnimationFrame(() => {
    let lastIndex = 1;

    if (activeTest.htmls.length > 1) {
      if (sliderValue === 0) {
        lastIndex = 1;
      } else {
        lastIndex = Math.max(1, Math.round((sliderValue / 100) * (activeTest.htmls.length))) ;
      }
    }



    const htmls = activeTest.htmls.slice(0, lastIndex);

    setCurrentFrame(htmls.length);

    
    dom.innerHTML = last(htmls);
    // diffDom.apply(dom, diffs);
  });
}, 250);



function App() {
  const [diffs, setDiffs] = useState({});
  const [activeTest, setActiveTest] = useState(null);
  const [sliderValue, setSliderValue] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);
  const ref = useRef(null);


  useEffect(() => {
    // const s = connect(`ws://${window.location.host}`);
    const socket = connect(`ws://localhost:9000`);
    socket.on('connect', () => {
      console.log('socket connected')
      setDiffs({});
    });
    socket.on('connect_error', (error) => {
      console.log('socket connection error', error)
    });
    socket.on('testSetup', (testPath) => {
      setDiffs(prevState => {
        const newState = cloneDeep(prevState);
        newState[testPath] = {};
        return newState;
      });
    })

    socket.on('domChanged', (event) => {
      const {testPath, testName,diff, html} = event;
      
      // console.log(`domChanged ${testName}`);

      // test change so reset the DOM
      if (activeTest?.testPath !== testPath || activeTest?.testName !== testName) {
        ref.current.contentDocument.body.innerHTML = '';
      }

      requestAnimationFrame(() => {
        ref.current.contentDocument.body.innerHTML = html;
        // try {
        //   diffDom.apply(ref.current, diff);
        // } catch (error) {
        //   console.error(error);
        // }
      });

      setDiffs(prevState => {
        const newState = cloneDeep(prevState);

        if (!newState[testPath]) {
          newState[testPath] = {};
        }

        if (!newState[testPath][testName]) {
          newState[testPath][testName] = {
            testPath,
            testName,
            diffs: [],
            htmls: [],
          };
        }

        

        newState[testPath][testName].diffs.push(...diff);
        newState[testPath][testName].htmls.push(html);

        setActiveTest(newState[testPath][testName]);
       

        return newState;
      })
    })
  },[]);

  function sliderChanged(event) {
    const value = Number(event.target.value);
    setSliderValue(value);

    setDiffDomThrottled(ref, activeTest, value, setCurrentFrame);
  }

  return (
    <div style={{
      background:'black',
      color:'white'
    }}>
      <h1>Jest Live Preview</h1>


    {!activeTest && (
      <div>No active tests. Run your tests to see some live output.</div>
    )}
      <div style={{
        display:'flex',
      }}>
        <div>
          {Object.keys(diffs).map(testPath => (<div key={testPath}
          style={{
            marginBottom: 10, 
            cursor:'pointer',
            borderRadius: 6,
            padding: 6,
            
            }}>
              <div>{testPath}</div>

              {Object.keys(diffs[testPath]).map(testName => (
                <div 
                key={`${testPath}${testName}`}
                onClick={() => {
                  setSliderValue(0);
                  setCurrentFrame(0);
                  setActiveTest(diffs[testPath][testName]);

                  const dom = ref.current.contentDocument.body;

                  dom.innerHTML = '';

                  requestAnimationFrame(() => {
                    const diffsArray = diffs[testPath][testName].htmls;


                    dom.innerHTML = diffsArray[0];
                    // diffDom.apply(dom, [diffsArray[0]]);
                  });
                }}
                
                style={{
                  marginLeft:10,
                  background: activeTest?.testPath === testPath && activeTest.testName === testName ?  'aquamarine' : 'transparent',
                  color: activeTest?.testPath === testPath && activeTest.testName === testName ?  'black' : 'inherit',
                  padding: 6,
                  marginBottom: 10,
                }}>{testName}</div>
              ))}
              
              
              
              </div>))}
        </div>

          
    <div style={{flexGrow: 1, visibility: activeTest? 'visible':'hidden' }}>
      <div>
      <input type="range" min="0" max="100" value={sliderValue} onChange={sliderChanged}/>
<div>({activeTest?.htmls.length || 0}) frames --  ({currentFrame}) current frame </div>
      </div>

        <div style={{
          border: 'solid 4px grey',
          boxSizing: 'border-box',
          height: 1000
        }}>
          {/* <div ref={ref} style={{width: '100%', height:"100%"}}/> */}
          <iframe ref={ref} style={{width: '100%', height:"100%", background:'white'}}/>
        </div>

      </div>

      </div>
      
    </div>
  );
}

export default App;
