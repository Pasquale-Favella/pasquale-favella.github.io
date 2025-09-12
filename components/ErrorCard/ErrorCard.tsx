import { FC } from "react";
import { BiErrorCircle } from "react-icons/bi";
import { Button } from "../Button";

type ErrorCardProps = {
    message : string;
    retryConfig?: {
        onRetry: () => void; 
        retryDisabled: boolean
        retryMessage?: string
    }
}

const ErrorCard : FC<ErrorCardProps> = ({message, retryConfig}) => {
    return (
        <div className='flex w-full flex-1 items-center justify-start rounded-lg border border-error p-4 sm:px-6 mt-2'>
            <BiErrorCircle size={50} className='text-error'/> 
            <div className='px-4 flex-1 flex justify-between items-center'>
                <p>{message}</p>
                {retryConfig && (
                    <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={retryConfig.onRetry} 
                        disabled={retryConfig.retryDisabled}
                        className="mt-2 btn-error"
                    >
                        {retryConfig.retryMessage ?? "Retry"}
                    </Button>
                )}
            </div>      
        </div>
    )
}

export default ErrorCard;
