import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Nav } from 'office-ui-fabric-react/lib/Nav';

const LeftNav = ({ className: classNameProp, ...other }) => {

  const [masterFile, setMasterFile] = useState(null);

  useEffect(() => {
    fetchMasterJSON().then(responseJson => {
      setMasterFile(responseJson);
    });
  });


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
