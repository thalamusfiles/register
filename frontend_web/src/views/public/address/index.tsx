import { Breadcrumb, Col, Container, Row, Stack } from 'react-bootstrap';
import { Route, Routes } from 'react-router-dom';
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
  return (
    <>
      <h1>{__('menu.address')}</h1>
      <p>{__('home.address_description')}</p>
      <Stack direction="horizontal" gap={3}>
        <TCardTile
          title={__('menu.establishments')}
          subtitle={__('menu.freemium')}
          faicon={IconsDef.zipcode}
          onClick={() => historyPush('addresses_zipcode')}
        />
        <TCardTile
          title={__('menu.business_type')}
          subtitle={__('menu.freemium')}
          faicon={IconsDef.zipcode}
          onClick={() => historyPush('addresses_businesstype')}
        />
      </Stack>
    </>
  );
};

export default AddressPage;
