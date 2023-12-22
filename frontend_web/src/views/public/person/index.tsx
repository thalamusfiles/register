import { Breadcrumb, Col, Container, Row } from 'react-bootstrap';
import { Route, Routes, useLocation } from 'react-router-dom';
import { IconsDef } from '../../../commons/consts';
import { useI18N } from '../../../commons/i18';
import { historyPush } from '../../../commons/route';
import TCardTile from '../../../components/Card/card-tile';
import DeveloperGuide from '../../cards/developer-guide';
import SideBarHome from '../home/sidebarhome';
import ContactPage, { ContactBreadcrum } from './contact';
import PersonLegalPage, { PersonLegalBreadcrum } from './legal';
import PartnerPage, { PartnerBreadcrum } from './partner';

const PersonPage: React.FC = () => {
  return (
    <Container fluid>
      <Routes>
        <Route path="/legal/*" element={<PersonLegalBreadcrum />} />
        <Route path="/contact" element={<ContactBreadcrum />} />
        <Route path="/partner" element={<PartnerBreadcrum />} />
        <Route path="/" element={<PersonBreadcrum />} />
      </Routes>

      <Row>
        <Col md={2} className="d-none d-lg-block">
          <SideBarHome />
        </Col>
        <Col>
          <Row>
            <Col md={12} lg={8}>
              <PersonHeader />

              <Routes>
                <Route path="/legal" element={<PersonLegalPage />} />
                <Route path="/legal/:document" element={<PersonLegalPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/partner" element={<PartnerPage />} />
                <Route path="/" element={<NoneSelected />} />
              </Routes>
            </Col>

            <Col sm={3}>
              <DeveloperGuide />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

const PersonBreadcrum: React.FC = () => {
  const __ = useI18N();
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="/">{__('menu.home')}</Breadcrumb.Item>
      <Breadcrumb.Item active>{__('menu.persons')}</Breadcrumb.Item>
    </Breadcrumb>
  );
};

const PersonHeader: React.FC = () => {
  const __ = useI18N();
  const location = useLocation();
  const hasLegalRoute = location.pathname.includes('legal');
  const hasContactRoute = location.pathname.includes('contact');
  const hasPartnerRoute = location.pathname.includes('partner');

  return (
    <>
      <h1>{__('menu.persons')}</h1>
      <p>{__('home.persons_description')}</p>

      <Row>
        <Col md="4">
          <TCardTile
            variant={hasLegalRoute ? 'info' : ''}
            title={__('menu.person_legal')}
            subtitle={__('menu.freemium')}
            faicon={IconsDef.personLegal}
            onClick={() => historyPush('person_legal')}
          />
        </Col>
        <Col md="4">
          <TCardTile
            variant={hasContactRoute ? 'info' : ''}
            title={__('menu.contact')}
            subtitle={__('menu.freemium')}
            faicon={IconsDef.contact}
            onClick={() => historyPush('contact')}
          />
        </Col>
        <Col md="4">
          <TCardTile
            variant={hasPartnerRoute ? 'info' : ''}
            title={__('menu.partners')}
            subtitle={__('menu.freemium')}
            faicon={IconsDef.partner}
            onClick={() => historyPush('person_partner')}
          />
        </Col>
      </Row>
    </>
  );
};

const NoneSelected: React.FC = () => {
  const __ = useI18N();
  return (
    <>
      <p>{__('msg.no_option_selected')}</p>
    </>
  );
};

export default PersonPage;
