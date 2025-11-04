import { memo } from "react";
import { FiCode } from "react-icons/fi";
import { VscPreview } from "react-icons/vsc";
import useEditor from "@/hooks/use-editor";

const CodeEditorTopBar = memo(() => {
  const { isPreview, setIsPreview, code } = useEditor();

  return (
    <div className="navbar bg-base-200 border-b border-base-300 min-h-0 h-12 px-4">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <FiCode className="text-lg" />
          <span className="font-bold text-sm">Code Editor</span>
          {!isPreview && (
            <div className="ml-4 text-xs text-base-content/70">
              <span className="font-mono">{code.name}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-none gap-2">
        
        <button
          className={`btn btn-sm gap-2 ${isPreview ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setIsPreview(!isPreview)}
        >
          <VscPreview />
          {isPreview ? 'Code' : 'Preview'}
        </button>
      </div>
    </div>
  );
});

export default CodeEditorTopBar;