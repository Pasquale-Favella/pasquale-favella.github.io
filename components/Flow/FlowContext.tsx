import { WithChildren } from "@/types";
import { Utils } from "@/utils";
import { createContext ,useCallback, useContext } from "react";

import {
  Node,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  applyEdgeChanges, 
  applyNodeChanges,
  NodeChange,
  EdgeChange,
  useStoreApi,
  ReactFlowProvider,
  useReactFlow
} from 'reactflow';

type FlowProp = {
    nodes : Node[] ,
    edges : Edge[]
}

const FlowContext = createContext<FlowProp>({
    nodes : [],
    edges : []
});

const FlowProvider = (props : WithChildren & FlowProp)=> {

    const { nodes , edges } = props;

    return (
        <ReactFlowProvider>
            <FlowContext.Provider value={{ nodes , edges }}>
                {props.children}
            </FlowContext.Provider>
        </ReactFlowProvider>
    )
}

function useFlow() {
    const flowContext = useContext(FlowContext);
    const [nodes, setNodes] = useNodesState(flowContext.nodes);
    const [edges, setEdges] = useEdgesState(flowContext.edges);
    const { addNodes , deleteElements , getViewport , project} = useReactFlow();

    const store = useStoreApi();

    const onConnect = useCallback(
      (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
      [setEdges]
    );
  
    const onNodesChange = useCallback( (changes: NodeChange[]) => {
        setNodes((nds) => applyNodeChanges(changes, nds))
    },[] );

    const onEdgesChange = useCallback( (changes: EdgeChange[]) => {
        setEdges((eds) => applyEdgeChanges(changes, eds))
    },[] );


    const addNewNode = () => {
        const viewPort = getViewport();

        addNodes({
            id: Utils.uid(),
            data: { 
                title : '',
                body : ''
            },
            position: { x: viewPort.x, y:viewPort.y },
            type: 'custom',
            className: '',
            dragHandle: '.custom-drag-handle'
        })
    }

    const deleteNodeById = ( id : string )=> {
        deleteElements({
            nodes : store.getState().getNodes().filter(n=> n.id === id)
        })
    }

    const deleteEdgeById = ( id : string )=> {
        deleteElements({
            edges : store.getState().edges.filter(edge=> edge.id === id)
        })
    }
      

    return {
        nodes ,
        edges ,
        onConnect ,
        onNodesChange ,
        onEdgesChange ,
        addNewNode ,
        deleteNodeById ,
        deleteEdgeById
    }
}

export {FlowProvider , useFlow};