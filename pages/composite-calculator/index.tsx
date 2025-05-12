import CompositeCalculator from "@/components/CompositeCalculator";
import { NextSeo } from "next-seo";

type Props = {};

const CompositeCalculatorPage : React.FC<Props>  = ()=>{

  return (
    <>
      <NextSeo 
        title='Tzai-Hill Composite Calculator' 
        description='Calculate composite material properties and perform Tsai-Hill failure analysis with our interactive calculator. Determine safety and understand material behavior under stress.'
      />

      <CompositeCalculator />
    </>
  )
}

export default CompositeCalculatorPage