import { FC } from 'react';
import useIsMobile from '@/hooks/use-isMobile';

import  {
    Controls,
    ControlButton,
} from 'reactflow';
import { HiOutlineViewGridAdd } from 'react-icons/hi';
import { useFlow } from './FlowContext';


type CustomControlProps = {}

const CustomControl : FC<CustomControlProps> = () => {

    const { addNewNode } = useFlow();

    const isMobile = useIsMobile();

    const handleAdd = ()=> addNewNode();

    return (
        <Controls 
            className=''
            position={isMobile ? 'bottom-left' : 'top-left'} 
        >
            <ControlButton onClick={handleAdd} title="add flow">
                <HiOutlineViewGridAdd />
            </ControlButton>
        </Controls>
    );
}

export default CustomControl;