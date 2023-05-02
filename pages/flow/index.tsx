

import { NextSeo } from "next-seo";
import Flow from '@/components/Flow';
import { ReactFlowProvider} from "reactflow";

type Props = {};

const FlowPage : React.FC<Props>  = ()=>{

  return (
    <>
      <NextSeo title='Idea Flow' description='Pasquale Favella , flow your idea'/>
      
      <ReactFlowProvider>
        <Flow />
      </ReactFlowProvider>
    </>
  )
}



export default FlowPage