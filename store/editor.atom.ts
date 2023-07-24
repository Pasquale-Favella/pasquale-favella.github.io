import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { focusAtom } from 'jotai-optics'
import { EDITOR_INITIALS } from '@/config/constants';

export type EditorStateKey = "js" | "css" | "html";

export type CodeState = {
  name: string,
  language: string,
  value: string
}

export type LangState = Record<EditorStateKey, CodeState>;

export type EditorState = {
    state : LangState ,
    selected : EditorStateKey ,
    previewMode : boolean
}

export const editorAtom = atomWithStorage<EditorState>(
    'editor',
    {
        state : {
            js: {
                name: 'script.js',
                language: 'javascript',
                value: EDITOR_INITIALS.jsInitialValue
              },
              css: {
                name: 'style.css',
                language: 'css',
                value: EDITOR_INITIALS.cssInitialValue
              },
              html: {
                name: 'index.html',
                language: 'html',
                value: EDITOR_INITIALS.htmlInitialValue
              },
        },
        selected : 'html',
        previewMode : false
    }
);

export const editorStateAtom = focusAtom(editorAtom, (optic) => optic.prop('state'));
export const previewEditorAtom = focusAtom(editorAtom, (optic) => optic.prop('previewMode'));
export const selectedEditorAtom = focusAtom(editorAtom, (optic) => optic.prop('selected'));

export const currentEditingAtom = atom(
    get => {
        const selectedTab = get(selectedEditorAtom);
        return get(editorStateAtom)[selectedTab];
    },
    (get , set , value : string)=>{
        const selectedTab = get(selectedEditorAtom);
        const state = get(editorStateAtom);
        const updatedState = {
            ...state , 
            [selectedTab] : {...state[selectedTab] , value}
        };
        set(editorStateAtom , updatedState);
    }
);

export const srcDocFrameAtom = atom(
    get => {
        const { html , css , js } = get(editorStateAtom)
        return `
            <html>
                <body>${html.value}</body>
                <style>${css.value}</style>
                <script>${js.value}</script>
            </html>
        `
    }
);