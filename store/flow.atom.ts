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
    get => get(nodesAtom).find(node => node.id === id),
    (get , set , newNodeData : Partial<CustomNodeData>)=> {
        
        const nodesUpdated = get(nodesAtom).map(
            node=> Object.assign(node, node.id === id && {data : {...node.data , ...newNodeData}}) satisfies Node<CustomNodeData>
        );

        set(nodesAtom , nodesUpdated);
    }
);

