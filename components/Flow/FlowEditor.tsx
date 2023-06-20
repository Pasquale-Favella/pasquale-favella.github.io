import { FC, useId, useRef, useCallback, useState, useEffect } from 'react';
import useFlow from '@/hooks/use-flow';
import { useAtom } from 'jotai';
import EditorJS from '@editorjs/editorjs';

const importEditorDeps = async () => {
    const EditorJS = (await import('@editorjs/editorjs')).default
    const Header = (await import('@editorjs/header')).default
    const Embed = (await import('@editorjs/embed')).default
    const Table = (await import('@editorjs/table')).default
    const List = (await import('@editorjs/list')).default
    const Code = (await import('@editorjs/code')).default
    const InlineCode = (await import('@editorjs/inline-code')).default
    const ImageTool = (await import('@editorjs/image')).default

    return {
        EditorJS,
        Header,
        Embed,
        Table,
        List,
        Code,
        InlineCode,
        ImageTool
    }
}


type FlowEditorProps = {
    nodeId: string
}

const FlowEditor: FC<FlowEditorProps> = ({ nodeId }) => {
    const { getNodeIdAtom } = useFlow();
    const nodeIdAtom = getNodeIdAtom(nodeId);
    const [node, updateNode] = useAtom(nodeIdAtom);
    const editorId = useId();
    const ref = useRef<EditorJS>();
    const [isMounted, setIsMounted] = useState<boolean>(false);

    const initializeEditor = useCallback(async () => {
        const {
            EditorJS,
            Header,
            Embed,
            Table,
            List,
            Code,
            InlineCode,
            ImageTool
        } = await importEditorDeps();

        if (!ref.current) {
            const editor = new EditorJS({
                holder: editorId,
                async onChange(api) {
                    const body = await api.saver.save()
                    updateNode({ body })
                },
                onReady() {
                    ref.current = editor
                },
                placeholder: 'Type here to begin your flow...',
                inlineToolbar: true,
                data: node?.data.body,
                tools: {
                    header: Header,
                    image: {
                        class: ImageTool,
                        config: {
                            uploader: {
                                async uploadByFile(file: File) {
                                    return {
                                        success: 1,
                                        file: {
                                            url: URL.createObjectURL(file),
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
                },
            })
        }
    }, [])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMounted(true)
        }
    }, [])

    useEffect(() => {
        const init = async () => await initializeEditor();

        if (isMounted) init();

        return () => {
            ref.current?.destroy()
            ref.current = undefined
        }
    }, [isMounted, initializeEditor]);

    return (
        <div id={editorId} className='min-h-[100px]' />
    );
}

export default FlowEditor;

