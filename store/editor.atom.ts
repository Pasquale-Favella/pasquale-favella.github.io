import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type EditorStateKey = "js" | "css" | "html";

export type CodeState = {
  name: string;
  language: string;
  value: string;
};

export type LangState = Record<EditorStateKey, CodeState>;

type EditorState = {
  state: LangState;
  selected: EditorStateKey;
  previewMode: boolean;
  sidebarCollapsed: boolean;
};

const EDITOR_INITIALS = {
  htmlInitialValue: `<div class="hello">Hello, world!</div>
<button id="color-button">Change Color</button>`,
  cssInitialValue: `.hello {
  font-size: 5rem;
  font-weight: bold;
  text-align: center;
  color: white;
  background-color: blue;
  border-radius: 0.5rem;
  padding: 1rem;
  position: relative;
  animation: slidein 1s ease-out forwards;
}

@keyframes slidein {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

button {
  display: block;
  margin: 1rem auto;
  padding: 1rem;
  font-size: 1rem;
  background-color: white;
  border: 1px solid black;
  border-radius: 0.5rem;
  cursor: pointer;
}`,
  jsInitialValue: `const hello = document.querySelector('.hello');
const colorButton = document.querySelector('#color-button');
colorButton.addEventListener('click', () => {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);
  const color = "rgb(" + red + "," + green + "," + blue + ")";
  hello.style.backgroundColor = color;
});`
};

export const editorAtom = atomWithStorage<EditorState>('editor', {
  state: {
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
    }
  },
  selected: 'html',
  previewMode: false,
  sidebarCollapsed: false
});

export const editorStateAtom = atom(
  (get) => get(editorAtom).state,
  (get, set, newState: LangState) => set(editorAtom, { ...get(editorAtom), state: newState })
);

export const previewEditorAtom = atom(
  (get) => get(editorAtom).previewMode,
  (get, set, newMode: boolean) => set(editorAtom, { ...get(editorAtom), previewMode: newMode })
);

export const selectedEditorAtom = atom(
  (get) => get(editorAtom).selected,
  (get, set, newSelected: EditorStateKey) => set(editorAtom, { ...get(editorAtom), selected: newSelected })
);

export const sidebarCollapsedAtom = atom(
  (get) => get(editorAtom).sidebarCollapsed,
  (get, set, newCollapsed: boolean) => set(editorAtom, { ...get(editorAtom), sidebarCollapsed: newCollapsed })
);

export const currentEditingAtom = atom(
  (get) => {
    const selectedTab = get(selectedEditorAtom);
    return get(editorStateAtom)[selectedTab];
  },
  (get, set, value: string) => {
    const selectedTab = get(selectedEditorAtom);
    const state = get(editorStateAtom);
    const updatedState = {
      ...state,
      [selectedTab]: { ...state[selectedTab], value }
    };
    set(editorStateAtom, updatedState);
  }
);

export const srcDocFrameAtom = atom((get) => {
  const { html, css, js } = get(editorStateAtom);
  return `
    <html>
      <body>${html.value}</body>
      <style>${css.value}</style>
      <script>${js.value}</script>
    </html>
  `;
});
