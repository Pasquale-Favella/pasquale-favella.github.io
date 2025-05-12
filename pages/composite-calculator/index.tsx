import CompositeCalculator from "@/components/CompositeCalculator";
import { NextSeo } from "next-seo";

type Props = {};

const CompositeCalculatorPage : React.FC<Props>  = ()=>{

  return (
    <>
      <NextSeo 
        title='Composite Calculator' 
        description='Compose multiple functions and visualize the result with our Composite Calculator. Simplify complex calculations effortlessly.'
      />

      <CompositeCalculator />
    </>
  )
}

export default CompositeCalculatorPage