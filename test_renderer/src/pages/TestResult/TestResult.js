
import { useLocation } from 'react-router-dom';

const TestResult = () => {
  const { pathname } = useLocation();
  if (!pathname.includes('/load')) {
    return null;
  }
  //http://localhost:3000/load/testFiles/case1/test1.html
  const iframeUrl = pathname.replaceAll('/load', '');
  return (
    <div>
      <iframe style={{ width: '100%', height: '100%' }}
        src={iframeUrl}
        frameBorder="0"
      />
    </div>
  );
};

export default TestResult;