import { currentEditingAtom, editorStateAtom, previewEditorAtom, selectedEditorAtom, srcDocFrameAtom } from "@/store/editor.atom";
import { useAtom, useAtomValue } from "jotai";

export default function useEditor() {

    const [tabSelected , setTabSelected] = useAtom(selectedEditorAtom);
    const [preview , setPreview] = useAtom(previewEditorAtom);
    const [code , setCode] = useAtom(currentEditingAtom);
    const srcDoc = useAtomValue(srcDocFrameAtom);

    return {
        tabSelected , 
        setTabSelected ,
        code , 
        setCode ,
        preview , 
        setPreview ,
        srcDoc
    }
}