import { Breadcrumb, Col, Container, Row, Stack } from 'react-bootstrap';
import { Route, Routes, useLocation } from 'react-router-dom';
import { IconsDef } from '../../../commons/consts';
import { useI18N } from '../../../commons/i18';
import { historyPush } from '../../../commons/route';
import TCardTile from '../../../components/Card/card-tile';
import SideBarHome from '../home/sidebarhome';
import ZipcodePage, { ZipcodeBreadcrum } from './zipcode';
import BusinessTypePage, { BusinessTypeBreadcrum } from './businesstype';

const AddressPage: React.FC = () => {
  return (
    <>
      <Container fluid>
        <Routes>
          <Route path="/zipcode" element={<ZipcodeBreadcrum />} />
          <Route path="/businesstype" element={<BusinessTypeBreadcrum />} />
          <Route path="/" element={<AddressBreadcrum />} />
        </Routes>

        <Row>
          <Col md={2}>
            <SideBarHome />
          </Col>
          <Col>
            <AddressHeader />
            <br />

            <Routes>
              <Route path="/zipcode" element={<ZipcodePage />} />
              <Route path="/businesstype" element={<BusinessTypePage />} />
              <Route path="/" element={<NoneSelected />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </>
  );
};

const AddressBreadcrum: React.FC = () => {
  const __ = useI18N();
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="/">{__('menu.home')}</Breadcrumb.Item>
      <Breadcrumb.Item active>{__('menu.establishments')}</Breadcrumb.Item>
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
      <Stack direction="horizontal" gap={3}>
        <TCardTile
          variant={hasZipcodeRoute ? 'info' : ''}
          title={__('menu.establishments')}
          subtitle={__('menu.freemium')}
          faicon={IconsDef.zipcode}
          onClick={() => historyPush('addresses_zipcode')}
        />
        <TCardTile
          variant={!hasZipcodeRoute ? 'info' : ''}
          title={__('menu.business_type')}
          subtitle={__('menu.freemium')}
          faicon={IconsDef.zipcode}
          onClick={() => historyPush('addresses_businesstype')}
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

export default AddressPage;
