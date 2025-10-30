import DeSign from "@/components/DeSign";
import { PGliteDeSignProvider } from "@/providers/de-sign-pglite.provider";
import { NextSeo } from "next-seo";

type Props = {};

const EditorPage: React.FC<Props> = () => {

  return (
    <>
      <NextSeo
        title='De-sign'
        description='de-sign is an AI design tool integrating multiple providers to generate and refine UI layouts in a real-time canvas.'
      />

      <PGliteDeSignProvider>
        <DeSign />
      </PGliteDeSignProvider>
    </>
  )
}

export default EditorPage