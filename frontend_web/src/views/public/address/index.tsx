import { Breadcrumb, Col, Container, Row } from 'react-bootstrap';
import { Route, Routes, useLocation } from 'react-router-dom';
import { IconsDef } from '../../../commons/consts';
import { useI18N } from '../../../commons/i18';
import { historyPush } from '../../../commons/route';
import TCardTile from '../../../components/Card/card-tile';
import DeveloperGuide from '../../cards/developer-guide';
import SideBarHome from '../home/sidebarhome';
import ZipcodePage, { ZipcodeBreadcrum } from './zipcode';

const AddressPage: React.FC = () => {
  return (
    <Container fluid>
      <Routes>
        <Route path="/zipcode" element={<ZipcodeBreadcrum />} />
        <Route path="/" element={<AddressBreadcrum />} />
      </Routes>

      <Row>
        <Col md={2} className="d-none d-lg-block">
          <SideBarHome />
        </Col>
        <Col>
          <Row>
            <Col md={12} lg={8}>
              <AddressHeader />

              <Routes>
                <Route path="/zipcode" element={<ZipcodePage />} />
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

const AddressBreadcrum: React.FC = () => {
  const __ = useI18N();
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="/">{__('menu.home')}</Breadcrumb.Item>
      <Breadcrumb.Item active>{__('menu.address')}</Breadcrumb.Item>
    </Breadcrumb>
  );
};

const AddressHeader: React.FC = () => {
  const __ = useI18N();
  const location = useLocation();
  const hasZipcodeRoute = location.pathname.includes('zipcode');

  return (
    <>
      <h1>{__('menu.address')}</h1>
      <p>{__('home.address_description')}</p>
      <Row>
        <Col>
          <TCardTile
            variant={hasZipcodeRoute ? 'info' : ''}
            title={__('menu.establishments')}
            subtitle={__('menu.freemium')}
            faicon={IconsDef.zipcode}
            onClick={() => historyPush('addresses_zipcode')}
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

export default AddressPage;
