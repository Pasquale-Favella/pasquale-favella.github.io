import { FC } from 'react';
import { VscClippy, VscScreenFull } from 'react-icons/vsc';

interface MailPreviewProps {
  content: string;
  screenSize: 'desktop' | 'tablet' | 'mobile';
}

const MailPreview: FC<MailPreviewProps> = ({ content, screenSize }) => {
  const handleFullscreen = () => {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(content);
      newWindow.document.close();
    }
  };

  return (
    <div className={`flex justify-center ${screenSize === 'desktop' ? 'w-full' : screenSize === 'tablet' ? 'w-3/4' : 'w-1/2'} mx-auto`}>
      <div className="relative border p-4 rounded-lg min-h-48 w-full">
        <iframe
          title="Mail Preview"
          srcDoc={content}
          className="w-full h-full border-none"
          style={{ minHeight: '400px' }}
        />
        <div className="absolute top-2 right-2 flex gap-1">
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
        </div>
      </div>
    </div>
  );
};

export default MailPreview;
