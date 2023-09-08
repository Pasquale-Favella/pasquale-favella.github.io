import { NextSeo } from "next-seo";
import Ocr from "@/components/Ocr";

type Props = {};

const OcrPage : React.FC<Props>  = ()=>{

  return (
    <>
      <NextSeo title='OCR' description='Convert image to text'/>
      <main className="hero">
        <div className="hero-content text-center">
          <div className="prose md:prose-lg lg:prose-xl">

            <h2 className="text-3xl font-bold !mb-0">
              Unlock the Power of OCR 
            </h2>

            <small className="text-accent-content">Transform Text from Image or Url with Ease!</small>
            
            <p className="md:!mt-3">
              To utilize the potential of the OCR Converter, simply upload an image or enter a URL, and watch as it seamlessly converts text with just <b>one click</b>.
            </p>

            <Ocr />
          </div>
        </div>
      </main>
    </>
  )
}

export default OcrPage