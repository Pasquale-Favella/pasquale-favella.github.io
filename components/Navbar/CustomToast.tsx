import dynamic from 'next/dynamic'
import { MdOutlineNotInterested, MdOutlineVerified } from 'react-icons/md';

const Toaster = dynamic(() => import("react-hot-toast").then((c) => c.Toaster), { ssr: false });

const CustomToast = ()=>{
    
    return(
        <Toaster 
            toastOptions={{
                className : '!bg-base-200 !prose',
                success : {
                    icon : <MdOutlineVerified className='size-10'/>,
                    className: '!bg-success text-base-content'
                },
                error : {
                   icon : <MdOutlineNotInterested className='size-10' />,
                   className: '!bg-error'
                }
            }}
        />
    )
}

export default CustomToast