import { Breadcrumb, Col, Container, Row, Stack } from 'react-bootstrap';
import { Route, Routes } from 'react-router-dom';
import { IconsDef } from '../../../commons/consts';
import { useI18N } from '../../../commons/i18';
import { historyPush } from '../../../commons/route';
import TCardTile from '../../../components/Card/card-tile';
import SideBarHome from '../home/sidebarhome';
import PersonLegalPage, { PersonLegalBreadcrum } from './legal';

const PersonPage: React.FC = () => {
  return (
    <>
      <Container fluid>
        <Routes>
          <Route path="/legal" element={<PersonLegalBreadcrum />} />
          <Route path="/partner" element={<PersonLegalBreadcrum />} />
          <Route path="/" element={<PersonBreadcrum />} />
        </Routes>

        <Row>
          <Col md={2}>
            <SideBarHome />
          </Col>
          <Col>
            <PersonHeader />
            <br />

            <Routes>
              <Route path="/legal" element={<PersonLegalPage />} />
              <Route path="/partner" element={<PersonLegalPage />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </>
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
  return (
    <>
      <h1>{__('menu.persons')}</h1>
      <p>{__('home.persons_description')}</p>
      <Stack direction="horizontal" gap={3}>
        <TCardTile
          title={__('menu.person_legal')}
          subtitle={__('menu.freemium')}
          faicon={IconsDef.personLegal}
          onClick={() => historyPush('person_legal')}
        />
        <TCardTile
          title={__('menu.partners')}
          subtitle={__('menu.freemium')}
          faicon={IconsDef.partner}
          onClick={() => historyPush('person_partner')}
        />
      </Stack>
    </>
  );
};

export default PersonPage;
