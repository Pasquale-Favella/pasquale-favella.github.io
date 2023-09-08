import CodeEditor from "@/components/CodeEditor/CodeEditor";
import { NextSeo } from "next-seo";

type Props = {};

const EditorPage : React.FC<Props>  = ()=>{

  return (
    <>
      <NextSeo 
        title='Editor' 
        description='Create, edit, and preview your web projects in real-time with our HTML, CSS, and JS editor. Write and test HTML, CSS, and JavaScript code effortlessly. Visualize your changes instantly.'
      />

      <CodeEditor />
    </>
  )
}

export default EditorPage