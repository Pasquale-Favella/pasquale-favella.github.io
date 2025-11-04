import React from 'react';
import useEditor from '@/hooks/use-editor';
import PreviewFrame from './PreviewFrame';
import CodeEditorTopBar from './CodeEditorTopBar';
import CodeEditorFileExplorer from './CodeEditorFIleExplorer';
import CodeEditorView from './CodeEditorView';


const CodeEditor = () => {
  const {isPreview} = useEditor();

  return (
    <div className="h-[calc(90dvh)] flex flex-col bg-base-100">
      <CodeEditorTopBar />
      
      <div className="flex-1 flex overflow-hidden">
        {!isPreview && <CodeEditorFileExplorer />}
        
        <div className="flex-1 overflow-hidden border-base-300 border">
          {isPreview ? <PreviewFrame /> : <CodeEditorView />}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;