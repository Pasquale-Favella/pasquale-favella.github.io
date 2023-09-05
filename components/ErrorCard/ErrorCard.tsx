import { FC } from "react";
import { BiErrorCircle } from "react-icons/bi";

type ErrorCardProps = {
    message : string;
}

const ErrorCard : FC<ErrorCardProps> = ({message}) => {
    return (
        <div className='flex w-full flex-1 items-center justify-start rounded-lg border border-error p-4 sm:px-6 mt-2'>
            <BiErrorCircle size={50} className='text-error'/> 
            <div className='px-4'>
                <p>{message}</p>
            </div>      
        </div>
    )
}

export default ErrorCard;