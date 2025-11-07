import JsonToonComparator from "@/components/JsonToonComparator";
import { NextSeo } from "next-seo";

type Props = {};

const EditorPage: React.FC<Props> = () => {

  return (
    <>
      <NextSeo
        title='JSON vs TOON Comparator'
        description='JSON vs TOON Comparator, a lightweight tool to compare JSON efficiency in AI prompts. Discover which format minimizes tokens, reduces cost, and improves LLM performance.'
      />

      <JsonToonComparator />
    </>
  )
}

export default EditorPage