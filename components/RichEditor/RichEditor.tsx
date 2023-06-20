import { FC, useId, useRef, memo, useEffect } from 'react';
import { Utils } from "@/utils";
import EditorJS, { OutputData , ToolConstructable , ToolSettings } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Embed from '@editorjs/embed';
import Table from '@editorjs/table';
import List from '@editorjs/list';
import Code from '@editorjs/code';
import InlineCode from '@editorjs/inline-code';
import ImageTool from '@editorjs/image';

type EditorTools = {
    [toolName: string]: ToolConstructable|ToolSettings;
}
const EDITOR_TOOLS : EditorTools = {
    header: Header,
    image: {
        class: ImageTool,
        config: {
            uploader: {
                async uploadByFile(file: File) {
                    return {
                        success: 1,
                        file: {
                            url:  await Utils.returnBase64FromFile(file),
                        },
                    }
                },
            },
        },
    },
    list: List,
    code: Code,
    inlineCode: InlineCode,
    table: Table,
    embed: Embed,
}


type RichEditorProps = {
    initialData : OutputData | undefined ,
    onEditorChange : (data : OutputData | undefined ) => void ,
    placeholder ?: string ,
    className ?: string
}

const RichEditor: FC<RichEditorProps> = ({ 
    initialData , 
    onEditorChange , 
    placeholder = 'Insert text here...' , 
    className = 'min-h-[50px]'
}) => {

    const editorId = useId();
    const ref = useRef<EditorJS>();

    useEffect(() => {
        //initialize editor if we don't have a reference
        if (!ref.current) {
            const editor = new EditorJS({
                holder: editorId,
                async onChange() {
                    const outputData = await ref.current?.save();
                    onEditorChange(outputData);
                },
                placeholder: placeholder,
                inlineToolbar: true,
                data: initialData ,
                tools: EDITOR_TOOLS ,
            })

            ref.current = editor
        }
    
        //add a return function handle cleanup
        return () => {
          if (ref.current && ref.current.destroy) ref.current.destroy();
        };
      }, []);

    return (
        <div id={editorId} className={className} />
    );
}

export default memo(RichEditor);

