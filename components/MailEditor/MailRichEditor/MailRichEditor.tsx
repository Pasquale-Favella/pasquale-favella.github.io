import { FC, useCallback } from 'react';
import TipTapEditor from '@/components/TipTapEditor';

interface MailRichEditorProps {
  content: string;
  onUpdate: (html: string) => void;
}

const MailRichEditor: FC<MailRichEditorProps> = ({ content, onUpdate }) => {
  const handleRichEditorChange = useCallback(
    (html: string) => {
      onUpdate(html);
    },
    [onUpdate]
  );

  return (
    <TipTapEditor content={content} onUpdate={handleRichEditorChange} />
  );
};

export default MailRichEditor;
