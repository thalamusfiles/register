import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Container } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import * as json from '../../../package.json';
import { useI18N } from '../../commons/i18';
import { historyPush } from '../../commons/route';
import NotificationValue, { NotificationProvider, useNotificationStore } from '../../components/Notification/ctrl';
import thalamusLinks from '../../config/thalamus.links';
import UserCtxInstance, { useUserStore } from '../../store/userContext';

const { docUrl } = json as any;

const Header: React.FC = () => {
  const __ = useI18N();
  const context = useUserStore();

  return (
    <Navbar className="header" expand="lg" fixed="top">
      <Container fluid>
        <Navbar.Brand href="/mgt/home">
          <>
            <img src="/logo.png" alt="logo" />
            {__('menu.brand')}
          </>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarScroll" />

        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto" style={{ minWidth: 150 }}>
            <Nav.Link href="/mgt/home">{__('menu.home')}</Nav.Link>
          </Nav>

          <Nav className="me-end">
            <Nav.Link href={docUrl} target="_blanck">
              <FontAwesomeIcon className="text-warning" icon={'question-circle'} /> {__('menu.help')}
            </Nav.Link>

            <NotificationProvider value={NotificationValue}>
              <NotificationBell />
            </NotificationProvider>
            <div className="navbar-spacer" />

            <NavDropdown title={<FontAwesomeIcon icon={'list'} />} id="user-dd">
              {Object.values(thalamusLinks).map((link, idx) => (
                <NavDropdown.Item onClick={() => historyPush(link.link, { open: true })} key={idx}>
                  {link.name}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
            <div className="navbar-spacer" />

            <NavDropdown title={<FontAwesomeIcon icon={'user-circle'} />} id="user-dd">
              <NavDropdown.Item onClick={() => historyPush('login', { open: true })}>{__('menu.login')}</NavDropdown.Item>
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
