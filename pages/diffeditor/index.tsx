import { DiffCodeEditor } from "@/components/CodeEditor";
import { NextSeo } from "next-seo";

type Props = {};

const DiffEditorPage : React.FC<Props>  = ()=>{

  return (
    <>
      <NextSeo 
        title='Diff Editor' 
        description='Explore the changes between two versions of any code or text effortlessly with Diff Editor. Visualize code differences and spot changes'
      />

      <DiffCodeEditor />
    </>
  )
}

export default DiffEditorPage