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
      {Object.values(thalamusLinks).map((link, idx) => (
        <NavDropdown.Item href={getLinkTo(link.link)} key={idx} target="_blank">
          <span className={'icon ' + link.name.toLocaleLowerCase()}></span>
          {link.name}
        </NavDropdown.Item>
      ))}
    </NavDropdown>
  );
};

export default ThalamusLinksMenu;
