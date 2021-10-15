import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Nav } from 'office-ui-fabric-react/lib/Nav';
import { FontIcon } from 'office-ui-fabric-react/lib/Icon';
import styles from './LeftNav.style';
import { initializeIcons } from '@uifabric/icons';
import { useHistory } from 'react-router-dom';

const LeftNav = ({ masterFile, className: classNameProp, ...other }) => {
  const history = useHistory();

  initializeIcons();
  
  const getLinks = () => {
    var itemRows = [];
    if (!masterFile) {
      return null;
    }
    masterFile.masterFile.forEach(testCase =>{
      const iconVal = testCase.result === 'success' ? 'Accept' : 'Cancel';
      const testCaseRows = testCase.renderFileName.map(renderFileName => {
        const filePathArr = renderFileName.split('/');
        const fileName = filePathArr[filePathArr.length-1];
         return {
          name: fileName.split('testjs').pop(),// hack to show just the test name
          url: `/load/${renderFileName}`, // TODO need to verify path
          key: fileName,
          icon: iconVal
        };     
      });

      itemRows.push({
        name: testCase.name,
        result: testCase.result,
        links: testCaseRows,   
      });
      
    });
    //return itemRows;
    return [{
      links: itemRows
    }];
  };

  const links = getLinks();
  const _onRenderGroupHeader = (group) => {
    if (group.result === 'success')
      return <h3 className={styles.success} >{group.name} &#10004; </h3>;
    else
      return <h3 className={styles.failure} >{group.name} &#x2717;  </h3>;
  };

  const handleLinkClick = (event, link) => {
    if (!link.external) {
      event.preventDefault();
      history.push(link.url);
    }
  };

  return (
    <div>
      <Nav
        onRenderGroupHeader={_onRenderGroupHeader}
        groups={links}
        onLinkClick={handleLinkClick}
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
