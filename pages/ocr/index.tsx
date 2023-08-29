import { NextSeo } from "next-seo";
import Ocr from "@/components/Ocr";

type Props = {};

const OcrPage : React.FC<Props>  = ()=>{

  return (
    <>
      <NextSeo title='OCR' description='Pasquale Favella , image to text'/>
      <Ocr />
    </>
  )
}

export default OcrPage