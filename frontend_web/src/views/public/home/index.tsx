import { Button, Card, Stack } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { IconsDef } from '../../../commons/consts';
import { useI18N } from '../../../commons/i18';
import { historyPush } from '../../../commons/route';
import TCard from '../../../components/Card/card';
import SideBarHome from './sidebarhome';
import DeveloperGuide from '../../cards/developer-guide';

const Home: React.FC = () => {
  return (
    <Container fluid>
      <Row>
        <Col md={{ span: 2 }}>
          <SideBarHome />
        </Col>
        <Col>
          <Row>
            <Col md={12} lg={8}>
              <Person />
              <Type />
              <Address />
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

const Person: React.FC = () => {
  const __ = useI18N();
  return (
    <>
      <h1>{__('menu.persons')}</h1>
      <p>{__('home.persons_description')}</p>

      <Stack direction="horizontal" gap={3}>
        <TCard title={__('menu.person_legal')} subtitle={__('menu.freemium')} faicon={IconsDef.personLegal}>
          <Card.Body>
            <Card.Text>{__('home.person_legal_description')}</Card.Text>
            <Button size="sm" onClick={() => historyPush('person_legal')} variant="outline-primary">
              {__('action.access')}
            </Button>
          </Card.Body>
        </TCard>

        <TCard title={__('menu.partners')} subtitle={__('menu.freemium')} faicon={IconsDef.partner}>
          <Card.Body>
            <Card.Text>{__('home.partner_description')}</Card.Text>
            <Button size="sm" onClick={() => historyPush('person_partner')} variant="outline-primary">
              {__('action.access')}
            </Button>
          </Card.Body>
        </TCard>
      </Stack>

      <br />
    </>
  );
};

const Type: React.FC = () => {
  const __ = useI18N();
  return (
    <>
      <h1>{__('menu.type')}</h1>
      <p>{__('home.type_description')}</p>

      <Stack direction="horizontal" gap={3}>
        <TCard title={__('menu.business_type')} subtitle={__('menu.freemium')} faicon={IconsDef.zipcode}>
          <Card.Body style={{ height: 80 }}>
            <Card.Text>{__('home.business_type_description')}</Card.Text>
          </Card.Body>
          <Card.Body>
            <Button size="sm" onClick={() => historyPush('types_businesstype')} variant="outline-primary">
              {__('action.access')}
            </Button>
          </Card.Body>
        </TCard>
      </Stack>

      <br />
    </>
  );
};

const Address: React.FC = () => {
  const __ = useI18N();
  return (
    <>
      <h1>{__('menu.address')}</h1>
      <p>{__('home.address_description')}</p>

      <Stack direction="horizontal" gap={3}>
        <TCard title={__('menu.establishments')} subtitle={__('menu.freemium')} faicon={IconsDef.zipcode}>
          <Card.Body style={{ height: 80 }}>
            <Card.Text>{__('home.establishments_description')}</Card.Text>
          </Card.Body>
          <Card.Body>
            <Button size="sm" onClick={() => historyPush('addresses_zipcode')} variant="outline-primary">
              {__('action.access')}
            </Button>
          </Card.Body>
        </TCard>
      </Stack>
    </>
  );
};

export default Home;
