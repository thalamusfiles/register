import { observer } from 'mobx-react-lite';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { useI18N } from '../../../../commons/i18';
import { useTotalByMonthStateHistoryStore } from './ctrl';
import { Button, ButtonGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconsDef } from '../../../../commons/consts';
import { useState } from 'react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TotalByMonthStateHistoryChartComp: React.FC = observer(() => {
  const __ = useI18N();
  const [chartType, setChartType] = useState<'line' | 'bar'>('bar');

  return (
    <>
      <h1>
        {__('report.establishment.total_month_state_history.chart')}
        <ButtonGroup className="float-end">
          <Button size="sm" variant="info" active={chartType === 'bar'} onClick={() => setChartType('bar')}>
            <FontAwesomeIcon icon={IconsDef.chartBar} />
          </Button>
          <Button size="sm" variant="info" active={chartType === 'line'} onClick={() => setChartType('line')}>
            <FontAwesomeIcon icon={IconsDef.chartLine} />
          </Button>
        </ButtonGroup>
      </h1>
      <p>{__('report.establishment.total_month_state.description')}</p>
      <TotalByMonthStateHistoryPrettyChart chartType={chartType} />
    </>
  );
});

const TotalByMonthStateHistoryPrettyChart: React.FC<{ chartType: 'line' | 'bar' }> = observer(({ chartType }) => {
  const ctrl = useTotalByMonthStateHistoryStore();

  return chartType === 'bar' ? <Bar data={ctrl.chartData} /> : <Line data={ctrl.chartData} />;
});

export default TotalByMonthStateHistoryChartComp;
