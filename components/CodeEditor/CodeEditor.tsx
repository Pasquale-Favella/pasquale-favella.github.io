import Editor from '@monaco-editor/react';
import { useTheme } from '@/hooks/use-theme';
import useEditor from '@/hooks/use-editor';
import useIsMobile from '@/hooks/use-isMobile';
import EditorTabs from './EditorTabs';
import PreviewFrame from './PreviewFrame';

const CodeEditor = () => {

  const { isDarkMode } = useTheme();
  const isMobile = useIsMobile();
  const { code, setCode, preview } = useEditor()

  const handleChange = (codeValue: string | undefined) => {
    setCode(codeValue ?? '');
  }

  return (
    <>
      <EditorTabs />

      {preview
        ? <PreviewFrame />
        : <Editor
          className='h-[calc(85vh-70px)]'
          theme={isDarkMode ? 'vs-dark' : 'light'}
          path={code.name}
          language={code.language}
          value={code.value}
          onChange={codeValue => handleChange(codeValue)}
          options={
            {
              minimap: { enabled: !isMobile }
            }
          }
        />
      }
    </>
  );
}

export default CodeEditor