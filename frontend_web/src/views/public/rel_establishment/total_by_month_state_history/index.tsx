import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Card, Nav, Table } from 'react-bootstrap';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { useI18N } from '../../../../commons/i18';
import { getLinkTo } from '../../../../commons/route';
import { notify } from '../../../../components/Notification';
import { statesCode } from '../../../../datasources/commons';
import TotalByMonthStateHistoryChartComp from './chart';
import { TotalByMonthStateHistoryProvider, TotalByMonthStateHistoryCtrl, useTotalByMonthStateHistoryStore } from './ctrl';

const ctrl = new TotalByMonthStateHistoryCtrl();
const TotalByMonthStateHistoryPage: React.FC = () => {
  const __ = useI18N();
  const [tab, setTab] = useState('formated' as string | null);

  ctrl.notifyExeption = (ex: any) => {
    const status = ex.response?.status;
    if ([404].includes(status)) {
      notify.warn(__(`msg.error_${status}`));
    } else if ([400, 500].includes(status)) {
      notify.danger(__(`msg.error_${status}`));
    } else {
      notify.danger(ex.message);
    }
  };

  useEffect(() => {
    ctrl.fillMonths();
    ctrl.findReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctrl]);

  return (
    <TotalByMonthStateHistoryProvider value={ctrl}>
      <p>{__('report.establishment.total_month_state.description')}</p>

      <TotalByMonthStateHistoryChartComp />
      <br />

      <Nav variant="tabs" defaultActiveKey="formated" onSelect={setTab}>
        <Nav.Item>
          <Nav.Link eventKey="formated">{__('label.table')}</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="json">{__('label.json')}</Nav.Link>
        </Nav.Item>
      </Nav>
      {tab === 'formated' && <TotalByMonthStateHistoryPrettyResult />}
      {tab === 'json' && <TotalByMonthStateHistoryResult />}
    </TotalByMonthStateHistoryProvider>
  );
};

const TotalByMonthStateHistoryBreadcrum: React.FC = () => {
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

const TotalByMonthStateHistoryPrettyResult: React.FC = observer(() => {
  const ctrl = useTotalByMonthStateHistoryStore();
  const __ = useI18N();

  return (
    <Table>
      <thead>
        <tr>
          <td>Data</td>
          {statesCode.map((code) => (
            <td key={code}>{code.toLocaleUpperCase()}</td>
          ))}
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
          ctrl.response.map((resp: any, idx) => (
            <tr key={idx}>
              <td>
                {resp.date.substring(4)}/{resp.date.substring(0, 4)}
              </td>
              {statesCode.map((code) => (
                <td key={code}>{resp[code]}</td>
              ))}
            </tr>
          ))}
      </tbody>
    </Table>
  );
});

const TotalByMonthStateHistoryResult: React.FC = observer(() => {
  const ctrl = useTotalByMonthStateHistoryStore();
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

export default TotalByMonthStateHistoryPage;
export { TotalByMonthStateHistoryBreadcrum };
