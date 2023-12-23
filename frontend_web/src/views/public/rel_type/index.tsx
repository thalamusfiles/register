import { Breadcrumb, Col, Container, Row } from 'react-bootstrap';
import { Route, Routes, useLocation } from 'react-router-dom';
import { IconsDef } from '../../../commons/consts';
import { useI18N } from '../../../commons/i18';
import { historyPush } from '../../../commons/route';
import TCardTile from '../../../components/Card/card-tile';
import DeveloperGuide from '../../cards/developer-guide';
import SideBarHome from '../home/sidebarhome';
import TotalByMonthNaturePage, { TotalByMonthNatureBreadcrum } from './total_by_nature';
import TotalByMonthActivityPage, { TotalByMonthActivityBreadcrum } from './total_by_activity';

const RelTypePage: React.FC = () => {
  return (
    <Container fluid>
      <Routes>
        <Route path="/total_month_nature" element={<TotalByMonthNatureBreadcrum />} />
        <Route path="/total_month_activity" element={<TotalByMonthActivityBreadcrum />} />
        <Route path="/" element={<RelTypeBreadcrum />} />
      </Routes>

      <Row>
        <Col md={2} className="d-none d-lg-block">
          <SideBarHome />
        </Col>
        <Col>
          <Row>
            <Col md={12} lg={9}>
              <RelTypeHeader />

              <Routes>
                <Route path="/total_month_nature" element={<TotalByMonthNaturePage />} />
                <Route path="/total_month_activity" element={<TotalByMonthActivityPage />} />
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

const RelTypeBreadcrum: React.FC = () => {
  const __ = useI18N();
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="/">{__('menu.home')}</Breadcrumb.Item>
      <Breadcrumb.Item active>{__('menu.reports')}</Breadcrumb.Item>
      <Breadcrumb.Item active>{__('menu.type')}</Breadcrumb.Item>
    </Breadcrumb>
  );
};

const RelTypeHeader: React.FC = () => {
  const __ = useI18N();
  const location = useLocation();
  const ttMMNature = location.pathname.endsWith('total_month_nature');
  const ttMMActivity = location.pathname.endsWith('total_month_activity');

  return (
    <>
      <h1>
        {__('menu.reports')} - {__('menu.type')}
      </h1>
      <p>{__('report.type_description')}</p>

      <Row>
        <Col md="4">
          <TCardTile
            variant={ttMMNature ? 'info' : ''}
            title={__('menu.tt_month_nature')}
            subtitle={''}
            faicon={IconsDef.reports}
            onClick={() => historyPush('rel_type_tt_nature')}
          />
        </Col>
        <Col md="4">
          <TCardTile
            variant={ttMMActivity ? 'info' : ''}
            title={__('menu.tt_month_activity')}
            subtitle={''}
            faicon={IconsDef.reports}
            onClick={() => historyPush('rel_type_tt_activity')}
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

export default RelTypePage;
