import { FC, useRef, useState } from 'react';
import { VscClippy, VscScreenFull } from 'react-icons/vsc';
import MailElementEditor from '../MailElementEditor';
import { PiCursorClickLight } from 'react-icons/pi';

interface MailPreviewProps {
  content: string;
  screenSize: 'desktop' | 'tablet' | 'mobile';
}

const MailPreview: FC<MailPreviewProps> = ({ content, screenSize }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null); // Internal iframe ref
  const [isSelectionModeActive, setIsSelectionModeActive] = useState(false);

  const handleFullscreen = () => {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(content);
      newWindow.document.close();
    }
  };

  return (
    <div className={`flex justify-center ${screenSize === 'desktop' ? 'w-full' : screenSize === 'tablet' ? 'w-3/4' : 'w-1/2'} mx-auto`}>
      <div className="relative border rounded-lg min-h-48 w-full">
        <iframe
          title="Mail Preview"
          srcDoc={content}
          className="w-full h-full border-none"
          style={{ minHeight: '400px' }}
          ref={iframeRef}
        />
        <div className="absolute top-2 right-4 flex gap-1">
          <div
            className="tooltip"
            data-tip="Fullscreen Preview"
          >
            <button
              onClick={handleFullscreen}
              className="btn btn-square btn-sm"
            >
              <VscScreenFull size={24} />
            </button>
          </div>
          <div
            className="tooltip"
            data-tip="Copy HTML"
          >
            <button
              onClick={() => navigator.clipboard.writeText(content)}
              className="btn btn-square btn-sm"
            >
              <VscClippy size={24} />
            </button>
          </div>
          <div className="tooltip" data-tip="Select Element">
            <button
              className={`btn btn-square btn-sm ${isSelectionModeActive ? 'btn-active' : ''}`}
              onClick={() => setIsSelectionModeActive(!isSelectionModeActive)}
            >
              <PiCursorClickLight size={24} />
            </button>
          </div>
        </div>
      </div>
      <MailElementEditor
        isSelectionModeActive={isSelectionModeActive}
        iframeRef={iframeRef}
        onClose={() => setIsSelectionModeActive(false)}
      />
    </div>
  );
};

export default MailPreview;
