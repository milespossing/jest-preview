import React from 'react';
import PropTypes from 'prop-types';
import { Nav } from 'office-ui-fabric-react/lib/Nav';
import clsx from 'clsx';
import { useHistory, useLocation } from 'react-router-dom';
import { FontIcon } from 'office-ui-fabric-react/lib/Icon';
import styles from './LeftNav.style';
import theme, { breakpoints } from '../../theme.style';

const LeftNav = ({ isCollapsed, setIsCollapsed, className: classNameProp, ...other }) => {

  const getLinks = () => {
    //TODO read from file 
    const masterFile = {
      "masterFile": [
        {
          "name": "Case1",
          "sourceFileName": "test1.js",
          "renderFileName": [
            "test1.html",
            "test2.html"
          ]
        },
        {
          "name": "Case12",
          "sourceFileName": "test2.js",
          "renderFileName": [
            "test21.html",
            "test22.html"
          ]
        }
      ]
    };

    var itemRows = [];
    masterFile.masterFile.forEach(testCase =>{
      const testCaseRows = testCase.renderFileName.map(renderFileName => {
         return {
          name: renderFileName,
          url: `testFiles/${testCase.name}/${renderFileName}`, // TODO need to verify path
          key: renderFileName,
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
  isCollapsed: PropTypes.bool.isRequired,
  setIsCollapsed: PropTypes.func,
};

LeftNav.defaultProps = {
  className: '',
  setIsCollapsed: () => {},
};

export default LeftNav;
