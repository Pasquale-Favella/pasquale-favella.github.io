import { IconType } from "react-icons/lib"

type Props = {
    Icon : IconType
    body : string
}

const ContentNotFound : React.FC<Props>  = ({body , Icon})=>{
    return (
        <div className='flex justify-center items-center'>
            <span className='group my-8 flex items-center gap-2 text-lg font-medium'>
                <Icon size={25} className='transition duration-200 group-hover:scale-125' />
                <span>{body}</span>
            </span>
        </div>
    )
}

export default ContentNotFound