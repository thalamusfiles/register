import { observer } from 'mobx-react-lite';
import { usePersonPartnerStore } from './ctrl';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';

import 'reactflow/dist/style.css';
import CompanyNode from './CompanyNode';

const nodeTypes = { company: CompanyNode };

export const ParentSubsidiaryFlowResult: React.FC = observer(() => {
  const ctrl = usePersonPartnerStore();

  return (
    <div style={{ height: '640px' }}>
      <ReactFlow nodes={ctrl.nodes} edges={ctrl.edges} nodeTypes={nodeTypes}>
        <Background />
        <Controls />
        <MiniMap zoomable pannable />
      </ReactFlow>
    </div>
  );
});
