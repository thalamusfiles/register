import { observer } from 'mobx-react-lite';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ChartBackgroundColor, ChartBarOptions, ChartBorderColor } from '../../../../commons/chat.options';
import { useI18N } from '../../../../commons/i18';
import { Button, ButtonGroup, Stack } from 'react-bootstrap';
import { useEffect } from 'react';
import { TotalByMonthNatureProvider, TotalByMonthNatureCtrl, useTotalByMonthNatureStore } from './ctrl';
import { historyPush } from '../../../../commons/route';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ctrl = new TotalByMonthNatureCtrl();
const TotalByMonthNatureChartCompProvided: React.FC = () => {
  useEffect(() => {
    ctrl.fillMonths(3);
    ctrl.findReportLastMonth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctrl]);

  return (
    <TotalByMonthNatureProvider value={ctrl}>
      <TotalByMonthNatureChartComp />
    </TotalByMonthNatureProvider>
  );
};

const TotalByMonthNatureChartComp: React.FC = observer(() => {
  const ctrl = useTotalByMonthNatureStore();
  const __ = useI18N();

  return (
    <>
      <h1>{__('report.type.total_month_nature.chart', { month: `${ctrl.month.substring(4)}/${ctrl.month.substring(0, 4)}` })}</h1>
      <TotalByMonthNaturePrettyChart />
      <br />

      <Stack gap={1} className="col-md-8 mx-auto">
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
      from: 0,
    },
    y: { duration: 0 },
  },
};

const TotalByMonthNaturePrettyChart: React.FC = observer(() => {
  const ctrl = useTotalByMonthNatureStore();

  const labels = ctrl.response?.map((resp) => resp.nature) || [];
  const data = {
    labels,
    datasets: [
      {
        label: 'Novos registros',
        data: ctrl.response?.map((resp) => resp.total),
        lineTension: 1,
        backgroundColor: ChartBackgroundColor,
        borderColor: ChartBorderColor,
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ height: '650px' }}>
      <Bar options={options} data={data} />
    </div>
  );
});

export default TotalByMonthNatureChartComp;
export { TotalByMonthNatureChartCompProvided };
