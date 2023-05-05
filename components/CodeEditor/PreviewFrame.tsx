import { memo, FC } from 'react';
import useEditor from '@/hooks/use-editor';

type PreviewFrameProps = {}
 
const PreviewFrame : FC<PreviewFrameProps> = ()=> {
    const { srcDoc } = useEditor();

    return (
        <div className="h-[calc(85vh-70px)]">
            <iframe
                srcDoc={srcDoc}
                title="output"
                sandbox="allow-scripts"
                frameBorder="0"
                width="100%"
                height="100%"
            />
      </div>
    );
}

export default memo(PreviewFrame);
