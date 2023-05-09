import dynamic from 'next/dynamic'
import { MdOutlineNotInterested } from 'react-icons/md';

const Toaster = dynamic(() => import("react-hot-toast").then((c) => c.Toaster), { ssr: false });

const CustomToast = ()=>{
    
    return(
        <Toaster 
            toastOptions={{
                className : '!bg-base-200 !prose',
                error : {
                   icon : <MdOutlineNotInterested className='text-error' size={20}/>
                }
            }}
        />
    )
}

export default CustomToast