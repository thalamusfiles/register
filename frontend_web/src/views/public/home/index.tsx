import { Button, Card } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { IconsDef } from '../../../commons/consts';
import { useI18N } from '../../../commons/i18';
import { historyPush } from '../../../commons/route';
import TCard from '../../../components/Card/card';
import SideBarHome from './sidebarhome';
import DeveloperGuide from '../../cards/developer-guide';
import { TotalByMonthStateChartCompProvided } from '../rel_establishment/total_by_month_state/chart';
import { TotalByMonthNatureChartCompProvided } from '../rel_type/total_by_nature/chart';

const Home: React.FC = () => {
  const randomizeShow = Math.floor(Math.random() * 10);
  return (
    <Container fluid>
      <Row>
        <Col md={2} className="d-none d-lg-block">
          <SideBarHome />
        </Col>
        <Col>
          <Row>
            <Col xs={12} lg={5}>
              <Person />
              <ByAddress />
            </Col>
            <Col lg={3}>
              <DeveloperGuide />
            </Col>
            <Col lg={3}>
              {randomizeShow < 6 && <TotalByMonthNatureChartCompProvided />}
              {randomizeShow > 5 && <TotalByMonthStateChartCompProvided />}
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

const Person: React.FC = () => {
  const __ = useI18N();
  return (
    <>
      <h1>{__('menu.persons')}</h1>
      <p>{__('home.persons_description')}</p>

      <Row>
        <Col className="d-flex justify-content-center" xll={6}>
          <TCard title={__('menu.person_legal')} subtitle={__('menu.freemium')} faicon={IconsDef.personLegal}>
            <Card.Body>
              <Card.Text>{__('home.person_legal_description')}</Card.Text>
              <Button size="sm" onClick={() => historyPush('person_legal')} variant="outline-primary">
                {__('action.access')}
              </Button>
            </Card.Body>
          </TCard>
        </Col>
        <Col className="d-flex justify-content-center" xll={6}>
          <TCard title={__('menu.contact')} subtitle={__('menu.freemium')} faicon={IconsDef.contact}>
            <Card.Body>
              <Card.Text>{__('home.contact_description')}</Card.Text>
              <Button size="sm" onClick={() => historyPush('contact')} variant="outline-primary">
                {__('action.access')}
              </Button>
            </Card.Body>
          </TCard>
        </Col>
      </Row>

      <Row>
        <Col className="d-flex justify-content-center" xll={6}>
          <TCard title={__('menu.partners')} subtitle={__('menu.freemium')} faicon={IconsDef.partner}>
            <Card.Body>
              <Card.Text>{__('home.partner_description')}</Card.Text>
              <Button size="sm" onClick={() => historyPush('person_partner')} variant="outline-primary">
                {__('action.access')}
              </Button>
            </Card.Body>
          </TCard>
        </Col>
        <Col sm={6}></Col>
      </Row>
    </>
  );
};

const ByAddress: React.FC = () => {
  const __ = useI18N();
  return (
    <>
      <h1>{__('menu.persons_by_address')}</h1>
      <p>{__('home.address_description')}</p>

      <Row>
        <Col className="d-flex justify-content-center" xll={6}>
          <TCard title={__('menu.establishments_by_zipcode')} subtitle={__('menu.freemium')} faicon={IconsDef.zipcode}>
            <Card.Body style={{ height: 80 }}>
              <Card.Text>{__('home.establishments_description')}</Card.Text>
            </Card.Body>
            <Card.Body>
              <Button size="sm" onClick={() => historyPush('addresses_zipcode')} variant="outline-primary">
                {__('action.access')}
              </Button>
            </Card.Body>
          </TCard>
        </Col>
        <Col sm={6}></Col>
      </Row>
    </>
  );
};

export default Home;
