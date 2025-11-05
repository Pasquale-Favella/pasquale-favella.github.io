import { memo } from "react";
import useEditor from "@/hooks/use-editor";
import useIsMobile from "@/hooks/use-isMobile";
import { useTheme } from "@/hooks/use-theme";
import { Editor } from "@monaco-editor/react";
import CodeEditorLoader from "./CodeEditorLoader";

const CodeEditorView = () => {

  const { isDarkMode } = useTheme();
  const { code, setCode } = useEditor();
   const isMobile = useIsMobile();

  return (
    <div className="h-full flex flex-col bg-base-100">
      {/* Monaco Editor - Full Height */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={code.language}
          value={code.value}
          loading={<CodeEditorLoader />}
          onChange={(value) => setCode(value || '')}
          theme={isDarkMode ? 'vs-dark' : 'vs-light'}
          options={{
            minimap: { enabled: !isMobile },
            lineNumbers: isMobile ? 'off' : 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
};

export default memo(CodeEditorView);