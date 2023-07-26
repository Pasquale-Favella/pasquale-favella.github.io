import { DiffCodeEditor } from "@/components/CodeEditor";
import { NextSeo } from "next-seo";

type Props = {};

const DiffEditorPage : React.FC<Props>  = ()=>{

  return (
    <>
      <NextSeo title='Diff Editor' description='Pasquale Favella , diff editor'/>
      <DiffCodeEditor />
    </>
  )
}

export default DiffEditorPage