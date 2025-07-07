import { FC, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import CodeEditorLoader from '@/components/CodeEditor/CodeEditorLoader';
import { useTheme } from '@/hooks/use-theme';

interface MailCodeEditorProps {
  content: string;
  onUpdate: (code: string) => void;
}

const MailCodeEditor: FC<MailCodeEditorProps> = ({ content, onUpdate }) => {
  const { isDarkMode } = useTheme();

  const handleCodeEditorChange = useCallback(
    (codeValue: string | undefined) => {
      onUpdate(codeValue ?? '');
    },
    [onUpdate]
  );

  return (
    <div className="h-[500px] overflow-auto border rounded-lg">
      <Editor
        theme={isDarkMode ? 'vs-dark' : 'light'}
        language='html'
        value={content}
        onChange={handleCodeEditorChange}
        loading={<CodeEditorLoader />}
        options={{
          minimap: { enabled: false }
        }}
      />
    </div>
  );
};

export default MailCodeEditor;
