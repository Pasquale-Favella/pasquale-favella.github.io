import CompositeStackMaterialCalculator from "@/components/CompositeStackMaterialCalculator";
import { NextSeo } from "next-seo";

type Props = {};

const CompositeStackMaterialPage : React.FC<Props>  = ()=>{

  return (
    <>
      <NextSeo 
        title='Laminator Calculator' 
        description='Calculate composite stack material properties and perform failure analysis with our interactive calculator. Determine safety and understand material behavior under stress.'
      />

      <CompositeStackMaterialCalculator />
    </>
  )
}

export default CompositeStackMaterialPage