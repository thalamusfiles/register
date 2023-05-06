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
      <SideBarAction faicon={IconsDef.user} title={__('menu.persons')} link={getLinkTo('devices_connected', { inModal: true })} />
      <SideBarAction faicon={IconsDef.cep} title={__('menu.address')} link={getLinkTo('logins_history', { inModal: true })} />
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
