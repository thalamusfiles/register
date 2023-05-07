import { Button, Card, CardGroup, Stack } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { ColorsDef, IconsDef } from '../../../commons/consts';
import { useI18N } from '../../../commons/i18';
import { historyPush } from '../../../commons/route';
import TCard from '../../../components/card';
import ListTile from '../../../components/listtile';
import SideBarHome from './sidebarhome';

const Home: React.FC = () => {
  return (
    <div className="dashboard">
      <Container fluid>
        <Row>
          <Col md={{ span: 2, offset: 1 }}>
            <SideBarHome />
          </Col>
          <Col md={9} className="dashboard-content">
            <Person />
            <Address />
          </Col>
        </Row>
      </Container>
    </div>
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
            <Button size="sm" onClick={() => historyPush('user_list')}>
              {__('action.access')}
            </Button>
          </Card.Body>
        </TCard>

        <TCard title={__('menu.partners')} subtitle={__('menu.freemium')} faicon={IconsDef.partner}>
          <Card.Body>
            <Card.Text>{__('home.partner_description')}</Card.Text>
            <Button size="sm" onClick={() => historyPush('user_list')}>
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
        <TCard title={__('menu.establishments')} subtitle={__('menu.freemium')} faicon={IconsDef.cep}>
          <Card.Body>
            <Card.Text>{__('home.establishments_description')}</Card.Text>
            <Button size="sm" onClick={() => historyPush('user_list')}>
              {__('action.access')}
            </Button>
          </Card.Body>
        </TCard>
      </Stack>
    </>
  );
};

export default Home;
