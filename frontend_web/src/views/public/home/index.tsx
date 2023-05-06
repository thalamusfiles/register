import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { ColorsDef, IconsDef } from '../../../commons/consts';
import { useI18N } from '../../../commons/i18';
import { historyPush } from '../../../commons/route';
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
      <Row>
        <Col sm={4}>
          <ListTile
            variant={ColorsDef.userVariant}
            faicon={IconsDef.personLegal}
            title={__('menu.person_legal')}
            onClick={() => historyPush('user_list')}
          />
        </Col>
        <Col sm={4}>
          <ListTile
            variant={ColorsDef.userVariant}
            faicon={IconsDef.partner}
            title={__('menu.partners')}
            onClick={() => historyPush('permission_list')}
          />
        </Col>
      </Row>
    </>
  );
};

const Address: React.FC = () => {
  const __ = useI18N();
  return (
    <>
      <h1>{__('menu.address')}</h1>
      <Row>
        <Col sm={6}>
          <ListTile
            variant={ColorsDef.addressVariant}
            faicon={IconsDef.cep}
            title={__('home.by_adress')}
            onClick={() => historyPush('application_list')}
          />
        </Col>
      </Row>
    </>
  );
};

export default Home;
