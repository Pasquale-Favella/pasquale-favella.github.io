import { memo, FC } from 'react';
import useEditor from '@/hooks/use-editor';

type PreviewFrameProps = {}

const PreviewFrame: FC<PreviewFrameProps> = () => {
    const { srcDoc } = useEditor();

    return (
        <div className="mockup-browser border border-base-300">
            <div className="mockup-browser-toolbar">
                <div className="input border border-base-300">{window.location.origin}</div>
            </div>
            <div className="h-[calc(85vh-100px)]">
                <iframe
                    srcDoc={srcDoc}
                    title="output"
                    sandbox="allow-scripts"
                    frameBorder="0"
                    width="100%"
                    height="100%"
                />
            </div>
        </div>
    );
}

export default memo(PreviewFrame);
