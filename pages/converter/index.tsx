import { NextSeo } from "next-seo";
import Converter from "@/components/Converter";

type Props = {};

const ConverterPage : React.FC<Props>  = ()=>{

  return (
    <>
      <NextSeo title='File converter' description='Free Unlimited File Converter'/>
      <main className="z-0 flex items-center justify-center max-w-screen-lg gap-4 p-4 text-center">

          <div className="prose md:prose-lg lg:prose-xl">

            <h2 className="text-3xl font-bold !mb-0">
                Free Unlimited File Converter
            </h2>

            <small className="text-base-content">Convert any file with Ease!</small>
            
            <p className="md:!mt-3">
            Set your creativity free with <b>Converter</b> – the ultimate online tool for limitless and complimentary multimedia conversion. Effortlessly revamp images, audio, and videos without any constraints. Start converting now and take your content to new heights!.
            </p>

            <Converter />
          </div>
        
      </main>
    </>
  )
}

export default ConverterPage