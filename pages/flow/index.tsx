

import { NextSeo } from "next-seo";
import Flow from '@/components/Flow';
import { ReactFlowProvider} from "reactflow";

type Props = {};

const FlowPage : React.FC<Props>  = ()=>{

  return (
    <ReactFlowProvider>
      <NextSeo title='Idea Flow' description='Pasquale Favella , flow your idea'/>
      <Flow />
    </ReactFlowProvider>
  )
}



export default FlowPage