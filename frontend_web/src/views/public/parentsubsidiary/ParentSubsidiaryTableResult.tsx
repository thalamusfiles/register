import { observer } from 'mobx-react-lite';
import { Table } from 'react-bootstrap';
import { useI18N } from '../../../commons/i18';
import { usePersonPartnerStore } from './ctrl';
import classNames from 'classnames';

export const ParentSubsidiaryTableResult: React.FC = observer(() => {
  const ctrl = usePersonPartnerStore();
  const __ = useI18N();

  return (
    <Table className={classNames({ blur: ctrl.waiting })} striped responsive>
      <thead>
        <tr>
          <th>Matriz</th>
          <th>Filial Doc</th>
          <th>Filial</th>
          <th>Estado</th>
          <th>Cidade</th>
        </tr>
      </thead>
      <tbody>
        {ctrl.waiting === null && (
          <tr>
            <td colSpan={6}>{__('msg.enter_filter')}</td>
          </tr>
        )}
        {ctrl.waiting === false && !ctrl.response && (
          <tr>
            <td colSpan={6}>{__('msg.register_not_found')}</td>
          </tr>
        )}
        {ctrl.response &&
          ctrl.response.map((resp, idx) => (
            <tr key={idx}>
              <td>{resp.parentDoc}</td>
              <td>{resp.subsidiaryDoc}</td>
              <td>{resp.subsidiary}</td>
              <td>{resp.stateCode}</td>
              <td>{resp.cityName}</td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
});
