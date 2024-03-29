import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';
import { IconsDef } from '../../../commons/consts';
import { useI18N } from '../../../commons/i18';
import { getLinkTo } from '../../../commons/route';

const SideBarHome: React.FC = () => {
  const __ = useI18N();
  return (
    <div className="sidebar">
      <div className="title">{__('menu.apis')}</div>
      <SideBarAction faicon={IconsDef.user} title={__('menu.persons')} link={getLinkTo('persons')} />
      <SideBarAction faicon={IconsDef.zipcode} title={__('menu.persons_by_address')} link={getLinkTo('addresses')} />
      <SideBarAction faicon={IconsDef.parentSubsidiary} title={__('menu.parentsubsidiary')} link={getLinkTo('parentsubsidiary')} />

      <div className="title">{__('menu.reports')}</div>
      <SideBarAction faicon={IconsDef.reports} title={__('menu.business')} link={getLinkTo('rel_estab')} />
      <SideBarAction faicon={IconsDef.reports} title={__('menu.type')} link={getLinkTo('rel_type')} />
    </div>
  );
};

const SideBarAction: React.FC<any> = (props) => {
  return (
    <Row className="action">
      <Col xs={1}>
        <FontAwesomeIcon color={props.facolor} size="xs" icon={props.faicon} />
      </Col>
      <Col>
        <Link to={props.link || '/'}>{props.title}</Link>
      </Col>
    </Row>
  );
};

export default SideBarHome;
