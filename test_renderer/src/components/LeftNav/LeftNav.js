import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Nav } from 'office-ui-fabric-react/lib/Nav';
import { FontIcon } from 'office-ui-fabric-react/lib/Icon';
import styles from './LeftNav.style';

const LeftNav = ({ className: classNameProp, ...other }) => {

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

  
  const getLinks = () => {
    var itemRows = [];
    if (!masterFile) {
      return null;
    }
    masterFile.masterFile.forEach(testCase =>{
      const testCaseRows = testCase.renderFileName.map(renderFileName => {
        const filePathArr = renderFileName.split('/');
        const fileName = filePathArr[filePathArr.length-1];
         return {
          name: fileName,
          url: `/load/${renderFileName}`, // TODO need to verify path
          key: fileName,
          className: styles.success
        };     
      });

      itemRows.push({
        name: testCase.name,
        result: testCase.result,
        links: testCaseRows
      });
      
    });
    return itemRows;
  };

  const links = getLinks();
  const _onRenderGroupHeader = (group) => {
    if (group.result === 'success')
      return <h3 className={styles.success} >{group.name} &#10004; </h3>;
    else
      return <h3 className={styles.failure} >{group.name} &#x2717;  </h3>;
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
