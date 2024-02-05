import { Handle, Position } from 'reactflow';
import { usePersonPartnerStore } from './ctrl';
import classNames from 'classnames';

const CompanyNode = ({ data }: any) => {
  const ctrl = usePersonPartnerStore();

  const classes = classNames({
    'm-0': true,
    'border-primary': data.type === 'parent',
    'border-info': data.type === 'subsidiary',
    'border-warning': data.type === 'partnerof',
  });
  let type = '';
  switch (data.type) {
    case 'parent':
      type = 'Matriz';
      break;
    case 'subsidiary':
      type = 'Filial';
      break;
    case 'partnerof':
      type = 'Sócia';
      break;
  }

  return (
    <div style={{ cursor: 'pointer', padding: 5 }} className="react-flow__node-default" onClick={() => ctrl.findNested(data.subsidiaryDoc)}>
      <span className="text-nowrap">
        {data.subsidiaryDoc} ({type})
      </span>
      <hr className={classes} />
      {data.subsidiary}
      <hr className={classes} />
      {data.cityName} - {data.stateCode}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default CompanyNode;
