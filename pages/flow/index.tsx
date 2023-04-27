

import { NextSeo } from "next-seo";
import Flow from '@/components/Flow';
import { FlowProvider } from "@/components/Flow/FlowContext";
import { Edge , Node} from "reactflow";


const initialNodes: Node[] = [];

const initialEdges: Edge[] = [];

type Props = {};

const FlowPage : React.FC<Props>  = ()=>{

  return (
    <>
      <NextSeo title='Idea Flow' description='Pasquale Favella , flow your idea'/>
      
      <FlowProvider edges={initialEdges} nodes={initialNodes}>
        <Flow />
      </FlowProvider>
    </>
  )
}



export default FlowPage