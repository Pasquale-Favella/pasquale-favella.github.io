import {  flowStateAtom } from "@/store/flow.atom";
import { Utils } from "@/utils";
import { useAtom } from "jotai";
import { useCallback } from "react";

import {
  Node,
  addEdge,
  Connection,
  Edge,
  applyEdgeChanges, 
  applyNodeChanges,
  NodeChange,
  EdgeChange,
  useReactFlow
} from 'reactflow';


export default function useFlow() {

    const [{ nodes  , edges  } , syncFlowContext] = useAtom(flowStateAtom);
  
    const { fitView } = useReactFlow();

    const onConnect = useCallback(
      (params: Connection | Edge) => syncFlowContext(prev =>({...prev , edges : addEdge(params, prev.edges)})),
      [syncFlowContext]
    );
  
    const onNodesChange = useCallback( (changes: NodeChange[]) => {
        syncFlowContext(prev =>({...prev , nodes : applyNodeChanges(changes, prev.nodes)}))
    },[] );

    const onEdgesChange = useCallback( (changes: EdgeChange[]) => {
        syncFlowContext(prev =>({...prev , edges : applyEdgeChanges(changes, prev.edges)}))
    },[] );


    const addNewNode = () => {
        
        const newNode : Node = {
            id: Utils.uid(),
            data: { 
                title : '',
                body : ''
            },
            position: { x: 0, y: 0 },
            type: 'custom',
            className: '',
            dragHandle: '.custom-drag-handle'
        }

        syncFlowContext(prev => ({...prev , nodes : [...prev.nodes , newNode]}));

        fitView({
            nodes,
            duration : 200 ,
            maxZoom : 0.5
        })
    }


    const deleteNodeById = ( id : string )=> syncFlowContext(prev => ({...prev , nodes : prev.nodes.filter(node=>node.id !== id)}));

    const deleteEdgeById = ( id : string )=> syncFlowContext(prev => ({...prev , edges : prev.edges.filter(edge=>edge.id !== id)}));
      

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