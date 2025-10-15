import DeSign from "@/components/DeSign";
import { NextSeo } from "next-seo";

type Props = {};

const EditorPage : React.FC<Props>  = ()=>{

  return (
    <>
      <NextSeo 
        title='De-sign' 
        description='TODO: ....'
      />

      <DeSign />
    </>
  )
}

export default EditorPage