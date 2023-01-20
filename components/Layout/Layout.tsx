import KBar from "@/components/KBar"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { WithChildren } from "@/types"


const Layout = (props: WithChildren)=> {

    const { children } = props
  
    return (
        <KBar>
            <Navbar/>
            <main className='relative mx-auto max-w-6xl px-8 pt-24 pb-2'>
                {children}
            </main>
            <Footer/>
        </KBar>
    )
}

export default Layout