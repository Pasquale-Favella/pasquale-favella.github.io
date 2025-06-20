// hooks/useMailEditorState.ts
import { useAtom } from 'jotai';
import { mailEditorContentAtom } from '@/store/mailEditor.atom';
import { OutputData } from '@editorjs/editorjs';

export function useMailEditorState() {
  const [editorContent, setEditorContent] = useAtom(mailEditorContentAtom);

  // The currentMailEditorContentAtom in the store is a derived atom primarily for its write function.
  // Using the base mailEditorContentAtom with useAtom here provides both the value and a standard setter.
  // If specific logic from currentMailEditorContentAtom's write function was needed (beyond a simple set),
  // we might need to use that atom directly or replicate that logic.
  // For typical get/set, this is standard.

  return {
    editorContent,
    setEditorContent: (newContent: OutputData) => setEditorContent(newContent),
  };
}
