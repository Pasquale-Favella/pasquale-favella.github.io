import { currentEditingAtom, editorStateAtom, previewEditorAtom, selectedEditorAtom, sidebarCollapsedAtom, srcDocFrameAtom } from "@/store/editor.atom";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

export default function useEditor() {
    const [tabSelected, setTabSelected] = useAtom(selectedEditorAtom);
    const [isPreview, setIsPreview] = useAtom(previewEditorAtom);
    const [isCollapsed, setIsCollapsed] = useAtom(sidebarCollapsedAtom);
    const editorState = useAtomValue(editorStateAtom);
    const code = useAtomValue(currentEditingAtom);
    const setCode = useSetAtom(currentEditingAtom);
    const srcDoc = useAtomValue(srcDocFrameAtom);

    return {
        tabSelected,
        setTabSelected,
        isPreview,
        setIsPreview,
        isCollapsed,
        setIsCollapsed,
        editorState,
        code,
        setCode,
        srcDoc
    }
}