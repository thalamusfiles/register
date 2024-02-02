import { observer } from 'mobx-react-lite';
import { usePersonPartnerStore } from './ctrl';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';

import 'reactflow/dist/style.css';

export const ParentSubsidiaryFlowResult: React.FC = observer(() => {
  const ctrl = usePersonPartnerStore();

  return (
    <div style={{ height: '500px' }}>
      <ReactFlow nodes={ctrl.nodes} edges={ctrl.edges}>
        <Background />
        <Controls />
        <MiniMap zoomable pannable />
      </ReactFlow>
    </div>
  );
});
