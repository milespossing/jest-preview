import React from 'react';
import PropTypes from 'prop-types';
import { Nav } from 'office-ui-fabric-react/lib/Nav';

const LeftNav = ({ className: classNameProp, ...other }) => {

  const getLinks = () => {
    //TODO read from file 
    const masterFile = {
      "masterFile": [
        {
          "name": "Case1",
          "sourceFileName": "test1.js",
          "renderFileName": [
            "testFiles/case1/test1.html",
            "testFiles/case1/test2.html"
          ]
        },
        {
          "name": "Case12",
          "sourceFileName": "test2.js",
          "renderFileName": [
            "testFiles/case1/test21.html",
            "testFiles/case1/test22.html"
          ]
        }
      ]
    };

    var itemRows = [];
    masterFile.masterFile.forEach(testCase =>{
      const testCaseRows = testCase.renderFileName.map(renderFileName => {
        const filePathArr = renderFileName.split('/');
        const fileName = filePathArr[filePathArr.length-1];
         return {
          name: fileName,
          url: `load/${renderFileName}`, // TODO need to verify path
          key: fileName,
        };     
      });

      itemRows.push({
        name: testCase.name,
        links: testCaseRows
      });
      
    });
    return itemRows;
  };

  const links = getLinks();

  const _onRenderGroupHeader = (group) => {
    return <h3>{group.name}</h3>;
  };

  return (
    <div>
      <Nav
        onRenderGroupHeader={_onRenderGroupHeader}
        groups={links}
      />
    </div>
  );
};

LeftNav.propTypes = {
  className: PropTypes.string,
};

LeftNav.defaultProps = {
  className: ''
};

export default LeftNav;
