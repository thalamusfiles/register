import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Card, Nav, Table } from 'react-bootstrap';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { useI18N } from '../../../../commons/i18';
import { getLinkTo } from '../../../../commons/route';
import TotalByMonthStateChartComp from './chart';
import { TotalByMonthStateProvider, TotalByMonthStateCtrl, useTotalByMonthStateStore } from './ctrl';

const ctrl = new TotalByMonthStateCtrl();
const TotalByMonthStatePage: React.FC = () => {
  const __ = useI18N();
  const [tab, setTab] = useState('formated' as string | null);
  ctrl.__ = __;

  useEffect(() => {
    ctrl.fillMonths();
    ctrl.findReportLastMonth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctrl]);

  return (
    <TotalByMonthStateProvider value={ctrl}>
      <p>{__('report.establishment.total_month_state.description')}</p>

      <TotalByMonthStateChartComp />
      <br />

      <Nav variant="tabs" defaultActiveKey="formated" onSelect={setTab}>
        <Nav.Item>
          <Nav.Link eventKey="formated">{__('label.table')}</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="json">{__('label.json')}</Nav.Link>
        </Nav.Item>
      </Nav>
      {tab === 'formated' && <TotalByMonthStatePrettyResult />}
      {tab === 'json' && <TotalByMonthStateResult />}
    </TotalByMonthStateProvider>
  );
};

const TotalByMonthStateBreadcrum: React.FC = () => {
  const __ = useI18N();
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="/">{__('menu.home')}</Breadcrumb.Item>
      <Breadcrumb.Item active>{__('menu.reports')}</Breadcrumb.Item>
      <Breadcrumb.Item href={getLinkTo('rel_estab')}>{__('menu.business')}</Breadcrumb.Item>
      <Breadcrumb.Item active>{__('menu.tt_month_state')}</Breadcrumb.Item>
    </Breadcrumb>
  );
};

const TotalByMonthStatePrettyResult: React.FC = observer(() => {
  const ctrl = useTotalByMonthStateStore();
  const __ = useI18N();

  return (
    <Table>
      <thead>
        <tr>
          <td>Data</td>
          <td>Estado</td>
          <td>Total</td>
        </tr>
      </thead>
      <tbody>
        {!ctrl.wanted && (
          <tr>
            <td colSpan={6}>{__('msg.enter_filter')}</td>
          </tr>
        )}
        {ctrl.wanted && !ctrl.response && (
          <tr>
            <td colSpan={6}>{__('msg.register_not_found')}</td>
          </tr>
        )}
        {ctrl.response &&
          ctrl.response.map((resp, idx) => (
            <tr key={idx}>
              <td>
                {resp.beginDate.substring(4)}/{resp.beginDate.substring(0, 4)}
              </td>
              <td>{resp.stateCode}</td>
              <td>{resp.total}</td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
});

const TotalByMonthStateResult: React.FC = observer(() => {
  const ctrl = useTotalByMonthStateStore();
  const __ = useI18N();

  return (
    <Card bg="dark" text="light">
      <Card.Body>
        {!ctrl.wanted && <p>{__('msg.enter_filter')}</p>}
        {ctrl.wanted && !ctrl.response && <p>{__('msg.register_not_found')}</p>}
        {ctrl.response && <pre>{JSON.stringify(ctrl.response, null, 2)}</pre>}
      </Card.Body>
    </Card>
  );
});

export default TotalByMonthStatePage;
export { TotalByMonthStateBreadcrum };
