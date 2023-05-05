import CodeEditor from "@/components/CodeEditor/CodeEditor";
import { NextSeo } from "next-seo";

type Props = {};

const EditorPage : React.FC<Props>  = ()=>{

  return (
    <>
      <NextSeo title='Editor' description='Pasquale Favella , code editor'/>
      <CodeEditor />
    </>
  )
}

export default EditorPage