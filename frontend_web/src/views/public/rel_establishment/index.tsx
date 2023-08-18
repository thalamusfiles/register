import { Breadcrumb, Col, Container, Row } from 'react-bootstrap';
import { Route, Routes, useLocation } from 'react-router-dom';
import { IconsDef } from '../../../commons/consts';
import { useI18N } from '../../../commons/i18';
import { historyPush } from '../../../commons/route';
import TCardTile from '../../../components/Card/card-tile';
import DeveloperGuide from '../../cards/developer-guide';
import SideBarHome from '../home/sidebarhome';
import TotalByMonthStatePage, { TotalByMonthStateBreadcrum } from './total_by_month_state';
import TotalByMonthStateHistoryPage, { TotalByMonthStateHistoryBreadcrum } from './total_by_month_state_history';

const RelEstablishmentPage: React.FC = () => {
  return (
    <Container fluid>
      <Routes>
        <Route path="/total_month_state" element={<TotalByMonthStateBreadcrum />} />
        <Route path="/total_month_state_history" element={<TotalByMonthStateHistoryBreadcrum />} />
        <Route path="/" element={<RelEstablishmentBreadcrum />} />
      </Routes>

      <Row>
        <Col md={2}>
          <SideBarHome />
        </Col>
        <Col>
          <Row>
            <Col md={12} lg={8}>
              <RelEstablishmentHeader />

              <Routes>
                <Route path="/total_month_state" element={<TotalByMonthStatePage />} />
                <Route path="/total_month_state_history" element={<TotalByMonthStateHistoryPage />} />
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

const RelEstablishmentBreadcrum: React.FC = () => {
  const __ = useI18N();
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="/">{__('menu.home')}</Breadcrumb.Item>
      <Breadcrumb.Item active>{__('menu.reports')}</Breadcrumb.Item>
      <Breadcrumb.Item active>{__('menu.business')}</Breadcrumb.Item>
    </Breadcrumb>
  );
};

const RelEstablishmentHeader: React.FC = () => {
  const __ = useI18N();
  const location = useLocation();
  const ttMMStRoute = location.pathname.endsWith('total_month_state');
  const ttMMStCumRoute = location.pathname.endsWith('total_month_state_history');

  return (
    <>
      <h1>
        {__('menu.reports')} - {__('menu.business')}
      </h1>
      <p>{__('report.business_description')}</p>

      <Row>
        <Col md="4">
          <TCardTile
            variant={ttMMStRoute ? 'info' : ''}
            title={__('menu.tt_month_state')}
            subtitle={''}
            faicon={IconsDef.reports}
            onClick={() => historyPush('rel_estab_tt_month_state')}
          />
        </Col>
        <Col md="4">
          <TCardTile
            variant={ttMMStCumRoute ? 'info' : ''}
            title={__('menu.tt_month_state_history')}
            subtitle={''}
            faicon={IconsDef.chartBar}
            onClick={() => historyPush('rel_estab_tt_month_state_history')}
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

export default RelEstablishmentPage;
