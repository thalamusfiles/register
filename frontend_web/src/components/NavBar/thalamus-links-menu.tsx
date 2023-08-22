import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useI18N } from '../../commons/i18';
import { getLinkTo } from '../../commons/route';
import { thalamusLinks } from '../../config/thalamus.data';

const ThalamusLinksMenu: React.FC = () => {
  const __ = useI18N();
  return (
    <NavDropdown
      className="nav_menu_thalamus"
      title={
        <>
          <FontAwesomeIcon icon={'table-cells'} /> <span className="d-lg-none">{__('menu.aplications')}</span>
        </>
      }
    >
      <ul>
        {Object.values(thalamusLinks).map((link, idx) => (
          <li className="text-center" key={idx}>
            <a className="app_link" href={getLinkTo(link.link)} target="_blank" rel="noreferrer">
              <span className={'icon ' + link.name.toLocaleLowerCase()}></span>
              <span>{link.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </NavDropdown>
  );
};

export default ThalamusLinksMenu;
