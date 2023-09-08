

import { NextSeo } from "next-seo";
import Flow from '@/components/Flow';
import { ReactFlowProvider} from "reactflow";

type Props = {};

const FlowPage : React.FC<Props>  = ()=>{

  return (
    <ReactFlowProvider>
      <NextSeo 
        title='Idea Flow' 
        description='Transform your ideas into visual masterpieces with Idea Flow. Easily create, edit, and organize your concepts using intuitive flow charts. Streamline your brainstorming process, plan projects, and communicate ideas effectively. Unlock the power of visual thinking with our Idea Flow platform. Start charting your creativity today.'
      />
      
      <Flow />
    </ReactFlowProvider>
  )
}



export default FlowPage