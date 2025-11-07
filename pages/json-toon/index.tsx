import JsonToonComparator from "@/components/JsonToonComparator";
import { NextSeo } from "next-seo";

type Props = {};

const EditorPage: React.FC<Props> = () => {

  return (
    <>
      <NextSeo
        title='JSON vs TOON Comparator'
        description='JSON vs TOON Comparator'
      />

      <JsonToonComparator />
    </>
  )
}

export default EditorPage