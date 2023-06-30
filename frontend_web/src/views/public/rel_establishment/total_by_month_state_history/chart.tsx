import { observer } from 'mobx-react-lite';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ChartBackgroundColor, ChartBorderColor } from '../../../../commons/chat.options';
import { useI18N } from '../../../../commons/i18';
import { useTotalByMonthStateHistoryStore } from './ctrl';
import { statesCode } from '../../../../datasources/commons';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TotalByMonthStateHistoryChartComp: React.FC = observer(() => {
  const __ = useI18N();

  return (
    <>
      <h1>{__('report.establishment.total_month_state_history.chart')}</h1>
      <TotalByMonthStateHistoryPrettyChart />
    </>
  );
});

const options: ChartOptions = {
  animations: {
    x: {
      duration: 500,
      from: 0,
    },
    y: { duration: 0 },
  },
};

const TotalByMonthStateHistoryPrettyChart: React.FC = observer(() => {
  const ctrl = useTotalByMonthStateHistoryStore();

  const labels = ctrl.response?.map((resp) => resp.date) || [];
  labels.reverse();

  const data = {
    labels,
    datasets: statesCode.map((code, idx) => ({
      label: code.toLocaleUpperCase(),
      data: ctrl.response?.map((resp: any) => resp[code]),
      lineTension: 1,
      backgroundColor: ChartBorderColor[idx % (ChartBackgroundColor.length - 1)],
      borderColor: ChartBackgroundColor[idx % (ChartBackgroundColor.length - 1)],
      borderWidth: 2,
    })),
  };

  return <Line options={options} data={data} />;
});

export default TotalByMonthStateHistoryChartComp;
