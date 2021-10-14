
import { useLocation } from 'react-router-dom';
import {Stack} from 'office-ui-fabric-react';

const TestResult = () => {
  const { pathname } = useLocation();
  if (!pathname.includes('/load')) {
    return null;
  }
  //http://localhost:3000/load/testFiles/case1/test1.html
  const iframeUrl = pathname.replaceAll('/load', '');
  return (
    <Stack.Item grow={4}>
      <iframe id="test-result-iframe" style={{ width: '100%', height: '100%', border: 'solid 4px gray', boxSizing: 'border-box' }}
        src={iframeUrl}
        frameBorder="0"
      />
    </Stack.Item>
  );
};

export default TestResult;