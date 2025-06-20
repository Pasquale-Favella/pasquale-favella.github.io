import React, { useEffect, useState } from 'react';
import { OutputData } from '@editorjs/editorjs';
import editorjsHTML from 'editorjs-html';
import DOMPurify from 'dompurify';

interface LivePreviewProps {
  editorData: OutputData;
}

const LivePreview: React.FC<LivePreviewProps> = ({ editorData }) => {
  const [sanitizedHtml, setSanitizedHtml] = useState('');

  useEffect(() => {
    if (editorData && editorData.blocks && editorData.blocks.length > 0) {
      const edjsParser = editorjsHTML();
      // Type assertion because parse expects an array of BlockToolData,
      // and editorData (OutputData) contains 'blocks' which is an array of BlockToolData.
      // editorjs-html types might not be perfectly aligned with @editorjs/editorjs types.
      const htmlArray = edjsParser.parse(editorData as any) as string[];
      const rawHtml = htmlArray.join('');
      setSanitizedHtml(DOMPurify.sanitize(rawHtml));
    } else {
      setSanitizedHtml(''); // Clear preview if there's no content
    }
  }, [editorData]);

  return (
    <div className="prose max-w-none"> {/* Using Tailwind Prose for basic styling */}
      <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
    </div>
  );
};

export default LivePreview;
