import { Breadcrumb, Col, Container, Row } from 'react-bootstrap';
import { Route, Routes, useLocation } from 'react-router-dom';
import { IconsDef } from '../../../commons/consts';
import { useI18N } from '../../../commons/i18';
import { historyPush } from '../../../commons/route';
import TCardTile from '../../../components/Card/card-tile';
import DeveloperGuide from '../../cards/developer-guide';
import SideBarHome from '../home/sidebarhome';
import BusinessTypePage, { BusinessTypeBreadcrum } from './businesstype';

const TypePage: React.FC = () => {
  return (
    <Container fluid>
      <Routes>
        <Route path="/businesstype" element={<BusinessTypeBreadcrum />} />
        <Route path="/" element={<TypeBreadcrum />} />
      </Routes>

      <Row>
        <Col md={2}>
          <SideBarHome />
        </Col>
        <Col>
          <Row>
            <Col md={12} lg={8}>
              <TypeHeader />

              <Routes>
                <Route path="/businesstype" element={<BusinessTypePage />} />
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

const TypeBreadcrum: React.FC = () => {
  const __ = useI18N();
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="/">{__('menu.home')}</Breadcrumb.Item>
      <Breadcrumb.Item active>{__('menu.type')}</Breadcrumb.Item>
    </Breadcrumb>
  );
};

const TypeHeader: React.FC = () => {
  const __ = useI18N();
  const location = useLocation();
  const businesstypeRoute = location.pathname.includes('businesstype');

  return (
    <>
      <h1>{__('menu.type')}</h1>
      <p>{__('home.type_description')}</p>
      <Row>
        <Col>
          <TCardTile
            variant={businesstypeRoute ? 'info' : ''}
            title={__('menu.business_type')}
            subtitle={__('menu.freemium')}
            faicon={IconsDef.zipcode}
            onClick={() => historyPush('types_businesstype')}
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

export default TypePage;
