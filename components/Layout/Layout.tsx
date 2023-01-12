import KBar from "@/components/KBar"
import Navbar from "@/components/Navbar"
import { WithChildren } from "@/types"

const Layout = (props: WithChildren)=> {

    const { children } = props
  
    return (
        <KBar>
            <Navbar/>
            <main className='relative mx-auto mb-16 max-w-6xl px-8 py-24'>
                {children}
            </main>
        </KBar>
    )
}

export default Layout