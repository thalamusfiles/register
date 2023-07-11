import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Container } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import * as json from '../../../package.json';
import { useI18N } from '../../commons/i18';
import { getLinkTo, historyPush } from '../../commons/route';
import ThalamusLinksMenu from '../../components/NavBar/thalamus-links-menu';
import NotificationValue, { NotificationProvider, useNotificationStore } from '../../components/Notification/ctrl';
import { thalamusLinks } from '../../config/thalamus.data';
import UserCtxInstance, { useUserStore } from '../../store/userContext';

const { docUrl } = json as any;

const Header: React.FC = () => {
  const __ = useI18N();
  const context = useUserStore();

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

          <Nav className="me-end">
            <Nav.Link href={docUrl} target="_blanck">
              <FontAwesomeIcon className="text-warning" icon={'question-circle'} /> {__('menu.help')}
            </Nav.Link>

            <NotificationProvider value={NotificationValue}>
              <NotificationBell />
            </NotificationProvider>
            <div className="navbar-spacer" />

            <ThalamusLinksMenu />
            <div className="navbar-spacer" />

            <NavDropdown title={<FontAwesomeIcon icon={'user-circle'} />}>
              <NavDropdown.Item href={getLinkTo('login')}>{__('menu.login')}</NavDropdown.Item>
              {context?.user?.uuid && (
                <>
                  <NavDropdown.Item onClick={() => historyPush(thalamusLinks.IAM_ACCOUNT.link, { open: true })}>
                    {context?.user.name}
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => UserCtxInstance.logout()}>{__('menu.logout')}</NavDropdown.Item>
                </>
              )}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

const NotificationBell: React.FC = () => {
  const notify = useNotificationStore();
  return (
    <Nav.Link className="text-info" onClick={() => notify!.showAll()}>
      <span className="fa-layers fa-fw">
        <FontAwesomeIcon icon={'bell'} />
        {notify?.amount && <span className="fa-layers-counter">{notify?.amount}</span>}
      </span>
    </Nav.Link>
  );
};

export default Header;
