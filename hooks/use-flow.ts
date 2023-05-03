import { useCallback, useMemo } from "react";
import { flowStateAtom, getNodeAtomById } from "@/store/flow.atom";
import { Utils } from "@/utils";
import { useAtom } from "jotai";
import {
  Node,
  addEdge,
  Connection,
  Edge,
  applyEdgeChanges, 
  applyNodeChanges,
  NodeChange,
  EdgeChange,
  useReactFlow,
  useStoreApi
} from 'reactflow';


export default function useFlow() {

    const [{ nodes  , edges  } , syncFlowContext] = useAtom(flowStateAtom);
  
    const { getViewport , setCenter } = useReactFlow();

    const store = useStoreApi();

    const onConnect = useCallback(
      (params: Connection | Edge) => syncFlowContext(prev =>({...prev , edges : addEdge(params, prev.edges)})),
      [syncFlowContext]
    );
  
    const onNodesChange = useCallback( (changes: NodeChange[]) => {
        syncFlowContext(prev =>({...prev , nodes : applyNodeChanges(changes, prev.nodes)}))
    }, []);

    const onEdgesChange = useCallback( (changes: EdgeChange[]) => {
        syncFlowContext(prev =>({...prev , edges : applyEdgeChanges(changes, prev.edges)}))
    }, []);


    const addNewNode = () => {

        const { x , y } = getViewport();

        const newNode : Node = {
            id: Utils.uid(),
            data: { 
                title : '',
                body : ''
            },
            position: { x , y },
            type: 'custom',
            className: '',
            dragHandle: '.custom-drag-handle'
        }

        syncFlowContext(prev => ({...prev , nodes : [...prev.nodes , newNode]}));

        focusOnNode(newNode);
    }

    const deleteNodeById = (id : string)=> syncFlowContext(prev => ({...prev , nodes : prev.nodes.filter(node=>node.id !== id)}));

    const deleteEdgeById = (id : string)=> syncFlowContext(prev => ({...prev , edges : prev.edges.filter(edge=>edge.id !== id)}));

    const resetFlow = ()=> syncFlowContext({nodes : [] , edges : []});

    const getNodeIdAtom = (id : string) => useMemo(()=> getNodeAtomById(id) , [id]);

    const focusOnNode = ({position} : Node)=> {
        const node = store.getState().getNodes().at(0);

        const nodeDimensions = {
            width : new Number(node?.width).valueOf() ,
            height : new Number(node?.height).valueOf() ,
        }
        
        setCenter(
            position.x + nodeDimensions.width / 2 , 
            position.y + nodeDimensions.height / 2 , 
            { zoom : 0.7 , duration: 300 }
        );
    }
      
    return {
        nodes ,
        edges ,
        onConnect ,
        onNodesChange ,
        onEdgesChange ,
        addNewNode ,
        deleteNodeById ,
        deleteEdgeById ,
        resetFlow ,
        getNodeIdAtom
    }
}