import ReactFlow, {
  ConnectionLineType,
  MiniMap
} from 'reactflow';

import CustomNode from './CustomNode';

import useIsMobile from '@/hooks/use-isMobile';
import CustomControl from './CustomControls';
import { useFlow } from './FlowContext';
import WelcomeFlow from './WelcomeFlow';
import CustomEdge from './CustomEdge';

  
const nodeTypes = {
    custom: CustomNode,
};

const edgeTypes = {
  buttonedge: CustomEdge,
};

const defaultEdgeOptions = {
  animated: true,
  type: 'buttonedge',
};

const Flow = ()=> {

    const { nodes , edges , onConnect , onEdgesChange , onNodesChange } = useFlow();

    const isMobile = useIsMobile();

    return (
        <div className="h-[calc(85vh-70px)]">
          
          <ReactFlow
            nodes={nodes}
            onNodesChange={onNodesChange}
            edges={edges}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            defaultEdgeOptions={defaultEdgeOptions}
            connectionLineType={ConnectionLineType.SmoothStep}
            fitView
          >
            {!isMobile && <MiniMap nodeStrokeWidth={3} zoomable pannable position='top-right'/>}
            <CustomControl/>
            {nodes.length === 0 && <WelcomeFlow/>}
          </ReactFlow>
        </div>
    );
}

export default Flow