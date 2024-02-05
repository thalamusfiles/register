import { Handle, Position } from 'reactflow';
import { usePersonPartnerStore } from './ctrl';

const CompanyNode = ({ data }: any) => {
  const ctrl = usePersonPartnerStore();

  return (
    <div style={{ cursor: 'pointer' }} className="react-flow__node-default" onClick={() => ctrl.findNested(data.subsidiaryDoc)}>
      {data.subsidiaryDoc}
      <hr className="m-0" />
      {data.subsidiary}
      <hr className="m-0" />
      {data.cityName} - {data.stateCode}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default CompanyNode;
