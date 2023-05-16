import { Breadcrumb, Col, Container, Row, Stack } from 'react-bootstrap';
import { Route, Routes, useLocation } from 'react-router-dom';
import { IconsDef } from '../../../commons/consts';
import { useI18N } from '../../../commons/i18';
import { historyPush } from '../../../commons/route';
import TCardTile from '../../../components/Card/card-tile';
import DeveloperGuide from '../../cards/developer-guide';
import SideBarHome from '../home/sidebarhome';
import PersonLegalPage, { PersonLegalBreadcrum } from './legal';
import PartnerPage, { PartnerBreadcrum } from './partner';

const PersonPage: React.FC = () => {
  return (
    <Container fluid>
      <Routes>
        <Route path="/legal/*" element={<PersonLegalBreadcrum />} />
        <Route path="/partner" element={<PartnerBreadcrum />} />
        <Route path="/" element={<PersonBreadcrum />} />
      </Routes>

      <Row>
        <Col md={2}>
          <SideBarHome />
        </Col>
        <Col>
          <Row>
            <Col md={12} lg={8}>
              <PersonHeader />
              <br />
              <Routes>
                <Route path="/legal" element={<PersonLegalPage />} />
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
  const hasPartnerRoute = location.pathname.includes('partner');

  return (
    <>
      <h1>{__('menu.persons')}</h1>
      <p>{__('home.persons_description')}</p>
      <Stack direction="horizontal" gap={3}>
        <TCardTile
          variant={hasLegalRoute ? 'info' : ''}
          title={__('menu.person_legal')}
          subtitle={__('menu.freemium')}
          faicon={IconsDef.personLegal}
          onClick={() => historyPush('person_legal')}
        />
        <TCardTile
          variant={hasPartnerRoute ? 'info' : ''}
          title={__('menu.partners')}
          subtitle={__('menu.freemium')}
          faicon={IconsDef.partner}
          onClick={() => historyPush('person_partner')}
        />
      </Stack>
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
