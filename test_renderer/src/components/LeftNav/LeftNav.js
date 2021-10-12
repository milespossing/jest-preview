import React from 'react';
import PropTypes from 'prop-types';
import { Nav } from 'office-ui-fabric-react/lib/Nav';
import clsx from 'clsx';
import { useHistory, useLocation } from 'react-router-dom';
import { FontIcon } from 'office-ui-fabric-react/lib/Icon';
import styles from './LeftNav.style';
import theme, { breakpoints } from '../../theme.style';

const LeftNav = ({ isCollapsed, setIsCollapsed, className: classNameProp, ...other }) => {
  const history = useHistory();
  const location = useLocation();
  const isSmallScreen = false;

  const wrapperClassName = clsx(
    styles.wrapper,
    classNameProp,
    {
      [styles.wrapperExpanded]: !isCollapsed,
    },
    isSmallScreen && isCollapsed && styles.hidden,
  );
  const navClassName = clsx(
    styles.nav,
    {
      [styles.expanded]: !isCollapsed,
    },
    isSmallScreen && isCollapsed && styles.hidden,
  );

  const handleLinkClick = (event, link) => {
    if (!link.external) {
      event.preventDefault();
      history.push(link.url);
    }

    if (isSmallScreen) {
      setIsCollapsed(true);
    }
  };


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

    const itemRows = [];
    masterFile.masterFile.forEach(testCase =>{
      const headerRow =  {
        name: testCase.name,
        url: ``,
        key: testCase.name,
      };
      itemRows.push(headerRow);
      
      testCase.renderFileName.forEach(renderFileName => {
        const testCaseRows = {
          name: renderFileName,
          url: `testFiles/${testCase.name}/${renderFileName}`, // TODO need to verify path
          key: renderFileName,
        };
        itemRows.push(testCaseRows);
      });

      
    });

    
    return itemRows;
  };

  const links = getLinks();

  const getSelectedKey = () => {
    const pathParts = location.pathname.split('/');
    if (pathParts[1] === '') {
      return 'home';
    }
    if (pathParts[1] === 'add-adjustment') {
      return 'adjustments';
    }

    const activeLink = links.find(link => pathParts[1] === link.key);
    return activeLink ? activeLink.key : null;
  };

  return (
    <div className={wrapperClassName}>
      <Nav
        onRenderLink={item => (
          <div className="ms-Nav-linkText" data-testid={`left-nav-${item.name}`}>
            {item.name}
            {item.external && (
              <>
                {' '}
                <FontIcon
                  iconName={item.external.icon}
                  className={item.external.class}
                  style={{ color: !item.disabled && theme.palette.themePrimary }}
                />
              </>
            )}
          </div>
        )}
        selectedKey={getSelectedKey()}
        className={navClassName}
        onLinkClick={handleLinkClick}
        groups={[
          {
            links: links.filter(l => l.url.trim() !== ''),
          },
        ]}
        {...other}
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
