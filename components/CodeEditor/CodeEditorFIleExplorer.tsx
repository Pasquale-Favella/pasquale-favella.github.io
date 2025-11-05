import { memo } from "react";
import useEditor from "@/hooks/use-editor";
import { CodeState, EditorStateKey } from "@/store/editor.atom";
import { AiFillHtml5 } from "react-icons/ai";
import { DiCss3 } from "react-icons/di";
import { SiJavascript } from "react-icons/si";
import { VscFiles } from "react-icons/vsc";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const CodeEditorFileExplorer = () => {
   const { tabSelected, setTabSelected, isPreview, setIsPreview, isCollapsed, setIsCollapsed, editorState } = useEditor();

  const files: Array<{ key: EditorStateKey; icon: any; color: string; data: CodeState }> = [
    { key: 'html', icon: AiFillHtml5, color: 'text-orange-500', data: editorState.html },
    { key: 'css', icon: DiCss3, color: 'text-blue-500', data: editorState.css },
    { key: 'js', icon: SiJavascript, color: 'text-yellow-500', data: editorState.js }
  ];

  const handleSelectFile = (key: EditorStateKey) => {
    setTabSelected(key);
    setIsPreview(false);
  };

  return (
    <div className={`bg-base-200 border-r border-base-300 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-56'}`}>
      {/* Collapse Toggle Button */}
      <div className="flex items-center justify-between p-2 border-b border-base-300">
        {!isCollapsed && (
          <div className="flex items-center gap-2 text-xs font-semibold text-base-content px-2">
            <VscFiles className="text-base" />
            <span>Files</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="btn btn-ghost btn-xs btn-square"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <HiChevronRight className="text-base" /> : <HiChevronLeft className="text-base" />}
        </button>
      </div>

      {/* File List */}
      <div className="flex-1 p-2 overflow-y-auto">
        <div className="space-y-1">
          {files.map(({ key, icon: Icon, color, data }) => (
            <button
              key={key}
              onClick={() => handleSelectFile(key)}
              className={`
                w-full flex items-center gap-2 px-2 py-2 rounded text-sm
                transition-all duration-200
                ${tabSelected === key && !isPreview
                  ? 'bg-primary text-primary-content'
                  : 'hover:bg-base-300 text-base-content'
                }
              `}
              title={isCollapsed ? data.name : ''}
            >
              <Icon className={`text-lg flex-shrink-0 ${tabSelected === key && !isPreview ? 'text-primary-content' : color}`} />
              {!isCollapsed && (
                <span className="flex-1 text-left font-mono text-xs truncate">{data.name}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(CodeEditorFileExplorer);