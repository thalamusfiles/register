import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Button, Container } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import * as json from '../../../package.json';
import { IconsDef } from '../../commons/consts';
import { useI18N } from '../../commons/i18';
import { getLinkTo, historyPush } from '../../commons/route';
import ThalamusLinksMenu from '../../components/NavBar/thalamus-links-menu';
import NotificationValue, { NotificationProvider, useNotificationStore } from '../../components/Notification/ctrl';
import { thalamusLinks } from '../../config/thalamus.data';
import UserCtxInstance, { useUserStore } from '../../store/userContext';

const { docUrl } = json as any;

const Header: React.FC = () => {
  const __ = useI18N();

  return (
    <Navbar className="header" expand="lg" fixed="top" bg="white">
      <Container fluid>
        <Navbar.Brand href="/">
          <>
            <img src="/logo.png" alt="logo" />
            {__('menu.brand')}
          </>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarScroll" />

        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto" style={{ minWidth: 150 }}>
            <Nav.Link href="/">{__('menu.home')}</Nav.Link>
          </Nav>

          <Nav className="me-auto d-lg-none">
            <ModulesNav />
          </Nav>

          <Nav className="me-end">
            <Button variant="outline-info" size="sm" onClick={() => historyPush('/swagger', { open: true })}>
              <FontAwesomeIcon icon={IconsDef.swagger} /> {__('card.swagger')}
            </Button>
            <Nav.Link href={docUrl} target="_blanck">
              <FontAwesomeIcon className="text-info" icon={'question-circle'} /> {__('menu.help')}
            </Nav.Link>
            <NotificationProvider value={NotificationValue}>
              <NotificationBell />
            </NotificationProvider>
            <div className="navbar-spacer" />
            <ThalamusLinksMenu />
            <div className="navbar-spacer" />
            <UserDropdown />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

const ModulesNav: React.FC = () => {
  const __ = useI18N();
  return (
    <>
      <Nav.Link href={getLinkTo('persons')}>
        <FontAwesomeIcon icon={IconsDef.user[0]} /> {__('menu.persons')}
      </Nav.Link>
      <Nav.Link href={getLinkTo('addresses')}>
        <FontAwesomeIcon icon={IconsDef.zipcode} /> {__('menu.persons_by_address')}
      </Nav.Link>
      <div className="navbar-spacer" />

      <Nav.Link href={getLinkTo('rel_estab')}>
        <FontAwesomeIcon icon={IconsDef.reports} /> {__('menu.business')}
      </Nav.Link>
      <Nav.Link href={getLinkTo('rel_type')}>
        <FontAwesomeIcon icon={IconsDef.reports} /> {__('menu.type')}
      </Nav.Link>
      <div className="navbar-spacer" />
    </>
  );
};

const UserDropdown: React.FC = observer(() => {
  const __ = useI18N();
  const context = useUserStore();

  return (
    <NavDropdown
      title={
        <>
          <FontAwesomeIcon icon={'user-circle'} /> <span className="d-lg-none">{__('menu.profile')}</span>
        </>
      }
    >
      {context?.user?.sub ? (
        <>
          <NavDropdown.Item onClick={() => historyPush(thalamusLinks.IAM_ACCOUNT.link, { open: true })}>{context?.user.name}</NavDropdown.Item>
          <NavDropdown.Item onClick={() => UserCtxInstance.logout()}>{__('menu.logout')}</NavDropdown.Item>
        </>
      ) : (
        <NavDropdown.Item href={getLinkTo('login')}>{__('menu.login')}</NavDropdown.Item>
      )}
    </NavDropdown>
  );
});

const NotificationBell: React.FC = () => {
  const __ = useI18N();
  const notify = useNotificationStore();
  return (
    <Nav.Link onClick={() => notify!.showAll()}>
      <span className="fa-layers fa-fw text-warning">
        <FontAwesomeIcon icon={'bell'} />
        {notify?.amount && <span className="fa-layers-counter">{notify?.amount}</span>}
      </span>
      <span className="d-lg-none">{__('menu.alert')}</span>
    </Nav.Link>
  );
};

export default Header;
