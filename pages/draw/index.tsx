import { NextSeo } from "next-seo";
import CanvasDrawer from "@/components/CanvasDrawer";

type Props = {};

const DrawerPage : React.FC<Props>  = ()=>{

  return (
    <>
      <NextSeo 
        title='Drawer' 
        description='Unleash your creativity with our drawing tool! Draw anything you can imagine, from simple sketches to intricate masterpieces.'
      />

      <CanvasDrawer />
    </>
  )
}

export default DrawerPage