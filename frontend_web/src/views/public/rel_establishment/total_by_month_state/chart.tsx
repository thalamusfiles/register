import { observer } from 'mobx-react-lite';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTotalByMonthStateStore } from './ctrl';
import { ChartBackgroundColor, ChartBarOptions, ChartBorderColor } from '../../../../commons/chat.options';
import { useI18N } from '../../../../commons/i18';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options: ChartOptions = {
  ...ChartBarOptions,
  indexAxis: 'y' as const,
  elements: { bar: { borderWidth: 1 } },
  maintainAspectRatio: false,
  responsive: true,
};

options.plugins!.title = {
  display: true,
  font: {
    size: 30,
  },
};

const TotalByMonthStatePrettyChart: React.FC = observer(() => {
  const ctrl = useTotalByMonthStateStore();
  const __ = useI18N();

  options.plugins!.title!.text = __('report.establishment.total_month_state.chart');

  const labels = ctrl.response?.map((resp) => resp.statecode) || [];
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

export default TotalByMonthStatePrettyChart;
