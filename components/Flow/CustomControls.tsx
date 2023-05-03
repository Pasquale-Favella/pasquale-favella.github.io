import { FC } from 'react';
import useIsMobile from '@/hooks/use-isMobile';
import useFlow from '@/hooks/use-flow';
import { toPng } from 'html-to-image';
import  {
    Controls,
    ControlButton,
} from 'reactflow';
import { HiOutlineViewGridAdd } from 'react-icons/hi';
import { BsCardImage } from 'react-icons/bs';
import { GrPowerReset } from 'react-icons/gr';


type CustomControlProps = {}

const CustomControl : FC<CustomControlProps> = () => {

    const isMobile = useIsMobile();

    return (
        <Controls 
            className=''
            position={isMobile ? 'bottom-left' : 'top-left'} 
        >
            {!isMobile && <DownloadButton />}
            {!isMobile && <ResetButton />}
            <AddButton/>

        </Controls>
    );
}

export default CustomControl;

const AddButton : FC = ()=> {

    const { addNewNode } = useFlow();
    const handleAdd = ()=> addNewNode();
  
    return (
        <ControlButton onClick={handleAdd} title="add flow">
            <HiOutlineViewGridAdd />
        </ControlButton>
    );
}
  
const DownloadButton : FC = ()=> {
    const onClick = () => toPng(document.querySelector('.react-flow') as HTMLElement, {
        filter: (node) => {
 
          if (
            node?.classList?.contains('react-flow__minimap') ||
            node?.classList?.contains('react-flow__controls')
          ) {
            return false;
          }
  
          return true;
        },
      }).then(downloadImage);
  
    return (
        <ControlButton onClick={onClick} title="screen idea">
            <BsCardImage />
        </ControlButton>
    );
}

function downloadImage(dataUrl : string) {
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('download', 'IdeaFlow.png');
    downloadAnchor.setAttribute('href', dataUrl);
    downloadAnchor.click();
}

const ResetButton : FC = ()=> {

    const { resetFlow } = useFlow();
    const handleReset = ()=> resetFlow();
  
    return (
        <ControlButton onClick={handleReset} title="reset flow">
            <GrPowerReset />
        </ControlButton>
    );
}