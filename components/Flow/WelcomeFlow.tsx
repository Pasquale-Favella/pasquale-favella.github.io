import { FC } from 'react';
import { HiOutlineViewGridAdd } from 'react-icons/hi';


type WelcomeFlowProps = {}

const WelcomeFlow : FC<WelcomeFlowProps> = () => {

    return (
        <div className='h-full flex justify-center items-center z-50'>

            <div className="card max-w-max bg-base-300 shadow-xl mx-5">
                <div className="card-body">
                    <h2 className="card-title">Flow your ideas <HiOutlineViewGridAdd /></h2>
                    <p>Use the controlbar to start your flow</p>
                </div>
            </div>
        </div>
    );
}

export default WelcomeFlow;

