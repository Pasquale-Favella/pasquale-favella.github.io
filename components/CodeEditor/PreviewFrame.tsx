import { memo } from 'react';
import useEditor from '@/hooks/use-editor';

const PreviewFrame = () => {
    const { srcDoc } = useEditor();

  return (
    <div className="h-full bg-base-100 overflow-auto">
      <div className="mockup-browser border-base-300 border rounded-none h-full">
        <div className="mockup-browser-toolbar">
          <div className="input border-base-300 border">
            {window.location.origin}
          </div>
        </div>
        <div className="border-base-300 border-t bg-white h-[calc(100%-3rem)]">
          <iframe
            srcDoc={srcDoc}
            title="output"
            sandbox="allow-scripts"
            frameBorder="0"
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default memo(PreviewFrame);
