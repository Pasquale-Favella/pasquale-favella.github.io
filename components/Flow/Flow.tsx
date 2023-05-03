import ReactFlow, {
  ConnectionLineType,
  MiniMap,
} from 'reactflow';
import CustomNode from './CustomNode';
import CustomControl from './CustomControls';
import WelcomeFlow from './WelcomeFlow';
import CustomEdge from './CustomEdge';
import useIsMobile from '@/hooks/use-isMobile';
import useFlow from '@/hooks/use-flow';

  
const nodeTypes = {
    custom: CustomNode,
};

const edgeTypes = {
  buttonedge: CustomEdge,
};

const defaultEdgeOptions = {
  animated: false,
  type: 'buttonedge',
};

const Flow = ()=> {

    const { nodes , edges , onConnect , onEdgesChange , onNodesChange } = useFlow();
    const isMobile = useIsMobile();

    return (
        <div className="h-[calc(85vh-70px)] bg-base-100">
          
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
            fitViewOptions={{
              includeHiddenNodes : true,
              nodes,
              maxZoom : 0.7
            }}
          >
            {!isMobile && <MiniMap nodeStrokeWidth={3} zoomable pannable position='top-right'/>}
            <CustomControl/>
            {nodes.length === 0 && <WelcomeFlow/>}
          </ReactFlow>
        </div>
    );
}

export default Flow