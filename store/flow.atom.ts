import { atom } from "jotai";
import { atomWithStorage } from 'jotai/utils'
import { focusAtom } from 'jotai-optics'
import {
    Node,
    Edge,
} from 'reactflow';

export type CustomNodeData = {
    title : string,
    body : string
}

type FlowState = {
    nodes : Node<CustomNodeData>[] ,
    edges : Edge[]
}

export const flowStateAtom = atomWithStorage<FlowState>(
    'flow',
    {
        edges : [],
        nodes : []
    }
);

export const nodesAtom = focusAtom(flowStateAtom, (optic) => optic.prop('nodes'));
export const edgesAtom = focusAtom(flowStateAtom, (optic) => optic.prop('edges'));

export const getNodeAtomById = (id : string)=> atom(
    get =>{
        const nodes = get(nodesAtom);
        return nodes.find(node=>node.id === id);
    },
    (get , set, newNodeData : Partial<CustomNodeData>)=>{
        const nodes = get(nodesAtom);
        
        const nodesUpdated = nodes.map(node=>{
            if(node.id === id){
                node.data = {...node.data , ...newNodeData};
            }
            return node;
        });

        set(nodesAtom , nodesUpdated);
    }
);

