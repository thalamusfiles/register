import { observer } from 'mobx-react-lite';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ChartBarOptions } from '../../../../commons/chat.options';
import { useI18N } from '../../../../commons/i18';
import { Button, ButtonGroup, Stack } from 'react-bootstrap';
import { useEffect } from 'react';
import { TotalByMonthActivityProvider, TotalByMonthActivityCtrl, useTotalByMonthActivityStore } from './ctrl';
import { historyPush } from '../../../../commons/route';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ctrl = new TotalByMonthActivityCtrl();
const TotalByMonthActivityChartCompProvided: React.FC = () => {
  useEffect(() => {
    ctrl.fillMonths(3);
    ctrl.findReportLastMonth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctrl]);

  return (
    <TotalByMonthActivityProvider value={ctrl}>
      <TotalByMonthActivityChartComp />
    </TotalByMonthActivityProvider>
  );
};

const TotalByMonthActivityChartComp: React.FC = observer(() => {
  const ctrl = useTotalByMonthActivityStore();
  const __ = useI18N();

  return (
    <>
      <h1>{__('report.type.total_month_activity.chart', { month: `${ctrl.month.substring(4)}/${ctrl.month.substring(0, 4)}` })}</h1>
      <p>{__('report.type.total_month_activity.description')}</p>

      <TotalByMonthActivityPrettyChart />
      <br />

      <Stack>
        <ButtonGroup>
          <Button size="sm" variant="outline-info" onClick={() => historyPush('month')}>
            ...
          </Button>

          {ctrl.months.map((month) => (
            <Button key={month} size="sm" variant="outline-info" active={month === ctrl.month} onClick={() => ctrl.handleChangeMonth(month)}>
              {month.substring(4)}/{month.substring(0, 4)}
            </Button>
          ))}
        </ButtonGroup>
      </Stack>
    </>
  );
});

const options: ChartOptions = {
  ...ChartBarOptions,
  indexAxis: 'y' as const,
  elements: { bar: { borderWidth: 1 } },
  maintainAspectRatio: false,
  responsive: true,
  animations: {
    x: {
      duration: 500,
    },
    y: { duration: 500 },
  },
};

const TotalByMonthActivityPrettyChart: React.FC = observer(() => {
  const ctrl = useTotalByMonthActivityStore();

  return (
    <div style={{ height: '650px' }}>
      <Bar options={options} data={ctrl.chartData} />
    </div>
  );
});

export default TotalByMonthActivityChartComp;
export { TotalByMonthActivityChartCompProvided };
